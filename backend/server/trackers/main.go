package trackers

import (
	"errors"
	"fmt"
	"net/http"
	"path/filepath"
	"server/backend/db"
	"server/backend/debug"
	"server/backend/flags"
	"server/backend/internals"
	"server/backend/server"
	"server/backend/utils"

	"dario.cat/mergo"
	"github.com/go-playground/validator/v10"
)

type DataComparable[Data any] interface {
	New(requestData Data) Data
}

type CreateTrackerRouteOption struct {
	Name       string
	DbFileName string
}

type CreateTrackerDataFn[Data any] func(incomingData *Data) (entryId, rawData string, anyError error)

const (
	ERR_INVALID_METHOD             = "the duck ritual requires a %s request, you current send a %s request"
	ERR_MISSING_PARAM              = "the duck ritual needs another parameter to continue, which should be here: %s"
	ERR_DB_UPDATE_ERROR            = "duck has exploded while doing the duck ritual: %v"
	ERR_DB_MISSING_ENTRY           = "the duck ritual could not continue because entry with id \"%v\" not found in the collection."
	ERR_DB_DELETE_ENTRY            = "black magic could not banish this entry and the duck ritual was failed to remove it due to: %v"
	ERR_FAILED_TO_PARSE_REQUEST    = "you've used a wrong spell for this duck ritual: %v, the duck ritual requires a JSON request"
	ERR_FAILED_TO_MERGE_ENTRY_DATA = "the duck ritual requires more data to continue: %v"
	ERR_FAILED_TO_PARSE_JSON       = "someone has messed up the duck ritual: %v (this really shouldn't happen, try checking the database to see any malformed entries)"

	SUCC_ENTRY_DELETED = "the duck has finished their ritual, the entry has been casted away"
)

// soft-reference to a minecraft achievement
func returnToSender(res http.ResponseWriter, expectedRequest string, got string) {
	server.ResponseInText(
		res,
		http.StatusMethodNotAllowed,
		fmt.Sprintf(ERR_INVALID_METHOD, expectedRequest, got),
	)
}

func lostInTransport(res http.ResponseWriter, expectedQuery string) {
	server.ResponseInText(
		res,
		http.StatusForbidden,
		fmt.Sprintf(ERR_MISSING_PARAM, expectedQuery),
	)
}

func ejectAndAbandon(res http.ResponseWriter, errorCode string, additionalError error) {
	statusCode := 0
	switch errorCode {
	case ERR_FAILED_TO_PARSE_REQUEST:
	case ERR_MISSING_PARAM:
		statusCode = http.StatusBadRequest
	case ERR_FAILED_TO_MERGE_ENTRY_DATA:
	case ERR_FAILED_TO_PARSE_JSON:
	case ERR_DB_UPDATE_ERROR:
	case ERR_DB_MISSING_ENTRY:
	case ERR_DB_DELETE_ENTRY:
		statusCode = http.StatusInternalServerError
	default:
		if flags.DEBUG_MODE {
			panic("case not handled: " + errorCode)
		}
	}

	server.ResponseInText(
		res,
		statusCode,
		fmt.Sprintf(ERR_FAILED_TO_PARSE_REQUEST, additionalError),
	)
}

func CreateTrackerRoute[Data any](
	createData CreateTrackerDataFn[Data],
	options CreateTrackerRouteOption,
) server.RouteCloseFn {
	if flags.DEBUG_MODE {
		debug.InfoLabelf("trackers", "creating new tracker route for name: \"%s\" with options: %#v", options.Name, options)
	}

	dbStore := db.New(filepath.Join(internals.DATA_DIRECTORY, options.DbFileName))
	validate := validator.New()

	// in here, I shall not pratice the chaos of writing "good" backend-code

	GET_ALL_ENTRIES := fmt.Sprintf("/duck_api/%s/gimme_all", options.Name)
	ADD_ENTRY := fmt.Sprintf("/duck_api/%s/add_this", options.Name)
	UPDATE_ENTRY := fmt.Sprintf("/duck_api/%s/update_this/{id}", options.Name)
	DELETE_ENTRY := fmt.Sprintf("/duck_api/%s/yeet_this/{id}", options.Name)

	server.Register(GET_ALL_ENTRIES, func(res http.ResponseWriter, req *http.Request) {
		if req.Method != "GET" {
			returnToSender(res, "GET", req.Method)
			return
		}

		server.ResponseInText(res, http.StatusOK, dbStore.ValuesAsStringFast())
	})

	server.Register(ADD_ENTRY, func(res http.ResponseWriter, req *http.Request) {
		if req.Method != "POST" {
			returnToSender(res, "POST", req.Method)
			return
		}

		requestData, err := server.ReadRequestInJson[Data](req)
		if err != nil {
			ejectAndAbandon(res, ERR_FAILED_TO_PARSE_REQUEST, err)
			return
		}

		if err := validate.Struct(requestData); err != nil {
			ejectAndAbandon(res, ERR_FAILED_TO_MERGE_ENTRY_DATA, err)
			return
		}

		entryId, rawData, err := createData(requestData)

		if err = dbStore.Put(entryId, []byte(rawData)); err != nil {
			if flags.DEBUG_MODE {
				debug.InfoLabelf("trackers", "failed to create entry data for \"%s\": %v", options.Name, err)
			}
			ejectAndAbandon(res, ERR_DB_UPDATE_ERROR, err)
			return
		}

		server.ResponseInText(res, http.StatusCreated, rawData)
	})

	server.Register(UPDATE_ENTRY, func(res http.ResponseWriter, req *http.Request) {
		if req.Method != "PATCH" {
			returnToSender(res, "PATCH", req.Method)
			return
		}

		entryId := req.PathValue("id")
		if entryId == "" {
			lostInTransport(res, UPDATE_ENTRY+"/[insert entry id here]")
			return
		}

		requestData, err := server.ReadRequestInJson[Data](req)
		if err != nil {
			ejectAndAbandon(res, ERR_FAILED_TO_PARSE_REQUEST, err)
			return
		}

		rawData, okay := dbStore.GetString(entryId)
		if !okay {
			ejectAndAbandon(res, ERR_DB_MISSING_ENTRY, errors.New(entryId))
			return
		}

		existingData, err := utils.ParseJsonString[Data](rawData)
		if err != nil {
			ejectAndAbandon(res, ERR_FAILED_TO_PARSE_JSON, err)
			return
		}

		if err := mergo.Merge(&existingData, requestData, mergo.WithOverride); err != nil {
			ejectAndAbandon(res, ERR_FAILED_TO_MERGE_ENTRY_DATA, err)
			return
		}

		// oh my god I'm going to get sick of "if err != nil"...
		newRawData := utils.StringifyJson(existingData)
		if err := dbStore.Put(entryId, []byte(newRawData)); err != nil {
			ejectAndAbandon(res, ERR_DB_UPDATE_ERROR, err)
			return
		}

		server.ResponseInText(res, http.StatusOK, newRawData)
	})

	server.Register(DELETE_ENTRY, func(res http.ResponseWriter, req *http.Request) {
		if req.Method != "DELETE" {
			returnToSender(res, "DELETE", req.Method)
			return
		}

		entryId := req.PathValue("id")
		if entryId == "" {
			lostInTransport(res, DELETE_ENTRY+"/[insert entry id here]")
			return
		}

		if err := dbStore.Delete(entryId); err != nil {
			ejectAndAbandon(res, ERR_DB_DELETE_ENTRY, err)
			return
		}

		server.ResponseInText(res, http.StatusOK, SUCC_ENTRY_DELETED)
	})

	return func() {
		dbStore.Close()
	}
}

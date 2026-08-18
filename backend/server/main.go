package server

import (
	"encoding/json"
	"fmt"
	"net/http"
	"server/backend/debug"
	"server/backend/flags"
)

type RouteCloseFn func()

type JSON map[string]any

// Reads a JSON request body into the provided Go variable `out`.
// It returns an error if the decoding fails.
func ReadRequestInJson[T any](request *http.Request) (*T, error) {
	var out T
	err := json.NewDecoder(request.Body).Decode(&out)
	return &out, err
}

// Sends a JSON response to the client with the specified HTTP status code.
func ResponseInJson(res http.ResponseWriter, status int, jsonData JSON) {
	if status >= 400 {
		jsonString, _ := json.Marshal(jsonData)
		http.Error(res, string(jsonString), status)
		return
	}
	res.Header().Set("Content-Type", "application/json")
	json.NewEncoder(res).Encode(jsonData)
}

func ResponseInText(res http.ResponseWriter, statusCode int, data string) {
	res.WriteHeader(statusCode)
	res.Header().Set("Content-Type", "text/plain; charset=utf-8")
	res.Write([]byte(data))
	if flags.DEBUG_MODE {
		debug.InfoLabelf("server", "response with: %s - %s", debug.FormatNumber(statusCode), fmt.Sprintf("%.30s", data))
	}
}

func ResponseSuccess(res http.ResponseWriter) {
	ResponseInText(res, 200, "ok")
}

func Register(route string, routeHandler http.HandlerFunc) {
	if flags.DEBUG_MODE {
		// if you haven't figure it out yet, yes, it's a reference to Forge/Neoforge early loading screen.
		debug.InfoLabelf("server", "REGISTERING %s", debug.FormatPath(route))
	}

	http.Handle(route, http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		// make sure I hate CORS in deverlopment mode
		if flags.DEV_MODE {
			if flags.DEBUG_MODE {
				debug.InfoLabelf("server", "the duck shall cast their spell to wipe CORS out of %s", debug.FormatPath(req.URL.Path))
			}
			res.Header().Set("Access-Control-Allow-Origin", "*")
			res.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS")
			res.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			// no idea why the client send a OPTIONS request, maybe
			// "I'll poke the server to see what this respond"?
			if req.Method == "OPTIONS" {
				ResponseInText(res, http.StatusNoContent, "I got ya")
				return // skip
			}
		}
		routeHandler(res, req)
	}))
}

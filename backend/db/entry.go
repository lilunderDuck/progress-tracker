package db

import (
	"errors"
	"fmt"
	"server/backend/debug"
	"server/backend/flags"
	"strconv"
	"strings"
)

type Action string

var (
	ActionPut    Action = "SET"
	ActionDelete Action = "DEL"
)

var (
	ErrCannotDecodeElement = errors.New("failed to decode element")
	ErrBadLine             = errors.New("bad line")
)

type Entry struct {
	Action Action
	Key    string
	Value  []byte
}

const ENTRY_SEPERATOR = "■"

func (e *Entry) toLine() []byte {
	keyLen := fmt.Sprintf("%04d", len(e.Key))
	valLen := fmt.Sprintf("%06d", len(e.Value))

	// Format: ACTION KEY_LEN VAL_LEN KEY VALUE\n
	return fmt.Appendf(nil, "%s %s %s %s %s\n", e.Action, keyLen, valLen, e.Key, string(e.Value))
}

func newEntry(action Action, key string, value []byte) *Entry {
	return &Entry{
		Action: action,
		Key:    key,
		Value:  value,
	}
}

func newBulkEntries(action Action, keyValues map[string][]byte) []*Entry {
	var entries []*Entry
	for k, v := range keyValues {
		entries = append(entries, &Entry{
			Action: action,
			Key:    k,
			Value:  v,
		})
	}
	return entries
}

func newEntryFromLine(line string) (*Entry, error) {
	line = strings.ReplaceAll(line, "\x00", "")
	line = strings.TrimRight(line, "\r\n")

	parts := strings.SplitN(line, " ", 4)
	if len(parts) < 4 {
		if flags.DEBUG_MODE {
			debug.ErrLabelf("gdstore", "failed to parse entry, invalid format")
		}
		return nil, ErrBadLine
	}

	action := Action(parts[0])

	keyLen, err := strconv.Atoi(parts[1])
	if err != nil {
		if flags.DEBUG_MODE {
			debug.ErrLabelf("gdstore", "failed to parse key length:\n%v", err)
		}
		return nil, ErrBadLine
	}

	valLen, err := strconv.Atoi(parts[2])
	if err != nil {
		if flags.DEBUG_MODE {
			debug.ErrLabelf("gdstore", "failed to parse value length:\n%v", err)
		}
		return nil, ErrBadLine
	}

	rest := parts[3]

	// 3. Extract key based strictly on explicit keyLen
	if len(rest) < keyLen {
		return nil, ErrBadLine
	}
	key := rest[:keyLen]

	// 4. Extract value based on valLen after skipping the space separator
	var value []byte
	if len(rest) > keyLen {
		// Cut out the space between key and value
		valStr := strings.TrimPrefix(rest[keyLen:], " ")
		value = []byte(valStr)
	}

	if len(key) != keyLen {
		return nil, ErrBadLine
	}

	if len(value) != valLen {
		if flags.DEBUG_MODE {
			debug.ErrLabelf("gdstore", "mismatched length of entry value, expected %d, but got %d", valLen, len(value))
		}
		return nil, ErrBadLine
	}

	return &Entry{
		Action: action,
		Key:    key,
		Value:  value,
	}, nil
}

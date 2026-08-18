package routes

import (
	"io/fs"
	"net/http"
	"server/backend/debug"
	"server/backend/flags"
)

func AppAssetsRoute(publicFS fs.FS) {
	if !flags.DEV_MODE {
		http.Handle("/", http.FileServer(
			http.FS(publicFS),
		))
	} else {
		if flags.DEBUG_MODE {
			debug.InfoLabel("server", "app assets route is disabled in deverlopment mode.")
		}
	}
}

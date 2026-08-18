package main

import (
	"embed"
	"io/fs"
	"net/http"
	"server/backend/debug"
	"server/backend/flags"
	"server/backend/internals"
	"server/backend/server/routes"
	"server/backend/utils"
)

//go:embed build/dist/index.html build/dist/assets/*
var appAssets embed.FS

func main() {
	publicFS, err := fs.Sub(appAssets, "build/dist")
	if err != nil {
		panic(err)
	}

	utils.EnsureDirIsCreated(internals.DATA_DIRECTORY)
	server := &http.Server{Addr: ":34540"}

	routes.AppAssetsRoute(publicFS)
	routes.NativeRoute()
	animeTrackerCleanUpFn := routes.AnimeTrackerRoute()
	routes.NewHeartbeat().RegisterRouteAndStart(func() {
		animeTrackerCleanUpFn()
	})

	if !flags.DEV_MODE {
		utils.OpenBrowser(300, "http://localhost:34540")
	}

	if flags.DEBUG_MODE {
		debug.InfoLabelf("server", "local server starts running on port %s", server.Addr)
	}

	if err := server.ListenAndServe(); err != http.ErrServerClosed {
		if flags.DEBUG_MODE {
			debug.WarnLabelf("server", "%v", err)
		}
	}
}

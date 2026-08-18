package routes

import (
	"context"
	"net/http"
	"server/backend/debug"
	"server/backend/flags"
	"server/backend/server"
	"sync"
	"time"
)

const HEARTBEAT_CHECK_INTERVAL = 4 * time.Second
const HEARTBEAT_MAX_ELAPSE_TIME = 12 * time.Second

type Heartbeat struct {
	lastSeen      time.Time
	lastSeenMutex sync.Mutex
	server        *http.Server
}

func NewHeartbeat() *Heartbeat {
	return &Heartbeat{
		lastSeen:      time.Now(),
		lastSeenMutex: sync.Mutex{},
	}
}

func (this *Heartbeat) RegisterRouteAndStart(beforeShuttingDownFn server.RouteCloseFn) {
	server.Register("/duck_api/keep_duck_ritual_to_continue", func(res http.ResponseWriter, req *http.Request) {
		this.update()
		res.WriteHeader(http.StatusNoContent)
	})

	if flags.DEV_MODE {
		debug.InfoLabelf("heartbeat", "heartbeat system is disabled in deverlopment mode!")
		return
	}

	go func() {
		for {
			this.check(beforeShuttingDownFn)
		}
	}()
}

func (this *Heartbeat) update() {
	this.lastSeenMutex.Lock()
	this.lastSeen = time.Now()
	this.lastSeenMutex.Unlock()
}

func (this *Heartbeat) check(beforeShuttingDownFn server.RouteCloseFn) {
	time.Sleep(HEARTBEAT_CHECK_INTERVAL)
	this.lastSeenMutex.Lock()
	elapsed := time.Since(this.lastSeen)

	if flags.DEBUG_MODE {
		debug.InfoLabelf("heartbeat", "checking heartbeat from the otherside, last seen: %s seconds", debug.FormatFloatNumber(elapsed.Seconds()))
	}

	this.lastSeenMutex.Unlock()
	if elapsed > HEARTBEAT_MAX_ELAPSE_TIME {
		if flags.DEBUG_MODE {
			debug.InfoLabelf("heartbeat", "heartbeat stopped, shutting down the server now...")
		}
		beforeShuttingDownFn()
		_ = this.server.Shutdown(context.Background())
		return
	}
}

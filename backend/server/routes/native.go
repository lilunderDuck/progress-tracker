package routes

import (
	"fmt"
	"net/http"
	"server/backend/internals"
	"server/backend/server"
	"server/backend/utils"
)

type AppUsage struct {
	AllocatedMB   uint64  `json:"allocatedMB"`
	TotalHeapSize uint64  `json:"totalHeapSize"`
	CpuUsage      float64 `json:"cpuUsage"`
}

func NativeRoute() {
	server.Register("/duck_api/teleporter/open_saved_data_pocket", func(res http.ResponseWriter, req *http.Request) {
		err := utils.OpenExplorer(internals.DATA_DIRECTORY)
		if err != nil {
			server.ResponseInText(res, http.StatusInternalServerError, fmt.Sprintf("Your file path might be in another casle, but you can track it down via opening this path: \"%s\". The error is: %v", internals.DATA_DIRECTORY, err))
			return
		}
		server.ResponseInText(res, http.StatusOK, "duck ritural data has been leaked successfully")
	})
}

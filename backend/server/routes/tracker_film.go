package routes

import (
	"server/backend/server"
	"server/backend/server/trackers"
	"server/backend/utils"
)

type FilmEntryData struct {
	Name            string   `json:"name"                     validate:"required"`
	Id              string   `json:"id,omitempty"`
	PersonalRating  float64  `json:"personalRating,omitempty"`
	Notes           string   `json:"notes,omitempty"`
	CurrentProgress int      `json:"currentProgress,omitempty"`
	Score           float64  `json:"score,omitempty"`
	ScoreSrc        []string `json:"scoreSrc,omitempty"`
	ScoreNotes      []int    `json:"scoreNotes,omitempty"`
}

func FilmTrackerRoute() server.RouteCloseFn {
	closeFn := trackers.CreateTrackerRoute[ProgressEntryData](
		func(incomingData *ProgressEntryData) (entryId string, rawData string, anyError error) {
			entryId = utils.GenerateRandomHexId(10)
			incomingData.Id = entryId
			rawData = utils.StringifyJson(incomingData)
			return
		},
		trackers.CreateTrackerRouteOption{
			Name:       "film",
			DbFileName: "film.db",
		},
	)

	return closeFn
}

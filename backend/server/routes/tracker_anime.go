package routes

import (
	"server/backend/server"
	"server/backend/server/trackers"
	"server/backend/utils"
)

type ProgressEntryData struct {
	Name           string                `json:"name"                     validate:"required"`
	Category       ProgressEntryCategory `json:"category"`
	Id             string                `json:"id,omitempty"`
	PersonalRating float64               `json:"personalRating,omitempty"`
	Notes          string                `json:"notes,omitempty"`
}

type ProgressEntryCategory struct {
	Anime      ProgressEntryCategoryData `json:"anime,omitempty"`
	Manga      ProgressEntryCategoryData `json:"manga,omitempty"`
	LightNovel ProgressEntryCategoryData `json:"light_novel,omitempty"`
}

type ProgressEntryCategoryData struct {
	CurrentProgress int      `json:"currentProgress,omitempty"`
	Score           float64  `json:"score,omitempty"`
	ScoreSrc        []string `json:"scoreSrc,omitempty"`
	ScoreNotes      []int    `json:"scoreNotes,omitempty"`
}

const ENTRY_DATABASE_FILENAME = "anime.db"

func AnimeTrackerRoute() server.RouteCloseFn {
	closeFn := trackers.CreateTrackerRoute[ProgressEntryData](
		func(incomingData *ProgressEntryData) (entryId string, rawData string, anyError error) {
			entryId = utils.GenerateRandomHexId(10)
			incomingData.Id = entryId
			rawData = utils.StringifyJson(incomingData)
			return
		},
		trackers.CreateTrackerRouteOption{
			Name:  "anime",
			DbFileName: "anime.db",
		},
	)

	return closeFn
}

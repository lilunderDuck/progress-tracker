import { IEntryIncludedScore, Progress } from "../../../api"

export type AnimeTrackerCategory = 
  "anime" | 
  "manga" | 
  "light_novel"
// ...

export type AnimeCategoryData = {
  currentProgress?: Progress
} & IEntryIncludedScore<AnimeTrackerNote>

export type AnimeTrackerEntry = {
  name: string
  category: Partial<Record<AnimeTrackerCategory, AnimeCategoryData>>
  personalRating?: number
  notes?: string
  id: string
}

export const enum AnimeTrackerNote {
  INCLUDED_SPECIAL_EPS_SCORE = 1,
  MANGADEX_SCORE_ONLY = 2,
  MANGADEX_MISSING_CHAPTERS = 3,
  NOT_INCLUDED_SPECIAL_EPS_SCORE = 4,
  NOT_LIGHT_NOVEL = 5,
  SCORE_NOT_AVAILABLE = 6,
  SEASON_NO_SCORE = 7,
  USED_MAL_INSTEAD_OF_MANGADEX = 8,
  USED_SCORE_AVG_ANIME = 9,
  USED_SCORE_AVG_MANGA = 10,
  FROM_YT = 11,
  FROM_YT_BUT_NOT_FOUND = 12,
  LOCAL_ARCHIVE = 13,
  NOT_TRANSLATED_TO_EN = 14,
  ONE_SHOT = 15
}
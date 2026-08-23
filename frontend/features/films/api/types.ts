import { IEntryIncludedScore, IEntryIncludeProgress, Progress } from "../../../api"

export interface IFilmTrackerEntry extends IEntryIncludedScore, IEntryIncludeProgress {
  name: string
  id: string
  personalRating?: number
  notes?: string
}
export const enum Progress {
  COMPLETED = 1,
  CURRENT = 2,
  DROPPED = 3,
  NOT_SPECIFIED = 4,
  PAUSED = 5,
  PLANNING = 6,
  WAITING = 7,
} // do not reorder

export interface IEntryIncludedScore<T extends number = number> {
  score?: number
  scoreSrc?: string[]
  scoreNotes?: T[]
}

export const API_URL = `http://localhost:34540/duck_api`
export const HEARTBEAT_ROUTE = `${API_URL}/keep_duck_ritual_to_continue` as const
export const OPEN_DATA_STORED_LOCATION_ROUTE = `${API_URL}/teleporter/open_saved_data_pocket`
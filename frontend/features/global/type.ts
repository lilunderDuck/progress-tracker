export const enum ColumnOrdering {
  DEFAULT,
  RATING_WITH_PROGRESS
}

export interface ISettingData {
  hidePublicScores: boolean
  columnOrder: ColumnOrdering
  anime_showUndeterministicScore: boolean
  __dummyDiscard__$: any
}
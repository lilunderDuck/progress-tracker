import { IncompatibilityRuleRegistry } from "../../../components"
import { type AnimeTrackerCategory, AnimeTrackerNote } from "./types"

export const SCORE_NOTES_REGISTRY: Record<AnimeTrackerNote, {
  name$: string
  note$: string | null
  description$: string | null
}> = {
  [AnimeTrackerNote.USED_SCORE_AVG_ANIME]: {
    name$: "Anime score used averaging",
    note$: null,
    description$: "Score is calculated by taking the average of all anime seasons"
  },
  [AnimeTrackerNote.USED_SCORE_AVG_MANGA]: {
    name$: "Manga score used averaging",
    description$: "Score is calculated by taking the average of all manga versions",
    note$: null,
  },
  [AnimeTrackerNote.INCLUDED_SPECIAL_EPS_SCORE]: {
    name$: "Score included special episodes score",
    description$: "Calulated score *does* include the scores from special episodes (OVA, ...)",
    note$: null,
  },
  [AnimeTrackerNote.NOT_INCLUDED_SPECIAL_EPS_SCORE]: {
    name$: "Score did not include special episodes score",
    description$: "Calulated score *does not* include the scores from special episodes (OVA, ...)",
    note$: "Use this if you have entries with the same name but with 2 different progress status."
  },
  [AnimeTrackerNote.SEASON_NO_SCORE]: {
    name$: "There's no score yet for season [insert #season]",
    description$: "A season is currently not having the score, or/and its score for this season is \"not available\" on MAL.",
    note$: "There's likely that a new season might not be having a score in MAL. Make sure to recheck to update the score."
  },
  [AnimeTrackerNote.MANGADEX_SCORE_ONLY]: {
    name$: "Score is taken from mangadex",
    description$: "...since there's no rating on MAL. Note that Mangadex ratings tend to be inflated.",
    note$: "Use this if MAL listed the score as \"not available\""
  },
  [AnimeTrackerNote.USED_MAL_INSTEAD_OF_MANGADEX]: {
    name$: "Score is taken from MAL instead of mangadex",
    description$: null,
    note$: "This only for clearer clarification, if you include both of the MAL and mangadex url in the \"Provided sources\" section.",
  },
  [AnimeTrackerNote.NOT_LIGHT_NOVEL]: {
    name$: "Score is from a novel, not a light novel.",
    description$: "This is from a novel, but it have been grouped under '(L)N' for simplicity. (novel is mostly text only, light novel includes anime-style illustrations)",
    note$: "To simplify, the table grouped both of the \"novel\" and \"light novel\" into one column to make it cleaner. If an entry only exists the \"novel\" version, add this to clarify.",
  },
  [AnimeTrackerNote.SCORE_NOT_AVAILABLE]: {
    name$: "Score listed as \"not available\" on MAL",
    description$: null,
    note$: "If there's a page for this entry in MAL, but the score is \"N/A\", then add this.",
  },
  [AnimeTrackerNote.FROM_YT_BUT_NOT_FOUND]: {
    name$: "This used to be found on youtube",
    description$: "The playlist might be or has been set to private, or deleted due to many various reasons",
    note$: "This was found on youtube (via MuseAsia or some random channel), but now is impossible to find the full episodes",
  },
  [AnimeTrackerNote.FROM_YT]: {
    name$: "This can be found on youtube",
    description$: "You can find it by searching the name. Note that there's a small chance that some episode(s) are not available, youtube can be unpredictable sometimes",
    note$: "This can be found on youtube (via MuseAsia or some random channel) by searching the name",
  },
  [AnimeTrackerNote.LOCAL_ARCHIVE]: {
    name$: "Archived",
    description$: "\"I've made a full 100% local copy of this\"",
    note$: null,
  },
  [AnimeTrackerNote.NOT_TRANSLATED_TO_EN]: {
    name$: "There's no english version available",
    description$: "It's very hard/impossible to find the english translation for this",
    note$: null
  },
  [AnimeTrackerNote.MANGADEX_MISSING_CHAPTERS]: {
    name$: "Missing chapters in mangadex",
    description$: "Some of the chapters are not translated into english, or all chapters are being listed as \"This chapter is not available\"",
    note$: null
  },
  [AnimeTrackerNote.ONE_SHOT]: {
    name$: "This is a one-shot",
    description$: "(.statement) - basically a one chapter story only, and usually a short story.",
    note$: null
  }
}

export const SCORE_NOTES_CATEGORY_MAPPING: Record<AnimeTrackerCategory, AnimeTrackerNote[]> = {
  anime: [
    AnimeTrackerNote.INCLUDED_SPECIAL_EPS_SCORE,
    AnimeTrackerNote.NOT_INCLUDED_SPECIAL_EPS_SCORE,
    AnimeTrackerNote.USED_SCORE_AVG_ANIME,
    AnimeTrackerNote.SEASON_NO_SCORE,
    AnimeTrackerNote.SCORE_NOT_AVAILABLE,
    AnimeTrackerNote.FROM_YT,
    AnimeTrackerNote.FROM_YT_BUT_NOT_FOUND,
    AnimeTrackerNote.LOCAL_ARCHIVE,
    AnimeTrackerNote.NOT_TRANSLATED_TO_EN,
  ],
  manga: [
    AnimeTrackerNote.MANGADEX_SCORE_ONLY,
    AnimeTrackerNote.MANGADEX_MISSING_CHAPTERS,
    AnimeTrackerNote.USED_MAL_INSTEAD_OF_MANGADEX,
    AnimeTrackerNote.USED_SCORE_AVG_MANGA,
    AnimeTrackerNote.SCORE_NOT_AVAILABLE,
    AnimeTrackerNote.LOCAL_ARCHIVE,
    AnimeTrackerNote.NOT_TRANSLATED_TO_EN,
    AnimeTrackerNote.ONE_SHOT
  ],
  light_novel: [
    AnimeTrackerNote.NOT_LIGHT_NOVEL,
    AnimeTrackerNote.SCORE_NOT_AVAILABLE,
    AnimeTrackerNote.LOCAL_ARCHIVE,
    AnimeTrackerNote.NOT_TRANSLATED_TO_EN,
  ]
}

export const SCORE_NOTE_DISABLING_RULE_REGISTRY = [
  {
    ifInclude$: AnimeTrackerNote.INCLUDED_SPECIAL_EPS_SCORE,
    thenDisables$: [
      AnimeTrackerNote.NOT_INCLUDED_SPECIAL_EPS_SCORE,
      AnimeTrackerNote.SCORE_NOT_AVAILABLE
    ],
  },
  { 
    ifInclude$: AnimeTrackerNote.NOT_INCLUDED_SPECIAL_EPS_SCORE,
    thenDisables$: [
      AnimeTrackerNote.INCLUDED_SPECIAL_EPS_SCORE,
      AnimeTrackerNote.SCORE_NOT_AVAILABLE
    ],
  },
  {
    ifInclude$: AnimeTrackerNote.USED_SCORE_AVG_ANIME,
    thenDisables$: [
      AnimeTrackerNote.SCORE_NOT_AVAILABLE
    ]
  },
  {
    ifInclude$: AnimeTrackerNote.SEASON_NO_SCORE,
    thenDisables$: [
      AnimeTrackerNote.SCORE_NOT_AVAILABLE
    ]
  },
  {
    ifInclude$: AnimeTrackerNote.FROM_YT,
    thenDisables$: [
      AnimeTrackerNote.FROM_YT_BUT_NOT_FOUND
    ]
  },
  {
    ifInclude$: AnimeTrackerNote.FROM_YT_BUT_NOT_FOUND,
    thenDisables$: [
      AnimeTrackerNote.FROM_YT
    ]
  },
  {
    ifInclude$: AnimeTrackerNote.MANGADEX_SCORE_ONLY,
    thenDisables$: [
      AnimeTrackerNote.USED_MAL_INSTEAD_OF_MANGADEX
    ]
  },
  {
    ifInclude$: AnimeTrackerNote.USED_MAL_INSTEAD_OF_MANGADEX,
    thenDisables$: [
      AnimeTrackerNote.MANGADEX_SCORE_ONLY
    ]
  },
  {
    ifInclude$: AnimeTrackerNote.SCORE_NOT_AVAILABLE,
    thenDisables$: [
      AnimeTrackerNote.INCLUDED_SPECIAL_EPS_SCORE,
      AnimeTrackerNote.NOT_INCLUDED_SPECIAL_EPS_SCORE,
      AnimeTrackerNote.USED_SCORE_AVG_ANIME,
      AnimeTrackerNote.MANGADEX_SCORE_ONLY,
      AnimeTrackerNote.USED_MAL_INSTEAD_OF_MANGADEX,
    ]
  }
] as IncompatibilityRuleRegistry<AnimeTrackerNote>

export const ALL_SCORE_NOTES_TYPE: AnimeTrackerNote[] = [
  AnimeTrackerNote.INCLUDED_SPECIAL_EPS_SCORE,
  AnimeTrackerNote.MANGADEX_SCORE_ONLY,
  AnimeTrackerNote.MANGADEX_MISSING_CHAPTERS,
  AnimeTrackerNote.NOT_INCLUDED_SPECIAL_EPS_SCORE,
  AnimeTrackerNote.NOT_LIGHT_NOVEL,
  AnimeTrackerNote.SCORE_NOT_AVAILABLE,
  AnimeTrackerNote.SEASON_NO_SCORE,
  AnimeTrackerNote.USED_MAL_INSTEAD_OF_MANGADEX,
  AnimeTrackerNote.USED_SCORE_AVG_ANIME,
  AnimeTrackerNote.USED_SCORE_AVG_MANGA,
  AnimeTrackerNote.FROM_YT,
  AnimeTrackerNote.FROM_YT_BUT_NOT_FOUND,
  AnimeTrackerNote.LOCAL_ARCHIVE,
  AnimeTrackerNote.NOT_TRANSLATED_TO_EN,
  AnimeTrackerNote.ONE_SHOT
] // inline Object.keys(SCORE_NOTES_REGISTRY)

export const ALL_ANIME_CATEGORY_TYPES: AnimeTrackerCategory[] = [
  "anime",
  "manga",
  "light_novel"
]

export const ANIME_CATEGORY_REGISTRY: Record<AnimeTrackerCategory, { 
  shortenedName$: string, 
  name$: string 
}> = {
  anime: {
    shortenedName$: "A",
    name$: "Anime"
  },
  manga: {
    shortenedName$: "M",
    name$: "Manga"
  },
  light_novel: {
    shortenedName$: "(L)N",
    name$: "(Light) novel"
  }
}
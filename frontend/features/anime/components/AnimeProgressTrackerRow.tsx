import { For, lazy, Show } from "solid-js"
// ...
import { css } from "molcss"
import "./AnimeProgressTrackerHead.css"
// ...
import { BaseTableRowComponentProps } from "../../../hook"
import { Dialog, ProgressTrackerProgressCell, ProgressTrackerScoreCell, ProgressTrackerUndeterministicScoreCell, Tooltip } from "../../../components"
import { useGlobalContext } from "../../global"
import { ALL_ANIME_CATEGORY_TYPES, AnimeTrackerEntry, AnimeTrackerNote } from "../api"

const row__root = css`
  display: flex;
  gap: 5px;
  & .entry__editButton {
    opacity: 0;
  }

  &:hover .entry__editButton {
    opacity: 1;
  }
`

const row__personalRatingScoreCell = css`
  place-items: center;
`

const row__notes = css`
  width: 100%;
  flex: 1;
  overflow: hidden;
  width: 100%;
  & p {
    padding-inline: 5px;
    user-select: none;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

const row__nameWrap = css`
  & > div {
    width: 250px;
  }
`

const row__name = css`
  max-width: 250px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  user-select: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

interface IAnimeProgressTrackerRowProps extends BaseTableRowComponentProps<AnimeTrackerEntry> {
  // ...
}

export function AnimeProgressTrackerRow(props: IAnimeProgressTrackerRowProps) {
  const { setting$ } = useGlobalContext()
  const AddEntryDialog = lazy(() => import("./dialog/add-entry/AddEntryDialog"))

  const isScoreNoteNotAvaliable = (scoreNote: AnimeTrackerNote[]) => {
    return scoreNote.includes(AnimeTrackerNote.SCORE_NOT_AVAILABLE)
  }

  const shouldShowUndeterministicScore = () => {
    const isMangaIncludingOneShot = props.category.manga?.scoreNotes?.includes(AnimeTrackerNote.ONE_SHOT) ?? false
    return isMangaIncludingOneShot && setting$().anime_showUndeterministicScore
  }

  return (
    <div class={row__root} id={`entry_${props.rowIndex$}`}>
      <div class={`table__extraLeftPadding ${row__nameWrap}`}>
        <Dialog
          dialogContent$={(dialogProps) => (
            <AddEntryDialog {...dialogProps} initialData$={props} />
          )}
        >
          <Tooltip label$="Click to update" placement$="right" anchorClass$={css`width: fit-content;`}>
            <p class={row__name}>
              {props.name}
            </p>
          </Tooltip>
        </Dialog>
      </div>

      <For each={ALL_ANIME_CATEGORY_TYPES}>
        {type => (
          <ProgressTrackerProgressCell
            name$={props.name}
            isReading$={type !== "anime"}
            currentProgress$={props.category[type]?.currentProgress}
            class={`${type == "anime" ? "table__extraLeftPadding" : undefined}`}
          />
        )}
      </For>

      <Show when={shouldShowUndeterministicScore()} fallback={
        <ProgressTrackerScoreCell
          score={props.personalRating}
          class={`${row__personalRatingScoreCell} table__extraLeftPadding`}
          isScoreNotAvaliable$={isScoreNoteNotAvaliable}
        />
      }>
        <ProgressTrackerUndeterministicScoreCell class={`${row__personalRatingScoreCell} table__extraLeftPadding`} />
      </Show>

      <Tooltip label$={props.notes} anchorClass$={row__notes}>
        <p class={`table__extraLeftPadding`}>
          {props.notes}
        </p>
      </Tooltip>
    </div>
  )
}
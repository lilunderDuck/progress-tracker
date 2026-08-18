import { For, lazy, Show } from "solid-js"
// ...
import { css } from "molcss"
import "./AnimeProgressTrackerHead.css"
// ...
import { BaseTableRowComponentProps } from "../../../hook"
import { Dialog, ProgressTrackerProgressCell, ProgressTrackerScoreCell, ProgressTrackerUndeterministicScoreCell, Tooltip } from "../../../components"
import AnimeScoreTooltipNote from "./AnimeScoreTooltipNote"
import { useSettingContext } from "../../global"
import { ALL_ANIME_CATEGORY_TYPES, AnimeTrackerEntry, AnimeTrackerNote } from "../api"

const row__root = css`
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
  height: 27px;
  padding-inline: 5px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
  const { setting$ } = useSettingContext()
  const AddEntryDialog = lazy(() => import("./dialog/add-entry/AddEntryDialog"))

  const isScoreNoteNotAvaliable = (scoreNote: AnimeTrackerNote[]) => {
    return scoreNote.includes(AnimeTrackerNote.SCORE_NOT_AVAILABLE)
  }

  const shouldShowUndeterministicScore = () => {
    const isMangaIncludingOneShot = props.category.manga?.scoreNotes?.includes(AnimeTrackerNote.ONE_SHOT) ?? false
    return isMangaIncludingOneShot && setting$().anime_showUndeterministicScore
  }

  return (
    <tr class={row__root} id={`entry_${props.rowIndex$}`}>
      <td class="table__extraLeftPadding">
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
      </td>

      <Show when={!setting$().hidePublicScores}>
        <For each={ALL_ANIME_CATEGORY_TYPES}>
          {type => {
            const categoryData = () => props.category[type]
            
            return (
              <ProgressTrackerScoreCell
                {...categoryData()}
                class={`${type == "anime" ? "table__extraLeftPadding" : undefined}`}
                tooltipContent$={<AnimeScoreTooltipNote {...categoryData()} />}
                isScoreNotAvaliable$={isScoreNoteNotAvaliable}
              />
            )
          }}
        </For>
      </Show>

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

      <td class="table__extraLeftPadding">
        <p class={row__notes}>
          {props.notes}
        </p>
      </td>
    </tr>
  )
}
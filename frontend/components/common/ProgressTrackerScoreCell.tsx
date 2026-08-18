import { type JSX, type ParentProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { IEntryIncludedScore } from "../../api"
import { Tooltip } from "../ui"

const tableRow__score = css`
  width: 40px;
  height: 27px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
  border-radius: 6px;
`

const tableRow__notesIndicator = css`
  &:hover {
    text-decoration: underline;
  }
`

const tableRow__scoreText = css`
  color: var(--crust);
`

interface IProgressTrackerScoreCellProps<T extends number> extends IEntryIncludedScore<T> {
  class?: string
  tooltipContent$?: JSX.Element
  isScoreNotAvaliable$: (scoreNotes: T[]) => boolean
}

export function ProgressTrackerScoreCell<T extends number>(props: IProgressTrackerScoreCellProps<T>) {
  const shouldNotDisplayTooltip = () => 
    // there's no provided scores and score notes
    (!props.scoreSrc && !props.scoreNotes) || 
    // or provided scores and score notes left empty
    (props.scoreSrc?.length == 0 && props.scoreNotes?.length == 0)
  // ...

  const TooltipWrapper = (thisProps: ParentProps) => shouldNotDisplayTooltip() ? 
    <>{thisProps.children}</> :
    <Tooltip outlineColor$={getScoreColor()} placement$="right" label$={(
      props.tooltipContent$
    )}>
      {thisProps.children}
    </Tooltip>
  // ...

  const getScoreColor = () => getScoreBackgroundColor(
    props.isScoreNotAvaliable$(props.scoreNotes ?? []) ? -1 : props.score
  )

  const getTextColor = () => {
    const shouldTurnTextToBlack = props.score || props.isScoreNotAvaliable$(props.scoreNotes ?? [])
    return shouldTurnTextToBlack ? tableRow__scoreText : "" // white
  }

  return (
    <td class={props.class ?? ""}>
      <TooltipWrapper>
        <div
          class={`${tableRow__score} ${getTextColor()} ${shouldNotDisplayTooltip() ? "" : tableRow__notesIndicator}`}
          style={`background-color:${getScoreColor()}`}
        >
          {props.isScoreNotAvaliable$(props.scoreNotes ?? []) ? "N/A" : props.score}
        </div>
      </TooltipWrapper>
    </td>
  )
}

export function ProgressTrackerUndeterministicScoreCell(props: { class?: string }) {
  return (
    <td class={props.class ?? ""}>
      <Tooltip label$="Undeterministic score" outlineColor$="var(--lavender)">
        <div
          class={`${tableRow__score} ${tableRow__scoreText} ${tableRow__notesIndicator}`}
          style={`background-color:${getScoreBackgroundColor(-1)}`}
        >
          U/D
        </div>
      </Tooltip>
    </td>
  )
}

export function getScoreBackgroundColor(score?: number) {
  if (score === undefined) return "var(--surface0)"
  if (score === -1) return "var(--lavender)"
  if (score < 4) return "var(--red)"
  if (score < 5) return "var(--maroon)"
  if (score < 6) return "var(--peach)"
  if (score < 7) return "var(--yellow)"
  if (score < 8) return "var(--sky)"
  if (score < 9) return "var(--teal)"
  return "var(--green)"
}
import { css } from "molcss"
import { Progress, PROGRESS_TYPE_REGISTRY } from "../../api"

const progress__tag = css`
  text-align: left;
  background-color: var(--progress-tag-color);
  color: var(--crust);
  width: 60px;
  height: 27px;
  user-select: none;
  position: relative;
  display: flex;
  justify-content: center;
  padding-inline: 5px;
  border-radius: 6px;
`

export function ProgressTrackerProgressCell(props: { 
  currentProgress$?: Progress
  name$: string
  isReading$: boolean
  class?: string
}) {
  const currentProgress = () => props.currentProgress$ ?? Progress.NOT_SPECIFIED

  console.assert(
    PROGRESS_TYPE_REGISTRY[currentProgress()] !== undefined,
    `invalid progress type or not exist in the mapping/registry: "${props.currentProgress$}"`
  )

  const displayedProgressName = () => {
    const progress = currentProgress()
    if (progress === Progress.CURRENT) {
      return props.isReading$ ? "read" : "watch"
    }

    return PROGRESS_TYPE_REGISTRY[currentProgress()].shortenedName$
  }

  return (
    <td class={props.class}>
      <div 
        style={`--progress-tag-color:${PROGRESS_TYPE_REGISTRY[currentProgress()].color$}`}
        class={progress__tag}
      >
        {displayedProgressName()}
      </div>
    </td>
  )
}
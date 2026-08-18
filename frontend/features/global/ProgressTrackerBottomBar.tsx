import { css } from "molcss"
import { BsCaretRightFill } from "solid-icons/bs"
import { KeyIndicator, Tooltip } from "../../components"
import { ParentProps } from "solid-js"

const bottomBar_root = css`
  width: 100%;
  height: 30px;
  user-select: none;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  background-color: var(--crust);
`

const bottomBar_trackerText = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  background-color: var(--sky);
  height: 30px;
  color: var(--crust);
  padding-inline: 10px;
`

const bottomBar_currentlyOpenedIndicator = css`
  display: flex;
  align-items: center;
  width: 10rem;
  gap: 10px;
  height: 30px;
  flex-shrink: 0;
  background-color: var(--surface0);
  padding-inline: 10px;
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
`

export function ProgressTrackerBottomBar(props: ParentProps) {
  return (
    <div class={bottomBar_root}>
      <div class={bottomBar_trackerText}>tracker</div>
      <Tooltip label$="Click to open other trackers">
        <div class={bottomBar_currentlyOpenedIndicator}>
          <BsCaretRightFill />
          anime
        </div>
      </Tooltip>
      <div id="bottom-bar" class={css`width: 100%;`} />
      {props.children}
    </div>
  )
}
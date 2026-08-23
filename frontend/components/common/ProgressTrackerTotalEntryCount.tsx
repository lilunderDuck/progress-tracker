import { Portal } from "solid-js/web"
import { ProgressTrackerTableHandler } from "../../hook"
import { css } from "molcss"

export function ProgressTrackerTotalEntryCount(props: { handler$: ProgressTrackerTableHandler<any> }) {
  const entryWord = () => props.handler$.entriesData$().length > 1 ? "entries": "entry"

  console.assert(
    document.getElementById("bottom-bar") !== null, 
    "Tries to mount <ProgressTrackerTotalEntryCount /> into the bottom bar, but element with id does not found. Did you change the element id?"
  )

  return (
    <Portal mount={document.getElementById("bottom-bar")!}>
      <p class={css`padding-inline: 10px;`}>
        Showing {props.handler$.entriesData$().length} {entryWord()}
      </p>
    </Portal>
  )
}
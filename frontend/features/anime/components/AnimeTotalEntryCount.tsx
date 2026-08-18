import { css } from "molcss";
import { Portal } from "solid-js/web";
import { useAnimeProgressTrackerContext } from "../provider";

export function AnimeTotalEntryCount() {
  const { handler$ } = useAnimeProgressTrackerContext()
  const entryWord = () => handler$.entriesData$().length > 1 ? "entries": "entry"

  return (
    <Portal mount={document.getElementById("bottom-bar")!}>
      <p class={css`padding-inline: 10px;`}>
        Showing {handler$.entriesData$().length} {entryWord()}
      </p>
    </Portal>
  )
}
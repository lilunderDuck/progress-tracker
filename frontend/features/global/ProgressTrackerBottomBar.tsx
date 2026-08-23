import { css } from "molcss"
import { BsCaretRightFill } from "solid-icons/bs"
import { Dialog, KeyIndicator, Tooltip } from "../../components"
import { createSignal, lazy, ParentProps } from "solid-js"
import { useGlobalContext } from "./GlobalProvider"

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
  &:hover {
    text-decoration: underline;
  }
`

export function ProgressTrackerBottomBar(props: ParentProps) {
  const { PROGRESS_TRACKER_NAME_REGISTRY$, currentPage$ } = useGlobalContext()

  const ProgressTrackerMenuDialog = lazy(() => import("./ProgressTrackerMenuDialog"))

  const [isShowingMenu, setIsShowingMenu] = createSignal(false)
  document.addEventListener("keyup", (keyboardEvent) => {
    if (keyboardEvent.key === "/") {
      setIsShowingMenu(prev => !prev)
    }
  })
  
  return (
    <div class={bottomBar_root}>
      <div class={bottomBar_trackerText}>tracker</div>
      <Dialog dialogContent$={ProgressTrackerMenuDialog} defaultOpened$={isShowingMenu()}>
        <Tooltip label$="Click to open other trackers">
          <div class={bottomBar_currentlyOpenedIndicator}>
            <BsCaretRightFill />
            {PROGRESS_TRACKER_NAME_REGISTRY$[currentPage$()]}
          </div>
        </Tooltip>
      </Dialog>
      <div id="bottom-bar" class={css`width: 100%;`} />
      {props.children}
    </div>
  )
}
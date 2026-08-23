import { For, Match, Switch } from "solid-js"
// ...
import { ProgressTrackerBottomBar, ServerStatusIndicator, useGlobalContext } from "./features/global"

export default function App() {
  const { currentPage$, PROGRESS_TRACKER_PAGES_REGISTRY$ } = useGlobalContext()

  return (
    <>
      <Switch>
        <For each={PROGRESS_TRACKER_PAGES_REGISTRY$}>
          {([currentPage, PageComponent]) => (
            <Match when={currentPage === currentPage$()}>
              <PageComponent />
            </Match>
          )}
        </For>
      </Switch>
      
      <ProgressTrackerBottomBar>
        <ServerStatusIndicator />
      </ProgressTrackerBottomBar>
    </>
  )
}
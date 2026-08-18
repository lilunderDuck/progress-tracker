import { AnimeProgressTrackerTableHeader, AnimeTotalEntryCount } from "../components"
import { AnimeProgressTrackerProvider, useAnimeProgressTrackerContext } from "../provider"
import { ProgressTrackerPlaceholderView } from "../../../components"

export default function AnimeProgressTrackerTableTab() {
  const Wrapper = () => {
    const { handler$ } = useAnimeProgressTrackerContext()

    return (
      <>
        <AnimeProgressTrackerTableHeader />
        <AnimeTotalEntryCount />
        <ProgressTrackerPlaceholderView handler$={handler$}>
          <handler$.TableRoot$>
            <handler$.TableRows$ />
          </handler$.TableRoot$>
        </ProgressTrackerPlaceholderView>
      </>
    )
  }

  return (
    <AnimeProgressTrackerProvider>
      <Wrapper />
    </AnimeProgressTrackerProvider>
  )
}
// import { FilmProgressTrackerTableHeader, AnimeTotalEntryCount } from "../components"
import { FilmProgressTrackerProvider, useFilmProgressTrackerContext } from "../provider"
import { ProgressTrackerPlaceholderView, ProgressTrackerTableHeader, ProgressTrackerTotalEntryCount } from "../../../components"

export default function FilmProgressTrackerTableTab() {
  const Wrapper = () => {
    const { handler$ } = useFilmProgressTrackerContext()

    return (
      <>
        <ProgressTrackerTableHeader 
          contextFn$={useFilmProgressTrackerContext}
          AddEntryDialogComponent$={() => <></>}
        />
        <ProgressTrackerTotalEntryCount handler$={handler$} />
        <ProgressTrackerPlaceholderView handler$={handler$}>
          <handler$.TableRoot$>
            <handler$.TableRows$ />
          </handler$.TableRoot$>
        </ProgressTrackerPlaceholderView>
      </>
    )
  }

  return (
    <FilmProgressTrackerProvider>
      <Wrapper />
    </FilmProgressTrackerProvider>
  )
}
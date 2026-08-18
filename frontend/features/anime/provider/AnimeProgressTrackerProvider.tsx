import { createContext, type ParentProps, useContext } from "solid-js"
import { createProgressTrackerTable, ProgressTrackerTableHandler } from "../../../hook"
import { Progress } from "../../../api"
import { AnimeProgressTrackerHead, AnimeProgressTrackerRow } from "../components"
import { AnimeTrackerEntry } from "../api"

interface IProgressTrackerContext {
  handler$: ProgressTrackerTableHandler<AnimeTrackerEntry>
}

const Context = createContext<IProgressTrackerContext>()

export function AnimeProgressTrackerProvider(props: ParentProps) {
  const handler = createProgressTrackerTable<AnimeTrackerEntry>("anime", {
    TableHeadComponent$: AnimeProgressTrackerHead,
    TableRowComponent$: AnimeProgressTrackerRow,
    filterEntryByName$(name, entries) {
      return entries.filter(
        it => it.name.toLowerCase().includes(name.toLowerCase())
      )
    },
    getInactiveStatusEntry$(entriesData) {
      return entriesData.filter(it => {
        const targetProgresses = [
          it.category.anime?.currentProgress,
          it.category.manga?.currentProgress,
          it.category.light_novel?.currentProgress
        ]
        
        return (
          targetProgresses.includes(Progress.PAUSED) ||
          targetProgresses.includes(Progress.WAITING) ||
          targetProgresses.includes(Progress.PLANNING)
        )
      })
    },
  })

  return (
    <Context.Provider value={{
      handler$: handler,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useAnimeProgressTrackerContext() {
  return useContext(Context)!
}
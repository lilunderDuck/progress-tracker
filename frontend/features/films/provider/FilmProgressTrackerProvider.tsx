import { createContext, type ParentProps, useContext } from "solid-js"
// ...
import { createProgressTrackerTable, type ProgressTrackerTableHandler } from "../../../hook"
import { Progress } from "../../../api"
import type { IFilmTrackerEntry } from "../api"
import { FilmProgressTrackerHead, FilmProgressTrackerRow } from "../components"

interface IProgressTrackerContext {
  handler$: ProgressTrackerTableHandler<IFilmTrackerEntry>
}

const Context = createContext<IProgressTrackerContext>()

export function FilmProgressTrackerProvider(props: ParentProps) {
  const INACTIVE_STATUS = [
    Progress.PAUSED,
    Progress.WAITING, 
    Progress.PLANNING
  ]

  const handler = createProgressTrackerTable<IFilmTrackerEntry>("anime", {
    TableHeadComponent$: FilmProgressTrackerHead,
    TableRowComponent$: FilmProgressTrackerRow,
    filterEntryByName$(name, entries) {
      return entries.filter(
        it => it.name.toLowerCase().includes(name.toLowerCase())
      )
    },
    getInactiveStatusEntry$(entriesData) {
      return entriesData.filter(it => INACTIVE_STATUS.includes(it.currentProgress ?? Progress.NOT_SPECIFIED))
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

export function useFilmProgressTrackerContext() {
  return useContext(Context)!
}
import { type Accessor, createContext, createSignal, type ParentProps, Setter, useContext } from "solid-js"
// ...
import { ColumnOrdering, ISettingData, ProgressTrackerType } from "./type"

interface ISettingContext {
  setting$: Accessor<ISettingData>
  updateSetting$<T extends keyof ISettingData>(key: T, value: ISettingData[T]): any
  currentPage$: Accessor<ProgressTrackerType>
  setCurrentPage$: Setter<ProgressTrackerType>
}

const Context = createContext<ISettingContext>()

export function GlobalProvider(props: ParentProps) {
  const [setting, setSetting] = createSignal<ISettingData>({
    hidePublicScores: false,
    columnOrder: ColumnOrdering.DEFAULT,
    anime_showUndeterministicScore: false,
    __dummyDiscard__$: 0
  })

  const [currentPage, setCurrentPage] = createSignal(ProgressTrackerType.ANIME)

  const updateSetting: ISettingContext["updateSetting$"] = (key, value) => {
    switch (key) {
      case "__dummyDiscard__$": return // discard, don't update
    }

    setSetting(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Context.Provider value={{
      setting$: setting,
      updateSetting$: updateSetting,
      currentPage$: currentPage,
      setCurrentPage$: setCurrentPage
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGlobalContext() {
  return useContext(Context)!
}
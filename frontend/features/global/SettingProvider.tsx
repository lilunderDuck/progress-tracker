import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
import { ColumnOrdering, ISettingData } from "./type"

interface ISettingContext {
  setting$: Accessor<ISettingData>
  updateSetting$<T extends keyof ISettingData>(key: T, value: ISettingData[T]): any
}

const Context = createContext<ISettingContext>()

export function SettingProvider(props: ParentProps) {
  const [setting, setSetting] = createSignal<ISettingData>({
    hidePublicScores: false,
    columnOrder: ColumnOrdering.DEFAULT,
    anime_showUndeterministicScore: false,
    __dummyDiscard__$: 0
  })

  const updateSetting: ISettingContext["updateSetting$"] = (key, value) => {
    switch (key) {
      case "__dummyDiscard__$": return // discard, don't update
    }

    setSetting(prev => ({ ...prev, [key]: value }))
  }

  return (
    <Context.Provider value={{
      setting$: setting,
      updateSetting$: updateSetting
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useSettingContext() {
  return useContext(Context)!
}
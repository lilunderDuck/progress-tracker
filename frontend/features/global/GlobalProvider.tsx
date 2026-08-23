import { type Accessor, Component, createContext, createSignal, lazy, onMount, type ParentProps, Setter, useContext } from "solid-js"
// ...
import { ColumnOrdering, type ISettingData, ProgressTrackerType, ServerStatus } from "./type"
import { startHeartbeat } from "./heartbeat"

interface ISettingContext {
  setting$: Accessor<ISettingData>
  updateSetting$<T extends keyof ISettingData>(key: T, value: ISettingData[T]): any
  currentPage$: Accessor<ProgressTrackerType>
  setCurrentPage$: Setter<ProgressTrackerType>
  serverStatus$: Accessor<ServerStatus>
  readonly PROGRESS_TRACKER_PAGES_REGISTRY$: [ProgressTrackerType, Component][]
  readonly PROGRESS_TRACKER_NAME_REGISTRY$: Record<ProgressTrackerType, string>
}

const Context = createContext<ISettingContext>()

export function GlobalProvider(props: ParentProps) {
  const [setting, setSetting] = createSignal<ISettingData>({
    hidePublicScores: false,
    columnOrder: ColumnOrdering.DEFAULT,
    anime_showUndeterministicScore: false,
    __dummyDiscard__$: 0
  })
  
  const [serverStatus, setServerStatus] = createSignal(ServerStatus.STARTING)
  const [currentPage, setCurrentPage] = createSignal(ProgressTrackerType.ANIME)

  const updateSetting: ISettingContext["updateSetting$"] = (key, value) => {
    switch (key) {
      case "__dummyDiscard__$": return // discard, don't update
    }

    setSetting(prev => ({ ...prev, [key]: value }))
  }

  const PROGRESS_TRACKER_PAGES_REGISTRY = [
    [ProgressTrackerType.ANIME, lazy(() => import("../anime"))],
    [ProgressTrackerType.FILM, lazy(() => import("../films"))]
  ] satisfies [ProgressTrackerType, Component][]

  const PROGRESS_TRACKER_NAME_REGISTRY: Record<ProgressTrackerType, string> = {
    [ProgressTrackerType.ANIME]: "anime",
    [ProgressTrackerType.FILM]: "film",
    [ProgressTrackerType.GAME]: "game"
  }

  onMount(() => {
    if (import.meta.env.DEV) {
      setServerStatus(ServerStatus.ALIVE)
      console.log("heartbeat system is disabled in deverlopment mode")
      return
    }
    startHeartbeat(
      () => setServerStatus(ServerStatus.ALIVE),
      () => setServerStatus(ServerStatus.DEAD),
    )
  })

  return (
    <Context.Provider value={{
      setting$: setting,
      updateSetting$: updateSetting,
      currentPage$: currentPage,
      setCurrentPage$: setCurrentPage,
      serverStatus$: serverStatus,
      PROGRESS_TRACKER_PAGES_REGISTRY$: PROGRESS_TRACKER_PAGES_REGISTRY,
      PROGRESS_TRACKER_NAME_REGISTRY$: PROGRESS_TRACKER_NAME_REGISTRY
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useGlobalContext() {
  return useContext(Context)!
}
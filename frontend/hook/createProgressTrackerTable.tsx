import { createSignal, For, onMount, ParentProps, VoidComponent } from "solid-js"
// ...
import { API_URL } from "../api"
import { useFetchStatus } from "./useFetchStatus"
import { css } from "molcss"

type CompatibleProgressTrackerData = {
  id: string
  name: string
}

export type BaseTableRowComponentProps<T extends CompatibleProgressTrackerData> = {
  rowIndex$: number
} & T

type ProgressTrackerFns<T extends CompatibleProgressTrackerData> = {
  filterEntryByName$(name: string, entries: T[]): T[]
  getInactiveStatusEntry$(entries: T[]): T[]
  TableHeadComponent$: VoidComponent
  TableRowComponent$: VoidComponent<BaseTableRowComponentProps<T>>
}

const progressTracker__root = css`
  width: 100%;
  height: 100%;
  background-color: var(--mantle);
  padding-inline: 20px;
  padding-bottom: 10rem;
`

const progressTracker__table = css`
  border-collapse: collapse;
  width: 100%;
`

const progressTracker__tableHead = css`
  position: sticky;
  top: 0px;
  background-color: var(--mantle);
  padding-block: 10px;
  z-index: 5;
  font-size: 17px;
  & th {
    user-select: none;
  }
`

export function createProgressTrackerTable<T extends CompatibleProgressTrackerData>(
  name: string,
  options: ProgressTrackerFns<T>
) {
  const CODEC = { // -> guess what does this refer to.
    getAllEntries$: async() => {
      const routeToFetch = `${API_URL}/${name}/gimme_all`
      const response = await fetch(routeToFetch, { 
        method: "GET"
      })
      
      const data = JSON.parse(await response.text()) as T[]
      console.assert(Array.isArray(data), `getAllEntries(): returned data is not an array. It might be that the response data from this route ${routeToFetch} is invalid.`)
      return data
    },
    addEntry$: async(incomingData: T) => {
      const response = await fetch(`${API_URL}/${name}/add_this`, { 
        method: "POST",
        body: JSON.stringify(incomingData) 
      })
      return await response.json()
    },
    removeEntry$: async(entryId: string) => {
      await fetch(`${API_URL}/${name}/yeet_this/${entryId}`, { 
        method: "DELETE",
      })
    },
    updateEntry$: async(entryId: string, newData: T) => {
      const response = await fetch(`${API_URL}/${name}/update_this/${entryId}`, { 
        method: "PATCH", 
        body: JSON.stringify(newData) 
      })

      return await response.json()
    }
  }

  const [entriesData, setEntriesData] = createSignal<T[]>([])
  const [totalEntries, setTotalEntries] = createSignal(0)
  const [loadingStatus, fetchAllEntriesFn] = useFetchStatus(() => CODEC.getAllEntries$())

  const fetchAllEntriesRightAway = async() => {
    console.log("fast fetching all entries data for:", name)
    const allEntries = await fetchAllEntriesFn()
    if (allEntries) {
      setEntriesData(allEntries)
      setTotalEntries(allEntries.length)
    }
  }

  onMount(fetchAllEntriesRightAway)

  let cachedEntriesData: T[] | undefined
  const filterEntryByName = (name: string) => {
    if (!cachedEntriesData) {
      cachedEntriesData = entriesData()
    }

    // sanity check: make sure it is not just randomly 'undefined'
    console.assert(cachedEntriesData !== undefined, "cached entries data is set to undefined!!")
    console.assert(entriesData() !== undefined, "entries data is set to undefined!!")

    if (name === '') {
      setEntriesData(cachedEntriesData)
      cachedEntriesData = undefined
      console.log("all entries restored")
      return
    }

    setEntriesData(prev => options.filterEntryByName$(name, prev))
  }

  let lastEntryElement!: HTMLTableRowElement
  const pickAndHighlightEntry = (mode: "all" | "subset") => {
    if (lastEntryElement) {
      lastEntryElement.style.backgroundColor = ""
    }

    const randomIndex = mode === "subset" ? pickRandomInactiveEntry() : pickAnyRandomEntry()

    const entryRowId = `entry_${randomIndex}`
    const entryRowElement = document.getElementById(entryRowId) as HTMLTableRowElement
    console.assert(
      entryRowElement !== undefined, 
      `could not get the row element that has the id of "${entryRowId}", did you update the id of the row? or did you forget to add <tr id={${entryRowId}} />?`
    )

    console.assert(
      entryRowElement instanceof HTMLTableRowElement, 
      `I think I picked some other element, instead of a <tr /> element.`
    )

    console.log("entry picked:", entriesData()[randomIndex])

    entryRowElement.scrollIntoView({
      block: "center"
    })
    entryRowElement.style.backgroundColor = "var(--surface2)"
    lastEntryElement = entryRowElement
  }

  const pickRandomInactiveEntry = () => {
    const targetEntries = options.getInactiveStatusEntry$(entriesData())
    const randomIndex = Math.floor(Math.random() * targetEntries.length)
    const pickedEntry = targetEntries[randomIndex]
    console.assert(
      pickedEntry !== undefined, 
      `picked entry is out of bound!! picked index: ${randomIndex}, bound: [0, ${targetEntries.length}]`
    )

    const pickedEntryIndex = entriesData().findIndex(it => it.name === pickedEntry.name)
    return pickedEntryIndex
  }

  const pickAnyRandomEntry = () => {
    const targetEntries = entriesData()
    const randomEntryIndex = Math.floor(Math.random() * targetEntries.length)
    return randomEntryIndex
  }

  const addEntry = async(data: T) => {
    const newData = await CODEC.addEntry$(data)
    setEntriesData(prev => [...prev, newData])
  }

  const updateEntry = async(entryId: string, incomingData: T) => {
    const newData = await CODEC.updateEntry$(entryId, incomingData)
    setEntriesData(prev => {
      const updateEntryIndex = prev.findIndex(it => it.id === entryId)
      prev[updateEntryIndex] = {
        ...prev[updateEntryIndex],
        ...newData
      }
      
      return [...prev]
    })
  }

  const TableRoot = (props: ParentProps) => (
    <div class={`${progressTracker__root} scrollbar scrollbar__vertical scrollbar__horizontal scrollbar__invs`}>
      <table class={progressTracker__table}>
        <thead class={progressTracker__tableHead}>
          <options.TableHeadComponent$ />
        </thead>
        <tbody>
          {props.children}
        </tbody>
      </table>
    </div>
  )

  const TableRows = () => (
    <For each={entriesData()}>
      {(it, index) => (
        <options.TableRowComponent$ 
          {...it} 
          rowIndex$={index()} 
        />
      )}
    </For>
  )

  return {
    pickAndHighlightEntry$: pickAndHighlightEntry,
    filterEntryByName$: filterEntryByName,
    entriesData$: entriesData,
    totalEntries$: totalEntries,
    loadingStatus$: loadingStatus,
    addEntry$: addEntry,
    updateEntry$: updateEntry,
    // --------------------
    TableRows$: TableRows,
    TableRoot$: TableRoot,
  }
}

export type ProgressTrackerTableHandler<T extends CompatibleProgressTrackerData> = ReturnType<typeof createProgressTrackerTable<T>>

export type AnyProgressTrackerTableHandler = ProgressTrackerTableHandler<CompatibleProgressTrackerData> 
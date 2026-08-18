import { Accessor, createSignal, Setter } from "solid-js"
import { API_URL } from "../api"
import { FetchStatus, Status, useFetchStatus } from "./useFetchStatus"

type ProgressTrackerComparable = { id: string }

export class ProgressTrackerTable<T extends ProgressTrackerComparable> {
  readonly CODEC$ = {
    getAllEntries$: async() => {
      const routeToFetch = `${API_URL}/${this.NAME$}/gimme_all`
      const response = await fetch(routeToFetch, { 
        method: "GET"
      })
      
      const data = JSON.parse(await response.text()) as T[]
      console.assert(Array.isArray(data), `getAllEntries(): returned data is not an array. It might be that the response data from this route ${routeToFetch} is invalid.`)
      return data
    },
    addEntry$: async(incomingData: T) => {
      const response = await fetch(`${API_URL}/${this.NAME$}/add_this`, { 
        method: "POST",
        body: JSON.stringify(incomingData) 
      })
      return await response.json()
    },
    removeEntry$: async(entryId: string) => {
      await fetch(`${API_URL}/${this.NAME$}/yeet_this/${entryId}`, { 
        method: "DELETE",
      })
    },
    updateEntry$: async(entryId: string, newData: T) => {
      const response = await fetch(`${API_URL}/${this.NAME$}/update_this/${entryId}`, { 
        method: "PATCH", 
        body: JSON.stringify(newData) 
      })

      return await response.json()
    }
  }

  public totalEntries$: Accessor<number>
  private setTotalEntries$: Setter<number>
  public entriesData$: Accessor<T[]>
  private setEntriesData$: Setter<T[]>
  public loadStatus$: Accessor<Status> = () => ({ type$: FetchStatus.FETCHING })

  constructor(protected readonly NAME$: string) {
    const [entriesData, setEntriesData] = createSignal<T[]>([])
    const [totalEntries, setTotalEntries] = createSignal(0)

    this.totalEntries$ = totalEntries
    this.setTotalEntries$ = setTotalEntries
    this.entriesData$ = entriesData
    this.setEntriesData$ = setEntriesData
  }

  protected async fetchAllDataRightAway$() {
    const [status, fetchFn] = useFetchStatus(() => this.CODEC$.getAllEntries$())
    this.loadStatus$ = status
    const allEntries = await fetchFn()
    if (allEntries) {
      this.setEntriesData$(allEntries)
      this.setTotalEntries$(allEntries.length)
    }
  }
}
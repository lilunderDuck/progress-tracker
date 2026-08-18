import { createSignal } from "solid-js";
import { AnyNoArgsAsyncFunction } from "../utils";

export const enum FetchStatus {
  FETCHING,
  SUCCESS,
  FAILED
}

export type ErrorStatus = { type$: FetchStatus.FAILED, message$: string }

export type Status = 
  { type$: FetchStatus.SUCCESS } |
  { type$: FetchStatus.FETCHING } |
  ErrorStatus
// ...

export function useFetchStatus<T extends AnyNoArgsAsyncFunction>(asyncFn: T) {
  const [status, setStatus] = createSignal<Status>({ type$: FetchStatus.FETCHING })
  
  return [
    status,
    async(): Promise<Awaited<ReturnType<T>> | null> => {
      try {
        setStatus({ type$: FetchStatus.FETCHING })
        const result = await asyncFn()
        setStatus({ type$: FetchStatus.SUCCESS })
        return result
      } catch(error) {
        setStatus({ type$: FetchStatus.FAILED, message$: `${error}` })
        return null
      }
    }
  ] as const
}
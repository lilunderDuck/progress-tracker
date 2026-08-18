import { Progress } from "../common"

interface IProgressMappingOption {
  color$: string
  shortenedName$: string
  name$: string
}

// Hours of my minecraft coding just kicking in I think?
// Maybe I should carefully rename some type to DeferredRegister<...>
// Oops, here we are.
type DeferredRegister<T extends string | number> = Record<T, IProgressMappingOption>

// uhh- yeah, the next part should be...
//   DeferredRegister.create(ForgeRegistries.BLOCKS, MOD_ID);

export const PROGRESS_TYPE_REGISTRY: DeferredRegister<Progress> = {
  [Progress.COMPLETED]: {
    color$: "var(--green)",
    name$: "completed",
    shortenedName$: "finish",
  },
  [Progress.CURRENT]: {
    color$: "var(--sky)",
    // dynamically updated as "read" on manga column or "watch" on anime column,
    // the same applied with adding/updating entry dialog, it will be "reading"
    // or "watching"
    name$: "",
    shortenedName$: "",
  },
  [Progress.DROPPED]: {
    color$: "var(--red)",
    name$: "dropped",
    shortenedName$: "drop",
  },
  [Progress.PAUSED]: {
    color$: "var(--yellow)",
    name$: "paused",
    shortenedName$: "pause",
  },
  [Progress.PLANNING]: {
    color$: "var(--pink)",
    name$: "planning",
    shortenedName$: "plan",
  },
  [Progress.NOT_SPECIFIED]: {
    color$: "var(--surface0)",
    // another special cases, this just renders a gray box
    name$: "not specified",
    shortenedName$: "",
  },
  [Progress.WAITING]: {
    color$: "var(--teal)",
    name$: "waiting",
    shortenedName$: "wait",
  }
}

export const ALL_PROGRESS_TYPE: Progress[] = [
  Progress.COMPLETED,
  Progress.CURRENT,
  Progress.PAUSED,
  Progress.DROPPED,
  Progress.PLANNING,
  Progress.WAITING,
  Progress.NOT_SPECIFIED,
]

export const PROGRESS_PICK_RANDOM_WITH_SUBSET: Progress[] = [
  Progress.PAUSED,
  Progress.WAITING,
  Progress.PLANNING,
]
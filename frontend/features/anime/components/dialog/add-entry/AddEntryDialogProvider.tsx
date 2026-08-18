import { createContext, type ParentProps, useContext } from "solid-js"
// ...
import { createFormValueRetainer, FormValueRetainer } from "../../../../../hook"
import { useAnimeProgressTrackerContext } from "../../../provider"
import { ALL_ANIME_CATEGORY_TYPES, AnimeTrackerEntry } from "../../../api"

interface IAddEntryDialogContext {
  retainer$: FormValueRetainer<AnimeTrackerEntry>
  validateAndSubmit$(): void
  initialData$?: AnimeTrackerEntry
}

const Context = createContext<IAddEntryDialogContext>()

export function AddEntryDialogProvider(props: ParentProps<{
  initialData$?: AnimeTrackerEntry
}>) {
  const { handler$ } = useAnimeProgressTrackerContext()
  const { addEntry$, updateEntry$ } = handler$

  const formValueRetainer = createFormValueRetainer<AnimeTrackerEntry>()
  const validateAndSubmit: IAddEntryDialogContext["validateAndSubmit$"] = () => {
    const data = formValueRetainer.getData$()
    if (!data.name) {
      throw new Error("The name of the entry must not left empty")
    }
    
    if (!data.category) data.category = {}
    if (!isInBound(data.personalRating ?? 0, 0, 10)) {
      throw new Error("Score must be in between 0 and 10")
    }

    for (const category of ALL_ANIME_CATEGORY_TYPES) {
      if (data.category && data.category[category]) {
        const categoryScore = data.category[category].score ?? 0
        if (!isInBound(categoryScore, 0, 10)) {
          throw new Error(`Score in ${category} category must be in between 0 and 10`)
        }
      }
    }

    props.initialData$ ? updateEntry$(props.initialData$.id, data) : addEntry$(data)
  }

  const isInBound = (something: number, min: number, max: number) => {
    return something >= min && something <= max
  }

  return (
    <Context.Provider value={{
      retainer$: formValueRetainer,
      validateAndSubmit$: validateAndSubmit,
      initialData$: props.initialData$
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useAddEntryDialog() {
  return useContext(Context)!
}
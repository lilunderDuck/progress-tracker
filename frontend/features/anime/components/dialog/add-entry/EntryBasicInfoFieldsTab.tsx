import { useAddEntryDialog } from "./AddEntryDialogProvider"
import { NumberInput, TextInput } from "../../../../../components"

export default function EntryBasicInfoFieldsTab() {
  const { retainer$, initialData$ } = useAddEntryDialog()

  return (
    <>
      <TextInput
        {...retainer$.retain$('name', initialData$?.name)}
        label="Name"
        placeholder="Anime/manga/light novel name"
        required
      />

      <NumberInput 
        {...retainer$.retain$('personalRating', initialData$?.personalRating)}
        label="Personal rating"
        placeholder="Your score"
        min={0}
        max={10}
        required
      />

      <TextInput
        {...retainer$.retain$('notes', initialData$?.notes)}
        label="Personal notes"
        placeholder="Your note for this"
        multiline$={true}
        rows={5}
        required
      />
    </>
  )
}
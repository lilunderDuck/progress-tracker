import { useAddEntryDialog } from "./AddEntryDialogProvider"
import { TextInput } from "../../../../../components"

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
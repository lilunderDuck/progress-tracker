import { css } from "molcss"
// ...
import { TabContent, TabHeader, TabRoot, Button, IDialogContentProps } from "../../../../../components"
import { AddEntryDialogProvider, useAddEntryDialog } from "./AddEntryDialogProvider"
import EntryBasicInfoFieldsTab from "./EntryBasicInfoFieldsTab"
import CategoryFieldInfosTab from "./CategoryFieldInfosTab"
import { AnimeTrackerEntry } from "../../../api"

const dialog__content = css`
  width: 60%;
`

interface IAddEntryDialogProps extends IDialogContentProps {
  initialData$?: AnimeTrackerEntry
}

export default function AddEntryDialog(props: IAddEntryDialogProps) {
  const AddEntryButton = () => {
    const { initialData$, validateAndSubmit$ } = useAddEntryDialog()

    return (
      <Button onClick={() => {
        validateAndSubmit$()
        props.close$()
      }}>
        {initialData$ ? "Update" : "Add"} entry
      </Button>
    )
  }

  return (
    <AddEntryDialogProvider initialData$={props.initialData$}>
      <div class={dialog__content}>
        <h2 class={css`user-select: none; padding-bottom: 5px;`}>
          {props.initialData$ ? "Update" : "Add"} entry
        </h2>

        <TabRoot pages$={[
          { name$: "Basic info", Page$: EntryBasicInfoFieldsTab },
          { name$: "Score & Progress", Page$: CategoryFieldInfosTab },
        ]}> 
          <TabHeader tabButtonClass$={css`width: 100%;`} />

          <div class={css`
            width: 100%; 
            height: 5px; 
            background-color: var(--surface1);
            margin-block: 8px;
          `} />

          <TabContent />
        </TabRoot>

        <div class={css`display: flex; justify-content: flex-end; align-items: center; gap: 10px;`}>
          <Button variant$="danger$" onClick={props.close$}>
            Close
          </Button>
          <AddEntryButton />
        </div>
      </div>
    </AddEntryDialogProvider>
  )
}
import { Select, SelectItemComponentProps, Tag } from "../../../../../components"
import { useAddEntryDialog } from "./AddEntryDialogProvider"
import { ALL_PROGRESS_TYPE, Progress, PROGRESS_TYPE_REGISTRY} from "../../../../../api"
import { AnimeTrackerCategory } from "../../../api"
import { CATEGORY_REGISTRY } from "../../../../../../bin/provider"

export default function CategoryFieldInfosTab() {
  return (
    <>
      <CategoryFieldTab category$="anime" />
      <CategoryFieldTab category$="manga" />
      <CategoryFieldTab category$="light_novel" />
    </>
  )
}

function CategoryFieldTab(props: { category$: AnimeTrackerCategory }) {
  const { retainer$, initialData$ } = useAddEntryDialog()

  const getProgressText = (progress: Progress) => {
    if (progress === Progress.NOT_SPECIFIED) {
      return "not specified"
    }

    if (progress === Progress.CURRENT) {
      return props.category$ === "anime" ? "watching" : "reading"
    }

    return PROGRESS_TYPE_REGISTRY[progress].name$
  }

  const ItemComponent = (itemProps: SelectItemComponentProps<Progress>) => {
    const mapping = PROGRESS_TYPE_REGISTRY[itemProps.item$]
    const tagTextColor = itemProps.item$ === Progress.NOT_SPECIFIED ? "var(--text)" : undefined
    return (
      <Tag color$={mapping.color$} textColor$={tagTextColor}>
        {getProgressText(itemProps.item$)}
      </Tag>
    )
  }

  const displayName = CATEGORY_REGISTRY[props.category$].name$

  return (
    <Select 
      {...retainer$.retain$(
        `category.${props.category$}.currentProgress`,
        initialData$?.category[props.category$]?.currentProgress
      )}
      multiple$={false}
      allOptions$={ALL_PROGRESS_TYPE}
      label$={`${displayName} progress`}
      popoverContentWidth$="60%"
      ItemComponent$={ItemComponent}
      ItemSelectedComponent$={ItemComponent}
    />
  )
}
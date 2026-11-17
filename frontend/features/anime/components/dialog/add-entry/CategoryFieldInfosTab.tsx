import { css } from "molcss"
import { Show } from "solid-js"
import { BsInfoCircleFill } from "solid-icons/bs"
// ...
import { DefaultTextListInput, ListInput, NumberInput, Select, SelectItemComponentProps, TabContent, TabHeader, TabRoot, Tag, Tooltip } from "../../../../../components"
import { useAddEntryDialog } from "./AddEntryDialogProvider"
import { ALL_PROGRESS_TYPE, Progress, PROGRESS_TYPE_REGISTRY} from "../../../../../api"
import { AnimeTrackerCategory, AnimeTrackerNote, SCORE_NOTE_DISABLING_RULE_REGISTRY, SCORE_NOTES_CATEGORY_MAPPING, SCORE_NOTES_REGISTRY } from "../../../api"

export default function CategoryFieldInfosTab() {
  return (
    <TabRoot pages$={[
      { name$: "Anime", Page$: () => <CategoryFieldTab category$="anime" /> },
      { name$: "Manga", Page$: () => <CategoryFieldTab category$="manga" /> },
      { name$: "(Light) novel", Page$: () => <CategoryFieldTab category$="light_novel" /> },
    ]}>
      <TabHeader 
        tabButtonClass$={css`width: 100%;`} 
        tabFocusColor$="var(--peach)"
        tabFocusRingColor$="var(--peach)"
      />
      <TabContent />
    </TabRoot>
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

  return (
    <>
      <div class={css`display: flex; align-items: center; gap: 10px;`}>
        <div class={css`flex-basis: 100%;`}>
          <Select 
            {...retainer$.retain$(
              `category.${props.category$}.currentProgress`,
              initialData$?.category[props.category$]?.currentProgress
            )}
            multiple$={false}
            allOptions$={ALL_PROGRESS_TYPE}
            label$="Current progress"
            popoverContentWidth$="60%"
            ItemComponent$={ItemComponent}
            ItemSelectedComponent$={ItemComponent}
          />
        </div>
      </div>
    </>
  )
}
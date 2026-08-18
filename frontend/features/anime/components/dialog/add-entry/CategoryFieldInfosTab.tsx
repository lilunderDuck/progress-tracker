import { css } from "molcss"
import { Show } from "solid-js"
import { BsInfoCircleFill } from "solid-icons/bs"
// ...
import { computeDisablingRulesByRegistry, DefaultTextListInput, type ISelectProps, ListInput, NumberInput, Select, SelectItemComponentProps, TabContent, TabHeader, TabRoot, Tag, Tooltip } from "../../../../../components"
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

  const scoreNoteItemDisablingRule: ISelectProps<AnimeTrackerNote>["onSelectingItem$"] = (selectedItems, currentRule) => {
    return computeDisablingRulesByRegistry(selectedItems, currentRule, SCORE_NOTE_DISABLING_RULE_REGISTRY)
  }

  return (
    <>
      <div class={css`display: flex; align-items: center; gap: 10px;`}>
        <div class={css`flex-basis: 40%;`}>
          <Select 
            {...retainer$.retain$(
              `category.${props.category$}.currentProgress`,
              initialData$?.category[props.category$]?.currentProgress
            )}
            multiple$={false}
            allOptions$={ALL_PROGRESS_TYPE}
            label$="Current progress"
            popoverContentWidth$="28%"
            ItemComponent$={ItemComponent}
            ItemSelectedComponent$={ItemComponent}
          />
        </div>

        <div class={css`flex-basis: 30%;`}>
          <NumberInput 
            {...retainer$.retain$('personalRating', initialData$?.personalRating)}
            label="Personal rating"
            placeholder="Your score"
            min={0}
            max={10}
            required
          />
        </div>

        <div class={css`flex-basis: 30%;`}>
          <NumberInput 
            {...retainer$.retain$(
              `category.${props.category$}.score`,
              initialData$?.category[props.category$]?.score
            )}
            label="Public score rating"
            placeholder="Public score/average score (between 0 and 10)"
            min={0}
            max={10}
            required
          />
        </div>
      </div>
      
      <ListInput 
        {...retainer$.retain$(
          `category.${props.category$}.scoreSrc`,
          initialData$?.category[props.category$]?.scoreSrc
        )}
        label="Provided sources"
        inputComponent$={DefaultTextListInput}
        inputPlaceholder$="MAL, mangadex or any valid url here"
      />
      
      <Select<AnimeTrackerNote>
        {...retainer$.retain$(
          `category.${props.category$}.scoreNotes`,
          initialData$?.category[props.category$]?.scoreNotes
        )}
        multiple$={true}
        displayTotalOnly$={true}
        allOptions$={SCORE_NOTES_CATEGORY_MAPPING[props.category$]}
        label$="Score notes"
        popoverContentWidth$="60%"
        onSelectingItem$={scoreNoteItemDisablingRule}
        ItemComponent$={(itemProps) => {
          const registry = SCORE_NOTES_REGISTRY[itemProps.item$]

          return (
            <>
              <div class={css`width: 100%;`}>
                {registry.name$}
              </div>
              <Show when={registry?.note$}>
                <Tooltip label$={registry.note$}>
                  <BsInfoCircleFill />
                </Tooltip>
              </Show>
            </>
          )
        }}
      />
    </>
  )
}
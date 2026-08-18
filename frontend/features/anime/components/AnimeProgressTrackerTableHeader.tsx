import { TbArrowsRandom } from "solid-icons/tb"
import { BsGearFill, BsPlus, BsX } from "solid-icons/bs"
import { FaSolidUpRightAndDownLeftFromCenter } from "solid-icons/fa"
import { createSignal, For, lazy, Show } from "solid-js"
import { Portal } from "solid-js/web"
// ...
import { css } from "molcss"
// ...
import { Button, Dialog, Input, Tag, Tooltip } from "../../../components"
import { SettingDialog } from "../../../components"
import { useAnimeProgressTrackerContext } from "../provider"
import { PROGRESS_PICK_RANDOM_WITH_SUBSET, PROGRESS_TYPE_REGISTRY } from "../../../api"

const tableHeader__root = css`
  width: 100%;
  padding-inline: 20px;
  padding-block: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  user-select: none;
`

const tableHeader__button = css`
  width: 30px;
  height: 30px;
  color: var(--overlay2);
  background-color: var(--surface0);
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: var(--surface2);
    color: var(--text);
  }
`

const tableHeader__pickRandomTooltipContent = css`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`

export function AnimeProgressTrackerTableHeader() {
  const { handler$ } = useAnimeProgressTrackerContext()
  let inputRef!: HTMLInputElement

  const [showResetButton, setShowResetButton] = createSignal(false)
  const discardSearching = () => {
    handler$.filterEntryByName$("")
    inputRef.value = ""
    setShowResetButton(false)
  }

  const PICK_RANDOM_SUBSET_DESCRIPTION = (
    <p class={tableHeader__pickRandomTooltipContent}>
      Pick any entry that has one of this tag
      <For each={PROGRESS_PICK_RANDOM_WITH_SUBSET}>
        {it => {
          const registry = PROGRESS_TYPE_REGISTRY[it]
          return (
            <Tag color$={registry.color$}>
              {registry.shortenedName$}
            </Tag>
          )
        }}
      </For>

      (if you have trouble picking)
    </p>
  )

  const searchEntry = (inputEvent: InputEvent) => {
    const searchedName = (inputEvent.currentTarget as HTMLInputElement).value
    if (searchedName === "") {
      return discardSearching()
    }

    handler$.filterEntryByName$(searchedName)
    setShowResetButton(true)
  }

  const AddEntryDialog = lazy(() => import("./dialog/add-entry/AddEntryDialog"))

  return (
    <header class={tableHeader__root}>
      <Tooltip placement$="top" label$="Open setting">
        <Dialog dialogContent$={SettingDialog}>
          <Button type$="icon$">
            <BsGearFill />
          </Button>
        </Dialog>
      </Tooltip>
      <div />
      <Tooltip placement$="top" label$="Add entry">
        <Dialog dialogContent$={AddEntryDialog}>
          <Button type$="icon$">
            <BsPlus size={15} />
          </Button>
        </Dialog>
      </Tooltip>
      <Tooltip placement$="top" label$={PICK_RANDOM_SUBSET_DESCRIPTION}>
        <Button 
          type$="icon$"
          onClick={() => handler$.pickAndHighlightEntry$("subset")}
          disabled={handler$.entriesData$().length === 0}
        >
          <TbArrowsRandom />
        </Button>
      </Tooltip>
      <Tooltip placement$="top" label$="Pick any entry in this table">
        <Button 
          type$="icon$"
          onClick={() => handler$.pickAndHighlightEntry$("all")}
          disabled={handler$.entriesData$().length === 0}
        >
          <FaSolidUpRightAndDownLeftFromCenter />
        </Button>
      </Tooltip>
      <Input 
        placeholder="Search by name"
        ref={inputRef}
        id="the_night_is_young"
        onInput={searchEntry}
      />
      <Show when={showResetButton()}>
        <Tooltip label$="Discard search">
          <Button type$="icon$" class={tableHeader__button} onClick={discardSearching}>
            <BsX />
          </Button>
        </Tooltip>
      </Show>
    </header>
  )
}
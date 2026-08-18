import { createSignal, For, onMount } from "solid-js"
import { Dialog, KeyIndicator } from "../../components"
import { css } from "molcss"

const dialog__optionWrap = css`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: 10px;
  padding-block: 5px;
  user-select: none;
  & .dialog__focusIndicator {
    opacity: 0;
  }

  &:focus .dialog__focusIndicator,
  &:focus-visible .dialog__focusIndicator {
    opacity: 1;
  }

  &:focus, &:focus-visible {
    background-color: var(--surface0);
  }
`

const dialog__focusIndicator = css`
  font-size: 20px;
`

const dialog__optionDescription = css`
  color: var(--subtext0);
  width: 100%;
  text-align: right;
`

export function ProgressTrackerMenuDialog() {
  const [isShowingMenu, setIsShowingMenu] = createSignal(false)
  document.addEventListener("keyup", (keyboardEvent) => {
    if (keyboardEvent.key === "/") {
      setIsShowingMenu(prev => !prev)
    }
  })

  const TRACKER_CATEGORIES = [
    {
      name$: "Anime",
      description$: "Anime/manga/(light) novel watch/read progress"
    },
    {
      name$: "Gaming",
      description$: "#its-gamin-time"
    },
    {
      name$: "Film",
      description$: "watched film progress, ratings and more"
    }
  ]

  onMount(() => {
    setTimeout(() => {
      document.getElementById("dialog__trackerMenuOption")?.focus()
    }, 1)
  })

  return (
    <Dialog dialogContent$={() => (
      <div class={css`width: 45rem;`}>
        <h1 class={css`margin-bottom: 15px;`}>Choose a progress tracker</h1>

        <For each={TRACKER_CATEGORIES}>
          {(it) => (
            <section tabIndex={0} class={dialog__optionWrap} id="dialog__trackerMenuOption">
              <div class={`dialog__focusIndicator ${dialog__focusIndicator}`}>&gt;</div>
              <b>{it.name$}</b>
              <span class={dialog__optionDescription}>
                {it.description$}
              </span>
            </section>
          )}
        </For>

        <section class={css`display: flex; padding-top: 15px; padding-bottom: 10px; padding-inline: 15px; gap: 10px; flex-wrap: wrap;`}>
          <KeyIndicator key$="SHIFT + TAB" description$="move up" />
          <KeyIndicator key$="TAB" description$="move down" />
          <KeyIndicator key$="Space" description$="open" />
          <KeyIndicator key$="ESC" description$="close menu" />
        </section>
      </div>
    )} defaultOpened$={isShowingMenu()} />
  )
}
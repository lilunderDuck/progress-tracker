import { For, onMount } from "solid-js"
import { Button, type IDialogContentProps } from "../../components"
import { css } from "molcss"
import { ProgressTrackerType } from "./type"
import { useGlobalContext } from "./GlobalProvider"

const dialog__optionWrap = css`
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: 10px;
  padding-block: 5px;
  user-select: none;
  border-radius: 6px;
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

export default function ProgressTrackerMenuDialog(props: IDialogContentProps) {
  const { setCurrentPage$ } = useGlobalContext()

  const TRACKER_CATEGORIES = [
    {
      name$: "Anime",
      description$: "Anime/manga/(light) novel watch/read progress",
      type$: ProgressTrackerType.ANIME
    },
    {
      name$: "Film",
      description$: "watched film progress, ratings and more",
      type$: ProgressTrackerType.FILM
    },
    {
      name$: "Gaming",
      description$: "#its-gamin-time",
      type$: ProgressTrackerType.GAME
    }
  ]

  onMount(() => {
    setTimeout(() => {
      document.getElementById("dialog__trackerMenuOption")?.focus()
    }, 1)
  })

  const clickingSomeOption = (type: ProgressTrackerType) => {
    setCurrentPage$(type)
    props.close$()
  }

  return (
    <div class={css`width: 45rem;`}>
      <h1 class={css`margin-bottom: 15px;`}>Choose a progress tracker</h1>

      <For each={TRACKER_CATEGORIES}>
        {(it) => (
          <section tabIndex={0} class={dialog__optionWrap} id="dialog__trackerMenuOption" onClick={() => clickingSomeOption(it.type$)}>
            <div class={`dialog__focusIndicator ${dialog__focusIndicator}`}>&gt;</div>
            <b>{it.name$}</b>
            <span class={dialog__optionDescription}>
              {it.description$}
            </span>
          </section>
        )}
      </For>

      {/* <section class={css`display: flex; padding-top: 15px; padding-bottom: 10px; padding-inline: 15px; gap: 10px; flex-wrap: wrap;`}>
        <KeyIndicator key$="SHIFT + TAB" description$="move up" />
        <KeyIndicator key$="TAB" description$="move down" />
        <KeyIndicator key$="Space" description$="open" />
        <KeyIndicator key$="ESC" description$="close menu" />
      </section> */}

      <section class={css`display: flex; justify-content: flex-end;`}>
        <Button variant$="danger$" onClick={props.close$}>Close</Button>
      </section>
    </div>
  )
}
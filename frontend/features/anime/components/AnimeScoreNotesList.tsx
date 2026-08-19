import { css } from "molcss"
import { AnimeTrackerNote, SCORE_NOTES_REGISTRY } from "../api"
import { For, Show } from "solid-js"

const tableRow__tooltipListFirst = css`
  padding-bottom: 10px;
`

const tableRow__tooltipListRoot = css`
  padding-left: 17px;
`

const tableRow__tooltipList = css`
  white-space: break-spaces;
  word-break: break-word;
  padding-bottom: 5px;
`

export function AnimeScoreNotesList(props: { scoreNotes?: AnimeTrackerNote[] }) {
  return (
    <ul class={`${tableRow__tooltipListRoot} ${tableRow__tooltipListFirst}`}>
      <For each={props.scoreNotes}>
        {it => {
          console.assert(SCORE_NOTES_REGISTRY[it] !== undefined, `Missing score note for type or invalid score note type: ${it}`)

          return (
            <li class={tableRow__tooltipList}>
              <b class={css`display:block;`}>
                {SCORE_NOTES_REGISTRY[it].name$}
              </b>
              <Show when={SCORE_NOTES_REGISTRY[it].description$}>
                <span>{SCORE_NOTES_REGISTRY[it].description$}</span>
              </Show>
            </li>
          )
        }}
      </For>
    </ul>
  )
}
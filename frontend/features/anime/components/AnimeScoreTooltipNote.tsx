import { css } from "molcss"
import { For, Show } from "solid-js"
import { Label } from "../../../components"
import { AnimeCategoryData, SCORE_NOTES_REGISTRY } from "../api"

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

const tableRow__link = css`
  white-space: nowrap;
  overflow-x: hidden;
  text-overflow: ellipsis;
  display: block;
`

export default function AnimeScoreTooltipNote(props: AnimeCategoryData) {
  return (
    <>
      <Show when={props.scoreNotes}>
        <Label>
          Notes
        </Label>
        <ul class={`${tableRow__tooltipListRoot} ${tableRow__tooltipListFirst}`}>
          <For each={props.scoreNotes}>
            {it => {
              console.assert(SCORE_NOTES_REGISTRY[it] !== undefined, `Missing score note for type or invalid score note type: ${it}`)

              return (
                <li class={tableRow__tooltipList}>
                  <b class={css`display:block;`}>{SCORE_NOTES_REGISTRY[it].name$}</b>
                  <Show when={SCORE_NOTES_REGISTRY[it].description$}>
                    <span>{SCORE_NOTES_REGISTRY[it].description$}</span>
                  </Show>
                </li>
              )
            }}
          </For>
        </ul>
      </Show>

      <Show when={props.scoreSrc}>
        <Label>
          Source(s) provided
        </Label>
        <ul class={tableRow__tooltipListRoot}>
          <For each={props.scoreSrc}>
            {it => (
              <li class={tableRow__tooltipList}>
                <Show when={it.includes("https://")} fallback={it}>
                  <a class={tableRow__link} href={it} target="_blank">
                    {it}
                  </a>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </>
  )
}
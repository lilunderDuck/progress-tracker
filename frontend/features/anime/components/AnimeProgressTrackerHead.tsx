import { For, Show } from "solid-js"
// ...
import { css } from "molcss"
import "./AnimeProgressTrackerHead.css"
// ...
import { Tooltip } from "../../../components"
import { useSettingContext } from "../../global"
import { ALL_ANIME_CATEGORY_TYPES, ANIME_CATEGORY_REGISTRY } from "../api"

export function AnimeProgressTrackerHead() {
  const { setting$ } = useSettingContext()

  return (
    <>
      <tr>
        <th scope="colgroup" colspan="1"></th>
        <Show when={!setting$().hidePublicScores}>
          <th scope="colgroup" colspan="3">Public scores</th>
        </Show>
        <th scope="colgroup" colspan="3">Progress</th>
        <th scope="colgroup" colspan="1" class="table__extraLeftPadding">Rating</th>
        <th scope="colgroup" colspan="1" class="table__extraLeftPadding"></th>
      </tr>
      <tr>
        <th scope="col" class={`table__extraLeftPadding ${css`width:250px;`}`}>
          Name
        </th>

        <Show when={!setting$().hidePublicScores}>
          <For each={ALL_ANIME_CATEGORY_TYPES}>
            {it => {
              const registry = ANIME_CATEGORY_REGISTRY[it]
              return (
                <th scope="col">
                  <Tooltip label$={`${registry.name$} progress`}>
                    {registry.shortenedName$}
                  </Tooltip>
                </th>
              )
            }}
          </For>
        </Show>

        <For each={ALL_ANIME_CATEGORY_TYPES}>
          {it => {
            const registry = ANIME_CATEGORY_REGISTRY[it]
            return (
              <th scope="col">
                <Tooltip label$={`${registry.name$} progress`}>
                  {registry.shortenedName$}
                </Tooltip>
              </th>
            )
          }}
        </For>

        <th scope="col" class="table__extraLeftPadding" /> 

        <th 
          scope="col" 
          class={`table__extraLeftPadding`}
        >
          Notes
        </th>
      </tr>
    </>
  )
}
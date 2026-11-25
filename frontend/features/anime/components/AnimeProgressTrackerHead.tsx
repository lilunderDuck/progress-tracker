import { For } from "solid-js"
// ...
import { css } from "molcss"
import "./AnimeProgressTrackerHead.css"
// ...
import { Tooltip } from "../../../components"
import { useGlobalContext } from "../../global"
import { ALL_ANIME_CATEGORY_TYPES, ANIME_CATEGORY_REGISTRY } from "../api"

const header__line = css`
  width: 100%;
  display: flex;
  align-items: center;
  font-weight: bold;
  text-align: center;
  gap: 5px;
  & > .table__extraLeftPadding {
    padding-left: 10px;
  }
`

const header__progress = css`
  width: 200px;
`

const header__name = css`
  width: 250px;
`

const header__statusCategory = css`
  width: 60px;
`

const header__notes = css`
  flex: 1;
`

export function AnimeProgressTrackerHead() {
  const { setting$ } = useGlobalContext()

  return (
    <>
      <div class={header__line}>
        <div class={header__name}></div>
        <div class={`table__extraLeftPadding ${header__progress}`}>Progress</div>
        <div class={`table__extraLeftPadding`}>Rating</div>
        <div class={header__notes}></div>
      </div>
      <div class={header__line}>
        <div class={header__name}>Name</div>
        <div class="table__extraLeftPadding"></div>
        <For each={ALL_ANIME_CATEGORY_TYPES}>
          {it => {
            const registry = ANIME_CATEGORY_REGISTRY[it]
            return (
              <div class={header__statusCategory}>
                <Tooltip label$={`${registry.name$} progress`}>
                  {registry.shortenedName$}
                </Tooltip>
              </div>
            )
          }}
        </For>
        <div class={header__statusCategory}></div>
        <div class={header__notes}>Notes</div>
      </div>
    </>
  )
}
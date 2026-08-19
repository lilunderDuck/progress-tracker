import { css } from "molcss"
import { ParentProps, Show } from "solid-js"
import { BiSolidBlanket } from "solid-icons/bi"
// ...
import { Tooltip } from "../ui"
import { type AnyProgressTrackerTableHandler, CompatibleProgressTrackerData, type ErrorStatus, FetchStatus, ProgressTrackerTableHandler } from "../../hook"
import { SpinningCube } from "../loader"

const placeholderView__root = css`
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: 100%;
  height: calc(100% - 26px - 60px); 
  flex-direction: column; 
  gap: 10px;
  user-select: none;
`

const placeholderView__textWrap = css`
  width: 40%; 
  text-align: center;
`

interface IProgressTrackerPlaceholderViewProps<T extends CompatibleProgressTrackerData> {
  handler$: ProgressTrackerTableHandler<T>
}

export function ProgressTrackerPlaceholderView<T extends CompatibleProgressTrackerData>(
  props: ParentProps<IProgressTrackerPlaceholderViewProps<T>>
) {
  const trackerContext = props.handler$

  const isEmpty = () => trackerContext.entriesData$().length == 0

  return (
    <Show when={trackerContext.loadingStatus$().type$ === FetchStatus.FETCHING} fallback={
      <Show when={isEmpty()} fallback={props.children}>
        <div class={placeholderView__root}>
          <div>
            <BiSolidBlanket size={80} />
          </div>
          <span class={placeholderView__textWrap}>
            There's no entries here... <Tooltip anchorClass$={css`display: inline-block;`} label$="Click to refresh">
              <a href="/">"Uhh- I think it not suppose to be empty?"</a>
            </Tooltip>
          </span>
        </div>
      </Show>
    }>
      <Show when={trackerContext.loadingStatus$().type$ === FetchStatus.FAILED} fallback={
        <div class={placeholderView__root}>
          <div>
            <SpinningCube cubeSize$={70} />
          </div>
        </div>
      }>
        <div class={placeholderView__root}>
          <div class={css`font-size: 80px;`}>
            X
          </div>
          <span class={placeholderView__textWrap}>
            Failed to load progress table: <code>{(trackerContext.loadingStatus$() as ErrorStatus).message$}</code>. <Tooltip anchorClass$={css`display: inline-block;`} label$="Click to refresh">
              <a href="/">Try reloading it?</a>
            </Tooltip>
          </span>
        </div>
      </Show>
    </Show>
  )
}
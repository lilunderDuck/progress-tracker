import { css } from "molcss"
import { Component, createEffect, createSignal, ParentProps, Show } from "solid-js"
import { Portal } from "solid-js/web"

const dialog__dialog = css`
  width: 100%;
  height: 100%;
  background-color: #11111bb2;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--text);
  & > div {
    padding-inline: 10px;
    padding-block: 5px;
    background-color: var(--crust);
    border: 4px solid var(--surface0);
  }
`

export interface IDialogContentProps {
  close$(): void
}

interface IDialogProps {
  dialogContent$: Component<IDialogContentProps>
  triggerClass$?: string
  defaultOpened$?: boolean
}

export function Dialog(props: ParentProps<IDialogProps>) {
  const [isShowing, setIsShowing] = createSignal(props.defaultOpened$ ?? false)

  createEffect(() => {
    setIsShowing(props.defaultOpened$ ?? false)
  })

  let dialogRef!: HTMLDialogElement

  return (
    <>
      <Show when={!props.defaultOpened$}>
        <div onClick={() => setIsShowing(true)}>
          {props.children}
        </div>
      </Show>
      <Show when={isShowing()}>
        <Portal>
          <dialog 
            closedby="closerequest" 
            open={isShowing()}
            onClose={() => setIsShowing(false)}
            class={`${dialog__dialog} dialog__thisDialog`}
            ref={dialogRef}
          >
            <props.dialogContent$ close$={() => setIsShowing(false)} />
            {void dialogRef?.focus()}
          </dialog>
        </Portal>
      </Show>
    </>
  )
}
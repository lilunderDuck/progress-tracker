import { css } from "molcss"
import { JSX, Show, splitProps } from "solid-js"
import { BaseOnChangeHandler } from "../../../hook"
import { Label } from "../Label"

const input__inputSection = css`
  padding-bottom: 10px;
`

const input__input = css`
  width: 100%;
  resize: none;
  background-color: var(--base);
  padding-inline: 10px;
  padding-block: 5px;
  margin-top: 5px;
`

const input__inputErrorText = css`
  color: var(--red);
`

type TextInputProps<Multiline extends boolean> = {
  label?: string
  placeholder?: string
  value?: string | undefined
  error?: string
  required?: boolean
  multiline$?: Multiline
  rows?: number
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>
} & BaseOnChangeHandler<string>

export function TextInput<Multiline extends boolean = false>(props: TextInputProps<Multiline>) {
  const [, inputProps] = splitProps(props, ['label', 'error', 'multiline$'])

  const INPUT_ID = `i_${Math.floor(Math.random() * 100)}`

  const inputHandler = (inputEvent: InputEvent) => {
    props.onChange$((inputEvent.currentTarget as HTMLTextAreaElement | HTMLInputElement).value)
  }

  return (
    <section class={input__inputSection}>
      <Label for={INPUT_ID}>
        {props.label}
      </Label>
      <Show when={props.multiline$} fallback={
        // @ts-ignore
        <input
          {...inputProps}
          class={input__input}
          type="text"
          spellcheck={false}
          autocomplete="off"
          id={INPUT_ID}
          onInput={inputHandler}
        />
      }>
        {/* @ts-ignore */}
        <textarea
          {...inputProps}
          spellcheck={false}
          class={input__input}
          id={INPUT_ID}
          onInput={inputHandler}
        />
      </Show>
      {props.error && <span class={input__inputErrorText}>{props.error}</span>}
    </section>
  )
}
import { css } from "molcss"
import { JSX, splitProps } from "solid-js"
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

const input__inputLabel = css`
  user-select: none;
`

type NumberInputProps = {
  label?: string
  placeholder?: string
  value?: number | undefined
  error?: string
  required?: boolean
  min?: number
  max?: number
} & BaseOnChangeHandler<number>

export function NumberInput(props: NumberInputProps) {
  const [, inputProps] = splitProps(props, ['label', 'error', 'onChange$']);

  const INPUT_ID = `i_${Math.floor(Math.random() * 100)}`

  return (
    <section class={input__inputSection}>
      <Label for={INPUT_ID} class={input__inputLabel}>
        {props.label}
      </Label>
      <input
        {...inputProps}
        onInput={(inputEvent) => {
          const value = parseFloat(inputEvent.currentTarget.value)
          if (isNaN(value)) return
          props.onChange$?.(value)
        }}
        class={input__input}
        type="number"
        spellcheck={false}
        autocomplete="off"
        id={INPUT_ID}
      />
      {props.error && <span class={input__inputErrorText}>{props.error}</span>}
    </section>
  )
}
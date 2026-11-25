import { css } from "molcss"
import { splitProps } from "solid-js"
import { BaseOnChangeHandler } from "../../../hook"
import { Label } from "../Label"
import { Button } from "../Button"
import { BsX } from "solid-icons/bs"
import { Ref } from "../../../utils"

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

const input__inputWrap = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
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
  let inputRef!: Ref<"input">

  return (
    <section class={input__inputSection}>
      <Label for={INPUT_ID} class={input__inputLabel}>
        {props.label}
      </Label>
      <div class={input__inputWrap}>
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
          ref={inputRef}
        />
        <Button variant$="danger$" onClick={() => {
          props.onChange$?.(undefined)
          inputRef.value = ""
        }}>
          <BsX />
          Clear
        </Button>
      </div>
      {props.error && <span class={input__inputErrorText}>{props.error}</span>}
    </section>
  )
}
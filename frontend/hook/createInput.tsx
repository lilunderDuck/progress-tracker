import { css } from "molcss"
import { Component, createSignal, Show } from "solid-js"

const input__errorText = css`
  color: var(--red);
`

const input__input = css`
  outline: 4px solid var(--red);
`

type CouldBe<T> = T | null
type ValidationErrorMessage = string

type BaseInputProps = { class?: string, value?: any, onChange$(value: any): any }

export function createInput<Value extends any>(
  InputComponent: Component<BaseInputProps>,
  onValidate: (incoming: Value | undefined) => CouldBe<ValidationErrorMessage>
) {
  const [highlightInput, setHighlightInput] = createSignal(false)
  const [error, setError] = createSignal<string | null>()
  const [value, setValue] = createSignal<Value | undefined>()

  const reset = () => {
    setHighlightInput(false)
    setError(null)
  }

  const validate = () => {
    const validationError = onValidate(value())
    if (validationError) {
      setError(validationError)
      setHighlightInput(true)
    }
  }

  return {
    validate$: validate,
    Input$: (props: Parameters<typeof InputComponent>[0]) => (
      <>
        <InputComponent 
          {...props}
          class={highlightInput() ? input__input : ""} 
          onChange$={setValue} 
        />
        <Show when={error()}>
          <span class={input__errorText}>
            {error()}
          </span>
        </Show>
      </>
    )
  }
}

export type InputWrapHandler<T extends any> = ReturnType<typeof createInput<T>>
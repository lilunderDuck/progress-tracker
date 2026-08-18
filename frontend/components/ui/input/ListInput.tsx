import { css } from "molcss"
import { BsPlus, BsX } from "solid-icons/bs"
import { type Component, createSignal, Index, type JSX, Show, splitProps } from "solid-js"
// ...
import { Tooltip } from "../Tooltip"
import { Button } from "../Button"
import { BaseOnChangeHandler } from "../../../hook"
import { Label } from "../Label"

const input__createButtonWrapper = css`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const input__input = css`
  width: 100%;
  background-color: var(--base);
  padding-inline: 10px;
  padding-block: 5px;
`

interface IListInputComponentProps {
  value?: string
  placeholder?: string
  onInput?: JSX.EventHandler<HTMLInputElement, InputEvent>
  onDelete$(): void
  disabled?: boolean
  id?: string
}

interface IListInputProps extends BaseOnChangeHandler<string[]> {
  value?: string[]
  label?: string
  inputComponent$: Component<IListInputComponentProps>
  inputPlaceholder$?: string
}

export function ListInput(props: IListInputProps) {
  // Initialize state directly from props. Default to an array with one empty string.
  const [values, setValues] = createSignal(props.value ?? [''])

  const fireInputEvent = (currentValues: string[]) => {
    props.onChange$(currentValues)
  }

  const addInput = () => {
    setValues(prev => {
      const next = [...prev, '']
      fireInputEvent(next)
      return next
    })
  }

  const deleteInputByIndex = (index: number) => {
    setValues(prev => {
      const next = prev.filter((_, i) => i !== index)
      const final = next.length === 0 ? [''] : next
      fireInputEvent(final)
      return final
    })
  }

  const getRowInputId = () => `li_${Math.floor(Math.random() * 100_000)}`

  return (
    <section>
      <Label>
        {props.label}
      </Label>
      
      {/* Index is used here because strings can be identical ('') */}
      <Index each={values()}>
        {(inputValue, inputIndex) => (
          <props.inputComponent$ 
            id={getRowInputId()}
            value={inputValue()} // Index passes inputValue as a signal accessor
            placeholder={props.inputPlaceholder$}
            onInput={(inputEvent) => {
              const newValue = inputEvent.currentTarget.value
              
              setValues(prev => {
                const next = [...prev]
                next[inputIndex] = newValue // inputIndex is just a raw number in <Index>
                fireInputEvent(next)
                return next
              })
            }}
            onDelete$={() => deleteInputByIndex(inputIndex)}
            disabled={values().length === 1}
          />
        )}
      </Index>

      <div class={input__createButtonWrapper}>
        <Button onClick={addInput}>
          <BsPlus /> Add row
        </Button>
      </div>
    </section>
  )
}

export function DefaultTextListInput(props: IListInputComponentProps) {
  const [, itsProps] = splitProps(props, ["onDelete$", "disabled"])

  return (
    <div class={css`display: flex; align-items: center; gap: 10px; padding-bottom: 10px;`}>
      <input
        {...itsProps}
        class={input__input}
        onChange={(e) => e.preventDefault()}
      />
      <Show when={!props.disabled}>
        <Tooltip label$="Delete row" placement$="right">
          <Button type$="icon$" onClick={props.onDelete$}>
            <BsX />
          </Button>
        </Tooltip>
      </Show>
    </div>
  )
}
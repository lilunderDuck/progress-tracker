import { createSignal } from "solid-js"
// ...
import "./SwitchInput.css"
import { css } from "molcss"

const switch__this = css`
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);
  &[data-switch-disabled=true] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-switch-disabled=false] {
    cursor: pointer;
  }
`

const switch__input = css`
  opacity: 0;
  width: 0;
  height: 0;
`

const switch__slider = css`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--switch-inactive-color);
  border-radius: 6px;
  &::before {
    position: absolute;
    content: "";
    height: var(--switch-slider-bound);
    width: var(--switch-slider-bound);
    left: 4px;
    bottom: 4px;
    border-radius: 50%;
  }
`

interface ISwitchInputProps {
  value$?: boolean
  onChange$(value: boolean): any
  disabled$?: boolean
}

export function SwitchInput(props: ISwitchInputProps) {
  const [state, setState] = createSignal(props.value$ ?? false)

  return (
    <label class={switch__this} data-switch-disabled={props.disabled$ ?? false} data-switch>
      <input 
        class={switch__input} 
        type="checkbox"
        id="switch__input"
        checked={state()}
        disabled={props.disabled$}
        onChange={() => {
          setState(prev => !prev)
          props.onChange$(state())
        }}
      />
      <span 
        class={switch__slider}
        id="switch__slider"
      />
    </label>
  )
}
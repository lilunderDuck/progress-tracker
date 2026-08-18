import { css } from "molcss"
import { JSX } from "solid-js/jsx-runtime"

const input = css`
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--surface0);
`

export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input 
      {...props} 
      autocomplete="off"
      autocorrect="off" 
      aria-autocomplete="none"
      class={`${input} shutup_edge_autocomplete ${props.class ?? ""}`} 
    />
  )
}
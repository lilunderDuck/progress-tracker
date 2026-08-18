import { css } from "molcss";
import { JSX } from "solid-js/jsx-runtime";

const label__root = css`
  font-weight: bold;
  user-select: none;
  display: block;
`

export function Label(props: JSX.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label 
      {...props} 
      class={`${label__root} ${props.class ?? ""}`} 
    />
  )
}
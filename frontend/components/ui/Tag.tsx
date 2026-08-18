import { ParentProps } from "solid-js"
// ...
import { css } from "molcss"

const tableHeader__tag = css`
  background-color: var(--tag-color);
  color: var(--tag-text-color);
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding-inline: 7px;
  padding-block: 2px;
  width: fit-content;
  border-radius: 6px;
`

export interface ITagProps {
  color$: string
  textColor$?: string
}

export function Tag(props: ParentProps<ITagProps>) {
  return (
    <div 
      class={tableHeader__tag} 
      style={`--tag-color:${props.color$};--tag-text-color:${props.textColor$ ?? "var(--crust)"}`}
    >
      {props.children}
    </div>
  )
}
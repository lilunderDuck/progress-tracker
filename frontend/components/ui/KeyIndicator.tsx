import { css } from "molcss";

export function KeyIndicator(props: { key$: string, description$: string }) {
  return (
    <div class={css`
      display: flex;
      align-items: center;
      gap: 5px;
      user-select: none;
      border-radius: 6px;
    `}>
      <span class={css`padding-inline: 5px; padding-block: 5px; background-color: var(--sky); color: var(--crust); flex-shrink: 0;`}>{props.key$}</span>
      <span>{props.description$}</span>
    </div>
  )
}
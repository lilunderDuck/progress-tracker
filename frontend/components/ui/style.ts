import { css } from "molcss";

export const allowFocusRing = css`
  outline: 4px solid transparent;
  &:focus-visible {
    outline-color: var(--sky);
  }
`
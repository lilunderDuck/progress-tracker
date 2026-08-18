import { JSX, splitProps } from "solid-js"
// ...
import { css } from "molcss"

const button = css`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  outline: 4px solid transparent;
  color: var(--button-text-color);
  user-select: none;
  background-color: var(--button-background-color);
  &:not(:disabled):hover {
    background-color: var(--button-hover-background-color);
    color: var(--button-hover-text-color);
  }

  &:disabled {
    opacity: 0.6;
  }
`

const BUTTON_TYPE_MAPPING = {
  icon$: css`
    width: 30px;
    height: 30px;
  `,
  default$: css`
    padding-inline: 10px;
    padding-block: 5px;
  `
}

const BUTTON_VARIANT_MAPPING = {
  default$: ["var(--surface0)", "var(--surface2)", "var(--overlay2)", "var(--text)"],
  secondary$: ["var(--sky)", "var(--sapphire)", "var(--surface0)", "var(--crust)"],
  danger$: ["var(--maroon)", "var(--red)", "var(--surface0)", "var(--crust)"],
  warning$: ["var(--yellow)", "var(--peach)", "var(--surface0)", "var(--crust)"]
}

interface IButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant$?: keyof typeof BUTTON_VARIANT_MAPPING
  type$?: keyof typeof BUTTON_TYPE_MAPPING
}

export function Button(props: IButtonProps) {
  const [, itsProps] = splitProps(props, ["variant$", "type$"])

  const [buttonBg, buttonBgHovered, buttonTextColor, buttonTextHoveredColor] = BUTTON_VARIANT_MAPPING[props.variant$ ?? "default$"]

  return (
    <button 
      {...itsProps} 
      class={`${button} ${BUTTON_TYPE_MAPPING[props.type$ ?? "default$"]} ${props.class ?? ""}`}
      style={`--button-text-color:${buttonTextColor};--button-background-color:${buttonBg}; --button-hover-background-color:${buttonBgHovered};--button-hover-text-color:${buttonTextHoveredColor}`} 
    />
  )
}
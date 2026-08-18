import { Anchor, Arrow, Content, Portal, Root, RootProps, Trigger } from "@corvu/tooltip"
import { css } from "molcss"
import { type ParentProps, type JSX, Show } from "solid-js"

const tooltip__content = css`
  background-color: var(--crust);
  padding-inline: 10px;
  padding-block: 5px;
  max-width: 30rem;
  border: 3px solid var(--tooltip-outline-color);
  user-select: none;
`

interface ITooltipProps {
  label$: JSX.Element
  placement$?: RootProps["placement"]
  outlineColor$?: string
  anchorClass$?: string
}

export function Tooltip(props: ParentProps<ITooltipProps>) {
  return (
    <Show when={props.label$} fallback={props.children}>
      <Root openDelay={500} closeDelay={0} placement={props.placement$} floatingOptions={{
        offset: {
          // confusing name for "tooltipOffset", my god
          mainAxis: 15
        },
        flip: true,
        shift: true
      }}>
        <Anchor class={props.anchorClass$}>
          <Trigger as="div">
            {props.children}
          </Trigger>
        </Anchor>
        <Portal>
          <Content class={tooltip__content} style={`--tooltip-outline-color:${props.outlineColor$ ?? "var(--surface2)"}`}>
            {props.label$}
            <Arrow class={css`color: var(--tooltip-outline-color); `} />
          </Content>
        </Portal>
      </Root>
    </Show>
  )
}
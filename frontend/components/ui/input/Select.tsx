import { Anchor, Content, Portal, Root } from "@corvu/popover"
import { Component, createMemo, createSignal, For, Show } from "solid-js"
import { FaSolidCheck } from "solid-icons/fa"
// ...
import { css } from "molcss"
// ...
import { Label } from "../Label"
import { Button } from "../Button"
import { BaseOnChangeHandler } from "../../../hook"

const select__root = css`
  padding-bottom: 10px;
`

const select__content = css`
  padding-inline: 10px;
  padding-block: 5px;
  width: 100%;
  background-color: var(--base);
  margin-top: 5px;
  user-select: none;
  text-align: left;
  `

const select__popoverContent = css`
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--crust);
  border: 4px solid var(--surface0);
  max-height: 18rem;
  border-radius: 6px;
`

const select__item = css`
  width: 100%;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 15px;
  padding-inline: 10px;
  padding-block: 3px;
  user-select: none;
  border-radius: 6px;
`

const select__itemDisabled = css`
  color: var(--overlay1);
  cursor: not-allowed;
`

const select__itemSelected = css`
  background-color: var(--surface1);
`

const select__itemNotSelected = css`
  &:hover {
    background-color: var(--surface0);
  }
`

export type SelectItemComponentProps<T> = { item$: T }

export type SelectItemDisablingRule<T extends string | number> = Record<T, boolean>

export interface ISelectProps<T extends string | number> extends BaseOnChangeHandler<T[] | T> {
  multiple$: boolean
  displayTotalOnly$?: boolean
  value?: T[] | T
  allOptions$: T[]
  label$?: string
  popoverContentWidth$: string
  ItemComponent$: Component<SelectItemComponentProps<T>>
  ItemSelectedComponent$?: Component<SelectItemComponentProps<T> & {
    totalItems$: number
  }>
  itemDisablingRuleRegistry$?: IncompatibilityRuleRegistry<T>
}

export type IncompatibilityRuleRegistry<T extends string | number> = {
  ifInclude$: T
  thenDisables$: T[]
}[]

// oh god, what have I done...

export function Select<T extends string | number>(props: ISelectProps<T>) {
  if (import.meta.env.DEV) {
    if (props.displayTotalOnly$ && props.ItemSelectedComponent$) {
      console.warn("It's a bit reduntant to use both of displayTotalOnly$={true} and ItemSelectedComponent$={...} in <Select />.\n\nTry checking all of your <Select /> that used both displayTotalOnly$ and ItemSelectedComponent$, then delete this -> ItemSelectedComponent$={...}.")
    }

    if (!props.displayTotalOnly$ && !props.ItemSelectedComponent$) {
      console.error(
        "Missing ItemSelectedComponent$ option in <Select /> components. Did you want to only display the total items only? If so, try setting displayTotalOnly$ to true. If not, include ItemSelectedComponent$ too."
      )
    }
  }

  const [selectedValues, setSelectedValues] = createSignal(
    Array.isArray(props.value) ?
      props.value : 
      typeof props.value === "undefined" ? [] : [props.value]
  )

  console.log("current selected values are:", selectedValues(), "that has the type of:", typeof props.value)

  const [isOpened, setIsOpened] = createSignal(false)

  const isSelected = (item: T) => selectedValues().includes(item)
  const isItemDisabled = (item: T) => optionsDisabled()[item] ?? false

  const toggleChooseItem = (item: T) => {
    if (isItemDisabled(item)) return console.log(`item "${item}" is disabled.`)

    if (!props.multiple$) {
      const isExactItem = item === selectedValues()[0]
      isExactItem ? setSelectedValues([]) : setSelectedValues([item])
      closeItemSelectPopover()
    } else {
      setSelectedValues(prev => {
        return isSelected(item) ? prev.filter(it => it !== item) : [...prev, item]
      })
    }

    callOnInputEvent()
  }

  const closeItemSelectPopover = () => {
    console.log("closing select dialog")
    setIsOpened(false)
  }

  const callOnInputEvent = () => {
    props.onChange$(props.multiple$ ? selectedValues() : selectedValues()[0])
  }

  const computeDisablingRulesByRegistry = (
    selectedItems: T[],
    allOptions: T[],
    registry = props.itemDisablingRuleRegistry$!
  ): SelectItemDisablingRule<T> => {
    if (!registry) {
      return {} as SelectItemDisablingRule<T>
    }
    
    const disabledMap = {} as SelectItemDisablingRule<T>
    for (const item of allOptions) {
      disabledMap[item] = false
    }

    if (!registry) return disabledMap
    const selectedSet = new Set(selectedItems)

    for (const rule of registry) {
      const isIfIncluded = selectedSet.has(rule.ifInclude$)

      // Forward rule: if selected -> disable targets
      if (isIfIncluded) {
        for (const target of rule.thenDisables$) {
          disabledMap[target] = true
        }
      }

      // Bidirectional rule (if target is selected -> disable ifInclude$)
      const isAnyTargetSelected = rule.thenDisables$.some((target) => selectedSet.has(target))
      if (isAnyTargetSelected) {
        disabledMap[rule.ifInclude$] = true
      }
    }

    console.log("computed disabling map:", disabledMap)

    return disabledMap
  }

  const optionsDisabled = createMemo(() => {
    return computeDisablingRulesByRegistry(
      selectedValues(),
      props.allOptions$,
      props.itemDisablingRuleRegistry$
    )
  })

  const getItemSelectStateClasses = (item: T) => {
    const selectedClass = isSelected(item) ? select__itemSelected : select__itemNotSelected
    return isItemDisabled(item) ? select__itemDisabled : selectedClass
  }

  return (
    <Root open={isOpened()}>
      <Anchor>
        <section class={select__root}>
          <Label>
            {props.label$}
          </Label>
          <button class={select__content} onClick={() => setIsOpened(prev => !prev)}>
            <Show when={props.displayTotalOnly$} fallback={
              <For each={selectedValues()} fallback={(
                <span class={css`color: var(--subtext0);`}>Empty</span>
              )}>
                {/* @ts-ignore - already checked props.ItemSelectedComponent$ for undefined */}
                {it => <props.ItemSelectedComponent$ item$={it} totalItems$={selectedValues().length} />}
              </For>
            }>
              Selected {selectedValues().length} item(s).
            </Show>
          </button>
        </section>
      </Anchor>
      <Portal>
        <Content 
          class={`${select__popoverContent} scrollbar scrollbar__vertical`} 
          style={`width:${props.popoverContentWidth$}`}
        >
          <Label class={css`margin-bottom: 5px;`}>
            Available options
          </Label>
          <For each={props.allOptions$}>
            {(it) => (
              <div 
                class={`${select__item} ${getItemSelectStateClasses(it)}`} 
                onClick={() => toggleChooseItem(it)}
              >
                <button class={css`width: 25px; height: 25px; flex-shrink: 0;`}>
                  <Show when={isSelected(it)}>
                    <FaSolidCheck />
                  </Show>
                </button>
                
                <props.ItemComponent$ item$={it} />
              </div>
            )}
          </For>

          <div class={css`display: flex; justify-content: flex-end;`}>
            <Button variant$="secondary$" onClick={closeItemSelectPopover}>
              Close
            </Button>
          </div>
        </Content>
      </Portal>
    </Root>
  )
}
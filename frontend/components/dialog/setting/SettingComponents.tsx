import { ParentProps } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
// ...
import { css } from "molcss"
// ...
import { ISelectProps, Select, SwitchInput, Tooltip } from "../../ui"
import { ISettingData, useSettingContext } from "../../../features/global"

const dialog__section = css`
  padding-inline: 10px;
  padding-block: 5px;
  margin-bottom: 5px;
  &.section__disabled {
    opacity: 0.7;
  }

  & .section__description {
    margin-top: 3px;
  }
`

const dialog__switchSection = css`
  display: flex;
  align-items: flex-start;
  gap: 10px;
`

const dialog__customSection = css`
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`

interface IBaseSettingProps {
  name$: JSX.Element
  description$?: JSX.Element
}

interface ISettingDialogLineProps extends IBaseSettingProps {
  disabled$?: boolean
  key$: keyof ISettingData
  defaultValue$?: boolean
  inputTooltip$?: JSX.Element
}

export function SettingDialogSwitchSection(props: ParentProps<ISettingDialogLineProps>) {
  const { setting$, updateSetting$ } = useSettingContext()

  return (
    <section class={`${dialog__section} ${dialog__switchSection} ${props.disabled$ ? "section__disabled" : "section__notDisabled"}`}>
      <div class={css`flex-basis: 100%;`}>
        <h4 class="section__name">
          {props.name$}
        </h4>
        <p class="section__description">
          {props.description$}
        </p>
      </div>
      <div>
        <Tooltip label$={props.inputTooltip$} placement$="right">
          <SwitchInput 
            // @ts-ignore
            value$={setting$()[props.key$] || props.defaultValue$} 
            onChange$={(value) => {
              updateSetting$(props.key$, value)
            }}
            disabled$={props.disabled$}
          />
        </Tooltip>
      </div>
      {props.children}
    </section>
  )
}

export function SettingDialogCustomSection(props: ParentProps<Omit<ISettingDialogLineProps, "key$">>) {
  return (
    <section class={dialog__section}>
      <div class={dialog__customSection}>
        <h4 class="section__name">
          {props.name$}
        </h4>
        <p class="section__description">
          {props.description$}
        </p>
      </div>
      {props.children}
    </section>
  )
}

interface ISettingDialogButtonSectionProps extends IBaseSettingProps {
  disabled$?: boolean
}

export function SettingDialogButtonSection(props: ParentProps<ISettingDialogButtonSectionProps>) {
  return (
    <section class={`${dialog__section} ${dialog__switchSection} ${props.disabled$ ? "section__disabled" : "section__notDisabled"}`}>
      <div class={css`flex-basis: 100%;`}>
        <h4 class="section__name">
          {props.name$}
        </h4>
        <p class="section__description">
          {props.description$}
        </p>
      </div>
      <div>
        {props.children}
      </div>
    </section>
  )
}

interface ISettingDialogLockedInputSectionProps extends IBaseSettingProps {
  value$: string
}

export function SettingDialogLockedInputSection(props: ParentProps<ISettingDialogLockedInputSectionProps>) {
  return (
    <section class={`${dialog__section} ${dialog__switchSection} section__disabled`}>
      <div class={css`flex-basis: 100%;`}>
        <h4 class="section__name">{props.name$}</h4>
        <p class="section__description">{props.description$}</p>
      </div>
      <div>
        <span>{props.value$}</span>
      </div>
      {props.children}
    </section>
  )
}

interface ISettingDialogSelectSection<T extends string | number, U extends keyof ISettingData> extends IBaseSettingProps {
  key$: U
  selectProps$: Omit<ISelectProps<T>, "popoverContentWidth$" | "onChange$">
  children: (currentValue: ISettingData[U]) => JSX.Element
}

export function SettingDialogSelectSection<T extends string | number, U extends keyof ISettingData>(props: ISettingDialogSelectSection<T, U>) {
  const { setting$, updateSetting$ } = useSettingContext()

  return (
    <section class={dialog__section}>
      <div class={css`flex-basis: 100%;`}>
        <h4 class="section__name">{props.name$}</h4>
        <p class="section__description">{props.description$}</p>
      </div>
      <Select 
        {...props.selectProps$} 
        popoverContentWidth$="43rem"
        value={setting$()[props.key$]}
        onChange$={(value) => updateSetting$(props.key$, value)}
      />
      {props.children(setting$()[props.key$])}
    </section>
  )
}
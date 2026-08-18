import { css } from "molcss"
// ...
import { Button, IDialogContentProps, TabContent, TabHeader, TabRoot } from "../ui"

const dialog__content = css`
  width: 65%;
  user-select: none;
`

const dialog__section = css`
  padding-bottom: 15px;
  & p:not(:last-child) {
    padding-bottom: 10px;
  }
`

declare const APP_VERSION: string

export default function MoreInfoDialog(props: IDialogContentProps) {
  return (
    <div class={dialog__content}>
      <h1>Extra info</h1>

      <TabRoot pages$={[
        { name$: "Basically...", Page$: BasicInfoTab },
      ]}>
        <TabHeader />
        <TabContent />
      </TabRoot>

      <div class={css`display: flex; justify-content: flex-end;`}>
        <Button variant$="secondary$" onClick={props.close$}>
          Close
        </Button>
      </div>
    </div>
  )
}

function BasicInfoTab() {
  return (
    <>
      <section class={dialog__section}>
        <h3>Well...</h3>
        <p>This is just a <i>tiny-little-tracker-list-app</i> for tracking my anime/manga/light novel progress.</p>

        <p>
          Built with {"<3"} by using 
          <a href="https://www.solidjs.com/"><code>solid@1.9.5</code></a> and 
          <a href="https://go.dev/"><code>golang@1.26.2</code></a>. 
          The app version is <code>{APP_VERSION}</code>
        </p>

        <p>Hover your mouse all around the page for more info :)</p>
      </section>

      <section class={dialog__section}>
        <h3>Some personal words</h3>
        <p>
          I recommend you to <b>pick and try some of it here, blindly</b>, instead of watching a review from <i>some channels</i>. Not only you won't get spoiled, but you're also not being influenced by <i>those sneaky channels</i>.
        </p>

        <p>(If you're okay with spoilers, nice I guess?)</p>

        <p>For anyone that spying my progress list here (yup, you), just... try some of it for yourself, then make up your mind later.</p>
      </section>
    </>
  )
}
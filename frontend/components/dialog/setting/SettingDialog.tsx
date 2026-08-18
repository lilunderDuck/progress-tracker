import { css } from "molcss"
import "../../../assets/styles/scollbar.css"
// ...
import { Button, IDialogContentProps, Label, Tooltip } from "../../ui"
import { SettingDialogButtonSection, SettingDialogSwitchSection } from "./SettingComponents"
import { ProgressTrackerUndeterministicScoreCell } from "../../common"

const dialog__content = css`
  width: 45rem;
  user-select: none;
`

const dialog__settingContent = css`
  overflow-y: auto;
`

const dialog__settingDivider = css`
  border-radius: 6px;
  width: -webkit-fill-available;
  padding: 5px;
  margin: 10px;
  color: var(--crust);
  display: flex;
  justify-content: center;
  align-items: center;
`

const dialog__settingDividerMain = css`
  background-color: var(--sapphire);
`

const dialog__settingDividerTracker = css`
  background-color: var(--yellow);
`

export default function SettingDialog(props: IDialogContentProps) {
  return (
    <div class={dialog__content}>
      <h2>Settings</h2>
      
      <div class={`${dialog__settingContent} scrollbar scrollbar__vertical scrollbar__invs`}>
        <div class={`${dialog__settingDivider} ${dialog__settingDividerMain}`}>
          Main stuff
        </div>

        <SettingDialogSwitchSection 
          name$="Dark mode"
          description$="The app must remain to stay in the dark, otherwise your eyes will explode into bits"
          key$="__dummyDiscard__$"
          defaultValue$={true}
          disabled$={true}
          inputTooltip$="You shouldn't"
        />
        <SettingDialogSwitchSection 
          name$="Hide public scores column"
          description$={<i>You know what this does</i>}
          key$="hidePublicScores"
        />
        <SettingDialogButtonSection 
          name$={"\"Where's this tracker list saved data?\""}
          description$="Take me to the tracker list saved data location!"
        >
          <Button>
            Show it on file explorer
          </Button>
        </SettingDialogButtonSection>

        <div class={`${dialog__settingDivider} ${dialog__settingDividerTracker}`}>
          This tracker
        </div>

        <SettingDialogSwitchSection 
          name$="Undeterministic score"
          description$={(
            <div class={css`display: flex; align-items: center; gap: 5px; flex-wrap: wrap;`}>
              If your manga entry include
              <Tooltip label$={(
                <>
                  <Label>Notes</Label>
                  <ul class={css`padding-left: 15px;`}>
                    <li>
                      <b class="scoreNote_name">This is a one-shot</b>
                      <p class="scoreNote_description">(.statement) - a one chapter story only, and usually a short story.</p>
                    </li>
                  </ul>
                </>
              )}>
                <a>[this note]</a>
              </Tooltip>
              , your personal rating will turn into <ProgressTrackerUndeterministicScoreCell />
            </div>
          )}
          key$="anime_showUndeterministicScore"
        />
      </div>
      
      <div class={css`display: flex; justify-content: flex-end;`}>
        <Button variant$="secondary$" onClick={props.close$}>
          Close
        </Button>
      </div>
    </div>
  )
}
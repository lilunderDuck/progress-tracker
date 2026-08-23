import { css } from "molcss";
import { Tooltip } from "../../components";
import { Match, Switch } from "solid-js";
import { useGlobalContext } from "./GlobalProvider";
import { ServerStatus } from "./type";
import { SpinningCube } from "../../components/loader";

export function ServerStatusIndicator() {
  const { serverStatus$ } = useGlobalContext()
  return (
    <Switch>
      <Match when={serverStatus$() === ServerStatus.DEAD}>
        <Tooltip label$={"Quick fix is just to close this tab and run the app again."}>
          <div class={css`
            display: flex;
            justify-content: center;
            align-items: center;
            min-width: 180px;
            background-color: var(--red);
            height: 30px;
            color: var(--crust);
            padding-inline: 10px;
            flex-shrink: 0;
            border-top-left-radius: 6px;
          `}>server is not alive!!</div>
        </Tooltip>
      </Match>
      <Match when={serverStatus$() === ServerStatus.STARTING}>
        <div class={css`
          display: flex;
          justify-content: center;
          align-items: center;
          min-width: 200px;
          background-color: var(--teal);
          height: 30px;
          gap: 15px;
          color: var(--crust);
          padding-inline: 10px;
          flex-shrink: 0;
          border-top-left-radius: 6px;
        `}>
          <SpinningCube cubeSize$={20} />
          server is starting...
        </div>
      </Match>
    </Switch>
  )
}
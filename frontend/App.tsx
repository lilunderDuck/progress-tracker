import { For, lazy, Match, Switch } from "solid-js"
// ...
import { ProgressTrackerBottomBar, ProgressTrackerMenuDialog, ProgressTrackerType, useGlobalContext } from "./features/global"
import { HEARTBEAT_ROUTE } from "./api"

export default function App() {
  // const [serverNotAliveIndicator, setServerNotAliveIndicator] = createSignal(true)
  // if (!import.meta.env.DEV) {
  //   startHeartbeat(
  //     () => setServerNotAliveIndicator(false),
  //     () => setServerNotAliveIndicator(true),
  //   )
  //   setServerNotAliveIndicator(false)
  // } else {
  //   setServerNotAliveIndicator(false)
  //   console.log("heartbeat system is disabled in deverlopment mode, please manually start the server.")
  // }

  const { currentPage$ } = useGlobalContext()

  const PROGRESS_TRACKER_PAGES_REGISTRY = [
    [ProgressTrackerType.ANIME, lazy(() => import("./features/anime"))],
    [ProgressTrackerType.FILM, lazy(() => import("./features/films"))]
  ] as const

  return (
    <>
      {/* <section class={css`display: flex; align-items: center; gap: 5px; flex-wrap: wrap;`}>
        <Dialog dialogContent$={MoreInfoDialog}>
          <Button>
            I need more info please!
          </Button>
        </Dialog>
      </section> */}

      <Switch>
        <For each={PROGRESS_TRACKER_PAGES_REGISTRY}>
          {([currentPage, PageComponent]) => (
            <Match when={currentPage === currentPage$()}>
              <PageComponent />
            </Match>
          )}
        </For>
      </Switch>
      
      <ProgressTrackerBottomBar>
        {/* <Show when={serverNotAliveIndicator()}>
          <div class={css`
            display: flex;
            justify-content: center;
            align-items: center;
            width: fit-content;
            background-color: var(--red);
            height: 30px;
            color: var(--crust);
            padding-inline: 10px;
            flex-shrink: 0;
          `}>server is not alive!!</div>
        </Show> */}
      </ProgressTrackerBottomBar>
      <ProgressTrackerMenuDialog />
    </>
  )
}

function startHeartbeat(onAlive: () => void, onDead: () => void) {
  const emptyBlob = new Blob([], { type: 'application/octet-stream' });
  
  const heartbeat = async() => {
    try {
      await fetch(HEARTBEAT_ROUTE, {
        method: "POST",
        body: emptyBlob, // heartbeat requires 0-byte and 1 cable signal to send
        keepalive: true
      })
      onAlive()
    } catch (error) {
      console.error(error)
      onDead()
    }
  }

  // Erm akshually, this is just a fancy way of yelling to the 
  // server in (roughly) 3-second interval.
  // 
  // Normally, setInterval() works, but then you go to another tab,
  // the browser do a lot of weird tricks to optimize stuff, and that weird
  // trick somehow causes setInterval() to not... interval-ing,
  // and you know what happens if we don't yell to the server.
  // 
  // To prevent that, we can deploy some Worker to do some background task for us,
  // it seems like the broswer don't do the weird tricks inside a Worker
  const MESSAGE_FOR_MAIN_THREAD = "[...] ThreadedAnvilChunkStorage is a file storage format. It brings a list of changes and improvements over from the previous file format."
  const workerUrl = URL.createObjectURL(new Blob(
    [`setInterval(()=>postMessage("${MESSAGE_FOR_MAIN_THREAD}"),3000)`], 
    { type: 'application/javascript' }
  ))

  // highly specific name, even my friend can understand what this does.
  // try going to the "memory" tab and check what you have.
  // also, it does not show in deverlopment mode :)
  const worker = new Worker(workerUrl, {
    name: "keep the server alive or else the server will detonate (with the power of a small nuclear device)" 
  })

  heartbeat()
  worker.onmessage = heartbeat
}
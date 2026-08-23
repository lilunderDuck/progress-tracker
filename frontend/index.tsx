/* @refresh reload */
import { render } from 'solid-js/web'
import 'solid-devtools'
import "molcss/style.css"
import "./assets/styles/index.css"
import "./assets/styles/scollbar.css"

import "./debug_hook"

import App from './App'
import { GlobalProvider } from './features/global'

render(() => (
  <GlobalProvider>
    <App />
  </GlobalProvider>
), document.getElementById('root')!)

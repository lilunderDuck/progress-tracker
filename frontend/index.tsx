/* @refresh reload */
import { render } from 'solid-js/web'
import 'solid-devtools'
import "molcss/style.css"
import "./assets/styles/index.css"
import "./assets/styles/scollbar.css"

import "./debug_hook"

import App from './App'
import { SettingProvider } from './features/global'

render(() => (
  <SettingProvider>
    <App />
  </SettingProvider>
), document.getElementById('root')!)

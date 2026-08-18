import { lazy } from "solid-js"

export * from "./ui"
export * from "./common"

export const MoreInfoDialog = lazy(() => import("./dialog/MoreInfoDialog"))
export const SettingDialog = lazy(() => import("./dialog/setting/SettingDialog"))
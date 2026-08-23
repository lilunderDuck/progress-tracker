import { lazy } from "solid-js"

export * from "./ui"
export * from "./common"

export const MoreInfoDialog = lazy(() => import("./dialog/MoreInfoDialog"))

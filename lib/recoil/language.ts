import { atom } from "recoil"

export const language = atom<"ko"|"en">({
    key:'language',
    default: "ko"
})
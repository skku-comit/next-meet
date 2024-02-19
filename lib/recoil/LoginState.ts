import { User } from "@/template/User"
import { atom } from "recoil"

export const loginState = atom<User|null>({
    key:'loginState',
    default: null
})
import { atom, RecoilEnv } from "recoil";
RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false;

export const language = atom<"ko"|"en">({
    key:'language',
    default: "ko"
});
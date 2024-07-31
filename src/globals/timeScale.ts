import { atom } from "jotai";

export const currentTimeAtom = atom<{
  start: number;
  end: number;
  type: string;
}>({
  start: 4000,
  end: 0,
  type: "",
});

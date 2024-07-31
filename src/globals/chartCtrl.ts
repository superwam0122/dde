import { atom } from "jotai";

export const brush = atom<{
  start: boolean | null;
}>({
  start: false,
});

export const zoomSelect = atom<{
  start: boolean | null;
}>({
  start: false,
});

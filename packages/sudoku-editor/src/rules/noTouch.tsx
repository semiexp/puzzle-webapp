import { Rule } from "../rule";

type NoTouchState = object;
type NoTouchData = object;

export const noTouchRule: Rule<NoTouchState, NoTouchData> = {
  name: "noTouch",
  initialState: {},
  initialData: () => {
    return {};
  },
  eventTypes: [],
  reducer: () => {
    return {};
  },
  render: () => {
    return [];
  },
  render2: () => {
    return [];
  },
  exportToPenpa: () => {
    return { items: [], margin: 0 };
  },
};

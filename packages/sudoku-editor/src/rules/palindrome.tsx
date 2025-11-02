import { Rule, PRIORITY_PALINDROME, RenderOptions2 } from "../rule";
import { reducerForLines } from "./linesUtil";
import { Item } from "../penpaExporter";
import { BoardItem } from "puzzle-board";

type Palindrome = { y: number; x: number }[];

type PalindromeState = {
  currentPalindrome: Palindrome | null;
};

type PalindromeData = {
  palindromes: Palindrome[];
};

export const palindromeRule: Rule<PalindromeState, PalindromeData> = {
  name: "palindrome",
  initialState: { currentPalindrome: null },
  initialData: () => ({
    palindromes: [],
  }),
  eventTypes: ["cellMouseDown", "cellMouseMove", "mouseUp"],
  reducer: (state, data, event, info) => {
    return reducerForLines(
      state,
      data,
      "currentPalindrome",
      "palindromes",
      event,
      info,
    );
  },
  render: (state, data, _options: RenderOptions2) => {
    const items: BoardItem[] = [];

    const addPalindrome = (palindrome: Palindrome, color: string) => {
      for (let j = 0; j < palindrome.length - 1; ++j) {
        const start = palindrome[j];
        const end = palindrome[j + 1];

        items.push({
          y: start.y * 2 + 1,
          x: start.x * 2 + 1,
          color: color,
          item: {
            kind: "lineTo",
            destY: end.y * 2 + 1,
            destX: end.x * 2 + 1,
          },
        });
      }
    };

    for (let i = 0; i < data.palindromes.length; ++i) {
      addPalindrome(data.palindromes[i], "rgb(176, 176, 176)");
    }
    if (state && state.currentPalindrome) {
      addPalindrome(state.currentPalindrome, "rgb(176, 176, 255)");
    }

    return [
      {
        priority: PRIORITY_PALINDROME,
        item: items,
      },
    ];
  },
  exportToPenpa: (data) => {
    const items: Item[] = [];

    for (const palindrome of data.palindromes) {
      for (let i = 0; i < palindrome.length - 1; ++i) {
        items.push({
          kind: "line",
          position1: palindrome[i],
          position2: palindrome[i + 1],
          style: 5,
        });
      }
    }

    return { items, margin: 0 };
  },
};

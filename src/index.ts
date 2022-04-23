import { JSDOM } from "jsdom";
import { Enumerable } from "@frank-mayer/magic";
import type { IProcess } from "./Elements/IProcess";
import { processFor } from "./Elements/processFor";
import { processFetch } from "./Elements/processFetch";
import { varInsert } from "./Elements/processHelpers";
import { processDefine } from "./Elements/processDefine";

const processMap = new Map<string, IProcess>([
  ["FOR", processFor],
  ["FETCH", processFetch],
  ["DEFINE", processDefine],
]);
const selector = Enumerable.from(processMap)
  .select((x) => x[0])
  .join(",");

export const yahp = async (source: string) => {
  const rootEl = new JSDOM(source).window.document.documentElement;

  const variables = new Map<string, any>();

  let el: HTMLElement | null;
  while ((el = rootEl.querySelector(selector))) {
    const fun = processMap.get(el.tagName.toUpperCase())!;
    el.outerHTML = await fun(el, variables);
  }

  return varInsert(rootEl.outerHTML, variables)
    .replace(/[\r\n]+^\s*$/gm, "")
    .replace(/^\s+/gm, "");
};

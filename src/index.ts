import { JSDOM } from "jsdom";
import { Enumerable } from "@frank-mayer/magic";
import type { IProcess } from "./Elements/IProcess";
import { processFor } from "./Elements/processFor";
import { processFetch } from "./Elements/processFetch";
import { varInsert } from "./Elements/processHelpers";
import { processDefine } from "./Elements/processDefine";
import { processIf } from "./Elements/processIf";

const processMap = new Map<string, IProcess>([
  ["DEFINE", processDefine],
  ["FETCH", processFetch],
  ["FOR", processFor],
  ["IF", processIf],
]);
const selector = Enumerable.from(processMap)
  .select((x) => x[0])
  .join(",");

export const yahp = async (source: string, debug: boolean = false) => {
  const variables = new Map<string, any>();
  const dom = new JSDOM(varInsert(source, variables));

  const rootEl = dom.window.document.documentElement;
  const doctype = dom.window.document.doctype;
  const doctypeString = doctype
    ? doctype.publicId
      ? doctype.systemId
        ? `<!DOCTYPE ${doctype.name} PUBLIC "${doctype.publicId}" "${doctype.systemId}">`
        : `<!DOCTYPE ${doctype.name} PUBLIC "${doctype.publicId}">`
      : doctype.systemId
      ? `<!DOCTYPE ${doctype.name} SYSTEM "${doctype.systemId}">`
      : `<!DOCTYPE ${doctype.name}>`
    : "";

  let el: HTMLElement | null;
  while ((el = rootEl.querySelector(selector))) {
    if (debug) {
      console.debug(`Processing <${el.tagName}>`);
    }

    const fun = processMap.get(el.tagName)!;
    el.outerHTML = await fun(el, variables, debug);
  }

  return varInsert(doctypeString + rootEl.outerHTML, variables)
    .replace(/[\r\n]+^\s*$/gm, "")
    .replace(/^\s+/gm, "");
};

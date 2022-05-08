import { JSDOM } from "jsdom";
import { Enumerable, StringBuilder, describe } from "@frank-mayer/magic";
import type { IProcess } from "./Elements/IProcess";
import { varInsert, Node } from "./Elements/processHelpers";
import { processFor } from "./Elements/processFor";
import { processFetch } from "./Elements/processFetch";
import { processDefine } from "./Elements/processDefine";
import { processIf } from "./Elements/processIf";
import { processImport } from "./Elements/processImport";

const processMap = new Map<string, IProcess>([
  ["DEFINE", processDefine],
  ["FETCH", processFetch],
  ["FOR", processFor],
  ["IF", processIf],
  ["IMPORT", processImport],
]);

const selector = Enumerable.from(processMap)
  .select((x) => x[0])
  .join(",");

const stringifyHtml = (el: HTMLElement): string => {
  if (el.childElementCount !== 0) {
    const outSB = new StringBuilder();
    outSB.append(describe(el));
    for (const child of el.childNodes) {
      switch (child.nodeType) {
        case Node.TEXT_NODE:
          const text = child.textContent;
          if (text) {
            outSB.append(text);
          }
          break;
        case Node.ELEMENT_NODE:
          outSB.append(stringifyHtml(child as HTMLElement));
          break;
        case Node.COMMENT_NODE:
          outSB.append(`<!--${child.textContent}-->`);
          break;
      }
    }
    outSB.append(`</${el.tagName}>`);
    return outSB.toString();
  } else {
    return el.outerHTML;
  }
};

export const yahp = async (source: string, debug: boolean = false) => {
  const variables = new Map<string, any>();
  const dom = new JSDOM(await varInsert(source, variables));

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

  return (
    (doctypeString
      ? doctypeString +
        "\n" +
        (await varInsert(stringifyHtml(rootEl), variables))
      : await varInsert(stringifyHtml(rootEl), variables)
    ).replace(/^\s+$\n/gm, "") + "\n"
  );
};

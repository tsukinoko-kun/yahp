import { JSDOM } from "jsdom";
import { minify } from "html-minifier";
import { process } from "./process.js";
import type { IProcess } from "./Elements/IProcess.js";
import { processDefine } from "./Elements/processDefine.js";
import { processEval } from "./Elements/processEval.js";
import { processFetch } from "./Elements/processFetch.js";
import { processFor } from "./Elements/processFor.js";
import { processIf } from "./Elements/processIf.js";
import { processImport } from "./Elements/processImport.js";

const processMap = new Map<string, IProcess>([
  ["DEFINE", processDefine],
  ["SCRIPT", processEval],
  ["FETCH", processFetch],
  ["FOR", processFor],
  ["IF", processIf],
  ["IMPORT", processImport],
]);

// eslint-disable-next-line no-undef
(globalThis as any).processMap = processMap;
// eslint-disable-next-line no-undef
(globalThis as any).selector = "DEFINE,SCRIPT[eval],FETCH,FOR,IF,IMPORT";

export const yahp = async(source: string, debug = false) => {
  const dom = new JSDOM(source);

  const document = dom.window.document;
  const rootEl = document.documentElement;

  await process(rootEl, debug);

  return minify(
    /^<!DOCTYPE[^>]+>/.test(source)
      ? dom.serialize()
      : document.body.innerHTML.trim(),
    {
      caseSensitive: false,
      collapseBooleanAttributes: true,
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      keepClosingSlash: true,
      quoteCharacter: '"',
    }
  );
};

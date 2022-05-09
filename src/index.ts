import { JSDOM } from "jsdom";
import { minify } from "html-minifier";
import { process } from "./process";
import type { IProcess } from "./Elements/IProcess";
import { processDefine } from "./Elements/processDefine";
import { processEval } from "./Elements/processEval";
import { processFetch } from "./Elements/processFetch";
import { processFor } from "./Elements/processFor";
import { processIf } from "./Elements/processIf";
import { processImport } from "./Elements/processImport";
import { describe } from "@frank-mayer/magic";

const processMap = new Map<string, IProcess>([
  ["DEFINE", processDefine],
  ["SCRIPT", processEval],
  ["FETCH", processFetch],
  ["FOR", processFor],
  ["IF", processIf],
  ["IMPORT", processImport],
]);

(globalThis as any).processMap = processMap;

export const yahp = async (source: string, debug: boolean = false) => {
  const dom = new JSDOM(source);

  const document = dom.window.document;
  const rootEl = document.documentElement;

  console.debug(describe(rootEl));

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

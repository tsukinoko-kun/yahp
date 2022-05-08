import type { IProcess } from "./IProcess";
import { varInsert } from "./processHelpers";
import { resolve } from "path";

const loadModule = (id: string): Promise<any> => {
  if ("require" in globalThis) {
    return Function(`return Promise.resolve(require("${id}"))`)();
  } else {
    return Function(`return import("${id}")`)();
  }
};

/**
 * ```html
 *  <require var="{ Octokit }" from="@octokit/rest">
 *
 *  </require>
 * ```
 */
export const processImport: IProcess = async (
  el,
  variables,
  debug: boolean
) => {
  const varName = (el.getAttribute("var") ?? "").trim();
  if (!varName) {
    throw new Error('Missing "var" attribute');
  }

  let from = el.getAttribute("from");
  if (!from) {
    throw new Error('Missing "from" attribute');
  }

  if (from.startsWith(".")) {
    from = resolve(from);
  }

  if (debug) {
    console.debug("processRequire", from);
  }

  if (varName.startsWith("{") && varName.endsWith("}")) {
    const varNames = varName
      .slice(1, -1)
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    if (varNames.length !== 0) {
      const module = await loadModule(from);
      for (const key of varNames) {
        if (debug) {
          console.debug(`import { ${key} } from "${from}";`);
        }
        variables.set(key, module[key]);
      }
    }
  } else {
    if (debug) {
      console.debug(`import ${varName} from "${from}";`);
    }
    variables.set(varName, await loadModule(from));
  }

  return varInsert(el.innerHTML, variables);
};

import { describe, Enumerable } from "@frank-mayer/magic";

export const selfClosingTags = new Set([
  "AREA",
  "BASE",
  "BR",
  "COL",
  "EMBED",
  "HR",
  "IMG",
  "INPUT",
  "LINK",
  "META",
  "PARAM",
  "SOURCE",
  "TRACK",
  "WBR",
]);

const domThis = {} as { [key: string]: any };

export const AsyncFunction: <T = any>(
  ...args: Array<string>
) => (...args: Array<any>) => Promise<T> = Object.getPrototypeOf(
  async function () {}
).constructor;

export const parseArgs = <arg extends string>(
  el: Element,
  ...args: Array<arg>
): { [key in arg]: string } => {
  const result = {} as { [key in arg]: string };

  for (const arg of args) {
    if (el.hasAttribute(arg)) {
      const value = el.getAttribute(arg)!.trim();
      if (value.length > 0) {
        result[arg] = value;
      } else {
        throw new Error(`${arg} is empty in ${describe(el)}`);
      }
    } else {
      throw new Error(`Missing attribute ${arg} in ${describe(el)}`);
    }
  }

  return result;
};

function evalInContext(x: string) {
  return eval(x);
}

export const evaluate = async (x: string) =>
  await evalInContext.call(domThis, x);

const variableNameRegEx = /^[a-zßöäü$][a-zßöäü$]*$/iu;
export const set = (key: string, value: any) => {
  if (key.startsWith("{") && key.endsWith("}")) {
    const keys = Enumerable.from(key.slice(1, -1).split(","))
      .select((x) => x.trim())
      .where((x) => x.length > 0);

    for (const key of keys) {
      if (variableNameRegEx.test(key)) {
        domThis[key] = value[key];
      } else {
        throw new Error(`Invalid variable name ${key}`);
      }
    }
  } else {
    if (variableNameRegEx.test(key)) {
      domThis[key] = value;
    } else {
      throw new Error(`Invalid variable name ${key}`);
    }
  }
};

export const get = (key: string) => {
  if (key.startsWith("{") && key.endsWith("}")) {
    const keys = Enumerable.from(key.slice(1, -1).split(","))
      .select((x) => x.trim())
      .where((x) => x.length > 0);

    const result = {} as { [key in string]: any };
    for (const key of keys) {
      if (variableNameRegEx.test(key)) {
        result[key] = domThis[key];
      }
    }
    return result;
  } else {
    if (variableNameRegEx.test(key)) {
      return domThis[key];
    }

    throw new Error(`Invalid variable name ${key}`);
  }
};

export enum Node {
  ELEMENT_NODE = 1,
  ATTRIBUTE_NODE = 2,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  ENTITY_REFERENCE_NODE = 5,
  ENTITY_NODE = 6,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
  NOTATION_NODE = 12,
  DOCUMENT_POSITION_CONTAINED_BY = 16,
}

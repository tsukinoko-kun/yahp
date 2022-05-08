import { StringBuilder } from "@frank-mayer/magic";

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

const AsyncFunction: <T = any>(
  ...args: Array<string>
) => (...args: Array<any>) => Promise<T> = Object.getPrototypeOf(
  async function () {}
).constructor;

export const varInsert = async (html: string, variables: Map<string, any>) => {
  const newHtml = new StringBuilder();

  const split = html
    .split("{{")
    .map((x) => x.split("}}"))
    .flat();

  let i = 0;
  while (split.length !== 0) {
    if (i % 2 === 0) {
      newHtml.append(split.shift()!);
    } else {
      const expression = split.shift()!;
      try {
        await AsyncFunction(
          ...variables.keys(),
          `const val = await (${expression}); return typeof val === "string" ? val : typeof val === "undefined" ? "" : JSON.stringify(val);`
        )(...variables.values())
          .then((val) => newHtml.append(val))
          .catch((_) => newHtml.append(`{{${expression}}}`));
      } catch {
        newHtml.append(`{{${expression}}}`);
      }
    }

    i++;
  }

  return newHtml.toString();
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

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

const varInsertRegex = /\{\{(?:(?!:\}\}).)+\}\}/g;

export const varInsert = (html: string, variables: Map<string, any>) =>
  html.replace(varInsertRegex, (key) => {
    const expression = key.substring(2, key.length - 2);

    try {
      return Function(
        ...variables.keys(),
        `const val = (${expression}); return typeof val === "string" ? val : typeof val === "undefined" ? "" : JSON.stringify(val);`
      )(...variables.values());
    } catch {
      return key;
    }
  });

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

export function getCharWidth(fontSize: number, fontFamily: string) {
  const text = "hello";
  const element = document.createElement("div");
  element.innerText = text;
  element.style.fontSize = `${fontSize}px`;
  element.style.fontFamily = fontFamily;
  element.style.position = "absolute";
  element.style.visibility = "hidden";
  element.style.height = "auto";
  element.style.width = "auto";
  element.style.whiteSpace = "nowrap";
  document.body.appendChild(element);
  return Number(element.clientWidth) / text.length;
}

const getMaxLineLength = (code: string) =>
  Math.max(...code.split("\n").map(line => line.length));

export const getDimensions = (
  fontSize: number,
  fontFamily: string,
  code: string,
  resizedWidth: number | undefined,
  resizedHeight: number | undefined
) => {
  const charWidth = getCharWidth(fontSize, fontFamily);
  const defaultWidth = (charWidth + 2) * getMaxLineLength(code);
  const defaultHeight = code.split("\n").length * 20 + 50;
  console.log(
    "resizedHeight",
    resizedHeight,
    "resizedWidth",
    resizedWidth,
    "final width",
    resizedWidth || defaultWidth,
    "final height",
    Math.min(900, resizedHeight || defaultHeight)
  );

  const minWidth = 300;
  const minHeight = 100;
  return {
    width: Math.max(minWidth, resizedWidth || defaultWidth),
    height: Math.max(minHeight, Math.min(900, resizedHeight || defaultHeight))
  };
};

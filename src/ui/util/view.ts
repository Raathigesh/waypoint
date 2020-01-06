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

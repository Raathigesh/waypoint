import { types, Instance } from "mobx-state-tree";
import { DocumentSymbol } from "./DocumentSymbol";

export const Note = types
  .model("Note", {
    id: types.string,
    color: types.maybe(types.string),
    x: types.maybe(types.number),
    y: types.maybe(types.number),
    symbols: types.map(DocumentSymbol),
    height: types.maybe(types.number),
    width: types.maybe(types.number)
  })
  .volatile(self => ({
    ref: null,
    tempX: 0,
    tempY: 0
  }))
  .actions(self => {
    const setPosition = (x: number, y: number) => {
      self.x = x;
      self.y = y;
      self.tempX = x;
      self.tempY = y;
    };

    const setRef = (ref: any) => (self.ref = ref);

    const setSymbol = (symbol: Instance<typeof DocumentSymbol>) => {
      self.symbols.set(symbol.id, symbol);
    };

    const setDimensions = (
      height: number | undefined,
      width: number | undefined
    ) => {
      self.height = height;
      self.width = width;
    };

    return { setPosition, setRef, setSymbol, setDimensions };
  });

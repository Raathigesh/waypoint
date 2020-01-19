import { types } from "mobx-state-tree";

export const Note = types
  .model("Note", {
    id: types.string,
    color: types.maybe(types.string),
    x: types.maybe(types.number),
    y: types.maybe(types.number)
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

    return { setPosition, setRef };
  });

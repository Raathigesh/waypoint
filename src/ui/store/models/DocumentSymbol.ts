import { types, flow } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { DocumentLocation } from "./DocumentLocation";
import { getReferences } from "../services/search";
import { GqlMarkers } from "entities/GqlSymbolInformation";

export const Marker = types.model("Marker", {
  id: types.string,
  filePath: types.string,
  name: types.string,
  location: types.maybeNull(DocumentLocation),
  color: types.string
});

export const DocumentSymbol = types
  .model("DocumentSymbol", {
    id: types.string,
    name: types.string,
    filePath: types.string,
    kind: types.string,
    code: types.maybeNull(types.string),
    location: types.maybeNull(DocumentLocation),
    markers: types.array(Marker),
    references: types.array(Marker),
    color: types.maybe(types.string),
    createdForMarker: types.maybe(
      types.model({
        markerId: types.string,
        symbolId: types.string
      })
    ),
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

    const fetchReferences = flow(function*() {
      self.references.clear();

      const references = yield getReferences(self.filePath, self.name);

      references.forEach((reference: GqlMarkers) => {
        self.references?.push(
          Marker.create({
            id: nanoid(),
            filePath: reference.filePath,
            name: reference.name,
            location: {
              start: {
                column: reference?.location?.start?.column || 0,
                line: reference?.location?.start?.line || 0
              },
              end: {
                column: reference?.location?.end?.column || 0,
                line: reference?.location?.end?.line || 0
              }
            },
            color: ""
          })
        );
      });
    });

    return { setPosition, setRef, fetchReferences };
  });

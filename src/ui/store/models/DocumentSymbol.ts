import { types, flow } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { DocumentLocation } from "./DocumentLocation";
import { getReferences, getMarkers, getCode } from "../services/search";
import {
  GqlMarkers,
  GqlSymbolInformation
} from "entities/GqlSymbolInformation";

export const Marker = types
  .model("Marker", {
    id: types.string,
    filePath: types.string,
    name: types.string,
    location: types.maybeNull(DocumentLocation),
    color: types.string,
    connectedSymbol: types.maybe(types.string)
  })
  .actions(self => ({
    setColor(color: string) {
      self.color = color;
    }
  }));

export const DocumentSymbol = types
  .model("DocumentSymbol", {
    name: types.string,
    filePath: types.string,
    kind: types.maybe(types.string),
    code: types.maybeNull(types.string),
    location: types.maybeNull(DocumentLocation),
    markers: types.array(Marker),
    references: types.array(Marker),
    color: types.maybe(types.string),
    connections: types.array(types.string),
    x: types.maybe(types.number),
    y: types.maybe(types.number)
  })
  .volatile(self => ({
    ref: null,
    tempX: 0,
    tempY: 0
  }))
  .views(self => ({
    get id() {
      return btoa(`${self.filePath}-${self.name}`);
    }
  }))
  .actions(self => {
    const setPosition = (x: number, y: number) => {
      self.x = x;
      self.y = y;
      self.tempX = x;
      self.tempY = y;
    };

    const setRef = (ref: any) => (self.ref = ref);

    const fetchMarkers = flow(function*(
      markers: {
        id: string;
        color: string;
      }[]
    ) {
      const symbolWithMakers: GqlSymbolInformation = yield getMarkers(
        self.filePath,
        self.name
      );

      self.kind = symbolWithMakers.kind;
      self.location = {
        start: {
          column: symbolWithMakers?.location?.start?.column || 0,
          line: symbolWithMakers?.location?.start?.line || 0
        },
        end: {
          column: symbolWithMakers?.location?.end?.column || 0,
          line: symbolWithMakers?.location?.end?.line || 0
        }
      };

      (symbolWithMakers.markers || []).forEach(marker => {
        const idMarker = btoa(`${marker.filePath}:${marker.name}`);
        const colorForMaker = (markers || []).find(m => m.id === idMarker);
        const markerObj = Marker.create({
          id: idMarker,
          filePath: marker.filePath,
          name: marker.name,
          location: {
            start: {
              column: marker?.location?.start?.column || 0,
              line: marker?.location?.start?.line || 0
            },
            end: {
              column: marker?.location?.end?.column || 0,
              line: marker?.location?.end?.line || 0
            }
          },
          color: colorForMaker?.color || ""
        });

        self.markers.push(markerObj);
      });
    });

    const fetchCode = flow(function*() {
      const code: string = yield getCode(self.filePath, self.name);
      self.code = code;
    });

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

    const addConnection = (id: string) => {
      self.connections.push(id);
    };

    return {
      setPosition,
      fetchMarkers,
      setRef,
      fetchReferences,
      fetchCode,
      addConnection
    };
  });

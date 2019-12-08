import { types, flow } from "mobx-state-tree";
import { DocumentSymbol, Marker } from "./DocumentSymbol";
import {
  GqlSymbolInformation,
  GqlMarkers
} from "entities/GqlSymbolInformation";
import { getMarkers } from "../services/search";

export const DependencyGraph = types
  .model("DependencyGraph", {
    currentSymbol: types.maybeNull(DocumentSymbol),
    otherSymbols: types.map(DocumentSymbol)
  })
  .actions(self => {
    const setCurrentSymbol = (symbol: GqlSymbolInformation) => {
      self.currentSymbol = DocumentSymbol.create({
        id: symbol.id,
        name: symbol.name,
        filePath: symbol.filePath,
        kind: symbol.kind,
        code: symbol.code,
        markers: []
      });
    };

    const fetchMarkers = flow(function*(symbol: GqlSymbolInformation) {
      const symbolWithMakers: GqlSymbolInformation = yield getMarkers(
        symbol.filePath,
        symbol.name
      );

      (symbolWithMakers.markers || []).forEach(reference => {
        if (self.currentSymbol) {
          self.currentSymbol.markers.push(
            Marker.create({
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
              }
            })
          );
        }
      });
    });

    const getMethod = flow(function*(line: number, column: number) {
      if (self.currentSymbol) {
        const clickedMarker = self.currentSymbol.markers.find(
          marker =>
            marker.location?.start.line === line &&
            marker.location.start.column <= column &&
            marker.location.end.column >= column
        );

        if (clickedMarker) {
          const symbol: GqlSymbolInformation = yield getMarkers(
            clickedMarker.filePath,
            clickedMarker.name
          );
          self.otherSymbols.set(
            symbol.id,
            DocumentSymbol.create({
              id: symbol.id,
              name: symbol.name,
              filePath: symbol.filePath || "",
              kind: symbol.kind,
              code: symbol.code,
              markers: (symbol.markers || []).map(marker => ({
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
                }
              }))
            })
          );
        }
      }
    });

    return { setCurrentSymbol, fetchMarkers, getMethod };
  });

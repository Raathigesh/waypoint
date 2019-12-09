import { types, flow, Instance } from "mobx-state-tree";
import { DocumentSymbol, Marker } from "./DocumentSymbol";
import {
  GqlSymbolInformation,
  GqlMarkers
} from "entities/GqlSymbolInformation";
import { getMarkers } from "../services/search";

export const DependencyGraph = types
  .model("DependencyGraph", {
    currentSymbol: types.maybeNull(DocumentSymbol),
    otherSymbols: types.map(DocumentSymbol),
    links: types.map(types.array(types.string))
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

    const getSymbolById = (id: string) => {
      if (self.currentSymbol && self.currentSymbol.id === id) {
        return self.currentSymbol;
      }
      return self.otherSymbols.get(id);
    };

    const fetchMarkers = flow(function*(symbol: GqlSymbolInformation) {
      const symbolWithMakers: GqlSymbolInformation = yield getMarkers(
        symbol.filePath,
        symbol.name
      );

      const symbolModel = getSymbolById(symbol.id);
      if (!symbolModel) {
        return;
      }

      (symbolWithMakers.markers || []).forEach(reference => {
        symbolModel.markers.push(
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
      });
    });

    const addBubble = flow(function*(id: string, line: number, column: number) {
      let symbol: Instance<typeof DocumentSymbol> | undefined = getSymbolById(
        id
      );

      if (!symbol) {
        return;
      }

      const clickedMarker = symbol.markers.find(
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

        if (self.links.get(id)) {
          self.links.set(id, [...(self.links.get(id) || []), symbol.id]);
        } else {
          self.links.set(id, [symbol.id]);
        }

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
    });

    return { setCurrentSymbol, fetchMarkers, addBubble };
  })
  .views(self => {
    const getSymbolById = (id: string) => {
      if (self.currentSymbol && self.currentSymbol.id === id) {
        return self.currentSymbol;
      }
      return self.otherSymbols.get(id);
    };

    const getGraphColumns = () => {
      const results: Array<Array<Instance<typeof DocumentSymbol>>> = [];

      let currentColumnItems: string[] = [];
      let nextColumnItems: string[] = [];

      let nodes: Instance<typeof DocumentSymbol>[] = [];

      if (!self.currentSymbol) {
        return;
      }

      const itemLinks = self.links.get(self.currentSymbol.id) || [];
      currentColumnItems = currentColumnItems.concat(itemLinks);

      while (currentColumnItems.length !== 0) {
        const link = currentColumnItems.pop();
        if (link) {
          const symbol = getSymbolById(link);
          if (symbol) {
            nodes.push(symbol);

            const links = self.links.get(symbol.id) || [];
            nextColumnItems = nextColumnItems.concat(links);
          }
        }

        if (currentColumnItems.length === 0) {
          results.push(nodes);
          currentColumnItems = currentColumnItems.concat(nextColumnItems);
          nextColumnItems = [];
          nodes = [];
        }
      }

      return results;
    };

    return { getGraphColumns };
  });

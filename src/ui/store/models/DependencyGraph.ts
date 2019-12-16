import { types, flow, Instance } from "mobx-state-tree";
import { DocumentSymbol, Marker } from "./DocumentSymbol";
import {
  GqlSymbolInformation,
  GqlMarkers
} from "entities/GqlSymbolInformation";
import { getMarkers, getCode } from "../services/search";

const NodeLink = types.model("NodeLink", {
  line: types.number,
  target: types.string
});

export const DependencyGraph = types
  .model("DependencyGraph", {
    currentSymbol: types.maybeNull(DocumentSymbol),
    otherSymbols: types.map(DocumentSymbol),
    links: types.map(types.array(NodeLink))
  })
  .actions(self => {
    const setCurrentSymbol = flow(function*(symbol: GqlSymbolInformation) {
      self.currentSymbol = DocumentSymbol.create({
        id: symbol.id,
        name: symbol.name,
        filePath: symbol.filePath,
        kind: symbol.kind,
        markers: []
      });

      const code = yield getCode(symbol.filePath, symbol.id);
      self.currentSymbol.code = code;
    });

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

    const addBubble = flow(function*(
      id: string,
      line: number,
      column: number,
      top: number
    ) {
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
          self.links.set(id, [
            ...(self.links.get(id) || []),
            NodeLink.create({
              line: top,
              target: symbol.id
            })
          ]);
        } else {
          self.links.set(id, [
            NodeLink.create({
              line: top,
              target: symbol.id
            })
          ]);
        }

        const code = yield getCode(symbol.filePath, symbol.id);

        self.otherSymbols.set(
          symbol.id,
          DocumentSymbol.create({
            id: symbol.id,
            name: symbol.name,
            filePath: symbol.filePath || "",
            kind: symbol.kind,
            code,
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

    const removeNode = (id: string) => {
      const linksToRemove = [id];

      while (linksToRemove.length !== 0) {
        const linkToRemove = linksToRemove.pop();
        if (linkToRemove) {
          self.otherSymbols.delete(linkToRemove);

          const connections = self.links.get(linkToRemove);
          connections?.forEach(connection => {
            linksToRemove.push(connection.target);
          });
          self.links.delete(linkToRemove);
        }
      }
    };

    return { setCurrentSymbol, fetchMarkers, addBubble, removeNode };
  })
  .views(self => {
    const getSymbolById = (link: Instance<typeof NodeLink>) => {
      if (self.currentSymbol && self.currentSymbol.id === link.target) {
        return self.currentSymbol;
      }
      return self.otherSymbols.get(link.target);
    };

    const getGraphColumns = () => {
      const results: Array<Array<Instance<typeof DocumentSymbol>>> = [];

      let currentColumnItems: Instance<typeof NodeLink>[] = [];
      let nextColumnItems: Instance<typeof NodeLink>[] = [];

      let nodes: Instance<typeof DocumentSymbol>[] = [];

      if (!self.currentSymbol) {
        return;
      }

      const itemLinks = self.links.get(self.currentSymbol.id) || [];
      currentColumnItems = currentColumnItems.concat(
        itemLinks.sort((a, b) => b.line - a.line)
      );

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
          currentColumnItems = currentColumnItems.concat(
            nextColumnItems.sort((a, b) => b.line - a.line)
          );
          nextColumnItems = [];
          nodes = [];
        }
      }

      return results;
    };

    return { getGraphColumns };
  });

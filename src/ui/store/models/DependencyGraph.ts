import { types, flow, Instance } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { DocumentSymbol, Marker } from "./DocumentSymbol";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { getMarkers, getCode } from "../services/search";

const NodeLink = types.model("NodeLink", {
  target: types.string
});

export const DependencyGraph = types
  .model("DependencyGraph", {
    symbols: types.map(DocumentSymbol),
    links: types.map(types.array(NodeLink)),
    colors: types.array(types.string),
    currentColorIndex: types.number,
    isBubbleDragging: types.boolean
  })
  .actions(self => {
    const getNextColor = () => {
      const nextColor = self.colors[self.currentColorIndex];
      if (self.currentColorIndex === self.colors.length - 1) {
        self.currentColorIndex = 0;
      } else {
        self.currentColorIndex += 1;
      }
      return nextColor;
    };

    const setCurrentSymbol = flow(function*(symbol: GqlSymbolInformation) {
      const symbolWithMakers: GqlSymbolInformation = yield getMarkers(
        symbol.filePath,
        symbol.name
      );

      const markers = (symbolWithMakers.markers || []).map(marker =>
        Marker.create({
          id: nanoid(),
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
          color: ""
        })
      );

      const code = yield getCode(symbol.filePath, symbol.id);
      const documentSymbol = DocumentSymbol.create({
        id: symbol.id,
        name: symbol.name,
        filePath: symbol.filePath,
        kind: symbol.kind,
        location: {
          start: {
            column: symbol?.location?.start?.column || 0,
            line: symbol?.location?.start?.line || 0
          },
          end: {
            column: symbol?.location?.end?.column || 0,
            line: symbol?.location?.end?.line || 0
          }
        },
        markers,
        code
      });
      self.symbols.set(symbol.id, documentSymbol);
    });

    const getSymbolById = (id: string) => {
      return self.symbols.get(id);
    };

    const addBubble = flow(function*(
      id: string,
      line: number,
      column: number,
      x: number,
      y: number
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

        const nextColor = getNextColor();

        clickedMarker.color = nextColor;
        if (self.links.get(id)) {
          self.links.set(id, [
            ...(self.links.get(id) || []),
            NodeLink.create({
              target: symbol.id
            })
          ]);
        } else {
          self.links.set(id, [
            NodeLink.create({
              target: symbol.id
            })
          ]);
        }

        const code = yield getCode(symbol.filePath, symbol.id);
        self.symbols.set(
          symbol.id,
          DocumentSymbol.create({
            id: symbol.id,
            name: symbol.name,
            filePath: symbol.filePath || "",
            kind: symbol.kind,
            location: {
              start: {
                column: symbol?.location?.start?.column || 0,
                line: symbol?.location?.start?.line || 0
              },
              end: {
                column: symbol?.location?.end?.column || 0,
                line: symbol?.location?.end?.line || 0
              }
            },
            code,
            createdForMarker: {
              markerId: clickedMarker.id,
              symbolId: id
            },
            markers: (symbol.markers || []).map(marker => ({
              id: nanoid(),
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
              color: ""
            })),
            color: nextColor,
            x,
            y
          })
        );
      }
    });

    const removeNode = (id: string) => {
      const linksToRemove = [id];
      while (linksToRemove.length !== 0) {
        const linkToRemove = linksToRemove.pop();
        if (linkToRemove) {
          const symbolToRemove = getSymbolById(linkToRemove);

          if (symbolToRemove && symbolToRemove.createdForMarker) {
            const parentSymbol = getSymbolById(
              symbolToRemove.createdForMarker.symbolId
            );

            if (parentSymbol) {
              const markerOfParent = parentSymbol.markers.find(
                marker =>
                  marker.id === symbolToRemove.createdForMarker?.markerId
              );
              if (markerOfParent) {
                markerOfParent.color = "";
              }
            }
          }

          self.symbols.delete(linkToRemove);

          const connections = self.links.get(linkToRemove);
          connections?.forEach(connection => {
            linksToRemove.push(connection.target);
          });
          self.links.delete(linkToRemove);
        }
      }
    };

    const setIsBubbleDragging = (flag: boolean) => {
      self.isBubbleDragging = flag;
    };

    return {
      setCurrentSymbol,
      addBubble,
      removeNode,
      setIsBubbleDragging
    };
  });

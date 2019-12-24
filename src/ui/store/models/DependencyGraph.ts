import { types, flow, Instance } from "mobx-state-tree";
import { DocumentSymbol, Marker } from "./DocumentSymbol";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { getMarkers, getCode } from "../services/search";

const NodeLink = types.model("NodeLink", {
  line: types.number,
  target: types.string
});

export const DependencyGraph = types
  .model("DependencyGraph", {
    currentSymbol: types.maybeNull(DocumentSymbol),
    otherSymbols: types.map(DocumentSymbol),
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
      self.currentSymbol = DocumentSymbol.create({
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
            },
            color: ""
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

        const nextColor = getNextColor();

        clickedMarker.color = nextColor;
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
              },
              color: ""
            })),
            color: nextColor
          })
        );
      }
    });

    const removeNode = (id: string) => {
      const linksToRemove = [id];
      if (self.currentSymbol && self.currentSymbol?.id === id) {
        self.currentSymbol = null;
        return;
      }
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

    const setIsBubbleDragging = (flag: boolean) => {
      self.isBubbleDragging = flag;
    };

    return {
      setCurrentSymbol,
      fetchMarkers,
      addBubble,
      removeNode,
      setIsBubbleDragging
    };
  });

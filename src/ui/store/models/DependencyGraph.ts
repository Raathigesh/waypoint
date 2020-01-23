import { types, flow, Instance } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { DocumentSymbol, Marker } from "./DocumentSymbol";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { getMarkers, getCode } from "../services/search";
import { File } from "./File";
import { getFile } from "../services/file";
import { GqlFile } from "entities/GqlFile";
import { Note } from "./Note";

const NodeLink = types.model("NodeLink", {
  target: types.string
});

export const DependencyGraph = types
  .model("DependencyGraph", {
    symbols: types.map(DocumentSymbol),
    files: types.map(File),
    notes: types.map(Note),
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

      const code: string = yield getCode(symbol.filePath, symbol.id);
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
      symbol: Instance<typeof DocumentSymbol>,
      line: number,
      column: number,
      x: number,
      y: number
    ) {
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
        const id = symbol.id;
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

        const code: string = yield getCode(symbol.filePath, symbol.id);
        const symbolForBubble = DocumentSymbol.create({
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
        });
        symbolForBubble.setPosition(x, y);

        self.symbols.set(symbol.id, symbolForBubble);
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

    const removeFile = (path: string) => {
      self.files.delete(path);
    };

    const setIsBubbleDragging = (flag: boolean) => {
      self.isBubbleDragging = flag;
    };

    const moveSymbols = (deltaX: number, deltaY: number) => {
      self.symbols.forEach(symbol => {
        if (symbol) {
          const nextX = (symbol.tempX || 0) + deltaX;
          const nextY = (symbol.tempY || 0) + deltaY;
          (symbol.ref as any).current.style.transform = `translate(${nextX}px, ${nextY}px)`;
          symbol.tempX = nextX;
          symbol.tempY = nextY;
        }
      });

      self.files.forEach(file => {
        if (file) {
          const nextX = (file.tempX || 0) + deltaX;
          const nextY = (file.tempY || 0) + deltaY;
          (file.ref as any).current.style.transform = `translate(${nextX}px, ${nextY}px)`;
          file.tempX = nextX;
          file.tempY = nextY;
        }
      });

      self.notes.forEach(note => {
        if (note) {
          const nextX = (note.tempX || 0) + deltaX;
          const nextY = (note.tempY || 0) + deltaY;
          (note.ref as any).current.style.transform = `translate(${nextX}px, ${nextY}px)`;
          note.tempX = nextX;
          note.tempY = nextY;
        }
      });
    };

    const finalizePosition = () => {
      self.symbols.forEach(symbol => {
        symbol.setPosition(symbol.tempX, symbol.tempY);
      });
    };

    const addFileMap = (gqlFile: GqlFile) => {
      self.files.set(
        gqlFile.filePath,
        File.create({
          filePath: gqlFile.filePath,
          symbols: gqlFile.symbols.map(symbol =>
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
              }
            })
          )
        })
      );
    };

    const addFile = flow(function*(filePath: string) {
      const gqlFile: GqlFile = yield getFile(filePath);
      addFileMap(gqlFile);
    });

    const addNote = () => {
      const id = nanoid();
      self.notes.set(id, Note.create({ id, x: 0, y: 0, color: "" }));
    };

    const removeNote = (id: string) => {
      self.notes.delete(id);
    };

    return {
      setCurrentSymbol,
      addBubble,
      removeNode,
      setIsBubbleDragging,
      moveSymbols,
      finalizePosition,
      addFile,
      removeFile,
      addFileMap,
      addNote,
      removeNote
    };
  });

import { types, flow, Instance, onSnapshot, onPatch } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { DocumentSymbol, Marker } from "./DocumentSymbol";
import { GqlSymbolInformation } from "entities/GqlSymbolInformation";
import { getMarkers, getCode } from "../services/search";
import { getFile } from "../services/file";
import { GqlFile } from "entities/GqlFile";
import { getStageConfig } from "../services/config";

export interface PersistableSymbol {
  name: string;
  path: string;
  x: number | undefined;
  y: number | undefined;
  connections: string[];
  color: string;
  markers: {
    id: string;
    color: string;
  }[];
  height: number | undefined;
  width: number | undefined;
}

export interface PersistableStage {
  symbols: PersistableSymbol[];
}

export const DependencyGraph = types
  .model("DependencyGraph", {
    symbols: types.map(DocumentSymbol),
    colors: types.array(types.string),
    currentColorIndex: types.number,
    isBubbleDragging: types.boolean
  })
  .volatile(self => ({
    arcContainerRef: null
  }))
  .actions(self => {
    const initializeStage = flow(function*() {
      const config: PersistableStage | null = yield getStageConfig();
      if (config) {
        config.symbols.forEach(symbol =>
          setCurrentSymbol(symbol.name, symbol.path, {
            x: symbol.x,
            y: symbol.y,
            connections: symbol.connections,
            markers: symbol.markers,
            color: symbol.color,
            height: symbol.height,
            width: symbol.width
          })
        );
      }
    });

    const getNextColor = () => {
      const nextColor = self.colors[self.currentColorIndex];
      if (self.currentColorIndex === self.colors.length - 1) {
        self.currentColorIndex = 0;
      } else {
        self.currentColorIndex += 1;
      }
      return nextColor;
    };

    const setCurrentSymbol = flow(function*(
      name: string,
      filePath: string,
      attributes?: {
        x: number | undefined;
        y: number | undefined;
        connections: string[];
        color: string;
        markers: {
          id: string;
          color: string;
        }[];
        height: number | undefined;
        width: number | undefined;
      }
    ) {
      const documentSymbol = DocumentSymbol.create({
        name,
        filePath,
        color: attributes?.color,
        connections: attributes?.connections || [],
        height: attributes?.height,
        width: attributes?.width
      });

      yield documentSymbol.fetchMarkers(attributes?.markers || []);
      yield documentSymbol.fetchCode();
      if (attributes) {
        documentSymbol.setPosition(attributes?.x || 0, attributes.y || 0);
      }
      self.symbols.set(documentSymbol.id, documentSymbol);
    });

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
        const nextColor = getNextColor();
        const id = symbol.id;
        clickedMarker.setColor(nextColor);

        const symbolForBubble = DocumentSymbol.create({
          name: clickedMarker.name,
          filePath: clickedMarker.filePath,
          color: nextColor,
          x,
          y
        });
        clickedMarker.connectedSymbol = symbolForBubble.id;
        symbolForBubble.setPosition(x, y);
        yield symbolForBubble.fetchMarkers(
          [],
          clickedMarker.isFromDefaultImport
        );
        yield symbolForBubble.fetchCode(clickedMarker.isFromDefaultImport);
        const sourceSymbol = self.symbols.get(id);
        sourceSymbol?.addConnection(symbolForBubble.id);
        self.symbols.set(symbolForBubble.id, symbolForBubble);
      }
    });

    const removeNode = (id: string) => {
      self.symbols.delete(id);

      // remove existing connections
      self.symbols.forEach(symbol => {
        if (symbol.connections.includes(id)) {
          symbol.connections.remove(id);
          const marker = symbol.markers.find(
            marker => marker.connectedSymbol === id
          );
          if (marker) {
            marker.setColor("");
          }
        }
      });
    };

    const setIsBubbleDragging = (flag: boolean) => {
      if (
        self.isBubbleDragging === true &&
        flag === false &&
        self.arcContainerRef !== null
      ) {
        refreshArrows();
      }

      self.isBubbleDragging = flag;
    };

    const refreshArrows = () => {
      if (self.arcContainerRef) {
        (self.arcContainerRef as any).refreshScreen();
      }
    };

    const moveSymbols = (deltaX: number, deltaY: number) => {
      [...self.symbols.values()].forEach(symbol => {
        if (symbol) {
          const nextX = (symbol.tempX || 0) + deltaX;
          const nextY = (symbol.tempY || 0) + deltaY;
          (symbol.ref as any).current.style.transform = `translate(${nextX}px, ${nextY}px)`;
          symbol.tempX = nextX;
          symbol.tempY = nextY;
        }
      });
      refreshArrows();
    };

    const finalizePosition = () => {
      self.symbols.forEach(symbol => {
        symbol.setPosition(symbol.tempX, symbol.tempY);
      });
    };

    const setArcContainerRef = (ref: any) => {
      self.arcContainerRef = ref;
    };

    const clear = () => {
      self.symbols.clear();
    };

    return {
      initializeStage,
      setCurrentSymbol,
      addBubble,
      removeNode,
      setIsBubbleDragging,
      moveSymbols,
      finalizePosition,
      setArcContainerRef,
      refreshArrows,
      clear
    };
  })
  .views(self => ({
    getPersistableJSON(): PersistableStage {
      return {
        symbols: [...self.symbols.values()].map(symbol => ({
          name: symbol.name,
          path: symbol.filePath,
          x: symbol.x,
          y: symbol.y,
          connections: symbol.connections,
          markers: symbol.markers.map(marker => ({
            id: marker.id,
            color: marker.color
          })),
          color: symbol.color || "",
          height: symbol.height,
          width: symbol.width
        }))
      };
    }
  }));

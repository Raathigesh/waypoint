import React, { useContext } from "react";
import { dependencyGraphStore, appStore } from "ui/store";
import { observer } from "mobx-react-lite";
import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";
import Frame from "./Frame";
import Symbol from "./symbol";
import { getCharWidth } from "ui/util/view";

const getMaxLineLength = (code: string) =>
  Math.max(...code.split("\n").map(line => line.length));

interface Props {
  symbol: Instance<typeof DocumentSymbol>;
}

function Code({ symbol }: Props) {
  const projectInfo = useContext(appStore);
  const charWidth = getCharWidth(projectInfo.fontSize, projectInfo.fontFamily);
  const dependencyGraph = useContext(dependencyGraphStore);
  const width =
    (charWidth + 2) * getMaxLineLength((symbol && symbol?.code) || "");
  const height = (symbol.code || "").split("\n").length * 20;

  return (
    <Frame
      title={symbol.name}
      x={symbol.x || 0}
      y={symbol.y || 0}
      headerColor={symbol.color || "rgba(0, 0, 0, 0.028)"}
      onEnd={() => {
        dependencyGraph.setIsBubbleDragging(false);
      }}
      onStart={() => dependencyGraph.setIsBubbleDragging(true)}
      onRemove={() => {
        dependencyGraph.removeNode(symbol.id);
      }}
      setPosition={symbol.setPosition}
      setRef={symbol.setRef}
      width={width + 10}
      height={Math.min(900, height + 50)}
    >
      <Symbol symbol={symbol} />
    </Frame>
  );
}

export default observer(Code);

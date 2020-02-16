import React from "react";
import { Code, Square, Box, Type, Minus, Package, File } from "react-feather";
import { Tooltip } from "react-tippy";

interface Props {
  kind: string | undefined;
  size: string;
}

export default function SymbolKindIcon({ kind, size }: Props) {
  if (kind === "FunctionDeclaration") {
    return (
      <Tooltip size="small" title="Function declaration" position="bottom">
        <Code size={size} />
      </Tooltip>
    );
  } else if (kind === "VariableDeclaration") {
    return (
      <Tooltip size="small" title="Variable declaration" position="bottom">
        <Minus size={size} />
      </Tooltip>
    );
  } else if (kind === "ClassDeclaration") {
    return (
      <Tooltip size="small" title="Class declaration" position="bottom">
        <Package size={size} />
      </Tooltip>
    );
  } else if (kind === "TypeAlias") {
    return (
      <Tooltip size="small" title="Type declaration" position="bottom">
        <Type size={size} />
      </Tooltip>
    );
  }

  return (
    <Tooltip size="small" title="File" position="bottom">
      <File size={size} />
    </Tooltip>
  );
}

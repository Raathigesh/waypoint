import React from "react";
import { Code, Square, Box, Type, Minus, Package } from "react-feather";

interface Props {
  kind: string | undefined;
  size: string;
}

export default function SymbolKindIcon({ kind, size }: Props) {
  if (kind === "FunctionDeclaration") {
    return <Code size={size} />;
  } else if (kind === "VariableDeclaration") {
    return <Minus size={size} />;
  } else if (kind === "ClassDeclaration") {
    return <Package size={size} />;
  } else if (kind === "TypeAlias") {
    return <Type size={size} />;
  }

  return <Minus />;
}

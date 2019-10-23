import { Package, Code, Type } from "react-feather";
import React from "react";
import { FlakeType } from "entities/Symbol";

interface Props {
  type: FlakeType;
}

export default function FlakeIcon({ type }: Props) {
  let Icon = Code;
  if (type === "ClassDeclaration") {
    Icon = Package;
  } else if (type === "TypeAlias") {
    Icon = Type;
  }
  return <Icon size={11} />;
}

import { Package, Code } from "react-feather";
import React from "react";
import { FlakeType } from "common/entities/Symbol";

interface Props {
  type: FlakeType;
}

export default function FlakeIcon({ type }: Props) {
  let Icon = Code;
  if (type === "class") {
    Icon = Package;
  }
  return <Icon size={11} />;
}

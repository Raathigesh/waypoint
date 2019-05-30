import { Package, Code } from "react-feather";
import { FlakeType } from "../../entities/Symbol";
import React from "react";

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

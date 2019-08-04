import { Rnd } from "react-rnd";
import React from "react";

interface Props {
  children: any;
}

export default function Block({ children }: Props) {
  return (
    <Rnd
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200
      }}
    >
      {children}
    </Rnd>
  );
}

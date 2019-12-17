import { types, getEnv, Instance } from "mobx-state-tree";
import { DependencyGraph } from "./DependencyGraph";

export const Point = types.model("Point", {
  x: types.number,
  y: types.number
});

export const Connection = types.model("Connection", {
  start: Point,
  firstBreak: Point,
  secondBreak: Point,
  end: Point
});

export const Rectangle = types.model("Rectangle", {
  width: types.number,
  height: types.number,
  top: types.number,
  right: types.number,
  bottom: types.number,
  left: types.number
});

export const Connections = types
  .model("Connections", {
    connections: types.map(Rectangle),
    target: types.maybeNull(Point),
    relative: Point
  })
  .views(self => ({
    enhancedViews() {
      const env: {
        dependencyGraph: typeof DependencyGraph.Type;
      } = getEnv(self);

      const connections: Instance<typeof Connection>[] = [];

      Array.from(env.dependencyGraph.links.keys()).forEach(key => {
        const links = env.dependencyGraph.links.get(key);
        if (links) {
          links.forEach(link => {
            const start = self.connections.get(key);
            const end = self.connections.get(link.target);

            if (start && end) {
              connections.push(
                Connection.create({
                  start: {
                    x: start.right,
                    y: link.line
                  },
                  firstBreak: {
                    x: start.right + 15,
                    y: link.line
                  },
                  secondBreak: {
                    x: end.left - 30,
                    y: end.top + 10
                  },
                  end: {
                    x: end.left - 12,
                    y: end.top + 10
                  }
                })
              );
            }
          });
        }
      });

      return connections;
    }
  }))
  .actions(self => {
    return {
      addPosition(
        id: string,
        width: number,
        height: number,
        top: number,
        right: number,
        bottom: number,
        left: number
      ) {
        self.connections.set(
          id,
          Rectangle.create({
            width,
            height,
            top,
            right,
            bottom,
            left: left + self.relative.x
          })
        );
      },
      addRelative(x: number, y: number) {
        self.relative.x = x;
        self.relative.y = y;
      }
    };
  });

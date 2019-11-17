import { types } from "mobx-state-tree";

export const Point = types.model("Point", {
  x: types.number,
  y: types.number
});

export const Connection = types.model("Connection", {
  points: types.array(Point)
});

export const Connections = types
  .model("Connections", {
    connections: types.array(Connection),
    target: types.maybeNull(Point),
    relative: Point
  })
  .views(self => ({
    enhancedViews() {
      return self.connections.map(connection =>
        [
          ...connection.points,
          {
            x: connection.points[connection.points.length - 1].x,
            y: (self.target && self.target.y) || 0
          },
          self.target
        ].map(point => ({
          x: (point?.x || 0) - self.relative.x,
          y: (point?.y || 0) - self.relative.y
        }))
      );
    }
  }))
  .actions(self => {
    return {
      addTarget(x: number, y: number) {
        self.target = Point.create({ x, y });
      },
      setRelative(x: number, y: number) {
        self.relative = Point.create({ x, y });
      },
      addConnection(x1: number, y1: number, x2: number, y2: number) {
        const point1 = Point.create({ x: x1, y: y1 });
        const point2 = Point.create({ x: x2, y: y2 });
        const connection = Connection.create({
          points: [point1, point2]
        });
        self.connections.push(connection);
      },
      reset() {
        self.connections.clear();
      }
    };
  });

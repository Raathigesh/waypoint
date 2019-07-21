export interface BlockExtension {
  services: any[];
  resolvers: any[];
}

export interface BlockUI {
  view: {
    path: string;
    Component: any;
  };
}

export interface BlockExtension {
  services: any[];
}

export interface BlockBackend {
  resolvers: any[];
}

export interface BlockUI {
  view: {
    path: string;
    Component: any;
  };
}

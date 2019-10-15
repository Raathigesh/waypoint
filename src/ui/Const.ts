export const InitialFileContent = `
function View() {
  return {
    filter: (symbol, utils) => ({
      include: false,
      columns: [
        {
          key: "category",
          properties: {
            value: symbol.path,
            color: "blue"
          }
        }
      ]
    }),
    columnDefinitions: [
      {
        key: "category",
        type: "lozenge",
        title: "Category",
        initialWidth: "20%"
      }
    ]
  };
}

`;

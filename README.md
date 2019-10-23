## Delight

Delight in a VSCode code extension to make working with code a little bit more fun.

### Find your symbols easier

Delight allows you to create a list of symbols by writting a rule which filters the symbols in your codebase and displays only the symbols you care about.

Click on the `Edit rule` button to open the rule file of the current view.

```javascript
function View() {
  return {
    filter: ({ path }) => ({
      include: path.includes("query"), // if this is true, the symbol will be included in the list
      // value for the columns defined in the columnDefinitions
      columns: [
        {
          key: "category", // key of the column
          // since 'category' is lozenge, you have to provide a 'value' and the 'color' of the lozenge
          properties: {
            value: path.split("\\")[path.split("\\").length - 2],
            color: "green"
          }
        }
      ]
    }),
    // columns of the list
    columnDefinitions: [
      {
        key: "category", // should be unique among the columns
        type: "lozenge", // type of the column. Supported types are 'lozenge'
        title: "Category", // title of the column
        initialWidth: "20%" // initial width of the column
      }
    ]
  };
}
```

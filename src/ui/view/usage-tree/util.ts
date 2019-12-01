import { Instance } from "mobx-state-tree";
import * as nanoid from "nanoid";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";

export interface TreeNode {
  id?: string;
  label: string;
  path: string;
  type: "directory" | "file";
  children?: TreeNode[];
  symbols?: Instance<typeof DocumentSymbol>[];
}

function flatten(tree: TreeNode, root: TreeNode) {
  if (tree.children && tree.children.length === 1) {
    tree.label = `${tree.label}/${tree.children[0].label}`;

    tree.symbols = tree.children[0].symbols;
    tree.children = tree.children[0].children;
  }

  tree.id = `${root.label}/${tree.label}`;

  (tree.children || []).forEach(node => flatten(node, tree));
  return tree;
}

function ensurePath(
  root: TreeNode,
  symbol: Instance<typeof DocumentSymbol>,
  tokens: string[]
) {
  const currentToken = tokens.shift();
  const children = root.children || [];

  const isAFile = tokens.length === 0 && (currentToken || "").includes(".");

  let hasTokenChildren = children.find(child => child.label === currentToken);

  if (!hasTokenChildren) {
    hasTokenChildren = {
      label: currentToken || "",
      path: symbol.filePath,
      type: isAFile ? "file" : "directory",
      children: [],
      symbols: isAFile ? [symbol] : []
    };
    root.children?.push(hasTokenChildren);
  } else if (hasTokenChildren && isAFile) {
    hasTokenChildren.symbols?.push(symbol);
  }

  if (tokens.length !== 0) {
    ensurePath(hasTokenChildren, symbol, tokens);
  }
}

export function constructTree(
  references: Instance<typeof DocumentSymbol>[],
  separator: string
): TreeNode {
  const tree: TreeNode = {
    label: "root",
    path: "",
    type: "directory",
    children: []
  };
  references.forEach(item => {
    const tokens = item.filePath.split(separator);
    ensurePath(tree, item, tokens);
  });

  return flatten(tree, tree);
}

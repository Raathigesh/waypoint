import { Instance } from "mobx-state-tree";
import { DocumentSymbol } from "ui/store/models/DocumentSymbol";

export interface TreeNode {
  label: string;
  path: string;
  type: "directory" | "file";
  children?: TreeNode[];
}

function ensurePath(root: TreeNode, fullPath: string, tokens: string[]) {
  const currentToken = tokens.shift();
  const children = root.children || [];

  const isAFile = tokens.length === 0 && (currentToken || "").includes(".");

  let hasTokenChildren = children.find(child => child.label === currentToken);

  if (!hasTokenChildren) {
    hasTokenChildren = {
      label: currentToken || "",
      path: fullPath,
      type: isAFile ? "file" : "directory",
      children: []
    };
    root.children?.push(hasTokenChildren);
  }

  if (tokens.length !== 0) {
    ensurePath(hasTokenChildren, fullPath, tokens);
  }
}

export function constructTree(
  references: Instance<typeof DocumentSymbol>[]
): TreeNode {
  const paths = references.map(r => r.filePath);

  const tree: TreeNode = {
    label: "root",
    path: "",
    type: "directory",
    children: []
  };
  paths.forEach(item => {
    const tokens = item.split("\\");
    ensurePath(tree, item, tokens);
  });
  console.log(tree);
  return tree;
}

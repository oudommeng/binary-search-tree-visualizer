export class TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(value: number) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinarySearchTree {
  root: TreeNode | null;

  constructor() {
    this.root = null;
  }

  // --- ALGORITHMS START HERE ---

  // 1. Insertion
  insert(value: number): boolean {
    const newNode = new TreeNode(value);
    if (!this.root) {
      this.root = newNode;
      return true;
    }
    return this._insertNode(this.root, newNode);
  }

  private _insertNode(node: TreeNode, newNode: TreeNode): boolean {
    if (newNode.value === node.value) {
      // Duplicate value - reject insertion
      return false;
    } else if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
        return true;
      } else {
        return this._insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
        return true;
      } else {
        return this._insertNode(node.right, newNode);
      }
    }
  }

  // 2. Deletion
  delete(value: number): boolean {
    const found = this.find(value);
    this.root = this._deleteNode(this.root, value);
    return found;
  }

  private _deleteNode(node: TreeNode | null, key: number): TreeNode | null {
    if (!node) return null;

    if (key < node.value) {
      node.left = this._deleteNode(node.left, key);
      return node;
    } else if (key > node.value) {
      node.right = this._deleteNode(node.right, key);
      return node;
    } else {
      // Node found: Handle 3 cases

      // Case 1: No children (Leaf) - just delete
      if (!node.left && !node.right) {
        return null;
      }
      // Case 2: One child - return that child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Two children
      // Find min value in right subtree (In-order successor)
      const minRight = this._findMinNode(node.right);
      node.value = minRight.value;
      // Delete the duplicate successor node
      node.right = this._deleteNode(node.right, minRight.value);
      return node;
    }
  }

  private _findMinNode(node: TreeNode): TreeNode {
    let current = node;
    while (current.left) current = current.left;
    return current;
  }

  // 3. Traversal (Pre-order: Root -> Left -> Right)
  getPreOrder(): number[] {
    const result: number[] = [];
    this._preOrderTraversal(this.root, result);
    return result;
  }

  private _preOrderTraversal(node: TreeNode | null, result: number[]): void {
    if (node) {
      result.push(node.value); // Visit Root
      this._preOrderTraversal(node.left, result); // Visit Left
      this._preOrderTraversal(node.right, result); // Visit Right
    }
  }

  // Find a value in the tree (returns path for visualization)
  find(value: number): boolean {
    return this._findNode(this.root, value);
  }

  private _findNode(node: TreeNode | null, value: number): boolean {
    if (!node) return false;
    if (node.value === value) return true;
    if (value < node.value) return this._findNode(node.left, value);
    return this._findNode(node.right, value);
  }
}

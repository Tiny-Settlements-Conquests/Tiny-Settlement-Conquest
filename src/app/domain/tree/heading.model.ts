export interface TreeNode {
    children: TreeNode[],
    id: string;
    text: string;
    level: number;
}
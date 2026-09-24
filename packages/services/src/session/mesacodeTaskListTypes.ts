import type { WorkspacePurpose, MesacodeTaskMeta } from "@mesacode/shared";

export type MesacodeTaskListKind = "pinned" | "archived" | "timeline" | "active";
export type MesacodeTaskListSortBy = "created" | "updated";

export interface MesacodeTaskListWorkspaceScope {
  workspacePath: string;
  workspaceIdentity?: string;
  workspacePurpose?: WorkspacePurpose;
}

export interface MesacodeTaskListQuery {
  kind: MesacodeTaskListKind;
  workspaceScopes: MesacodeTaskListWorkspaceScope[];
  sortBy: MesacodeTaskListSortBy;
  search?: string;
  limit?: number;
}

export type MesacodeTaskListItem = MesacodeTaskMeta & {
  searchSnippet?: string;
  searchSnippets?: string[];
};

export interface MesacodeTaskListResult {
  items: MesacodeTaskListItem[];
  total: number;
  hasMore: boolean;
}

export type MesacodeTaskGroupColor =
  | "gray"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple";

export interface MesacodeTaskGroup {
  id: string;
  title: string;
  color: MesacodeTaskGroupColor;
  createdAt: number;
  updatedAt: number;
}

export interface MesacodeGroupedTaskRef {
  workspacePath: string;
  workspaceIdentity?: string;
  taskId: string;
}

export type MesacodeGroupedTaskViewTopLevelNodeRef =
  | { type: "group"; groupId: string }
  | { type: "task"; task: MesacodeGroupedTaskRef };

export type MesacodeGroupedTaskViewNode =
  | {
      type: "group";
      group: MesacodeTaskGroup;
      tasks: MesacodeTaskListItem[];
      sortOrder?: number;
    }
  | {
      type: "task";
      task: MesacodeTaskListItem;
      sortOrder?: number;
    };

export interface MesacodeGroupedTaskView {
  nodes: MesacodeGroupedTaskViewNode[];
}

export interface MesacodeGroupedTaskViewQuery {
  workspaceScopes: MesacodeTaskListWorkspaceScope[];
  includeAllWorkspaces?: boolean;
}

// ── grouped 原始结构（不 join tasks 表）──
// grouped 视图的任务数据源迁到 sessions-index 后，服务端只提供分组结构
// （task_groups / task_group_members / task_group_view_node_orders），
// 由客户端与 sessions-index 会话做 join。

/** 组成员引用（不含任务 meta；task 内容由 sessions-index 提供）。 */
export interface MesacodeGroupedTaskViewStructureMember {
  groupId: string;
  /** 服务端口径 workspaceKey（resolveWorkspaceKey：identity ?? path），join 匹配键。 */
  workspaceKey: string;
  workspacePath: string;
  workspaceIdentity?: string;
  taskId: string;
  /** null = 尚未落 sort_order（新加入组）；客户端按 addedAt 降序补内存序。 */
  sortOrder: number | null;
  addedAt: number;
}

/** 顶层节点排序（task_group_view_node_orders，node_key 已解析为结构化引用）。 */
export type MesacodeGroupedTaskViewStructureTopOrder =
  | { type: "group"; groupId: string; sortOrder: number }
  | { type: "task"; workspaceKey: string; taskId: string; sortOrder: number };

export interface MesacodeGroupedTaskViewStructure {
  /** 已按 workspaceScopes 可见性过滤的 group（bootstrap workspace group 只在其 workspace 可见）。 */
  groups: MesacodeTaskGroup[];
  /** 全量组成员（含不可见 group 的成员——顶层排除规则需要全量判断）。 */
  members: MesacodeGroupedTaskViewStructureMember[];
  topLevelOrders: MesacodeGroupedTaskViewStructureTopOrder[];
}

export interface MesacodeGroupedTaskViewOrderInput {
  workspaceScopes: MesacodeTaskListWorkspaceScope[];
  topLevelNodes: MesacodeGroupedTaskViewTopLevelNodeRef[];
  groups: Array<{
    groupId: string;
    taskRefs: MesacodeGroupedTaskRef[];
  }>;
}

export interface MesacodeWorkspaceEventSubscriptionParams {
  workspacePath: string;
  workspaceIdentity?: string;
}

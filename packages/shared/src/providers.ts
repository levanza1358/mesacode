import { z } from "zod";

/**
 * Mesacode agent 提供方的单一真源。
 *
 * 类型 MesacodeProvider、运行时 schema mesacodeProviderSchema 都从这里派生,
 * 避免各处内联 z.enum([...]) 副本随新增/删除 provider 漂移。
 * 本模块只依赖 zod(叶子),可被 validation / mesacode-protocol 等无环引用。
 */
const MESACODE_PROVIDERS = ["glm"] as const;

export const mesacodeProviderSchema = z.enum(MESACODE_PROVIDERS);

export type MesacodeProvider = (typeof MESACODE_PROVIDERS)[number];

import type { MesacodeSessionFile, MesacodeTaskMeta } from "@mesacode/shared";
import { mesacodeSessionFileSchema, mesacodeTaskMetaSchema, mesacodeTaskModeSchema } from "@mesacode/shared";

export type LegacyTaskSessionFile = Omit<MesacodeSessionFile, "meta"> & {
  meta: Omit<MesacodeTaskMeta, "mode"> & { mode?: MesacodeTaskMeta["mode"] };
};

const legacyTaskSessionFileSchema = mesacodeSessionFileSchema.extend({
  // Claude 原生迁移会按清洗路径删除 meta.mode。
  // legacy snapshot 读取/写入仍要校验其它必需字段，但不能再强制把被过滤字段补回文件。
  meta: mesacodeTaskMetaSchema.extend({
    mode: mesacodeTaskModeSchema.optional(),
  }),
});

export function parseLegacyTaskSessionFile(input: unknown): LegacyTaskSessionFile {
  return legacyTaskSessionFileSchema.parse(input);
}

export function safeParseLegacyTaskSessionFile(input: unknown) {
  return legacyTaskSessionFileSchema.safeParse(input);
}

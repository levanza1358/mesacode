import {
  collectVisibleMesacodeBackgroundTaskControlItems,
  getMesacodeBackgroundTaskControlItemElapsedMs,
  isActiveMesacodeBackgroundTaskControlItem,
  parseMesacodeBackgroundTaskControlItems,
  type MesacodeBackgroundTaskControlItem,
  type MesacodeBackgroundTaskControlStatus,
} from "./background-task-controls.js";

export type MesacodeBackgroundBashJobStatus = MesacodeBackgroundTaskControlStatus;
export type MesacodeBackgroundBashJob = MesacodeBackgroundTaskControlItem & {
  taskKind: "bash";
};

export function parseMesacodeBackgroundBashJobs(value: unknown): MesacodeBackgroundBashJob[] {
  return parseMesacodeBackgroundTaskControlItems(value).filter(isBackgroundBashJob);
}

export function isActiveMesacodeBackgroundBashJob(job: MesacodeBackgroundBashJob): boolean {
  return isActiveMesacodeBackgroundTaskControlItem(job);
}

export function getMesacodeBackgroundBashJobElapsedMs(
  job: MesacodeBackgroundBashJob,
  now = Date.now(),
): number {
  return getMesacodeBackgroundTaskControlItemElapsedMs(job, now);
}

export function collectVisibleMesacodeBackgroundBashJobs(
  jobs: readonly MesacodeBackgroundBashJob[],
  now = Date.now(),
  thresholdMs = 30_000,
): Array<MesacodeBackgroundBashJob & { elapsedMs: number }> {
  return collectVisibleMesacodeBackgroundTaskControlItems(jobs, now, thresholdMs) as Array<
    MesacodeBackgroundBashJob & { elapsedMs: number }
  >;
}

function isBackgroundBashJob(job: MesacodeBackgroundTaskControlItem): job is MesacodeBackgroundBashJob {
  return job.taskKind === "bash";
}

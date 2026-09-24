import { z } from "zod";
import type { CommandAgentSource } from "./command-types.js";
import type { MesacodeProvider } from "./mesacode-task-types-core.js";

export const MESACODE_AGENT_PROVIDER = "glm" satisfies MesacodeProvider;
export const MESACODE_AGENT_PROVIDER_LABEL = "Mesacode Agent";
export const MESACODE_COMMAND_AGENT_SOURCE = "mesacodeAgent" satisfies CommandAgentSource;

export const mesacodeAgentProviderSchema = z.literal(MESACODE_AGENT_PROVIDER);

export const MESACODE_COMMAND_AGENT_SOURCES = [
  MESACODE_COMMAND_AGENT_SOURCE,
] as const satisfies readonly CommandAgentSource[];

export function normalizeAgentProviderToMesacodeAgent(
  _provider?: MesacodeProvider | null,
): MesacodeProvider {
  return MESACODE_AGENT_PROVIDER;
}

export function isMesacodeAgentProvider(
  provider: MesacodeProvider | null | undefined,
): provider is typeof MESACODE_AGENT_PROVIDER {
  return provider === MESACODE_AGENT_PROVIDER;
}

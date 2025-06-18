export interface ModelCapabilities {
  supportsImages: boolean;
  supportsReasoning: boolean;
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: LLMProvider;
  maxTokens: number;
  capabilities: ModelCapabilities;
}

export interface ProviderConfig {
  models: ModelConfig[];
}

export type LLMProvider =
  | "openai"
  | "cerebras"
  | "sambanova"
  | "openrouter"
  | "together";

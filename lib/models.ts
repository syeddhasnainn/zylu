import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { LLMProvider, ModelConfig, ProviderConfig } from "@/lib/types";

const openrouter = createOpenRouter();

export const providerConfigs = (): Partial<
  Record<LLMProvider, ProviderConfig>
> => ({
  openrouter: {
    models: [
      {
        id: "openai/gpt-4.1-nano",
        name: "GPT-4.1-Nano",
        provider: "openrouter",
        maxTokens: 8192,
        capabilities: {
          supportsImages: true,
          supportsReasoning: false,
        },
      },
      {
        id: "deepseek/deepseek-r1-0528",
        name: "DeepSeek-R1",
        provider: "openrouter",
        maxTokens: 16384,
        capabilities: {
          supportsImages: true,
          supportsReasoning: true,
        },
      },
      {
        id: "qwen/qwen3-30b-a3b:free",
        name: "Qwen-3.3-30B",
        provider: "openrouter",
        maxTokens: 4096,
        capabilities: {
          supportsImages: true,
          supportsReasoning: false,
        },
      },
      {
        id: "google/gemini-2.5-flash-preview",
        name: "Gemini-2.5-Flash",
        provider: "openrouter",
        maxTokens: 8192,
        capabilities: {
          supportsImages: true,
          supportsReasoning: false,
        },
      },
    ],
  },
});

// Define a type for the function that returns a model instance
type ModelFactory = (options?: Record<string, any>) => any;

export const getProviderByModelName = (
  name: string,
): { instanceFactory: ModelFactory; config: ModelConfig } | undefined => {
  const providerConfig = providerConfigs();

  for (const config of Object.values(providerConfig)) {
    const model = config.models.find((model) => model.id === name);
    if (model) {
      return createModelInstanceFactory(model.provider, model.id);
    }
  }
  return undefined;
};

export const createModelInstanceFactory = (
  provider: LLMProvider,
  modelId: string,
): {
  instanceFactory: ModelFactory;
  config: ModelConfig;
} => {
  let modelFactory: ModelFactory;
  const providerConfig = providerConfigs();

  const modelConfig = providerConfig[provider]?.models.find(
    (model: ModelConfig) => model.id === modelId,
  );

  if (!modelConfig)
    throw new Error(`Model "${modelId}" not found for provider "${provider}".`);

  switch (provider) {
    case "openrouter":
      modelFactory = (options?: Record<string, any>) =>
        openrouter(modelId, options);
      break;
    default:
      throw new Error("Invalid provider");
  }

  return {
    instanceFactory: modelFactory,
    config: modelConfig,
  };
};

export const getModels = (): ModelConfig[] => {
  const models: ModelConfig[] = [];
  const providerConfig = providerConfigs();

  for (const config of Object.values(providerConfig)) {
    if (config?.models) {
      config.models.forEach((m) => models.push(m));
    }
  }

  return models;
};

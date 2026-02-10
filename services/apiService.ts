
import { GoogleGenAI } from "@google/genai";
import { Provider, ValidationStatus, ValidationResult } from "../types";

export const detectProvider = (key: string): Provider => {
  const trimmedKey = key.trim();
  if (trimmedKey.startsWith('sk-ant-')) return Provider.ANTHROPIC;
  if (trimmedKey.startsWith('sk-')) return Provider.OPENAI;
  if (trimmedKey.startsWith('AIza') || (trimmedKey.length >= 30 && trimmedKey.length <= 60)) return Provider.GEMINI;
  return Provider.CUSTOM; 
};

const getErrorAnalysis = (provider: Provider, status: ValidationStatus, errorMsg: string = ""): ValidationResult['errorAnalysis'] => {
  const isSucceeded = status === ValidationStatus.VALID;
  const isModelNotFoundError = errorMsg.includes("not found") || errorMsg.includes("404");
  
  const analyses: Record<Provider, any> = {
    [Provider.GEMINI]: {
      whereToUse: "Optimized for Google's multimodal models. Best used in applications requiring massive context windows and fast image/video processing.",
      expectedErrors: isSucceeded ? "None currently." : (isModelNotFoundError ? "MODEL_NOT_FOUND: You are likely using a legacy model name like 'gemini-1.5-pro'." : "Common: 'API_KEY_INVALID' or 'PERMISSION_DENIED'."),
      reason: isSucceeded ? "Handshake successful. Key is active." : (isModelNotFoundError ? "The API Key is VALID, but the model name you are requesting does not exist in this API version." : `Handshake Failed: ${errorMsg}`),
      nextSteps: isSucceeded ? "Ready for integration. Use 'gemini-2.0-flash' or 'gemini-3-pro-preview'." : (isModelNotFoundError ? "STOP using 'gemini-1.5-pro'. Update your code to use 'gemini-2.0-flash' or 'gemini-3-pro-preview'." : "Visit Google AI Studio to verify project status.")
    },
    [Provider.OPENAI]: {
      whereToUse: "Industry standard for GPT-4o, structured outputs, and tool calling.",
      expectedErrors: isSucceeded ? "None currently." : "Common: '401 Unauthorized' or '429 Too Many Requests'.",
      reason: isSucceeded ? "Authentication confirmed." : `Authentication Failed: ${errorMsg}`,
      nextSteps: isSucceeded ? "Secure for production." : "Ensure you have a positive balance at platform.openai.com."
    },
    [Provider.ANTHROPIC]: {
      whereToUse: "Claude is preferred for high-fidelity writing and precise coding logic.",
      expectedErrors: isSucceeded ? "None currently." : "Common: 'authentication_error' or 'rate_limit_error'.",
      reason: isSucceeded ? "Validated via Anthropic Messages API." : `Validation Error: ${errorMsg}`,
      nextSteps: isSucceeded ? "Ready for high-precision workflows." : "Check Anthropic Console for 'Active' status."
    },
    [Provider.CUSTOM]: {
      whereToUse: "Unknown infrastructure.",
      expectedErrors: "Format unrecognized.",
      reason: "The key format does not match known patterns.",
      nextSteps: "Verify the provider source."
    }
  };

  return analyses[provider];
};

export const validateGeminiKey = async (key?: string): Promise<ValidationResult> => {
  const start = performance.now();
  const apiKeyToUse = key || process.env.API_KEY;
  
  try {
    const ai = new GoogleGenAI({ apiKey: apiKeyToUse });
    // We test with a modern model name.
    await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'hi',
    });
    
    const latency = Math.round(performance.now() - start);
    return {
      provider: Provider.GEMINI,
      status: ValidationStatus.VALID,
      message: `Gemini Infrastructure Online`,
      latency,
      key: apiKeyToUse,
      errorAnalysis: getErrorAnalysis(Provider.GEMINI, ValidationStatus.VALID)
    };
  } catch (error: any) {
    const latency = Math.round(performance.now() - start);
    const errorMsg = error.message || "";
    
    // Check if the key is actually valid but the error is about something else
    // (Though for Gemini, if the key is wrong, it usually fails before model choice)
    return {
      provider: Provider.GEMINI,
      status: ValidationStatus.INVALID,
      message: errorMsg,
      latency,
      key: apiKeyToUse,
      errorAnalysis: getErrorAnalysis(Provider.GEMINI, ValidationStatus.INVALID, errorMsg)
    };
  }
};

export const validateOpenAIKey = async (apiKey: string): Promise<ValidationResult> => {
  const start = performance.now();
  try {
    const openAiRes = await fetch("https://api.openai.com/v1/models", {
      method: "GET",
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    if (!openAiRes.ok) {
      const err = await openAiRes.json().catch(() => ({}));
      throw new Error(err.error?.message || "OpenAI rejected key");
    }
    const latency = Math.round(performance.now() - start);
    return {
      provider: Provider.OPENAI,
      status: ValidationStatus.VALID,
      message: `OpenAI Infrastructure Online`,
      latency,
      key: apiKey,
      errorAnalysis: getErrorAnalysis(Provider.OPENAI, ValidationStatus.VALID)
    };
  } catch (error: any) {
    const latency = Math.round(performance.now() - start);
    return {
      provider: Provider.OPENAI,
      status: ValidationStatus.INVALID,
      message: error.message || "OpenAI validation failed.",
      latency,
      key: apiKey,
      errorAnalysis: getErrorAnalysis(Provider.OPENAI, ValidationStatus.INVALID, error.message)
    };
  }
};

export const validateAnthropicKey = async (apiKey: string): Promise<ValidationResult> => {
  const start = performance.now();
  try {
    const antRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 1,
        messages: [{ role: "user", content: "hi" }]
      })
    });
    if (!antRes.ok) {
      const err = await antRes.json().catch(() => ({}));
      throw new Error(err.error?.message || "Anthropic rejected key");
    }
    const latency = Math.round(performance.now() - start);
    return {
      provider: Provider.ANTHROPIC,
      status: ValidationStatus.VALID,
      message: `Anthropic Infrastructure Online`,
      latency,
      key: apiKey,
      errorAnalysis: getErrorAnalysis(Provider.ANTHROPIC, ValidationStatus.VALID)
    };
  } catch (error: any) {
    const latency = Math.round(performance.now() - start);
    return {
      provider: Provider.ANTHROPIC,
      status: ValidationStatus.INVALID,
      message: error.message || "Anthropic validation failed.",
      latency,
      key: apiKey,
      errorAnalysis: getErrorAnalysis(Provider.ANTHROPIC, ValidationStatus.INVALID, error.message)
    };
  }
};

export const validateUniversalKey = async (apiKey: string): Promise<ValidationResult> => {
  const provider = detectProvider(apiKey);
  switch (provider) {
    case Provider.GEMINI:
      return validateGeminiKey(apiKey);
    case Provider.OPENAI:
      return validateOpenAIKey(apiKey);
    case Provider.ANTHROPIC:
      return validateAnthropicKey(apiKey);
    default:
      const start = performance.now();
      const latency = Math.round(performance.now() - start);
      return {
        provider: Provider.CUSTOM,
        status: ValidationStatus.INVALID,
        message: "Provider format not recognized.",
        latency,
        key: apiKey,
        errorAnalysis: getErrorAnalysis(Provider.CUSTOM, ValidationStatus.INVALID)
      };
  }
};

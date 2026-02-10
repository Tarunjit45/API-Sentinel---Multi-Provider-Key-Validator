
export enum Provider {
  GEMINI = 'GEMINI',
  OPENAI = 'OPENAI',
  ANTHROPIC = 'ANTHROPIC',
  CUSTOM = 'CUSTOM'
}

export enum ValidationStatus {
  IDLE = 'IDLE',
  PENDING = 'PENDING',
  VALID = 'VALID',
  INVALID = 'INVALID',
  ERROR = 'ERROR'
}

export interface ValidationResult {
  provider: Provider;
  status: ValidationStatus;
  message: string;
  details?: any;
  latency?: number;
  key?: string;
  errorAnalysis?: {
    reason: string;
    whereToUse: string;
    expectedErrors: string;
    nextSteps: string;
  };
}

export interface ProviderConfig {
  id: Provider;
  name: string;
  icon: string;
  description: string;
  placeholder: string;
}


import React from 'react';
import { Provider, ProviderConfig } from './types';

export const PROVIDERS: ProviderConfig[] = [
  {
    id: Provider.GEMINI,
    name: 'Google Gemini',
    description: 'Verify system connectivity with Gemini Flash',
    icon: '✨',
    placeholder: 'Testing configured system key...'
  },
  {
    id: Provider.OPENAI,
    name: 'OpenAI',
    description: 'Check GPT-4o or GPT-3.5 keys',
    icon: '🤖',
    placeholder: 'sk-...'
  },
  {
    id: Provider.ANTHROPIC,
    name: 'Anthropic Claude',
    description: 'Verify Claude 3 Opus/Sonnet keys',
    icon: '🦅',
    placeholder: 'sk-ant-...'
  }
];

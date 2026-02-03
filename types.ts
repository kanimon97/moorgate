export interface VoiceOption {
  id: string;
  name: string;
  provider: string;
  previewUrl?: string;
  labels?: {
    accent?: string;
    gender?: string;
    age?: string;
    description?: string;
    "use case"?: string;
  };
}

export interface CallStatus {
  status: 'inactive' | 'loading' | 'active' | 'error';
  latency: number; // in ms
}

export interface VapiEvent {
  message: {
    type: string;
    [key: string]: any;
  };
}

export type VapiRole = 'assistant' | 'user' | 'system';
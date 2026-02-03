import { VoiceOption } from './types';

// Vapi Public Key from environment variable
export const VAPI_PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY || '61e2192e-63d5-4029-abde-dc5f4910a291';

// ElevenLabs British accent voices
export const VOICES: VoiceOption[] = [
  { 
    id: 'Q0HZwrR1H2SmRvd5cX3U', 
    name: 'Charlie', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/Q0HZwrR1H2SmRvd5cX3U/d6f45c6e-7ee5-4e1f-92c1-6f3e8e785e3e.mp3',
    labels: { accent: 'British', gender: 'male', description: 'Conversational' }
  },
  { 
    id: 'lUTamkMw7gOzZbFIwmq4', 
    name: 'James', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/lUTamkMw7gOzZbFIwmq4/8e1c5e7a-4e5f-4e5f-8e1c-5e7a4e5f4e5f.mp3',
    labels: { accent: 'British', gender: 'male', description: 'Professional' }
  },
  { 
    id: '8RwERzS73M5BcreQgmi6', 
    name: 'Luke', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/8RwERzS73M5BcreQgmi6/7e2c4e5f-4e5f-4e5f-7e2c-4e5f4e5f4e5f.mp3',
    labels: { accent: 'British', gender: 'male', description: 'Warm' }
  },
  { 
    id: 'cYctNG9CmLHHErrIh5s7', 
    name: 'Hermione', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/cYctNG9CmLHHErrIh5s7/3e6c8e9a-4e5f-4e5f-3e6c-8e9a4e5f4e5f.mp3',
    labels: { accent: 'British', gender: 'female', description: 'Clear' }
  },
  { 
    id: 'l0jEJEG5ZuUd9SnkaVdv', 
    name: 'Olivia', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/l0jEJEG5ZuUd9SnkaVdv/0e9c1e2a-4e5f-4e5f-0e9c-1e2a4e5f4e5f.mp3',
    labels: { accent: 'British', gender: 'female', description: 'Soothing' }
  },
  { 
    id: 'Z8EQ8njRgMwlt3sxHWT2', 
    name: 'Blondie', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/Z8EQ8njRgMwlt3sxHWT2/2e7c9e0a-4e5f-4e5f-2e7c-9e0a4e5f4e5f.mp3',
    labels: { accent: 'British', gender: 'female', description: 'Bright' }
  },
  { 
    id: '9TwzC887zQyDD4yBthzD', 
    name: 'Meera', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/9TwzC887zQyDD4yBthzD/1e8c0e1a-4e5f-4e5f-1e8c-0e1a4e5f4e5f.mp3',
    labels: { accent: 'British', gender: 'female', description: 'Confident' }
  },
];

export const DEFAULT_VOICE_ID = 'Q0HZwrR1H2SmRvd5cX3U'; // Charlie
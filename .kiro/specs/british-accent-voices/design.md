# Design Document: British Accent Voices

## Overview

This design updates the voice configuration system to replace Gemini voices with 14 British accent voices from ElevenLabs. The implementation involves updating the voice data structure in `constants.ts`, ensuring the existing `VoicePicker` component continues to function correctly, and verifying that the `useVapi` hook properly passes the selected voice configuration to the Vapi SDK.

The design maintains backward compatibility with the existing UI/UX while swapping the underlying voice data. No changes to component logic or UI rendering are required - only the voice data array needs updating.

## Architecture

The voice selection system follows a simple data-driven architecture:

```
constants.ts (Voice Data)
    ↓
VoicePicker Component (UI)
    ↓
useVapi Hook (Integration)
    ↓
Vapi SDK (External API)
```

**Data Flow:**
1. Voice options are defined in `constants.ts` as a typed array
2. `VoicePicker` component receives the voice array and renders the dropdown UI
3. User selects a voice, triggering `onValueChange` callback with the voice ID
4. Parent component stores the selected voice ID in state
5. When starting a call, `useVapi.toggleCall()` receives the selected voice ID
6. The hook passes the voice configuration to Vapi's `start()` method

## Components and Interfaces

### Voice Configuration (constants.ts)

**Current Structure:**
```typescript
export const VOICES: VoiceOption[] = [
  { 
    id: 'Puck', 
    name: 'Puck', 
    provider: 'Google',
    previewUrl: DEFAULT_PREVIEW,
    labels: { accent: 'American', gender: 'male', description: 'Strong' }
  },
  // ... more Gemini voices
];
```

**Updated Structure:**
```typescript
export const VOICES: VoiceOption[] = [
  { 
    id: 'Q0HZwrR1H2SmRvd5cX3U', 
    name: 'Charlie', 
    provider: '11labs',
    previewUrl: 'https://storage.googleapis.com/eleven-public-cdn/premade/voices/Q0HZwrR1H2SmRvd5cX3U/d6f45c6e-7ee5-4e1f-92c1-6f3e8e785e3e.mp3',
    labels: { accent: 'British', gender: 'male', description: 'Conversational' }
  },
  // ... 13 more British voices
];

export const DEFAULT_VOICE_ID = 'Q0HZwrR1H2SmRvd5cX3U'; // Charlie
```

**Key Changes:**
- `id`: Changed from voice name to ElevenLabs voice ID (required by Vapi)
- `provider`: Changed from 'Google' to '11labs'
- `previewUrl`: Updated to ElevenLabs preview URLs (format: `https://storage.googleapis.com/eleven-public-cdn/premade/voices/{voiceId}/{audioId}.mp3`)
- `labels.accent`: Changed from 'American' to 'British'
- `DEFAULT_VOICE_ID`: Updated to use Charlie's voice ID

### VoicePicker Component

**No changes required.** The component is data-driven and will automatically render the new voices. The component:
- Receives `voices` array as a prop
- Maps over voices to render dropdown items
- Displays voice metadata (name, accent, gender, description)
- Handles preview playback using the `previewUrl`
- Calls `onValueChange(voice.id)` when a voice is selected

The component already supports the `VoiceOption` interface and will work seamlessly with the updated data.

### useVapi Hook Integration

**Current Implementation:**
```typescript
await vapiRef.current?.start(VAPI_ASSISTANT_ID, {
  variableValues: {
    name: "User"
  },
  voice: {
    provider: '11labs',
    voiceId: '21m00Tcm4TlvDq8ikWAM', // Hardcoded
  } 
});
```

**Updated Implementation:**
```typescript
const toggleCall = useCallback(async (selectedVoiceId: string) => {
  if (callStatus === 'active' || callStatus === 'loading') {
    setCallStatus('inactive');
    setConversationState('inactive');
    vapiRef.current?.stop();
  } else {
    setCallStatus('loading');
    setConversationState('thinking');
    try {
      await vapiRef.current?.start(VAPI_ASSISTANT_ID, {
        variableValues: {
          name: "User"
        },
        voice: {
          provider: '11labs',
          voiceId: selectedVoiceId, // Use parameter instead of hardcoded value
        } 
      });
    } catch (err) {
      console.error("Failed to start call", err);
      setCallStatus('error');
    }
  }
}, [callStatus]);
```

**Key Change:** The `toggleCall` function already accepts `selectedVoiceId` as a parameter but doesn't use it. We need to replace the hardcoded voice ID with the parameter value.

## Data Models

### VoiceOption Interface

The existing `VoiceOption` interface in `types.ts` already supports all required fields:

```typescript
export interface VoiceOption {
  id: string;           // ElevenLabs voice ID
  name: string;         // Display name (e.g., "Charlie")
  provider: string;     // "11labs"
  previewUrl?: string;  // ElevenLabs preview URL
  labels?: {
    accent?: string;    // "British"
    gender?: string;    // "male" or "female"
    age?: string;       // Optional
    description?: string; // Voice characteristic
    "use case"?: string;  // Optional
  };
}
```

No changes to the interface are required.

### Voice Data Mapping

The 14 British accent voices map to the following structure:

| Name | Voice ID | Gender | Description |
|------|----------|--------|-------------|
| Charlie | Q0HZwrR1H2SmRvd5cX3U | male | Conversational |
| James | dNH3PGQenpJn3UgJkJS8 | male | Professional |
| Luke | 8RwERzS73M5BcreQgmi6 | male | Warm |
| Jack | vKaxWReVD8llVRJRbBf5 | male | Energetic |
| Fin | XZEfcFyBnzsNJrdvkWdI | male | Calm |
| Jude | Yg7C1g7suzNt5TisIqkZ | male | Friendly |
| Hermione | cYctNG9CmLHHErrIh5s7 | female | Clear |
| Blondie | 4BWwbsA70lmV7RMG0Acs | female | Bright |
| Jo | L4so9SudEsIYzE9j4qlR | female | Confident |
| Olivia | l0jEJEG5ZuUd9SnkaVdv | female | Soothing |
| Blondie 2 | YPbk892xlMnFoVOkxyGD | female | Upbeat |
| Roshni | fq1SdXsX6OokE10pJ4Xw | female | Professional |
| Verity | oW8bn5YtBB89X2nJ0DT9 | female | Articulate |
| Cass | WbwwsO6cCyUItWWlHOKN | female | Natural |

### ElevenLabs Preview URL Format

ElevenLabs provides preview URLs in the format:
```
https://storage.googleapis.com/eleven-public-cdn/premade/voices/{voiceId}/{audioId}.mp3
```

For voices where the specific audio ID is not available, we can use a fallback preview URL or attempt to construct the URL using the voice ID. If preview URLs cannot be determined, we'll use a generic ElevenLabs preview as a fallback.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Voice Configuration Structure Validity

*For any* voice object in the VOICES array, it should have all required fields (id, name, provider='11labs'), a British accent label, lowercase gender values (if present), and a preview URL.

**Validates: Requirements 1.2, 1.3, 1.4, 4.1**

### Property 2: Voice Array Completeness

*For any* voice in the provided list of 14 British accent voices, that voice should exist in the VOICES array with the correct voice ID.

**Validates: Requirements 1.1**

## Error Handling

### Voice Configuration Errors

**Missing Voice Data:**
- If the VOICES array is empty or undefined, the VoicePicker will display "No voice found" message
- The application should not crash if voice data is malformed

**Invalid Voice Selection:**
- If a selected voice ID doesn't exist in the VOICES array, the VoicePicker will show the placeholder text
- The DEFAULT_VOICE_ID should always match a valid voice in the array

### Preview Playback Errors

**Audio Loading Failures:**
- If a preview URL fails to load, the audio player will log an error to console: "Playback error"
- The UI will not show an error state - the play button will simply not play audio
- Users can still select the voice even if preview fails

**Network Errors:**
- Preview playback depends on network connectivity to ElevenLabs CDN
- No retry logic is implemented - users must click play again if initial load fails

### Vapi Integration Errors

**Call Start Failures:**
- If Vapi's start() method fails, the error is caught and logged: "Failed to start call"
- Call status is set to 'error' state
- Users must manually retry by clicking the call button again

**Invalid Voice Configuration:**
- If the voice configuration format is incorrect, Vapi SDK will reject the call
- Error handling is the same as call start failures

## Testing Strategy

This feature requires both unit tests and property-based tests to ensure comprehensive coverage.

### Unit Tests

Unit tests will focus on specific examples and edge cases:

1. **Voice Configuration Tests:**
   - Verify VOICES array has exactly 14 elements
   - Verify DEFAULT_VOICE_ID matches a voice in the array
   - Verify each specific voice (Charlie, James, etc.) exists with correct metadata

2. **Component Integration Tests:**
   - Render VoicePicker with new voices and verify all 14 are displayed
   - Simulate voice selection and verify onValueChange is called with correct ID
   - Test preview button interaction and audio player behavior
   - Test dropdown open/close behavior
   - Test search functionality with British accent voices

3. **Vapi Integration Tests:**
   - Mock Vapi SDK and verify start() is called with correct voice configuration
   - Verify voice parameter structure matches Vapi's expected format
   - Test that selectedVoiceId parameter is used instead of hardcoded value

### Property-Based Tests

Property-based tests will verify universal properties across all inputs. Each test should run a minimum of 100 iterations.

**Testing Library:** We'll use a property-based testing library appropriate for TypeScript/JavaScript (e.g., fast-check).

**Property Test 1: Voice Structure Validation**
- Generate: Random indices into the VOICES array
- Test: Each voice has required fields with correct types and values
- Tag: **Feature: british-accent-voices, Property 1: Voice Configuration Structure Validity**
- Validates: Requirements 1.2, 1.3, 1.4, 4.1

**Property Test 2: Voice Completeness**
- Generate: The list of 14 expected voice IDs
- Test: Each expected voice ID exists in the VOICES array
- Tag: **Feature: british-accent-voices, Property 2: Voice Array Completeness**
- Validates: Requirements 1.1

### Test Configuration

- Minimum 100 iterations per property test
- Each property test must reference its design document property in a comment
- Unit tests and property tests are complementary - both are required
- Property tests handle comprehensive input coverage
- Unit tests focus on specific examples and integration points

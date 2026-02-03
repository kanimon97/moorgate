# Implementation Plan: British Accent Voices

## Overview

This implementation updates the voice configuration to use 14 British accent voices from ElevenLabs. The changes are primarily data-driven, requiring updates to `constants.ts` and a small fix to `useVapi.ts` to use the selected voice ID parameter. The existing VoicePicker component requires no changes.

## Tasks

- [x] 1. Update voice configuration data in constants.ts
  - Replace the VOICES array with 14 British accent voices from ElevenLabs
  - Set provider to '11labs' for all voices
  - Include voice IDs, names, and metadata (accent: 'British', gender, description)
  - Add preview URLs for each voice (use ElevenLabs CDN format or fallback)
  - Update DEFAULT_VOICE_ID to use Charlie's voice ID (Q0HZwrR1H2SmRvd5cX3U)
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1_

- [ ]* 1.1 Write property test for voice configuration structure
  - **Property 1: Voice Configuration Structure Validity**
  - **Validates: Requirements 1.2, 1.3, 1.4, 4.1**
  - Test that all voices have required fields with correct values
  - Use fast-check or similar property-based testing library
  - Run minimum 100 iterations

- [ ]* 1.2 Write property test for voice array completeness
  - **Property 2: Voice Array Completeness**
  - **Validates: Requirements 1.1**
  - Test that all 14 expected voice IDs exist in the VOICES array
  - Run minimum 100 iterations

- [ ]* 1.3 Write unit tests for voice configuration
  - Test VOICES array has exactly 14 elements
  - Test DEFAULT_VOICE_ID matches a voice in the array
  - Test specific voices (Charlie, James, etc.) exist with correct metadata
  - _Requirements: 1.1, 1.5_

- [x] 2. Update useVapi hook to use selected voice ID
  - Modify toggleCall function to use the selectedVoiceId parameter instead of hardcoded value
  - Replace hardcoded voiceId '21m00Tcm4TlvDq8ikWAM' with selectedVoiceId parameter
  - Ensure voice configuration maintains the correct format for Vapi's start() method
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ]* 2.1 Write unit tests for Vapi integration
  - Mock Vapi SDK and verify start() is called with correct voice configuration
  - Test that selectedVoiceId parameter is passed to voice.voiceId
  - Verify voice parameter structure matches Vapi's expected format
  - Test that switching voices and starting a new call uses the new voice ID
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 3. Checkpoint - Verify voice picker functionality
  - Ensure all tests pass
  - Manually test voice picker displays all 14 British accent voices
  - Verify voice selection updates correctly
  - Test preview playback for multiple voices
  - Ask the user if questions arise

- [ ]* 3.1 Write component integration tests for VoicePicker
  - Render VoicePicker with new voices and verify all 14 are displayed
  - Simulate voice selection and verify onValueChange callback
  - Test preview button interaction
  - Test dropdown open/close behavior
  - Test search functionality with British accent voices
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The VoicePicker component requires no code changes - it's fully data-driven
- Preview URLs use ElevenLabs CDN format: `https://storage.googleapis.com/eleven-public-cdn/premade/voices/{voiceId}/{audioId}.mp3`
- If specific audio IDs are not available, use a fallback preview URL
- Property tests should use fast-check or similar library with minimum 100 iterations
- Each property test must include a comment tag referencing the design property

# Requirements Document

## Introduction

This feature updates the voice selection system in the Moorgate outbound sales voice assistant application to use British accent voices from ElevenLabs instead of the current Gemini voices. The change supports the company's focus on British market outbound sales by providing authentic British accent options for the voice assistant.

## Glossary

- **Voice_Picker**: The UI component that displays available voice options and allows users to select and preview voices
- **Voice_Option**: A data structure containing voice metadata including ID, name, provider, preview URL, and labels
- **ElevenLabs**: The voice synthesis provider that supplies British accent voices
- **Vapi**: The voice assistant SDK that manages call functionality and voice configuration
- **Preview_URL**: A URL pointing to an audio sample that demonstrates the voice characteristics

## Requirements

### Requirement 1: Update Voice Configuration Data

**User Story:** As a developer, I want to replace the Gemini voice list with ElevenLabs British accent voices, so that the application offers appropriate voices for British market sales calls.

#### Acceptance Criteria

1. THE Voice_Configuration SHALL define exactly 14 voice options with British accents from ElevenLabs
2. WHEN defining each voice option, THE Voice_Configuration SHALL include the voice name, ElevenLabs voice ID, provider set to '11labs', and appropriate metadata labels
3. FOR ALL voice options, THE Voice_Configuration SHALL specify 'British' as the accent label
4. WHEN a voice option includes gender information, THE Voice_Configuration SHALL use lowercase values ('male' or 'female')
5. THE Voice_Configuration SHALL set the default voice to one of the new British accent voices

### Requirement 2: Maintain Voice Picker Functionality

**User Story:** As a user, I want the voice picker to continue working with the new voices, so that I can select and preview British accent voices before making calls.

#### Acceptance Criteria

1. WHEN the voice picker displays voice options, THE Voice_Picker SHALL show all 14 British accent voices in a dropdown list
2. WHEN a user clicks the dropdown, THE Voice_Picker SHALL display all available British accent voices for selection
3. WHEN a user selects a different voice from the dropdown, THE Voice_Picker SHALL update the selected voice state with the new ElevenLabs voice ID
4. WHEN a user hovers over a voice preview button, THE Voice_Picker SHALL display the play/pause control overlay
5. WHEN a user clicks the preview button, THE Voice_Picker SHALL play the voice preview audio
6. WHEN displaying voice metadata, THE Voice_Picker SHALL show the accent, gender, and description labels
7. WHEN a user switches between voices in the dropdown, THE Voice_Picker SHALL allow multiple voice changes without requiring a page reload

### Requirement 3: Integrate with Vapi Voice Configuration

**User Story:** As a developer, I want the voice configuration to work correctly with Vapi's API, so that calls use the selected British accent voice.

#### Acceptance Criteria

1. WHEN starting a call, THE Vapi_Integration SHALL pass the voice configuration with provider '11labs' and the selected voiceId
2. WHEN the voice configuration is sent to Vapi, THE Vapi_Integration SHALL use the format expected by Vapi's start() method
3. WHEN a user switches voices in the dropdown and starts a new call, THE Vapi_Integration SHALL use the newly selected voice ID
4. THE Vapi_Integration SHALL maintain compatibility with the existing voice parameter structure

### Requirement 4: Provide Voice Preview URLs

**User Story:** As a user, I want to preview each British accent voice, so that I can choose the most appropriate voice for my sales calls.

#### Acceptance Criteria

1. FOR ALL voice options, THE Voice_Configuration SHALL include a preview URL that plays an audio sample
2. WHEN a preview URL is not available for a specific voice, THE Voice_Configuration SHALL use a fallback preview URL
3. WHEN a user plays a preview, THE Audio_Player SHALL load and play the audio from the preview URL

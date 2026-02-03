import { useEffect, useState, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';
import { VAPI_PUBLIC_KEY } from '../constants';
import { CallStatus } from '../types';

export type ConversationState = 'inactive' | 'thinking' | 'listening' | 'talking';

export const useVapi = () => {
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [callStatus, setCallStatus] = useState<CallStatus['status']>('inactive');
  const [conversationState, setConversationState] = useState<ConversationState>('inactive');
  
  const vapiRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Vapi SDK
    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    // Event Listeners
    vapi.on('call-start', () => {
      console.log('Call started');
      setCallStatus('active');
      setConversationState('listening');
    });

    vapi.on('call-end', () => {
      console.log('Call ended');
      setCallStatus('inactive');
      setConversationState('inactive');
      setVolumeLevel(0);
    });

    vapi.on('speech-start', () => {
      console.log('User speech started');
      setConversationState('listening');
    });

    vapi.on('speech-end', () => {
      console.log('User speech ended');
      setConversationState('thinking');
    });

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level);
    });

    vapi.on('message', (message: any) => {
      console.log('Vapi message:', message);
      
      // As soon as we get any message, the call is active
      setCallStatus('active');
      
      // Handle status updates to detect when call actually starts
      if (message.type === 'status-update') {
        if (message.status === 'active') {
          console.log('Call is now active (from status-update)');
          setCallStatus('active');
          setConversationState('listening');
        } else if (message.status === 'ended') {
          console.log('Call ended (from status-update)');
          setCallStatus('inactive');
          setConversationState('inactive');
        }
      }
      
      // Handle different message types
      if (message.type === 'speech-update') {
        if (message.role === 'assistant' && message.status === 'started') {
          setConversationState('talking');
        } else if (message.role === 'assistant' && message.status === 'stopped') {
          setConversationState('listening');
        }
      }
      
      if (message.type === 'transcript') {
        console.log('Transcript:', message.transcript);
        // If we're getting transcripts, the call is definitely active
        setCallStatus('active');
      }
    });

    vapi.on('error', (e: any) => {
      console.error('Vapi Error:', e);
      console.error('Error details:', JSON.stringify(e, null, 2));
      
      // Don't treat daily-error with "Meeting has ended" as a real error
      // This is expected when the call ends normally
      if (e.type === 'daily-error' && e.error?.message?.type === 'ejected') {
        console.log('Call ended normally (meeting ejected)');
        return;
      }
      
      setCallStatus('error');
      setConversationState('inactive');
    });

    // Cleanup
    return () => {
      vapi.stop();
    };
  }, []); // Remove dependencies to prevent re-initialization

  const toggleCall = useCallback(async (selectedVoiceId: string) => {
    if (callStatus === 'active' || callStatus === 'loading') {
      setCallStatus('inactive');
      setConversationState('inactive');
      vapiRef.current?.stop();
    } else {
      setCallStatus('loading');
      setConversationState('thinking');
      
      try {
        // Get the selected voice name for the agent_name variable
        const selectedVoiceName = selectedVoiceId === 'Q0HZwrR1H2SmRvd5cX3U' ? 'Charlie' :
                                  selectedVoiceId === 'lUTamkMw7gOzZbFIwmq4' ? 'James' :
                                  selectedVoiceId === '8RwERzS73M5BcreQgmi6' ? 'Luke' :
                                  selectedVoiceId === 'cYctNG9CmLHHErrIh5s7' ? 'Hermione' :
                                  selectedVoiceId === 'l0jEJEG5ZuUd9SnkaVdv' ? 'Olivia' :
                                  selectedVoiceId === 'Z8EQ8njRgMwlt3sxHWT2' ? 'Blondie' :
                                  selectedVoiceId === '9TwzC887zQyDD4yBthzD' ? 'Meera' : 'Charlie';

        console.log('Starting call with voice:', selectedVoiceName);
        
        // Create inline assistant configuration
        await vapiRef.current?.start({
          model: {
            provider: 'openai',
            model: 'gpt-4o-mini',
            temperature: 0.4,
            maxTokens: 250,
            messages: [
              {
                role: 'system',
                content: `You are a calm, professional, friendly client relationship assistant calling on behalf of Moorgate Finance, a UK-based finance brokerage firm.

Your goal is to reconnect with previous clients in a warm, respectful, and non-salesy way to understand whether they have any upcoming financial needs or questions.

Tone:
- Calm
- Friendly
- Relaxed
- Professional
- Not pushy
- Not sales-driven

Style:
- Speak clearly and naturally.
- Use British conversational phrasing.
- Keep sentences short and easy to follow.
- Do not sound scripted.
- Do not rush.

Conversation Strategy:
- Introduce yourself clearly.
- Confirm you are speaking to the right person.
- Explain the purpose of the call briefly.
- Ask open-ended questions.
- Listen carefully.
- Respond thoughtfully.
- Never pressure.
- If the user is busy, politely offer to call back later.

Opening Script Example:
"Hi, is this Tom? Hi Tom, my name is {{agent_name}}, I'm calling from Moorgate Finance. You previously worked with us, and we're just checking in to see if you might need any support with upcoming finance plans or if you have any questions at all."

If they say no:
"Not a problem at all — thanks for your time, and feel free to reach out anytime if anything comes up."

If they say maybe:
"Of course — would it be helpful to briefly talk through what you're considering?"

If they are busy:
"No worries at all — when would be a better time to reach you?"

Never use high-pressure sales language.
Never mention AI.
Never mention automation.`
              }
            ]
          },
          voice: {
            provider: '11labs',
            voiceId: selectedVoiceId,
          },
          name: 'Moorgate Finance Assistant',
          firstMessage: `Hello! This is ${selectedVoiceName} from Moorgate Finance. How are we doing today?`,
          transcriber: {
            provider: 'deepgram',
            model: 'nova-2',
            language: 'en-GB',
          },
          silenceTimeoutSeconds: 30,
          maxDurationSeconds: 600,
        });
        
        console.log('Call started successfully');
      } catch (err: any) {
        console.error("Failed to start call", err);
        setCallStatus('error');
        setConversationState('inactive');
      }
    }
  }, [callStatus]);

  return {
    volumeLevel,
    callStatus,
    conversationState,
    toggleCall,
  };
};

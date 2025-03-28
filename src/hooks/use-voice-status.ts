
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export type VoiceStatus = 'idle' | 'connecting' | 'connected' | 'speaking' | 'muted' | 'disconnected' | 'error';

interface UseVoiceStatusOptions {
  onStatusChange?: (status: VoiceStatus) => void;
  onError?: (error: string) => void;
  showToasts?: boolean;
}

/**
 * Custom hook for managing voice status in a room
 */
export const useVoiceStatus = (options: UseVoiceStatusOptions = {}) => {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [isMuted, setIsMuted] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // In a real app, this would interact with a WebRTC or audio API
  const connectToVoice = async () => {
    if (isConnecting) return;
    
    try {
      setIsConnecting(true);
      setStatus('connecting');
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStatus('connected');
      setIsMuted(true);
      
      if (options.showToasts) {
        toast.success('Connected to voice channel');
      }
      
      // In a real app, you'd establish WebRTC connection here
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to voice';
      setStatus('error');
      setError(errorMessage);
      
      if (options.onError) {
        options.onError(errorMessage);
      }
      
      if (options.showToasts) {
        toast.error(`Voice connection error: ${errorMessage}`);
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  const disconnectVoice = () => {
    setStatus('disconnected');
    setIsMuted(true);
    
    if (options.showToasts) {
      toast.info('Disconnected from voice channel');
    }
    
    // In a real app, you'd close WebRTC connection here
  };
  
  const toggleMute = () => {
    if (status !== 'connected' && status !== 'speaking' && status !== 'muted') {
      return;
    }
    
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setStatus(newMutedState ? 'muted' : 'connected');
    
    if (options.showToasts) {
      toast(newMutedState ? 'Microphone muted' : 'Microphone unmuted');
    }
    
    // In a real app, you'd toggle the audio track here
  };
  
  // Simulate speaking detection (in a real app, this would use audio levels)
  useEffect(() => {
    if (status !== 'connected' || isMuted) return;
    
    let speakingTimeout: NodeJS.Timeout;
    
    const randomSpeakingSimulation = () => {
      // Randomly simulate speaking state changes
      const shouldSpeak = Math.random() > 0.7;
      
      if (shouldSpeak && !isMuted) {
        setStatus('speaking');
        
        // Revert to connected after a random time
        speakingTimeout = setTimeout(() => {
          setStatus('connected');
        }, Math.random() * 3000 + 500);
      }
      
      // Schedule next simulation
      setTimeout(randomSpeakingSimulation, Math.random() * 5000 + 2000);
    };
    
    randomSpeakingSimulation();
    
    return () => {
      clearTimeout(speakingTimeout);
    };
  }, [status, isMuted]);
  
  // Notify on status changes
  useEffect(() => {
    if (options.onStatusChange) {
      options.onStatusChange(status);
    }
  }, [status, options]);
  
  return {
    status,
    isMuted,
    isConnecting,
    error,
    connectToVoice,
    disconnectVoice,
    toggleMute,
  };
};

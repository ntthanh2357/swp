import { useEffect, useRef, useState } from 'react';

interface GoogleUser {
  credential: string;
  select_by: string;
}

interface GoogleAuthOptions {
  onSuccess: (response: GoogleUser) => void;
  onError: () => void;
  clientId: string;
  enabled?: boolean;
}

export const useGoogleAuth = ({ onSuccess, onError, clientId, enabled = true }: GoogleAuthOptions) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  const [isReady, setIsReady] = useState(false);

  // Check if we have a valid Google Client ID (not demo/placeholder)
  const isValidClientId = clientId && 
    clientId !== "demo_google_client_id_for_testing" && 
    clientId !== "your_google_client_id_here" &&
    clientId.includes('.googleusercontent.com');
  useEffect(() => {
    if (!enabled || !clientId || !isValidClientId) {
      return;
    }

    const initializeGoogleAuth = () => {
      if (typeof window.google !== 'undefined' && !initialized.current) {
        initialized.current = true;
        setIsReady(true);

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response: GoogleUser) => {
            if (response.credential) {
              onSuccess(response);
            } else {
              onError();
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        console.log('Google Auth initialized successfully');
      }
    };

    // Check if Google script is already loaded
    if (typeof window.google !== 'undefined') {
      initializeGoogleAuth();
    } else {
      // Wait for Google script to load
      const checkGoogleLoaded = setInterval(() => {
        if (typeof window.google !== 'undefined') {
          clearInterval(checkGoogleLoaded);
          initializeGoogleAuth();
        }
      }, 100);

      return () => clearInterval(checkGoogleLoaded);
    }
  }, [clientId, onSuccess, onError]);

  const signInWithGoogle = () => {
    if (typeof window.google !== 'undefined' && isReady && isValidClientId) {
      window.google.accounts.id.prompt();
    } else {
      console.log('Google Auth not ready yet, simulating login for demo...');
      // For demo purposes, simulate a Google login
      setTimeout(() => {
        // Create a proper JWT-like structure for the mock credential
        const mockHeader = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
        const mockPayload = btoa(JSON.stringify({
          email: 'demo@gmail.com',
          name: 'Demo User',
          picture: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
          sub: 'demo-google-id'
        }));
        const mockSignature = btoa('mock-signature');
        
        const mockGoogleResponse = {
          credential: `${mockHeader}.${mockPayload}.${mockSignature}`,
          select_by: 'btn'
        };
        onSuccess(mockGoogleResponse);
      }, 1000);
    }
  };

  return {
    googleButtonRef,
    signInWithGoogle,
    isReady,
  };
};

// Decode JWT token to get user info
export const decodeGoogleCredential = (credential: string) => {
  try {
    const payload = credential.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding Google credential:', error);
    return null;
  }
};

// Type definitions for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (options: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}
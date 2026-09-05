import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Sparkles, 
  X, 
  Shield, 
  ArrowRight, 
  HeartHandshake, 
  CheckCircle, 
  ArrowLeft, 
  Info, 
  Send,
  UserCheck,
  Check,
  Volume2,
  VolumeX,
  StopCircle,
  PanelLeftOpen,
  Menu,
  MessageSquare,
  Lock
} from 'lucide-react';
import { ChatMessage, SavedConversation, UserProfile, UserPreferences } from '../types';
import { SignedInSidebar } from './chat/SignedInSidebar';
import { ProfileModal } from './chat/ProfileModal';
import { PreferencesModal } from './chat/PreferencesModal';
import { PrivacyDataModal } from './chat/PrivacyDataModal';
import { HelpSafetyModal } from './chat/HelpSafetyModal';
import { 
  hasAccountConsented, 
  setAccountConsent, 
  removeAccountConsent, 
  CURRENT_CONSENT_VERSION 
} from '../utils/consentStorage';
import {
  createSession,
  setSessionConsent,
  sendMessage,
  sendVoiceMessage,
} from '../api/client';

interface ConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
  userEmail?: string;
  onAuthenticate?: (email: string) => void;
  onSignOut?: () => void;
  onOpenCrisisSupport?: () => void;
  onQuickExit?: () => void;
}

// Initial realistic sample conversations for signed-in prototype
const INITIAL_SAVED_CONVERSATIONS: SavedConversation[] = [
  {
    id: 'conv-sample-1',
    title: 'Navigating work burnout & overwhelm',
    isCustomTitle: true,
    isPinned: true,
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    previewText: "It is completely valid to feel overwhelmed by relentless expectations...",
    messages: [
      {
        id: 'msg-s1-1',
        sender: 'ai',
        text: 'Welcome. You are in a confidential space. How are you feeling in this moment?',
        time: 'Yesterday 3:15 PM',
      },
      {
        id: 'msg-s1-2',
        sender: 'user',
        text: "I've been feeling deeply exhausted by work deadlines and unreasonable expectations. I can't seem to turn my mind off at night.",
        time: 'Yesterday 3:16 PM',
        inputType: 'text',
      },
      {
        id: 'msg-s1-3',
        sender: 'ai',
        text: "It is completely valid to feel drained when demands continuously exceed your emotional capacity. Your worth is never defined by productivity. What would it look like to give yourself permission to step away and rest this evening?",
        time: 'Yesterday 3:17 PM',
      },
      {
        id: 'msg-s1-4',
        sender: 'user',
        text: 'I will close my work laptop and go for a quiet evening walk without notifications.',
        time: 'Yesterday 3:20 PM',
        inputType: 'text',
      },
      {
        id: 'msg-s1-5',
        sender: 'ai',
        text: 'That is a beautiful, compassionate boundary for yourself. Breathe into that intention. I am always right here when you need to reflect.',
        time: 'Yesterday 3:21 PM',
      },
    ],
  },
  {
    id: 'conv-sample-2',
    title: 'Grounding through nighttime anxiety',
    isCustomTitle: false,
    isPinned: false,
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    previewText: "Let's focus on slow physical anchors...",
    messages: [
      {
        id: 'msg-s2-1',
        sender: 'ai',
        text: 'Welcome to this calm space. What is your heart holding right now?',
        time: '3 days ago',
      },
      {
        id: 'msg-s2-2',
        sender: 'user',
        text: 'My chest feels tight and racing thoughts are keeping me awake.',
        time: '3 days ago',
        inputType: 'voice',
      },
      {
        id: 'msg-s2-3',
        sender: 'ai',
        text: "You are safe in this room right now. Let's do a gentle 4-7-8 breathing release together. Inhale softly for 4... hold for 7... and release with a sigh for 8.",
        time: '3 days ago',
      },
    ],
  },
  {
    id: 'conv-sample-3',
    title: 'Setting gentle boundaries with family',
    isCustomTitle: true,
    isPinned: false,
    createdAt: Date.now() - 604800000,
    updatedAt: Date.now() - 604800000,
    previewText: "Saying no is an act of preserving peace...",
    messages: [
      {
        id: 'msg-s3-1',
        sender: 'ai',
        text: 'Welcome. Take all the time you need.',
        time: 'Last week',
      },
      {
        id: 'msg-s3-2',
        sender: 'user',
        text: 'I struggle with feeling guilty whenever I have to say no to family demands.',
        time: 'Last week',
        inputType: 'text',
      },
      {
        id: 'msg-s3-3',
        sender: 'ai',
        text: "Guilt often arises when we confuse self-care with selfishness. Setting a boundary is not rejecting others—it is teaching them how to love you sustainably.",
        time: 'Last week',
      },
    ],
  },
];

// Helper to derive display name from email
function deriveInitialDisplayName(email: string): string {
  if (!email) return 'Sreejita Ghatak';
  if (email.toLowerCase().includes('sreejita') || email.toLowerCase().includes('ghatak')) {
    return 'Sreejita Ghatak';
  }
  const prefix = email.split('@')[0];
  const parts = prefix.split(/[._\d]+/).filter(Boolean);
  if (parts.length >= 2) {
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
  }
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return 'Sukoon Member';
}

// Automatic meaningful conversation title generator
function generateTitleFromText(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('overwhelm') || lower.includes('too much') || lower.includes('exhaust') || lower.includes('tired')) {
    return 'Feeling overwhelmed lately';
  }
  if (lower.includes('exam') || lower.includes('test') || lower.includes('study') || lower.includes('college') || lower.includes('school')) {
    return 'Anxiety before exam';
  }
  if (lower.includes('family') || lower.includes('parent') || lower.includes('mother') || lower.includes('father') || lower.includes('relative')) {
    return 'Family pressure and stress';
  }
  if (lower.includes('lonely') || lower.includes('alone') || lower.includes('isolated') || lower.includes('nobody')) {
    return 'Feeling lonely tonight';
  }
  if (lower.includes('burnout') || lower.includes('work') || lower.includes('job') || lower.includes('boss') || lower.includes('career')) {
    return 'Navigating work burnout';
  }
  if (lower.includes('sleep') || lower.includes('insomnia') || lower.includes('night') || lower.includes('awake')) {
    return 'Nighttime anxiety and rest';
  }
  if (lower.includes('boundar') || lower.includes('saying no') || lower.includes('people pleas')) {
    return 'Setting gentle boundaries';
  }
  if (lower.includes('sad') || lower.includes('cry') || lower.includes('grief') || lower.includes('loss') || lower.includes('heartbreak')) {
    return 'Processing grief and sadness';
  }
  if (lower.includes('fear') || lower.includes('scared') || lower.includes('panic') || lower.includes('anxi') || lower.includes('worry')) {
    return 'Grounding through anxious moments';
  }
  // Clean fallback from first few words
  const words = text.trim().split(/\s+/).slice(0, 4).join(' ');
  if (words.length > 0) {
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
  return 'Personal Reflection';
}

export const ConversationModal: React.FC<ConversationModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated = false,
  userEmail = '',
  onAuthenticate,
  onSignOut,
  onOpenCrisisSupport,
  onQuickExit,
}) => {
  // Step navigation: 'setup' | 'grounding' | 'preference' | 'consent' | 'active'
  const isInitiallyConsented = isAuthenticated && hasAccountConsented(userEmail || 'ghataksreejita@gmail.com');
  const [currentStep, setCurrentStep] = useState<'setup' | 'grounding' | 'preference' | 'consent' | 'active'>(
    isInitiallyConsented ? 'active' : 'setup'
  );
  
  // Optional opening thought from setup
  const [customPrompt, setCustomPrompt] = useState('');
  
  // Session Preference ('anonymous' | 'signedIn')
  const [sessionPreference, setSessionPreference] = useState<'anonymous' | 'signedIn'>(
    isAuthenticated ? 'signedIn' : 'anonymous'
  );

  // Inline auth form state for Step 2
  const [inlineAuthMode, setInlineAuthMode] = useState<'signin' | 'signup'>('signin');
  const [inlineEmail, setInlineEmail] = useState('');
  const [inlinePassword, setInlinePassword] = useState('');
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [inlineAuthError, setInlineAuthError] = useState<string | null>(null);

  // Step 3: Consent Checkbox (UNCHECKED by default for non-consented users)
  const [hasConsented, setHasConsented] = useState(isInitiallyConsented);
  const [fromGrounding, setFromGrounding] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: deriveInitialDisplayName(userEmail),
    email: userEmail || 'ghataksreejita@gmail.com',
    authProvider: userEmail.includes('gmail') ? 'Google' : 'Sukoon Account',
  });

  // User Preferences State
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    fontSize: 'normal',
    voiceSpeed: 'gentle',
    autoReadVoice: false,
    language: 'English',
    reducedMotion: false,
  });

  // Modals for signed-in account menu
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isPrivacyDataOpen, setIsPrivacyDataOpen] = useState(false);
  const [isHelpSafetyOpen, setIsHelpSafetyOpen] = useState(false);

  // Signed-In Saved Conversations Workspace State
 const [conversations, setConversations] = useState<SavedConversation[]>(() => {
  try {
    const saved = localStorage.getItem('sukoon_saved_conversations');

    if (saved) {
      return JSON.parse(saved) as SavedConversation[];
    }
  } catch (error) {
    console.error('Could not load saved conversations:', error);
  }

  return INITIAL_SAVED_CONVERSATIONS;
});
useEffect(() => {
  try {
    localStorage.setItem(
      'sukoon_saved_conversations',
      JSON.stringify(conversations)
    );
  } catch (error) {
    console.error('Could not save conversations:', error);
  }
}, [conversations]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Signed-In Private Session State (Authenticated ephemeral conversation not saved to history)
  const [isPrivateSession, setIsPrivateSession] = useState(false);
  const [privateMessages, setPrivateMessages] = useState<ChatMessage[]>([]);

  // Anonymous Active Chat State (Separate isolated ephemeral messages)
  const [anonymousMessages, setAnonymousMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-anon',
      sender: 'ai',
      text: 'Welcome. You are in a confidential space. There is no rush or pressure to share more than you feel comfortable with. How are you feeling in this moment?',
      time: 'Just now',
    },
  ]);

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Input & Voice State
  const [inputMessage, setInputMessage] = useState('');
  const [backendSessionId, setBackendSessionId] = useState<number | null>(null);
  const [backendSessionIds, setBackendSessionIds] = useState<Record<string, number>>(() => {
  try {
    const saved = localStorage.getItem('sukoon_backend_session_ids');

    if (saved) {
      return JSON.parse(saved) as Record<string, number>;
    }
  } catch (error) {
    console.error('Could not load backend session mappings:', error);
  }

  return {};
});
useEffect(() => {
  try {
    localStorage.setItem(
      'sukoon_backend_session_ids',
      JSON.stringify(backendSessionIds)
    );
  } catch (error) {
    console.error('Could not save backend session mappings:', error);
  }
}, [backendSessionIds]);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle responsive viewport resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarCollapsed(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync preference, profile, and returning-user bypass when modal opens or auth changes
  useEffect(() => {
    if (isOpen) {
      const effectiveEmail = userEmail || userProfile.email;
      if (isAuthenticated) {
        setSessionPreference('signedIn');
        setUserProfile((prev) => ({
          ...prev,
          email: userEmail || prev.email,
          displayName: prev.displayName || deriveInitialDisplayName(userEmail),
          authProvider: (userEmail || '').includes('gmail') ? 'Google' : 'Sukoon Account',
        }));

        // Returning user who has already accepted the current consent version
        if (hasAccountConsented(effectiveEmail, CURRENT_CONSENT_VERSION)) {
          setCurrentStep('active');
          setHasConsented(true);
        } else if (currentStep !== 'active') {
          setCurrentStep('setup');
          setHasConsented(false);
        }
      } else {
        setSessionPreference('anonymous');
        if (currentStep !== 'active') {
          setCurrentStep('setup');
          setHasConsented(false);
        }
      }
    }
  }, [isOpen, isAuthenticated, userEmail]);

  // Auto-scroll message stream on update
  useEffect(() => {
    if (currentStep === 'active') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, anonymousMessages, privateMessages, isPrivateSession, activeConversationId, isRecording, isProcessingVoice, currentStep]);

  // Voice recording timer
  useEffect(() => {
    if (isRecording) {
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  if (!isOpen) return null;

  // Find active conversation for signed-in session (null if returning user has not selected one)
  const activeConversation = activeConversationId
    ? (conversations.find((c) => c.id === activeConversationId) || null)
    : null;

  const currentMessages = 
    sessionPreference === 'signedIn' && isAuthenticated
      ? (isPrivateSession
          ? privateMessages
          : (activeConversation ? activeConversation.messages : []))
      : anonymousMessages;

  // Start a Private Session in Signed-In mode (authenticated, but never saved to history)
  const handleStartPrivateSession = () => {
    if (speakingMessageId && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    setIsRecording(false);
    setIsProcessingVoice(false);
    setInputMessage('');

    // Private Session begins as a clean conversation with NO fake assistant bubble
    setBackendSessionId(null);
    setPrivateMessages([]);
    setIsPrivateSession(true);
    setCurrentStep('active');
  };

  // Fully decoupled End Session (never triggers crisis support or lingering modals)
  const handleEndSession = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMessageId(null);
    setIsRecording(false);
    setIsProcessingVoice(false);
    setIsProfileOpen(false);
    setIsPreferencesOpen(false);
    setIsPrivacyDataOpen(false);
    setIsHelpSafetyOpen(false);
    setInputMessage('');
    setCustomPrompt('');
    setShowAuthForm(false);
    setInlineAuthError(null);
    setFromGrounding(false);
    setBackendSessionId(null);

    // If ending an active Private Session, return cleanly to signed-in workspace without closing app
    if (isPrivateSession && sessionPreference === 'signedIn' && isAuthenticated) {
  setPrivateMessages([]);
  setIsPrivateSession(false);

  // Return to the backend session of the previously active saved conversation.
  setBackendSessionId(
    activeConversationId
      ? (backendSessionIds[activeConversationId] ?? null)
      : null
  );

  return;
}

    if (sessionPreference === 'anonymous' || !isAuthenticated) {
      setCurrentStep('setup');
      setHasConsented(false);
      setAnonymousMessages([
        {
          id: 'welcome-anon',
          sender: 'ai',
          text: 'Welcome. You are in a confidential space. There is no rush or pressure to share more than you feel comfortable with. How are you feeling in this moment?',
          time: 'Just now',
        },
      ]);
    }
    onClose();
  };

  const handleInlineAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInlineAuthError(null);

    const email = inlineEmail.trim();
    const password = inlinePassword.trim();

    if (!email) {
      setInlineAuthError('Please enter your email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setInlineAuthError('Please enter a valid email address (e.g. you@example.com).');
      return;
    }

    if (!password) {
      setInlineAuthError('Please enter your password.');
      return;
    }

    if (password.length < 4) {
      setInlineAuthError('Password must be at least 4 characters.');
      return;
    }

    if (onAuthenticate) {
      onAuthenticate(email);
    }
    
    setUserProfile((prev) => ({
      ...prev,
      email,
      displayName: deriveInitialDisplayName(email),
      authProvider: email.includes('gmail') ? 'Google' : 'Sukoon Account',
    }));

    setSessionPreference('signedIn');
    setShowAuthForm(false);
    setInlineAuthError(null);
  };

  // Start a fresh conversation in Signed-In mode (never restarts onboarding)
  const handleNewConversation = () => {
    setBackendSessionId(null);
    if (isPrivateSession) {
      setIsPrivateSession(false);
      setPrivateMessages([]);
    }
    const newConvId = `conv-${Date.now()}`;
    const newConv: SavedConversation = {
      id: newConvId,
      title: 'New Reflection',
      isCustomTitle: false,
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      previewText: '',
      messages: [], // Clean empty conversation with NO pre-written AI bubble
    };

    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setInputMessage('');
    setIsRecording(false);
    setIsProcessingVoice(false);
    if (speakingMessageId && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    }
    // Maintain active workspace
    setCurrentStep('active');
  };

  // Rename a conversation manually
  const handleRenameConversation = (id: string, newTitle: string) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, title: newTitle, isCustomTitle: true } : c
      )
    );
  };

  // Toggle pin/unpin
  const handleTogglePinConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  // Delete a conversation with auto-switch
  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => {
      const remaining = prev.filter((c) => c.id !== id);
      if (activeConversationId === id) {
        setActiveConversationId(null);
      }
      return remaining;
    });
  };

  // Clear all history
  const handleClearAllHistory = () => {
    setConversations([]);
    setActiveConversationId(null);
  };

  // Delete account & local data
  const handleDeleteAccount = () => {
    if (userProfile.email) {
      removeAccountConsent(userProfile.email);
    }
    if (userEmail) {
      removeAccountConsent(userEmail);
    }
    handleClearAllHistory();
    if (onSignOut) onSignOut();
    setSessionPreference('anonymous');
    handleEndSession();
  };

  // Send Text Message
  const handleSendTextMessage = () => {
    if (!inputMessage.trim()) return;
    const userText = inputMessage.trim();
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const newUserMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      time: currentTime,
      inputType: 'text',
    };

    if (sessionPreference === 'signedIn' && isAuthenticated) {
      if (isPrivateSession) {
        setPrivateMessages((prev) => [...prev, newUserMsg]);
        setInputMessage('');
        setTimeout(() => {
          generateAiResponse(userText, undefined, false, true);
        }, 900);
      } else if (activeConversation) {
        const isFirstUserMessage = !activeConversation.messages.some((m) => m.sender === 'user');
        const autoTitle = 
          !activeConversation.isCustomTitle && (isFirstUserMessage || activeConversation.title === 'New Reflection')
            ? generateTitleFromText(userText)
            : activeConversation.title;

        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeConversationId
              ? {
                  ...c,
                  title: autoTitle,
                  updatedAt: Date.now(),
                  messages: [...c.messages, newUserMsg],
                }
              : c
          )
        );

        setInputMessage('');
        setTimeout(() => {
          generateAiResponse(userText, activeConversationId ?? undefined, false, false);
        }, 900);
      } else {
        // No active conversation selected yet: create a fresh one with this first message
        const newConvId = `conv-${Date.now()}`;
        const autoTitle = generateTitleFromText(userText);
        const newConv: SavedConversation = {
          id: newConvId,
          title: autoTitle,
          isCustomTitle: false,
          isPinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          previewText: userText.slice(0, 80),
          messages: [newUserMsg],
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveConversationId(newConvId);
        setInputMessage('');
        setTimeout(() => {
          generateAiResponse(userText, newConvId, false, false);
        }, 900);
      }
    } else {
      setAnonymousMessages((prev) => [...prev, newUserMsg]);
      setInputMessage('');
      setTimeout(() => {
        generateAiResponse(userText, undefined, false, false);
      }, 900);
    }
  };

  // Start In-Chat Voice Recording
const handleStartVoiceRecording = async () => {
  try {
    // Ask the browser for microphone permission
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    mediaStreamRef.current = stream;
    audioChunksRef.current = [];

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.start();

    setIsRecording(true);
    setIsProcessingVoice(false);
  } catch (error) {
    console.error('Microphone access failed:', error);

    setIsRecording(false);
    setIsProcessingVoice(false);

    alert(
      'Microphone access is required for voice messages. Please allow microphone permission and try again.'
    );
  }
};

  // Cancel Voice Recording
  const handleCancelVoiceRecording = () => {
    setIsRecording(false);
    setIsProcessingVoice(false);
  };

 // Stop Voice Recording & Transcribe
const handleStopVoiceRecording = () => {
  const recorder = mediaRecorderRef.current;

  if (!recorder) {
    console.error('No active MediaRecorder found.');
    setIsRecording(false);
    setIsProcessingVoice(false);
    return;
  }

  setIsRecording(false);
  setIsProcessingVoice(true);

  recorder.onstop = async () => {
    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: recorder.mimeType || 'audio/webm',
      });

      audioChunksRef.current = [];

      // Stop microphone hardware
      mediaStreamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      mediaStreamRef.current = null;
      mediaRecorderRef.current = null;

      let sessionId = backendSessionId;

      // If no backend session exists yet, create one first
      if (sessionId === null) {
        sessionId = await createSession();
        await setSessionConsent(sessionId, true);

        setBackendSessionId(sessionId);

        if (activeConversationId) {
          setBackendSessionIds((prev) => ({
            ...prev,
            [activeConversationId]: sessionId as number,
          }));
        }
      }

      // Send REAL microphone audio to FastAPI
      const result = await sendVoiceMessage(sessionId, audioBlob);

      const transcript =
        result.transcript?.trim() || '[Voice message]';

      const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });

      const newVoiceMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: transcript,
        time: currentTime,
        inputType: 'voice',
      };

      const responseText =
        result.chat_result?.victim_response ||
        "Thank you for sharing that. I'm here with you.";

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: responseText,
        time: currentTime,
      };

      if (sessionPreference === 'signedIn' && isAuthenticated) {
        if (isPrivateSession) {
          setPrivateMessages((prev) => [
            ...prev,
            newVoiceMsg,
            aiMsg,
          ]);
        } else if (activeConversationId) {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === activeConversationId
                ? {
                    ...c,
                    updatedAt: Date.now(),
                    messages: [
                      ...c.messages,
                      newVoiceMsg,
                      aiMsg,
                    ],
                  }
                : c
            )
          );
        } else {
          const newConvId = `conv-${Date.now()}`;

          const newConv: SavedConversation = {
            id: newConvId,
            title: generateTitleFromText(transcript),
            isCustomTitle: false,
            isPinned: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            previewText: transcript.slice(0, 80),
            messages: [newVoiceMsg, aiMsg],
          };

          setConversations((prev) => [newConv, ...prev]);
          setActiveConversationId(newConvId);

          setBackendSessionIds((prev) => ({
            ...prev,
            [newConvId]: sessionId as number,
          }));
        }
      } else {
        setAnonymousMessages((prev) => [
          ...prev,
          newVoiceMsg,
          aiMsg,
        ]);
      }

      // Optional auto-read AI reply
      if (
        userPreferences.autoReadVoice &&
        'speechSynthesis' in window
      ) {
        handleListenToAi(aiMsg.id, responseText);
      }
    } catch (error) {
      console.error('Voice processing failed:', error);

      alert(
        'Voice processing failed. Please try again.'
      );
    } finally {
      setIsProcessingVoice(false);
    }
  };

  recorder.stop();
};
  // Generate AI response through the FastAPI backend
const generateAiResponse = async (
  userText: string,
  targetConvId?: string,
  isFromVoice = false,
  isPrivate = false
) => {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  try {
    let sessionId = backendSessionId;

    // Create the backend session on the first real user message
    if (sessionId === null) {
      sessionId = await createSession();

      // The user has already accepted the consent step in this UI.
      // Record that consent in the backend before risk analysis begins.
      await setSessionConsent(sessionId, true);

      setBackendSessionId(sessionId);

      if (targetConvId) {
       setBackendSessionIds((prev) => ({
         ...prev,
         [targetConvId]: sessionId as number,
        }));
}
}
    

    // Send the real message to FastAPI.
    // FastAPI handles AI response + risk assessment + persistence.
    const result = await sendMessage(sessionId, userText);

    const responseText =
      result.victim_response ||
      "Thank you for sharing that. I'm here with you.";

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: responseText,
      time: currentTime,
    };

    if (isPrivate) {
      setPrivateMessages((prev) => [...prev, aiMsg]);
    } else if (targetConvId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                updatedAt: Date.now(),
                messages: [...c.messages, aiMsg],
              }
            : c
        )
      );
    } else {
      setAnonymousMessages((prev) => [...prev, aiMsg]);
    }

    // Preserve existing auto-read behavior for voice interactions
    if (
      isFromVoice &&
      userPreferences.autoReadVoice &&
      'speechSynthesis' in window
    ) {
      handleListenToAi(aiMsg.id, responseText);
    }
  } catch (error) {
    console.error('Backend conversation error:', error);

    const fallbackMsg: ChatMessage = {
      id: `ai-error-${Date.now()}`,
      sender: 'ai',
      text:
        "I'm having a temporary connection problem. Your message could not be processed right now. Please try again in a moment.",
      time: currentTime,
    };

    if (isPrivate) {
      setPrivateMessages((prev) => [...prev, fallbackMsg]);
    } else if (targetConvId) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === targetConvId
            ? {
                ...c,
                updatedAt: Date.now(),
                messages: [...c.messages, fallbackMsg],
              }
            : c
        )
      );
    } else {
      setAnonymousMessages((prev) => [...prev, fallbackMsg]);
    }
  }
};
  // Text-to-Speech audio playback for AI response
  const handleListenToAi = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = userPreferences.voiceSpeed === 'gentle' ? 0.9 : 1.0;
    utterance.pitch = 1.0;
    
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Final confirmation to start active session
  const handleAgreeAndBegin = () => {
    if (!hasConsented) return;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    if (sessionPreference === 'signedIn' && isAuthenticated) {
      const effectiveEmail = userProfile.email || userEmail || inlineEmail;
      setAccountConsent(effectiveEmail, CURRENT_CONSENT_VERSION);

      if (customPrompt.trim()) {
        const userPrompt = customPrompt.trim();
        const customTitle = generateTitleFromText(userPrompt);
        const initialConvId = `conv-${Date.now()}`;
        const initialConv: SavedConversation = {
          id: initialConvId,
          title: customTitle,
          isCustomTitle: false,
          isPinned: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          previewText: userPrompt.slice(0, 80),
          messages: [
            {
              id: `user-${Date.now()}`,
              sender: 'user',
              text: userPrompt,
              time: currentTime,
              inputType: 'text',
            },
          ],
        };
        setConversations([initialConv, ...conversations]);
        setActiveConversationId(initialConvId);
        setTimeout(() => {
          generateAiResponse(userPrompt, initialConvId, false, false);
        }, 900);
      } else {
        // Clean signed-in workspace (no old conversation auto-opened)
        setActiveConversationId(null);
      }
   } else {
  // Anonymous session
  if (customPrompt.trim()) {
    const userPrompt = customPrompt.trim();

    setAnonymousMessages([
      {
        id: 'welcome-initial',
        sender: 'ai',
        text: 'Welcome to Sukoon AI. I have received your opening thought and I am here to listen with full care.',
        time: currentTime,
      },
      {
        id: 'user-opening',
        sender: 'user',
        text: userPrompt,
        time: currentTime,
        inputType: 'text',
      },
    ]);

    setTimeout(() => {
      generateAiResponse(userPrompt, undefined, false, false);
    }, 900);
  } else {
        setAnonymousMessages([
          {
            id: 'welcome-initial',
            sender: 'ai',
            text: 'Welcome. You are in a confidential space. There is no rush or pressure to share more than you feel comfortable with. You can type or use your voice anytime. How are you feeling in this moment?',
            time: currentTime,
          },
        ]);
      }
    }

    setCurrentStep('active');
  };

  // =========================================================
  // STEP: ACTIVE SESSION (SIGNED-IN WORKSPACE vs ANONYMOUS)
  // =========================================================
  if (currentStep === 'active') {
    const isUserSignedIn = sessionPreference === 'signedIn' && isAuthenticated;

    return (
      <div className="fixed inset-0 z-50 bg-[#070314] text-white flex h-screen overflow-hidden animate-fade-in select-text">
        {/* Subtle background cosmic glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-purple-900/10 blur-[100px] rounded-full pointer-events-none" />

        {/* ========================================================= */}
        {/* SIGNED-IN LEFT SIDEBAR (Only for signed-in account users) */}
        {/* ========================================================= */}
        {isUserSignedIn && (
          <SignedInSidebar
            isOpen={!isSidebarCollapsed || isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isMobile={isMobile}
            conversations={conversations}
            activeConversationId={isPrivateSession ? '' : (activeConversationId ?? '')}
            onSelectConversation={(id) => {
              if (isPrivateSession) {
               setIsPrivateSession(false);
               setPrivateMessages([]);
            }

            setActiveConversationId(id);

          // Restore this conversation's own backend session.
         // If it has never sent a message before, it will create a new session later.
         setBackendSessionId(backendSessionIds[id] ?? null);
      }}
            onNewConversation={handleNewConversation}
            onRenameConversation={handleRenameConversation}
            onTogglePinConversation={handleTogglePinConversation}
            onDeleteConversation={handleDeleteConversation}
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenPreferences={() => setIsPreferencesOpen(true)}
            onOpenPrivacyData={() => setIsPrivacyDataOpen(true)}
            onOpenHelpSafety={() => setIsHelpSafetyOpen(true)}
            onSignOut={() => {
              if (onSignOut) onSignOut();
              setSessionPreference('anonymous');
              handleEndSession();
            }}
          />
        )}

        {/* ========================================================= */}
        {/* MAIN CHAT WORKSPACE (Full Viewport on the Right)          */}
        {/* ========================================================= */}
        <div className="flex-1 flex flex-col h-full min-w-0 relative z-10">
          
          {/* MAIN CHAT HEADER */}
          <header className="w-full border-b border-purple-500/20 bg-[#0b051b]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 z-20 shrink-0">
            <div className="flex items-center justify-between gap-4">
              
              {/* Left Identity & Controls */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Sidebar toggle button (if signed in) */}
                {isUserSignedIn && (
                  <button
                    type="button"
                    onClick={() => {
                      if (isMobile) {
                        setIsMobileSidebarOpen(true);
                      } else {
                        setIsSidebarCollapsed(!isSidebarCollapsed);
                      }
                    }}
                    className="p-1.5 rounded-lg text-purple-300/80 hover:text-white hover:bg-purple-900/50 border border-purple-500/20 transition-colors cursor-pointer shrink-0"
                    title={isSidebarCollapsed ? "Open sidebar" : "Collapse sidebar"}
                  >
                    {isMobile ? <Menu className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
                  </button>
                )}

                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm sm:text-base font-bold text-white tracking-wide shrink-0">Sukoon AI</span>
                    <span className="text-purple-400/60 hidden sm:inline">•</span>
                    <span className="text-xs sm:text-sm font-medium text-purple-200/90 hidden sm:inline truncate">
                      Confidential Safe Space
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    
                    {isUserSignedIn ? (
                      isPrivateSession ? (
                        <p className="text-[11px] text-purple-300/80">
                          Active Session
                        </p>
                      ) : activeConversation ? (
                        <div className="flex items-center gap-1.5 truncate text-[11px] text-purple-300/80">
                          <span className="font-semibold text-white truncate max-w-[200px] sm:max-w-[320px]">
                            {activeConversation.title}
                          </span>
                          <span className="text-purple-400/50 hidden md:inline">•</span>
                          <span className="text-purple-400/80 hidden md:inline">Saved Journey</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-purple-300/80">
                          Signed In Workspace
                        </p>
                      )
                    ) : (
                      <p className="text-[11px] text-purple-300/80">
                        Anonymous Session • No account history
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right persistent safety & session controls (Private Session, Crisis Support, End Session, Quick Exit) */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {isUserSignedIn && (
                  <button
                    type="button"
                    onClick={handleStartPrivateSession}
                    className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 font-medium shrink-0 ${
                      isPrivateSession
                        ? 'bg-purple-800/80 text-white border border-purple-400/60 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                        : 'text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900/70 border border-purple-500/30 hover:border-purple-400/40'
                    }`}
                    title="Start a new conversation that won't appear in your history"
                  >
                    <Lock className="w-3.5 h-3.5 text-purple-400" />
                    <span className="whitespace-nowrap">Private Session</span>
                  </button>
                )}
                {onOpenCrisisSupport && (
                  <button
                    type="button"
                    onClick={onOpenCrisisSupport}
                    className="text-xs px-3 sm:px-3.5 py-1.5 rounded-full text-purple-200 bg-purple-900/50 hover:bg-purple-800/70 border border-purple-500/30 hover:border-purple-400/50 transition-all cursor-pointer shadow-sm"
                  >
                    Crisis Support
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleEndSession}
                  className="text-xs px-3 sm:px-3.5 py-1.5 rounded-full text-purple-200 hover:text-white bg-purple-950/70 hover:bg-purple-900/80 border border-purple-500/30 transition-all cursor-pointer"
                >
                  End Session
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                    if (onQuickExit) {
                      onQuickExit();
                    } else {
                      window.location.replace('https://www.google.com');
                    }
                  }}
                  className="text-xs px-3 sm:px-3.5 py-1.5 rounded-full text-rose-300 hover:text-rose-100 bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 hover:border-rose-400/60 transition-all cursor-pointer font-medium shadow-sm"
                  title="Instant discreet exit to Google"
                >
                  Quick Exit
                </button>
              </div>
            </div>
          </header>

          {/* MAIN MESSAGE STREAM */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6 relative z-10 no-scrollbar">
            <div className={`max-w-4xl mx-auto w-full space-y-6 ${userPreferences.fontSize === 'relaxed' ? 'text-base' : 'text-sm'}`}>
              
              {/* Safe Space Badge Banner */}
              <div className="text-center py-1">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/20 text-purple-300 text-xs">
                  {isUserSignedIn ? (
                    isPrivateSession ? (
                      <>
                        <Lock className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-medium text-purple-200">Private Session</span>
                        <span className="text-purple-400/50">•</span>
                        <span>This conversation won’t appear in your history.</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span>Encrypted Safe Space • Conversation saved to your account</span>
                      </>
                    )
                  ) : (
                    <>
                      <Shield className="w-3.5 h-3.5 text-purple-400" />
                      <span>Encrypted Safe Space • Anonymous session with no history</span>
                    </>
                  )}
                </div>
              </div>

              {/* Calm Empty Workspace State or Message Bubbles */}
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[300px] text-center px-4 animate-fade-in my-auto py-12">
                  <div className="w-12 h-12 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4 shadow-sm">
                    <Sparkles className="w-6 h-6 text-purple-300/90" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                    {isPrivateSession ? 'Private Safe Space' : 'What’s on your mind today?'}
                  </h3>
                  <p className="text-xs sm:text-sm text-purple-300/70 max-w-md font-light leading-relaxed">
                    {isPrivateSession
                      ? 'Whenever you’re ready. You can type or speak to reflect in privacy—this conversation won’t appear in your saved history.'
                      : 'Whenever you’re ready. Type a thought or tap the microphone below to begin your reflection.'}
                  </p>
                </div>
              ) : (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    {msg.sender === 'ai' ? (
                      <div className="flex items-start gap-3.5 max-w-[92%] sm:max-w-[85%]">
                        <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 mt-1 shadow-sm">
                          <Sparkles className="w-4 h-4 text-purple-300" />
                        </div>
                        <div className="p-4 sm:p-5 rounded-3xl rounded-tl-sm bg-[#130924]/90 border border-purple-500/25 text-purple-100 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                          <p className={`leading-relaxed whitespace-pre-wrap text-purple-100/95 font-light ${userPreferences.fontSize === 'relaxed' ? 'text-base' : 'text-sm sm:text-base'}`}>
                            {msg.text}
                          </p>
                          <div className="flex items-center justify-between gap-4 mt-3 pt-2 border-t border-purple-500/15 text-xs text-purple-300/70">
                            <button
                              type="button"
                              onClick={() => handleListenToAi(msg.id, msg.text)}
                              className="flex items-center gap-1.5 text-purple-300/80 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded-md hover:bg-purple-900/40"
                              title="Listen to response"
                            >
                              {speakingMessageId === msg.id ? (
                                <>
                                  <VolumeX className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                                  <span className="text-[11px]">Stop audio</span>
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3.5 h-3.5 text-purple-300" />
                                  <span className="text-[11px]">Listen</span>
                                </>
                              )}
                            </button>
                            <span className="text-[11px] text-purple-400/60">{msg.time}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="max-w-[85%] sm:max-w-[80%] rounded-3xl rounded-tr-sm px-5 py-3.5 bg-gradient-to-r from-purple-700 to-purple-600 text-white shadow-[0_4px_20px_rgba(147,51,234,0.25)] ml-auto">
                        <p className={`leading-relaxed whitespace-pre-wrap ${userPreferences.fontSize === 'relaxed' ? 'text-base' : 'text-sm sm:text-base'}`}>
                          {msg.text}
                        </p>
                        <div className="flex items-center justify-between gap-4 mt-2 text-xs text-purple-200/70">
                          <div>
                            {msg.inputType === 'voice' && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-purple-800/60 px-2 py-0.5 rounded-full text-purple-200">
                                <Mic className="w-2.5 h-2.5 text-purple-300" />
                                Voice Input
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-purple-200/60">{msg.time}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Voice Processing Indicator */}
              {isProcessingVoice && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-center gap-3 p-4 rounded-2xl bg-purple-950/70 border border-purple-500/30 text-purple-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                    <span className="text-sm">Understanding your spoken voice...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </main>

          {/* PERSISTENT BOTTOM COMPOSER (TEXT + MIC) */}
          <footer className="w-full border-t border-purple-500/20 bg-[#0b051b]/95 backdrop-blur-lg px-4 sm:px-8 py-3.5 z-20 shrink-0">
            <div className="max-w-4xl mx-auto w-full">
              {isRecording ? (
                /* IN-CHAT VOICE RECORDING STATE */
                <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/90 border border-purple-400/50 shadow-[0_0_40px_rgba(168,85,247,0.35)] animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                      <span className="text-sm font-semibold text-white">Listening…</span>
                      <span className="text-xs font-mono text-purple-300 bg-purple-900/70 px-2.5 py-0.5 rounded-full border border-purple-500/40">
                        {String(Math.floor(recordingSeconds / 60)).padStart(2, '0')}:{String(recordingSeconds % 60).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* Animated Waveform */}
                  <div className="flex items-center justify-center gap-1.5 h-12 py-1 mb-3">
                    {[30, 65, 45, 90, 60, 85, 40, 95, 70, 85, 50, 75, 90, 40, 70, 55, 80, 45, 60, 85, 40].map((height, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-purple-400 transition-all duration-150 animate-pulse"
                        style={{
                          height: `${Math.max(18, (height * ((i % 4) + 1)) % 100)}%`,
                          animationDelay: `${i * 55}ms`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Recording Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={handleCancelVoiceRecording}
                      className="text-xs sm:text-sm text-purple-300/80 hover:text-white px-4 py-2 rounded-xl hover:bg-purple-900/40 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>

                    <button
                      type="button"
                      onClick={handleStopVoiceRecording}
                      className="btn-violet-glow px-5 py-2 rounded-full text-xs sm:text-sm font-semibold text-white flex items-center gap-2 cursor-pointer shadow-lg"
                    >
                      <StopCircle className="w-4 h-4" />
                      <span>Done Speaking</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* STANDARD TEXT + MIC COMPOSER */
                <div className="flex items-end gap-2 sm:gap-3 bg-purple-950/40 border border-purple-500/25 focus-within:border-purple-400/70 focus-within:ring-1 focus-within:ring-purple-400/40 p-2 sm:p-2.5 rounded-2xl transition-all shadow-lg">
                  <textarea
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => {
                      setInputMessage(e.target.value);
                      e.target.style.height = 'auto';
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendTextMessage();
                      }
                    }}
                    placeholder="Share what’s on your mind… (Type or press mic to speak)"
                    className="flex-1 bg-transparent text-white placeholder-purple-300/40 text-sm sm:text-base px-3 py-2 focus:outline-none resize-none max-h-36 overflow-y-auto leading-relaxed"
                  />

                  {/* Direct Microphone Button beside Composer */}
                  <button
                    type="button"
                    onClick={handleStartVoiceRecording}
                    className="p-3 rounded-xl bg-purple-900/50 hover:bg-purple-800/70 border border-purple-500/30 text-purple-300 hover:text-white transition-all cursor-pointer shadow-sm group shrink-0"
                    title="Tap to speak with voice"
                  >
                    <Mic className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>

                  {/* Send Button */}
                  <button
                    type="button"
                    onClick={handleSendTextMessage}
                    disabled={!inputMessage.trim()}
                    className="p-3 rounded-xl btn-violet-glow text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-md shrink-0"
                    title="Send message"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-purple-300/50">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>Tap mic to speak anytime • Confidential</span>
              </div>
            </div>
          </footer>
        </div>

        {/* ========================================================= */}
        {/* SIGNED-IN ACCOUNT MODALS (Profile, Preferences, etc.)     */}
        {/* ========================================================= */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          profile={userProfile}
          onUpdateDisplayName={(newName) =>
            setUserProfile((prev) => ({ ...prev, displayName: newName }))
          }
        />

        <PreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          preferences={userPreferences}
          onUpdatePreferences={(updated) =>
            setUserPreferences((prev) => ({ ...prev, ...updated }))
          }
        />

        <PrivacyDataModal
          isOpen={isPrivacyDataOpen}
          onClose={() => setIsPrivacyDataOpen(false)}
          savedConversationsCount={conversations.length}
          onClearAllHistory={handleClearAllHistory}
          onDeleteAccount={handleDeleteAccount}
        />

        <HelpSafetyModal
          isOpen={isHelpSafetyOpen}
          onClose={() => setIsHelpSafetyOpen(false)}
          onOpenCrisisSupport={onOpenCrisisSupport}
        />
      </div>
    );
  }

  // =========================================================
  // PRE-SESSION ONBOARDING FLOW (Setup -> Grounding -> Preference -> Consent)
  // =========================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div 
        className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 md:p-9 border border-purple-500/30 shadow-[0_0_80px_rgba(147,51,234,0.4)] max-h-[92vh] overflow-y-auto no-scrollbar flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleEndSession}
          className="absolute top-5 right-5 p-2 rounded-full text-purple-300 hover:text-white bg-purple-950/50 hover:bg-purple-900/60 border border-purple-500/20 transition-all cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: CONVERSATION SETUP */}
        {currentStep === 'setup' && (
          <div className="py-1 text-left animate-fade-in">
            <div className="mb-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-medium mb-3">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span>Confidential Safe Space</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Whenever you’re ready
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                You can type or use your voice anytime during the conversation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/25 my-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-900/60 text-purple-300 shrink-0">
                  <Sparkles className="w-5 h-5 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    One unified, pressure-free safe space
                  </h3>
                  <p className="text-xs text-purple-200/75 mt-0.5 leading-relaxed">
                    Type silently or tap the microphone to speak at your own pace. You can switch between typing and voice whenever you wish.
                  </p>
                </div>
              </div>
            </div>

            {/* Grounding Exercise link */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-purple-900/40 text-purple-300 mt-0.5 sm:mt-0 shrink-0">
                  <HeartHandshake className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    Need a moment first?
                  </h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/70 mt-0.5">
                    Take a moment with a short calming exercise before you begin.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFromGrounding(true);
                  setCurrentStep('grounding');
                }}
                className="self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium text-purple-200 bg-purple-900/40 hover:bg-purple-800/50 border border-purple-400/30 hover:border-purple-300/50 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-purple-300" />
                <span>Start Grounding Exercise</span>
              </button>
            </div>

            {/* Optional message input */}
            <div className="mt-4 mb-5">
              <label htmlFor="opening-thought" className="block text-xs font-semibold text-purple-200/90 mb-1">
                Optional: What’s on your mind?
              </label>
              <p className="text-[11px] text-purple-300/60 mb-2">
                You can leave this blank and begin whenever you’re ready.
              </p>
              <input
                id="opening-thought"
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. I just need a calm space to process what happened…"
                className="w-full px-4 py-3 rounded-xl bg-purple-950/40 border border-purple-500/25 text-white placeholder-purple-300/40 text-xs sm:text-sm focus:outline-none focus:border-purple-400/60 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-purple-500/15">
              <span className="text-[11px] sm:text-xs text-purple-300/60 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                Empathetic AI Companion
              </span>

              <button
                onClick={() => setCurrentStep('preference')}
                className="btn-violet-glow px-7 py-2.5 sm:py-3 rounded-full text-white font-semibold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP: OPTIONAL GROUNDING EXERCISE */}
        {currentStep === 'grounding' && (
          <div className="py-2 text-center animate-fade-in">
            <div className="flex items-center justify-start mb-4">
              <button
                onClick={() => setCurrentStep('setup')}
                className="inline-flex items-center gap-1 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Conversation Setup</span>
              </button>
            </div>

            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-600/30 border border-purple-400/40 flex items-center justify-center animate-pulse shadow-[0_0_25px_rgba(192,132,252,0.5)]">
              <HeartHandshake className="w-7 h-7 text-purple-300" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
              Calm Grounding Exercise
            </h3>
            <p className="text-xs sm:text-sm text-purple-200/80 max-w-md mx-auto mb-5 leading-relaxed">
              Take a slow, gentle breath in through your nose... and let it softly release. There is no rush.
            </p>

            <div className="p-4 sm:p-5 rounded-2xl bg-purple-950/50 border border-purple-500/25 text-left mb-6 space-y-2 text-xs text-purple-200/90">
              <p className="font-semibold text-purple-300">5-4-3-2-1 Grounding Anchor:</p>
              <ul className="list-disc list-inside space-y-1 text-purple-200/80 text-[11px] sm:text-xs">
                <li>Notice 5 things you can see around you</li>
                <li>Notice 4 things you can physically feel</li>
                <li>Notice 3 sounds in your environment</li>
                <li>Notice 2 scents or deep breaths</li>
                <li>Notice 1 positive intention for yourself right now</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setCurrentStep('setup')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs sm:text-sm font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-500/20 transition-all cursor-pointer"
              >
                Return to Setup
              </button>
              <button
                onClick={() => setCurrentStep('preference')}
                className="w-full sm:w-auto btn-violet-glow px-6 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Ready to Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SESSION PREFERENCE (ANONYMOUS VS SIGNED-IN) */}
        {currentStep === 'preference' && (
          <div className="py-1 text-left animate-fade-in">
            <div className="flex items-center justify-between mb-3.5">
              <button
                onClick={() => setCurrentStep(fromGrounding ? 'grounding' : 'setup')}
                className="inline-flex items-center gap-1 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <span className="text-xs text-purple-400 font-medium">Step 2 • Session Preference</span>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                How would you like to continue?
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                Choose the level of privacy and continuity that feels right for you.
              </p>
            </div>

            <div className="space-y-3.5 my-4">
              {/* Option A: Continue Anonymously */}
              <button
                type="button"
                onClick={() => {
                  setSessionPreference('anonymous');
                  setShowAuthForm(false);
                }}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border flex items-start gap-3.5 cursor-pointer ${
                  sessionPreference === 'anonymous'
                    ? 'bg-purple-900/45 border-purple-400/70 shadow-[0_0_24px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/40'
                    : 'bg-purple-950/20 border-purple-500/15 hover:bg-purple-900/20 hover:border-purple-500/30'
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-colors ${sessionPreference === 'anonymous' ? 'bg-purple-600 text-white' : 'bg-purple-950/60 text-purple-300'}`}>
                  <Shield className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-white">Continue Anonymously</h3>
                    {sessionPreference === 'anonymous' && (
                      <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-purple-200/75 mt-1 leading-relaxed">
                    No sign-in required. Start without providing your name, phone number, or email.
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-purple-500/15 grid grid-cols-1 gap-1 text-[11px] text-purple-200/70">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>No account required</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      <span>No conversation history saved to an account</span>
                    </div>
                  </div>
                </div>
              </button>

              {/* Option B: Sign In & Save Progress */}
              <div
                onClick={() => setSessionPreference('signedIn')}
                className={`w-full p-4 rounded-2xl text-left transition-all duration-300 border flex flex-col gap-3 cursor-pointer ${
                  sessionPreference === 'signedIn'
                    ? 'bg-purple-900/45 border-purple-400/70 shadow-[0_0_24px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/40'
                    : 'bg-purple-950/20 border-purple-500/15 hover:bg-purple-900/20 hover:border-purple-500/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl transition-colors ${sessionPreference === 'signedIn' ? 'bg-purple-600 text-white' : 'bg-purple-950/60 text-purple-300'}`}>
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-white">Sign In & Save Progress</h3>
                      {sessionPreference === 'signedIn' && (
                        <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-white">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-purple-200/75 mt-1 leading-relaxed">
                      Use your Sukoon AI account to access conversational workspace, saved history, and continuity across sessions.
                    </p>
                  </div>
                </div>

                {/* Account Status / Inline Auth Form */}
                {isAuthenticated ? (
                  <div className="mt-1 p-2.5 rounded-xl bg-purple-950/60 border border-emerald-500/30 flex items-center justify-between text-xs text-purple-200">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>
                        Signed in as <strong className="text-white">{userProfile.displayName || userEmail || inlineEmail}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-medium px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                      Active Account
                    </span>
                  </div>
                ) : (
                  <div className="mt-1">
                    {!showAuthForm ? (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessionPreference('signedIn');
                              setInlineAuthMode('signin');
                              setShowAuthForm(true);
                              setInlineAuthError(null);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
                          >
                            Sign In
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSessionPreference('signedIn');
                              setInlineAuthMode('signup');
                              setShowAuthForm(true);
                              setInlineAuthError(null);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 transition-colors cursor-pointer"
                          >
                            Create Account
                          </button>
                          <span className="text-[11px] text-purple-300/60 ml-auto">
                            Required for Saved Progress
                          </span>
                        </div>
                        {sessionPreference === 'signedIn' && (
                          <p className="text-[11px] text-amber-300/90 font-medium">
                            Please sign in or create an account to enable saved progress, or choose Continue Anonymously above.
                          </p>
                        )}
                      </div>
                    ) : (
                      <form
                        onSubmit={handleInlineAuthSubmit}
                        onClick={(e) => e.stopPropagation()}
                        className="p-3 rounded-xl bg-purple-950/70 border border-purple-500/30 space-y-2.5 animate-fade-in"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">
                            {inlineAuthMode === 'signin' ? 'Sign In to Account' : 'Create Sukoon Account'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setInlineAuthMode(inlineAuthMode === 'signin' ? 'signup' : 'signin');
                              setInlineAuthError(null);
                            }}
                            className="text-[11px] text-purple-300 hover:text-white underline cursor-pointer"
                          >
                            {inlineAuthMode === 'signin' ? 'Need to create account?' : 'Already have account?'}
                          </button>
                        </div>

                        {inlineAuthError && (
                          <div className="text-[11px] text-rose-300 bg-rose-950/60 border border-rose-500/30 px-2.5 py-1.5 rounded-lg animate-fade-in">
                            {inlineAuthError}
                          </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input
                            type="email"
                            value={inlineEmail}
                            onChange={(e) => {
                              setInlineEmail(e.target.value);
                              if (inlineAuthError) setInlineAuthError(null);
                            }}
                            placeholder="Email (e.g. you@domain.com)"
                            className="w-full px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/25 text-white placeholder-purple-300/30 text-xs focus:outline-none focus:border-purple-400"
                          />
                          <input
                            type="password"
                            value={inlinePassword}
                            onChange={(e) => {
                              setInlinePassword(e.target.value);
                              if (inlineAuthError) setInlineAuthError(null);
                            }}
                            placeholder="Password"
                            className="w-full px-3 py-1.5 rounded-lg bg-purple-900/40 border border-purple-500/25 text-white placeholder-purple-300/30 text-xs focus:outline-none focus:border-purple-400"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setShowAuthForm(false);
                              setInlineAuthError(null);
                            }}
                            className="text-[11px] text-purple-300/70 hover:text-white cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="btn-violet-glow px-4 py-1.5 rounded-lg text-xs font-semibold text-white cursor-pointer"
                          >
                            {inlineAuthMode === 'signin' ? 'Sign In & Save' : 'Create & Save'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-purple-500/15">
              <button
                type="button"
                onClick={() => setCurrentStep(fromGrounding ? 'grounding' : 'setup')}
                className="text-xs text-purple-300/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (sessionPreference === 'anonymous' || (sessionPreference === 'signedIn' && isAuthenticated)) {
                    setCurrentStep('consent');
                  }
                }}
                disabled={sessionPreference === 'signedIn' && !isAuthenticated}
                className={`px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  sessionPreference === 'anonymous' || (sessionPreference === 'signedIn' && isAuthenticated)
                    ? 'btn-violet-glow text-white cursor-pointer shadow-lg'
                    : 'bg-purple-950/40 text-purple-300/40 border border-purple-500/15 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Continue to Privacy & Consent</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & CONSENT */}
        {currentStep === 'consent' && (
          <div className="py-1 text-left animate-fade-in">
            <div className="flex items-center justify-between mb-3.5">
              <button
                onClick={() => setCurrentStep('preference')}
                className="inline-flex items-center gap-1 text-xs text-purple-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Session Preference</span>
              </button>
              <span className="text-xs text-purple-400 font-medium">Step 3 • Privacy & Consent</span>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Before we begin
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-purple-200/80 leading-relaxed">
                Your privacy and choice matter. Please review how Sukoon AI supports you.
              </p>
              
              <div className="mt-2.5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/25 text-xs text-purple-200">
                <span className="text-purple-400">Session Type:</span>
                <span className="font-semibold text-white">
                  {sessionPreference === 'signedIn' && isAuthenticated ? 'Private Account Session' : 'Anonymous Session'}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 my-4">
              {sessionPreference === 'signedIn' && isAuthenticated ? (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-900/50 text-emerald-300 shrink-0 mt-0.5">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      Private Account Session
                    </h4>
                    <p className="text-[11px] sm:text-xs text-purple-200/75 mt-0.5 leading-relaxed">
                      Your session is associated with your Sukoon AI account ({userProfile.displayName}) so you can revisit saved conversations and maintain continuity across sessions.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-900/50 text-purple-300 shrink-0 mt-0.5">
                    <Shield className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-white">
                      Private & Anonymous
                    </h4>
                    <p className="text-[11px] sm:text-xs text-purple-200/75 mt-0.5 leading-relaxed">
                      You can continue without providing your name, phone number, or email. Conversation history is not attached to a user account.
                    </p>
                  </div>
                </div>
              )}

              <div className="p-3 sm:p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-900/50 text-purple-300 shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    AI-assisted assessment
                  </h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/75 mt-0.5 leading-relaxed">
                    Sukoon AI may analyze what you share to identify possible signs of distress, fear, trauma, or immediate risk.
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-900/50 text-purple-300 shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    Safety support
                  </h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/75 mt-0.5 leading-relaxed">
                    If serious or immediate risk is detected, Sukoon AI may recommend appropriate human or emergency support.
                  </p>
                </div>
              </div>

              <div className="p-3 sm:p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-900/50 text-purple-300 shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-white">
                    Not a replacement for professional care
                  </h4>
                  <p className="text-[11px] sm:text-xs text-purple-200/75 mt-0.5 leading-relaxed">
                    Sukoon AI provides supportive guidance. It is not a doctor, therapist, emergency service, or substitute for professional help.
                  </p>
                </div>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="mt-4 mb-5 pt-3 border-t border-purple-500/20">
              <label 
                htmlFor="consent-checkbox"
                className="flex items-start gap-3 cursor-pointer group select-none"
              >
                <div className="relative flex items-center justify-center mt-0.5">
                  <input
                    id="consent-checkbox"
                    type="checkbox"
                    checked={hasConsented}
                    onChange={(e) => setHasConsented(e.target.checked)}
                    className="peer appearance-none w-5 h-5 rounded-md bg-purple-950/60 border border-purple-400/40 checked:bg-purple-600 checked:border-purple-300 focus:outline-none transition-all cursor-pointer"
                  />
                  <CheckCircle className="w-3.5 h-3.5 text-white absolute pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-medium text-white group-hover:text-purple-100 transition-colors">
                    I understand how AI-assisted assessment is used and consent to continue.
                  </p>
                  <p className="text-[11px] text-purple-300/60 mt-0.5">
                    You can end the conversation at any time.
                  </p>
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setCurrentStep('preference')}
                className="text-xs text-purple-300/80 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleAgreeAndBegin}
                disabled={!hasConsented}
                className={`px-6 sm:px-7 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  hasConsented
                    ? 'btn-violet-glow text-white cursor-pointer shadow-lg'
                    : 'bg-purple-950/40 text-purple-300/40 border border-purple-500/15 cursor-not-allowed opacity-50'
                }`}
              >
                <span>Agree & Begin Session →</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

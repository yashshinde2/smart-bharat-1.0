"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { geminiAPI } from "@/app/utils/gemini";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ? (Hello! How can I help you today?)",
      isUser: false,
    },
  ]);
  const [voiceOutput, setVoiceOutput] = useState(true);
  const [showHttpsWarning, setShowHttpsWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  const apiUrl = process.env.NEXT_PUBLIC_GEMINI_API_URL;

  const isSecureContext =
    typeof window !== "undefined" &&
    (window.location.protocol === "http:" ||
      window.location.hostname === "localhost");

  const requestMicrophonePermission = async () => {
    if (typeof window === "undefined") return;

    if (!isSecureContext) {
      setShowHttpsWarning(true);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "माइक्रोफ़ोन एक्सेस के लिए HTTPS की आवश्यकता है। (HTTPS is required for microphone access.)",
          isUser: false,
        },
      ]);
      return;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("MediaDevices API not supported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      console.log("Microphone access granted.");
    } catch (err: any) {
      console.error("Microphone access error:", err);
      let errorMessage =
        "माइक्रोफ़ोन एक्सेस की अनुमति नहीं मिली। कृपया अपने ब्राउज़र सेटिंग्स में जाकर माइक्रोफ़ोन की अनुमति दें।";

      if (err.message === "MediaDevices API not supported") {
        errorMessage =
          "आपका ब्राउज़र माइक्रोफ़ोन का समर्थन नहीं करता है। कृपया Chrome का उपयोग करें।";
      } else if (err.name === "NotAllowedError") {
        errorMessage =
          "माइक्रोफ़ोन एक्सेस की अनुमति नहीं मिली। कृपया अपने ब्राउज़र सेटिंग्स में जाकर माइक्रोफ़ोन की अनुमति दें।";
      } else if (err.name === "NotFoundError") {
        errorMessage = "कोई माइक्रोफ़ोन नहीं मिला। कृपया एक माइक्रोफ़ोन कनेक्ट करें।";
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: errorMessage, isUser: false },
      ]);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!isSecureContext) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "वॉइस रिकग्निशन के लिए HTTPS की आवश्यकता है। (HTTPS is required for voice recognition.)",
          isUser: false,
        },
      ]);
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const isChrome =
        /Chrome/.test(navigator.userAgent) &&
        /Google Inc/.test(navigator.vendor);
      const errorMessage = isChrome
        ? "Chrome ब्राउज़र में वॉइस रिकग्निशन उपलब्ध नहीं है। कृपया Chrome को अपडेट करें।"
        : "आपका ब्राउज़र वॉइस रिकग्निशन का समर्थन नहीं करता है। कृपया Google Chrome का उपयोग करें।";

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: errorMessage, isUser: false },
      ]);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error:", event.error);
      let errorMessage = "कृपया पुनः प्रयास करें।";

      if (event.error === "not-allowed") {
        errorMessage =
          "माइक्रोफ़ोन एक्सेस की अनुमति नहीं मिली। कृपया अपने ब्राउज़र सेटिंग्स में जाकर माइक्रोफ़ोन की अनुमति दें।";
        requestMicrophonePermission();
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: errorMessage, isUser: false },
      ]);
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    requestMicrophonePermission();

    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (voiceOutput && messages.length > 0) {
      const last = messages[messages.length - 1];
      if (!last.isUser) {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(last.text);
        utterance.lang = "hi-IN";
        speechSynthesis.speak(utterance);
      }
    }
  }, [messages, voiceOutput]);

  const callGenerativeAI = async (text: string) => {
    try {
      console.log("Calling Gemini API with text:", text);
      
      const result = await geminiAPI.generateContent(text);
      
      if (result.error) {
        console.error("Gemini API error:", result.error);
        throw new Error(result.error);
      }
      
      if (!result.response) {
        throw new Error("No response generated");
      }
      
      console.log("Gemini API response:", result.response);
      return result.response;
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      throw error;
    }
  };

  const handleSpeechResult = async (event: SpeechRecognitionEvent) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    console.log("Transcript:", transcript);

    if (event.results[event.results.length - 1].isFinal) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), text: transcript, isUser: true },
      ]);

      const loadingId = `loading-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        { id: loadingId, text: "सोच रहा हूँ...", isUser: false },
      ]);

      try {
        const aiReply = await callGenerativeAI(transcript);
        
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== loadingId)
            .concat({ id: Date.now().toString(), text: aiReply, isUser: false })
        );
      } catch (err) {
        console.error("AI API Error:", err);
        setMessages((prev) =>
          prev
            .filter((msg) => msg.id !== loadingId)
            .concat({
              id: Date.now().toString(),
              text: "कुछ गलत हो गया। कृपया पुनः प्रयास करें।",
              isUser: false,
            })
        );
      } finally {
        setIsListening(false);
      }
    }
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      alert("Speech recognition उपलब्ध नहीं है। कृपया Google Chrome का उपयोग करें।");
      return;
    }

    if (!isListening) {
      setIsListening(true);
      try {
        recognition.start();
        recognition.onresult = handleSpeechResult;
      } catch (error) {
        console.error("Speech start error:", error);
        alert("Speech recognition शुरू करने में त्रुटि हुई। कृपया पुनः प्रयास करें।");
        setIsListening(false);
      }
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const toggleVoiceOutput = () => setVoiceOutput(!voiceOutput);

  return (
    <div className="flex flex-col h-full">
      {showHttpsWarning && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>HTTPS Required</AlertTitle>
          <AlertDescription>
            Voice recognition requires a secure connection (HTTPS). Please run
            the application with HTTPS enabled.
            <div className="mt-2 text-sm">
              <a href="/HTTPS_SETUP.md" className="underline">
                View setup instructions
              </a>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 max-w-[80%] rounded-2xl ${
                message.isUser
                  ? "bg-brand-orange text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm sm:text-base">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {isListening && (
        <div className="flex justify-center mb-6">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-brand-orange rounded-full wave"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col items-center space-y-4">
        <Button
          onClick={toggleVoiceOutput}
          variant="outline"
          size="sm"
          className="rounded-full"
        >
          {voiceOutput ? (
            <Volume2 className="h-4 w-4 text-brand-green" />
          ) : (
            <VolumeX className="h-4 w-4 text-gray-400" />
          )}
          <span className="ml-2 text-sm">
            {voiceOutput ? "Voice Output On" : "Voice Output Off"}
          </span>
        </Button>

        <Button
          onClick={toggleListening}
          className={`rounded-full w-20 h-20 ${
            isListening
              ? "bg-red-500 hover:bg-red-600"
              : "bg-brand-orange hover:bg-brand-orange/90"
          } flex items-center justify-center`}
          disabled={false}
        >
          {isListening ? (
            <MicOff className="h-10 w-10" />
          ) : (
            <Mic className="h-10 w-10" />
          )}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          {isListening ? "Tap to Stop" : "Tap to Speak"}
        </p>
      </div>
    </div>
  );
}

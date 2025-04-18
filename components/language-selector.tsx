"use client"

import { useEffect, useState } from "react"
import { Check, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Define types for DeepSeek API
interface TranslationResponse {
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
}

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी (Hindi)" },
  { code: "bn", name: "বাংলা (Bengali)" },
  { code: "mr", name: "मराठी (Marathi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "te", name: "తెలుగు (Telugu)" },
]

export function LanguageSelector() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0])
  const [isTranslating, setIsTranslating] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)

  // Function to translate text using DeepSeek API
  const translateText = async (text: string, targetLang: string) => {
    try {
      console.log(`Translating text to ${targetLang}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLanguage: targetLang,
        }),
      });

      // Parse the response body once
      const data = await response.json();
      console.log(`Translation API response status: ${response.status}`, data);

      if (!response.ok) {
        // Handle empty error objects
        if (Object.keys(data).length === 0) {
          console.error("Empty error response from translation API");
          throw new Error(`Translation failed with status ${response.status}`);
        }
        
        throw new Error(data.error || `Translation failed with status ${response.status}`);
      }

      // Check if the response has the expected structure
      if (!data.translatedText) {
        console.error("Invalid translation response format:", data);
        throw new Error("Invalid translation response format");
      }

      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      setTranslationError(error instanceof Error ? error.message : 'Translation failed');
      return text; // Return original text if translation fails
    }
  };

  // Function to translate the entire page
  const translatePage = async (targetLang: string) => {
    setIsTranslating(true);
    setTranslationError(null);
    
    try {
      // Get all text nodes in the document
      const textNodes = document.evaluate(
        "//text()[not(ancestor::script) and not(ancestor::style) and not(ancestor::textarea) and not(ancestor::input)]",
        document.body,
        null,
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
      );
      
      // Translate each text node
      let translatedCount = 0;
      const totalNodes = textNodes.snapshotLength;
      
      console.log(`Found ${totalNodes} text nodes to translate`);
      
      for (let i = 0; i < totalNodes; i++) {
        const node = textNodes.snapshotItem(i);
        if (node && node.nodeValue && node.nodeValue.trim()) {
          const originalText = node.nodeValue.trim();
          
          // Skip very short texts or numbers
          if (originalText.length < 2 || /^\d+$/.test(originalText)) {
            continue;
          }
          
          const translatedText = await translateText(originalText, targetLang);
          
          // Only update if translation was successful
          if (translatedText && translatedText !== originalText) {
            node.nodeValue = translatedText;
            translatedCount++;
          }
        }
      }
      
      console.log(`Translated ${translatedCount} of ${totalNodes} text nodes`);
      
      // Store the selected language in localStorage
      localStorage.setItem('selectedLanguage', targetLang);
      
    } catch (error) {
      console.error('Page translation error:', error);
      setTranslationError('Failed to translate the page');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLanguageSelect = async (language: typeof languages[0]) => {
    if (isTranslating) return;
    
    setSelectedLanguage(language);
    await translatePage(language.code);
  };

  // Initialize language from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setSelectedLanguage(language);
        translatePage(savedLanguage);
      }
    }
  }, []);

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={isTranslating}
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">
              {isTranslating ? "Translating..." : selectedLanguage.name}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {languages.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              className="flex items-center justify-between"
              disabled={isTranslating}
            >
              {language.name}
              {selectedLanguage.code === language.code && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {translationError && (
        <div className="absolute top-10 right-0 bg-red-100 text-red-800 p-2 rounded text-xs max-w-xs">
          {translationError}
        </div>
      )}
    </div>
  )
}


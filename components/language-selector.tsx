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
      
      if (!response.ok) {
        throw new Error(data.error || 'Translation failed');
      }
      
      return data as TranslationResponse;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }

  // Function to translate the entire page
  const translatePage = async (targetLang: string) => {
    try {
      setIsTranslating(true);
      setTranslationError(null);
      
      // Get all text nodes from the page
      const textNodes = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, div, li, button, a, label, input[placeholder], textarea[placeholder]'))
        .filter(node => {
          // Filter out nodes that are hidden or empty
          const style = window.getComputedStyle(node);
          return style.display !== 'none' && 
                 style.visibility !== 'hidden' && 
                 node.textContent?.trim() !== '';
        })
        .map(node => ({
          node,
          text: node.textContent?.trim() || ''
        }))
        .filter(item => item.text.length > 0);
      
      console.log(`Found ${textNodes.length} text nodes to translate`);
      
      // Translate each text node
      for (const item of textNodes) {
        try {
          const result = await translateText(item.text, targetLang);
          if (result && result.translatedText) {
            item.node.textContent = result.translatedText;
          }
        } catch (error) {
          console.error(`Failed to translate node: "${item.text.substring(0, 50)}${item.text.length > 50 ? '...' : ''}"`, error);
        }
      }
      
      console.log('Page translation completed');
    } catch (error) {
      console.error('Page translation error:', error);
      setTranslationError('Failed to translate the page. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  }

  // Handle language selection
  const handleLanguageSelect = async (language: typeof languages[0]) => {
    if (language.code === selectedLanguage.code) return;
    
    setSelectedLanguage(language);
    await translatePage(language.code);
  }

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


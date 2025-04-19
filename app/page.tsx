'use client'
import MainLayout from "@/components/main-layout"
import VoiceAssistant from "@/components/voice-assistant"
import { useState, useEffect } from "react"
import { geminiAPI } from "./utils/gemini"

// Define types for better type safety
interface RequestBody {
  query: string;
}

interface ApiResponse {
  choices?: Array<{
    message: {
      content: string;
    };
  }>;
  error?: {
    message: string;
  };
}

const fetchHandler = async (requestData: RequestBody) => {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY?.trim()
  
  if (!apiKey) {
    console.error('Gemini API key missing or empty');
    return { 
      error: 'Gemini API key is not configured. Please check your environment variables.' 
    }
  }

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: requestData.query
          }]
        }]
      })
    });

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { error: 'Invalid Gemini API key. Please check your API key configuration.' }
      }
      return { 
        error: data.error?.message || `Request failed with status ${response.status}`
      }
    }

    // Extract the response text from Gemini's response format
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!generatedText) {
      return { error: 'No response generated' }
    }

    return { response: generatedText }

  } catch (error) {
    return { 
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isApiKeyConfigured, setIsApiKeyConfigured] = useState(false)

  // Check API key on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      const isValid = await geminiAPI.validateApiKey()
      setIsApiKeyConfigured(isValid)
      
      if (!isValid) {
        setError('Gemini API key is not configured or is invalid.')
      }
    }
    
    checkApiKey()
  }, [])

  const handleSearch = async () => {
    if (!isApiKeyConfigured) {
      setError('Please configure the Gemini API key before making requests')
      return
    }

    if (!searchQuery.trim()) {
      setError('Please enter a message')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setResponse('')
      
      const result = await geminiAPI.generateContent(searchQuery)

      if (result.error) {
        setError(result.error)
        return
      }

      if (result.response) {
        setResponse(result.response)
        setSearchQuery('') // Clear input after successful response
      } else {
        setError('Invalid response format from API')
      }

    } catch (error) {
      console.error('Search error:', error)
      setError('Failed to process your request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="py-6 max-w-lg mx-auto pb-28 px-4">
        <h2 className="text-xl font-bold mb-6 text-center">आपका स्वागत है! (Welcome!)</h2>

        <VoiceAssistant />

        {/* API Key Warning */}
        {!isApiKeyConfigured && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
            ⚠️ Gemini API key is not configured. Please set up your NEXT_PUBLIC_GEMINI_API_KEY in .env.local file.
          </div>
        )}

        {/* Search Bar */}
        <div className="mt-8 w-full">
          <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-md border border-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setError('') // Clear error when user starts typing
              }}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              disabled={!isApiKeyConfigured}
            />
            <button 
              onClick={handleSearch}
              disabled={isLoading || !searchQuery.trim() || !isApiKeyConfigured}
              className="bg-[#ff7900] text-white text-sm px-4 py-1.5 rounded-full hover:bg-[#e66f00] transition disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Send'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Response Display */}
        {response && (
          <div className="mt-6">
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-gray-800">
                  {response}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
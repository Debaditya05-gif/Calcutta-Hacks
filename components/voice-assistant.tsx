"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, X, MessageSquare, Volume2, VolumeX, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Add type definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface Message {
  role: 'user' | 'model'
  text: string
}

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const recognitionRef = useRef<any>(null)
  const synthesisRef = useRef<SpeechSynthesis | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = true
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onstart = () => {
          setIsListening(true)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
          // If we have a final transcript, process it
          // Note: handled in onresult usually, but this is a backup state cleanup
        }

        recognitionRef.current.onresult = (event: any) => {
          const currentTranscript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('')
          
          setTranscript(currentTranscript)

          if (event.results[0].isFinal) {
            handleSendMessage(currentTranscript)
          }
        }
      }

      synthesisRef.current = window.speechSynthesis
    }
    
    // Cleanup
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.abort()
        }
        if (synthesisRef.current) {
            synthesisRef.current.cancel()
        }
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      setTranscript('')
      recognitionRef.current?.start()
    }
  }

  const speak = (text: string) => {
    if (!synthesisRef.current || isMuted) return

    // Cancel any current speech
    synthesisRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    
    synthesisRef.current.speak(utterance)
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = { role: 'user', text }
    setMessages(prev => [...prev, userMessage])
    setTranscript('')
    setIsLoading(true)

    try {
      // Prepare history for API
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          history: history
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        const errorMessage = errorData.error || `Server error: ${response.status}`
        
        // Update the chat with the specific error
        setMessages(prev => [...prev, { role: 'model', text: `Error: ${errorMessage}` }])
        speak("Sorry, there was an error connecting to the service.")
        throw new Error(errorMessage)
      }

      const data = await response.json()
      
      if (data.success && data.reply) {
        const modelMessage: Message = { role: 'model', text: data.reply }
        setMessages(prev => [...prev, modelMessage])
        speak(data.reply)
      } else {
          throw new Error('Invalid response format')
      }

    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message to chat
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error processing your request." }])
      speak("Sorry, I encountered an error.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0 bg-primary hover:bg-primary/90"
      >
        <Mic className="h-6 w-6 text-primary-foreground" />
      </Button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-background border border-border rounded-xl shadow-2xl z-50 flex flex-col max-h-[600px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Kolkata Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by Gemini</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
                setIsMuted(!isMuted)
                if (!isMuted) synthesisRef.current?.cancel()
            }}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>Hi! I'm your AI assistant.</p>
            <p className="text-sm mt-2">Ask me about Kolkata's heritage, food, or help planning your trip.</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex w-full",
              msg.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-foreground"
              )}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-background">
        {transcript && (
            <div className="mb-2 text-xs text-muted-foreground truncate px-2">
                Listening: "{transcript}"
            </div>
        )}
        
        <div className="flex items-center gap-2">
            <Button
                variant={isListening ? "destructive" : "default"}
                size="icon"
                className={cn("h-10 w-10 shrink-0", isListening && "animate-pulse")}
                onClick={toggleListening}
            >
                {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <form 
                className="flex-1 flex gap-2"
                onSubmit={(e) => {
                    e.preventDefault()
                    // Handle manual text input if we add an input field later
                    // For now, this just handles the 'Enter' key if we had an input
                }}
            >
                {/* 
                  Optional: Add text input for fallback
                  <Input 
                    placeholder="Type a message..." 
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                  />
                */}
            </form>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-2">
            {isListening ? "Listening..." : "Click mic to speak"}
        </p>
      </div>
    </div>
  )
}

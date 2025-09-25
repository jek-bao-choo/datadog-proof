'use client'

import { useState } from 'react'
import styles from '../styles/ChatInterface.module.css'
import PromptCards from './PromptCards'
import ChatMessages from './ChatMessages'
import ChatInput from './ChatInput'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    // Add user message to chat
    const userMessage = { type: 'user', content: message }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // Static export mode - simulate API response without actual API call
    if (typeof window !== 'undefined') {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500))

        const mockResponses = [
          "🏝️ That sounds like an amazing adventure! For static export mode, this is a simulated response. In the full version with API, you'd get personalized holiday advice based on your message.",
          "✈️ Great destination choice! This chatbot is currently in static mode for Cloudflare Pages deployment. The full interactive version with AI responses is available when deployed with API support.",
          "🌍 I'd love to help you plan that trip! Note: You're seeing a demo response since this is the static export version. Deploy with Vercel or Netlify for full AI-powered responses."
        ]

        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        const botMessage = { type: 'bot', content: randomResponse }
        setMessages(prev => [...prev, botMessage])

      } catch (error) {
        console.error('Failed to send message:', error)
        const errorMessage = {
          type: 'bot',
          content: 'This is the static export version. Deploy with API support for full functionality!'
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handlePromptCardClick = (promptText) => {
    setInputText(promptText)
  }

  return (
    <div className={styles.chatInterface}>
      <div className={styles.header}>
        <h1 className={styles.title}>Holiday Planner</h1>
        <p className={styles.subtitle}>Plan your perfect getaway</p>
      </div>

      <div className={styles.content}>
        {messages.length === 0 ? (
          <div className={styles.welcomeSection}>
            <PromptCards onCardClick={handlePromptCardClick} />
          </div>
        ) : (
          <div className={styles.messagesSection}>
            <ChatMessages messages={messages} isLoading={isLoading} />
          </div>
        )}
      </div>

      <div className={styles.inputSection}>
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSend={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
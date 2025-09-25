'use client'

import { useState } from 'react'
import styles from '../styles/ChatInput.module.css'

export default function ChatInput({ value, onChange, onSend, isLoading }) {
  const [localValue, setLocalValue] = useState('')

  const inputValue = value !== undefined ? value : localValue
  const handleChange = onChange || setLocalValue

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSend && onSend(inputValue.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className={styles.chatInput} onSubmit={handleSubmit}>
      <div className={styles.inputContainer}>
        <textarea
          className={styles.textarea}
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tell me about your dream vacation..."
          rows={1}
          disabled={isLoading}
          maxLength={1000}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!inputValue.trim() || isLoading}
          aria-label="Send message"
        >
          {isLoading ? (
            <span className={styles.loadingSpinner}>⏳</span>
          ) : (
            <span className={styles.sendIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </span>
          )}
        </button>
      </div>
      <div className={styles.characterCount}>
        {inputValue.length}/1000
      </div>
    </form>
  )
}
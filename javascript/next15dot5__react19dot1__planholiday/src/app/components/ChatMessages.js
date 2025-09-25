'use client'

import { useEffect, useRef } from 'react'
import styles from '../styles/ChatMessages.module.css'

export default function ChatMessages({ messages, isLoading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>💬</div>
        <p className={styles.emptyText}>
          Your holiday conversation will appear here
        </p>
      </div>
    )
  }

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.messagesList}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`${styles.messageWrapper} ${
              message.type === 'user' ? styles.userMessage : styles.botMessage
            }`}
          >
            <div className={styles.messageContent}>
              <div className={styles.messageAvatar}>
                {message.type === 'user' ? '👤' : '🏝️'}
              </div>
              <div className={styles.messageBubble}>
                <p className={styles.messageText}>{message.content}</p>
                <span className={styles.messageTime}>
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className={`${styles.messageWrapper} ${styles.botMessage}`}>
            <div className={styles.messageContent}>
              <div className={styles.messageAvatar}>🏝️</div>
              <div className={`${styles.messageBubble} ${styles.loadingMessage}`}>
                <div className={styles.typingIndicator}>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                  <span className={styles.dot}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
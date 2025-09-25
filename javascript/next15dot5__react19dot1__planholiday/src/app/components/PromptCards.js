'use client'

import styles from '../styles/PromptCards.module.css'

const holidayPrompts = [
  {
    id: 1,
    text: "Skiing in the Japanese Alps",
    background: "linear-gradient(135deg, #74b9ff, #0984e3)",
    icon: "🎿"
  },
  {
    id: 2,
    text: "Diving in the Indonesian Islands",
    background: "linear-gradient(135deg, #00b894, #00a085)",
    icon: "🤿"
  },
  {
    id: 3,
    text: "Meditating in the Thai Forests",
    background: "linear-gradient(135deg, #7CB342, #689F38)",
    icon: "🧘"
  },
  {
    id: 4,
    text: "Hiking in the Chinese Mountains",
    background: "linear-gradient(135deg, #FF8C42, #FF6F00)",
    icon: "🥾"
  },
  {
    id: 5,
    text: "Exploring the Singapore Gardens",
    background: "linear-gradient(135deg, #a29bfe, #6c5ce7)",
    icon: "🌺"
  }
]

export default function PromptCards({ onCardClick }) {
  return (
    <div className={styles.promptCards}>
      <h2 className={styles.title}>Choose your adventure</h2>
      <div className={styles.cardsGrid}>
        {holidayPrompts.map((prompt) => (
          <button
            key={prompt.id}
            className={styles.card}
            style={{ background: prompt.background }}
            onClick={() => onCardClick && onCardClick(prompt.text)}
            type="button"
          >
            <span className={styles.icon}>{prompt.icon}</span>
            <span className={styles.text}>{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
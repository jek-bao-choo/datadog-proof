// BACKUP: API Route for Full-Stack Deployment
// This file contains the API route that needs to be restored when deploying with API support
//
// To restore for full-stack deployment:
// 1. Create folder: src/app/api/chat/
// 2. Copy this content to: src/app/api/chat/route.js
// 3. Update next.config.mjs to remove 'output: export'

import { NextResponse } from 'next/server'

// Mock holiday advice responses
const holidayResponses = [
  "🏔️ The Japanese Alps offer incredible skiing experiences! Consider visiting Hakuba Valley for world-class powder snow, or try Niseko in Hokkaido for the best snow quality. The season runs from December to April, and you can combine skiing with authentic hot spring experiences (onsen) and delicious local cuisine like ramen and sake.",

  "🏝️ Indonesian islands are a diver's paradise! Raja Ampat offers the most biodiverse marine life on Earth, while Komodo National Park combines diving with encounters with Komodo dragons. For beginners, Bali's clear waters around Nusa Penida are perfect. Best diving is during dry season (April-November).",

  "🧘‍♀️ Thai forests provide serene meditation retreats! Visit Wat Phra Dhammakaya near Bangkok for structured programs, or head to Chiang Mai's mountain temples like Doi Suthep. The cool season (November-February) is ideal. Many retreats offer silent meditation, forest walking, and traditional Buddhist teachings.",

  "⛰️ Chinese mountains offer breathtaking hiking adventures! Mount Huangshan (Yellow Mountain) features iconic granite peaks and ancient pines. For challenge seekers, try Mount Hua with its famous plank walks. Spring (March-May) and autumn (September-November) provide the best weather and stunning colors.",

  "🌺 Singapore's gardens are urban oases of tranquility! Gardens by the Bay features futuristic Supertrees and climate-controlled domes with plants from around the world. The Singapore Botanic Gardens, a UNESCO World Heritage site, offers peaceful walks among tropical flora. Visit early morning or late afternoon to avoid crowds.",

  "✈️ That sounds like an amazing adventure! I'd recommend checking visa requirements, booking accommodations early (especially during peak season), and considering travel insurance. Don't forget to research local customs, try authentic cuisine, and pack appropriate gear for your activities.",

  "🌍 What an exciting destination choice! I suggest planning your itinerary around local weather patterns, booking popular attractions in advance, and learning a few key phrases in the local language. Consider staying in locally-owned accommodations to support the community and get authentic cultural experiences.",

  "🎒 Great question about travel planning! I recommend creating a flexible itinerary that balances must-see sights with spontaneous exploration. Pack light but smart - bring versatile clothing and essential items. Always have backup plans for activities in case of weather changes."
]

// Simulate realistic API delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Get random response
function getRandomResponse() {
  const randomIndex = Math.floor(Math.random() * holidayResponses.length)
  return holidayResponses[randomIndex]
}

export async function POST(request) {
  try {
    // Parse request body
    const { message } = await request.json()

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simulate processing delay (1-3 seconds)
    const delayMs = Math.floor(Math.random() * 2000) + 1000
    await delay(delayMs)

    // Generate mock response
    const response = getRandomResponse()

    // Return success response
    return NextResponse.json(
      {
        response,
        timestamp: new Date().toISOString(),
        messageReceived: message.trim()
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('API Error:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send messages.' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send messages.' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send messages.' },
    { status: 405 }
  )
}
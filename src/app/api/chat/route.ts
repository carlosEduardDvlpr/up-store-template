// src/app/api/chat/assistant/route.ts

import { databaseApi } from '@/data/database-api'

import { openaiAI } from '@/lib/ai-sdk'
import { generateText, tool } from 'ai'
import { z } from 'zod'

import { prompt } from '@/lib/openai/tools/prompt'
import { NextRequest, NextResponse } from 'next/server'
import { Order } from '@/data/types/orders'
import { cookies } from 'next/headers'
import { REFRESH_TOKEN } from '@/data/constants'
import { env } from '@/env'

export const runtime = 'edge' // ✅ Correct way for Next.js 14+

export async function POST(request: NextRequest) {
  try {
    const { message, conversationContext } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Missing required fields: message or userId' },
        { status: 400 },
      )
    }

    //  Retrieve chat history (if any)
    const history = conversationContext || []

    // Add the user's message to history
    history.push({ role: 'user', content: message })

    // Build system prompt with user data
    const systemPrompt = prompt

    // Prepare messages for OpenAI API
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10), // Keep last 10 messages for context
    ]

    const { text } = await generateText({
      model: openaiAI,
      messages,
      tools: {
        recommendProductsByText: tool({
          description: 'Recommend products based on user message',
           
          parameters: z.object({ message: z.string() }) as any,
          execute: recommendProductsByText,
        }),
        getOrders: tool({
          description: 'Get user orders',
           
          parameters: z.object({}) as any,
          execute: getOrders,
        }),
      },
      system: systemPrompt,
      maxSteps: 2, // Reduced steps to improve speed
    })

    // Save AI response to history
    history.push({ role: 'assistant', content: text })

    return NextResponse.json({ text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Error generating response' },
      { status: 500 },
    )
  }
}

// Function to retrieve orders from the database
async function getOrders(): Promise<Order[]> {
  const cookieStore = await cookies()
  const token = cookieStore.get(REFRESH_TOKEN)
  const bearer = token?.value

  const response = await databaseApi(`/orders/users`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearer}`,
      'x-api-frontend-key': env.DATABASE_API_SECRET_KEY,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch orders from API.')
  }

  const { orders } = await response.json()
  return orders
}

async function recommendProductsByText({ message }: { message: string }) {
  try {
    const response = await databaseApi(`/products/recommend-by-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-frontend-key': env.DATABASE_API_SECRET_KEY,
      },
      body: JSON.stringify({ message }),
    })

    const products = await response.json()
    return products
  } catch (error) {
    console.error('Erro ao buscar recomendações de produtos:', error)
    throw new Error('Falha ao buscar recomendações de produtos.')
  }
}

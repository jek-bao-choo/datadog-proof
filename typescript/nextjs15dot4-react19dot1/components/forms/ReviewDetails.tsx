'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, generateTransactionId } from '@/lib/utils'
import { mockPaymentResult } from '@/lib/validations'

export default function ReviewDetails() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isProcessing, setIsProcessing] = useState(false)

  const phone = searchParams.get('phone')
  const amount = parseFloat(searchParams.get('amount') || '0')

  // Redirect if missing data
  if (!phone || !amount) {
    router.replace('/')
    return null
  }

  const handleConfirm = async () => {
    setIsProcessing(true)

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const result = mockPaymentResult()
    const transactionId = generateTransactionId()

    const resultParams = new URLSearchParams({
      status: result,
      phone: phone,
      amount: amount.toString(),
      transactionId: transactionId
    })

    router.push(`/success?${resultParams.toString()}`)
  }

  const handleEdit = () => {
    router.back()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Review Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">To:</span>
              <span className="font-medium">{phone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-lg">{formatCurrency(amount)}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleConfirm}
              className="mobile-button mobile-button-primary w-full"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing Payment...' : 'Confirm Payment'}
            </Button>
            
            <Button
              onClick={handleEdit}
              variant="outline"
              className="mobile-button w-full"
              disabled={isProcessing}
            >
              Edit Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
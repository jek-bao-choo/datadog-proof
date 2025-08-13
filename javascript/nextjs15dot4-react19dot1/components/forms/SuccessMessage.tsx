'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { CheckCircle, XCircle } from 'lucide-react'

export default function SuccessMessage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const status = searchParams.get('status')
  const phone = searchParams.get('phone')
  const amount = parseFloat(searchParams.get('amount') || '0')
  const transactionId = searchParams.get('transactionId')

  const isSuccess = status === 'success'

  const handleNewPayment = () => {
    router.push('/')
  }

  if (!status || !phone || !amount || !transactionId) {
    router.replace('/')
    return null
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center">
            {isSuccess ? (
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
            )}
          </div>

          <div className="space-y-4 p-4 bg-gray-100 rounded-lg">
            <div className="text-center">
              <p className={`text-lg font-semibold ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                {isSuccess 
                  ? `${formatCurrency(amount)} sent successfully`
                  : 'Payment could not be processed'
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">To:</span>
                <span>{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span>{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="text-xs">{transactionId}</span>
              </div>
              {!isSuccess && (
                <div className="mt-4 p-3 bg-red-50 rounded border-l-4 border-red-400">
                  <p className="text-sm text-red-700">
                    The payment could not be completed. Please try again or contact support.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleNewPayment}
            className="mobile-button mobile-button-primary w-full"
          >
            Make Another Payment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
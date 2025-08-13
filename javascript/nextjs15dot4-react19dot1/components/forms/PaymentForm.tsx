'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { paymentSchema, type PaymentFormData } from '@/lib/validations'
import { formatPhoneNumber } from '@/lib/utils'

export default function PaymentForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema)
  })


  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true)
    
    // Format phone number for display
    const formattedPhone = formatPhoneNumber(data.phoneNumber)
    
    // Navigate to review page with data
    const searchParams = new URLSearchParams({
      phone: formattedPhone,
      amount: data.amount.toString()
    })
    
    router.push(`/review?${searchParams.toString()}`)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue('phoneNumber', value)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Send Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Recipient Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+65 9123 4567"
              className="mobile-input"
              {...register('phoneNumber')}
              onChange={handlePhoneChange}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SGD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max="10000"
              placeholder="0.00"
              className="mobile-input"
              {...register('amount', { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="mobile-button mobile-button-primary w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Next'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
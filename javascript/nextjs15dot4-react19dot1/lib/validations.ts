import { z } from 'zod'

export const paymentSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^(\+65|65)?[689]\d{7}$/, 'Please enter a valid Singapore phone number'),
  
  amount: z
    .number({ message: 'Amount must be a number' })
    .min(0.01, 'Amount must be at least $0.01')
    .max(10000, 'Amount cannot exceed $10,000')
    .multipleOf(0.01, 'Amount cannot have more than 2 decimal places')
})

export type PaymentFormData = z.infer<typeof paymentSchema>

export const mockPaymentResult = () => {
  // Mock payment processing - 80% success rate
  return Math.random() > 0.2 ? 'success' : 'failure'
}
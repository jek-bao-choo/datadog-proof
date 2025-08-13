import { Suspense } from 'react'
import ReviewDetails from '@/components/forms/ReviewDetails'

export default function ReviewPage() {
  return (
    <div className="min-h-screen py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <ReviewDetails />
      </Suspense>
    </div>
  )
}
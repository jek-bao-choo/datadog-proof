import { Suspense } from 'react'
import SuccessMessage from '@/components/forms/SuccessMessage'

export default function SuccessPage() {
  return (
    <div className="min-h-screen py-8">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessMessage />
      </Suspense>
    </div>
  )
}
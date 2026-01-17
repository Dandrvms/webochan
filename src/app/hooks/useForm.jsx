"use client"

import { useState, useCallback } from 'react'

export const useForm = (onSubmit, { onSuccess, onError } = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = useCallback(async (data, optimisticId = null) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const result = await onSubmit(data)
      
      if (onSuccess) {
        await onSuccess(result, optimisticId)
      }
      
      return result
    } catch (err) {
      const errorMsg = err.message || 'Error al enviar'
      setError(errorMsg)
      
      if (onError) {
        onError(err, optimisticId)
      }
      
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }, [onSubmit, onSuccess, onError])

  return {
    isSubmitting,
    error,
    handleSubmit,
    clearError: () => setError(null)
  }
}
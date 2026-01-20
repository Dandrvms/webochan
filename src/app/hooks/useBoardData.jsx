"use client"

import { useState, useCallback, useEffect } from 'react'

export const useBoardData = (type, initialData = [], context = {}) => {
  const [data, setData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData.length !== data.length) {
      setData(initialData);
    }
  }, [initialData])

  const getCookie = useCallback((name) => {
    if (typeof document === 'undefined') return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
    return null
  }, [])

  const refreshData = useCallback(async () => {
    setLoading(true)
    const csrfToken = getCookie('csrfToken')

    try {
      let endpoint, headers = { 'X-CSRF-Token': csrfToken }

      switch (type) {
        case 'messages':
          endpoint = '/api/messages'
          
          const path = context.boardId ? `/board/${context.boardId}` : window.location.pathname
          headers.path = path
          break
        case 'comments':
          if (context.boardId === 'polls') {
            endpoint = '/api/poll_comments'
            headers['Content-Type'] = 'application/json'
            headers.pollId = context.messageId || context.pollId
          } else {
            endpoint = '/api/comments'
            headers['Content-Type'] = 'application/json'
            headers.messageId = context.messageId
            if (context.boardId) {
              headers.boardId = context.boardId
            }
          }
          break
        case 'polls':
          endpoint = '/api/polls'
          break
        default:
          throw new Error(`Tipo no soportado: ${type}`)
      }

      const res = await fetch(endpoint, {
        headers,
        credentials: 'include' 
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const result = await res.json()
      setData(result)
    } catch (error) {
      console.error(`Error refreshing ${type}:`, error)
      
      setData(initialData)
    } finally {
      setLoading(false)
    }
  }, [type, context.boardId, context.messageId, context.pollId, getCookie, initialData])

  const addOptimistic = useCallback((newItem) => {
    const userSecret = getCookie('secretKey')

    const tempItem = {
      ...newItem,
      id: `temp-${Date.now()}`,
      date: new Date().toISOString(),
      canEdit: false,
      isEdited: false,
      [type === 'messages' ? 'comments' : (type === 'polls' ? 'comments' : 'replies')]: 0,
      [type === 'messages' ? 'commentsContent' : (type === 'polls' ? 'commentsContent' : 'repliesContent')]: []
    }

   
    if (type === 'comments') {
      tempItem.isOP = false
    }

    
    if (type === 'messages' || type === 'polls') {
      setData(prev => [tempItem, ...prev])
    } else {
      setData(prev => [...prev, tempItem])
    }

    return tempItem.id
  }, [type, getCookie])

  const replaceTemp = useCallback((tempId, realItem) => {
    
    setData(prev => prev.map(item =>
      item.id === tempId ? realItem : item
    ))
  }, [])

  const removeTemp = useCallback((tempId) => {
    setData(prev => prev.filter(item => item.id !== tempId))
  }, [])

  const updateOptimistic = useCallback((id, updateFn) => {
    setData(prev => prev.map(item =>
      item.id === id ? updateFn(item) : item
    ))
  }, [])

  return {
    data,
    loading,
    setData,
    refreshData,
    addOptimistic,
    replaceTemp,
    removeTemp,
    updateOptimistic
  }
}
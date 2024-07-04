'use client'

import { DictionaryContext } from '@/locales/DictionaryProvider'
import { useContext } from 'react'

export default function useDictionary() {
  const dictionary = useContext(DictionaryContext)
  if (dictionary === null) {
    throw new Error('useDictionary hook must be used within DictionaryProvider')
  }

  return dictionary
}

import React, { useState, useEffect } from 'react'
import { StringInput } from 'sanity'

interface CurrencyInputProps {
  value?: string
  onChange: (value: string | undefined) => void
}

export default function CurrencyInput(props: CurrencyInputProps) {
  const { value, onChange } = props
  const [displayValue, setDisplayValue] = useState('')

  useEffect(() => {
    if (value) {
      setDisplayValue(value)
    } else {
      setDisplayValue('')
    }
  }, [value])

  const formatNumber = (str: string): string => {
    if (!str) return ''
    const cleaned = str.replace(/\./g, '').replace(/,/g, '')
    const num = parseInt(cleaned, 10)
    if (isNaN(num)) return str
    return num.toLocaleString('tr-TR')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value
    const formatted = formatNumber(inputValue)
    setDisplayValue(formatted)
    onChange(formatted)
  }

  return (
    <StringInput
      {...props}
      value={displayValue}
      onChange={handleChange}
      placeholder="1.000.000"
    />
  )
}

import React, { useMemo } from 'react'
import { Stack, Text, Select, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'
import { useFormValue } from 'sanity'
import { PROVINCES } from './addressData'

export default function ProvinceSelectOrText(props: StringInputProps) {
  const { value, onChange, readOnly } = props as any
  const manual = useFormValue(['manualAddress']) as boolean | undefined

  const provinceList = useMemo(() => PROVINCES, [])

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    if (!v) onChange(unset())
    else onChange(set(v))
  }

  const handleText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (!v) onChange(unset())
    else onChange(set(v))
  }

  return (
    <Stack space={2}>
      {manual ? (
        <TextInput value={value || ''} onChange={handleText} readOnly={readOnly} placeholder="İl yazın"/>
      ) : (
        <Select value={value || ''} onChange={handleSelect} disabled={readOnly}>
          <option value="">İl seçin</option>
          {provinceList.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </Select>
      )}
      <Text size={1} muted>{manual ? 'Manuel il girişi' : 'Listeden il seçimi'}</Text>
    </Stack>
  )
}



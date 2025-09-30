import React, { useMemo } from 'react'
import { Stack, Text, Select, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'
import { useFormValue } from 'sanity'
import { DISTRICTS_BY_PROVINCE } from './addressData'

export default function DistrictSelectInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props as any
  const provinceName = useFormValue(['province']) as string | undefined
  const manual = useFormValue(['manualAddress']) as boolean | undefined

  const districts = useMemo(() => {
    if (!provinceName) return []
    return DISTRICTS_BY_PROVINCE[provinceName] || []
  }, [provinceName])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
        <TextInput value={value || ''} onChange={handleText} readOnly={readOnly} placeholder="İlçe yazın"/>
      ) : (
        <Select value={value || ''} onChange={handleChange} disabled={!provinceName || readOnly}>
          <option value="">{provinceName ? 'İlçe seçin' : 'Önce il seçin'}</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </Select>
      )}
      {!manual && !provinceName && (
        <Text size={1} muted>Önce il seçmelisiniz</Text>
      )}
    </Stack>
  )
}



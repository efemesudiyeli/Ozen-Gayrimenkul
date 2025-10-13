import React, { useMemo } from 'react'
import { Stack, Text, Select, TextInput } from '@sanity/ui'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'
import { useFormValue } from 'sanity'
import { NEIGHBORHOODS_BY_DISTRICT, CYPRUS_NEIGHBORHOODS_BY_DISTRICT } from './addressData'

export default function NeighborhoodSelectInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props as any
  const districtName = useFormValue(['district']) as string | undefined
  const manual = useFormValue(['manualAddress']) as boolean | undefined
  const docType = (useFormValue(['_type']) as string) || ''

  const neighborhoods = useMemo(() => {
    if (!districtName) return []
    const map = docType === 'cyprusProperty' ? CYPRUS_NEIGHBORHOODS_BY_DISTRICT : NEIGHBORHOODS_BY_DISTRICT
    return map[districtName] || []
  }, [districtName, docType])

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
        <TextInput value={value || ''} onChange={handleText} readOnly={readOnly} placeholder="Mahalle yazın"/>
      ) : (
        <Select value={value || ''} onChange={handleChange} disabled={!districtName || readOnly}>
          <option value="">{districtName ? 'Mahalle seçin' : 'Önce ilçe seçin'}</option>
          {neighborhoods.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </Select>
      )}
      {!manual && !districtName && (
        <Text size={1} muted>Önce ilçe seçmelisiniz</Text>
      )}
    </Stack>
  )
}



import React, { useMemo } from 'react'
import { Stack, Text, Select } from '@sanity/ui'
import { set, unset } from 'sanity'
import type { StringInputProps } from 'sanity'
import { useFormValue } from 'sanity'
import { NEIGHBORHOODS_BY_DISTRICT } from './addressData'

export default function NeighborhoodSelectInput(props: StringInputProps) {
  const { value, onChange, readOnly } = props as any
  const districtName = useFormValue(['district']) as string | undefined

  const neighborhoods = useMemo(() => {
    if (!districtName) return []
    return NEIGHBORHOODS_BY_DISTRICT[districtName] || []
  }, [districtName])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    if (!v) onChange(unset())
    else onChange(set(v))
  }

  return (
    <Stack space={2}>
      <Select value={value || ''} onChange={handleChange} disabled={!districtName || readOnly}>
        <option value="">{districtName ? 'Mahalle seçin' : 'Önce ilçe seçin'}</option>
        {neighborhoods.map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </Select>
      {!districtName && (
        <Text size={1} muted>Önce ilçe seçmelisiniz</Text>
      )}
    </Stack>
  )
}



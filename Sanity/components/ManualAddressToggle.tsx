import React from 'react'
import { Button, Stack, Text } from '@sanity/ui'
import { set, unset } from 'sanity'
import type { BooleanInputProps } from 'sanity'
import { useFormValue } from 'sanity'

export default function ManualAddressToggle(props: BooleanInputProps) {
  const { value, onChange, readOnly } = props as any
  const docType = (useFormValue(['_type']) as string) || ''

  const handleToggle = () => {
    const next = !value
    if (next === false) onChange(unset())
    else onChange(set(true))
  }

  return (
    <Stack space={2}>
      <Button
        text={value ? (docType === 'cyprusProperty' ? "Kıbrıs'a Dön" : "Antalya'ya Dön") : 'Başka İl Gir'}
        mode="default"
        tone={value ? 'primary' : 'default'}
        onClick={handleToggle}
        disabled={readOnly}
      />
      <Text size={1} muted>
        {value ? 'Manuel adres girişi aktif' : 'Listeden adres seçimi aktif'}
      </Text>
    </Stack>
  )
}



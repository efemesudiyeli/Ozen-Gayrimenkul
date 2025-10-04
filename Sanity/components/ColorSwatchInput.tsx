import React, {useCallback, useEffect} from 'react'
import {Box, Grid, Card, Text, Stack} from '@sanity/ui'
import type {ObjectInputProps, Path} from 'sanity'
import {set, unset} from 'sanity'

const PRESET_COLORS: { title: string; hex: string }[] = [
  { title: 'Siyah', hex: '#111827' },
  { title: 'Mavi', hex: '#2563eb' },
  { title: 'Kırmızı', hex: '#dc2626' },
  { title: 'Yeşil', hex: '#16a34a' },
  { title: 'Turuncu', hex: '#ea580c' },
  { title: 'Mor', hex: '#7c3aed' },
  { title: 'Pembe', hex: '#db2777' },
  { title: 'Sarı', hex: '#ca8a04' },
  { title: 'Camgöbeği', hex: '#0891b2' },
  { title: 'Gri', hex: '#6b7280' },
]

export default function ColorSwatchInput(props: ObjectInputProps) {
  const {value, onChange} = props
  const selectedHex = (value as any)?.color?.hex

  const handlePick = useCallback((hex: string) => {
    console.log('Picking color:', hex)
    
    // textColor annotation'ın tamamını set et
    const newValue = {
      ...(value as any),
      color: { hex }
    }
    
    console.log('Setting new value:', newValue)
    onChange([set(newValue)])
  }, [onChange, value])

  return (
    <Box padding={3}>
      <Text size={1} weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
        Renk Seçin:
      </Text>
      <Grid columns={5} gap={2}>
        {PRESET_COLORS.map(({ title, hex }) => {
          const isSelected = selectedHex && typeof selectedHex === 'string' && selectedHex.toLowerCase() === hex.toLowerCase()
          return (
             <Card
               key={hex}
               padding={0}
               radius={2}
               title={title}
               style={{
                 cursor: 'pointer',
                 border: isSelected ? '4px solid white' : '2px solid #d1d5db',
                 backgroundColor: hex,
                 aspectRatio: '1',
                 minHeight: 50,
                 transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                 boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)',
                 transition: 'all 0.2s ease',
                 zIndex: isSelected ? 10 : 1,
               }}
               onClick={() => {
                 console.log('Card clicked, hex:', hex)
                 handlePick(hex)
               }}
               onMouseEnter={(e) => {
                 if (!isSelected) {
                   e.currentTarget.style.transform = 'scale(1.08)'
                   e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)'
                 }
               }}
               onMouseLeave={(e) => {
                 if (!isSelected) {
                   e.currentTarget.style.transform = 'scale(1)'
                   e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                 }
               }}
             />
          )
        })}
      </Grid>
      {selectedHex && (
        <Text size={1} muted style={{ marginTop: '8px', display: 'block' }}>
          Seçili renk: {PRESET_COLORS.find(c => c.hex.toLowerCase() === selectedHex.toLowerCase())?.title}
        </Text>
      )}
    </Box>
  )
}



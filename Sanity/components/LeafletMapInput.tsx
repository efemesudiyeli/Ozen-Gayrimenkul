import React, { useCallback, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import { Flex } from '@sanity/ui'
import { LatLng } from 'leaflet'
import { Stack, Text, Button, Box, Spinner } from '@sanity/ui'
import { set, unset, PatchEvent } from 'sanity'
import type { ObjectInputProps } from 'sanity'
import 'leaflet/dist/leaflet.css'

// Leaflet marker icon fix
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface GeoPoint {
  lat: number
  lng: number
  alt?: number
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (latlng: LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng)
    },
  })
  return null
}

// Reverse geocoding fonksiyonu
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=tr`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

export default function LeafletMapInput(props: ObjectInputProps) {
  const { value, onChange, document, onPathFocus } = props
  
  const [position, setPosition] = useState<LatLng | null>(
    value ? new LatLng(value.lat, value.lng) : null
  )
  const [isGeocodingLoading, setIsGeocodingLoading] = useState(false)
  const [addressInfo, setAddressInfo] = useState<string | null>(null)
  const [satellite, setSatellite] = useState(false)

  // Antalya merkezi default konum
  const defaultCenter: LatLng = new LatLng(36.8969, 30.7133)
  const center = position || defaultCenter

  const handleLocationSelect = useCallback(async (latlng: LatLng) => {
    setPosition(latlng)
    setIsGeocodingLoading(true)
    setAddressInfo(null)
    
    // Koordinatları kaydet
    onChange(set({
      lat: latlng.lat,
      lng: latlng.lng,
      alt: 0
    }))

    // Reverse geocoding ile adresi al
    const addressData = await reverseGeocode(latlng.lat, latlng.lng)
    
    if (addressData && addressData.address) {
      const { address } = addressData
      
      // Daha detaylı adres bilgilerini topla
      const addressDetails = {
        il: address.state || address.province,
        ilce: address.county || address.city_district || address.district,
        mahalle: address.suburb || address.neighbourhood || address.quarter || address.village,
        sokak: address.road || address.street || address.pedestrian,
        cadde: address.avenue || address.boulevard,
        no: address.house_number,
        posta: address.postcode,
        semt: address.town || address.municipality
      }
      
      // Görsel olarak gösterilecek adres parçaları
      const addressParts = []
      if (addressDetails.il) addressParts.push(addressDetails.il)
      if (addressDetails.ilce) addressParts.push(addressDetails.ilce)
      if (addressDetails.semt && addressDetails.semt !== addressDetails.ilce) {
        addressParts.push(addressDetails.semt)
      }
      if (addressDetails.mahalle) addressParts.push(addressDetails.mahalle)
      if (addressDetails.cadde) addressParts.push(addressDetails.cadde)
      if (addressDetails.sokak) addressParts.push(addressDetails.sokak)
      if (addressDetails.no) addressParts.push(`No: ${addressDetails.no}`)
      if (addressDetails.posta) addressParts.push(addressDetails.posta)
      
      setAddressInfo(addressParts.join(', '))
      
      // Console'da detaylı bilgi ver
      console.log('🗺️ Seçilen konum adres bilgileri:', {
        ...addressDetails,
        fullAddress: addressData.display_name,
        rawData: address // Ham veriyi de göster
      })
    }
    
    setIsGeocodingLoading(false)
  }, [onChange])

  const handleClearLocation = useCallback(() => {
    setPosition(null)
    setAddressInfo(null)
    onChange(unset())
  }, [onChange])

  return (
    <Stack space={3}>
      <Stack direction="row" space={2} align="center">
        <Text size={1} muted>
          Haritaya tıklayarak konum seçin - adres bilgileri otomatik doldurulacak
        </Text>
        {isGeocodingLoading && <Spinner muted size={1} />}
      </Stack>
      
      <Box style={{ height: '400px', width: '100%', position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={11}
          style={{ height: '100%', width: '100%' }}
        >
          {satellite ? (
            <TileLayer
              attribution='Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          ) : (
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          )}
          
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          
          {position && (
            <Marker position={position} />
          )}
        </MapContainer>

        <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 1000 }}>
          <div style={{ display: 'inline-flex', borderRadius: 6, overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 2px rgba(0,0,0,0.06)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'saturate(180%) blur(6px)' }}>
            <button
              type="button"
              onClick={() => setSatellite(false)}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 600, color: !satellite ? '#fff' : '#374151', background: !satellite ? '#f97316' : 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Harita
            </button>
            <div style={{ width: 1, background: '#e5e7eb' }} />
            <button
              type="button"
              onClick={() => setSatellite(true)}
              style={{ padding: '6px 10px', fontSize: 12, fontWeight: 600, color: satellite ? '#fff' : '#374151', background: satellite ? '#f97316' : 'transparent', border: 'none', cursor: 'pointer' }}
            >
              Uydu
            </button>
          </div>
        </div>
      </Box>

      <Stack direction="row" space={2} align="center">
        {position && (
          <>
            <Text size={1}>
              Seçilen konum: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </Text>
            <Button
              text="Konumu Temizle"
              tone="critical"
              mode="ghost"
              onClick={handleClearLocation}
            />
          </>
        )}
      </Stack>
      
      {isGeocodingLoading && (
        <Text size={1} muted>
          📍 Adres bilgileri alınıyor...
        </Text>
      )}
      
      {addressInfo && (
        <Box padding={3} style={{ backgroundColor: '#1f2937', borderRadius: '6px', border: '1px solid #374151' }}>
          <Text size={1} weight="medium" style={{ color: '#10b981' }}>
            📍 Bulunan Adres Bilgileri:
          </Text>
          <Box style={{ marginTop: '8px', padding: '12px', backgroundColor: '#111827', borderRadius: '4px' }}>
            <Text size={1} style={{ lineHeight: '1.6', wordBreak: 'break-word', color: 'white', fontWeight: 'bold' }}>
              {addressInfo}
            </Text>
          </Box>
          <Text size={0} style={{ marginTop: '8px', color: '#9ca3af' }}>
            💡 Bu bilgileri yukarıdaki adres alanlarına kopyalayabilirsiniz
          </Text>
          <Text size={0} style={{ marginTop: '4px', color: '#9ca3af' }}>
            🔍 Daha detaylı bilgi için browser console'unu (F12) kontrol edin
          </Text>
        </Box>
      )}
    </Stack>
  )
}

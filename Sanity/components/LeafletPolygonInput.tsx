import React, { useCallback, useState } from 'react'
import { MapContainer, TileLayer, Marker, Polygon, useMapEvents } from 'react-leaflet'
import { LatLng } from 'leaflet'
import { Stack, Text, Button, Box, Flex } from '@sanity/ui'
import { set, unset } from 'sanity'
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

function MapClickHandler({ onLocationAdd }: { onLocationAdd: (latlng: LatLng) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationAdd(e.latlng)
    },
  })
  return null
}

export default function LeafletPolygonInput(props: ObjectInputProps) {
  const { value, onChange } = props
  
  const [corners, setCorners] = useState<LatLng[]>(
    value ? value.map((point: GeoPoint) => new LatLng(point.lat, point.lng)) : []
  )
  const [satellite, setSatellite] = useState(true)

  // Antalya merkezi default konum
  const defaultCenter: LatLng = new LatLng(36.8969, 30.7133)
  const center = corners.length > 0 ? corners[0] : defaultCenter

  const handleLocationAdd = useCallback((latlng: LatLng) => {
    // Yeni köşe ekle (sınırsız)
    const newCorners = [...corners, latlng]
    setCorners(newCorners)
    
    onChange(set(newCorners.map((corner, index) => ({
      _key: `corner-${Date.now()}-${index}`,
      _type: 'geopoint',
      lat: corner.lat,
      lng: corner.lng,
      alt: 0
    }))))
  }, [corners, onChange])

  const handleClearCorners = useCallback(() => {
    setCorners([])
    onChange(unset())
  }, [onChange])

  const handleRemoveLastCorner = useCallback(() => {
    if (corners.length > 0) {
      const newCorners = corners.slice(0, -1)
      setCorners(newCorners)
      
      if (newCorners.length > 0) {
        onChange(set(newCorners.map((corner, index) => ({
          _key: `corner-${Date.now()}-${index}`,
          _type: 'geopoint',
          lat: corner.lat,
          lng: corner.lng,
          alt: 0
        }))))
      } else {
        onChange(unset())
      }
    }
  }, [corners, onChange])

  const handleRemoveCorner = useCallback((index: number) => {
    if (corners.length > 0) {
      const newCorners = corners.filter((_, i) => i !== index)
      setCorners(newCorners)
      
      if (newCorners.length > 0) {
        onChange(set(newCorners.map((corner, index) => ({
          _key: `corner-${Date.now()}-${index}`,
          _type: 'geopoint',
          lat: corner.lat,
          lng: corner.lng,
          alt: 0
        }))))
      } else {
        onChange(unset())
      }
    }
  }, [corners, onChange])

  return (
    <Stack space={3}>
      <Stack direction="row" space={2} align="center">
        <Text size={1} muted>
          Arsa sınırlarını belirlemek için haritaya tıklayın (en az 3, istediğiniz kadar nokta)
        </Text>
      </Stack>
      
      <Box style={{ height: '400px', width: '100%', position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={15}
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
          
          <MapClickHandler onLocationAdd={handleLocationAdd} />
          
          {/* Köşe markerları */}
          {corners.map((corner, index) => (
            <Marker key={index} position={corner} />
          ))}
          
          {/* Polygon çizimi (en az 3 köşe gerekli) */}
          {corners.length >= 3 && (
            <Polygon
              positions={corners}
              pathOptions={{
                color: '#3b82f6',
                weight: 2,
                fillColor: '#3b82f6',
                fillOpacity: 0.2
              }}
            />
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

      <Flex gap={2} wrap="wrap">
        <Text size={1}>
          İşaretlenen köşe sayısı: <strong>{corners.length}</strong>
        </Text>
        
        {corners.length > 0 && (
          <>
            <Button
              text="Son Köşeyi Sil"
              tone="caution"
              mode="ghost"
              onClick={handleRemoveLastCorner}
            />
            <Button
              text="Tümünü Temizle"
              tone="critical"
              mode="ghost"
              onClick={handleClearCorners}
            />
          </>
        )}
      </Flex>

      {corners.length > 0 && (
        <Box padding={3} style={{ backgroundColor: '#f1f5f9', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <Text size={1} weight="medium" style={{ color: '#1e40af' }}>
            📍 İşaretlenen Köşeler:
          </Text>
          <Stack space={1} style={{ marginTop: '8px' }}>
            {corners.map((corner, index) => (
              <Flex key={index} align="center" justify="space-between" style={{ padding: '4px 0' }}>
                <Text size={1} muted>
                  Köşe {index + 1}: {corner.lat.toFixed(6)}, {corner.lng.toFixed(6)}
                </Text>
                <Button
                  text="Sil"
                  tone="critical"
                  mode="ghost"
                  onClick={() => handleRemoveCorner(index)}
                  style={{ fontSize: '12px', padding: '2px 8px' }}
                />
              </Flex>
            ))}
          </Stack>
          {corners.length >= 3 && (
            <Text size={1} style={{ color: '#059669', marginTop: '8px', fontWeight: 'medium' }}>
              ✅ Arsa sınırları oluşturuldu! (En az 3 nokta gerekli)
            </Text>
          )}
        </Box>
      )}
      
      {corners.length < 3 && corners.length > 0 && (
        <Text size={1} muted style={{ color: '#f59e0b' }}>
          ⚠️ Polygon oluşturmak için en az 3 köşe gerekli
        </Text>
      )}
    </Stack>
  )
}

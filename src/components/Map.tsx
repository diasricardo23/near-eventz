'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useState } from 'react'
import L from 'leaflet'
import { MapPin } from 'lucide-react'
import { renderToString } from 'react-dom/server'

// Fix for default markers
const LocationIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="color: #ef4444;">${renderToString(<MapPin size={32} fill="#ef4444" />)}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

const PointIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="color: #2563eb;">${renderToString(<MapPin size={32} />)}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
})

// Set default icon for all markers
L.Marker.prototype.options.icon = PointIcon

// Generate random points around a center position
const generatePoints = (center: [number, number], count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    position: [
      center[0] + (Math.random() - 0.5) * 0.01,
      center[1] + (Math.random() - 0.5) * 0.01
    ] as [number, number],
    name: `Location ${i + 1}`,
    description: `Nearby location ${i + 1}`
  }))
}

// Component to update map center when location is found
function LocationMarker({ onLocationFound }: { onLocationFound: (pos: [number, number]) => void }) {
  const map = useMap()

  useEffect(() => {
    let isSubscribed = true;

    const handleLocation = (e: L.LocationEvent) => {
      if (isSubscribed) {
        const coords: [number, number] = [e.latlng.lat, e.latlng.lng]
        map.flyTo(e.latlng, map.getZoom())
        onLocationFound(coords)
        map.off('locationfound', handleLocation)
      }
    }

    map.locate()
    map.on('locationfound', handleLocation)

    return () => {
      isSubscribed = false
      map.off('locationfound', handleLocation)
    }
  }, [map, onLocationFound])

  return null
}

type Point = {
  id: number
  position: [number, number]
  name: string
  description: string
}

export default function MapPage() {
  // Initialize state with localStorage value if exists, otherwise use São Paulo
  const [userLocation, setUserLocation] = useState<[number, number]>(() => {
    const saved = localStorage.getItem('userLocation')
    return saved ? JSON.parse(saved) : [-23.5505, -46.6333]
  })
  const [points, setPoints] = useState<Array<Point>>([])
  const [hasLocated, setHasLocated] = useState(false)

  useEffect(() => {
    // delete (L.Icon.Default.prototype as any)._getIconUrl
    
    // Generate initial points if we have a saved location
    if (localStorage.getItem('userLocation')) {
      setPoints(generatePoints(userLocation, 5))
      setHasLocated(true)
    }
  }, [userLocation])

  const handleLocationFound = (coords: [number, number]) => {
    if (!hasLocated) {
      setUserLocation(coords)
      setPoints(generatePoints(coords, 5))
      setHasLocated(true)
      localStorage.setItem('userLocation', JSON.stringify(coords))
    }
  }

  return (
    <main className="h-screen w-full relative">
      <MapContainer
        center={userLocation}
        zoom={15}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationFound={handleLocationFound} />
        
        {/* User location marker */}
        <Marker position={userLocation} icon={LocationIcon}>
          <Popup>
            <h3 className="font-bold">You are here</h3>
          </Popup>
        </Marker>

        {/* Generated points */}
        {points.map((point) => (
          <Marker 
            key={point.id} 
            position={point.position}
          >
            <Popup>
              <h3 className="font-bold">{point.name}</h3>
              <p>{point.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  )
} 
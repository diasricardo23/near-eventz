'use client'

import dynamic from 'next/dynamic'

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
})

export default function MapPage() {
  return <MapComponent />
} 
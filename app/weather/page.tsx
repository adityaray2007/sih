'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix missing marker icons in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const weatherLayers = {
  Clouds: 'clouds_new',
  Temperature: 'temp_new',
  Wind: 'wind_new',
  Precipitation: 'precipitation_new',
}

export default function WeatherMapPage() {
  const [position, setPosition] = useState<[number, number] | null>(null)
  const [layer, setLayer] = useState<keyof typeof weatherLayers>('Clouds')
  const [apiKey, setApiKey] = useState<string | null>(null)

  useEffect(() => {
    setApiKey(process.env.NEXT_PUBLIC_OPENWEATHER_KEY || null)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition([28.6139, 77.209]) // fallback: Delhi
      )
    }
  }, [])

  if (!position) return <p className="text-black">Loading map...</p>
  if (!apiKey) return <p className="text-black">OpenWeatherMap API key is missing.</p>

  const overlayUrl = `https://tile.openweathermap.org/map/${weatherLayers[layer]}/{z}/{x}/{y}.png?appid=${apiKey}`

  return (
    <div className="w-screen h-screen relative">
      {/* Dropdown to switch weather layers */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white shadow px-4 py-2 rounded">
        <select
          value={layer}
          onChange={(e) => setLayer(e.target.value as keyof typeof weatherLayers)}
          className="p-2 border rounded text-black"
        >
          {Object.keys(weatherLayers).map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <MapContainer center={position} zoom={7} style={{ width: '100%', height: '100%' }}>
        {/* Base map */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors &copy; CARTO"
        />

        {/* Weather overlay */}
        <TileLayer url={overlayUrl} attribution="&copy; OpenWeatherMap" />

        {/* User location marker */}
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
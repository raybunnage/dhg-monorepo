import { useEffect, useState } from 'react'

const envStyles = {
  development: {
    bg: 'bg-yellow-500',
    text: 'text-black',
    indicator: 'bg-black',
    border: 'border-yellow-600',
    hover: 'hover:bg-yellow-600'
  },
  preview: {
    bg: 'bg-purple-500',
    text: 'text-white',
    indicator: 'bg-white',
    border: 'border-purple-600',
    hover: 'hover:bg-purple-600'
  },
  production: {
    bg: 'bg-green-500',
    text: 'text-white',
    indicator: 'bg-white',
    border: 'border-green-600',
    hover: 'hover:bg-green-600'
  }
}

export function EnvironmentBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const env = import.meta.env.VITE_APP_ENV
  const apiUrl = import.meta.env.VITE_API_URL
  const styles = envStyles[env as keyof typeof envStyles]

  // Hide banner after 5 seconds in production
  useEffect(() => {
    if (env === 'production') {
      const timer = setTimeout(() => setIsVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [env])

  if (!isVisible) return null

  return (
    <div className={`
      fixed bottom-4 right-4 rounded-lg shadow-lg p-3 
      text-sm font-mono border ${styles.bg} ${styles.text} 
      ${styles.border} ${styles.hover} transition-colors
    `}>
      <div className="flex items-center gap-2">
        <div className={`
          w-2 h-2 rounded-full animate-pulse
          ${styles.indicator}
        `} />
        <span className="flex items-center gap-2">
          <strong>{env.toUpperCase()}</strong>
          <span className="opacity-75">|</span>
          <span className="opacity-75">{new URL(apiUrl).host}</span>
        </span>
        <button 
          onClick={() => setIsVisible(false)}
          className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  )
} 
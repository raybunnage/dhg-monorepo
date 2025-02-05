import { useState } from 'react'

interface EnvVar {
  key: string
  value: string
}

const envStyles = {
  development: {
    button: 'bg-yellow-600 hover:bg-yellow-700',
    panel: 'bg-yellow-900',
    border: 'border-yellow-700',
    text: 'text-yellow-200',
    label: 'text-yellow-400'
  },
  preview: {
    button: 'bg-purple-600 hover:bg-purple-700',
    panel: 'bg-purple-900',
    border: 'border-purple-700',
    text: 'text-purple-200',
    label: 'text-purple-400'
  }
}

export function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const env = import.meta.env.VITE_APP_ENV
  
  if (env === 'production') return null

  const styles = envStyles[env as keyof typeof envStyles]

  return (
    <div className="fixed left-4 bottom-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${styles.button} text-white p-2 rounded-lg shadow-lg`}
      >
        {isOpen ? '🔽 Debug' : '🔼 Debug'}
      </button>

      {isOpen && (
        <div className={`
          mt-2 p-4 rounded-lg shadow-lg max-w-md
          ${styles.panel} ${styles.text}
        `}>
          <h2 className="font-bold mb-2">Environment Debug</h2>
          
          <div className="space-y-2">
            {Object.entries(import.meta.env)
              .filter(([key]) => key.startsWith('VITE_'))
              .map(([key, value]) => (
                <div key={key} className="flex items-start gap-2">
                  <span className={`font-mono text-sm ${styles.label}`}>
                    {key}:
                  </span>
                  <span className="text-sm font-mono break-all">
                    {String(value)}
                  </span>
                </div>
              ))}
          </div>

          <div className={`mt-4 pt-4 border-t ${styles.border}`}>
            <h3 className="font-bold mb-2">Build Info</h3>
            <div className="text-sm space-y-1">
              <p>Build Time: {new Date().toLocaleString()}</p>
              <p>Node Version: {import.meta.env.VITE_NODE_VERSION || 'N/A'}</p>
              <p>Commit: {import.meta.env.VITE_COMMIT_REF || 'N/A'}</p>
              <p>Branch: {import.meta.env.VITE_BRANCH || 'N/A'}</p>
              <p>Deploy URL: {import.meta.env.VITE_DEPLOY_URL || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 
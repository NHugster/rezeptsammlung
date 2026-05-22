import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { seedDatabase } from './db/seed.js'
import './index.css'

// Seed läuft async vor dem ersten Render — dexie-react-hooks
// reagiert reaktiv auf Datenbankänderungen, daher kein Warten nötig.
seedDatabase().catch(console.error)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

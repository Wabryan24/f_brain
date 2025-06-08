import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './components/App.jsx'
import ProfessorStats from './components/ProfessorStats.jsx'
import ProfDetail from './pages/ProfDetail.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<ProfessorStats />} />
        <Route path="/" element={<App />} />
        <Route path="/prof/:id" element={<ProfDetail />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
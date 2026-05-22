import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Overview from './pages/Overview.jsx'
import RecipeDetail from './pages/RecipeDetail.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/rezept/:id" element={<RecipeDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

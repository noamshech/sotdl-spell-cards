import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { CharacterProvider } from './context/CharacterContext'
import { CharacterPage } from './pages/CharacterPage'
import { GrimoirePage } from './pages/GrimoirePage'
import { LibraryPage } from './pages/LibraryPage'

export default function App() {
  return (
    <CharacterProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<LibraryPage />} />
            <Route path="grimoire" element={<GrimoirePage />} />
            <Route path="character" element={<CharacterPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </CharacterProvider>
  )
}

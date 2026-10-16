import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Empresas from './pages/Empresas.jsx'
import Vagas from './pages/Vagas.jsx'
import Cursos from './pages/Cursos.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empresas" element={<Empresas />} />
          <Route path="/vagas" element={<Vagas />} />
          <Route path="/cursos" element={<Cursos />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

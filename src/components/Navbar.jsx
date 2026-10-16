import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink className="brand" to="/">Impulso Profissional</NavLink>
        <nav>
          <NavLink to="/">Início</NavLink>
          <NavLink to="/empresas">Empresas</NavLink>
          <NavLink to="/vagas">Vagas</NavLink>
          <NavLink to="/cursos">Cursos</NavLink>
        </nav>
      </div>
    </header>
  )
}

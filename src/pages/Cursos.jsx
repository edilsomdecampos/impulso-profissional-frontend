import { useEffect, useState } from 'react'
import api from '../services/api.js'
import PageHeader from '../components/PageHeader.jsx'
import Message from '../components/Message.jsx'

const vazio = { titulo: '', descricao: '', cargaHoraria: '', formato: 'Online', empresaId: '' }

export default function Cursos() {
  const [cursos, setCursos] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [form, setForm] = useState(vazio)
  const [editandoId, setEditandoId] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const carregar = async () => {
    const [rc, re] = await Promise.all([api.get('/cursos'), api.get('/empresas')])
    setCursos(rc.data)
    setEmpresas(re.data)
  }

  useEffect(() => { carregar() }, [])

  const salvar = async (e) => {
    e.preventDefault()
    setErro('')
    const payload = { ...form, cargaHoraria: Number(form.cargaHoraria), empresaId: Number(form.empresaId) }
    try {
      if (editandoId) {
        await api.put(`/cursos/${editandoId}`, payload)
        setMensagem('Curso atualizado com sucesso.')
      } else {
        await api.post('/cursos', payload)
        setMensagem('Curso cadastrado com sucesso.')
      }
      setForm(vazio)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível salvar o curso.')
    }
  }

  const editar = (curso) => {
    setEditandoId(curso.id)
    setForm({ titulo: curso.titulo, descricao: curso.descricao, cargaHoraria: curso.cargaHoraria, formato: curso.formato, empresaId: curso.empresa.id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const excluir = async (id) => {
    if (!confirm('Deseja realmente excluir este curso?')) return
    await api.delete(`/cursos/${id}`)
    setMensagem('Curso excluído com sucesso.')
    carregar()
  }

  return (
    <>
      <PageHeader title="Cursos" description="CRUD 3 — capacitações para desenvolvimento e inserção profissional." />
      <Message message={mensagem} />
      <Message message={erro} type="error" />

      {empresas.length === 0 && <Message type="error" message="Cadastre pelo menos uma empresa antes de cadastrar um curso." />}

      <form className="form-card" onSubmit={salvar}>
        <h2>{editandoId ? 'Editar curso' : 'Novo curso'}</h2>
        <div className="form-grid">
          <input placeholder="Título do curso" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required />
          <select value={form.empresaId} onChange={e => setForm({ ...form, empresaId: e.target.value })} required><option value="">Selecione a empresa</option>{empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}</select>
          <input type="number" min="1" placeholder="Carga horária" value={form.cargaHoraria} onChange={e => setForm({ ...form, cargaHoraria: e.target.value })} required />
          <select value={form.formato} onChange={e => setForm({ ...form, formato: e.target.value })}><option>Online</option><option>Presencial</option><option>Híbrido</option></select>
          <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} required />
        </div>
        <div className="actions"><button type="submit">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>{editandoId && <button type="button" className="secondary" onClick={() => { setEditandoId(null); setForm(vazio) }}>Cancelar</button>}</div>
      </form>

      <div className="cards-grid">
        {cursos.map(c => <article className="card" key={c.id}><h2>{c.titulo}</h2><p><strong>Instituição:</strong> {c.empresa.nome}</p><p>{c.descricao}</p><p><strong>{c.cargaHoraria}h</strong> • {c.formato}</p><div className="row-actions"><button onClick={() => editar(c)}>Editar</button><button className="danger" onClick={() => excluir(c.id)}>Excluir</button></div></article>)}
      </div>
    </>
  )
}

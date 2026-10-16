import { useEffect, useState } from 'react'
import api from '../services/api.js'
import PageHeader from '../components/PageHeader.jsx'
import Message from '../components/Message.jsx'

const vazio = { titulo: '', descricao: '', modalidade: 'Presencial', nivel: 'Júnior', dataLimite: '', empresaId: '' }

export default function Vagas() {
  const [vagas, setVagas] = useState([])
  const [empresas, setEmpresas] = useState([])
  const [form, setForm] = useState(vazio)
  const [editandoId, setEditandoId] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const carregar = async () => {
    const [rv, re] = await Promise.all([api.get('/vagas'), api.get('/empresas')])
    setVagas(rv.data)
    setEmpresas(re.data)
  }

  useEffect(() => { carregar() }, [])

  const salvar = async (e) => {
    e.preventDefault()
    setErro('')
    const payload = { ...form, empresaId: Number(form.empresaId) }
    try {
      if (editandoId) {
        await api.put(`/vagas/${editandoId}`, payload)
        setMensagem('Vaga atualizada com sucesso.')
      } else {
        await api.post('/vagas', payload)
        setMensagem('Vaga cadastrada com sucesso.')
      }
      setForm(vazio)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível salvar a vaga.')
    }
  }

  const editar = (vaga) => {
    setEditandoId(vaga.id)
    setForm({ titulo: vaga.titulo, descricao: vaga.descricao, modalidade: vaga.modalidade, nivel: vaga.nivel, dataLimite: vaga.dataLimite, empresaId: vaga.empresa.id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const excluir = async (id) => {
    if (!confirm('Deseja realmente excluir esta vaga?')) return
    await api.delete(`/vagas/${id}`)
    setMensagem('Vaga excluída com sucesso.')
    carregar()
  }

  return (
    <>
      <PageHeader title="Vagas" description="CRUD 2 — oportunidades profissionais voltadas ao público adulto." />
      <Message message={mensagem} />
      <Message message={erro} type="error" />

      {empresas.length === 0 && <Message type="error" message="Cadastre pelo menos uma empresa antes de cadastrar uma vaga." />}

      <form className="form-card" onSubmit={salvar}>
        <h2>{editandoId ? 'Editar vaga' : 'Nova vaga'}</h2>
        <div className="form-grid">
          <input placeholder="Título da vaga" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required />
          <select value={form.empresaId} onChange={e => setForm({ ...form, empresaId: e.target.value })} required>
            <option value="">Selecione a empresa</option>
            {empresas.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
          </select>
          <select value={form.modalidade} onChange={e => setForm({ ...form, modalidade: e.target.value })}>
            <option>Presencial</option><option>Remoto</option><option>Híbrido</option>
          </select>
          <select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })}>
            <option>Júnior</option><option>Pleno</option><option>Sênior</option><option>Sem experiência</option>
          </select>
          <input type="date" value={form.dataLimite} onChange={e => setForm({ ...form, dataLimite: e.target.value })} required />
          <textarea placeholder="Descrição" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} required />
        </div>
        <div className="actions"><button type="submit">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>{editandoId && <button type="button" className="secondary" onClick={() => { setEditandoId(null); setForm(vazio) }}>Cancelar</button>}</div>
      </form>

      <div className="cards-grid">
        {vagas.map(v => <article className="card" key={v.id}><h2>{v.titulo}</h2><p><strong>Empresa:</strong> {v.empresa.nome}</p><p>{v.descricao}</p><p><strong>{v.modalidade}</strong> • {v.nivel}</p><p>Até {v.dataLimite}</p><div className="row-actions"><button onClick={() => editar(v)}>Editar</button><button className="danger" onClick={() => excluir(v.id)}>Excluir</button></div></article>)}
      </div>
    </>
  )
}

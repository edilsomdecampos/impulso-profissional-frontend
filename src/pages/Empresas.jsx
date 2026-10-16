import { useEffect, useState } from 'react'
import api from '../services/api.js'
import PageHeader from '../components/PageHeader.jsx'
import Message from '../components/Message.jsx'

const vazio = { nome: '', cnpj: '', email: '', cidade: '' }

export default function Empresas() {
  const [empresas, setEmpresas] = useState([])
  const [form, setForm] = useState(vazio)
  const [editandoId, setEditandoId] = useState(null)
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')

  const carregar = async () => {
    const { data } = await api.get('/empresas')
    setEmpresas(data)
  }

  useEffect(() => { carregar() }, [])

  const salvar = async (e) => {
    e.preventDefault()
    setErro('')
    try {
      if (editandoId) {
        await api.put(`/empresas/${editandoId}`, form)
        setMensagem('Empresa atualizada com sucesso.')
      } else {
        await api.post('/empresas', form)
        setMensagem('Empresa cadastrada com sucesso.')
      }
      setForm(vazio)
      setEditandoId(null)
      carregar()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível salvar a empresa.')
    }
  }

  const editar = (empresa) => {
    setEditandoId(empresa.id)
    setForm({ nome: empresa.nome, cnpj: empresa.cnpj, email: empresa.email, cidade: empresa.cidade })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const excluir = async (id) => {
    if (!confirm('Deseja realmente excluir esta empresa?')) return
    setErro('')
    try {
      await api.delete(`/empresas/${id}`)
      setMensagem('Empresa excluída com sucesso.')
      carregar()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Não foi possível excluir a empresa.')
    }
  }

  return (
    <>
      <PageHeader title="Empresas" description="CRUD 1 — cadastre as organizações responsáveis pelas oportunidades." />
      <Message message={mensagem} />
      <Message message={erro} type="error" />

      <form className="form-card" onSubmit={salvar}>
        <h2>{editandoId ? 'Editar empresa' : 'Nova empresa'}</h2>
        <div className="form-grid">
          <input placeholder="Nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
          <input placeholder="CNPJ" value={form.cnpj} onChange={e => setForm({ ...form, cnpj: e.target.value })} required />
          <input type="email" placeholder="E-mail" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Cidade" value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} required />
        </div>
        <div className="actions">
          <button type="submit">{editandoId ? 'Atualizar' : 'Cadastrar'}</button>
          {editandoId && <button type="button" className="secondary" onClick={() => { setEditandoId(null); setForm(vazio) }}>Cancelar</button>}
        </div>
      </form>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Nome</th><th>CNPJ</th><th>E-mail</th><th>Cidade</th><th>Ações</th></tr></thead>
          <tbody>
            {empresas.map(e => (
              <tr key={e.id}>
                <td>{e.nome}</td><td>{e.cnpj}</td><td>{e.email}</td><td>{e.cidade}</td>
                <td className="row-actions"><button onClick={() => editar(e)}>Editar</button><button className="danger" onClick={() => excluir(e.id)}>Excluir</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Usuarios.css'

export default function Usuarios() {
  const navigate = useNavigate()
  const [usuarios, setUsuarios] = useState([])
  const [editando, setEditando] = useState(null)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login')
      return
    }
    carregar()
  }, [])

  async function carregar() {
    setLoading(true)
    try {
      const { data } = await api.get('/api/usuario')
      setUsuarios(data.dados ?? data)
    } catch {
      setErro('Erro ao carregar usuários.')
    } finally {
      setLoading(false)
    }
  }

  async function remover(id) {
    if (!confirm('Remover este usuário?')) return
    try {
      await api.delete('/api/usuario', { params: { id } })
      setUsuarios(usuarios.filter((u) => u.id !== id))
    } catch {
      setErro('Erro ao remover usuário.')
    }
  }

  async function salvarEdicao(e) {
    e.preventDefault()
    try {
      await api.put('/api/usuario', editando)
      setEditando(null)
      carregar()
    } catch {
      setErro('Erro ao salvar alterações.')
    }
  }

  function handleEditChange(e) {
    setEditando({ ...editando, [e.target.name]: e.target.value })
  }

  function sair() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="usuarios-container">
      <header className="usuarios-header">
        <h1>XColor — Usuários</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link to="/produtos" style={{ color: '#aaa', fontSize: '0.9rem', textDecoration: 'none' }}>Produtos</Link>
          <button onClick={sair} className="btn-sair">Sair</button>
        </div>
      </header>

      {erro && <p className="erro">{erro}</p>}

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : (
        <table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuário</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.usuario}</td>
                <td>{u.nome} {u.sobrenome}</td>
                <td>{u.email}</td>
                <td className="acoes">
                  <button className="btn-editar" onClick={() => setEditando({ ...u })}>Editar</button>
                  <button className="btn-remover" onClick={() => remover(u.id)}>Remover</button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan={5} className="vazio">Nenhum usuário encontrado.</td></tr>
            )}
          </tbody>
        </table>
      )}

      {editando && (
        <div className="modal-overlay" onClick={() => setEditando(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Editar usuário</h2>
            <form onSubmit={salvarEdicao} className="modal-form">
              <label>Usuário</label>
              <input name="usuario" value={editando.usuario} onChange={handleEditChange} required />
              <label>Nome</label>
              <input name="nome" value={editando.nome} onChange={handleEditChange} required />
              <label>Sobrenome</label>
              <input name="sobrenome" value={editando.sobrenome} onChange={handleEditChange} required />
              <label>Email</label>
              <input type="email" name="email" value={editando.email} onChange={handleEditChange} required />
              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={() => setEditando(null)}>Cancelar</button>
                <button type="submit" className="btn-salvar">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

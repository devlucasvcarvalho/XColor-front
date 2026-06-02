import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Auth.css'

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    usuario: '',
    nome: '',
    sobrenome: '',
    email: '',
    senha: '',
    confimaSenha: '',
  })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    if (form.senha !== form.confimaSenha) {
      setErro('As senhas não coincidem.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/login/register', form)
      navigate('/login')
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Erro ao cadastrar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">XColor</h1>
        <h2 className="auth-subtitle">Criar conta</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Usuário</label>
          <input name="usuario" value={form.usuario} onChange={handleChange} placeholder="nome_de_usuario" required />

          <div className="auth-row">
            <div>
              <label>Nome</label>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="João" required />
            </div>
            <div>
              <label>Sobrenome</label>
              <input name="sobrenome" value={form.sobrenome} onChange={handleChange} placeholder="Silva" required />
            </div>
          </div>

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />

          <label>Senha</label>
          <input type="password" name="senha" value={form.senha} onChange={handleChange} placeholder="••••••••" required />

          <label>Confirmar senha</label>
          <input type="password" name="confimaSenha" value={form.confimaSenha} onChange={handleChange} placeholder="••••••••" required />

          {erro && <p className="auth-erro">{erro}</p>}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="auth-link">
          Já tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

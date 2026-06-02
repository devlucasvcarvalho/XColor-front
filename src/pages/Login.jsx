import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/login/login', form)
      localStorage.setItem('token', data.dados?.token ?? data.token ?? '')
      navigate('/usuarios')
    } catch (err) {
      setErro(err.response?.data?.mensagem ?? 'Erro ao fazer login.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">XColor</h1>
        <h2 className="auth-subtitle">Entrar</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="seu@email.com"
            required
          />
          <label>Senha</label>
          <input
            type="password"
            name="senha"
            value={form.senha}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
          {erro && <p className="auth-erro">{erro}</p>}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-link">
          <Link to="/">← Ver produtos</Link> &nbsp;·&nbsp; Não tem conta? <Link to="/cadastro">Cadastrar</Link>
        </p>
      </div>
    </div>
  )
}

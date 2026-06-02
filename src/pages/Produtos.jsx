import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import './Produtos.css'

const CATEGORIAS = [
  'Tinta Imobiliária',
  'Tinta Automotiva',
  'Verniz e Esmalte',
  'Massa e Textura',
  'Impermeabilizante',
  'Primer e Selador',
  'Solvente e Thinner',
  'Pincel e Rolo',
  'Fita e Proteção',
  'Acessórios',
]

const formVazio = {
  nome: '',
  descricao: '',
  categoria: '',
  marca: '',
  preco: '',
  estoque: '',
  imagem: '',
  imagem2: '',
  imagem3: '',
}

export default function Produtos() {
  const navigate = useNavigate()
  const [produtos, setProdutos] = useState([])
  const [modal, setModal] = useState(null) // null | 'criar' | objeto produto
  const [form, setForm] = useState(formVazio)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/'); return }
    carregar()
  }, [])

  async function carregar() {
    setLoading(true)
    try {
      const { data } = await api.get('/api/produto')
      setProdutos(data.dados ?? data)
    } catch {
      setErro('Erro ao carregar produtos.')
    } finally {
      setLoading(false)
    }
  }

  function abrirCriar() {
    setForm(formVazio)
    setErro('')
    setModal('criar')
  }

  function abrirEditar(p) {
    setForm({
      nome: p.nome,
      descricao: p.descricao,
      categoria: p.categoria,
      marca: p.marca,
      preco: p.preco,
      estoque: p.estoque,
      imagem: p.imagem ?? '',
      imagem2: p.imagem2 ?? '',
      imagem3: p.imagem3 ?? '',
    })
    setErro('')
    setModal(p)
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function salvar(e) {
    e.preventDefault()
    setErro('')
    const payload = { ...form, preco: parseFloat(form.preco), estoque: parseInt(form.estoque) }
    try {
      if (modal === 'criar') {
        await api.post('/api/produto', payload)
      } else {
        await api.put('/api/produto', { ...payload, id: modal.id })
      }
      setModal(null)
      carregar()
    } catch {
      setErro('Erro ao salvar produto.')
    }
  }

  async function remover(id) {
    if (!confirm('Remover este produto?')) return
    try {
      await api.delete('/api/produto', { params: { id } })
      setProdutos(produtos.filter(p => p.id !== id))
    } catch {
      setErro('Erro ao remover produto.')
    }
  }

  function sair() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase()) ||
    p.marca.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="prod-container">
      <header className="prod-header">
        <h1>XColor — Produtos</h1>
        <nav className="prod-nav">
          <Link to="/usuarios">Usuários</Link>
          <button onClick={sair} className="btn-sair">Sair</button>
        </nav>
      </header>

      <div className="prod-toolbar">
        <input
          className="prod-busca"
          placeholder="Buscar por nome, categoria ou marca..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        <button className="btn-novo" onClick={abrirCriar}>+ Novo Produto</button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      {loading ? (
        <p className="loading">Carregando...</p>
      ) : (
        <div className="tabela-wrapper"><table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Categoria</th>
              <th>Marca</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <span className="prod-nome">{p.nome}</span>
                  {p.descricao && <span className="prod-desc">{p.descricao}</span>}
                </td>
                <td><span className="badge">{p.categoria}</span></td>
                <td>{p.marca}</td>
                <td className="preco">R$ {Number(p.preco).toFixed(2).replace('.', ',')}</td>
                <td className={p.estoque <= 5 ? 'estoque-baixo' : ''}>{p.estoque}</td>
                <td className="acoes">
                  <button className="btn-editar" onClick={() => abrirEditar(p)}>Editar</button>
                  <button className="btn-remover" onClick={() => remover(p.id)}>Remover</button>
                </td>
              </tr>
            ))}
            {produtosFiltrados.length === 0 && (
              <tr><td colSpan={7} className="vazio">Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table></div>
      )}

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{modal === 'criar' ? 'Novo Produto' : 'Editar Produto'}</h2>
            <form onSubmit={salvar} className="modal-form">
              <div className="modal-row">
                <div>
                  <label>Nome *</label>
                  <input name="nome" value={form.nome} onChange={handleChange} required />
                </div>
                <div>
                  <label>Marca</label>
                  <input name="marca" value={form.marca} onChange={handleChange} />
                </div>
              </div>

              <label>Categoria *</label>
              <select name="categoria" value={form.categoria} onChange={handleChange} required>
                <option value="">Selecione...</option>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label>Descrição</label>
              <input name="descricao" value={form.descricao} onChange={handleChange} placeholder="Ex: Tinta acrílica fosca 18L" />

              <div className="modal-row">
                <div>
                  <label>Preço (R$) *</label>
                  <input type="number" step="0.01" min="0.01" name="preco" value={form.preco} onChange={handleChange} required />
                </div>
                <div>
                  <label>Estoque</label>
                  <input type="number" min="0" name="estoque" value={form.estoque} onChange={handleChange} />
                </div>
              </div>

              <label>Foto 1 (URL)</label>
              <input name="imagem" value={form.imagem} onChange={handleChange} placeholder="https://..." />
              {form.imagem && <img src={form.imagem} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', marginTop: '0.25rem' }} />}

              <label>Foto 2 (URL)</label>
              <input name="imagem2" value={form.imagem2} onChange={handleChange} placeholder="https://..." />
              {form.imagem2 && <img src={form.imagem2} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', marginTop: '0.25rem' }} />}

              <label>Foto 3 (URL)</label>
              <input name="imagem3" value={form.imagem3} onChange={handleChange} placeholder="https://..." />
              {form.imagem3 && <img src={form.imagem3} alt="" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', marginTop: '0.25rem' }} />}

              {erro && <p className="form-erro">{erro}</p>}

              <div className="modal-acoes">
                <button type="button" className="btn-cancelar" onClick={() => setModal(null)}>Cancelar</button>
                <button type="submit" className="btn-salvar">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

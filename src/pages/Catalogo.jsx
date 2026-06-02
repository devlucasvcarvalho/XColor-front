import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useCarrinho } from '../context/CarrinhoContext'
import Carrinho from '../components/Carrinho'
import './Catalogo.css'

const CATEGORIAS = [
  'Todas',
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

export default function Catalogo() {
  const [produtos, setProdutos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [selecionado, setSelecionado] = useState(null)
  const [fotoIdx, setFotoIdx] = useState(0)
  const [qtd, setQtd] = useState(1)
  const [adicionado, setAdicionado] = useState(false)
  const { adicionar } = useCarrinho()

  const abrirProduto = useCallback((p) => {
    setSelecionado(p)
    setFotoIdx(0)
    setQtd(1)
    setAdicionado(false)
  }, [])

  function handleAdicionar() {
    adicionar(selecionado, qtd)
    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  useEffect(() => {
    api.get('/api/produto').then(({ data }) => {
      setProdutos(data.dados ?? data)
    }).finally(() => setLoading(false))
  }, [])

  const filtrados = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.marca.toLowerCase().includes(busca.toLowerCase())
    const matchCat = categoria === 'Todas' || p.categoria === categoria
    return matchBusca && matchCat
  })

  return (
    <div className="cat-page">

      <header className="cat-header">
        <div className="cat-header-inner">
          <div className="cat-logo">
            <span className="cat-logo-x">X</span>Color
          </div>
          <p className="cat-tagline">Tintas, vernizes e muito mais para sua obra</p>
          <Link to="/login" className="cat-admin-link">Área admin</Link>
        </div>
      </header>

      <section className="cat-hero">
        <div className="cat-search-wrap">
          <input
            className="cat-search"
            placeholder="Buscar produto ou marca..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div className="cat-cats">
          {CATEGORIAS.map(c => (
            <button
              key={c}
              className={`cat-cat-btn ${categoria === c ? 'ativo' : ''}`}
              onClick={() => setCategoria(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <main className="cat-main">
        {loading ? (
          <p className="cat-loading">Carregando produtos...</p>
        ) : filtrados.length === 0 ? (
          <p className="cat-vazio">Nenhum produto encontrado.</p>
        ) : (
          <div className="cat-grid">
            {filtrados.map(p => (
              <div key={p.id} className="cat-card" onClick={() => abrirProduto(p)}>
                <div className="cat-card-img-wrap">
                  {p.imagem
                    ? <img src={p.imagem} alt={p.nome} className="cat-card-img" />
                    : <div className="cat-card-img-placeholder">📦</div>
                  }
                </div>
                <div className="cat-card-categoria">{p.categoria}</div>
                <h3 className="cat-card-nome">{p.nome}</h3>
                <p className="cat-card-marca">{p.marca}</p>
                <div className="cat-card-footer">
                  <span className="cat-card-preco">
                    R$ {Number(p.preco).toFixed(2).replace('.', ',')}
                  </span>
                  <span className={`cat-card-estoque ${p.estoque === 0 ? 'zerado' : p.estoque <= 5 ? 'baixo' : ''}`}>
                    {p.estoque === 0 ? 'Sem estoque' : p.estoque <= 5 ? `Últimas ${p.estoque}` : `${p.estoque} un.`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="cat-footer">
        <p>© {new Date().getFullYear()} XColor — Materiais de Construção e Pintura</p>
      </footer>

      {/* Modal de detalhe */}
      {selecionado && (
        <div className="det-overlay" onClick={() => setSelecionado(null)}>
          <div className="det-modal" onClick={e => e.stopPropagation()}>

            <button className="det-fechar" onClick={() => setSelecionado(null)}>✕</button>

            {(() => {
              const fotos = [selecionado.imagem, selecionado.imagem2, selecionado.imagem3].filter(Boolean)
              if (!fotos.length) return null
              return (
                <div className="det-carousel">
                  <div className="det-carousel-main">
                    <img src={fotos[fotoIdx]} alt={selecionado.nome} className="det-img" />
                    {fotos.length > 1 && (
                      <>
                        <button className="det-arrow det-arrow-left" onClick={() => setFotoIdx((fotoIdx - 1 + fotos.length) % fotos.length)}>‹</button>
                        <button className="det-arrow det-arrow-right" onClick={() => setFotoIdx((fotoIdx + 1) % fotos.length)}>›</button>
                      </>
                    )}
                  </div>
                  {fotos.length > 1 && (
                    <div className="det-thumbs">
                      {fotos.map((f, i) => (
                        <img
                          key={i}
                          src={f}
                          alt=""
                          className={`det-thumb ${i === fotoIdx ? 'ativo' : ''}`}
                          onClick={() => setFotoIdx(i)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })()}

            <span className="det-categoria">{selecionado.categoria}</span>
            <h2 className="det-nome">{selecionado.nome}</h2>
            <p className="det-marca">por <strong>{selecionado.marca}</strong></p>

            {selecionado.descricao && (
              <p className="det-descricao">{selecionado.descricao}</p>
            )}

            <div className="det-divider" />

            <div className="det-info-grid">
              <div className="det-info-item">
                <span className="det-info-label">Preço</span>
                <span className="det-info-valor preco">
                  R$ {Number(selecionado.preco).toFixed(2).replace('.', ',')}
                </span>
              </div>
              <div className="det-info-item">
                <span className="det-info-label">Disponibilidade</span>
                <span className={`det-info-valor ${selecionado.estoque === 0 ? 'zerado' : selecionado.estoque <= 5 ? 'baixo' : 'ok'}`}>
                  {selecionado.estoque === 0
                    ? 'Sem estoque'
                    : selecionado.estoque <= 5
                    ? `Últimas ${selecionado.estoque} unidades`
                    : `${selecionado.estoque} unidades em estoque`}
                </span>
              </div>
            </div>

            {selecionado.estoque > 0 ? (
              <div className="det-compra">
                <div className="det-qty">
                  <button onClick={() => setQtd(q => Math.max(1, q - 1))}>−</button>
                  <span>{qtd}</span>
                  <button onClick={() => setQtd(q => Math.min(selecionado.estoque, q + 1))}>+</button>
                </div>
                <button
                  className={`det-add-btn ${adicionado ? 'adicionado' : ''}`}
                  onClick={handleAdicionar}
                >
                  {adicionado ? '✓ Adicionado!' : 'Adicionar ao carrinho'}
                </button>
              </div>
            ) : (
              <p className="det-sem-estoque">Produto fora de estoque</p>
            )}

          </div>
        </div>
      )}

      <Carrinho />

    </div>
  )
}

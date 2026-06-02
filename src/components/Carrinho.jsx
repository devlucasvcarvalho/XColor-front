import { useState } from 'react'
import { useCarrinho } from '../context/CarrinhoContext'
import './Carrinho.css'

export default function Carrinho() {
  const { itens, total, totalItens, remover, alterarQuantidade, limpar } = useCarrinho()
  const [aberto, setAberto] = useState(false)
  const [finalizado, setFinalizado] = useState(false)

  function finalizar() {
    limpar()
    setFinalizado(true)
    setTimeout(() => { setFinalizado(false); setAberto(false) }, 3000)
  }

  return (
    <>
      {/* Botão flutuante do carrinho */}
      <button className="carr-btn" onClick={() => setAberto(true)}>
        🛒
        {totalItens > 0 && <span className="carr-badge">{totalItens}</span>}
      </button>

      {/* Overlay */}
      {aberto && <div className="carr-overlay" onClick={() => setAberto(false)} />}

      {/* Gaveta lateral */}
      <aside className={`carr-drawer ${aberto ? 'aberto' : ''}`}>
        <div className="carr-header">
          <h2>Carrinho</h2>
          <button className="carr-fechar" onClick={() => setAberto(false)}>✕</button>
        </div>

        {finalizado ? (
          <div className="carr-sucesso">
            <span className="carr-sucesso-icon">✓</span>
            <p>Pedido realizado!</p>
            <p className="carr-sucesso-sub">Em breve entraremos em contato.</p>
          </div>
        ) : itens.length === 0 ? (
          <div className="carr-vazio">
            <span>🛒</span>
            <p>Seu carrinho está vazio</p>
          </div>
        ) : (
          <>
            <div className="carr-itens">
              {itens.map(item => (
                <div key={item.id} className="carr-item">
                  {item.imagem && (
                    <img src={item.imagem} alt={item.nome} className="carr-item-img" />
                  )}
                  <div className="carr-item-info">
                    <p className="carr-item-nome">{item.nome}</p>
                    <p className="carr-item-marca">{item.marca}</p>
                    <p className="carr-item-preco">
                      R$ {Number(item.preco).toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                  <div className="carr-item-acoes">
                    <div className="carr-qty">
                      <button onClick={() => alterarQuantidade(item.id, item.quantidade - 1)}>−</button>
                      <span>{item.quantidade}</span>
                      <button
                        onClick={() => alterarQuantidade(item.id, item.quantidade + 1)}
                        disabled={item.quantidade >= item.estoque}
                      >+</button>
                    </div>
                    <button className="carr-remover" onClick={() => remover(item.id)}>🗑</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="carr-footer">
              <div className="carr-total">
                <span>Total</span>
                <strong>R$ {total.toFixed(2).replace('.', ',')}</strong>
              </div>
              <button className="carr-finalizar" onClick={finalizar}>
                Finalizar pedido
              </button>
              <button className="carr-limpar" onClick={limpar}>
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

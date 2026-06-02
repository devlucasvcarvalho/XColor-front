import { createContext, useContext, useState } from 'react'

const CarrinhoContext = createContext()

export function CarrinhoProvider({ children }) {
  const [itens, setItens] = useState([])

  function adicionar(produto, quantidade) {
    setItens(prev => {
      const existe = prev.find(i => i.id === produto.id)
      if (existe) {
        return prev.map(i =>
          i.id === produto.id
            ? { ...i, quantidade: Math.min(i.quantidade + quantidade, produto.estoque) }
            : i
        )
      }
      return [...prev, { ...produto, quantidade }]
    })
  }

  function remover(id) {
    setItens(prev => prev.filter(i => i.id !== id))
  }

  function alterarQuantidade(id, quantidade) {
    if (quantidade <= 0) { remover(id); return }
    setItens(prev => prev.map(i => i.id === id ? { ...i, quantidade } : i))
  }

  function limpar() { setItens([]) }

  const total = itens.reduce((acc, i) => acc + i.preco * i.quantidade, 0)
  const totalItens = itens.reduce((acc, i) => acc + i.quantidade, 0)

  return (
    <CarrinhoContext.Provider value={{ itens, total, totalItens, adicionar, remover, alterarQuantidade, limpar }}>
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  return useContext(CarrinhoContext)
}

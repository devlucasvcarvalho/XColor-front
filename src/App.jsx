import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CarrinhoProvider } from './context/CarrinhoContext'
import Catalogo from './pages/Catalogo'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Usuarios from './pages/Usuarios'
import Produtos from './pages/Produtos'

function App() {
  return (
    <CarrinhoProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/produtos" element={<Produtos />} />
        </Routes>
      </BrowserRouter>
    </CarrinhoProvider>
  )
}

export default App

import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// 👇 تعريف global عشان react-image-lightbox يشتغل على Vite
if (!window.global) {
  window.global = window
}

ReactDOM.render(
  <StrictMode>
    <BrowserRouter basename='/Hamza'>
      <App />
    </BrowserRouter>
  </StrictMode>,
  document.getElementById('root')
)

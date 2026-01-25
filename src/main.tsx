import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { WorkflowPage } from './pages/WorkflowPage'
import { SubmitPage } from './pages/SubmitPage'
import { CategoryPage } from './pages/CategoryPage'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/workflow/:slug" element={<WorkflowPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

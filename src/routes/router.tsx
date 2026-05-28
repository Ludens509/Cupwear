import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from '../App'
import About from '../screens/About'
import NotFoundPage from '../screens/NotFoundPage'
import { TransitionProvider } from '../contexts'

const AppRouter = () => (
  <BrowserRouter>
    <TransitionProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </TransitionProvider>
  </BrowserRouter>
)

export default AppRouter

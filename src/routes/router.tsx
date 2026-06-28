import { BrowserRouter, Route, Routes } from 'react-router-dom'
import About from '../screens/About'
import NotFoundPage from '../screens/NotFoundPage'
import { TransitionProvider } from '../contexts'
import Home from '../App'
import Shop from '../components/App';

const AppRouter = () => {

  return (
    <BrowserRouter>
      <TransitionProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </TransitionProvider>
    </BrowserRouter>
  )
}

export default AppRouter

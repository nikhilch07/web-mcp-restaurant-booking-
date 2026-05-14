import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import RestaurantPage from './pages/RestaurantPage';
import BookPage from './pages/BookPage';
import ConfirmPage from './pages/ConfirmPage';
import Inspector from './components/Inspector';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/restaurant/:id" element={<RestaurantPage />} />
          <Route path="/book" element={<BookPage />} />
          <Route path="/confirm" element={<ConfirmPage />} />
        </Routes>
        <Inspector />
      </div>
    </BrowserRouter>
  );
}
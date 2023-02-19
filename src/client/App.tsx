import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import SpotifyAuth from './components/SpotifyAuth';
import SpotifyAuthRedirect from './components/SpotifyAuthRedirect';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SpotifyAuth />} />
          <Route path="/auth/:redirect?" element={<SpotifyAuthRedirect />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

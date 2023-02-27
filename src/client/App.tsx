import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import useSwr from 'swr';
import fetcher from './utils/fetcher';
import NavBar from './components/Navbar/NavBar';

interface ISpotifyMe {
  access_token: string;
  iat: number;
  exp: number;
}

function App() {
  const [user, setUser] = useState<string | undefined>('');
  const [spotifyUser, setSpotifyUser] = useState<string | null>(null);

  const { data } = useSwr<string>(
    `${process.env.API_BASE_URL}/user/me`,
    fetcher
  );

  const spotifyData = useSwr<ISpotifyMe>(
    `${process.env.API_BASE_URL}/oAuth/spotify/me`,
    fetcher
  );

  useEffect(() => {
    if (data) setUser(data);
    if (spotifyData.data) setSpotifyUser(spotifyData.data.access_token);
  }, [data, spotifyData]);

  return (
    <main>
      <BrowserRouter>
        <NavBar user={user} />
        <Routes>
          <Route
            path="/"
            element={<Dashboard user={user} spotifyUser={spotifyUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;

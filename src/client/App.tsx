import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Register from './components/Register';
import SpotifyAuth from './components/SpotifyAuth';
import useSwr from 'swr';
import fetcher from './utils/fetcher';
import NavBar from './components/Navbar/NavBar';

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  _v: number;
  session: string;
  iat: number;
  exp: number;
}

interface ISpotifyMe {
  access_token: string;
  iat: number;
  exp: number;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [spotifyUser, setSpotifyUser] = useState<string | null>(null);

  const { data } = useSwr<User>(`${process.env.API_BASE_URL}/user/me`, fetcher);

  const spotifyData = useSwr<ISpotifyMe>(
    `${process.env.API_BASE_URL}/oAuth/spotify/me`,
    fetcher
  );

  useEffect(() => {
    if (data?.name) setUser(data);
    if (spotifyData.data) setSpotifyUser(spotifyData.data.access_token);
  }, [data, spotifyData]);

  if (user) console.log(user);
  return (
    <div>
      <BrowserRouter>
        <NavBar user={data?.name} />
        <Routes>
          <Route
            path="/"
            element={<Dashboard user={data?.name} spotifyUser={spotifyUser} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

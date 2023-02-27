import { redirect } from 'react-router-dom';
import { useEffect } from 'react';
import SpotifyAuth from './SpotifyAuth';
import axios from 'axios';

interface IDashBoardProps {
  user: string | undefined;
  spotifyUser: string | null;
}

function Dashboard({ user, spotifyUser }: IDashBoardProps) {
  useEffect(() => {
    if (!user) redirect('/login');
  }, [user]);

  if (!spotifyUser) return <SpotifyAuth />;

  axios
    .get(`${process.env.API_BASE_URL}/spotify/user`, {
      withCredentials: true,
    })
    .then((res) => console.log('res', res.data))
    .catch((e) => console.log(e));

  return <section>hi there</section>;
}

export default Dashboard;

import { redirect } from 'react-router-dom';
import { useEffect } from 'react';
import SpotifyAuth from './SpotifyAuth';

interface IDashBoardProps {
  user: string | undefined;
  spotifyUser: string | null;
}

function Dashboard({ user, spotifyUser }: IDashBoardProps) {
  useEffect(() => {
    if (!user) redirect('/login');
  }, [user]);

  if (!spotifyUser) return <SpotifyAuth />;

  console.log(spotifyUser);
  return <section>hi there</section>;
}

export default Dashboard;

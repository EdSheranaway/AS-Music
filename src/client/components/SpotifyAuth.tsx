import logo from '../assets/SLogo.svg';
import { useEffect, useState } from 'react';
import { accessToken, logout, getCurrentUserProfile } from '../utils/Spotify';
import { Link } from 'react-router-dom';

function SpotifyAuth(): JSX.Element {
  const [token, setToken] = useState<string | null | undefined>(null);
  const [profile, setProfile] = useState<object | null>(null);
  useEffect(() => {
    setToken(accessToken);
    getCurrentUserProfile()
      .then((data) => setProfile(data))
      .catch((e) => console.error(e));
  }, []);
  if (profile) console.log(profile);
  return (
    <div
      className="app"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <img src={logo.toString()} alt="Spotify Logo" />
      {!token ? (
        <a className="App-link" href="http://localhost:3000/auth/spotify">
          Log in to Spotify
        </a>
      ) : (
        <>
          <h1>Logged in!</h1>
          <Link to={'/dashboard'} state={{ token }}>
            Go to Dashboard
          </Link>
          <button onClick={logout}>Log Out</button>
        </>
      )}
    </div>
  );
}

export default SpotifyAuth;

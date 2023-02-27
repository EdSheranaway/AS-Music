/* eslint-disable @typescript-eslint/no-unsafe-argument */
import logo from '../assets/SLogo.svg';
// import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import axios from 'axios';

function SpotifyAuth(): JSX.Element {
  const token = false;
  // const [token, setToken] = useState<string | null | undefined>(null);
  // const [profile, setProfile] = useState<object | null>(null);
  // useEffect(() => {
  //   setToken(accessToken);
  //   axios
  //     .get('/me', {
  //       headers: {
  //         Authorization: `Bearer ${accessToken as string}`,
  //         'Content-Type': 'application/json',
  //       },
  //     })
  //     .then((data) => {
  //       setProfile(data.data);
  //     })
  //     .catch((e) => console.error(e));
  // }, []);
  // if (profile) console.log('me:', profile);
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
        <a className="App-link" href="http://localhost:3000/api/oAuth/spotify">
          Log in to Spotify
        </a>
      ) : (
        <>
          <h1>Logged in!</h1>
          <Link to={'/dashboard'} state={{ token }}>
            Go to Dashboard
          </Link>
        </>
      )}
    </div>
  );
}

export default SpotifyAuth;

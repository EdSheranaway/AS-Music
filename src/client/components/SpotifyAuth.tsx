import logo from '../assets/SLogo.svg';
import { useEffect } from 'react';

function SpotifyAuth(): JSX.Element {
  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const accessToken = urlParams.get('access_token');
    const refreshToken = urlParams.get('refresh_token');

    console.log(accessToken);
    console.log(refreshToken);
    if (refreshToken) {
      fetch(`/refresh_token?refresh_token=${refreshToken}`)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.error(err));
    }
  }, []);
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
      {/* <button onClick={() => login()}>Log in to Spotify</button> */}
      <a href="http://localhost:3000/auth/spotify">click me</a>
    </div>
  );
}

export default SpotifyAuth;

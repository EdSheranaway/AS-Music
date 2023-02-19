import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
import { makeId, getRandomInt } from '../utils/sOauth';
// import { redirect } from 'react-router-dom';

function SpotifyAuth(): JSX.Element {
  const id = process.env.SPOTIFY_CID;

  const initLogin = () => {
    const codeVerifier: string = makeId(getRandomInt(43, 128));
    const hash = sha256(codeVerifier).toString();
    const codeChallenge = Base64.parse(hash).toString();
    const state = makeId(12);

    sessionStorage.setItem('spotify-code-verifier', codeVerifier);
    sessionStorage.setItem('spotify-state', state);

    const authURL = `https://accounts.spotify.com/authorize?response_type=code&client_id=${
      id as string
    }&redirect_uri=http://localhost:8080/auth/scope=user-follow-modify&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
    window.open(authURL);
    // redirect('/auth');
  };

  return (
    <div className="app">
      <button onClick={initLogin}>Log in to Spotify</button>
    </div>
  );
}

export default SpotifyAuth;

import { useState, useEffect } from 'react';
import { redirect, Link } from 'react-router-dom';
import axios from 'axios';

function SpotifyAuthRedirect() {
  const [isRedirected, setIsRedirected] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    console.log('hi');
    const getParams = function (url: string) {
      const params: { [key: string]: string } = {};
      const parser = document.createElement('a');
      parser.href = url;
      const query = parser.search.substring(1);
      const vars = query.split('&');
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
      }
      return params;
    };
    const params = getParams(window.location.href);
    const code = params.code;
    const state = params.state;

    if (state !== sessionStorage.getItem('spotify-state')) {
      console.log('state not found');
      setError(true);
      return undefined;
    }

    const postBody = {
      client_id: process.env.SPOTIFY_CID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:8080/auth/',
      code_verifier: sessionStorage.getItem('spotify-code-verifier'),
    };

    console.log('postBody', postBody);

    axios
      .post('https://accounts.spotify.com/api/token', postBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;' },
      })
      .then((res) => {
        console.log(res);
        /**
         *TODO send back to server to store in db if I want
         */
        setIsRedirected(true);
      })
      .catch((e) => {
        console.log(e);
        setError(true);
      });
    return () => sessionStorage.clear();
  }, []);
  return (
    <>
      <h1>hello Auth</h1>
      {!isRedirected && !error && <h3>Authenticating...</h3>}{' '}
      {isRedirected && redirect('/dashboard')}
      {error && (
        <h3>
          There was an error authenticating with Spotify{' '}
          <Link to="/">Click here to try again</Link>
        </h3>
      )}
    </>
  );
}

export default SpotifyAuthRedirect;

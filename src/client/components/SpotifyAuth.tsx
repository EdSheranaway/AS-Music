import logo from '../assets/SLogo.svg';

function SpotifyAuth(): JSX.Element {
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
      <button>Log in to Spotify</button>
    </div>
  );
}

export default SpotifyAuth;

import { useLocation } from 'react-router-dom';
type LocationState = {
  state: {
    token: string;
  };
};
function Dashboard() {
  const location: LocationState = useLocation();
  const { token } = location.state;
  if (token) console.log('token', token);

  return <div>Dashboard</div>;
}

export default Dashboard;

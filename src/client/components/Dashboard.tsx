import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

interface IDashBoardProps {
  user: string | undefined;
}

function Dashboard({ user }: IDashBoardProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return <div>hi there {user}</div>;
}

export default Dashboard;

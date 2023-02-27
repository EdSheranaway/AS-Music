import { redirect } from 'react-router-dom';
import { useEffect } from 'react';

interface IDashBoardProps {
  user: string | undefined;
}

function Dashboard({ user }: IDashBoardProps) {
  useEffect(() => {
    if (!user) redirect('/login');
  }, [user]);

  return <div>hi there {user}</div>;
}

export default Dashboard;

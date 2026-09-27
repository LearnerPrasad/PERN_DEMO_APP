import './App.css'
import { useState } from 'react';
import Routes from './Components/Routes/routes';
import UserForm from './Components/userForm';

type User = {
  id: number;
  name: string;
  email: string;
  city: string;
}

function App() {
  const [createdUsers, setCreatedUsers] = useState<User[]>([]);

  const handleUserCreated = (user: User) => {
    setCreatedUsers(currentUsers => [...currentUsers, user]);
  };

  return (
    <>
      <h1>Test</h1>
      <UserForm onUserCreated={handleUserCreated} />
      <Routes createdUsers={createdUsers} />
    </>
  )
}

export default App

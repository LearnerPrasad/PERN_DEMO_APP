import './App.css'
import { useState } from 'react';
import Routes from './Components/Routes/routes';
import UserForm from './Components/UserForm';

type User = {
  id: number;
  name: string;
  email: string;
  city: string;
}

function App() {
  const [createdUsers, setCreatedUsers] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);

  const handleUserCreated = (user: User) => {
    setCreatedUsers(currentUsers => [...currentUsers, user]);
  };

  const handleEditUser = (editUser: User) => {
    setEditUser(editUser);
  }
  const handleUserUpdated = (user: User) => {
    setCreatedUsers(currentUser =>
      currentUser.map(item => {
        if (user.id === item.id) {
          return user
        }
        return item;
      }));
      setEditUser(null);
  }

  return (
    <>
      <h1>Test</h1>
      <UserForm
        key={editUser ? editUser.id : 'new-user'}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
        editUser={editUser}
      />
      <Routes createdUsers={createdUsers} onEditUser={handleEditUser} />
    </>
  )
}

export default App

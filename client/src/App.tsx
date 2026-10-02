import './App.css'
import { useState, useEffect } from 'react';
import UserList from './Components/UserList';
import UserForm from './Components/UserForm';

type User = {
  id: number;
  name: string;
  email: string;
  city: string;
}

function App() {
  const [userData, setUserData] = useState<User[]>([])
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const handleUserCreated = (user: User) => {
    //just append to userData on creation
    setUserData((prevUserData) => [...prevUserData, user])
  };

  const handleEditUser = (editUser: User) => {
    setEditUser(editUser);
  }
  const handleUserUpdated = (user: User) => {
    //i want to update updated user in userData
    setUserData((prev) => {
      return prev.map(item => {
        if (item.id === user.id) {
          return user
        }
        return item;
      })
    })
    setEditUser(null)
  }

  const handleDeleteUser = (user: User) => {
    setUserData((prevUser) => {
      return prevUser.filter(item => {
        if (item.id !== user.id) {
          return item;
        }
      })
    })
  }

  const handleError = (message: string) => {
    setError(message)
  }

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  }

  //Read data and populate to child as needed

  useEffect(() => {
    fetch('http://localhost:3000/getUserData')
      .then(response => {
        if (!response.ok) {
          return response.text().then(message => {
            throw new Error(message || `Failed to load users (${response.status})`);
          });
        }
        return response.json();
      })
      .then(data => setUserData(data))
      .catch(error => setError(error instanceof Error ? error.message : 'Failed to load users'))
      .finally(() => setIsLoading(false))

  }, [])

  return (
    <>
      <h1>Test</h1>
      <UserForm
        key={editUser ? editUser.id : 'new-user'}
        onUserCreated={handleUserCreated}
        onUserUpdated={handleUserUpdated}
        editUser={editUser}
        onError={handleError}
        isLoading={isLoading}
        onLoadingChange={handleLoadingChange}
      />
      {isLoading ? (
        <p role="status">Loading...</p>
      ) : (
        <UserList
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          result={userData}
          error={error}
          onError={handleError}
          isLoading={isLoading}
          onLoadingChange={handleLoadingChange}
        />
      )}
    </>
  )
}

export default App

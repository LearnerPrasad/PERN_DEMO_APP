import './App.css';
import { useState, useEffect } from 'react';
import UserList from './Components/UserList';
import UserForm from './Components/UserForm';
import UserManagement from './Components/auth/UserManagement';

type User = {
  id: number;
  name: string;
  email: string;
  city: string;
};

function App() {
  const [userData, setUserData] = useState<User[]>([]);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const Authtoken = localStorage.getItem('athzToken');
  const [userLogged, setUserLogged] = useState(!!Authtoken);

  const handleUserCreated = (user: User) => {
    setUserData((prevUserData) => [...prevUserData, user]);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
  };

  const handleUserUpdated = (user: User) => {
    setUserData((prev) =>
      prev.map((item) => (item.id === user.id ? user : item))
    );
    setEditUser(null);
  };

  const handleDeleteUser = (user: User) => {
    setUserData((prevUser) =>
      prevUser.filter((item) => item.id !== user.id)
    );
  };

  const handleError = (message: string) => {
    setError(message);
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  const token = localStorage.getItem('athzToken');


  useEffect(() => {
    if (!userLogged) return;
    fetch('http://localhost:3000/prasad/getUserData', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (response.status === 401) {
          localStorage.removeItem('athzToken');
          setUserLogged(false);
          setUserData([]);
          return null;
        }
        if (!response.ok) {
          return response.text().then((message) => {
            throw new Error(
              message || `Failed to load contacts (${response.status})`
            );
          });
        }

        return response.json();
      })
      .then((data) => {
        if (data !== null) {
          setUserData(data);
        }
        setUserData(data)
      })
      .catch((error) =>
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load contacts'
        )
      )
      .finally(() => setIsLoading(false));
  }, [userLogged]);

  const handleLogout = () => {
    localStorage.removeItem('athzToken');
    setUserLogged(false);
    setUserData([]);
    setEditUser(null);
    setError('');
    setIsProfileOpen(false);
  };

  return (
    <>
      {!userLogged ? (
        <UserManagement login={setUserLogged} />
      ) : (
        <div className="app-container">
          <div className="nav-container">
            <header className="navbar">
              <h1 className="app-title">Contact Management</h1>

              <div className="profile-area">
                <button
                  type="button"
                  className="profile-button"
                  aria-label="Profile menu"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                >
                  <span className="profile-avatar">P</span>
                  <span className="profile-label">My Profile</span>
                  <span className="profile-chevron">
                    {isProfileOpen ? '⌃' : '⌄'}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="profile-dropdown">
                    <button
                      type="button"
                      className="profile-menu-item"
                      onClick={() => {
                        // Add your profile display functionality here.
                        setIsProfileOpen(false);
                      }}
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      className="profile-menu-item logout-menu-item"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </header>
          </div>

          <main className="dashboard">
            <section className="contact-form-panel">
              <h2 className="panel-title">
                {editUser ? 'Edit Contact' : 'Add Contact'}
              </h2>

              <UserForm
                key={editUser ? editUser.id : 'new-user'}
                onUserCreated={handleUserCreated}
                onUserUpdated={handleUserUpdated}
                editUser={editUser}
                onError={handleError}
                isLoading={isLoading}
                onLoadingChange={handleLoadingChange}
              />
            </section>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <section className="contact-table-panel">
              <div className="table-heading">
                <div>
                  <h2 className="panel-title">Your Contacts</h2>
                  <p className="panel-description">
                    Manage your saved contacts in one place.
                  </p>
                </div>

                <span className="contact-count">
                  {userData?.length}{' '}
                  {userData?.length === 1 ? 'contact' : 'contacts'}
                </span>
              </div>

              {isLoading ? (
                <p className="table-message" role="status">
                  Loading contacts...
                </p>
              ) : (
                <div className="table-scroll">
                  <UserList
                    onEditUser={handleEditUser}
                    onDeleteUser={handleDeleteUser}
                    result={userData}
                    error={error}
                    onError={handleError}
                    isLoading={isLoading}
                    onLoadingChange={handleLoadingChange}
                  />
                </div>
              )}
            </section>
          </main>
        </div>
      )}
    </>
  );
}

export default App;

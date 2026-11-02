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
  const [sortOption, setSortOption] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const Authtoken = localStorage.getItem('athzToken');
  const [userLogged, setUserLogged] = useState(!!Authtoken);

  const handleUserCreated = (user: User) => {
    setUserData((prevUserData) => [...prevUserData, user]);
  };
  const pageLimit = 5;
  const [totalRecords, setTotalRecords] = useState(0);
  const totalPages = Math.ceil(totalRecords / pageLimit);
  const [currentPage, setCurrentPage] = useState(1);
  const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
  const endPage = Math.min(startPage + 9, totalPages);

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
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set('searchTerm', searchTerm.trim());
    }

    if (sortOption) {
      params.set('sortOption', sortOption);
    }
    params.set('limit', String(pageLimit));

    params.set('page',String(currentPage));

    const queryString = params.toString();

    const queryUrl = `http://localhost:3000/prasad/getUserData?${queryString}`;

    fetch(queryUrl, {
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
      .then((d) => {
        if (d !== null) {
          setUserData(d.data);
          setTotalRecords(d.totalRecords);
        }
      })
      .catch((error) =>
        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load contacts'
        )
      )
      .finally(() => setIsLoading(false));

  }, [userLogged, searchTerm, sortOption,currentPage]);

  const handleLogout = () => {
    localStorage.removeItem('athzToken');
    setUserLogged(false);
    setUserData([]);
    setEditUser(null);
    setError('');
    setIsProfileOpen(false);
  };

  const handleFiltering = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
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
                  <h2 className="panel-title">Contacts</h2>

                  <div className="contacts-controls">
                    <div className="search-container">
                      <input
                        type="text"
                        placeholder="Search contacts..."
                        className="search-input"
                        onChange={handleFiltering}
                      />
                      <span className="search-icon">🔎</span>
                    </div>

                    <select
                      className="sort-select"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortOption(e.target.value)}
                    >
                      <option value="" disabled>Sort By ↕</option>
                      <option value="name-asc">Name (A-Z)</option>
                      <option value="name-desc">Name (Z-A)</option>
                      <option value="email-asc">Email (A-Z)</option>
                      <option value="city-asc">City (A-Z)</option>
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                    </select>
                    <button type="button" className="reset-button" onClick={() => {
                      setSortOption('');
                      setSearchTerm('')
                    }}>
                      Reset
                    </button>
                  </div>
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
                <>
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
                  <div className="pagination">
                    <button
                      className="page-btn"
                      disabled={startPage === 1}
                      onClick={() => setCurrentPage(startPage - 10)}
                    >
                      Prev
                    </button>

                    {Array.from({ length: endPage - startPage + 1 }, (_, index) => index + startPage).map((page) => (
                      <button
                        key={page}
                        className={`page-btn ${currentPage === page ? 'active' : ''}`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button className="page-btn" disabled={endPage === totalPages} onClick={() => setCurrentPage(startPage + 10)}>
                      Next
                    </button>
                  </div>
                </>
              )}
            </section>
          </main>
        </div>
      )}
    </>
  );
}

export default App;

type UserTypes = {
  id: number;
  name: string;
  email: string;
  city: string;
};

type RoutesProps = {
  onEditUser: (user: UserTypes) => void;
  onDeleteUser: (user: UserTypes) => void;
  onError: (message: string) => void;
  result: UserTypes[];
  error: string;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
};

export default function UserList({
  onEditUser,
  onDeleteUser,
  result,
  error,
  isLoading,
  onError,
}: RoutesProps) {
  const handleEdit = (user: UserTypes) => {
    onEditUser(user);
  };

  const handleDeleteUser = (user: UserTypes) => {
    onError('');

    fetch(`http://localhost:3000/prasad/deleteUserData/${user.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((body) => {
            throw new Error(
              body.error || `Delete failed: ${response.status}`
            );
          });
        }

        onDeleteUser(user);
      })
      .catch((error) =>
        onError(
          error instanceof Error
            ? error.message
            : 'Failed to delete user'
        )
      );
  };

  if (isLoading) {
    return (
      <div className="table-message" role="status">
        Loading contacts...
      </div>
    );
  }

  if (result.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">♧</div>
        <h3>No contacts yet</h3>
        <p>Add your first contact using the form above.</p>
        {error && <p className="error-text" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="user-list-container">
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}

      <table className="contacts-table">
        <thead>
          <tr>
            <th scope="col">S.No</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">City</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {result.map((user, index) => (
            <tr key={user.id}>
              <td>{index + 1}</td>
              <td className="contact-name-cell">{user.name}</td>
              <td>{user.email}</td>
              <td>{user.city}</td>
              <td>
                <div className="row-actions">
                  <button
                    type="button"
                    className="edit-button"
                    disabled={isLoading}
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    disabled={isLoading}
                    onClick={() => handleDeleteUser(user)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

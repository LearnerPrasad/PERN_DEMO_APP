type UserTypes = {
    id: number;
    name: string;
    email: string;
    city: string;
}

type RoutesProps = {
    onEditUser: (user: UserTypes) => void;
    onDeleteUser: (user: UserTypes) => void
    onError: (message: string) => void
    result: UserTypes[];
    error: string;
    isLoading: boolean;
    onLoadingChange: (loading: boolean) => void;
}

export default function UserList({ onEditUser, onDeleteUser, result, error, onError, isLoading, onLoadingChange }: RoutesProps) {
    const handleEdit = (user: UserTypes) => {
        onEditUser(user);
    }

    const handleDeleteUser = (user: UserTypes) => {
        onError('')
        onLoadingChange(true);
        fetch(`http://localhost:3000/deleteUserData/${user.id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(body => {
                        throw new Error(body.error || `Delete failed: ${response.status}`);
                    });
                }
                onDeleteUser(user)
            })
            .catch(error => onError(error instanceof Error ? error.message : 'Failed to delete user'))
            .finally(() => onLoadingChange(false));
    }

    return (
        <>
            <div>
                <table>
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Name</td>
                            <td>Email</td>
                            <td>city</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            result.map((user, index) => {
                                return (
                                    <tr key={user.id}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.city}</td>
                                        <td><button disabled={isLoading} onClick={() => handleEdit(user)}>Edit</button></td>
                                        <td><button disabled={isLoading} onClick={() => handleDeleteUser(user)}>Delete</button></td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div>
                {error && <p role='alert'>{error}</p>}
            </div>
        </>
    )
}
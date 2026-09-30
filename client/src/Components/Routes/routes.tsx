import { useEffect, useState } from 'react';

type UserTypes = {
    id: number;
    name: string;
    email: string;
    city: string;
}

type RoutesProps = {
    createdUsers: UserTypes[];
    onEditUser: (user: UserTypes) => void;
}

export default function Routes({ createdUsers ,onEditUser}: RoutesProps) {
    const [result, setResult] = useState<UserTypes[]>([]);

    useEffect(() => {
        fetch('http://localhost:3000/db-test')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }
                return response.json();
            })
            .then((data: UserTypes[]) => setResult(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    const users = [...result, ...createdUsers];

    const handleEdit = (user: UserTypes) => {
        onEditUser(user);
    }

    return (
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
                        users.map(user => {
                            return (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.city}</td>
                                    <td><button onClick={() => handleEdit(user)}>Edit</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
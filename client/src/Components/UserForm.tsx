import React, { useState, type ChangeEvent } from 'react';

type formValues = {
    name: string;
    email: string;
    city: string;
}

type CreatedUser = formValues & { id: number };

type UserFormProps = {
    onUserCreated: (user: CreatedUser) => void;
    onUserUpdated: (user: CreatedUser) => void;
    editUser: CreatedUser | null;
    onError: (message: string) => void;
    isLoading: boolean;
    onLoadingChange: (loading: boolean) => void;
}

export default function UserForm({ onUserCreated, editUser, onUserUpdated, onError, isLoading, onLoadingChange }: UserFormProps) {

    const [formValues, setFormValues] = useState<formValues>({
        name: editUser?.name ?? "",
        email: editUser?.email ?? "",
        city: editUser?.city ?? ""
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormValues((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    const hasEmptyFields = Object.values(formValues).some(value => !value.trim());

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        onError('');
        onLoadingChange(true);
        const url = editUser ? 'http://localhost:3000/putUserData' : 'http://localhost:3000/postUserData';
        const method = editUser ? 'PUT' : 'POST';
        const dataToSend = editUser ? { ...formValues, id: editUser.id } : formValues;
        fetch(url, {
            method: method,
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(dataToSend)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(body => {
                        throw new Error(body.error || `Request failed: ${response.status}`);
                    });
                }
                return response.json()
            })
            .then((savedUser: CreatedUser) => {
                if (editUser) onUserUpdated(savedUser);
                else onUserCreated(savedUser);
                setFormValues({ name: '', email: '', city: '' });
            }
            )
            .catch(error => onError(error instanceof Error ? error.message : 'Request failed'))
            .finally(() => onLoadingChange(false));
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='name'>Name</label>
                <input
                    id='name'
                    required
                    name='name'
                    value={formValues.name}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor='email'>Email</label>
                <input
                    id='email'
                    required
                    name='email'
                    value={formValues.email}
                    onChange={handleChange}
                    disabled={isLoading}
                />
            </div>
            <div>
                <label htmlFor='city'>City</label>
                <input
                    id='city'
                    required
                    name='city'
                    value={formValues.city}
                    onChange={handleChange}
                    disabled={isLoading}

                />
            </div>
            <button type='submit' disabled={hasEmptyFields || isLoading}>Submit</button>
        </form>
    )
}
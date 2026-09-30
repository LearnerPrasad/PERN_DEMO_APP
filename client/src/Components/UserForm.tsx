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
}

export default function UserForm({ onUserCreated, editUser, onUserUpdated }: UserFormProps) {

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
                    throw new Error(`Request failed: ${response.status}`);
                }
                return response.json()
            })
            .then((savedUser: CreatedUser) => {
                if (editUser) onUserUpdated(savedUser);
                else onUserCreated(savedUser);

                setFormValues({ name: '', email: '', city: '' });
            }
            )
            .catch(error => console.log("failed while posting data", error))
    }

    // useEffect(() => {
    //     setFormValues(editUser ? {
    //         name: editUser.name,
    //         email:editUser.email,
    //         city: editUser.city
    //     } : {
    //         name: "",
    //         email: "",
    //         city: ""
    //     })

    // }, [editUser])
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='name'>Name</label>
                <input
                    required
                    name='name'
                    value={formValues.name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='email'>Email</label>
                <input
                    required
                    name='email'
                    value={formValues.email}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor='city'>City</label>
                <input
                    required
                    name='city'
                    value={formValues.city}
                    onChange={handleChange}
                />
            </div>
            <button type='submit' disabled={hasEmptyFields}>Submit</button>
        </form>
    )
}
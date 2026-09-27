import React, { useState, type ChangeEvent } from 'react';

type formValues = {
    name: string;
    email: string;
    city: string;
}

type CreatedUser = formValues & { id: number };

type UserFormProps = {
    onUserCreated: (user: CreatedUser) => void;
}

export default function UserForm({ onUserCreated }: UserFormProps) {

    const [formValues, setFormValues] = useState<formValues>({
        name: "",
        email: "",
        city: ""
    })

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
        fetch('http://localhost:3000/postUserData', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(formValues)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Request failed: ${response.status}`);
                }
                return response.json()
            })
            .then((user: CreatedUser) => onUserCreated(user))
            .catch(error => console.log("failed while posting data", error))
    }
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
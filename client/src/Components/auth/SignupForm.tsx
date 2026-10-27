import { useState } from 'react';

type SignupFormData = {
    name: string,
    email: string,
    password: string
}
type Props = {
    onSwitchTab: (tab: string) => void
}
export default function SignupForm({ onSwitchTab }: Props) {

    const [formData, setFormData] = useState<SignupFormData>({
        name: '',
        email: '',
        password: ''
    })

    const handleFormData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        fetch('http://localhost:3000/prasad/signup', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))
            .finally(() => {
                onSwitchTab('login')
                setFormData({
                    name: '',
                    email: '',
                    password: ''
                })
            })
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor='name' >Name</label>
                <input
                    id='name'
                    name='name'
                    placeholder="name"
                    required
                    value={formData.name}
                    onChange={handleFormData}
                />
            </div>
            <div>
                <label htmlFor='email' >Email</label>
                <input
                    id='email'
                    name='email'
                    placeholder="email"
                    required
                    value={formData.email}
                    onChange={handleFormData}
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id='password'
                    name='password'
                    placeholder="Password"
                    type='password'
                    required
                    value={formData.password}
                    onChange={handleFormData}
                />
            </div>
            <button type='submit'>Signup</button>
        </form>
    )
}
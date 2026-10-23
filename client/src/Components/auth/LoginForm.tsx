import { useState } from 'react';

type LoginFormData = {
    email: string,
    password: string
}
export default function LoginForm() {

    const [formData, setFormData] = useState<LoginFormData>({
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
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>):void => {
        e.preventDefault()
    }
    return (
        <form onSubmit={handleSubmit}>
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
            <button type='submit'>Login</button>
        </form>
    )
}
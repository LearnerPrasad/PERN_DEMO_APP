import { useState } from 'react';

type SignupFormData = {
    name:string,
    email: string,
    password: string
}
export default function SignupForm() {

    const [formData, setFormData] = useState<SignupFormData>({
        name:'',
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
                <label htmlFor='name' >Email</label>
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
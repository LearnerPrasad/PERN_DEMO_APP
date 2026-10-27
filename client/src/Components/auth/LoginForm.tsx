import { useState } from 'react';

type LoginFormData = {
    email: string,
    password: string
}
type Props = {
    login: (data: boolean) => void
}
export default function LoginForm({ login }: Props) {

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');


    const handleFormData = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    
const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setError('');

    fetch('http://localhost:3000/prasad/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(async response => {
            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || data.error || 'Login failed'
                );
            }

            return data;
        })
        .then(data => {
            const { token } = data;

            localStorage.setItem('athzToken', token);
            login(true);
        })
        .catch(error => {
            setError(
                error instanceof Error ? error.message : 'Login failed'
            );
        })
        .finally(() => {
            setFormData({ email: '', password: '' });
        });
};

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
            {error && <p className="error-message">{error}</p>}
        </form>
    )
}
import { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

type Props = {
    login : (data:boolean)=>void
}
export default function UserManagement({login}:Props) {

    const [activeTab, setActiveTab] = useState<string>('login');

    return (
        <div className='auth-container '>
            <div>
                <h3>PERN CRUD APP</h3>
                <div className="auth-forms">
                    <div className="auth-buttons">
                        <button onClick={() => setActiveTab('login')}>Login</button>
                        <button onClick={() => { setActiveTab('signup') }}>Sign Up</button>
                    </div>
                    <div >
                        {activeTab == 'login' ? <LoginForm login ={login} /> : <SignupForm onSwitchTab={setActiveTab} />}
                    </div>
                </div>
            </div>
        </div>

    )
}
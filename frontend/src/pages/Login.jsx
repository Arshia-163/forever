import React, { useState } from 'react'

const Login = () => {
    const [currentState, setCurrentState] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);  // Set loading state

        const userData = {
            name: name,
            email,
            password
        };

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);  // Handle success
                // Optionally redirect after successful login/signup
                if (currentState === 'Login') {
                    // Redirect to dashboard or home page (example)
                    window.location.href = '/dashboard';
                } else {
                    // Reset the form for sign-up
                    setCurrentState('Login');
                }
            } else {
                alert(data.error);  // Handle error
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while saving login data.");
        } finally {
            setLoading(false);  // Reset loading state
            setEmail(''); // Clear fields after submit
            setPassword('');
            setName('');
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>{currentState}</p>
                <hr className=' border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
                <input
                    className='w-full px-3 py-2 border border-gray-800'
                    type="text"
                    placeholder='Name'
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            <input
                className='w-full px-3 py-2 border border-gray-800'
                type="email"
                placeholder='Email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className='w-full px-3 py-2 border border-gray-800'
                type="password"
                placeholder='Password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className='w-full flex justify-between text-sm mt-[-8px]'>
                <p className='cursor-pointer'>Forgot your password?</p>
                {
                    currentState === 'Login'
                        ? <p onClick={() => setCurrentState('Sign Up')} className='cursor-pointer'>Create account</p>
                        : <p onClick={() => setCurrentState('Login')} className='cursor-pointer'>Login here</p>
                }
            </div>
            <button type='submit' className='bg-black text-white font-light px-8 py-2 mt-4' disabled={loading}>
                {loading ? 'Processing...' : (currentState === 'Login' ? 'Sign in' : 'Sign up')}
            </button>
        </form>
    )
}

export default Login;

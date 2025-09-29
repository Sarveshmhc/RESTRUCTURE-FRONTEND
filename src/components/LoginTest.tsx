import React, { useState } from 'react';
import { useAuth } from '../views/contexts/AuthContext';

const LoginTest: React.FC = () => {
    const { login, user, isAuthenticated } = useAuth();
    const [result, setResult] = useState<string>('');

    const testEmployeeLogin = async () => {
        setResult('Testing employee login...');
        try {
            const success = await login({
                email: 'employee@mhcognition.com',
                password: 'password123'
            });

            if (success) {
                setResult(`Success! User: ${JSON.stringify(user)}, Authenticated: ${isAuthenticated}`);
            } else {
                setResult('Login failed');
            }
        } catch (error) {
            setResult(`Error: ${error}`);
        }
    };

    const testHRLogin = async () => {
        setResult('Testing HR login...');
        try {
            const success = await login({
                email: 'hr@mhcognition.com',
                password: 'password123'
            });

            if (success) {
                setResult(`Success! User: ${JSON.stringify(user)}, Authenticated: ${isAuthenticated}`);
            } else {
                setResult('Login failed');
            }
        } catch (error) {
            setResult(`Error: ${error}`);
        }
    };

    return (
        <div className="p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-bold mb-4">Authentication Test</h3>
            <div className="space-x-2 mb-4">
                <button
                    onClick={testEmployeeLogin}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Test Employee Login
                </button>
                <button
                    onClick={testHRLogin}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Test HR Login
                </button>
            </div>
            <div className="mb-4">
                <p><strong>Current User:</strong> {JSON.stringify(user)}</p>
                <p><strong>Is Authenticated:</strong> {isAuthenticated.toString()}</p>
            </div>
            <div className="bg-white p-2 rounded border">
                <strong>Test Result:</strong>
                <pre>{result}</pre>
            </div>
        </div>
    );
};

export default LoginTest;
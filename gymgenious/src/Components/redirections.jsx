import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth} from 'firebase/auth';


function ActionHandler() {
    const navigate = useNavigate();
    const auth = getAuth();
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const code = urlParams.get('oobCode');

    useEffect(() => {

        if (!code || !mode) {
            console.error("Error", mode,code);
            navigate('/error');
            return;
        }

        if (mode === 'verifyEmail') {
            navigate(`/verify-email?code=${code}`); 
        } else if (mode === 'resetPassword') {
            navigate(`/new-password?code=${code}`);
        } else {
            navigate('/');
        }
    }, [navigate, auth]);

    return (
        <div>
            <h2>Processing...</h2>
            <p>Please wait while we process your request.</p>
        </div>
    );
}

export default ActionHandler;

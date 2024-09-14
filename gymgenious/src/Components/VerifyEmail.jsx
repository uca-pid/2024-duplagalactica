import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, checkActionCode,applyActionCode } from 'firebase/auth';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const actionCode = query.get('code');
  const [verification, setVerification] = useState(false);

  useEffect(() => {
    if (!actionCode) {
      navigate('/error');
      return;
    }

    const verifyUser = async () => {
      const auth = getAuth();

      try {
        await checkActionCode(auth, actionCode);
        await applyActionCode(auth, actionCode);
        alert("¡Correo electrónico verificado exitosamente!");
        setVerification(true);
        navigate('/');
      } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        alert("Hubo un error al verificar el correo electrónico.");
        navigate('/login');
      }
    };
    
    if (!verification) {
      verifyUser();
    }
  }, [actionCode, navigate, verification]);

  return (
    <div>
      <h2>Verificando correo electrónico...</h2>
    </div>
  );
}

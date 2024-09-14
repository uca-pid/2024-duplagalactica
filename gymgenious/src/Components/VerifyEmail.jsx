import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, applyActionCode } from 'firebase/auth';

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      const auth = getAuth();
      const actionCode = getActionCodeFromURL(); 

      try {
        await applyActionCode(auth, actionCode);
        alert("¡Correo electrónico verificado exitosamente!");
        navigate('/');
      } catch (error) {
        console.error("Error al verificar el correo electrónico:", error);
        alert("Hubo un error al verificar el correo electrónico.");
        navigate('/login'); 
      }
    };

    verifyUser();
  }, [navigate]);

  const getActionCodeFromURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('oobCode'); 
  };

  return (
    <div>
      <h2>Verificando correo electrónico...</h2>
    </div>
  );
}

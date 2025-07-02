// ===== HOOK PERSONALIZADO PARA MANEJO DE ERRORES =====
import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsync = useCallback(async (asyncFunction, loadingState = true) => {
    if (loadingState) setLoading(true);
    setError('');
    
    try {
      const result = await asyncFunction();
      return result;
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Ha ocurrido un error');
      throw err;
    } finally {
      if (loadingState) setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(''), []);

  return { error, loading, handleAsync, clearError };
};
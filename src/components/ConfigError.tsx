import React from 'react';

interface ConfigErrorProps {
  message: string;
}

const ConfigError: React.FC<ConfigErrorProps> = ({ message }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Error de configuración</h2>
        
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-4">{message}</p>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Instrucciones:</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li>Crea un archivo <code className="bg-gray-100 px-1 py-0.5 rounded">.env</code> en la raíz del proyecto</li>
              <li>Añade las siguientes variables:
                <pre className="bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                  VITE_SUPABASE_URL=tu_url_de_supabase<br/>
                  VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
                </pre>
              </li>
              <li>Reinicia el servidor de desarrollo</li>
            </ol>
          </div>
          
          <p className="mt-4 text-xs text-gray-500">
            Para más información, consulta el archivo README.md del proyecto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigError;

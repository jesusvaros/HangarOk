import React from 'react';

interface ConfigErrorProps {
  message: string;
}

const ConfigError: React.FC<ConfigErrorProps> = ({ message }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
          Error de configuración
        </h2>

        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-4">{message}</p>

          <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-2 font-medium text-gray-700">Instrucciones:</h3>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                Crea un archivo <code className="rounded bg-gray-100 px-1 py-0.5">.env</code> en la
                raíz del proyecto
              </li>
              <li>
                Añade las siguientes variables:
                <pre className="mt-1 overflow-x-auto rounded bg-gray-100 p-2">
                  VITE_SUPABASE_URL=tu_url_de_supabase
                  <br />
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

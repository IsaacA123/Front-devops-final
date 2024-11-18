import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-100 text-stone-80">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-red-500 rounded-full opacity-10 animate-pulse"></div>
          </div>
          <h1 className="text-9xl font-extralight relative z-10">404</h1>
        </div>
        <p className="text-2xl font-light tracking-wide">Pagina no encontrada</p>
        <p className="text-sm text-stone-600">La página que estás buscando no existe.</p>
        <div className="pt-8">
          <div className="h-px w-16 bg-stone-300 mx-auto"></div>
        </div>
        <div className="space-y-4">
          <button
            className="w-52 px-4 py-2 mt-2 text-white bg-indigo-500 rounded-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
            onClick={() => navigate('/')}
          >
            Go Back
          </button>
          <div className="text-sm">
            <Link to="/" className="text-stone-500 hover:text-stone-700 transition-colors duration-300">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-stone-200 to-transparent"></div>
    </div>
  );
};

export default NotFound;

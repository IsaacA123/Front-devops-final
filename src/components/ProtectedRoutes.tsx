import { Navigate, Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Layout, Target, Calendar, BarChart, FolderOpen } from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import ActionButton from './ActionButton';

const ProtectedRoutes = ({ isAuthenticated, onLogout }) => {
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { id: 'goals', icon: Target, label: 'Goals', path: '/goals' },
        { id: 'projects', icon: FolderOpen, label: 'Projects', path: '/projects' },
        { id: 'calendar', icon: Calendar, label: 'Calendar', path: '/calendar' },
        { id: 'stats', icon: BarChart, label: 'Statistics', path: '/statistics' },
    ];
      


    return (
        <>
            <ToastContainer/>
            <Navbar onLogout={onLogout} items={menuItems} />
            <div className="pt-32 px-4 md:px-8 container mx-auto"> {/* Ajusta el valor según la altura de tu navbar */}
                <Outlet /> {/* Renderiza las rutas hijas */}
            </div>
        </>
    );
};

export default ProtectedRoutes;

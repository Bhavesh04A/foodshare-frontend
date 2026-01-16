import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

// Button Component for Navbar
const Button = ({ children, variant = 'primary', className = '', onClick = () => {} }) => {
    let baseStyles = "font-semibold py-2 px-6 rounded-xl transition duration-300 ease-in-out transform active:scale-95 shadow-lg";
    let variantStyles = '';

    switch (variant) {
        case 'primary':
            variantStyles = 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/50';
            break;
        case 'secondary':
            variantStyles = 'bg-amber-500 text-gray-900 hover:bg-amber-600 shadow-amber-500/50';
            break;
        case 'outline':
            variantStyles = 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50';
            break;
        default:
            variantStyles = 'bg-gray-700 text-white hover:bg-gray-600';
    }

    return (
        <motion.button
            className={`${baseStyles} ${variantStyles} ${className}`}
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.button>
    );
};

export default function Navbar() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const role = user?.role;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('');

    useEffect(() => {
        if (location.pathname === '/') {
            const handleScroll = () => {
                const sections = ['home', 'impact', 'features', 'about'];
                const scrollPosition = window.scrollY + 100;

                for (const section of sections) {
                    const element = document.getElementById(section);
                    if (element) {
                        const offsetTop = element.offsetTop;
                        const offsetBottom = offsetTop + element.offsetHeight;

                        if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                            setActiveSection(section);
                            break;
                        }
                    }
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, [location.pathname]);

    // Get role-specific homepage path
    const getHomePath = (userRole) => {
        switch (userRole) {
            case 'restaurant': return '/home/restaurant';
            case 'ngo': return '/home/ngo';
            case 'volunteer': return '/home/volunteer';
            case 'waste_partner': return '/home/waste';
            default: return '/';
        }
    };

    const getDashboardPath = (userRole) => {
        switch (userRole) {
            case 'restaurant': return '/dashboard/restaurant';
            case 'ngo': return '/dashboard/ngo';
            case 'volunteer': return '/dashboard/volunteer';
            case 'waste_partner': return '/home/waste';
            default: return '/';
        }
    };


    const getCurrentHomePath = () => {
        return user ? getHomePath(user.role) : '/';
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleLogoClick = (e) => {
        if (user) {
            e.preventDefault();
            navigate(getHomePath(user.role));
        }
    };

    const handleNavClick = (sectionId) => {
        setIsMenuOpen(false);
        if (location.pathname === '/') {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    };

    // Define navigation links based on authentication
    const getNavLinks = () => {
        if (user) {
            const impactLabelRoles = ['ngo', 'restaurant', 'volunteer'];

            return [
                {
                    name: impactLabelRoles.includes(user.role) ? 'Impact' : 'Home',
                    path: getHomePath(user.role),
                    section: 'home',
                },
                { name: 'Dashboard', path: getDashboardPath(user.role), section: 'dashboard' },
                { name: 'AI Assistant', path: '/assistant', section: 'assistant' },
                { name: 'Analytics', path: '/analytics', section: 'analytics' },
            ];
        } else {
            return [
                { name: 'About', path: '/about', section: 'about' },
                { name: 'Contact', path: '/contact', section: 'contact' },
            ];
        }
    };


    const navLinks = getNavLinks();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.nav 
            className="bg-gradient-to-r from-blue-50 to-cyan-100 border-b border-blue-200 text-gray-800 px-3 md:px-8 py-4 shadow-lg sticky top-0 z-50"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                {/* Logo - Updated: redirects to role-specific homepage if logged in */}
                <motion.div whileHover={{ scale: 1.05 }}>
                    <Link 
                        to={getCurrentHomePath()}
                        className="text-3xl font-extrabold tracking-tight text-teal-400"
                        onClick={handleLogoClick}
                    >
                        Food<span className="text-gray-900">Share</span>
                    </Link>
                </motion.div>
                
                {/* Desktop Links */}
                <div className="hidden md:flex items-center space-x-8">
                    {/* Show different links based on authentication */}
                    {navLinks.map((link, index) => (
                        <motion.div
                            key={link.name}
                            onClick={() => {
                                setIsMenuOpen(false);
                                navigate(link.path);
                            }}
                            className={`cursor-pointer font-medium transition-all duration-300 ${
                                location.pathname === link.path 
                                    ? 'text-blue-600 font-bold scale-105' 
                                    : 'text-gray-700 hover:text-blue-500'
                            }`}
                            whileHover={{ y: -2 }}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            {link.name}
                        </motion.div>
                    ))}

                    {/* Auth Buttons */}
                    {user ? (
                        <motion.div 
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="text-gray-600 font-medium">
                                Welcome, {user.name}!
                            </span>
                            <Button variant="secondary" onClick={handleLogout} className="text-sm px-4 py-2">
                                Logout
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            className="flex items-center space-x-4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Link to="/login">
                                <Button variant="outline" className="text-sm px-4 py-2 border-blue-500 text-blue-500 hover:bg-blue-50">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="primary" className="text-sm px-4 py-2 bg-blue-500 hover:bg-blue-600">Sign Up</Button>
                            </Link>
                        </motion.div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <motion.button 
                    onClick={toggleMenu} 
                    className="text-gray-700 md:hidden text-2xl focus:outline-none"
                    aria-label="Toggle navigation"
                    whileTap={{ scale: 0.9 }}
                >
                    ☰
                </motion.button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        className="md:hidden mt-4 space-y-3 bg-white border-t border-blue-200 pt-4"
                        variants={menuVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                    >
                        {navLinks.map((link, index) => (
                            <motion.div
                                key={link.name}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    navigate(link.path);
                                }}
                                className={`block px-3 py-2 text-base font-medium rounded-lg transition cursor-pointer ${
                                    location.pathname === link.path 
                                        ? 'text-blue-600 bg-blue-50 font-bold' 
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {link.name}
                            </motion.div>
                        ))}

                        {/* Auth section */}
                        <div className="pt-4 border-t border-blue-200 space-y-3">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-sm text-gray-600">
                                        Welcome, {user.name}!
                                    </div>
                                    <Button variant="secondary" onClick={handleLogout} className="w-full text-base">
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="outline" className="w-full text-base border-blue-500 text-blue-500">Login</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="primary" className="w-full text-base mt-2 bg-blue-500 hover:bg-blue-600">Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
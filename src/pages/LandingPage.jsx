import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', onClick = () => {} }) => {
    let baseStyles = "font-bold py-3 px-8 rounded-2xl transition-all duration-300 ease-out transform active:scale-95 shadow-xl hover:shadow-2xl";
    let variantStyles = '';

    switch (variant) {
        case 'primary':
            variantStyles = 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 shadow-teal-500/30';
            break;
        case 'secondary':
            variantStyles = 'bg-gradient-to-r from-amber-400 to-orange-500 text-gray-900 hover:from-amber-500 hover:to-orange-600 shadow-amber-500/30';
            break;
        case 'outline':
            variantStyles = 'border-2 border-white text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm';
            break;
        default:
            variantStyles = 'bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-800 hover:to-gray-900';
    }

    return (
        <motion.button
            className={`${baseStyles} ${variantStyles} ${className}`}
            onClick={onClick}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
        >
            {children}
        </motion.button>
    );
};

// Enhanced Hero Slider - Clean and Beautiful Version
const EnhancedHeroSlider = () => {
    const slides = [
        {
            id: 1,
            background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 40%, #0ea5e9 100%)",
            title: "Fight Hunger, Reduce Waste",
            subtitle: "Connecting surplus food with those in need through AI-powered food distribution",
            icon: "🍽️",
            highlight: "1.2M+ meals shared"
        },
        {
            id: 2,
            background: "linear-gradient(135deg, #059669 0%, #10b981 40%, #34d399 100%)",
            title: "AI-Powered Food Rescue",
            subtitle: "Smart algorithms match surplus food with communities that need it most",
            icon: "🤖",
            highlight: "80% waste reduction"
        },
        {
            id: 3,
            background: "linear-gradient(135deg, #f59e0b 0%, #eab308 40%, #fbbf24 100%)",
            title: "Join the Food Revolution",
            subtitle: "Be part of India's largest food sharing community making real impact",
            icon: "🤝",
            highlight: "1,500+ active partners"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Animated Food Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Floating food items */}
                {['🍎', '🥑', '🍞', '🥦', '🥕', '🍇', '🍒', '🥭', '🍍', '🥥', '🥝', '🍅'].map((icon, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-3xl md:text-4xl opacity-30"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5
                        }}
                    >
                        {icon}
                    </motion.div>
                ))}
                
                {/* Floating circular elements */}
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={`circle-${i}`}
                        className="absolute rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 100 + 20}px`,
                            height: `${Math.random() * 100 + 20}px`,
                            background: i % 3 === 0 ? 'rgba(20, 184, 166, 0.1)' : 
                                      i % 3 === 1 ? 'rgba(245, 158, 11, 0.1)' : 
                                      'rgba(5, 150, 105, 0.1)',
                        }}
                        animate={{
                            y: [0, -50, 0],
                            x: [0, Math.random() * 40 - 20, 0],
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Hero Slider */}
            <div className="relative h-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: slides[currentSlide].background }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent"></div>
                        
                        {/* Main Content Container */}
                        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col items-center justify-center h-full text-center">
    
                        {/* Icon Badge - Reduced margin */}
                        <motion.div
                            className="mb-4 md:mb-6"  // Changed from mb-8
                            initial={{ y: -30, opacity: 0, scale: 0.8 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                        >
                            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-lg rounded-2xl border-2 border-white/40 shadow-2xl">
                                <span className="text-4xl md:text-5xl">
                                    {slides[currentSlide].icon}
                                </span>
                            </div>
                        </motion.div>

                        {/* Main Title - Reduced margin and slightly smaller font */}
                        <motion.h1
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-tight"  // Reduced font size and margins
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <span className="bg-gradient-to-r from-white via-amber-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                                {slides[currentSlide].title}
                            </span>
                        </motion.h1>

                        {/* Subtitle - Smaller font and reduced margin */}
                        <motion.p
                            className="text-lg sm:text-xl md:text-2xl font-light mb-6 md:mb-8 max-w-3xl mx-auto text-gray-100 drop-shadow-lg"  // Smaller font, reduced margin
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>

                        {/* Highlight Badge - Reduced margin */}
                        <motion.div
                            className="mb-6 md:mb-8"  // Changed from mb-10 md:mb-12
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.7 }}
                        >
                            <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-lg px-5 py-2 rounded-full border border-white/30">
                                <span className="text-lg">✨</span>
                                <span className="text-base font-bold text-white">
                                    {slides[currentSlide].highlight}
                                </span>
                            </div>
                        </motion.div>

                        {/* CTA Buttons - Reduced gap and smaller padding */}
                        <motion.div
                            className="flex flex-col sm:flex-row gap-3 md:gap-4"  // Reduced gap
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.9 }}
                        >
                            <Link to="/register">
                                <Button variant="secondary" className="text-base px-8 py-3 md:px-10 md:py-4">  
                                    🚀 Join FoodShare
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" className="text-base px-8 py-3 md:px-10 md:py-4">  
                                    📱 See How It Works
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                    </motion.div>
                </AnimatePresence>

                {/* Minimal Progress Dots */}
                <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">  
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className="focus:outline-none"
                        >
                            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? "bg-white scale-125" : "bg-white/40"}`} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Enhanced ImpactCard Component
const ImpactCard = ({ title, value, icon, delay = 0 }) => (
    <motion.div 
        className="relative bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-100 hover:border-teal-300 transition-all duration-300 flex flex-col items-center group h-full"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, type: "spring" }}
        whileHover={{ y: -10 }}
    >
        {/* Container for the icon to keep it centered and inside the card */}
        <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 mb-6">
            <motion.span 
                className="text-3xl"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
                {icon}
            </motion.span>
        </div>
        <div className="text-center">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">{title}</p>
            <h3 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent break-words">
                {value}
            </h3>
        </div>
    </motion.div>
);

// Enhanced FeatureCard Component
const FeatureCard = ({ title, description, icon, delay = 0 }) => (
    <motion.div 
        className="relative bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-2xl border border-gray-200 hover:border-teal-400 transition-all duration-300 h-full overflow-hidden group"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay, type: "spring" }}
        whileHover={{ y: -8 }}
    >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-amber-400"></div>
        <div className="flex items-start space-x-5 mb-6">
            <motion.div 
                className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:rotate-12 transition-transform duration-300"
                whileHover={{ scale: 1.1 }}
            >
                {icon}
            </motion.div>
            <h4 className="text-2xl font-bold text-gray-900 pt-2">{title}</h4>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{description}</p>
    </motion.div>
);
// Enhanced Login Options Component
const LoginOptions = () => {
    const options = [
        {
            role: 'restaurant',
            title: 'Food Donor',
            description: 'Restaurants, Cafes & Food Businesses',
            icon: '🏪',
            color: 'from-blue-400 to-cyan-500',
            hoverColor: 'from-blue-500 to-cyan-600',
            features: ['Reduce food waste', 'Tax benefits', 'Community impact'],
            buttonText: 'Donor Login'
        },
        {
            role: 'ngo',
            title: 'NGO Partner',
            description: 'Charities & Community Organizations',
            icon: '🤝',
            color: 'from-green-400 to-emerald-500',
            hoverColor: 'from-green-500 to-emerald-600',
            features: ['Receive quality food', 'Real-time updates', 'Scale your impact'],
            buttonText: 'NGO Login'
        },
        {
            role: 'volunteer',
            title: 'Volunteer',
            description: 'Help with Food Collection & Delivery',
            icon: '🚗',
            color: 'from-orange-400 to-amber-500',
            hoverColor: 'from-orange-500 to-amber-600',
            features: ['Flexible timing', 'Make a difference', 'Community connection'],
            buttonText: 'Volunteer Login'
        },
        {
            role: 'waste_partner',
            title: 'Waste Partner',
            description: 'Organic Recycling & Composting',
            icon: '♻️',
            color: 'from-teal-400 to-green-500',
            hoverColor: 'from-teal-500 to-green-600',
            features: ['Collect expired food', 'Prevent landfill waste', 'Support sustainability'],
            buttonText: 'Waste Partner Login'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {options.map((option, index) => (
                <motion.div
                    key={option.role}
                    className="relative group"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-xl transform group-hover:scale-105 transition-all duration-300"></div>
                    <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 hover:border-transparent transition-all duration-300">
                        <div className={`bg-gradient-to-r ${option.color} p-8 text-white text-center relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-black/5"></div>
                            <motion.div 
                                className="text-5xl mb-4 relative z-10"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                {option.icon}
                            </motion.div>
                            <h3 className="text-2xl font-bold relative z-10">{option.title}</h3>
                            <p className="text-white/90 text-sm mt-2 relative z-10">{option.description}</p>
                        </div>
                        <div className="p-8">
                            <ul className="space-y-3 mb-8">
                                {option.features.map((feature, idx) => (
                                    <motion.li 
                                        key={idx} 
                                        className="flex items-center text-gray-600 text-base"
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <span className="w-2 h-2 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full mr-3"></span>
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>
                            <Link to={`/login?role=${option.role}`}>
                                <motion.button
                                    className={`w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r ${option.color} shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="relative z-10">{option.buttonText}</span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

// Section Header Component
const SectionHeader = ({ title, subtitle, delay = 0 }) => (
    <div className="text-center mb-16">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay }}
            className="inline-block mb-4"
        >
            <div className="w-24 h-1 bg-gradient-to-r from-teal-400 to-amber-400 rounded-full mx-auto"></div>
        </motion.div>
        <motion.h2 
            className="text-5xl font-black text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: delay + 0.1 }}
        >
            <span className="bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent">
                {title}
            </span>
        </motion.h2>
        <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: delay + 0.2 }}
        >
            {subtitle}
        </motion.p>
    </div>
);

// Main Landing Page Component
export default function LandingPage() {
    return (
        <div className="min-h-screen text-gray-900 overflow-x-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-4 h-4 bg-gradient-to-r from-teal-300/20 to-amber-300/20 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.3, 0.8, 0.3],
                        }}
                        transition={{
                            duration: Math.random() * 3 + 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                ))}
            </div>

            {/* 1. FULL SCREEN Hero Section */}
            <section className="w-full h-screen">
                <EnhancedHeroSlider />
            </section>
            
            {/* 2. Login Options Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <SectionHeader
                        title="Join Our Food Sharing Network"
                        subtitle="Choose your role and start making a difference in your community today"
                        delay={0}
                    />
                    <LoginOptions />
                </div>
            </section>

            {/* 3. Impact Overview */}
            <section className="py-24 bg-gradient-to-br from-teal-50/80 to-emerald-50/80 relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <SectionHeader
                        title="Quantifiable Results"
                        subtitle="Real impact measured in meals shared, emissions prevented, and lives touched"
                        delay={0}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <ImpactCard title="Meals Shared" value="1.2M+" icon="🍲" delay={0} />
                        <ImpactCard title="CO₂ Prevented" value="250K kg" icon="♻️" delay={0.2} />
                        <ImpactCard title="Active Partners" value="1,500+" icon="🤝" delay={0.4} />
                    </div>
                </div>
            </section>

            {/* 4. Features Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <SectionHeader
                        title="Innovative Features"
                        subtitle="Smart technology to eliminate manual tracking and optimize every delivery for maximum efficiency"
                        delay={0}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard 
                            title="AI Freshness Scoring" 
                            description="Real-time algorithm to prioritize distribution based on food safety windows." 
                            icon="🧠" 
                            delay={0}
                        />
                        <FeatureCard 
                            title="QR-Verified Hand-offs" 
                            description="Instant, contactless verification via QR code for efficient collection." 
                            icon="📱" 
                            delay={0.2}
                        />
                        <FeatureCard 
                            title="Smart Route Optimization" 
                            description="Minimize volunteer time and fuel with automatic route generation." 
                            icon="🗺️" 
                            delay={0.4}
                        />
                        <FeatureCard 
                            title="Expired Food Recycling" 
                            description="Redirect unaccepted food to waste partners for organic recycling." 
                            icon="♻️" 
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* 5. How It Works Section */}
            <section className="py-24 bg-gradient-to-br from-amber-50/80 to-orange-50/80 relative">
                <div className="max-w-5xl mx-auto px-4 relative z-10">
                    <SectionHeader
                        title="Making Food Sharing Simple"
                        subtitle="From surplus to smiles — and zero waste for the planet 🌍"
                        delay={0}
                    />

                    <div className="relative space-y-12">
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-teal-400 to-amber-400"></div>

                        {[
                            { 
                                step: 'Share Your Surplus', 
                                desc: 'Got extra food? Simply tell us what you have available. Our smart system helps assess freshness and quantity.', 
                                icon: '🍽️',
                                emoji: '✨'
                            },
                            { 
                                step: 'Perfect Match', 
                                desc: 'Instantly connects your donation with local communities who need it most — no guesswork needed!', 
                                icon: '❤️',
                                emoji: '🎯'
                            },
                            { 
                                step: 'Pickup & Delivery', 
                                desc: 'Our verified volunteers handle everything — from pickup to safe delivery. You just pack, we handle the rest!', 
                                icon: '🚗',
                                emoji: '📦'
                            },
                            { 
                                step: 'See Your Impact', 
                                desc: 'Watch your kindness multiply! Get updates on meals shared, carbon saved, and smiles created.', 
                                icon: '📊',
                                emoji: '🌍'
                            },
                            { 
                                step: 'Zero-Waste Recycling', 
                                desc: 'If food is not accepted, it is safely redirected to waste partners for organic recycling.', 
                                icon: '♻️',
                                emoji: '🌱'
                            }
                        ].map((item, index) => (
                            <motion.div 
                                key={index} 
                                className={`flex flex-col md:flex-row items-start relative ${
                                    index % 2 === 0
                                        ? 'md:space-x-12'
                                        : 'md:flex-row-reverse md:space-x-reverse md:space-x-12'
                                }`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.15, type: "spring" }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div
                                        className={`flex items-center space-x-3 mb-3 ${
                                            index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'
                                        }`}
                                    >
                                        <span className="text-3xl">{item.icon}</span>
                                        <h4 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-600 bg-clip-text text-transparent flex items-center gap-2">
                                            {item.step}
                                            <span className="text-xl">{item.emoji}</span>
                                        </h4>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>

                                <div className="md:w-1/2 md:mt-0 mt-6">
                                    <motion.div 
                                        className={`w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-amber-500 absolute ${
                                            index % 2 === 0
                                                ? 'md:left-1/2 md:-ml-7'
                                                : 'md:right-1/2 md:-mr-7'
                                        } top-0 flex items-center justify-center text-white font-black shadow-2xl border-4 border-white`}
                                        whileHover={{ scale: 1.3, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 200 }}
                                        animate={{ scale: [1, 1.1, 1] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                        {index + 1}
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <motion.div 
                        className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {[
                            { number: 'Under 5 mins', label: 'to list food' },
                            { number: '24/7', label: 'matching' },
                            { number: '100%', label: 'contactless' },
                            { number: 'Real-time', label: 'updates' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/80 p-6 rounded-2xl shadow-lg border border-white/20">
                                <div className="text-2xl font-black text-teal-600">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 6. Testimonials Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <SectionHeader
                        title="What Our Partners Say"
                        subtitle="Hear from those making a real difference in their communities"
                        delay={0}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Restaurant Owner", quote: "Reduced our food waste by 80% while helping our community.", role: "🍽️" },
                            { name: "NGO Director", quote: "The platform ensures we get fresh meals exactly when needed.", role: "❤️" },
                            { name: "Volunteer", quote: "Smart routing makes every delivery efficient and rewarding.", role: "🚗" }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-2xl border border-gray-200 hover:border-teal-400 transition-all duration-300 relative overflow-hidden group"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                whileHover={{ y: -8 }}
                            >
                                <div className="text-5xl mb-6">{testimonial.role}</div>
                                <p className="text-gray-700 text-lg italic mb-6">"{testimonial.quote}"</p>
                                <p className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-600">{testimonial.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Final Call-to-Action */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-amber-500"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                
                <motion.div 
                    className="max-w-4xl mx-auto px-4 relative z-10"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl p-12 text-center shadow-2xl">
                        <motion.h2 
                            className="text-5xl md:text-6xl font-black text-white mb-6"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            Take Action Today.
                        </motion.h2>
                        <motion.p 
                            className="text-2xl text-white/90 mb-10 font-light"
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Every meal shared makes a difference—to a person and to the planet.
                        </motion.p>
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Link to="/register">
                                <Button variant="secondary" className="text-xl py-4 px-14">
                                    🚀 Register Now
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
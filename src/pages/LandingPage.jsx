import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', onClick = () => {} }) => {
    let baseStyles = "font-semibold py-2 px-6 rounded-xl transition duration-300 ease-in-out transform active:scale-95 shadow-lg";
    let variantStyles = '';

    switch (variant) {
        case 'primary':
            variantStyles = 'bg-teal-500 text-white hover:bg-teal-600 shadow-teal-500/50';
            break;
        case 'secondary':
            variantStyles = 'bg-amber-500 text-gray-900 hover:bg-amber-600 shadow-amber-500/50';
            break;
        case 'outline':
            variantStyles = 'border-2 border-teal-500 text-teal-500 hover:bg-teal-50';
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

// ImpactCard Component
const ImpactCard = ({ title, value, icon, delay = 0 }) => (
    <motion.div 
        className="card text-center transform hover:scale-[1.02] transition duration-300 h-full"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -5 }}
    >
        <motion.span 
            className="text-5xl mb-4 block" 
            role="img"
            whileHover={{ scale: 1.2, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {icon}
        </motion.span>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-4xl font-extrabold text-teal-500">{value}</h3>
    </motion.div>
);

// FeatureCard Component
const FeatureCard = ({ title, description, icon, delay = 0 }) => (
    <motion.div 
        className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hover:border-teal-400 transition duration-300 h-full transform hover:scale-[1.02]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -5 }}
    >
        <div className="flex items-center space-x-4 mb-4">
            <motion.span 
                className="text-3xl text-teal-500"
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.5 }}
            >
                {icon}
            </motion.span>
            <h4 className="text-xl font-bold text-gray-900">{title}</h4>
        </div>
        <p className="text-gray-600">{description}</p>
    </motion.div>
);

// Login Options Component
const LoginOptions = () => {
    const options = [
        {
            role: 'restaurant',
            title: 'Food Donor',
            description: 'Restaurants, Cafes & Food Businesses',
            icon: '🏪',
            color: 'from-blue-500 to-cyan-500',
            features: ['Reduce food waste', 'Tax benefits', 'Community impact'],
            buttonText: 'Donor Login'
        },
        {
            role: 'ngo',
            title: 'NGO Partner',
            description: 'Charities & Community Organizations',
            icon: '🤝',
            color: 'from-green-500 to-emerald-500',
            features: ['Receive quality food', 'Real-time updates', 'Scale your impact'],
            buttonText: 'NGO Login'
        },
        {
            role: 'volunteer',
            title: 'Volunteer',
            description: 'Help with Food Collection & Delivery',
            icon: '🚗',
            color: 'from-orange-500 to-amber-500',
            features: ['Flexible timing', 'Make a difference', 'Community connection'],
            buttonText: 'Volunteer Login'
        },
        {
            role: 'waste_partner',
            title: 'Waste Partner',
            description: 'Recycle & Process Expired Food',
            icon: '♻️',
            color: 'from-emerald-600 to-green-600',
            features: ['Food recycling', 'Reduce landfill waste', 'Environmental impact'],
            buttonText: 'Waste Partner Login'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {options.map((option, index) => (
                <motion.div
                    key={option.role}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                >
                    <div className={`bg-gradient-to-r ${option.color} p-6 text-white text-center`}>
                        <div className="text-4xl mb-3">{option.icon}</div>
                        <h3 className="text-xl font-bold">{option.title}</h3>
                        <p className="text-white/90 text-sm mt-1">{option.description}</p>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-2 mb-6">
                            {option.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-600 text-sm">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <Link to={`/login?role=${option.role}`}>
                            <motion.button
                                className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r ${option.color} shadow-lg hover:shadow-xl transition-all duration-300`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {option.buttonText}
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};


const CompactHeroSlider = () => {
    const slides = [
        {
            id: 1,
            background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #0ea5e9 100%)",
            title: "Fight Hunger, Reduce Waste",
            subtitle: "Connecting surplus food with communities in need through intelligent technology"
        },
        {
            id: 2,
            background: "linear-gradient(135deg, #f59e0b 0%, #eab308 50%, #fbbf24 100%)",
            title: "AI-Powered Food Rescue",
            subtitle: "Smart algorithms ensure food reaches those who need it most, when they need it"
        },
        {
            id: 3,
            background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
            title: "Join the Movement",
            subtitle: "Be part of India's largest food sharing community making real impact"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative w-full h-[500px] sm:h-[600px] md:h-[650px] overflow-hidden rounded-none">

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
                    <div className="absolute inset-0 bg-black/25"></div>

                    <div className="text-center text-white relative z-10 max-w-4xl px-4 w-full">

                        <motion.h1
                            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-snug"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            {slides[currentSlide].title}
                        </motion.h1>

                        <motion.p
                            className="text-base sm:text-lg md:text-xl font-light mb-8 max-w-2xl mx-auto"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {slides[currentSlide].subtitle}
                        </motion.p>

                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 text-white text-2xl sm:text-4xl z-20 hover:scale-110 bg-black/30 rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center"
            >
                ‹
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 text-white text-2xl sm:text-4xl z-20 hover:scale-110 bg-black/30 rounded-full w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center"
            >
                ›
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${idx === currentSlide ? "bg-white scale-125" : "bg-white/50"}`}
                    />
                ))}
            </div>

            {/* CTA Buttons */}
            <motion.div
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 text-center"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
            >
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to="/register">
                        <Button variant="secondary" className="hero-btn">
                            Join the Movement
                        </Button>
                    </Link>

                    <Link to="/login">
                        <Button variant="outline" className="hero-btn text-white border-white bg-white/20 hover:bg-white/30">
                            View Live Impact
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};


// Main Landing Page Component
export default function LandingPage() {
    return (
        <motion.main 
            className="min-h-screen bg-gray-50 text-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* 1. Hero Section with Compact Slider */}
            <section className="pt-0 pb-16"> 
                <div className="max-w-7xl mx-auto">
                    <CompactHeroSlider />
                </div>
            </section>
            
            {/* 2. Login Options Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center text-gray-800 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Join Our Food Sharing Network
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-center text-gray-600 mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Choose your role and start making a difference in your community today
                    </motion.p>
                    
                    <LoginOptions />
                </div>
            </section>

            {/* 3. Impact Overview */}
            <section id="impact" className="py-20 bg-gradient-to-br from-gray-50 to-teal-50">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center text-gray-800 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Quantifiable Results
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Real impact measured in meals shared, emissions prevented, and lives touched
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <ImpactCard title="Meals Shared" value="1.2M+" icon="🍲" delay={0} />
                        <ImpactCard title="CO₂ Prevented" value="250K kg" icon="♻️" delay={0.2} />
                        <ImpactCard title="Active Partners" value="1,500+" icon="🤝" delay={0.4} />
                    </div>
                </div>
            </section>

            {/* 4. Features Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center text-gray-800 mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Innovative Features
                    </motion.h2>
                    <motion.p 
                        className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        We leverage smart technology to eliminate manual tracking and optimize every delivery for maximum efficiency.
                    </motion.p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard 
                            title="AI Freshness Scoring" 
                            description="Real-time algorithm to prioritize distribution based on food safety windows, reducing risk and waste." 
                            icon="🧠" 
                            delay={0}
                        />
                        <FeatureCard 
                            title="QR-Verified Hand-offs" 
                            description="Instant, contactless verification via QR code for efficient and documented collection and delivery." 
                            icon="📱" 
                            delay={0.2}
                        />
                        <FeatureCard 
                            title="Smart Route Optimization" 
                            description="Minimize volunteer time and fuel usage by automatically generating the fastest pickup routes." 
                            icon="🗺️" 
                            delay={0.4}
                        />
                    </div>
                </div>
            </section>

            {/* 5. How It Works Section */}
            <section id="about" className="py-24 bg-gradient-to-br from-amber-50 to-orange-50">
                <div className="max-w-5xl mx-auto px-4">
                    <motion.h3 
                        className="text-4xl font-bold text-center text-gray-800 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Making Food Sharing Simple
                    </motion.h3>
                    <motion.p
                        className="text-xl text-center text-gray-600 mb-16 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        From surplus to smiles - see how your extra food finds its perfect match
                    </motion.p>
                    
                    <div className="relative space-y-12">
                        <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-teal-300 to-amber-300"></div>

                        {[
                            { 
                                step: 'Share Your Surplus', 
                                desc: 'Got extra food? Simply tell us what you have available. Our smart system helps assess freshness and quantity.', 
                                icon: '🍽️',
                                emoji: '✨'
                            },
                            { 
                                step: 'We Find the Perfect Match', 
                                desc: 'Our platform instantly connects your donation with local communities who need it most - no guesswork needed!', 
                                icon: '❤️',
                                emoji: '🎯'
                            },
                            { 
                                step: 'Friendly Pickup & Delivery', 
                                desc: 'Our verified volunteers handle everything - from pickup to safe delivery. You just pack, we handle the rest!', 
                                icon: '🚗',
                                emoji: '📦'
                            },
                            { 
                                step: 'See Your Impact Grow', 
                                desc: 'Watch your kindness multiply! Get updates on meals shared, carbon saved, and smiles created through your contribution.', 
                                icon: '📊',
                                emoji: '🌍'
                            }
                        ].map((item, index) => (
                            <motion.div 
                                key={index} 
                                className={`flex flex-col md:flex-row items-start relative ${index % 2 === 0 ? 'md:space-x-12' : 'md:flex-row-reverse md:space-x-reverse md:space-x-12'}`}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                                    <div className={`flex items-center space-x-3 mb-3 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                                        <span className="text-3xl">{item.icon}</span>
                                        <div>
                                            <h4 className="text-2xl font-bold text-teal-600 flex items-center gap-2">
                                                {item.step}
                                                <span className="text-xl">{item.emoji}</span>
                                            </h4>
                                        </div>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                                <div className="md:w-1/2 md:mt-0 mt-6">
                                    <motion.div 
                                        className={`w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-amber-500 absolute ${index % 2 === 0 ? 'md:left-1/2 md:-ml-6' : 'md:right-1/2 md:-mr-6'} top-0 flex items-center justify-center text-white font-bold shadow-lg border-4 border-white`}
                                        whileHover={{ scale: 1.3, rotate: 360 }}
                                        transition={{ type: "spring", stiffness: 200 }}
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
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {[
                            { number: 'Under 5 mins', label: 'to list food' },
                            { number: '24/7', label: 'matching' },
                            { number: '100%', label: 'contactless' },
                            { number: 'Real-time', label: 'updates' }
                        ].map((stat, index) => (
                            <div key={index} className="bg-white/60 p-4 rounded-xl shadow-sm">
                                <div className="text-xl font-bold text-teal-600">{stat.number}</div>
                                <div className="text-gray-600 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* 6. Testimonials Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <motion.h2 
                        className="text-4xl font-bold text-center text-gray-800 mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        What Our Partners Say
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Restaurant Owner", quote: "Reduced our food waste by 80% while helping our community.", role: "🍽️" },
                            { name: "NGO Director", quote: "The platform ensures we get fresh meals exactly when needed.", role: "❤️" },
                            { name: "Volunteer", quote: "Smart routing makes every delivery efficient and rewarding.", role: "🚗" }
                        ].map((testimonial, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-br from-teal-50 to-amber-50 p-6 rounded-2xl shadow-lg border border-teal-100"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-4xl mb-4">{testimonial.role}</div>
                                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                                <p className="font-semibold text-teal-600">{testimonial.name}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Final Call-to-Action */}
            <section className="py-20 bg-gradient-to-r from-teal-500 to-amber-500 text-white text-center">
                <motion.div 
                    className="max-w-4xl mx-auto px-4 p-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.h2 
                        className="text-4xl font-extrabold mb-4"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Take Action Today.
                    </motion.h2>
                    <motion.p 
                        className="text-xl mb-8 font-light"
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
                            <Button variant="secondary" className="text-xl py-4 px-12">
                                Register Now
                            </Button>
                        </Link>
                    </motion.div>
                </motion.div>
            </section>
        </motion.main>
    );
}
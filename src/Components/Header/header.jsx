// import React from "react";
// import { NavLink, useLocation } from "react-router-dom";

// const Navbar = () => {
//     const location = useLocation();
//     const pathname = location.pathname;

//     const isDropdownActive = (prefixes = []) => {
//         return prefixes.some((prefix) => pathname.startsWith(prefix));
//     };

//     return (
//         <header>
//             <div className="hero-container">
//                 <nav className="navbar navbar-expand-lg">
//                     <div className="container-fluid flex-nowrap">

//                         <NavLink className="navbar-brand" to="/">
//                             <img src="/assets/images/logo.webp" className="logo" alt="Logo" />
//                         </NavLink>

//                         <div className="nav-link-container">
//                             <div className="collapse navbar-collapse" id="navbarNav">
//                                 <ul className="navbar-nav my-4 my-lg-0">
//                                     <li className="nav-item">
//                                         <NavLink to="/" className="nav-link" end>
//                                             Home
//                                         </NavLink>
//                                     </li>

//                                     <li className="nav-item">
//                                         <NavLink to="/about" className="nav-link">
//                                             About Us
//                                         </NavLink>
//                                     </li>

//                                     <li className="nav-item dropdown">
//                                         <a
//                                             className={`nav-link dropdown-toggle ${
//                                                 isDropdownActive(["/services", "/service-detail"]) ? "active" : ""
//                                             }`}
//                                             href="#"
//                                             role="button"
//                                             data-bs-toggle="dropdown"
//                                             aria-expanded="false"
//                                         >
//                                             Services <i className="fa-solid fa-angle-down"></i>
//                                         </a>
//                                         <ul className="dropdown-menu">
//                                             <li><NavLink to="/services" className="dropdown-item">Service</NavLink></li>
//                                             <li><NavLink to="/service-detail" className="dropdown-item">Service Details</NavLink></li>
//                                         </ul>
//                                     </li>

//                                     <li className="nav-item dropdown">
//                                         <a
//                                             className={`nav-link dropdown-toggle ${
//                                                 isDropdownActive(["/portfolio", "/portfolio-detail"]) ? "active" : ""
//                                             }`}
//                                             href="#"
//                                             role="button"
//                                             data-bs-toggle="dropdown"
//                                             aria-expanded="false"
//                                         >
//                                             Portfolio <i className="fa-solid fa-angle-down"></i>
//                                         </a>
//                                         <ul className="dropdown-menu">
//                                             <li><NavLink to="/portfolio" className="dropdown-item">Portfolio</NavLink></li>
//                                             <li><NavLink to="/portfolio-detail" className="dropdown-item">Portfolio Details</NavLink></li>
//                                         </ul>
//                                     </li>

//                                     <li className="nav-item dropdown">
//                                         <a
//                                             className={`nav-link dropdown-toggle ${
//                                                 isDropdownActive([
//                                                     "/pricing",
//                                                     "/team",
//                                                     "/testimonial",
//                                                     "/faq",
//                                                     "/404-page",
//                                                     "/blog",
//                                                     "/single-post"
//                                                 ])
//                                                     ? "active"
//                                                     : ""
//                                             }`}
//                                             href="#"
//                                             role="button"
//                                             data-bs-toggle="dropdown"
//                                             aria-expanded="false"
//                                         >
//                                             Pages <i className="fa-solid fa-angle-down"></i>
//                                         </a>
//                                         <ul className="dropdown-menu">
//                                             <li><NavLink to="/pricing" className="dropdown-item">Pricing Plan</NavLink></li>
//                                             <li><NavLink to="/team" className="dropdown-item">Team</NavLink></li>
//                                             <li><NavLink to="/testimonial" className="dropdown-item">Testimonials</NavLink></li>
//                                             <li><NavLink to="/faq" className="dropdown-item">FAQs</NavLink></li>
//                                             <li><NavLink to="/404-page" className="dropdown-item">404 Error</NavLink></li>
//                                             <li><NavLink to="/blog" className="dropdown-item">Blog Archive</NavLink></li>
//                                             <li><NavLink to="/single-post" className="dropdown-item">Single Post</NavLink></li>
//                                         </ul>
//                                     </li>

//                                     <li className="nav-item">
//                                         <NavLink to="/contact" className="nav-link">
//                                             Contact
//                                         </NavLink>
//                                     </li>
//                                 </ul>
//                             </div>
//                         </div>

//                         <button
//                             className="navbar-toggler nav-btn"
//                             type="button"
//                             data-bs-toggle="collapse"
//                             data-bs-target="#navbarNav"
//                             aria-controls="navbarNav"
//                             aria-expanded="false"
//                             aria-label="Toggle navigation"
//                         >
//                             <i className="fa-solid fa-bars-staggered"></i>
//                         </button>

//                         <div className="navbar-cta">
//                             <a href="#" className="btn btn-accent">Get Started</a>
//                         </div>
//                     </div>
//                 </nav>
//             </div>
//         </header>
//     );
// };

// export default Navbar;

import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

const Navbar = () => {
    const location = useLocation();
    const pathname = location.pathname;
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage; default to light theme when no saved preference
        const savedMode = localStorage.getItem("darkMode");
        if (savedMode !== null) {
            return JSON.parse(savedMode);
        }
        return false;
    });
    
    // Apply dark/light mode to entire website
    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        
        if (darkMode) {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
            root.setAttribute("data-theme", "dark");
        } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
            root.setAttribute("data-theme", "light");
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const isDropdownActive = (prefixes = []) => {
        return prefixes.some((prefix) => pathname.startsWith(prefix));
    };

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            const offset = window.scrollY;
            if (offset > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        setIsMenuOpen(false);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [pathname]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMenuOpen && !event.target.closest('.navbar-collapse') && !event.target.closest('.navbar-toggler')) {
                setIsMenuOpen(false);
                const collapseElement = document.getElementById('navbarNav');
                if (collapseElement && collapseElement.classList.contains('show')) {
                    collapseElement.classList.remove('show');
                }
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
        const collapseElement = document.getElementById('navbarNav');
        if (collapseElement && collapseElement.classList.contains('show')) {
            collapseElement.classList.remove('show');
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const MoonIcon = () => (
        <svg 
            className="theme-icon moon-icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    );

    const SunIcon = () => (
        <svg 
            className="theme-icon sun-icon"
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    );

    return (
        <header className={`sticky-navbar ${scrolled ? 'scrolled' : ''} ${darkMode ? 'dark-mode' : 'light-mode'}`}>
            <div className="hero-container">
                <nav className="navbar navbar-expand-lg">
                    <div className="container-fluid flex-nowrap">

                        <NavLink className="navbar-brand" to="/" >
                            {/* <img 
                                src={darkMode ? "/assets/images/logo.webp" : "/assets/images/logo.webp"} 
                                className="logo" 
                                alt="Logo" 
                            /> */}
                        </NavLink>

                        <div className="nav-link-container">
                            <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                                <ul className="navbar-nav my-4 my-lg-0">
                                    <li className="nav-item">
                                        <NavLink to="/" className="nav-link" onClick={closeMenu} end>
                                            Home
                                        </NavLink>
                                    </li>

                                    <li className="nav-item">
                                        <NavLink to="/about" className="nav-link" onClick={closeMenu}>
                                            About Us
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/e_books" className="nav-link" onClick={closeMenu}>
                                            E-Books
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/portfolio" className="nav-link" onClick={closeMenu}>
                                            Course
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/consultation" className="nav-link" onClick={closeMenu}>
                                            Consultation
                                        </NavLink>
                                    </li>

                                    {/* <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle ${
                                                isDropdownActive(["/services", "/service-detail"]) ? "active" : ""
                                            }`}
                                            href="/ebooks"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            E-Books 
                                            <i className="fa-solid fa-angle-down"></i>
                                        </a                                                                                 >
                                        <ul className="dropdown-menu">
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Service</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Service Details</NavLink></li>
                                        </ul>
                                    </li> */}

                                    {/* <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle ${
                                                isDropdownActive(["/portfolio", "/portfolio-detail"]) ? "active" : ""
                                            }`}
                                            href="/portfolio"
                                            role="button"
                                            data-bs-toggle="dropdown"    
                                            aria-expanded="false"
                                        >
                                            Course 
                                            <i className="fa-solid fa-angle-down"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Portfolio</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Portfolio Details</NavLink></li>
                                        </ul>
                                    </li> */}

                                    {/* <li className="nav-item dropdown">
                                        <a
                                            className={`nav-link dropdown-toggle
                                                ${
                                                isDropdownActive([
                                                    "/pricing",
                                                    "/team",
                                                    "/testimonial",
                                                    "/faq",
                                                    "/404-page",
                                                    "/blog",
                                                    "/single-post"
                                                ])
                                                    ? "active"
                                                    : ""
                                            }
                                            `}
                                            href="/consultation"
                                            role="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            Consultation
                                             <i className="fa-solid fa-angle-down"></i>
                                        </a>
                                        <ul className="dropdown-menu">
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Pricing Plan</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Team</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Testimonials</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>FAQs</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>404 Error</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Blog Archive</NavLink></li>
                                            <li><NavLink to="#" className="dropdown-item" onClick={closeMenu}>Single Post</NavLink></li>
                                        </ul>
                                    </li> */}
                                    <li className="nav-item">
                                        <NavLink to="/blog-page" className="nav-link" >
                                            Blog
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink to="/contact" className="nav-link" onClick={closeMenu}>
                                            Contact
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        
                        {/* Theme Toggle Button */}
                        <button 
                            className="theme-toggle-btn"
                            onClick={toggleDarkMode}
                            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {darkMode ? <MoonIcon /> : <SunIcon />}
                        </button>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="navbar-toggler nav-btn "
                            type="button"
                            onClick={toggleMenu}
                            aria-controls="navbarNav"
                            aria-expanded={isMenuOpen}
                            aria-label="Toggle navigation"
                        >
                            <i className={`fa-solid ${isMenuOpen ? 'fa-xmark' : 'fa-bars-staggered'}`}></i>
                        </button>

                        <div className="navbar-cta">
                            <Link to="/contact" className="btn btn-accent">Get Started</Link>
                        </div>
                    </div>
                </nav>
            </div>
            <style>{`
            /* CSS Variables for Theme Switching */
            :root {
                /* Light theme colors (default) */
                --bg-primary: #ffffff;
                --bg-secondary: #f8f9fa;
                --bg-tertiary: #e9ecef;
                --text-primary: #212529;
                --text-secondary: #6c757d;
                --text-tertiary: #495057;
                --border-color: #dee2e6;
                --accent-color: #c80808;
                --accent-hover: #a00606;
                --shadow-color: rgba(0, 0, 0, 0.1);
                --card-bg: #ffffff;
                --navbar-bg: rgba(255, 255, 255, 0.95);
                --footer-bg: #f8f9fa;
            }

            [data-theme="dark"] {
                /* Dark theme colors */
                --bg-primary: #121212;
                --bg-secondary: #000000;
                --bg-tertiary: #2d2d2d;
                --text-primary: #ffffff;
                --text-secondary: #b0b0b0;
                --text-tertiary: #d0d0d0;
                --border-color: #404040;
                --accent-color: #c80808;
                --accent-hover: #e50909;
                --shadow-color: rgba(0, 0, 0, 0.3);
                --card-bg: #000000;
                --navbar-bg: rgba(0, 0, 0, 0.95);
                --footer-bg: #121212;
            }

            /* Apply CSS variables to entire website */
            body {
                background-color: var(--bg-primary);
                color: var(--text-primary);
                // transition: background-color 0.3s ease, color 0.3s ease;
            }

            /* Navbar Styles */
            .sticky-navbar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 1000;
                // background-color: transparent;
                transition: all 0.3s ease;
                // background-color: var(--navbar-bg);
            }

            body {
                padding-top: 80px;
            }

            .hero-container {
                padding: 0 20px;
            }

            .navbar {
                padding: 20px 0;
                transition: all 0.3s ease;
            }

            .navbar-brand {
                display: flex;
                align-items: center;
            }

            // .logo {
            //     height: 40px;
            //     width: auto;
            //     transition: all 0.3s ease;
            // }

            // .nav-link-container {
            //     flex-grow: 1;
            //     display: flex;
            //     justify-content: center;
            // }

            .navbar-nav {
                display: flex;
                align-items: center;
                gap: 30px;
            }

            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            .sticky-navbar {
                animation: slideDown 0.3s ease;
            }

            /* Apply theme colors to navbar */
            .sticky-navbar.scrolled {
                background-color: var(--navbar-bg);
                backdrop-filter: blur(10px);
                box-shadow: 0 5px 20px var(--shadow-color);
            }

            /* Navigation Links */
            .nav-link {
                color: var(--text-primary) !important;
                background: none !important;
                transition: color 0.3s ease;
            }

            // .nav-link:hover,
            // .nav-link.active {
            //     color: var(--accent-color) !important;
            // }

            /* Dropdown Menus */
            .dropdown-menu {
                background-color: var(--card-bg);
                border: 1px solid var(--border-color);
                box-shadow: 0 10px 30px var(--shadow-color);
            }

            .dropdown-item {
                color: var(--text-primary);
                transition: all 0.3s ease;
            }

            .dropdown-item:hover,
            .dropdown-item:focus {
                background-color: var(--bg-tertiary);
                color: var(--accent-color);
            }

            /* Theme Toggle Button */
            .theme-toggle-btn {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                padding: 0;
                flex-shrink: 0;
                margin-right: 15px;
                background: transparent;
                border: 2px solid var(--text-primary);
                color: var(--text-primary);
            }

            .theme-toggle-btn:hover {
                transform: rotate(15deg) scale(1.1);
                opacity: 0.8;
            }

            .theme-toggle-btn:active {
                transform: scale(0.95);
            }

            /* Theme Icons */
            .theme-icon {
                width: 20px;
                height: 20px;
                transition: all 0.3s ease;
            }

            .sun-icon {
                color: #ffc107;
            }

            .moon-icon {
                color: #b4abab;
            }

            /* Mobile menu button */
            .navbar-toggler.nav-btn {
                border: none;
                background: transparent;
                padding: 8px;
                font-size: 1.5rem;
                display: none;
                cursor: pointer;
                transition: all 0.3s ease;
                color: var(--accent-color) !important;
                z-index: 999;
            }

            .navbar-toggler.nav-btn:hover {
                opacity: 0.8;
            }

            .navbar-toggler.nav-btn:focus {
                box-shadow: none;
                outline: none;
            }

            // /* Get Started Button */
            // .btn-accent {
            //     background-color: var(--accent-color);
            //     color: white;
            //     border: none;
            //     padding: 10px 25px;
            //     border-radius: 5px;
            //     transition: all 0.3s ease;
            // }

            .btn-accent:hover {
                background-color: var(--accent-hover);
                transform: translateY(-2px);
                // box-shadow: 0 5px 15px rgba(200, 8, 8, 0.3);
            }

            /* Mobile responsive */
            @media (max-width: 991px) {
                .navbar-toggler.nav-btn {
                    display: block;
                }
                
                .nav-link-container {
                    justify-content: flex-start;
                }
                
                .navbar-nav {
                    flex-direction: column;
                    gap: 15px;
                    padding: 20px 0;
                }
                
                .dropdown-menu {
                    border: none;
                    box-shadow: none;
                    background: transparent;
                }
            }
            `}</style>
        </header>
    );
};

export default Navbar;
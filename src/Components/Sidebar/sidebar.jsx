import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function Sidebar() {
    const overlayRef = useRef(null);
    const sidebarRef = useRef(null);
    const [session, setSession] = useState(null);

useEffect(() => {
    let mounted = true;

    const getSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
            setSession(session);
        }
    };

    getSession();

    const {
        data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
    });

    return () => {
        mounted = false;
        subscription.unsubscribe();
    };
}, []);

const handleSidebarSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Sign out failed:", error.message);
        return;
    }

    setSession(null);

    // Close the mobile sidebar
    const sidebar = sidebarRef.current;
    const overlay = overlayRef.current;

    sidebar?.classList.remove("active");
    overlay?.classList.remove("active");
};

    useEffect(() => {
        const menuBtn = document.querySelector(".nav-btn"); // tombol dari Navbar
        const closeBtn = sidebarRef.current?.querySelector(".close-btn");
        const overlay = overlayRef.current;
        const sidebar = sidebarRef.current;

        function openSidebar() {
            overlay.classList.add("active");
            setTimeout(() => {
                sidebar.classList.add("active");
            }, 200);
        }

        function closeSidebar() {
            sidebar.classList.remove("active");
            setTimeout(() => {
                overlay.classList.remove("active");
            }, 200);
        }

        // Open/close via menu button, close button, and overlay
        menuBtn?.addEventListener("click", openSidebar);
        closeBtn?.addEventListener("click", closeSidebar);
        overlay?.addEventListener("click", closeSidebar);

        // Close sidebar when any link inside it is clicked
        const links = sidebar?.querySelectorAll("a, .nav-link");
        const handleLinkClick = () => {
            closeSidebar();
        };
        links?.forEach((link) => {
            link.addEventListener("click", handleLinkClick);
        });

        return () => {
            menuBtn?.removeEventListener("click", openSidebar);
            closeBtn?.removeEventListener("click", closeSidebar);
            overlay?.removeEventListener("click", closeSidebar);
            links?.forEach((link) => {
                link.removeEventListener("click", handleLinkClick);
            });
        };
    }, []);

    useEffect(() => {
        const dropdownBtns = sidebarRef.current?.querySelectorAll(".sidebar-dropdown-btn");

        function handleDropdownClick(e) {
            const btn = e.currentTarget;
            const dropdownMenu = btn.parentElement.nextElementSibling;
            const isOpen = dropdownMenu.classList.contains("active");

            sidebarRef.current
                .querySelectorAll(".sidebar-dropdown-menu")
                .forEach((menu) => {
                    menu.classList.remove("active");
                });

            if (!isOpen) dropdownMenu.classList.add("active");
        }

        dropdownBtns?.forEach((btn) => {
            btn.addEventListener("click", handleDropdownClick);
        });

        return () => {
            dropdownBtns?.forEach((btn) => {
                btn.removeEventListener("click", handleDropdownClick);
            });
        };
    }, []);

    return (
        <aside>
            <div ref={overlayRef} className="sidebar-overlay"></div>
            <div ref={sidebarRef} className="sidebar">
                <div className="sidebar-header">
                    <NavLink className="navbar-brand" to="/" >
                        {/* <img
                            src="/assets/images/logo.webp"
                            className="img-fluid logo"
                            alt="Logo"
                        /> */}
                        <div className="navbar-brand-text" >
                            <span className="brand-name-2">SIDDIQUI<span className="brand-name">.DIGITAL</span></span>
                            <span className="brand-tagline">BUSINESS SOLUTIONS</span>
                        </div>
                    </NavLink>
                    <button className="close-btn">
                        <span>X</span>
                    </button>
                </div>

                <ul className="menu">
                    <li>
                        <NavLink to="/" end>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">About Us</NavLink>
                    </li>
                    <li>
                        <NavLink to="/framework">Frameworks</NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses">Learning</NavLink>
                    </li>
                    <li>
                        <NavLink to="/ask-sid">Ask SID</NavLink>
                    </li>
                    <li className="below-dropdown">
                        <NavLink to="/blog-page">Blog</NavLink>
                    </li>
                    <li>
                        <NavLink to="/consultation">Advisory</NavLink>
                    </li>

                    

                    {/* <li className="sidebar-dropdown below-dropdown">
                        <div className="dropdown-header">
                            <NavLink href="/portfolio">Course</NavLink>
                        </div>
                        <ul className="sidebar-dropdown-menu">
                            <li>
                                <NavLink to="/portfolio">Portfolio</NavLink>
                            </li>
                            <li>
                                <NavLink to="/portfolio-detail">Portfolio Details</NavLink>
                            </li>
                        </ul>
                    </li> */}

                    {/* <li className="sidebar-dropdown">
                        <div className="dropdown-header">
                            <NavLink href="/consultation">Consultation</NavLink>
                        </div>
                        <ul className="sidebar-dropdown-menu">
                            <li>
                                <NavLink to="/pricing">Pricing</NavLink>
                            </li>
                            <li>
                                <NavLink to="/team">Team</NavLink>
                            </li>
                            <li>
                                <NavLink to="/testimonial">Testimonial</NavLink>
                            </li>
                            <li>
                                <NavLink to="/faq">FAQs</NavLink>
                            </li>
                            <li>
                                <NavLink to="/404-page">404 Page</NavLink>
                            </li>
                            <li>
                                <NavLink to="/blog">Blog Archive</NavLink>
                            </li>
                            <li>
                                <NavLink to="/single-post">Single Post</NavLink>
                            </li>
                        </ul>
                    </li> */}

                    
                    <li className="below-dropdown">
                        <NavLink to="/contact">Contact Us</NavLink>
                    </li>
                    {/* Account Navigation */}
<li className="sidebar-account-section">
    <div className="sidebar-account-divider"></div>

    {session ? (
        <>
            <div className="sidebar-account-heading">
                My Account
            </div>

            <NavLink to="/my-library">
                <i className="fa-solid fa-book-open"></i>
                My Books &amp; Orders
            </NavLink>

            <button
                type="button"
                className="sidebar-account-button"
                onClick={handleSidebarSignOut}
            >
                <i className="fa-solid fa-right-from-bracket"></i>
                Sign Out
            </button>
        </>
    ) : (
        <NavLink to="/login?redirect=/my-library">
            <i className="fa-solid fa-right-to-bracket"></i>
            Sign In
        </NavLink>
    )}
</li>
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
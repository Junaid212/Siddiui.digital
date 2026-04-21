import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
    const overlayRef = useRef(null);
    const sidebarRef = useRef(null);

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
                    <div className="logo">
                        <img
                            src="/assets/images/logo.webp"
                            className="img-fluid logo"
                            alt="Logo"
                        />
                    </div>
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
                        <NavLink to="/e_books">E-Book</NavLink>
                    </li>
                    <li>
                        <NavLink to="/courses">Course</NavLink>
                    </li>
                    <li>
                        <NavLink to="/consultation">Consultation</NavLink>
                    </li>

                    {/* <li className="sidebar-dropdown">
                        <div className="dropdown-header">
                            <NavLink to="/e_books">E-Book</NavLink>
                        </div>
                    </li> */}

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
                        <NavLink to="/blog-page">Blog</NavLink>
                    </li>
                    <li className="below-dropdown">
                        <NavLink to="/contact">Contact Us</NavLink>
                    </li>
                </ul>
            </div>
        </aside>
    );
}

export default Sidebar;
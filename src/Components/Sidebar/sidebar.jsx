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

        menuBtn?.addEventListener("click", openSidebar);
        closeBtn?.addEventListener("click", closeSidebar);
        overlay?.addEventListener("click", closeSidebar);

        return () => {
        menuBtn?.removeEventListener("click", openSidebar);
        closeBtn?.removeEventListener("click", closeSidebar);
        overlay?.removeEventListener("click", closeSidebar);
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

                    <li className="sidebar-dropdown">
                        <div className="dropdown-header">
                        <a href="#">Services</a>
                        <button className="sidebar-dropdown-btn">
                            <i className="fa-solid fa-angle-down"></i>
                        </button>
                        </div>
                        <ul className="sidebar-dropdown-menu">
                            <li>
                                <NavLink to="/services">Service</NavLink>
                            </li>
                            <li>
                                <NavLink to="/service-detail">Service Details</NavLink>
                            </li>
                        </ul>
                    </li>

                    <li className="sidebar-dropdown below-dropdown">
                        <div className="dropdown-header">
                        <a href="#">Portfolio</a>
                        <button className="sidebar-dropdown-btn">
                            <i className="fa-solid fa-angle-down"></i>
                        </button>
                        </div>
                        <ul className="sidebar-dropdown-menu">
                        <li>
                            <NavLink to="/portfolio">Portfolio</NavLink>
                        </li>
                        <li>
                            <NavLink to="/portfolio-detail">Portfolio Details</NavLink>
                        </li>
                        </ul>
                    </li>

                    <li className="sidebar-dropdown">
                        <div className="dropdown-header">
                            <a href="#">Pages</a>
                            <button className="sidebar-dropdown-btn">
                                <i className="fa-solid fa-angle-down"></i>
                            </button>
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

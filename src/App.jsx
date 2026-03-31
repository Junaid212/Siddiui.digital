import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AppRouters from "./Router";
import { ModalVideoProvider } from "./Components/Video/ModalVideoContext";
import Navbar from "./Components/Header/header";
import Footer from "./Components/Footer/footer";
import Sidebar from "./Components/Sidebar/sidebar";
import ScrollToTop from "./Components/ScrollToTop";
import PageTransition from "./Components/PageTransition"; // <-- import the transition component
import CustomCursor from "./Components/CustomCursor";
import PopupManager from "./Page/PopupManager";

// Handles GitHub Pages SPA redirect (pairs with 404.html + index.html script)
const RedirectHandler = () => {
    const navigate = useNavigate();
    useEffect(() => {
        const redirect = sessionStorage.getItem('gh-pages-redirect');
        if (redirect) {
            sessionStorage.removeItem('gh-pages-redirect');
            navigate(redirect, { replace: true });
        }
    }, [navigate]);
    return null;
};

const App = () => {
    return (
        <Router basename={import.meta.env.BASE_URL}>
            <RedirectHandler />
            <CustomCursor />
            <Navbar />
            <Sidebar />
            <ModalVideoProvider>
                <ScrollToTop />
                {/* Wrap only the dynamic routes with PageTransition */}
                <PageTransition>
                    <AppRouters />
                    <PopupManager/>
                </PageTransition>
            </ModalVideoProvider>
            <Footer />
        </Router>
    );
};

export default App;
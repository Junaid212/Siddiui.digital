import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppRouters from "./Router";
import { ModalVideoProvider } from "./Components/Video/ModalVideoContext";
import Navbar from "./Components/Header/header";
import Footer from "./Components/Footer/footer";
import Sidebar from "./Components/Sidebar/sidebar";
import ScrollToTop from "./Components/ScrollToTop";
import PageTransition from "./Components/PageTransition"; // <-- import the transition component
import CustomCursor from "./Components/CustomCursor";
import PopupManager from "./Page/PopupManager";

const AppContent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Handle GitHub Pages 404 redirect
        const redirect = new URLSearchParams(window.location.search).get('redirect');
        if (redirect) {
            // Remove the query parameter from history and navigate
            window.history.replaceState(null, '', window.location.pathname);
            navigate(redirect);
        }
    }, [navigate]);

    return (
        <>
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
        </>
    );
};

const App = () => {
    return (
        <Router>
            <AppContent />
        </Router>
    );
};

export default App;
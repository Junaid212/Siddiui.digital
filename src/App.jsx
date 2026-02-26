import { BrowserRouter as Router } from "react-router-dom";
import AppRouters from "./Router";
import { ModalVideoProvider } from "./Components/Video/ModalVideoContext";
import Navbar from "./Components/Header/header";
import Footer from "./Components/Footer/footer";
import Sidebar from "./Components/Sidebar/sidebar";
import ScrollToTop from "./Components/ScrollToTop";
import PageTransition from "./Components/PageTransition"; // <-- import the transition component
import CustomCursor from "./Components/CustomCursor";
import PopupManager from "./Page/PopupManager";

const App = () => {
    return (
        <Router basename={import.meta.env.BASE_URL}>
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
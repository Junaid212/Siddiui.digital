import { BrowserRouter as Router } from "react-router-dom";
import AppRouters from "./Router";
import { ModalVideoProvider } from "./Components/Video/ModalVideoContext";
import Navbar from "./Components/Header/header";
import Footer from "./Components/Footer/footer";
import Sidebar from "./Components/Sidebar/sidebar";
import ScrollToTop from "./Components/ScrollToTop";
import PageTransition from "./Components/PageTransition";
import PopupManager from "./Page/PopupManager";
import { CartProvider } from "./Components/Cart/CartContext";
import CartDrawer from "./Components/Cart/CartDrawer";

const App = () => {
    return (
        <Router>
            <CartProvider>
                <Navbar />
                <Sidebar />
                <CartDrawer />
                <ModalVideoProvider>
                    <ScrollToTop />
                    <PageTransition>
                        <AppRouters />
                        <PopupManager/>
                    </PageTransition>
                </ModalVideoProvider>
                <Footer />
            </CartProvider>
        </Router>
    );
};

export default App;
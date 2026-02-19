import { BrowserRouter as Router } from "react-router-dom"
import AppRouters from "./Router";
import { ModalVideoProvider } from "./Components/Video/ModalVideoContext";
import Navbar from "./Components/Header/header";
import Footer from "./Components/Footer/footer";
import Sidebar from "./Components/Sidebar/sidebar";
import ScrollToTop from "./Components/ScrollToTop";

const App = () => {
    return(
        <Router>
            <Navbar />
            <Sidebar />
                <ModalVideoProvider>
                    <ScrollToTop />
                    <AppRouters />
                </ModalVideoProvider>
            <Footer/>
        </Router>
    );
}

export default App
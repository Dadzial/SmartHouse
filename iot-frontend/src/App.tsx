import {BrowserRouter , Route , Routes , Navigate} from "react-router-dom";
import {isExpired} from "react-jwt";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => {
    const token = localStorage.getItem("token");
    const isExpiredToken = !token || isExpired(token);

    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={
                        isExpiredToken ? <Navigate to="/" /> : <Dashboard />
                    } />
                    <Route path="/signup" element={<SignUp />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;

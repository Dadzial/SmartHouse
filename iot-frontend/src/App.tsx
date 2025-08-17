import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import LoginForm from "./components/Login";
import Dashboard from './components/Dashboard';

function App() {
    const token = localStorage.getItem("token");
    const isTokenExpired = !token || isExpired(token);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/dashboard" element={
                    isTokenExpired ? <Navigate replace to="/" /> : <Dashboard />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
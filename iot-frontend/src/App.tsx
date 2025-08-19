import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { isExpired } from "react-jwt";
import LoginForm from "./components/Login";
import SignUpForm from "./components/SignUpForm";
import LightsView from './components/LightsView.tsx';
import WeatherView from './components/WeatherView.tsx';

const App = () => {
    const token = localStorage.getItem("token");
    const isTokenExpired = !token || isExpired(token);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<SignUpForm />} />
                <Route path="/weather" element={<WeatherView/> } />
                <Route path="/lights" element={
                    isTokenExpired ? <Navigate replace to="/" /> : <LightsView />
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddAccount from "./pages/AddAccount";
import ModifyAccount from "./pages/ModifyAccount";
import TransactionManagement from "./pages/TransactionManagement";
import AddTransaction from "./pages/AddTransaction";
import Dashboard from "./pages/Dashboard";

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Welcome />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/add-account" element={<AddAccount />} />
                <Route path="/modify-account" element={<ModifyAccount />} />
                <Route path="/transaction-management" element={<TransactionManagement />} />
                <Route path="/transactions" element={<AddTransaction />} />
                <Route path="/dashboard" element={<Dashboard />} />

            </Routes>

        </BrowserRouter>

    );
}

export default App;
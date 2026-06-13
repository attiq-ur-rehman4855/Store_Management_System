import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Sales from './pages/Sales';
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={user ? <Products /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/sales" element={user ? <Sales /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
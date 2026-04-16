import { Routes, Route, Navigate } from "react-router-dom"; //
import { useAppSelector } from "../hooks/hook";
import MainLayout from "../components/layout/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import ProductDetails from "../pages/ProductDetails";

const AppRoutes = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />

        <Route path="/item/:id" element={<ProductDetails />} />

        {/* Login Page Logic:
           Agar user authenticated NAHI hai (!isAuthenticated), toh LoginPage dikhao.
           Agar user authenticated HAI, toh use wapas Home (/) par bhej do (Navigate).
        */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;

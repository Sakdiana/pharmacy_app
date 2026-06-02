import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Home from "./components/Home";
import LoadingSpinner from "./components/LoadingSpinner";

const Liked = lazy(() => import("./pages/Liked"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Auth = lazy(() => import("./pages/Auth"));
const UserPage = lazy(() => import("./pages/UserPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminProductForm = lazy(() => import("./pages/admin/AdminProductForm"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="product/:id" element={<ProductPage />} />
          <Route path="liked" element={<Liked />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="auth" element={<Auth />} />
          <Route path="userPage" element={<UserPage />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

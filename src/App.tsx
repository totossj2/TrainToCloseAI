import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/Header";
import RolePlayHeader from "./components/layout/RolePlayHeader";
import Footer from "./components/layout/Footer";
import HomePage from "./pages/HomePage";
import RolePlayPage from "./pages/RolePlayPage";
import DashboardPage from "./pages/DashboardPage";
import AuthCallback from "./components/auth/AuthCallback";
import RolePlayPageV2 from "./pages/RolePlayPageV2";

const AppContent = () => {
  const location = useLocation();
  const isRolePlayV2 = location.pathname === "/role-play-v2";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Toaster position="top-right" />
      {isRolePlayV2 ? <RolePlayHeader /> : <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/role-play" element={<RolePlayPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/role-play-v2" element={<RolePlayPageV2 />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

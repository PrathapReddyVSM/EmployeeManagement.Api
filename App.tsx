import { Navigate, Route, Routes, Link, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import EmployeeList from "./components/EmployeeList";
import Reports from "./components/Reports";
import Charts from "./components/Charts";

function Protected({ children }: { children: React.ReactNode }) {
  return localStorage.getItem("token") ? <>{children}</> : <Navigate to="/" replace />;
}

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.clear();
    navigate("/");
  }

  return (
    <div>
      <nav className="navbar">
        <div className="brand">Employee Management</div>
        <div className="nav-links">
          <Link to="/employees">Employees</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/charts">Charts</Link>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <main className="container">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/employees" element={<Protected><Layout><EmployeeList /></Layout></Protected>} />
      <Route path="/reports" element={<Protected><Layout><Reports /></Layout></Protected>} />
      <Route path="/charts" element={<Protected><Layout><Charts /></Layout></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
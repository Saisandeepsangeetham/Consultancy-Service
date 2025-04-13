import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Form from "./Pages/Form";
import ForgotPassword from "./Pages/ForgotPassword";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import ViewData from "./Pages/ViewData";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <Form />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view"
          element={
            <ProtectedRoute>
              <ViewData />
            </ProtectedRoute>
          }
        />

        <Route path="/forgotPsd" element={<ForgotPassword />} />

        <Route path="*" element={<Navigate to="/" replace />} />
        {/* "replace" prevents the user from pressing "Back" to return to the unknown route (it replaces it in the browser history). */}
      </Routes>
    </Router>
  );
}

export default App;

// src/App.jsx
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/routes/AppRouter";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer
        position="top-right" // Optional: Customize position, autoClose, etc.
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // Or "dark", "colored"
      />
    </BrowserRouter>
  );
};

export default App;

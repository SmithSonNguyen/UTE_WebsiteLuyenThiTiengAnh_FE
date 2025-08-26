import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { store } from "@/redux/store";
import { initializeAxiosInterceptors } from "@/utils/axiosInstance";

// Khởi tạo axios interceptors với store
initializeAxiosInterceptors(store);

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor } from "./redux/store";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

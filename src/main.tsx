import { createRoot } from "react-dom/client";
import App from "./App.tsx";

// context
import { UserProvider } from "./context/user/UserProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <App />
  </UserProvider>,
);

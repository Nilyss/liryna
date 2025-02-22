// styles
import "./utils/styles/global.scss";

// types
import { ReactElement } from "react";

// hooks | library
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// views
import AuthPage from "./views/authPage/AuthPage";
import HomeWithAuth from "./views/home/Home.tsx";
import ComponentPreview from "./views/componentPreview/ComponentPreview.tsx";
import WebDevelopmentWithAuth from "./views/webDevelopment/WebDevelopment.tsx";
import UtilsWithAuth from "./views/utils/Utils.tsx";

function App(): ReactElement {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />}></Route>
        <Route path={"auth"} element={<AuthPage />}></Route>
        <Route path={"home"} element={<HomeWithAuth />}></Route>
        <Route path={"web_dev"} element={<WebDevelopmentWithAuth />}></Route>
        <Route path={"utils"} element={<UtilsWithAuth />}></Route>

        <Route path={"component_preview"} element={<ComponentPreview />}
        ></Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

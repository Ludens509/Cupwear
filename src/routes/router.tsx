import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "../App";
import NotFoundPage  from "../screens/NotFoundPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<App />} />
        <Route path={"*"} element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

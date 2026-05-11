import { Route, Routes } from "react-router-dom";
import App from "../App";
import NotFoundPage  from "../screens/NotFoundPage";

const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path={"/"} element={<App />} />
        <Route path={"*"} element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRouter;

import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to={"/"} />} />
      <Route
        path="/"
        element={
          <Layout showHero>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/search/:city"
        element={
          <Layout showHero={false}>
            <SearchPage />
          
          </Layout>
        }
      />
      <Route path="/about" element={<div>About</div>} />
    </Routes>
  );
};

export default AppRoutes;

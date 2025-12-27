import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CityScene from "./components/CityScene";
import DurgaLiving from "./components/DurgaLiving";
import AitijyaBucket from "./components/AitijyaBucket";
import HeritageHighlights from "./components/HeritageHighlights";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Explore from "./components/Explore";
import HeritageBackground from "./components/HeritageBackground";

const Layout = () => {
  const location = useLocation();

  // 🔹 Hide Navbar only on Login page
  const hideNavbar = location.pathname === "/login";

  // Show background only on home page
  const showBackground = location.pathname === "/";

  return (
    <>
      {showBackground && <HeritageBackground />}
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* 🏠 HOME PAGE */}
        <Route
          path="/"
          element={
            <>
              <Hero />

              <CityScene />
              <DurgaLiving />
              <AitijyaBucket />
              <HeritageHighlights />
              <Contact />
            </>
          }
        />

        {/* 🌍 EXPLORE PAGE */}
        <Route path="/explore" element={<Explore />} />

        {/* 🔐 LOGIN PAGE */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;

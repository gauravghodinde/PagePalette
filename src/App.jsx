import React, { useState } from "react";
import Navbar from "./utlis/navbar";
import Home from "./pages/home";
import Landing from "./pages/landing";
import Footer from "./utlis/footer";

const App = () => {
  const [page, setPage] = useState(0);
  return (
    <div className="bg-white border-gray-200 dark:bg-teal-950 dark:text-white">
      <Navbar />
      <Home />
      <Footer/>
    </div>
  );
};

export default App;

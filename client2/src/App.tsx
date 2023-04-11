import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
import { ChakraProvider } from "@chakra-ui/react";
import Home from "./pages/home";
import Diary from "./pages/diary";
import Feedback from "./pages/feedback";
import ThankYou from "./pages/thankyou";

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/login" Component={Login} />
          <Route path="/register" Component={Register} />
          <Route path="/" Component={Home} />
          <Route path="/diary" Component={Diary} />
          <Route path="/feedback" Component={Feedback} />
          <Route path="/thankyou" Component={ThankYou} />

        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;

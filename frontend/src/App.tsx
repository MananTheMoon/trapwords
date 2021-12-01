import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Team } from "./pages/Team";
import { createStore } from "./store/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const store = createStore();
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/team/:teamNumber" element={<Team />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;

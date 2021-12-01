import React from "react";
import { Provider } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Team } from "./pages/Team";
import { createStore } from "./store/store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const store = createStore();
  return (
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team/:teamNumber" element={<Team />} />
      </Routes>
    </Provider>
  );
}

export default App;

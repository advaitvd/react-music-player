import "./App.css";
import React, { useState } from "react";
import AudioPlayer from "./Components/AudioPlayer";
import Uploader from "./Components/Uploader";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const getLocalStorage = () => {
  let filePath = localStorage.getItem("filePath");
  if (filePath) {
    return JSON.parse(localStorage.getItem("filePath"));
  } else {
    return "";
  }
};

function App() {
  const [, setPath] = useState("");
  const handlePathUpdate = (newPath) => {
    localStorage.setItem("filePath", JSON.stringify(newPath));
    setPath(newPath);
  };
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={<Uploader handlePathUpdate={handlePathUpdate} />}
          ></Route>
          <Route
            path="/audio-player"
            element={<AudioPlayer filePath={getLocalStorage()} />}
          ></Route>
          <Route path="/*" element={<h1>ERROR. PAGE NOT FOUND.</h1>}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

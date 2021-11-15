import React, { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { BsFillMusicPlayerFill } from "react-icons/bs";
import { Link } from "react-router-dom";

import axios from "axios";

function Uploader({ handlePathUpdate }) {
  const [file, setFile] = useState({ file: "", msg: "" });

  const handleChange = (e) => {
    setFile(() => e.target.files[0]);
  };

  const handleSubmit = async () => {
    let formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const { fileName, filePath } = res.data;
      // console.log(filePath);
      alert(`${fileName} has been uploaded and moved to ${filePath}`);
      handlePathUpdate(filePath);
    } catch (err) {
      if (err.response.status === "500") {
        console.log("There was a problem with the server");
      } else {
        console.log(err.response.data.msg);
      }
    }
  };

  return (
    <>
      <form
        className="uploader"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <label htmlFor="file">Upload audio file </label>
        <input type="file" className="select-file" onChange={handleChange} />
        <button type="submit" className="upload-btn">
          <FaUpload className="upload-icon" />
        </button>
        <button type="button" className="upload-btn">
          <Link to="/audio-player">
            <BsFillMusicPlayerFill className="upload-icon" />
          </Link>
        </button>
      </form>
    </>
  );
}

export default Uploader;

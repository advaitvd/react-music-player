import React, { useState, useRef, useEffect } from "react";
import { FaPlay } from "react-icons/fa";
import { FaPause } from "react-icons/fa";
import { MdReplay } from "react-icons/md";
import { AiOutlineScissor } from "react-icons/ai";
import { BsFillVolumeUpFill } from "react-icons/bs";
import { BsFillVolumeMuteFill } from "react-icons/bs";
import { BiZoomIn } from "react-icons/bi";
import { BiZoomOut } from "react-icons/bi";
import WaveSurfer from "wavesurfer.js";

// const LEN = 1000000;

function AudioPlayer({ toggleDisplayUploader, filePath }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMute, setIsMute] = useState(false);
  const [prevSetVol, setPrevSetVol] = useState(1);
  const [isDevMode, setIsDevMode] = useState(true);
  const [isReady, setIsReady] = useState(false);

  const animationRef = useRef();
  const volumeRef = useRef();
  const waveformRef = useRef();
  const zoomRef = useRef();

  useEffect(() => {
    waveformRef.current = WaveSurfer.create({
      container: "#waveform",
      waveColor: "rgba(78, 141, 204,0.8)",
      progressColor: "rgb(8, 40, 71)",
      barWidth: 0.5,
      pixelRatio: 3,
      partialRender: true,
      normalize: true,
      minPxPerSec: 5,
      cursorColor: "rgb(8, 40, 71)",
      cursorWidth: 2,
      scrollParent: true,
    });
    waveformRef.current.load(filePath);
    console.log("wave created!");
    return () => waveformRef?.current?.destroy();
  }, [filePath]);

  useEffect(() => {
    waveformRef?.current?.on("ready", handleReady);
    return () => waveformRef?.current?.un("ready", handleReady);
  });

  const handleReady = () => {
    setIsReady(true);
  };
  const calculateTime = (secs) => {
    if (!secs) {
      return "00:00";
    }
    const minutes = Math.floor(secs / 60);
    const returnedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(secs) % 60;
    const returnedSecs = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return returnedMinutes + ":" + returnedSecs;
  };

  const playTime = () => {
    if (!waveformRef?.current?.isPlaying()) {
      setIsPlaying(false);
    }
    setCurrentTime(waveformRef?.current?.getCurrentTime());
    animationRef.current = requestAnimationFrame(playTime);
  };

  const changeVolume = () => {
    waveformRef.current.setVolume(volumeRef.current.value / 100);
  };

  const handleZoom = () => {
    const val = Number(zoomRef.current.value);
    waveformRef.current.zoom(val);
  };

  return (
    <>
      {isReady ? <h2>Ready...</h2> : <h2>Loading...</h2>}
      <div className="audio--player">
        <div
          style={{
            background: "whitesmoke",
            boxShadow: "1px 1px 3px rgb(8, 40, 71)",
            marginTop: "20px",
            width: "550px",
            borderRadius: "10px",
            padding: "5px",
          }}
        >
          <div id="waveform" ref={waveformRef}></div>
        </div>
        <div className="timestamps">
          <p id="timestamp-item1">{calculateTime(currentTime)}</p>
          <p id="timestamp-item2">
            {waveformRef?.current?.getDuration()
              ? calculateTime(waveformRef?.current?.getDuration())
              : "00:00"}
          </p>
        </div>
        <div className="btns">
          {isReady && (
            <label className="switch">
              <input
                type="checkbox"
                checked={isDevMode}
                onChange={() => {
                  const prev = isDevMode;
                  setIsDevMode(!prev);
                }}
              />
              <span className="slider round"></span>
            </label>
          )}
          {isReady && (
            <div className="btn-clickable">
              <div
                className="btn"
                onClick={() => {
                  if (isPlaying) {
                    waveformRef.current.pause();
                  } else {
                    waveformRef.current.play();
                  }
                  const prev = isPlaying;
                  setIsPlaying(!prev);
                  if (!prev) {
                    animationRef.current = requestAnimationFrame(playTime);
                  } else {
                    cancelAnimationFrame(animationRef.current);
                  }
                }}
              >
                {isPlaying ? (
                  <FaPause className="icon" />
                ) : (
                  <FaPlay className="icon" />
                )}
              </div>
              <div
                className="btn"
                onClick={() => {
                  waveformRef.current.seekTo(0);
                  waveformRef.current.play();
                  setIsPlaying(true);
                }}
              >
                <MdReplay />
              </div>
              <div className="btn">
                <AiOutlineScissor />
              </div>
            </div>
          )}

          {isReady && (
            <div className="slide">
              <label
                htmlFor="volume"
                className="volume-label"
                onClick={() => {
                  const prev = isMute;
                  setIsMute(!prev);
                  if (!prev) {
                    const val = waveformRef.current.getVolume();
                    // volumeRef.current.value = 0;
                    // changeVolume();
                    setPrevSetVol(val);
                    waveformRef.current.setMute();
                  } else {
                    // volumeRef.current.value = prevSetVol;
                    // changeVolume();
                    waveformRef.current.setVolume(prevSetVol);
                  }
                }}
              >
                {isMute ? (
                  <BsFillVolumeMuteFill className="volume-icon" />
                ) : (
                  <BsFillVolumeUpFill className="volume-icon" />
                )}
              </label>
              <input
                className="range-slider"
                id="volume"
                type="range"
                min="0"
                max="100"
                defaultValue="100"
                onChange={() => {
                  changeVolume();
                  setIsMute(false);
                }}
                ref={volumeRef}
              ></input>
              <label htmlFor="zoom">
                <BiZoomOut
                  className="zoom zoom-out"
                  onClick={() => {
                    let val = Number(zoomRef.current.value);
                    zoomRef.current.value = Math.max(5, val - 10);
                    handleZoom();
                  }}
                />
              </label>
              <input
                className="range-slider"
                id="zoom"
                type="range"
                min="5"
                max="500"
                defaultValue="0"
                ref={zoomRef}
                onChange={handleZoom}
              ></input>
              <label htmlFor="zoom">
                <BiZoomIn
                  className="zoom zoom-in"
                  onClick={() => {
                    let val = Number(zoomRef.current.value);
                    val = Math.min(500, val + 10);
                    zoomRef.current.value = val;
                    handleZoom();
                  }}
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default AudioPlayer;

import React from "react";
import { useModalVideo } from "./ModalVideoContext";

const VideoButton = ({ videoUrl }) => {
  const { openModal } = useModalVideo();

  return (
    <button className="request-loader" onClick={() => openModal(videoUrl)}>
        <i className="fa-solid fa-play"></i>
    </button>
  );
}

export default VideoButton;

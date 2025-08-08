import React, { useRef, useState, useMemo } from "react";
import "./Loading.scss";

// import loadingImg from "../assets/images/loading-img.gif";
import loadingImg from "../assets/images/loading-gif.gif";

const Loading = ({}) => {
  return (
    <>
      <div className="loading">
        <img src={loadingImg} />
      </div>
    </>
  );
};

export default Loading;

import React, { useState, useRef, useEffect } from "react";
import TrimBar from "./TrimBar";

function VideoEditor() {
    const videoRef = useRef(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);

    useEffect(() => {
        const video = videoRef.current;
        video.addEventListener("loadedmetadata", function () {
            setVideoDuration(video.duration);
            setTrimEnd(video.duration);
        });
        video.addEventListener("timeupdate", function () {
            setCurrentTime(video.currentTime);
        });
    }, []);

    const handleTrim = (value, position) => {
        if (position === "start") {
            setTrimStart(value);
            videoRef.current.currentTime = value;
        } else {
            setTrimEnd(value);
            videoRef.current.currentTime = value;
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                videoRef.current.src = url;
            }} accept="video/*" />

            <video ref={videoRef} controls style={{ width: '50%', height:'50%' }}></video>

            {/*<div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>*/}
            {/*    <button onClick={() => handleTrim(currentTime, "start")}>Trim Start</button>*/}
            {/*    <button onClick={() => handleTrim(currentTime, "end")}>Trim End</button>*/}
            {/*</div>*/}

            {/*<div style={{ display: 'flex', alignItems: 'center', height: '30px', background: '#ddd' }}>*/}
            {/*    <div style={{ height: '10px', background: '#ff0000', width: `${(trimStart / videoDuration) * 100}%` }}></div>*/}
            {/*    <div style={{ height: '10px', background: '#00ff00', width: `${((trimEnd - trimStart) / videoDuration) * 100}%` }}></div>*/}
            {/*    <div style={{ height: '10px', background: '#ff0000', width: `${((videoDuration - trimEnd) / videoDuration) * 100}%` }}></div>*/}
            {/*</div>*/}
            <TrimBar
                videoDuration={videoDuration}
                trimStart={trimStart}
                trimEnd={trimEnd}
                setTrimStart={(value) => setTrimStart(value)}
                setTrimEnd={(value) => setTrimEnd(value)}/>
        </div>
    );
}

export default VideoEditor;

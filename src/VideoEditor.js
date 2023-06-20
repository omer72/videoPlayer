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

    useEffect(() =>{

    },[])

    const handleTrim = (value, position) => {
        if (position === "start") {
            setTrimStart(value);
            videoRef.current.currentTime = value;
        } else {
            setTrimEnd(value);
            videoRef.current.currentTime = value;
        }
    };

    const updateTime = (value) => {
        console.log(value.target.value);
        videoRef.current.currentTime = value.target.value;
    }

    const updateStartTime = (value) => {
        if (videoRef.current.currentTime < value){
            videoRef.current.currentTime = value;
        }
        setTrimStart(value);
    }

    const updateEndTime = (value) => {
        setTrimEnd(value);
    }

    const updateCurrentTime = (value) => {
        videoRef.current.currentTime = value;
    }

    const getVideoThumbnail = (videoUrl, secs) => {
        return new Promise((resolve, reject) => {
            let video = document.createElement('video');
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let source = document.createElement('source');

            source.src = videoUrl;
            video.appendChild(source);

            video.addEventListener('loadeddata', () => {
                video.currentTime = secs;
            }, false);

            video.addEventListener('seeked', () => {
                try {
                    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                    let img = new Image();
                    img.src = canvas.toDataURL();
                    resolve(img.src);
                } catch(e) {
                    reject(e);
                }
            }, false);

            video.addEventListener('error', () => {
                reject("Error when loading video");
            }, false);
        });
    }


    return (
        <div>
            <input type="file" onChange={(e) => {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                videoRef.current.src = url;
            }} accept="video/*" />
            <video ref={videoRef} controls style={{ width: '50%', height:'50%' }} controlsList="nofullscreen nodownload noremoteplayback noplaybackrate nofoobar" ></video>


            <TrimBar
                videoDuration={videoDuration}
                trimStart={trimStart}
                trimEnd={trimEnd}
                setTrimStart={updateStartTime}
                setTrimEnd={updateEndTime}
                currentTime={videoRef.current != null ? videoRef.current.currentTime: 0}
                setCurrentTime={updateCurrentTime}
            />
        </div>
    );
}

export default VideoEditor;

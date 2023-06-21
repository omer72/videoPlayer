import React, { useState, useRef, useEffect } from "react";
import TrimBar from "../TrimBar/TrimBar";
import './VideoEditor.css';

function VideoEditor() {
    const videoRef = useRef(null);
    const [videoDuration, setVideoDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [trimStart, setTrimStart] = useState(0);
    const [trimEnd, setTrimEnd] = useState(0);
    const [imagePath, setImagePath] = useState([]);
    const trimEndRef = useRef(trimEnd);

    // Update the ref value whenever count changes
    useEffect(() => {
        trimEndRef.current = trimEnd;
    }, [trimEnd]);

    useEffect(() => {
        const video = videoRef.current;
        video.addEventListener("loadedmetadata", function () {
            setVideoDuration(video.duration);
            setTrimEnd(video.duration);
        });
        video.addEventListener("timeupdate", function () {
            setCurrentTime(video.currentTime);
            if (video.currentTime > trimEndRef.current){
                video.pause();
            }
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
        if (videoRef.current.currentTime > value){
            videoRef.current.currentTime = value;
        }
        setTrimEnd(value);
    }

    const updateCurrentTime = (value) => {
        videoRef.current.currentTime = value;
    }

    function captureVideoThumbnails(videoUrl, imageCount) {
        return new Promise((resolve, reject) => {
            let video = document.createElement('video');
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            let thumbnails = [];
            let jumps = 0;
            video.addEventListener('loadedmetadata', () => {
                video.currentTime = 0;
                jumps = video.duration / imageCount ;
            });

            video.addEventListener('seeked', () => {
                // Create the thumbnail
                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                let thumbnail = canvas.toDataURL('image/jpeg');
                thumbnails.push(thumbnail);

                // Seek to the next interval or resolve the promise
                if (video.currentTime + jumps <= video.duration) {
                    video.currentTime += jumps;
                } else {
                    resolve(thumbnails);
                }
            });

            video.addEventListener('error', () => {
                reject("Error when loading video");
            });

            video.src = videoUrl;
            video.load();
        });
    }


    const loadVideo = (e) =>{
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        videoRef.current.src = url;
        captureVideoThumbnails(url,10).then(dataUrl => {
            // This is a base64 string of the first frame of the video.
            // You can use this as the src attribute of an img element, save it to a server, etc.
            console.log(dataUrl);
            setImagePath(dataUrl);
        });
    }

    return (
        <div>
            <input type="file" onChange={loadVideo} accept="video/*" /><br/>
            <div style={{display:"flex", justifyContent:"center"}}>
                {/*<div style={{display:"flex"}}>*/}
                {/*    {videoRef.current ? videoRef.current.currentTime : 0}<br/>*/}
                {/*    {trimStart}<br/>*/}
                {/*    {trimEnd}*/}
                {/*</div>*/}
            <video ref={videoRef} controls style={{ width: '50%', height:'50%' }} controlsList="nofullscreen nodownload noremoteplayback noplaybackrate nofoobar" ></video>

            </div>
            <TrimBar
                videoDuration={videoDuration}
                trimStart={trimStart}
                trimEnd={trimEnd}
                setTrimStart={updateStartTime}
                setTrimEnd={updateEndTime}
                currentTime={videoRef.current != null ? videoRef.current.currentTime: 0}
                setCurrentTime={updateCurrentTime}
                imagePath={imagePath}
            />

        </div>
    );
}

export default VideoEditor;

import React, { useState, useEffect } from "react";
import TriangleIcon from "../../assets/icon/traingle-icon.svg"
import './TrimBar.css';

const TrimBar = ({
                     videoDuration,
                     trimStart,
                     trimEnd,
                     setTrimStart,
                     setTrimEnd,
                     currentTime,
                     setCurrentTime,
                     imagePath
                 }) => {
    const [dragging, setDragging] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [movment, setMovment] = useState(0);

    const getRelativePosition = (e, element) => {
        const rect = element.getBoundingClientRect();
        return e.clientX - rect.left;
    };

    const updateTrim = (e, position) => {
        const videoProgress = document.getElementById("videoProgress");
        const newTime =
            (getRelativePosition(e, videoProgress) / videoProgress.offsetWidth) *
            videoDuration;
        setMovment(newTime - currentPosition);
        const directionRight = newTime >= currentPosition ? true : false;
        setCurrentPosition(newTime);
        switch (position){
            case 'start':
                setTrimStart(newTime);
                break;
            case 'end':
                setTrimEnd(newTime);
                break;
            case 'both':
                setTrimStart(trimStart + movment);
                setTrimEnd(trimEnd + movment);
                console.log('newTime: ' + newTime);
                break;
            case 'cursor':
                if (newTime < trimEnd && newTime > trimStart) {
                    setCurrentTime(newTime);
                }
                break;
            default:
                break;
        }

    };

    useEffect(() => {
        const mouseMoveListener = (e) => {
            e.stopPropagation();
            if (dragging) {
                updateTrim(e, dragging);
            }
        };

        const mouseUpListener = () => {
            setDragging(null);
        };

        window.addEventListener("mousemove", mouseMoveListener);
        window.addEventListener("mouseup", mouseUpListener);

        return () => {
            window.removeEventListener("mousemove", mouseMoveListener);
            window.removeEventListener("mouseup", mouseUpListener);
        };
    }, [dragging, updateTrim]);

    return (
        <div className="trimBar">
        <div className="sliderBackground" id="videoProgress">
            <div className="sliderEmpty"
                style={{
                    width: `${(trimStart / videoDuration) * 100}%`
                }}
            ></div>
            <div className="sliderStart" onMouseDown={() => setDragging("start")}
            />
            <div className="sliderCenter"
                style={{width: `${((trimEnd - trimStart) / videoDuration) * 100}%`}}
                onMouseDown={() => setDragging("both")}
            >
            </div>
            <div className="sliderEnd" onMouseDown={() => setDragging("end")}
            />
            <div className="sliderEmpty"
                style={{
                    width: `${((videoDuration - trimEnd) / videoDuration) * 100}%`
                }}
            ></div>

        </div>
            <div id="videoProgressCursor" className="videoProgressCursor">
                <div className="videoProgressCursorBefore"
                    style={{paddingRight: `${(currentTime/videoDuration)*100}%`}}>
                </div>
                <div>
                    <img src={TriangleIcon}/>
                    <div
                        style={{
                        width: "2px",
                        height: "80px",
                        background: "#babad7",
                        cursor: "pointer",
                    }}
                        onMouseDown={() => setDragging("cursor")}>
                </div>
                </div>
            </div>
            <div className="videoImages">
                {imagePath.map((imgUrl, index) =>{
                    return <img src={imgUrl} key={index} style={{width:`${100 / imagePath.length}%`}}/>
                })}
            </div>
        </div>

    );
};

export default TrimBar;
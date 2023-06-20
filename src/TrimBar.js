import React, { useState, useEffect } from "react";

const TrimBar = ({
                     videoDuration,
                     trimStart,
                     trimEnd,
                     setTrimStart,
                     setTrimEnd,
                     currentTime,
                     setCurrentTime
                 }) => {
    const [dragging, setDragging] = useState(null);

    const getRelativePosition = (e, element) => {
        const rect = element.getBoundingClientRect();
        return e.clientX - rect.left;
    };

    const updateTrim = (e, position) => {
        const videoProgress = document.getElementById("videoProgress");
        const newTime =
            (getRelativePosition(e, videoProgress) / videoProgress.offsetWidth) *
            videoDuration;

        switch (position){
            case 'start':
                setTrimStart(newTime);
                break;
            case 'end':
                setTrimEnd(newTime);
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
        <div>
        <div
            id="videoProgress"
            style={{
                display: "flex",
                alignItems: "center",
                height: "30px",
                background: "#ddd"
            }}
        >
            <div
                style={{
                    height: "10px",
                    background: "#ff0000",
                    width: `${(trimStart / videoDuration) * 100}%`
                }}
            ></div>
            <div
                style={{
                    height: "10px",
                    background: "#00ff00",
                    width: `${((trimEnd - trimStart) / videoDuration) * 100}%`
                }}
                //onMouseDown={() => setDragging("both")}
            >
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        background: "#0000ff",
                        cursor: "pointer"
                    }}
                    onMouseDown={() => setDragging("start")}
                />

            </div>
            <div
                style={{
                    width: "10px",
                    height: "10px",
                    background: "#0000ff",
                    cursor: "pointer"
                }}
                onMouseDown={() => setDragging("end")}
            />
            <div
                style={{
                    height: "10px",
                    background: "#ff0000",
                    cursor: "pointer",
                    width: `${((videoDuration - trimEnd) / videoDuration) * 100}%`
                }}

            ></div>

        </div>
            <div id="videoProgress2"
                 style={{
                     display: "flex",
                     alignItems: "center",
                     height: "30px",
                     background: "#ddd"
                 }}>
                <div
                    style={{
                        width: "10px",
                        height: "10px",
                        background: "#ddd",
                        paddingRight: `${(currentTime/videoDuration)*100}%`
                    }}>
                </div>
                <div
                        style={{
                        width: "10px",
                        height: "10px",
                        background: "#babad7",
                        cursor: "pointer",
                    }}
                        onMouseDown={() => setDragging("cursor")}>
                </div>
            </div>
        </div>

    );
};

export default TrimBar;

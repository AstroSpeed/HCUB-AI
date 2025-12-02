/**
 * @fileoverview Webcam component for face detection
 */

import React, { useRef, useEffect, useState } from "react";
import { Camera, CameraOff } from "lucide-react";

const Webcam = ({
  onFrame,
  isActive = true,
  width = 640,
  height = 480,
  className = "",
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [error, setError] = useState(null);

  // Initialize webcam
  useEffect(() => {
    let mounted = true;

    const startWebcam = async () => {
      try {
        setError(null);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: width },
            height: { ideal: height },
            facingMode: "user",
          },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            if (mounted) {
              setIsCameraReady(true);
            }
          };
        }
      } catch (err) {
        console.error("Webcam error:", err);
        if (mounted) {
          setError(err.message || "Failed to access camera");
        }
      }
    };

    if (isActive) {
      startWebcam();
    }

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      setIsCameraReady(false);
    };
  }, [isActive, width, height]);

  // Process frames
  useEffect(() => {
    if (!isCameraReady || !isActive || !onFrame) {
      return;
    }

    const intervalId = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState === 4) {
        onFrame(videoRef.current);
      }
    }, 100); // Process every 100ms (10 FPS)

    return () => {
      clearInterval(intervalId);
    };
  }, [isCameraReady, isActive, onFrame]);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-secondary/50 rounded-lg border border-border ${className}`}
        style={{ width, height }}
      >
        <CameraOff size={48} className="text-muted-foreground mb-4" />
        <p className="text-sm text-destructive font-medium mb-2">
          Camera Error
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          {error}
        </p>
        <p className="text-xs text-muted-foreground text-center max-w-xs mt-2">
          Please ensure camera permissions are granted.
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-full object-cover rounded-lg border border-border"
        style={{ transform: "scaleX(-1)" }} // Mirror image
      />
      {!isCameraReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/80 rounded-lg">
          <Camera
            size={48}
            className="text-muted-foreground mb-4 animate-pulse"
          />
          <p className="text-sm text-muted-foreground">
            Initializing camera...
          </p>
        </div>
      )}
    </div>
  );
};

export default Webcam;

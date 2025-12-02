/**
 * @fileoverview Live face recognition component
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  UserCheck,
  Users,
  Loader2,
  PlayCircle,
  StopCircle,
} from "lucide-react";
import Webcam from "./Webcam";
import { useFaceRecognition } from "../hooks/useFaceRecognition";
import { useAttendance } from "../hooks/useAttendance";
import { useToast } from "../context/ToastContext";
import * as faceRecognition from "../utils/faceRecognition";

const LiveRecognition = ({ sessionId, onRecognized }) => {
  const { isModelLoaded, detectFaces, recognizeFaces, getEnrolledCount } =
    useFaceRecognition();
  const { recordAttendance } = useAttendance();
  const { addToast } = useToast();

  const [isActive, setIsActive] = useState(false);
  const [recognizedStudents, setRecognizedStudents] = useState(new Set());
  const [currentDetections, setCurrentDetections] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const processingRef = useRef(false);

  // Process video frame
  const handleFrame = useCallback(
    async (video) => {
      if (!isActive || !isModelLoaded || processingRef.current) {
        return;
      }

      processingRef.current = true;
      videoRef.current = video;

      try {
        // Detect faces
        const detections = await detectFaces(video);
        setCurrentDetections(detections);

        if (detections.length > 0) {
          // Recognize faces
          const matches = recognizeFaces(detections);

          if (matches.length > 0) {
            // Draw detections on canvas
            if (canvasRef.current) {
              const matchMap = {};
              matches.forEach((match) => {
                matchMap[match.index] = match;
              });
              faceRecognition.drawDetections(
                canvasRef.current,
                detections,
                matchMap
              );
            }

            // Process each match
            matches.forEach(async (match) => {
              if (!recognizedStudents.has(match.studentId)) {
                // Mark as recognized
                setRecognizedStudents(
                  (prev) => new Set([...prev, match.studentId])
                );

                // Add to recent matches
                setRecentMatches((prev) => [
                  {
                    ...match,
                    timestamp: new Date(),
                  },
                  ...prev.slice(0, 4), // Keep last 5
                ]);

                // Record attendance
                if (sessionId) {
                  await recordAttendance({
                    studentId: match.studentId,
                    sessionId,
                    courseId: "", // Should be provided
                    status: "present",
                    detectionMethod: "ai",
                    confidence: parseFloat(match.confidence) / 100,
                    location: "Live Recognition",
                  });
                }

                // Show toast
                addToast({
                  type: "success",
                  message: `${match.name} recognized`,
                  description: `Confidence: ${match.confidence}% - Attendance marked`,
                });

                // Callback
                onRecognized?.(match);
              }
            });
          } else if (canvasRef.current) {
            // Draw detections without matches
            faceRecognition.drawDetections(canvasRef.current, detections, {});
          }
        } else if (canvasRef.current) {
          // Clear canvas
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      } catch (error) {
        console.error("Recognition error:", error);
      } finally {
        processingRef.current = false;
      }
    },
    [
      isActive,
      isModelLoaded,
      detectFaces,
      recognizeFaces,
      recognizedStudents,
      sessionId,
      recordAttendance,
      addToast,
      onRecognized,
    ]
  );

  // Toggle recognition
  const toggleRecognition = () => {
    if (!isModelLoaded) {
      addToast({
        type: "error",
        message: "AI models not loaded",
        description:
          "Please wait for models to load before starting recognition",
      });
      return;
    }

    const enrolledCount = getEnrolledCount();
    if (enrolledCount === 0) {
      addToast({
        type: "warning",
        message: "No enrolled students",
        description:
          "Please enroll at least one student before starting recognition",
      });
      return;
    }

    setIsActive(!isActive);
    if (!isActive) {
      setRecognizedStudents(new Set());
      setRecentMatches([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Live Face Recognition</h3>
          <p className="text-sm text-muted-foreground">
            {isModelLoaded
              ? `${getEnrolledCount()} students enrolled`
              : "Loading AI models..."}
          </p>
        </div>
        <button
          onClick={toggleRecognition}
          disabled={!isModelLoaded}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${
            isActive
              ? "bg-red-600 text-white hover:bg-red-700"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {!isModelLoaded ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Loading Models...
            </>
          ) : isActive ? (
            <>
              <StopCircle size={18} />
              Stop Recognition
            </>
          ) : (
            <>
              <PlayCircle size={18} />
              Start Recognition
            </>
          )}
        </button>
      </div>

      {/* Video Feed */}
      <div className="relative rounded-lg overflow-hidden bg-secondary/50">
        <Webcam
          onFrame={handleFrame}
          isActive={isActive}
          width={640}
          height={480}
          className="relative z-10"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none"
        />
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-30">
            <div className="text-center">
              <Camera size={64} className="mx-auto text-white/60 mb-4" />
              <p className="text-white/80 font-medium">
                Click "Start Recognition" to begin
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-accent/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <UserCheck size={24} className="text-primary" />
            <div>
              <p className="text-2xl font-bold">{recognizedStudents.size}</p>
              <p className="text-sm text-muted-foreground">Recognized Today</p>
            </div>
          </div>
        </div>
        <div className="bg-accent/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <Users size={24} className="text-primary" />
            <div>
              <p className="text-2xl font-bold">{currentDetections.length}</p>
              <p className="text-sm text-muted-foreground">Faces Detected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-medium text-sm mb-3">Recent Recognitions</h4>
          <div className="space-y-2">
            <AnimatePresence>
              {recentMatches.map((match, index) => (
                <motion.div
                  key={`${match.studentId}-${match.timestamp}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-sm">{match.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(match.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      {match.confidence}%
                    </p>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveRecognition;

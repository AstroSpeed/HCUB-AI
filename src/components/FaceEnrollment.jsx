/**
 * @fileoverview Face enrollment component for enrolling students
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Check, AlertCircle, Loader2 } from "lucide-react";
import Webcam from "./Webcam";
import { useFaceRecognition } from "../hooks/useFaceRecognition";

const FaceEnrollment = ({ student, isOpen, onClose, onSuccess }) => {
  const { isModelLoaded, enrollFace } = useFaceRecognition();
  const [status, setStatus] = useState("idle"); // idle, capturing, success, error
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setMessage("");
      setProgress(0);
      setIsCameraActive(true);
    } else {
      setIsCameraActive(false);
    }
  }, [isOpen]);

  const handleEnroll = async () => {
    if (!videoRef.current || status === "capturing") return;

    setStatus("capturing");
    setMessage("Capturing face samples...");
    setProgress(0);

    const SAMPLES = 5;
    const SAMPLE_DELAY = 800;

    try {
      for (let i = 0; i < SAMPLES; i++) {
        setProgress(((i + 1) / SAMPLES) * 100);
        setMessage(`Capturing sample ${i + 1} of ${SAMPLES}...`);
        await new Promise((resolve) => setTimeout(resolve, SAMPLE_DELAY));
      }

      const result = await enrollFace(
        student.id,
        `${student.firstName} ${student.lastName}`,
        videoRef.current,
        SAMPLES
      );

      if (result.success) {
        setStatus("success");
        setMessage(result.message);
        setProgress(100);
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 2000);
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    } catch (error) {
      setStatus("error");
      setMessage("Enrollment failed: " + error.message);
    }
  };

  const handleFrame = (video) => {
    videoRef.current = video;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-card w-full max-w-2xl rounded-xl shadow-2xl border border-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">Enroll Face Recognition</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {student.firstName} {student.lastName} ({student.studentId})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!isModelLoaded ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 size={48} className="animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">
                Loading AI models...
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-center">
                <Webcam
                  onFrame={handleFrame}
                  isActive={isCameraActive}
                  width={480}
                  height={360}
                  className="rounded-lg"
                />
              </div>

              {/* Instructions */}
              <div className="bg-accent/50 p-4 rounded-lg">
                <h3 className="font-medium text-sm mb-2">Instructions:</h3>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Position your face clearly in the camera view</li>
                  <li>Ensure good lighting on your face</li>
                  <li>Look directly at the camera</li>
                  <li>Stay still during capture (takes ~4 seconds)</li>
                </ul>
              </div>

              {/* Progress */}
              {status === "capturing" && (
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium">{message}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Status messages */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <Check
                      size={20}
                      className="text-green-600 dark:text-green-400"
                    />
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {message}
                    </p>
                  </motion.div>
                )}

                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                  >
                    <AlertCircle
                      size={20}
                      className="text-red-600 dark:text-red-400"
                    />
                    <p className="text-sm text-red-700 dark:text-red-300">
                      {message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <div className="p-6 border-t border-border bg-muted/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={status === "capturing"}
            className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "success" ? "Close" : "Cancel"}
          </button>
          <button
            onClick={handleEnroll}
            disabled={
              !isModelLoaded || status === "capturing" || status === "success"
            }
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {status === "capturing" ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Capturing...
              </>
            ) : (
              <>
                <Camera size={16} />
                Start Enrollment
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default FaceEnrollment;

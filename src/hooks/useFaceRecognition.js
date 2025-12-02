/**
 * @fileoverview Custom hook for face recognition operations
 */

import { useState, useEffect, useCallback, useRef } from "react";
import * as faceRecognition from "../utils/faceRecognition";
import * as faceDatabase from "../services/faceDatabase";

export const useFaceRecognition = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [detections, setDetections] = useState([]);
  const processingRef = useRef(false);

  // Load models on mount
  useEffect(() => {
    const loadModels = async () => {
      setIsLoading(true);
      setError(null);

      const success = await faceRecognition.loadModels();

      if (success) {
        setIsModelLoaded(true);
      } else {
        setError("Failed to load face recognition models");
      }

      setIsLoading(false);
    };

    if (!faceRecognition.areModelsLoaded()) {
      loadModels();
    } else {
      setIsModelLoaded(true);
    }
  }, []);

  /**
   * Detect faces in video element
   * @param {HTMLVideoElement} videoElement  */
  const detectFaces = useCallback(
    async (videoElement) => {
      if (!isModelLoaded || !videoElement || processingRef.current) {
        return [];
      }

      processingRef.current = true;

      try {
        const detected = await faceRecognition.detectFaces(videoElement);
        setDetections(detected);
        return detected;
      } catch (err) {
        console.error("Face detection error:", err);
        return [];
      } finally {
        processingRef.current = false;
      }
    },
    [isModelLoaded]
  );

  /**
   * Recognize faces against database
   * @param {Array} detections - Face detections
   * @returns {Array} Matches
   */
  const recognizeFaces = useCallback((detections) => {
    if (!detections || detections.length === 0) {
      return [];
    }

    const db = faceDatabase.getFaceDatabase();
    const matches = [];

    detections.forEach((detection, index) => {
      const match = faceRecognition.findBestMatch(detection.descriptor, db);
      if (match) {
        matches.push({ index, ...match });
      }
    });

    return matches;
  }, []);

  /**
   * Enroll a face for a student
   * @param {string} studentId - Student ID
   * @param {string} studentName - Student name
   * @param {HTMLVideoElement} videoElement - Video element
   * @param {number} samples - Number of samples to capture
   * @returns {Promise<{success: boolean, message: string}>}
   */
  const enrollFace = useCallback(
    async (studentId, studentName, videoElement, samples = 5) => {
      if (!isModelLoaded) {
        return { success: false, message: "Models not loaded" };
      }

      const descriptors = [];
      const sampleDelay = 500; // 500ms between samples

      for (let i = 0; i < samples; i++) {
        await new Promise((resolve) => setTimeout(resolve, sampleDelay));

        const descriptor = await faceRecognition.detectSingleFace(videoElement);

        if (!descriptor) {
          return {
            success: false,
            message: `Failed to detect face in sample ${
              i + 1
            }/${samples}. Please ensure your face is clearly visible.`,
          };
        }

        descriptors.push(descriptor);
      }

      // Average all descriptors for better accuracy
      const avgDescriptor = faceRecognition.averageDescriptors(descriptors);

      // Save to database
      const saved = faceDatabase.saveFaceDescriptor(
        studentId,
        studentName,
        avgDescriptor
      );

      if (saved) {
        return {
          success: true,
          message: `Successfully enrolled ${studentName} with ${samples} face samples`,
        };
      } else {
        return {
          success: false,
          message: "Failed to save face data",
        };
      }
    },
    [isModelLoaded]
  );

  /**
   * Delete enrolled face
   * @param {string} studentId - Student ID
   */
  const deleteEnrolledFace = useCallback((studentId) => {
    return faceDatabase.deleteFaceDescriptor(studentId);
  }, []);

  /**
   * Check if student has enrolled face
   * @param {string} studentId - Student ID
   */
  const hasEnrolledFace = useCallback((studentId) => {
    return faceDatabase.hasEnrolledFace(studentId);
  }, []);

  /**
   * Get enrolled students count
   */
  const getEnrolledCount = useCallback(() => {
    return faceDatabase.getEnrolledCount();
  }, []);

  return {
    isModelLoaded,
    isLoading,
    error,
    detections,
    detectFaces,
    recognizeFaces,
    enrollFace,
    deleteEnrolledFace,
    hasEnrolledFace,
    getEnrolledCount,
  };
};

export default useFaceRecognition;

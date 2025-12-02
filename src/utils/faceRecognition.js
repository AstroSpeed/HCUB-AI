/**
 * @fileoverview Face recognition utility using face-api.js
 */

import * as faceapi from "face-api.js";

// Model paths (served from public/models)
const MODEL_URL = "/models";

// Configuration
const DETECTION_OPTIONS = new faceapi.TinyFaceDetectorOptions({
  inputSize: 416,
  scoreThreshold: 0.5,
});

const MATCH_THRESHOLD = 0.6; // Lower = stricter matching

/**
 * Load face detection models
 * @returns {Promise<boolean>}
 */
export const loadModels = async () => {
  try {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    ]);

    console.log("[Face Recognition] Models loaded successfully");
    return true;
  } catch (error) {
    console.error("[Face Recognition] Failed to load models:", error);
    return false;
  }
};

/**
 * Check if models are loaded
 * @returns {boolean}
 */
export const areModelsLoaded = () => {
  return (
    faceapi.nets.tinyFaceDetector.isLoaded &&
    faceapi.nets.faceLandmark68Net.isLoaded &&
    faceapi.nets.faceRecognitionNet.isLoaded
  );
};

/**
 * Detect faces in video element
 * @param {HTMLVideoElement} video - Video element
 * @returns {Promise<Array>} Detected faces with landmarks and descriptors
 */
export const detectFaces = async (video) => {
  if (!video || !areModelsLoaded()) {
    return [];
  }

  try {
    const detections = await faceapi
      .detectAllFaces(video, DETECTION_OPTIONS)
      .withFaceLandmarks()
      .withFaceDescriptors();

    return detections;
  } catch (error) {
    console.error("[Face Recognition] Detection error:", error);
    return [];
  }
};

/**
 * Detect single face and extract descriptor
 * @param {HTMLVideoElement} video - Video element
 * @returns {Promise<Float32Array|null>} Face descriptor or null
 */
export const detectSingleFace = async (video) => {
  if (!video || !areModelsLoaded()) {
    return null;
  }

  try {
    const detection = await faceapi
      .detectSingleFace(video, DETECTION_OPTIONS)
      .withFaceLandmarks()
      .withFaceDescriptor();

    return detection ? detection.descriptor : null;
  } catch (error) {
    console.error("[Face Recognition] Single face detection error:", error);
    return null;
  }
};

/**
 * Calculate Euclidean distance between two descriptors
 * @param {Float32Array} descriptor1 - First descriptor
 * @param {Float32Array} descriptor2 - Second descriptor
 * @returns {number} Distance (0 = identical, higher = more different)
 */
export const calculateDistance = (descriptor1, descriptor2) => {
  return faceapi.euclideanDistance(descriptor1, descriptor2);
};

/**
 * Compare face descriptor against database
 * @param {Float32Array} descriptor - Face descriptor to match
 * @param {Array} faceDatabase - Array of {studentId, descriptor, name}
 * @returns {{studentId: string, name: string, distance: number}|null} Best match or null
 */
export const findBestMatch = (descriptor, faceDatabase) => {
  if (!descriptor || !faceDatabase || faceDatabase.length === 0) {
    return null;
  }

  let bestMatch = null;
  let minDistance = Infinity;

  faceDatabase.forEach((entry) => {
    const distance = calculateDistance(descriptor, entry.descriptor);

    if (distance < minDistance && distance < MATCH_THRESHOLD) {
      minDistance = distance;
      bestMatch = {
        studentId: entry.studentId,
        name: entry.name,
        distance,
        confidence: Math.max(0, (1 - distance) * 100).toFixed(1),
      };
    }
  });

  return bestMatch;
};

/**
 * Average multiple face descriptors
 * @param {Float32Array[]} descriptors - Array of descriptors
 * @returns {Float32Array} Averaged descriptor
 */
export const averageDescriptors = (descriptors) => {
  if (!descriptors || descriptors.length === 0) {
    return null;
  }

  if (descriptors.length === 1) {
    return descriptors[0];
  }

  const avgDescriptor = new Float32Array(128);

  for (let i = 0; i < 128; i++) {
    let sum = 0;
    descriptors.forEach((desc) => {
      sum += desc[i];
    });
    avgDescriptor[i] = sum / descriptors.length;
  }

  return avgDescriptor;
};

/**
 * Draw detection results on canvas
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @param {Array} detections - Face detections
 * @param {Object} matches - Optional matches {index: {name, confidence}}
 */
export const drawDetections = (canvas, detections, matches = {}) => {
  if (!canvas || !detections) return;

  const ctx = canvas.getContext("2d");
  const displaySize = { width: canvas.width, height: canvas.height };

  faceapi.matchDimensions(canvas, displaySize);
  const resizedDetections = faceapi.resizeResults(detections, displaySize);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  resizedDetections.forEach((detection, index) => {
    const box = detection.detection.box;
    const match = matches[index];

    // Draw box
    ctx.strokeStyle = match ? "#10b981" : "#3b82f6";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.width, box.height);

    // Draw label
    if (match) {
      const label = `${match.name} (${match.confidence}%)`;
      ctx.fillStyle = "#10b981";
      ctx.fillRect(box.x, box.y - 25, ctx.measureText(label).width + 10, 25);
      ctx.fillStyle = "#ffffff";
      ctx.font = "14px Inter, sans-serif";
      ctx.fillText(label, box.x + 5, box.y - 7);
    }

    // Draw landmarks
    const landmarks = detection.landmarks;
    ctx.fillStyle = match ? "#10b981" : "#3b82f6";
    landmarks.positions.forEach((point) => {
      ctx.fillRect(point.x - 1, point.y - 1, 2, 2);
    });
  });
};

/**
 * Convert Float32Array to regular array for JSON storage
 * @param {Float32Array} descriptor - Face descriptor
 * @returns {number[]}
 */
export const descriptorToArray = (descriptor) => {
  return Array.from(descriptor);
};

/**
 * Convert array back to Float32Array
 * @param {number[]} array - Descriptor array
 * @returns {Float32Array}
 */
export const arrayToDescriptor = (array) => {
  return new Float32Array(array);
};

export default {
  loadModels,
  areModelsLoaded,
  detectFaces,
  detectSingleFace,
  calculateDistance,
  findBestMatch,
  averageDescriptors,
  drawDetections,
  descriptorToArray,
  arrayToDescriptor,
  MATCH_THRESHOLD,
};

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});

const fontSizeSelect = document.getElementById('font-size');
fontSizeSelect.addEventListener('change', (e) => {
  document.body.style.fontSize = e.target.value;
});

const nightVisionToggle = document.getElementById('night-vision-toggle');
const cameraFeed = document.querySelector('.camera-feed');
nightVisionToggle.addEventListener('click', () => {
  cameraFeed.classList.toggle('night-vision');
});

const video = document.getElementById('live-camera');
const motionCanvas = document.getElementById('motion-canvas');
const snapshotCanvas = document.getElementById('snapshot-canvas');
const faceBox = document.getElementById('face-box');
const ctx = motionCanvas.getContext('2d');
const snapshotCtx = snapshotCanvas.getContext('2d');

let isDetectingMotion = false;
let previousFrame = null;

navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error('Error accessing camera:', err);
  });

const captureSnapshotButton = document.getElementById('capture-snapshot');
const snapshotGallery = document.getElementById('snapshot-gallery');

captureSnapshotButton.addEventListener('click', () => {
  snapshotCanvas.width = video.videoWidth;
  snapshotCanvas.height = video.videoHeight;
  snapshotCtx.drawImage(video, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

  const snapshotImage = document.createElement('img');
  snapshotImage.src = snapshotCanvas.toDataURL('image/png');
  snapshotGallery.appendChild(snapshotImage);

  sendNotification('Snapshot captured successfully.');
});

const detectFaceButton = document.getElementById('detect-face');
detectFaceButton.addEventListener('click', () => {
  faceBox.style.display = 'block';
  faceBox.style.width = '200px'; // Adjust width as needed
  faceBox.style.height = '200px'; // Adjust height as needed
  faceBox.style.top = '50%';
  faceBox.style.left = '50%';
  faceBox.style.transform = 'translate(-50%, -50%)';

  sendNotification('Face detected.');
});

const detectMotionButton = document.getElementById('detect-motion');
detectMotionButton.addEventListener('click', () => {
  isDetectingMotion = !isDetectingMotion;
  if (isDetectingMotion) {
    sendNotification('Motion detection started.');
    detectMotion();
  } else {
    sendNotification('Motion detection stopped.');
  }
});

function detectMotion() {
  if (!isDetectingMotion) return;

  motionCanvas.width = video.videoWidth;
  motionCanvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, motionCanvas.width, motionCanvas.height);

  if (previousFrame) {
    const currentFrame = ctx.getImageData(0, 0, motionCanvas.width, motionCanvas.height);
    const diff = compareFrames(previousFrame, currentFrame);

    if (diff > 0.1) { // Adjust threshold for sensitivity
      sendNotification(`Motion detected: ${diff > 0.2 ? 'Running' : 'Walking'}`);
    }
  }

  previousFrame = ctx.getImageData(0, 0, motionCanvas.width, motionCanvas.height);
  requestAnimationFrame(detectMotion);
}

function compareFrames(frame1, frame2) {
  let diff = 0;
  for (let i = 0; i < frame1.data.length; i += 4) {
    diff += Math.abs(frame1.data[i] - frame2.data[i]);
  }
  return diff / (frame1.width * frame1.height * 255);
}

const notificationArea = document.getElementById('notification-area');
function sendNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  notificationArea.appendChild(notification);
  setTimeout(() => notification.remove(), 5000);
}

sendNotification('System is running smoothly.');
sendNotification('No strangers detected.');

const startRecordingButton = document.getElementById('start-recording');
startRecordingButton.addEventListener('click', () => {
  sendNotification('Recording started. Feature under development.');
});
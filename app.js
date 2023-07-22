let localStream;
let remoteStream;
let peerConnection;

const configuration = {
  iceServers: [
    { urls: 'stun:stun.stunprotocol.org' },
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

async function startCall() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Display the local stream in the local video element
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = localStream;

    // Create the peer connection
    peerConnection = new RTCPeerConnection(configuration);

    // Add the local stream to the peer connection
    localStream.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

    // Set up event listeners for ICE candidate and remote stream
    peerConnection.onicecandidate = handleICECandidate;
    peerConnection.ontrack = handleRemoteStream;

    // Generate an offer and set it as the local description
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Send the local description to the remote peer via signaling (e.g., using WebSocket or HTTP request)
    // Replace 'ROOM_ID' with the actual room ID or identifier for the remote peer
    sendLocalDescriptionToRemotePeer(offer, 'ROOM_ID');
  } catch (error) {
    console.error('Error accessing media devices:', error);
  }
}

function handleICECandidate(event) {
  if (event.candidate) {
    // Send the ICE candidate to the remote peer via signaling
    // Replace 'ROOM_ID' with the actual room ID or identifier for the remote peer
    sendICECandidateToRemotePeer(event.candidate, 'ROOM_ID');
  }
}

function handleRemoteStream(event) {
  // Display the remote stream in the remote video element
  const remoteVideo = document.getElementById('remoteVideo');
  remoteVideo.srcObject = event.streams[0];
}

function endCall() {
  // Close the peer connection and release the media streams
  if (peerConnection) {
    peerConnection.close();
  }
  if (localStream) {
    localStream.getTracks().forEach((track) => track.stop());
  }
  if (remoteStream) {
    remoteStream.getTracks().forEach((track) => track.stop());
  }

  // Clear the video elements
  const localVideo = document.getElementById('localVideo');
  const remoteVideo = document.getElementById('remoteVideo');
  localVideo.srcObject = null;
  remoteVideo.srcObject = null;
}

// Function to handle receiving remote description and add it to the peer connection
async function handleRemoteDescription(description) {
  try {
    await peerConnection.setRemoteDescription(description);

    // Generate an answer and set it as the local description
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // Send the answer to the remote peer via signaling
    // Replace 'ROOM_ID' with the actual room ID or identifier for the remote peer
    sendLocalDescriptionToRemotePeer(answer, 'ROOM_ID');
  } catch (error) {
    console.error('Error setting remote description:', error);
  }
}

// Function to handle receiving ICE candidate and add it to the peer connection
async function handleRemoteICECandidate(candidate) {
  try {
    await peerConnection.addIceCandidate(candidate);
  } catch (error) {
    console.error('Error adding ICE candidate:', error);
  }
}

// Function to send the local description to the remote peer via signaling (replace with your own signaling method)
function sendLocalDescriptionToRemotePeer(description, roomID) {
  // Implement your own signaling method here (e.g., WebSocket or HTTP request)
  // For simplicity, this example doesn't include the actual signaling implementation
}

// Function to send the ICE candidate to the remote peer via signaling (replace with your own signaling method)
function sendICECandidateToRemotePeer(candidate, roomID) {
  // Implement your own signaling method here (e.g., WebSocket or HTTP request)
  // For simplicity, this example doesn't include the actual signaling implementation
}

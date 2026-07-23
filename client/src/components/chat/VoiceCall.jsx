import { useState, useEffect, useRef } from "react";
import socket from "../../utils/socket";

export default function VoiceCall({ user, recipient, onEndCall }) {
  const [callStatus, setCallStatus] = useState("calling");
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const durationTimer = useRef(null);

  useEffect(() => {
    startCall();

    // When recipient answers — set remote description
    socket.on("call_answered", async ({ answer }) => {
      try {
        await pcRef.current?.setRemoteDescription(new RTCSessionDescription(answer));
        setCallStatus("connected");
        startDurationTimer();
      } catch (err) {
        console.error("Set remote description failed:", err);
      }
    });

    // Handle ICE candidates from recipient
    socket.on("ice_candidate", async ({ candidate }) => {
      try {
        await pcRef.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Add ICE candidate failed:", err);
      }
    });

    socket.on("call_ended", () => endCall());

    return () => {
      socket.off("call_answered");
      socket.off("ice_candidate");
      socket.off("call_ended");
      cleanup();
    };
  }, []);

  const startCall = async () => {
    try {
      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      pcRef.current = pc;

      // Add local audio track
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // When remote audio arrives play it
      pc.ontrack = (event) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = event.streams[0];
          remoteAudioRef.current.play().catch(console.error);
        }
      };

      // Send ICE candidates to recipient
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice_candidate", {
            to: recipient._id,
            candidate: event.candidate,
          });
        }
      };

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to recipient
      socket.emit("call_user", {
        recipientId: recipient._id,
        from: user.id,
        callerName: user.name,
        offer,
      });

    } catch (err) {
      console.error("Failed to start call:", err);
      alert("Could not access microphone. Please allow microphone permission.");
      setCallStatus("ended");
      setTimeout(() => onEndCall(), 1500);
    }
  };

  const startDurationTimer = () => {
    durationTimer.current = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
  };

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted((m) => !m);
    }
  };

  const endCall = () => {
    clearInterval(durationTimer.current);
    cleanup();
    setCallStatus("ended");
    setTimeout(() => onEndCall(), 1500);
  };

  const handleEndCall = () => {
    socket.emit("end_call", { to: recipient._id });
    endCall();
  };

  const cleanup = () => {
    pcRef.current?.close();
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    clearInterval(durationTimer.current);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#1e293b", borderRadius: 20, padding: 40, textAlign: "center", width: 280 }}>
        <audio ref={remoteAudioRef} autoPlay />

        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 32, margin: "0 auto 16px" }}>
          {recipient.name?.[0]?.toUpperCase()}
        </div>

        <h3 style={{ color: "#fff", margin: "0 0 8px", fontSize: 20 }}>{recipient.name}</h3>

        <p style={{ color: "#94a3b8", margin: "0 0 32px", fontSize: 14 }}>
          {callStatus === "calling" && "Calling..."}
          {callStatus === "connected" && formatDuration(callDuration)}
          {callStatus === "ended" && "Call ended"}
        </p>

        {callStatus !== "ended" && (
          <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
            <button
              onClick={toggleMute}
              style={{ width: 56, height: 56, borderRadius: "50%", background: isMuted ? "#dc2626" : "#334155", border: "none", cursor: "pointer", fontSize: 22 }}
            >
              {isMuted ? "🔇" : "🎙️"}
            </button>
            <button
              onClick={handleEndCall}
              style={{ width: 56, height: 56, borderRadius: "50%", background: "#dc2626", border: "none", cursor: "pointer", fontSize: 22 }}
            >
              📵
            </button>
          </div>
        )}

        {callStatus === "ended" && (
          <p style={{ color: "#94a3b8", fontSize: 13 }}>Duration: {formatDuration(callDuration)}</p>
        )}
      </div>
    </div>
  );
}

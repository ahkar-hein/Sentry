import { useEffect, useRef } from "react";
import socket from "../../utils/socket";

export default function IncomingCall({ callData, user, onAccept, onReject }) {

  // Simple ringtone
  useEffect(() => {
    let ctx;
    let interval;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      interval = setInterval(() => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
      }, 1000);
    } catch (e) {
      console.warn("Audio not supported");
    }
    return () => { clearInterval(interval); ctx?.close(); };
  }, []);

  const handleAccept = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      // Add local audio
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Send ICE candidates to caller
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice_candidate", {
            to: callData.from,
            candidate: event.candidate,
          });
        }
      };

      // Set remote offer
      await pc.setRemoteDescription(new RTCSessionDescription(callData.offer));

      // Create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // Send answer to caller
      socket.emit("answer_call", {
        to: callData.from,
        answer,
      });

      onAccept(pc, stream);
    } catch (err) {
      console.error("Failed to accept call:", err);
      alert("Could not access microphone.");
    }
  };

  const handleReject = () => {
    socket.emit("end_call", { to: callData.from });
    onReject();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}>
      <div style={{ background: "#1e293b", borderRadius: 20, padding: 40, textAlign: "center", width: 280 }}>

        <style>{`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(29,78,216,0.7); }
            70% { box-shadow: 0 0 0 20px rgba(29,78,216,0); }
            100% { box-shadow: 0 0 0 0 rgba(29,78,216,0); }
          }
        `}</style>

        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#1d4ed8", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 32, margin: "0 auto 16px", animation: "pulse 1s infinite" }}>
          {callData.callerName?.[0]?.toUpperCase()}
        </div>

        <h3 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20 }}>{callData.callerName}</h3>
        <p style={{ color: "#94a3b8", margin: "0 0 32px", fontSize: 14 }}>Incoming voice call...</p>

        <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
          <div style={{ textAlign: "center" }}>
            <button onClick={handleReject} style={{ width: 60, height: 60, borderRadius: "50%", background: "#dc2626", border: "none", cursor: "pointer", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
              📵
            </button>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>Decline</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={handleAccept} style={{ width: 60, height: 60, borderRadius: "50%", background: "#22c55e", border: "none", cursor: "pointer", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 6px" }}>
              📞
            </button>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
}

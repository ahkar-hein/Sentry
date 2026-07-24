import { createContext, useContext, useState, useEffect, useRef } from "react";
import socket from "../utils/socket";
import IncomingCall from "../components/chat/IncomingCall";
import VoiceCall from "../components/chat/VoiceCall";

const CallContext = createContext();

export function CallProvider({ children, user }) {
  const [incomingCall, setIncomingCall] = useState(null);
  const [activeCall, setActiveCall] = useState(null);
  const remoteAudioRef = useRef(null);

useEffect(() => {
  if (!user) return;

  socket.on("incoming_call", (data) => {
    if (!activeCall) setIncomingCall(data);
  });

  // Handle call ended from either side
  socket.on("call_ended", () => {
    setActiveCall(null);
    setIncomingCall(null);
  });

  // Handle call answered — update status for caller
  socket.on("call_answered", () => {
    // caller side handles this in VoiceCall.jsx
  });

  return () => {
    socket.off("incoming_call");
    socket.off("call_ended");
    socket.off("call_answered");
  };
}, [user, activeCall]);

  const startCall = (recipient) => {
    setActiveCall({ recipient });
  };

const handleAcceptCall = (pc, stream) => {
  // Play remote audio when track arrives
  pc.ontrack = (event) => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = event.streams[0];
      remoteAudioRef.current.play().catch(console.error);
    }
  };

  // Show active call screen for receiver
  setIncomingCall(null);
  setActiveCall({
    recipient: {
      _id: incomingCall.from,
      name: incomingCall.callerName,
    },
    isReceiver: true,
    pc,
    stream,
  });
};

  const handleRejectCall = () => setIncomingCall(null);
  const handleEndCall = () => {
  if (activeCall?.stream) {
    activeCall.stream.getTracks().forEach((t) => t.stop());
  }
  if (activeCall?.pc) {
    activeCall.pc.close();
  }
  setActiveCall(null);
};

  return (
    <CallContext.Provider value={{ startCall }}>
      {children}

      {/* Hidden audio for remote stream */}
      <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />

      {/* Incoming call screen */}
      {incomingCall && !activeCall && (
        <IncomingCall
          callData={incomingCall}
          user={user}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {/* Active outgoing call screen */}
{activeCall && (
  <VoiceCall
    user={user}
    recipient={activeCall.recipient}
    onEndCall={handleEndCall}
    isReceiver={activeCall.isReceiver}
  />
)}
    </CallContext.Provider>
  );
}

export const useCall = () => useContext(CallContext);

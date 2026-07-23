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

    // Incoming call from another user
    socket.on("incoming_call", (data) => {
      if (!activeCall) setIncomingCall(data);
    });

    // Call ended by other person
    socket.on("call_ended", () => {
      setActiveCall(null);
      setIncomingCall(null);
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_ended");
    };
  }, [user, activeCall]);

  const startCall = (recipient) => {
    setActiveCall({ recipient });
  };

  const handleAcceptCall = (pc, stream) => {
    setIncomingCall(null);

    // Play remote audio when track arrives
    pc.ontrack = (event) => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = event.streams[0];
        remoteAudioRef.current.play().catch(console.error);
      }
    };
  };

  const handleRejectCall = () => setIncomingCall(null);
  const handleEndCall = () => setActiveCall(null);

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
        />
      )}
    </CallContext.Provider>
  );
}

export const useCall = () => useContext(CallContext);

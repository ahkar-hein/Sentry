import { useEffect, useRef } from "react";

// Custom hook — detects 3 rapid phone shakes and calls onShake()
export default function useShakeDetection(onShake, enabled = true) {
  const shakeCount = useRef(0);
  const lastShake = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const handleMotion = (e) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;

      const total = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
      const now = Date.now();

      if (total > 30) {
        // Rapid shake detected
        if (now - lastShake.current < 1000) {
          shakeCount.current += 1;
        } else {
          shakeCount.current = 1; // reset if too slow
        }
        lastShake.current = now;

        if (shakeCount.current >= 3) {
          shakeCount.current = 0;
          onShake(); // fire the callback
        }
      }
    };

    window.addEventListener("devicemotion", handleMotion);
    return () => window.removeEventListener("devicemotion", handleMotion);
  }, [onShake, enabled]);
}

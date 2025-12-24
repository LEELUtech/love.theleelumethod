import { useEffect, useState } from "react";

export const useCounter = (target: number, duration = 2000, offset = 10) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const start = Math.max(target - offset, 0);
    let current = start;
    setCount(start);

    const totalFrames = duration / 16;
    const increment = (target - start) / totalFrames;
    let frameId: number;

    const animate = () => {
      current += increment;

      if (current < target) {
        setCount(Math.floor(current));
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    if (target > 0) {
      frameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(frameId);
  }, [target, duration, offset]);

  return count;
};

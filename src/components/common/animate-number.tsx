import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Typography } from "@material-tailwind/react";

interface AnimatedNumberProps {
  finalNumber: number;
  duration: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  finalNumber,
  duration,
}) => {
  const navigate = useNavigate();
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const startTime = performance.now();

    const updateNumber = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;

      if (elapsedTime > duration) {
        setCurrentNumber(finalNumber);
      } else {
        const rate = elapsedTime / duration;
        const newNumber = Math.round(rate * finalNumber);
        setCurrentNumber(newNumber);
        requestAnimationFrame(updateNumber);
      }
    };

    requestAnimationFrame(updateNumber);

    return () => {
      // Clean up if needed
    };
  }, [finalNumber, duration, navigate]);

  return (
    <Typography className="font-bold text-2xl dark:text-gray-300">
      {currentNumber}
    </Typography>
  );
};

export default AnimatedNumber;

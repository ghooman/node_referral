import { useEffect, useState } from 'react';

const LoadingDots = ({ count = 3, interval = 500, className = '' }) => {
  const [dotCnt, setDotCnt] = useState(0);

  useEffect(() => {
    let cnt = 0;
    let type = 'increase';
    const id = setInterval(() => {
      if (cnt === 0) type = 'increase';
      else if (cnt === count) type = 'decrease';

      if (type === 'increase') setDotCnt(++cnt);
      else if (type === 'decrease') setDotCnt(--cnt);
    }, interval);

    return () => clearInterval(id);
  }, [count, interval]);

    return (
    <span className={`loading-dots ${className}`}>
        {Array.from({ length: dotCnt }).map((_, i) => (
        <span key={i} className="dot">.</span>
        ))}
    </span>
    );
};

export default LoadingDots;
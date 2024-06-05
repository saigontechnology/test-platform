import { animated, useTransition } from '@react-spring/web';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './styles.module.css';

export default function App() {
  const ref = useRef<ReturnType<typeof setTimeout>[]>([]);
  let intervalRef: any = null;
  const [items, set] = useState<string[]>([]);
  const transitions = useTransition(items, {
    from: {
      opacity: 0,
      height: 0,
      innerHeight: 0,
      transform: 'perspective(600px) rotateY(0deg)',
      color: '#8fa5b6',
    },
    enter: [
      { opacity: 1, height: 80, innerHeight: 80 },
      { transform: 'perspective(600px) rotateY(180deg)', color: '#28d79f' },
      { transform: 'perspective(600px) rotateY(0deg)' },
    ],
    leave: [
      { color: '#28d79f' },
      { innerHeight: 0 },
      { opacity: 0, height: 0 },
    ],
    update: { color: '#28d79f' },
    config: {
      duration: 600,
    },
  });

  const reset = useCallback(() => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
    set([]);
    ref.current.push(setTimeout(() => set(['Saigon Technology']), 3000));
  }, []);

  useEffect(() => {
    clearInterval(intervalRef); // Clear previous interval
    intervalRef = setInterval(() => {
      reset();
    }, 5000); // Set interval using state
    return () => {
      clearInterval(intervalRef);
      ref.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {transitions(({ innerHeight, ...rest }, item) => (
          <animated.div className={styles.transitionsItem} style={rest}>
            <animated.div style={{ overflow: 'hidden', height: innerHeight }}>
              {item}
            </animated.div>
          </animated.div>
        ))}
      </div>
    </div>
  );
}

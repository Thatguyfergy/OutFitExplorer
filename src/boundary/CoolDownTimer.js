import React, { createContext, useContext, useState, useEffect } from 'react';

const CooldownContext = createContext();

export const CooldownProvider = ({ children }) => {
  const [iscooldown, setIsCooldown] = useState(false);
  const [cooldownDuration, setCooldownDuration] = useState(1 * 60 * 60 * 1000); // 1 hour in milliseconds
  const [cooldownTimeLeft, setCooldownTimeLeft] = useState(cooldownDuration); // Initially set to full cooldown time

  useEffect(() => {
    if (iscooldown) {
      const timer = setTimeout(() => {
        setCooldownTimeLeft(prevTime => {
          const newTimeLeft = prevTime - 1000; // Subtract 1 second from time left every second
          return newTimeLeft >= 0 ? newTimeLeft : 0; // Ensure time left doesn't go negative
        });
      }, 1000);

      return () => clearTimeout(timer); // Clear timer on component unmount
    }
  }, [iscooldown, cooldownTimeLeft]);

  useEffect(() => {
    if (iscooldown && cooldownTimeLeft === 0) {
      setIsCooldown(false); // Reset cooldown state once duration has elapsed
      setCooldownTimeLeft(cooldownDuration); // Reset time left to full duration
    }
  }, [iscooldown, cooldownTimeLeft, cooldownDuration]);

  useEffect(() => {
    console.log('Cooldown state:', iscooldown);
    console.log('Cooldown time left:', cooldownTimeLeft);
  }, [iscooldown, cooldownTimeLeft]);

  return (
    <CooldownContext.Provider value={{ iscooldown, setIsCooldown, cooldownDuration, cooldownTimeLeft }}>
      {children}
    </CooldownContext.Provider>
  );
};

export const useCooldown = () => {
  return useContext(CooldownContext);
};

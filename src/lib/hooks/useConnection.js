import { useEffect, useState } from 'react';

const getOnlineStatusFallback = () => {};

const useConnection = () => {
  const [isOnline, setOnline] = useState(null);
  const [isCharging, setCharging] = useState(null);
  const activeSubscriptions = {};

  const addSubscription = async (subscription) => {
    const { type, target, listener } = subscription;

    target.addEventListener(type, listener);
    activeSubscriptions[type] = {
      target,
      listener,
    };
  };
  const removeSubscription = async (subscription) => {
    const { type, target, listener } = subscription;

    target.removeEventListener(type, listener);
    delete activeSubscriptions[type];
  };

  useEffect(async () => {
    if (!window.navigator && !self.navigator) {
      return undefined;
    }

    const { onLine, battery: deprecatedBattery } = navigator;

    let battery = (await navigator.getBattery?.()) || deprecatedBattery;

    if (typeof battery?.charging === 'boolean') {
      setCharging(battery.charging);

      await addSubscription({
        type: 'chargingchange',
        listener: () => setCharging(battery.charging),
        target: battery,
      });
    }

    if (onLine !== undefined) {
      setOnline(onLine);

      await addSubscription({ type: 'offline', listener: () => setOnline(false), target: window });
      await addSubscription({ type: 'online', listener: () => setOnline(true), target: window });
      // TODO: define getOnlineStatusFallback
      // setOnline(getOnlineStatusFallback());
    }

    return async () => {
      await Promise.all(
        Object.entries(activeSubscriptions).map(async ([type, rest]) => {
          await removeSubscription({ type, ...rest });
        })
      );
    };
  }, []);

  return {
    isOnline,
    isCharging,
  };
};

export default useConnection;

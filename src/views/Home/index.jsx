import React from 'react';

import useConnection from '../../lib/hooks/useConnection';

const Home = () => {
  const { isOnline, isCharging } = useConnection();

  return (
    <div>
      <div>You are {isOnline ? 'ONLINE' : 'OFFLINE'}</div>

      <div>Your device is {!isCharging ? 'NOT' : ''} CHARGING</div>
    </div>
  );
};

export default Home;

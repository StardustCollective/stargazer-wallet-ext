import { useState, useEffect } from 'react';

import DeviceInfo from 'react-native-device-info';

function useVersion(parts: 1 | 2 | 3) {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const readableVersion = DeviceInfo.getReadableVersion();
    const v = readableVersion.split('.');

    if (parts === 3) {
      setVersion(readableVersion);
    } else if (parts === 2) {
      v.pop();
      setVersion(v.join('.'));
    } else if (parts === 1) {
      v.pop();
      v.pop();
      setVersion(v.join('.'));
    }
  }, []);

  return version;
}

export default useVersion;

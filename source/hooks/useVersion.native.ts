import { useState, useEffect } from 'react';

import manifestJson from '../web/manifest.json';

function useVersion(parts: 1 | 2 | 3) {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const manifestVersion = manifestJson.version;
    const v = manifestVersion.split('.');

    if (parts === 3) {
      setVersion(manifestVersion);
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

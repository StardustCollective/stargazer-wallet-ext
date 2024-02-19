import { useState, useEffect } from 'react';
import { browser } from 'webextension-polyfill-ts';

function useVersion(parts: 1 | 2 | 3) {
  const [version, setVersion] = useState(null);

  useEffect(() => {
    const version = browser.runtime.getManifest().version;
    const v = version.split('.');

    if (parts === 3) {
      setVersion(version);
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

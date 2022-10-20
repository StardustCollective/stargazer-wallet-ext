import React, { FC } from 'react';

import Container from 'components/Container';

import About from './About';

import useVersion from 'hooks/useVersion';

const SUPPORT_LINK = 'https://t.me/StardustSupport';
const SUPPORT_LABEL = 'https://t.me/StardustSupport';
const TERMS_LINK = 'https://www.constellationnetwork.io/stargazer-terms';
const TERMS_LABEL = 'https://www.constellationnetwork.io/stargazer-terms';
const PRIVACY_LINK = 'https://www.constellationnetwork.io/stargazer-privacy-policy ';
const PRIVACY_LABEL = 'https://www.constellationnetwork.io/stargazer-privacy-policy';

const AboutContainer: FC = () => {
  const versionMajorMinor = useVersion(2);
  const version = useVersion(3);

  return (
    <Container safeArea={false}>
      <About
        version={version}
        versionMajorMinor={versionMajorMinor}
        supportLink={SUPPORT_LINK}
        supportLabel={SUPPORT_LABEL}
        termsLink={TERMS_LINK}
        termsLabel={TERMS_LABEL}
        privacyLink={PRIVACY_LINK}
        privacyLabel={PRIVACY_LABEL}
      />
    </Container>
  );
};

export default AboutContainer;

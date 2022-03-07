import React, { FC } from 'react';

import Container from 'components/Container';

import About from './About';

import useVersion from 'hooks/useVersion';

const SUPPORT_LINK = 'https://t.me/StardustSupport';
const SUPPORT_LABEL = 'https://t.me/StardustSupport';
const TERMS_LINK = 'https://www.stargazer.network/assets/static/terms.html';
const TERMS_LABEL = 'https://www.stargazer.network/.../terms.html';
const PRIVACY_LINK = 'https://www.stargazer.network/assets/static/privacy.html';
const PRIVACY_LABEL = 'https://www.stargazer.network/.../privacy.html';

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

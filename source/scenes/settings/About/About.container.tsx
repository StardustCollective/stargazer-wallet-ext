///////////////////////
// Modules
///////////////////////

import React, { FC } from 'react';

///////////////////////
// Components
///////////////////////

import Container from 'scenes/common/Container';

///////////////////////
// Scene
///////////////////////

import About from './About';

///////////////////////
// Hooks
///////////////////////
// import useVersion from 'hooks/useVersion';

///////////////////////
// Constants
///////////////////////
const SUPPORT_LINK = 'https://t.me/StardustSupport';
const SUPPORT_LABEL = 'https://t.me/StardustSupport';
const TERMS_LINK = 'https://www.stargazer.network/assets/static/terms.html';
const TERMS_LABEL = 'https://www.stargazer.network/.../terms.html';
const PRIVACY_LINK = 'https://www.stargazer.network/assets/static/privacy.html';
const PRIVACY_LABEL = 'https://www.stargazer.network/.../privacy.html';

///////////////////////
// Component
///////////////////////

const AboutContainer: FC = () => {
  ///////////////////////
  // HOOKS
  ///////////////////////
  // const versionMajorMinor = useVersion(2);
  // const version = useVersion(3);
  const versionMajorMinor = '3.2';
  const version = '3.2.4';

  ///////////////////////
  // RENDERS
  ///////////////////////

  return (
    <Container>
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

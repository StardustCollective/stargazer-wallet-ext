import React from 'react';
import { createRoot } from 'react-dom/client';

import Options from './Options';

const app = document.getElementById('options-root');
const root = createRoot(app!);
root.render(<Options />);

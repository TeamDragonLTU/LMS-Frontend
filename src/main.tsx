import './css/index.css';

import { createRoot } from 'react-dom/client';
import { router } from './router';
import { AuthProvider } from './features/auth/context/authProvider';
import { RouterProvider } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

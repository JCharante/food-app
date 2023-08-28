
export const baseURL = 'https://5872-2001-ee0-4161-c8e4-b065-4370-d541-3203.ngrok-free.app' // http://127.0.0.1:3000'

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@goodies-tech/api';
export const trpc = createTRPCReact<AppRouter>();


export const baseURL = 'https://9ecc-2001-ee0-4f8f-8780-31-30f4-1bcb-4c1a.ngrok-free.app' // http://127.0.0.1:3000'

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@goodies-tech/api';
export const trpc = createTRPCReact<AppRouter>();


export const baseURL = 'https://4e68-2001-ee0-4161-c8e4-fcce-78a7-1824-e330.ngrok-free.app' // http://127.0.0.1:3000'

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@goodies-tech/api';
export const trpc = createTRPCReact<AppRouter>();

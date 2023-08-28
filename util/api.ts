
export const baseURL = 'https://a6f3-2001-ee0-4161-c8e4-5ceb-87d2-d246-915c.ngrok-free.app' // http://127.0.0.1:3000'

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@goodies-tech/api';
export const trpc = createTRPCReact<AppRouter>();

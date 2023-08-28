
export const baseURL = 'http://127.0.0.1:3000'

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@goodies-tech/api';
export const trpc = createTRPCReact<AppRouter>();

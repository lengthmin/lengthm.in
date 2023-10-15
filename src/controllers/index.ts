import { THono } from '../types';

import { route } from './notify';

export function ignition(hono: THono) {
  route(hono);
}

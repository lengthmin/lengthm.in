import { error, json } from 'itty-router';
import router from './router';

export default {
  fetch: (req, env, ctx) =>
    router.handle(req, env, ctx).then(json).catch(error),
} as ExportedHandler<IRuntimeEnv>;

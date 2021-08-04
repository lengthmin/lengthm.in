import { Router } from 'itty-router';

import index from 'resources/index';
import keys from 'resources/keys.sh';

const router = Router();

router.get('/keys', async () => await fetch(`${GITHUB}.keys`));
router.get('/keys.sh', () => new Response(keys));
router.get('/gpg', async () => await fetch(`${GITHUB}.gpg`));
router.all(
  '*',
  () =>
    new Response(index, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    }),
);

export default (event: FetchEvent) => {
  return router.handle(event.request);
};

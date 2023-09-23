import { Router, IRequest } from 'itty-router';

import index from 'resources/index';
import keys from 'resources/keys.sh';
import { buf2hex } from './utils';

type CF = [env: IRuntimeEnv, context: ExecutionContext];

const router = Router<IRequest, CF>();

router.post('/wx', async (req: Request, environment, context) => {
  const xmlString = await req.text();
});

router.get('/wx', async (req: Request, env, ctx) => {
  const query = new URL(req.url).searchParams;

  // 1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  const signature = query.get('signature'), //微信加密签名
    timestamp = query.get('timestamp'), //时间戳
    nonce = query.get('nonce'), //随机数
    echostr = query.get('echostr'); //随机字符串

  // 2.将token、timestamp、nonce三个参数进行字典序排序
  var array = [env.WECHAT_TOKEN, timestamp, nonce];
  array.sort();

  const myText = new TextEncoder().encode(array.join(''));
  const myDigest = await crypto.subtle.digest(
    {
      name: 'SHA-1',
    },
    myText,
  );
  const resultCode = buf2hex(myDigest);
  //4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
  if (resultCode === signature) {
    return new Response(echostr);
  } else {
    return new Response('mismatch');
  }
});
router.get('/keys', async (_r, env) => await fetch(`${env.GITHUB}.keys`));
router.get('/keys.sh', (_r, env) => {
  const data = keys.replace(/{{HOST}}/g, env.HOST);
  return new Response(data);
});
router.get('/gpg', async (_r, env) => await fetch(`${env.GITHUB}.gpg`));

router.get('/r2/*', async (request, env, context) => {
  try {
    const url = new URL(request.url);

    // Construct the cache key from the cache URL
    const cacheKey = new Request(url.toString(), request);
    const cache = caches.default;

    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from R2, and store it in the cache
    // for future access
    let response = await cache.match(cacheKey);

    if (response) {
      console.log(`Cache hit for: ${request.url}.`);
      return response;
    }

    console.log(
      `Response for request url: ${request.url} not present in cache. Fetching and caching request.`,
    );

    // If not in cache, get it from R2
    const objectKey = url.pathname.slice('/r2/'.length);
    const object = await env.MY_BUCKET.get(objectKey);
    if (object === null) {
      return new Response('Object Not Found', { status: 404 });
    }

    // Set the appropriate object headers
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    // Cache API respects Cache-Control headers. Setting s-max-age to 10
    // will limit the response to be in cache for 10 seconds max
    // Any changes made to the response here will be reflected in the cached value
    headers.append('Cache-Control', 's-maxage=30');

    response = new Response(object.body, {
      headers,
    });

    // Store the fetched response as cacheKey
    // Use waitUntil so you can return the response without blocking on
    // writing to cache
    context.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (e) {
    return new Response('Error thrown ' + (e as Error).message);
  }
});

// in the end
router.all(
  '*',
  () =>
    new Response(index, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    }),
);

export default router;

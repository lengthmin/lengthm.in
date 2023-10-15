import { Hono } from 'hono';
import { raw } from 'hono/html';
import index from 'resources/index';
import keys from 'resources/keys.sh';
import { buf2hex } from './utils';
import { THonoEnv } from './types';

const app = new Hono<THonoEnv>();

app.post('/wx', async (ctx) => {
  const xmlString = await ctx.req.text();
});

app.get('/wx', async (ctx) => {
  const { req, env } = ctx;
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
app.get('/keys', async (c) => await fetch(`${c.env.GITHUB}.keys`));
app.get('/keys.sh', (c) => {
  const data = keys.replace(/{{HOST}}/g, c.env.HOST);
  return new Response(data);
});
app.get('/gpg', async (c) => await fetch(`${c.env.GITHUB}.gpg`));

app.get('/r2/*', async (ctx) => {
  const { req } = ctx;
  try {
    const url = new URL(req.url);

    // Construct the cache key from the cache URL
    const cacheKey = new Request(url.toString(), req);
    const cache = caches.default;

    // Check whether the value is already available in the cache
    // if not, you will need to fetch it from R2, and store it in the cache
    // for future access
    let response = await cache.match(cacheKey);

    if (response) {
      console.log(`Cache hit for: ${req.url}.`);
      return response;
    }

    console.log(
      `Response for request url: ${req.url} not present in cache. Fetching and caching request.`,
    );

    // If not in cache, get it from R2
    const objectKey = url.pathname.slice('/r2/'.length);
    const object = await ctx.env.MY_BUCKET.get(objectKey);
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
    ctx.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));

    return response;
  } catch (e) {
    return new Response('Error thrown ' + (e as Error).message);
  }
});

app.get('*', (ctx) => ctx.html(raw(index)));

export default app;

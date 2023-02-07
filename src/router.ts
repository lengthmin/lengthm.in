import { Router } from 'itty-router';

import index from 'resources/index';
import keys from 'resources/keys.sh';
import { buf2hex } from './utils';

const router = Router();

router.post('/wx', async (req: Request) => {
  const xmlString = await req.text();
});

router.get('/wx', async (req: Request) => {
  const query = new URL(req.url).searchParams;

  // 1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
  const signature = query.get('signature'), //微信加密签名
    timestamp = query.get('timestamp'), //时间戳
    nonce = query.get('nonce'), //随机数
    echostr = query.get('echostr'); //随机字符串

  // 2.将token、timestamp、nonce三个参数进行字典序排序
  var array = [WECHAT_TOKEN, timestamp, nonce];
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
router.get('/keys', async () => await fetch(`${GITHUB}.keys`));
router.get('/keys.sh', () => {
  const data = keys.replace(/{{HOST}}/g, HOST);
  return new Response(data);
});
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

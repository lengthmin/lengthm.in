import { Hono } from 'hono';
import { THono, THonoEnv } from '../types';
import { Bark, IBarkSendParam } from './bark';

export function route(hono: THono) {
  const notify = new Hono<THonoEnv>();

  dingtalk(notify);
  bark(notify);
  hono.route('/n', notify);
}

interface IDingtalkPostBody {
  ak: string;
  sk: string;
}

function bark(hono: THono) {
  hono.post('/b/:group?', async (ctx) => {
    console.log('sdk key', ctx.env.BARK_SDK_KEY);
    const sdk = new Bark({
      token: ctx.env.BARK_SDK_KEY,
    });
    const group = ctx.req.param('group');
    const body = (await ctx.req.json()) as IBarkSendParam;

    return await sdk.send({
      title: body.title,
      body: body.body,
      copy: body.copy || body.body,
      group: group || body.group,
      autoCopy: body.autoCopy,
    });
  });
}

function dingtalk(hono: THono) {
  hono.post('/d/:name?', async (ctx) => {
    const { req } = ctx;
    const name = req.param('name');

    if (!name) {
      const body = await req.json();
    }
  });
}

import { Hono } from 'hono';
import BarkJssdk from '@jswork/bark-jssdk';
import { THono, THonoEnv } from '../types';

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

interface IBarkPostBody {
  title: string;
  text: string;
}

function bark(hono: THono) {
  hono.post('/b/:group?', async (ctx) => {
    const sdk = new BarkJssdk({
      sdkKey: ctx.env.BARK_SDK_KEY,
    });
    const group = ctx.req.param('group');
    const body = (await ctx.req.json()) as IBarkPostBody;

    await sdk.notify({
      title: body.title,
      body: body.text,
      copy: body.text,
      automaticallyCopy: true,
      group: parseInt(group || '0', 10),
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

interface IBarkSendParam {
  /**
   * 推送标题
   */
  title: string;
}

export class Bark {
  baseUrl: string;
  constructor(token: string) {
    this.baseUrl = `https://api.day.app/${token}`;
  }

  async send(param: IBarkSendParam) {}
}

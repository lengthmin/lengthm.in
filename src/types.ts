import { Hono } from 'hono';

export interface IRuntimeEnv {
  GITHUB: string;
  WECHAT_TOKEN: string;
  HOST: string;
  MY_BUCKET: R2Bucket;
  BARK_SDK_KEY: string;
  [key: string]: unknown;
}

export type THonoEnv = {
  Bindings: IRuntimeEnv;
};

export type THono = Hono<THonoEnv>;

declare module 'resources/*' {
  const data: string;
  export default data;
}

declare interface IRuntimeEnv {
  GITHUB: string;
  WECHAT_TOKEN: string;
  HOST: string;
  MY_BUCKET: R2Bucket;
  [key: string]: unknown;
}

declare type IHonoEnv = {
  Bindings: IRuntimeEnv;
};

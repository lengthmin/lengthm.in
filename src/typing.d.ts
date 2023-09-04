declare module 'resources/*' {
  const data: string;
  export default data;
}

declare interface IRuntimeEnv {
  GITHUB: string;
  WECHAT_TOKEN: string;
  HOST: string;
}

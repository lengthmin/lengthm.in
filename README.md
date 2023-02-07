# personal

Powered by Cloudflare Workers :)

here's what it does:

1. if you visit <https://{HOST}/>, then you will be redirected to my Github.
2. I can quickly add my ssh pub keys to the server I want to login by using `curl {HOST}/keys.sh | sh`.

TODO:

- [ ] push message to myself (wechat|qq|ding|telegram)

## usage

### keys

<https://{HOST}/keys>

### set authorized_keys

```shell
curl {HOST}/keys.sh | sh
```

## dev

```shell
yarn install
yarn wrangler login
yarn dev
```

### publish

publish:

```shell
yarn wrangler login
yarn run publish
```

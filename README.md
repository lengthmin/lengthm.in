# personal

Powered by Cloudflare Workers :)

here's what it does:

1. if you visit <https://cat.ms/>, then you will be redirected to my Github.
2. I can quickly add my ssh pub keys to the server I want to login by using `curl cat.ms/keys.sh | sh`.

TODO:

- [ ] push message to myself (wechat|qq|ding|telegram)

## usage

### keys

<https://cat.ms/keys>

### set authorized_keys

```shell
curl cat.ms/keys.sh | sh
```

### page views

<https://github.com/willin/cloudflare-pageviews-worker>

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

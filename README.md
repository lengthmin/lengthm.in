# lengthm.in

Powered by Cloudflare Workers :)

here's what it does:

1. if you visit <https://lengthm.in/>, then you will be redirected to my Github.
2. I can quickly add my ssh pub keys to the server I want to login by using `curl lengthm.in/keys.sh | sh`.

TODO:

- [ ] push message to myself (wechat|qq|ding|telegram)

## usage

### set authorized_keys

```shell
curl lengthm.in/keys.sh | sh
```

## dev

```shell
yarn install
yarn wrangler login
yarn dev
```

### publish

set `CF_ACCOUNT_ID`(actually, my .zshrc will do this automatically by running `source .env`):

```dotenv
export CF_ACCOUNT_ID=xxxxxx
```

publish:

```shell
yarn pub
```

import keysSh from './resources/keys.sh';
import indexHtml from 'resources/index';

const GITHUB = 'https://github.com/lengthmin';


export async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const restPath = pathname.slice(1);
  const firstChar = restPath[0];

  if (firstChar === '1') {
    return new Response('nice try\n');
  }
  if (restPath === 'keys') {
    return await fetch(`${GITHUB}.keys`);
  }
  if (restPath === 'gpg') {
    return await fetch(`${GITHUB}.gpg`);
  }
  if (restPath === 'keys.sh') {
    return new Response(keysSh);
  }
  return new Response(indexHtml, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });
}

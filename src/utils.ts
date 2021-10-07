export async function gatherResponse(response: Response) {
  const { headers } = response;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await response.json());
  } else if (contentType.includes('application/text')) {
    return await response.text();
  } else if (contentType.includes('text/html')) {
    return await response.text();
  } else {
    return await response.text();
  }
}

export async function reqwest(url: string, init: any = null) {
  const response = await fetch(url, init);
  return await gatherResponse(response);
}

export function buf2hex(buffer: ArrayBuffer) {
  // buffer is an ArrayBuffer
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

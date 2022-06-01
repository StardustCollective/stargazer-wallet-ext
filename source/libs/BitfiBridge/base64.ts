export const decode = function (s: any) {
    let e: any = {}, i: number, b: number = 0, c: any, x: number, l: number = 0, a: any, r: string = '', w: any = String.fromCharCode, L: number = s.length;
    let A: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0; i < 64; i++) { e[A.charAt(i)] = i; }
    for (x = 0; x < L; x++) {
      c = e[s.charAt(x)]; b = (b << 6) + c; l += 6;
      while (l >= 8) { ((a = (b >>> (l -= 8)) & 0xff) || (x < (L - 2))) && (r += w(a)); }
    }
    return r;
  };
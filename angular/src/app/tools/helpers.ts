import { AppDefinitions } from '../definitions';
import { Headers, RequestOptions } from '@angular/http';
import { Cookie } from './cookie';
import { UserInfoModel } from '../security/user-info.model';
import { SystemMode } from '../top/system-mode';
import { FormGroup } from '@angular/forms';
import { CurrencyModel } from '../common/currency.model';
export class Helpers {
  public static obj2params(object: Object) {
    return Object.keys(object).map((value) => {
      var objectValue = object[value];
      return `${value}=${objectValue}`;
    }).join('&');
  }

  public static obj2urlparams(object: Object) {
    return Object.keys(object).map((value) => {
      var objectValue = object[value];
      return `${value}=${objectValue}`;
    }).join('&');
  }
  
  public static markAsTouched(f: FormGroup) {
    for (let inner in f.controls) {
      f.get(inner).markAsTouched();
      f.get(inner).updateValueAndValidity();
    }
  }
  public static checkPassword(pass: string) {
    return (pass.length > 5);
  }

  public static md5(str: string) {
    var MD5 = function (s) { function L(k, d) { return (k << d) | (k >>> (32 - d)) } function K(G, k) { var I, d, F, H, x; F = (G & 2147483648); H = (k & 2147483648); I = (G & 1073741824); d = (k & 1073741824); x = (G & 1073741823) + (k & 1073741823); if (I & d) { return (x ^ 2147483648 ^ F ^ H) } if (I | d) { if (x & 1073741824) { return (x ^ 3221225472 ^ F ^ H) } else { return (x ^ 1073741824 ^ F ^ H) } } else { return (x ^ F ^ H) } } function r(d, F, k) { return (d & F) | ((~d) & k) } function q(d, F, k) { return (d & k) | (F & (~k)) } function p(d, F, k) { return (d ^ F ^ k) } function n(d, F, k) { return (F ^ (d | (~k))) } function u(G, F, aa, Z, k, H, I) { G = K(G, K(K(r(F, aa, Z), k), I)); return K(L(G, H), F) } function f(G, F, aa, Z, k, H, I) { G = K(G, K(K(q(F, aa, Z), k), I)); return K(L(G, H), F) } function D(G, F, aa, Z, k, H, I) { G = K(G, K(K(p(F, aa, Z), k), I)); return K(L(G, H), F) } function t(G, F, aa, Z, k, H, I) { G = K(G, K(K(n(F, aa, Z), k), I)); return K(L(G, H), F) } function e(G) { var Z; var F = G.length; var x = F + 8; var k = (x - (x % 64)) / 64; var I = (k + 1) * 16; var aa = Array(I - 1); var d = 0; var H = 0; while (H < F) { Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = (aa[Z] | (G.charCodeAt(H) << d)); H++ } Z = (H - (H % 4)) / 4; d = (H % 4) * 8; aa[Z] = aa[Z] | (128 << d); aa[I - 2] = F << 3; aa[I - 1] = F >>> 29; return aa } function B(x) { var k = "", F = "", G, d; for (d = 0; d <= 3; d++) { G = (x >>> (d * 8)) & 255; F = "0" + G.toString(16); k = k + F.substr(F.length - 2, 2) } return k } function J(k) { k = k.replace(/rn/g, "n"); var d = ""; for (var F = 0; F < k.length; F++) { var x = k.charCodeAt(F); if (x < 128) { d += String.fromCharCode(x) } else { if ((x > 127) && (x < 2048)) { d += String.fromCharCode((x >> 6) | 192); d += String.fromCharCode((x & 63) | 128) } else { d += String.fromCharCode((x >> 12) | 224); d += String.fromCharCode(((x >> 6) & 63) | 128); d += String.fromCharCode((x & 63) | 128) } } } return d } var C = Array(); var P, h, E, v, g, Y, X, W, V; var S = 7, Q = 12, N = 17, M = 22; var A = 5, z = 9, y = 14, w = 20; var o = 4, m = 11, l = 16, j = 23; var U = 6, T = 10, R = 15, O = 21; s = J(s); C = e(s); Y = 1732584193; X = 4023233417; W = 2562383102; V = 271733878; for (P = 0; P < C.length; P += 16) { h = Y; E = X; v = W; g = V; Y = u(Y, X, W, V, C[P + 0], S, 3614090360); V = u(V, Y, X, W, C[P + 1], Q, 3905402710); W = u(W, V, Y, X, C[P + 2], N, 606105819); X = u(X, W, V, Y, C[P + 3], M, 3250441966); Y = u(Y, X, W, V, C[P + 4], S, 4118548399); V = u(V, Y, X, W, C[P + 5], Q, 1200080426); W = u(W, V, Y, X, C[P + 6], N, 2821735955); X = u(X, W, V, Y, C[P + 7], M, 4249261313); Y = u(Y, X, W, V, C[P + 8], S, 1770035416); V = u(V, Y, X, W, C[P + 9], Q, 2336552879); W = u(W, V, Y, X, C[P + 10], N, 4294925233); X = u(X, W, V, Y, C[P + 11], M, 2304563134); Y = u(Y, X, W, V, C[P + 12], S, 1804603682); V = u(V, Y, X, W, C[P + 13], Q, 4254626195); W = u(W, V, Y, X, C[P + 14], N, 2792965006); X = u(X, W, V, Y, C[P + 15], M, 1236535329); Y = f(Y, X, W, V, C[P + 1], A, 4129170786); V = f(V, Y, X, W, C[P + 6], z, 3225465664); W = f(W, V, Y, X, C[P + 11], y, 643717713); X = f(X, W, V, Y, C[P + 0], w, 3921069994); Y = f(Y, X, W, V, C[P + 5], A, 3593408605); V = f(V, Y, X, W, C[P + 10], z, 38016083); W = f(W, V, Y, X, C[P + 15], y, 3634488961); X = f(X, W, V, Y, C[P + 4], w, 3889429448); Y = f(Y, X, W, V, C[P + 9], A, 568446438); V = f(V, Y, X, W, C[P + 14], z, 3275163606); W = f(W, V, Y, X, C[P + 3], y, 4107603335); X = f(X, W, V, Y, C[P + 8], w, 1163531501); Y = f(Y, X, W, V, C[P + 13], A, 2850285829); V = f(V, Y, X, W, C[P + 2], z, 4243563512); W = f(W, V, Y, X, C[P + 7], y, 1735328473); X = f(X, W, V, Y, C[P + 12], w, 2368359562); Y = D(Y, X, W, V, C[P + 5], o, 4294588738); V = D(V, Y, X, W, C[P + 8], m, 2272392833); W = D(W, V, Y, X, C[P + 11], l, 1839030562); X = D(X, W, V, Y, C[P + 14], j, 4259657740); Y = D(Y, X, W, V, C[P + 1], o, 2763975236); V = D(V, Y, X, W, C[P + 4], m, 1272893353); W = D(W, V, Y, X, C[P + 7], l, 4139469664); X = D(X, W, V, Y, C[P + 10], j, 3200236656); Y = D(Y, X, W, V, C[P + 13], o, 681279174); V = D(V, Y, X, W, C[P + 0], m, 3936430074); W = D(W, V, Y, X, C[P + 3], l, 3572445317); X = D(X, W, V, Y, C[P + 6], j, 76029189); Y = D(Y, X, W, V, C[P + 9], o, 3654602809); V = D(V, Y, X, W, C[P + 12], m, 3873151461); W = D(W, V, Y, X, C[P + 15], l, 530742520); X = D(X, W, V, Y, C[P + 2], j, 3299628645); Y = t(Y, X, W, V, C[P + 0], U, 4096336452); V = t(V, Y, X, W, C[P + 7], T, 1126891415); W = t(W, V, Y, X, C[P + 14], R, 2878612391); X = t(X, W, V, Y, C[P + 5], O, 4237533241); Y = t(Y, X, W, V, C[P + 12], U, 1700485571); V = t(V, Y, X, W, C[P + 3], T, 2399980690); W = t(W, V, Y, X, C[P + 10], R, 4293915773); X = t(X, W, V, Y, C[P + 1], O, 2240044497); Y = t(Y, X, W, V, C[P + 8], U, 1873313359); V = t(V, Y, X, W, C[P + 15], T, 4264355552); W = t(W, V, Y, X, C[P + 6], R, 2734768916); X = t(X, W, V, Y, C[P + 13], O, 1309151649); Y = t(Y, X, W, V, C[P + 4], U, 4149444226); V = t(V, Y, X, W, C[P + 11], T, 3174756917); W = t(W, V, Y, X, C[P + 2], R, 718787259); X = t(X, W, V, Y, C[P + 9], O, 3951481745); Y = K(Y, h); X = K(X, E); W = K(W, v); V = K(V, g) } var i = B(Y) + B(X) + B(W) + B(V); return i.toLowerCase() };
    return MD5(str);
  }

  public static getCurrency(curr: CurrencyModel[], num: number): string {
    if (curr.length == 0)
      return 'undefined';

    for (let i = 0; i > curr.length; i++) {
      if (curr[i].id == num)
        return curr[i].short;
    }
    return 'undefined';
  }

  public static getSecondsAgoFromDate(date) {
    return Math.floor((new Date().getTime() - date.getTime()) / 1000);
  }
  public static getBackendUrl(): string {
    if (Helpers.isLocalMode())
      return AppDefinitions.backend_address_local;
    if (Helpers.isTestMode())
      return AppDefinitions.backend_address_test;
    return AppDefinitions.backend_address;
  }

  public static getBaseUrl(): string {
    if (Helpers.isLocalMode())
      return AppDefinitions.app_address_local;
    if (Helpers.isTestMode())
      return AppDefinitions.app_address_test;
    return AppDefinitions.app_address;
  }

  public static getFlagUrl(filename: string) {
    var img = new Image();
    img.src = Helpers.getBackendUrl() + '/imgs/flags/' + filename + '.png';

    if (img.height != 0)
      return img.src;
    return Helpers.getBackendUrl() + '/img/flags/noflag.png';
  }

  public static increaseLoadedNumOfElements(numOfElementsToLoad: number, loaded: number): number {
    ++loaded;
    if (loaded - 1 == numOfElementsToLoad)
      return 0;
    return loaded;
  }

  public static isIdProfileId(companyId: number) {
    return (companyId == +Cookie.getCookie(AppDefinitions.authCompanyIdCookieName));
  }

  public static isLocalMode() {
    return window.location.hostname == "localhost";
  }

  public static isTestMode() {
    return window.location.hostname == "test.snarto.com";
  }


  public static timestampToStrDate(timestamp: number): string {
    if (!timestamp)
      return 'NaN';

    var t = new Date(timestamp * 1000);



    return (t.getDate() > 9 ? t.getDate().toString() : ('0' + t.getDate().toString())) + '/' +
      ((t.getMonth() + 1) > 9 ? (t.getMonth() + 1).toString() : ('0' + (t.getMonth() + 1).toString())) + '/' +
      t.getFullYear() + ' ' +
      (t.getHours() > 9 ? t.getHours().toString() : ('0' + t.getHours().toString())) + ":" +
      (t.getMinutes() > 9 ? t.getMinutes().toString() : ('0' + t.getMinutes().toString()));
  }

  public static formatDate(date: Date = null): string {
    if (!date)
      date = new Date();
    let d = date;

    let month: string = (d.getMonth() + 1).toString();
    if (month.length < 2) {
      month = `0${month}`;
    }
    let day: string = (date.getDate()).toString();
    if (day.length < 2) {
      day = `0${day}`;
    }

    return `${date.getFullYear()}-${month}-${day}`;
  }

  public static getNameFromModel(id: string, modelArray: any): string {
    if (id === undefined || modelArray === undefined)
      return;
    //iterate over each element in the array
    for (var i = 0; i < modelArray.length; i++)
      if (id.toString() === modelArray[i].id.toString())
        return modelArray[i].name;
    return 'name not found error:';// + id;
  }

  public static getRequestHeaders(auth: boolean = true, auth_key: string = null): RequestOptions {
    let headers = new Headers();

    if (auth) {
      let key = auth_key ? auth_key : Cookie.getCookie(AppDefinitions.authKeyCookieName);
      headers.append('Authorization', 'Bearer ' + key)
    }
    headers.append('Content-Type', 'application/json');
    let headersOptions = new RequestOptions({ headers: headers });
    return headersOptions;
  }

  public static isIdUserId(uid: number) {
    if (uid.toString() == Cookie.getCookie(AppDefinitions.authUserIdCookieName))
      return true;
    else return false;
  }

  public static getUID(): string {
    return 'xxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  public static getFileUrl(file: string) {
    return Helpers.getBackendUrl() + 'upload/' + file;
  }
  public static getImageLink(foto: string, default_foto: string = null) {
    if (!default_foto)
      default_foto = "no-truck.png";
    if (!foto || foto == "undefined" || foto == "null")
      return Helpers.getBackendUrl() + 'imgs/' + default_foto;
    return Helpers.getBackendUrl() + 'upload/' + foto;
  }

  public static isOfferOwner(id_company: number) {
    return (id_company == +Cookie.getCookie(AppDefinitions.authUserIdCookieName));
  }

  public static isNumeric(s) {
    var rgx = /^[0-9]*\.?[0-9]*$/;
    return s.match(rgx);
  }
  public static getFileIconCssByFileName(name: string): string {
    if (!name) {
      console.log('invoice file icon not possible to get because file is null');

      return;
    }
    let ext = name.split('.').pop();
    let retVal: string;
    switch (ext) {
      case 'pdf': retVal = "pdf"; break;
      case 'png': retVal = "image"; break;
      case 'jpg': retVal = "image"; break;
      case 'zip': retVal = "archive"; break;
      default: retVal = "file"; break;
    }
    return retVal;
  }

  public static getCategoryIcon(id: number): string {
    let prefix = 'icon-';
    let retVal: string;
    switch (+id) {
      case 27: retVal = 'caution-sign'; break; //fragile
      case 28: retVal = 'pallet'; break; //Pallets
      case 29: retVal = 'truck'; break;
      case 30: retVal = 'monitor'; break;
      case 31: retVal = 'armchair'; break;
      case 33: retVal = 'delivery-truck-alt'; break;
      case 34: retVal = 'package'; break;
      case 35: retVal = 'settings-cog'; break;
      case 36: retVal = 'pets'; break;
      case 37: retVal = 'weight'; break;
    }
    return prefix + retVal;
  }

  public static getCategoryIconCode(id: string): string {
    let prefix = "&#x";
    let suffix = ';';
    let retVal: string;
    switch (id) {
      case '27': retVal = 'e90d'; break;
      case '28': retVal = 'e936'; break;
      case '29': retVal = 'e90c'; break;
      case '30': retVal = 'e926'; break;
      case '31': retVal = 'e901'; break;
      case '33': retVal = 'e915'; break;
      case '34': retVal = 'e929'; break;
      case '35': retVal = 'e92d'; break;
      case '36': retVal = 'pets'; break;
      case '37': retVal = 'e935'; break;
    }
    return prefix + retVal + suffix;
  }


  public static getDistance(lat1, lon1, lat2, lon2) {
    var pi = 0.017453292519943295;    // Math.PI / 180
    var c = Math.cos;
    var a = 0.5 - c((lat2 - lat1) * pi) / 2 +
      c(lat1 * pi) * c(lat2 * pi) *
      (1 - c((lon2 - lon1) * pi)) / 2;

    return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
  }
}
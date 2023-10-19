
// Imports
import * as _0_0 from "//Users/devinrader/Projects/realtime-collaborative-datagrid/src/api/token.js";


export const routeBase = "/api";

const internal  = [
  _0_0.default && {
        source     : "src/api/token.js?fn=default",
        method     : "use",
        route      : "/token",
        path       : "/api/token",
        url        : "/api/token",
        cb         : _0_0.default,
      },
  _0_0.GET && {
        source     : "src/api/token.js?fn=GET",
        method     : "get",
        route      : "/token",
        path       : "/api/token",
        url        : "/api/token",
        cb         : _0_0.GET,
      },
  _0_0.PUT && {
        source     : "src/api/token.js?fn=PUT",
        method     : "put",
        route      : "/token",
        path       : "/api/token",
        url        : "/api/token",
        cb         : _0_0.PUT,
      },
  _0_0.POST && {
        source     : "src/api/token.js?fn=POST",
        method     : "post",
        route      : "/token",
        path       : "/api/token",
        url        : "/api/token",
        cb         : _0_0.POST,
      },
  _0_0.PATCH && {
        source     : "src/api/token.js?fn=PATCH",
        method     : "patch",
        route      : "/token",
        path       : "/api/token",
        url        : "/api/token",
        cb         : _0_0.PATCH,
      },
  _0_0.DELETE && {
        source     : "src/api/token.js?fn=DELETE",
        method     : "delete",
        route      : "/token",
        path       : "/api/token",
        url        : "/api/token",
        cb         : _0_0.DELETE,
      }
].filter(it => it);

export const routers = internal.map((it) => { 
  const { method, path, route, url, source} = it;
  return { method, url, path, route, source };
});

export const endpoints = internal.map((it) => it.method?.toUpperCase() + '\t' + it.url);

const FN = (value) => value;

export const applyRouters = (applyRouter, opts = {} ) => {
  const {pre = FN, post = FN, hoc = FN} = opts;
  pre(internal)
    .forEach((it) => {
    it.cb = hoc(it.cb, it);
    applyRouter(it);
  });  
  post(internal);
};

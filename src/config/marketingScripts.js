// src/config/marketingScripts.js
export const marketingScripts = {
  googleAnalytics: {
    id: "ga-script",
    src: (id) => `https://www.googletagmanager.com/gtag/js?id=${id}`,
    init: (id) => {
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        window.dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", id);
    },
  },
  googleTagManager: {
    id: "gtm-script",
    src: (id) => `https://www.googletagmanager.com/gtm.js?id=${id}`,
  },
  metaPixel: {
    id: "fb-pixel",
    src: () => "https://connect.facebook.net/en_US/fbevents.js",
    init: (id) => {
      !(function (f, b, e, v, n, t, s) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod
            ? n.callMethod.apply(n, arguments)
            : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = "2.0";
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t, s);
      })(
        window,
        document,
        "script",
        "https://connect.facebook.net/en_US/fbevents.js"
      );

      window.fbq("init", id);
      window.fbq("track", "PageView");
    },
  },
  tiktokPixel: {
    id: "ttq-script",
    src: () => "https://analytics.tiktok.com/i18n/pixel/events.js",
    init: (id) => {
      window.ttq = window.ttq || [];
      (function (w, d, t) {
        w.TiktokAnalyticsObject = t;
        var ttq = (w[t] = w[t] || []);
        ttq.methods = [
          "page",
          "track",
          "identify",
          "instances",
          "debug",
          "on",
          "off",
          "once",
          "ready",
          "alias",
          "group",
          "enableCookie",
          "disableCookie",
        ];
        ttq.setAndDefer = function (t, e) {
          t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          };
        };
        for (var i = 0; i < ttq.methods.length; i++) {
          ttq.setAndDefer(ttq, ttq.methods[i]);
        }
        ttq.instance = function (t) {
          var e = ttq._i[t] || [];
          for (var n = 0; n < ttq.methods.length; n++) {
            ttq.setAndDefer(e, ttq.methods[n]);
          }
          return e;
        };
        ttq.load = function (e, n) {
          var i = "https://analytics.tiktok.com/i18n/pixel/events.js";
          (ttq._i = ttq._i || {}), (ttq._i[e] = []), (ttq._i[e]._u = i);
          (ttq._t = ttq._t || {}),
            (ttq._t[e] = +new Date()),
            (ttq._o = ttq._o || {}),
            (ttq._o[e] = n || {});
          var o = document.createElement("script");
          (o.type = "text/javascript"),
            (o.async = !0),
            (o.src = i + "?sdkid=" + e + "&lib=" + t);
          var a = document.getElementsByTagName("script")[0];
          a.parentNode.insertBefore(o, a);
        };
      })(window, document, "ttq");

      window.ttq.load(id);
      window.ttq.page();
    },
  },
  twitterPixel: {
    id: "twq-script",
    src: () => "https://static.ads-twitter.com/uwt.js",
    init: (id) => {
      !(function (e, t, n, s, u, a) {
        e.twq ||
          ((s = e.twq =
            function () {
              s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
            }),
          (s.version = "1.1"),
          (s.queue = []),
          (u = t.createElement(n)),
          (u.async = !0),
          (u.src = "https://static.ads-twitter.com/uwt.js"),
          (a = t.getElementsByTagName(n)[0]),
          a.parentNode.insertBefore(u, a));
      })(window, document, "script");
      window.twq("init", id);
      window.twq("track", "PageView");
    },
  },
  snapchatPixel: {
    id: "snap-pixel",
    src: () => "https://sc-static.net/scevent.min.js",
    init: (id) => {
      (function (e, t, n) {
        if (e.snaptr) return;
        var a = (e.snaptr = function () {
          a.handleRequest
            ? a.handleRequest.apply(a, arguments)
            : a.queue.push(arguments);
        });
        a.queue = [];
        var s = "script";
        var r = t.createElement(s);
        r.async = !0;
        r.src = n;
        var u = t.getElementsByTagName(s)[0];
        u.parentNode.insertBefore(r, u);
      })(window, document, "https://sc-static.net/scevent.min.js");

      window.snaptr("init", id);
      window.snaptr("track", "PAGE_VIEW");
    },
  },
};

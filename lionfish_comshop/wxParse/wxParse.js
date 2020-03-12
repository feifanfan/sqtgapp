function e(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}

function t(e, t, a) {
    return t in e ? Object.defineProperty(e, t, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = a, e;
}

function a(e) {
    var t = this, a = e.target.dataset.src, i = e.target.dataset.from;
    void 0 !== i && i.length > 0 && wx.previewImage({
        current: a,
        urls: t.data[i].imageUrls
    });
}

function i(e, t) {
    return e && e.length ? e.map(function(e) {
        if ("img" === e.tag || "image" === e.tag) {
            var a = e.attr.src;
            var sysInfo = wx.getSystemInfoSync();
            e.attr.src = a + "?imageView2/2/w/" + Math.ceil(sysInfo.windowWidth * sysInfo.pixelRatio) + "/ignore-error/1";
        }
        return e.nodes && e.nodes.length && (e.nodes = i(e.nodes, t)), e;
    }) : [];
}

function r(e) {
    var t = this, a = e.target.dataset.from, i = e.target.dataset.idx;
    void 0 !== a && a.length > 0 && n(e, i, t, a);
}

function n(e, a, i, r) {
    var n, d = i.data[r];
    if (d && 0 != d.images.length) {
        var s = d.images, g = o(e.detail.width, e.detail.height, i, r), l = s[a].index, h = "" + r, m = !0, u = !1, v = void 0;
        try {
            for (var f, w = l.split(".")[Symbol.iterator](); !(m = (f = w.next()).done); m = !0) h += ".nodes[" + f.value + "]";
        } catch (e) {
            u = !0, v = e;
        } finally {
            try {
                !m && w.return && w.return();
            } finally {
                if (u) throw v;
            }
        }
        var c = h + ".width", x = h + ".height";
        i.setData((n = {}, t(n, c, g.imageWidth), t(n, x, g.imageheight), n));
    }
}

function o(e, t, a, i) {
    var r = 0, n = 0, o = 0, d = {}, s = a.data[i].view.imagePadding;
    return r = g - 2 * s, l, e > r ? (o = (n = r) * t / e, d.imageWidth = n, d.imageheight = o) : (d.imageWidth = e, 
    d.imageheight = t), d;
}

var d = e(require("./showdown.js")), s = e(require("./html2json.js")), g = 0, l = 0;

wx.getSystemInfo({
    success: function(e) {
        g = e.windowWidth, l = e.windowHeight;
    }
}), module.exports = {
    wxParse: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "wxParseData", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "html", n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : '', o = arguments[3], g = arguments[4], l = arguments[5], h = o, m = {};
        if ("html" == t) m = s.default.html2json(n, e); else if ("md" == t || "markdown" == t) {
            var u = new d.default.Converter().makeHtml(n);
            m = s.default.html2json(u, e);
        }
        m.nodes = i(m.nodes, l), m.view = {}, m.view.imagePadding = 0, void 0 !== g && (m.view.imagePadding = g);
        var v = {};
        v[e] = m, h.setData(v), h.wxParseImgLoad = r, h.wxParseImgTap = a;
    },
    wxParseTemArray: function(e, t, a, i) {
        for (var r = [], n = i.data, o = null, d = 0; d < a; d++) {
            var s = n[t + d].nodes;
            r.push(s);
        }
        e = e || "wxParseTemArray", (o = JSON.parse('{"' + e + '":""}'))[e] = r, i.setData(o);
    },
    emojisInit: function() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "", t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "/wxParse/emojis/", a = arguments[2];
        s.default.emojisInit(e, t, a);
    }
};
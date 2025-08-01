/*! $FileVersion=1.1.386 */ var sha256_fileVersion = "1.1.386"; 
/*
Copyright (c) 2008-2017, Brian Turek
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
 * Neither the name of the the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from this
   software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

--------------------------------------------------------------------------------

Portions of this software are derived from code under the same license and with
the following copyright notice:

Copyright (c) 1998 - 2009, Paul Johnston & Contributors
All rights reserved.

Original code is available on http://pajhome.org.uk/crypt/md5
*/

/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict'; (function (Y) {
    function C(c, a, b) {
        var e = 0, h = [], n = 0, g, l, d, f, m, q, u, r, I = !1, v = [], w = [], t, y = !1, z = !1, x = -1; b = b || {}; g = b.encoding || "UTF8"; t = b.numRounds || 1; if (t !== parseInt(t, 10) || 1 > t) throw Error("numRounds must a integer >= 1"); if ("SHA-1" === c) m = 512, q = K, u = Z, f = 160, r = function (a) { return a.slice() }; else if (0 === c.lastIndexOf("SHA-", 0)) if (q = function (a, b) { return L(a, b, c) }, u = function (a, b, h, e) {
        var k, f; if ("SHA-224" === c || "SHA-256" === c) k = (b + 65 >>> 9 << 4) + 15, f = 16; else if ("SHA-384" === c || "SHA-512" === c) k = (b + 129 >>> 10 <<
        5) + 31, f = 32; else throw Error("Unexpected error in SHA-2 implementation"); for (; a.length <= k;) a.push(0); a[b >>> 5] |= 128 << 24 - b % 32; b = b + h; a[k] = b & 4294967295; a[k - 1] = b / 4294967296 | 0; h = a.length; for (b = 0; b < h; b += f) e = L(a.slice(b, b + f), e, c); if ("SHA-224" === c) a = [e[0], e[1], e[2], e[3], e[4], e[5], e[6]]; else if ("SHA-256" === c) a = e; else if ("SHA-384" === c) a = [e[0].a, e[0].b, e[1].a, e[1].b, e[2].a, e[2].b, e[3].a, e[3].b, e[4].a, e[4].b, e[5].a, e[5].b]; else if ("SHA-512" === c) a = [e[0].a, e[0].b, e[1].a, e[1].b, e[2].a, e[2].b, e[3].a, e[3].b, e[4].a,
        e[4].b, e[5].a, e[5].b, e[6].a, e[6].b, e[7].a, e[7].b]; else throw Error("Unexpected error in SHA-2 implementation"); return a
        }, r = function (a) { return a.slice() }, "SHA-224" === c) m = 512, f = 224; else if ("SHA-256" === c) m = 512, f = 256; else if ("SHA-384" === c) m = 1024, f = 384; else if ("SHA-512" === c) m = 1024, f = 512; else throw Error("Chosen SHA variant is not supported"); else if (0 === c.lastIndexOf("SHA3-", 0) || 0 === c.lastIndexOf("SHAKE", 0))
        {
            var F = 6; q = D; r = function (a) { var c = [], e; for (e = 0; 5 > e; e += 1) c[e] = a[e].slice(); return c }; x = 1; if ("SHA3-224" ===
            c) m = 1152, f = 224; else if ("SHA3-256" === c) m = 1088, f = 256; else if ("SHA3-384" === c) m = 832, f = 384; else if ("SHA3-512" === c) m = 576, f = 512; else if ("SHAKE128" === c) m = 1344, f = -1, F = 31, z = !0; else if ("SHAKE256" === c) m = 1088, f = -1, F = 31, z = !0; else throw Error("Chosen SHA variant is not supported"); u = function (a, c, e, b, h) {
                e = m; var k = F, f, g = [], n = e >>> 5, l = 0, d = c >>> 5; for (f = 0; f < d && c >= e; f += n) b = D(a.slice(f, f + n), b), c -= e; a = a.slice(f); for (c %= e; a.length < n;) a.push(0); f = c >>> 3; a[f >> 2] ^= k << f % 4 * 8; a[n - 1] ^= 2147483648; for (b = D(a, b) ; 32 * g.length < h;)
                {
                    a = b[l %
                    5][l / 5 | 0]; g.push(a.b); if (32 * g.length >= h) break; g.push(a.a); l += 1; 0 === 64 * l % e && D(null, b)
                } return g
            }
        } else throw Error("Chosen SHA variant is not supported"); d = M(a, g, x); l = A(c); this.setHMACKey = function (a, b, h) {
            var k; if (!0 === I) throw Error("HMAC key already set"); if (!0 === y) throw Error("Cannot set HMAC key after calling update"); if (!0 === z) throw Error("SHAKE is not supported for HMAC"); g = (h || {}).encoding || "UTF8"; b = M(b, g, x)(a); a = b.binLen; b = b.value; k = m >>> 3; h = k / 4 - 1; if (k < a / 8)
            {
                for (b = u(b, a, 0, A(c), f) ; b.length <= h;) b.push(0);
                b[h] &= 4294967040
            } else if (k > a / 8) { for (; b.length <= h;) b.push(0); b[h] &= 4294967040 } for (a = 0; a <= h; a += 1) v[a] = b[a] ^ 909522486, w[a] = b[a] ^ 1549556828; l = q(v, l); e = m; I = !0
        }; this.update = function (a) { var c, b, k, f = 0, g = m >>> 5; c = d(a, h, n); a = c.binLen; b = c.value; c = a >>> 5; for (k = 0; k < c; k += g) f + m <= a && (l = q(b.slice(k, k + g), l), f += m); e += f; h = b.slice(f >>> 5); n = a % m; y = !0 }; this.getHash = function (a, b) {
            var k, g, d, m; if (!0 === I) throw Error("Cannot call getHash after setting HMAC key"); d = N(b); if (!0 === z)
            {
                if (-1 === d.shakeLen) throw Error("shakeLen must be specified in options");
                f = d.shakeLen
            } switch (a) { case "HEX": k = function (a) { return O(a, f, x, d) }; break; case "B64": k = function (a) { return P(a, f, x, d) }; break; case "BYTES": k = function (a) { return Q(a, f, x) }; break; case "ARRAYBUFFER": try { g = new ArrayBuffer(0) } catch (p) { throw Error("ARRAYBUFFER not supported by this environment"); } k = function (a) { return R(a, f, x) }; break; default: throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER"); } m = u(h.slice(), n, e, r(l), f); for (g = 1; g < t; g += 1) !0 === z && 0 !== f % 32 && (m[m.length - 1] &= 16777215 >>> 24 - f % 32), m = u(m, f,
            0, A(c), f); return k(m)
        }; this.getHMAC = function (a, b) {
            var k, g, d, p; if (!1 === I) throw Error("Cannot call getHMAC without first setting HMAC key"); d = N(b); switch (a)
            {
                case "HEX": k = function (a) { return O(a, f, x, d) }; break; case "B64": k = function (a) { return P(a, f, x, d) }; break; case "BYTES": k = function (a) { return Q(a, f, x) }; break; case "ARRAYBUFFER": try { k = new ArrayBuffer(0) } catch (v) { throw Error("ARRAYBUFFER not supported by this environment"); } k = function (a) { return R(a, f, x) }; break; default: throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
            } g = u(h.slice(), n, e, r(l), f); p = q(w, A(c)); p = u(g, f, m, p, f); return k(p)
        }
    } function b(c, a) { this.a = c; this.b = a } function O(c, a, b, e) { var h = ""; a /= 8; var n, g, d; d = -1 === b ? 3 : 0; for (n = 0; n < a; n += 1) g = c[n >>> 2] >>> 8 * (d + n % 4 * b), h += "0123456789abcdef".charAt(g >>> 4 & 15) + "0123456789abcdef".charAt(g & 15); return e.outputUpper ? h.toUpperCase() : h } function P(c, a, b, e) {
        var h = "", n = a / 8, g, d, p, f; f = -1 === b ? 3 : 0; for (g = 0; g < n; g += 3) for (d = g + 1 < n ? c[g + 1 >>> 2] : 0, p = g + 2 < n ? c[g + 2 >>> 2] : 0, p = (c[g >>> 2] >>> 8 * (f + g % 4 * b) & 255) << 16 | (d >>> 8 * (f + (g + 1) % 4 * b) & 255) << 8 | p >>> 8 * (f +
        (g + 2) % 4 * b) & 255, d = 0; 4 > d; d += 1) 8 * g + 6 * d <= a ? h += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(p >>> 6 * (3 - d) & 63) : h += e.b64Pad; return h
    } function Q(c, a, b) { var e = ""; a /= 8; var h, d, g; g = -1 === b ? 3 : 0; for (h = 0; h < a; h += 1) d = c[h >>> 2] >>> 8 * (g + h % 4 * b) & 255, e += String.fromCharCode(d); return e } function R(c, a, b) { a /= 8; var e, h = new ArrayBuffer(a), d, g; g = new Uint8Array(h); d = -1 === b ? 3 : 0; for (e = 0; e < a; e += 1) g[e] = c[e >>> 2] >>> 8 * (d + e % 4 * b) & 255; return h } function N(c) {
        var a = { outputUpper: !1, b64Pad: "=", shakeLen: -1 }; c = c || {};
        a.outputUpper = c.outputUpper || !1; !0 === c.hasOwnProperty("b64Pad") && (a.b64Pad = c.b64Pad); if (!0 === c.hasOwnProperty("shakeLen")) { if (0 !== c.shakeLen % 8) throw Error("shakeLen must be a multiple of 8"); a.shakeLen = c.shakeLen } if ("boolean" !== typeof a.outputUpper) throw Error("Invalid outputUpper formatting option"); if ("string" !== typeof a.b64Pad) throw Error("Invalid b64Pad formatting option"); return a
    } function M(c, a, b) {
        switch (a)
        {
            case "UTF8": case "UTF16BE": case "UTF16LE": break; default: throw Error("encoding must be UTF8, UTF16BE, or UTF16LE");
        } switch (c)
        {
            case "HEX": c = function (a, c, d) { var g = a.length, l, p, f, m, q, u; if (0 !== g % 2) throw Error("String of HEX type must be in byte increments"); c = c || [0]; d = d || 0; q = d >>> 3; u = -1 === b ? 3 : 0; for (l = 0; l < g; l += 2) { p = parseInt(a.substr(l, 2), 16); if (isNaN(p)) throw Error("String of HEX type contains invalid characters"); m = (l >>> 1) + q; for (f = m >>> 2; c.length <= f;) c.push(0); c[f] |= p << 8 * (u + m % 4 * b) } return { value: c, binLen: 4 * g + d } }; break; case "TEXT": c = function (c, h, d) {
                var g, l, p = 0, f, m, q, u, r, t; h = h || [0]; d = d || 0; q = d >>> 3; if ("UTF8" === a) for (t = -1 ===
                b ? 3 : 0, f = 0; f < c.length; f += 1) for (g = c.charCodeAt(f), l = [], 128 > g ? l.push(g) : 2048 > g ? (l.push(192 | g >>> 6), l.push(128 | g & 63)) : 55296 > g || 57344 <= g ? l.push(224 | g >>> 12, 128 | g >>> 6 & 63, 128 | g & 63) : (f += 1, g = 65536 + ((g & 1023) << 10 | c.charCodeAt(f) & 1023), l.push(240 | g >>> 18, 128 | g >>> 12 & 63, 128 | g >>> 6 & 63, 128 | g & 63)), m = 0; m < l.length; m += 1) { r = p + q; for (u = r >>> 2; h.length <= u;) h.push(0); h[u] |= l[m] << 8 * (t + r % 4 * b); p += 1 } else if ("UTF16BE" === a || "UTF16LE" === a) for (t = -1 === b ? 2 : 0, l = "UTF16LE" === a && 1 !== b || "UTF16LE" !== a && 1 === b, f = 0; f < c.length; f += 1)
                    {
                    g = c.charCodeAt(f);
                    !0 === l && (m = g & 255, g = m << 8 | g >>> 8); r = p + q; for (u = r >>> 2; h.length <= u;) h.push(0); h[u] |= g << 8 * (t + r % 4 * b); p += 2
                } return { value: h, binLen: 8 * p + d }
            }; break; case "B64": c = function (a, c, d) {
                var g = 0, l, p, f, m, q, u, r, t; if (-1 === a.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string"); p = a.indexOf("="); a = a.replace(/\=/g, ""); if (-1 !== p && p < a.length) throw Error("Invalid '=' found in base-64 string"); c = c || [0]; d = d || 0; u = d >>> 3; t = -1 === b ? 3 : 0; for (p = 0; p < a.length; p += 4)
                {
                    q = a.substr(p, 4); for (f = m = 0; f < q.length; f += 1) l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(q[f]),
                    m |= l << 18 - 6 * f; for (f = 0; f < q.length - 1; f += 1) { r = g + u; for (l = r >>> 2; c.length <= l;) c.push(0); c[l] |= (m >>> 16 - 8 * f & 255) << 8 * (t + r % 4 * b); g += 1 }
                } return { value: c, binLen: 8 * g + d }
            }; break; case "BYTES": c = function (a, c, d) { var g, l, p, f, m, q; c = c || [0]; d = d || 0; p = d >>> 3; q = -1 === b ? 3 : 0; for (l = 0; l < a.length; l += 1) g = a.charCodeAt(l), m = l + p, f = m >>> 2, c.length <= f && c.push(0), c[f] |= g << 8 * (q + m % 4 * b); return { value: c, binLen: 8 * a.length + d } }; break; case "ARRAYBUFFER": try { c = new ArrayBuffer(0) } catch (e) { throw Error("ARRAYBUFFER not supported by this environment"); } c =
            function (a, c, d) { var g, l, p, f, m, q; c = c || [0]; d = d || 0; l = d >>> 3; m = -1 === b ? 3 : 0; q = new Uint8Array(a); for (g = 0; g < a.byteLength; g += 1) f = g + l, p = f >>> 2, c.length <= p && c.push(0), c[p] |= q[g] << 8 * (m + f % 4 * b); return { value: c, binLen: 8 * a.byteLength + d } }; break; default: throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
        } return c
    } function y(c, a) { return c << a | c >>> 32 - a } function S(c, a) { return 32 < a ? (a -= 32, new b(c.b << a | c.a >>> 32 - a, c.a << a | c.b >>> 32 - a)) : 0 !== a ? new b(c.a << a | c.b >>> 32 - a, c.b << a | c.a >>> 32 - a) : c } function w(c, a) {
        return c >>>
        a | c << 32 - a
    } function t(c, a) { var k = null, k = new b(c.a, c.b); return k = 32 >= a ? new b(k.a >>> a | k.b << 32 - a & 4294967295, k.b >>> a | k.a << 32 - a & 4294967295) : new b(k.b >>> a - 32 | k.a << 64 - a & 4294967295, k.a >>> a - 32 | k.b << 64 - a & 4294967295) } function T(c, a) { var k = null; return k = 32 >= a ? new b(c.a >>> a, c.b >>> a | c.a << 32 - a & 4294967295) : new b(0, c.a >>> a - 32) } function aa(c, a, b) { return c & a ^ ~c & b } function ba(c, a, k) { return new b(c.a & a.a ^ ~c.a & k.a, c.b & a.b ^ ~c.b & k.b) } function U(c, a, b) { return c & a ^ c & b ^ a & b } function ca(c, a, k) {
        return new b(c.a & a.a ^ c.a & k.a ^ a.a &
        k.a, c.b & a.b ^ c.b & k.b ^ a.b & k.b)
    } function da(c) { return w(c, 2) ^ w(c, 13) ^ w(c, 22) } function ea(c) { var a = t(c, 28), k = t(c, 34); c = t(c, 39); return new b(a.a ^ k.a ^ c.a, a.b ^ k.b ^ c.b) } function fa(c) { return w(c, 6) ^ w(c, 11) ^ w(c, 25) } function ga(c) { var a = t(c, 14), k = t(c, 18); c = t(c, 41); return new b(a.a ^ k.a ^ c.a, a.b ^ k.b ^ c.b) } function ha(c) { return w(c, 7) ^ w(c, 18) ^ c >>> 3 } function ia(c) { var a = t(c, 1), k = t(c, 8); c = T(c, 7); return new b(a.a ^ k.a ^ c.a, a.b ^ k.b ^ c.b) } function ja(c) { return w(c, 17) ^ w(c, 19) ^ c >>> 10 } function ka(c) {
        var a = t(c, 19), k = t(c, 61);
        c = T(c, 6); return new b(a.a ^ k.a ^ c.a, a.b ^ k.b ^ c.b)
    } function G(c, a) { var b = (c & 65535) + (a & 65535); return ((c >>> 16) + (a >>> 16) + (b >>> 16) & 65535) << 16 | b & 65535 } function la(c, a, b, e) { var h = (c & 65535) + (a & 65535) + (b & 65535) + (e & 65535); return ((c >>> 16) + (a >>> 16) + (b >>> 16) + (e >>> 16) + (h >>> 16) & 65535) << 16 | h & 65535 } function H(c, a, b, e, h) { var d = (c & 65535) + (a & 65535) + (b & 65535) + (e & 65535) + (h & 65535); return ((c >>> 16) + (a >>> 16) + (b >>> 16) + (e >>> 16) + (h >>> 16) + (d >>> 16) & 65535) << 16 | d & 65535 } function ma(c, a) {
        var d, e, h; d = (c.b & 65535) + (a.b & 65535); e = (c.b >>> 16) +
        (a.b >>> 16) + (d >>> 16); h = (e & 65535) << 16 | d & 65535; d = (c.a & 65535) + (a.a & 65535) + (e >>> 16); e = (c.a >>> 16) + (a.a >>> 16) + (d >>> 16); return new b((e & 65535) << 16 | d & 65535, h)
    } function na(c, a, d, e) { var h, n, g; h = (c.b & 65535) + (a.b & 65535) + (d.b & 65535) + (e.b & 65535); n = (c.b >>> 16) + (a.b >>> 16) + (d.b >>> 16) + (e.b >>> 16) + (h >>> 16); g = (n & 65535) << 16 | h & 65535; h = (c.a & 65535) + (a.a & 65535) + (d.a & 65535) + (e.a & 65535) + (n >>> 16); n = (c.a >>> 16) + (a.a >>> 16) + (d.a >>> 16) + (e.a >>> 16) + (h >>> 16); return new b((n & 65535) << 16 | h & 65535, g) } function oa(c, a, d, e, h) {
        var n, g, l; n = (c.b &
        65535) + (a.b & 65535) + (d.b & 65535) + (e.b & 65535) + (h.b & 65535); g = (c.b >>> 16) + (a.b >>> 16) + (d.b >>> 16) + (e.b >>> 16) + (h.b >>> 16) + (n >>> 16); l = (g & 65535) << 16 | n & 65535; n = (c.a & 65535) + (a.a & 65535) + (d.a & 65535) + (e.a & 65535) + (h.a & 65535) + (g >>> 16); g = (c.a >>> 16) + (a.a >>> 16) + (d.a >>> 16) + (e.a >>> 16) + (h.a >>> 16) + (n >>> 16); return new b((g & 65535) << 16 | n & 65535, l)
    } function B(c, a) { return new b(c.a ^ a.a, c.b ^ a.b) } function A(c) {
        var a = [], d; if ("SHA-1" === c) a = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]; else if (0 === c.lastIndexOf("SHA-", 0)) switch (a =
        [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], d = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], c)
        {
            case "SHA-224": break; case "SHA-256": a = d; break; case "SHA-384": a = [new b(3418070365, a[0]), new b(1654270250, a[1]), new b(2438529370, a[2]), new b(355462360, a[3]), new b(1731405415, a[4]), new b(41048885895, a[5]), new b(3675008525, a[6]), new b(1203062813, a[7])]; break; case "SHA-512": a = [new b(d[0], 4089235720), new b(d[1], 2227873595),
            new b(d[2], 4271175723), new b(d[3], 1595750129), new b(d[4], 2917565137), new b(d[5], 725511199), new b(d[6], 4215389547), new b(d[7], 327033209)]; break; default: throw Error("Unknown SHA variant");
        } else if (0 === c.lastIndexOf("SHA3-", 0) || 0 === c.lastIndexOf("SHAKE", 0)) for (c = 0; 5 > c; c += 1) a[c] = [new b(0, 0), new b(0, 0), new b(0, 0), new b(0, 0), new b(0, 0)]; else throw Error("No SHA variants supported"); return a
    } function K(c, a) {
        var b = [], e, d, n, g, l, p, f; e = a[0]; d = a[1]; n = a[2]; g = a[3]; l = a[4]; for (f = 0; 80 > f; f += 1) b[f] = 16 > f ? c[f] : y(b[f -
        3] ^ b[f - 8] ^ b[f - 14] ^ b[f - 16], 1), p = 20 > f ? H(y(e, 5), d & n ^ ~d & g, l, 1518500249, b[f]) : 40 > f ? H(y(e, 5), d ^ n ^ g, l, 1859775393, b[f]) : 60 > f ? H(y(e, 5), U(d, n, g), l, 2400959708, b[f]) : H(y(e, 5), d ^ n ^ g, l, 3395469782, b[f]), l = g, g = n, n = y(d, 30), d = e, e = p; a[0] = G(e, a[0]); a[1] = G(d, a[1]); a[2] = G(n, a[2]); a[3] = G(g, a[3]); a[4] = G(l, a[4]); return a
    } function Z(c, a, b, e) { var d; for (d = (a + 65 >>> 9 << 4) + 15; c.length <= d;) c.push(0); c[a >>> 5] |= 128 << 24 - a % 32; a += b; c[d] = a & 4294967295; c[d - 1] = a / 4294967296 | 0; a = c.length; for (d = 0; d < a; d += 16) e = K(c.slice(d, d + 16), e); return e } function L(c,
    a, k) {
        var e, h, n, g, l, p, f, m, q, u, r, t, v, w, y, A, z, x, F, B, C, D, E = [], J; if ("SHA-224" === k || "SHA-256" === k) u = 64, t = 1, D = Number, v = G, w = la, y = H, A = ha, z = ja, x = da, F = fa, C = U, B = aa, J = d; else if ("SHA-384" === k || "SHA-512" === k) u = 80, t = 2, D = b, v = ma, w = na, y = oa, A = ia, z = ka, x = ea, F = ga, C = ca, B = ba, J = V; else throw Error("Unexpected error in SHA-2 implementation"); k = a[0]; e = a[1]; h = a[2]; n = a[3]; g = a[4]; l = a[5]; p = a[6]; f = a[7]; for (r = 0; r < u; r += 1) 16 > r ? (q = r * t, m = c.length <= q ? 0 : c[q], q = c.length <= q + 1 ? 0 : c[q + 1], E[r] = new D(m, q)) : E[r] = w(z(E[r - 2]), E[r - 7], A(E[r - 15]), E[r -
        16]), m = y(f, F(g), B(g, l, p), J[r], E[r]), q = v(x(k), C(k, e, h)), f = p, p = l, l = g, g = v(n, m), n = h, h = e, e = k, k = v(m, q); a[0] = v(k, a[0]); a[1] = v(e, a[1]); a[2] = v(h, a[2]); a[3] = v(n, a[3]); a[4] = v(g, a[4]); a[5] = v(l, a[5]); a[6] = v(p, a[6]); a[7] = v(f, a[7]); return a
    } function D(c, a) {
        var d, e, h, n, g = [], l = []; if (null !== c) for (e = 0; e < c.length; e += 2) a[(e >>> 1) % 5][(e >>> 1) / 5 | 0] = B(a[(e >>> 1) % 5][(e >>> 1) / 5 | 0], new b(c[e + 1], c[e])); for (d = 0; 24 > d; d += 1)
        {
            n = A("SHA3-"); for (e = 0; 5 > e; e += 1)
            {
                h = a[e][0]; var p = a[e][1], f = a[e][2], m = a[e][3], q = a[e][4]; g[e] = new b(h.a ^ p.a ^ f.a ^
                m.a ^ q.a, h.b ^ p.b ^ f.b ^ m.b ^ q.b)
            } for (e = 0; 5 > e; e += 1) l[e] = B(g[(e + 4) % 5], S(g[(e + 1) % 5], 1)); for (e = 0; 5 > e; e += 1) for (h = 0; 5 > h; h += 1) a[e][h] = B(a[e][h], l[e]); for (e = 0; 5 > e; e += 1) for (h = 0; 5 > h; h += 1) n[h][(2 * e + 3 * h) % 5] = S(a[e][h], W[e][h]); for (e = 0; 5 > e; e += 1) for (h = 0; 5 > h; h += 1) a[e][h] = B(n[e][h], new b(~n[(e + 1) % 5][h].a & n[(e + 2) % 5][h].a, ~n[(e + 1) % 5][h].b & n[(e + 2) % 5][h].b)); a[0][0] = B(a[0][0], X[d])
        } return a
    } var d, V, W, X; d = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278,
    1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
    2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298]; V = [new b(d[0], 3609767458), new b(d[1], 602891725), new b(d[2], 3964484399), new b(d[3], 2173295548), new b(d[4], 4081628472), new b(d[5], 3053834265), new b(d[6], 2937671579), new b(d[7], 3664609560), new b(d[8], 2734883394), new b(d[9], 1164996542), new b(d[10], 1323610764), new b(d[11], 3590304994), new b(d[12], 4068182383), new b(d[13], 991336113), new b(d[14], 633803317), new b(d[15], 3479774868), new b(d[16], 2666613458), new b(d[17], 944711139), new b(d[18], 2341262773),
    new b(d[19], 2007800933), new b(d[20], 1495990901), new b(d[21], 1856431235), new b(d[22], 3175218132), new b(d[23], 2198950837), new b(d[24], 3999719339), new b(d[25], 766784016), new b(d[26], 2566594879), new b(d[27], 3203337956), new b(d[28], 1034457026), new b(d[29], 2466948901), new b(d[30], 3758326383), new b(d[31], 168717936), new b(d[32], 1188179964), new b(d[33], 1546045734), new b(d[34], 1522805485), new b(d[35], 2643833823), new b(d[36], 2343527390), new b(d[37], 1014477480), new b(d[38], 1206759142), new b(d[39], 344077627),
    new b(d[40], 1290863460), new b(d[41], 3158454273), new b(d[42], 3505952657), new b(d[43], 106217008), new b(d[44], 3606008344), new b(d[45], 1432725776), new b(d[46], 1467031594), new b(d[47], 851169720), new b(d[48], 3100823752), new b(d[49], 1363258195), new b(d[50], 3750685593), new b(d[51], 3785050280), new b(d[52], 3318307427), new b(d[53], 3812723403), new b(d[54], 2003034995), new b(d[55], 3602036899), new b(d[56], 1575990012), new b(d[57], 1125592928), new b(d[58], 2716904306), new b(d[59], 442776044), new b(d[60], 593698344), new b(d[61],
    3733110249), new b(d[62], 2999351573), new b(d[63], 3815920427), new b(3391569614, 3928383900), new b(3515267271, 566280711), new b(3940187606, 3454069534), new b(4118630271, 4000239992), new b(116418474, 1914138554), new b(174292421, 2731055270), new b(289380356, 3203993006), new b(460393269, 320620315), new b(685471733, 587496836), new b(852142971, 1086792851), new b(1017036298, 365543100), new b(1126000580, 2618297676), new b(1288033470, 3409855158), new b(1501505948, 4234509866), new b(1607167915, 987167468), new b(1816402316,
    1246189591)]; X = [new b(0, 1), new b(0, 32898), new b(2147483648, 32906), new b(2147483648, 2147516416), new b(0, 32907), new b(0, 2147483649), new b(2147483648, 2147516545), new b(2147483648, 32777), new b(0, 138), new b(0, 136), new b(0, 2147516425), new b(0, 2147483658), new b(0, 2147516555), new b(2147483648, 139), new b(2147483648, 32905), new b(2147483648, 32771), new b(2147483648, 32770), new b(2147483648, 128), new b(0, 32778), new b(2147483648, 2147483658), new b(2147483648, 2147516545), new b(2147483648, 32896), new b(0, 2147483649),
    new b(2147483648, 2147516424)]; W = [[0, 36, 3, 41, 18], [1, 44, 10, 45, 2], [62, 6, 43, 15, 61], [28, 55, 25, 21, 56], [27, 20, 39, 8, 14]]; "function" === typeof define && define.amd ? define(function () { return C }) : "undefined" !== typeof exports ? ("undefined" !== typeof module && module.exports && (module.exports = C), exports = C) : Y.jsSHA = C
})(this);


/*
 A JavaScript implementation of the SHA family of hashes, as
 defined in FIPS PUB 180-4 and FIPS PUB 202, as well as the corresponding
 HMAC implementation as defined in FIPS PUB 198a

 Copyright Brian Turek 2008-2017
 Distributed under the BSD License
 See http://caligatio.github.com/jsSHA/ for more information

 Several functions taken from Paul Johnston
*/
'use strict'; (function (I) {
    function w(c, a, d) {
        var l = 0, b = [], g = 0, f, n, k, e, h, q, y, p, m = !1, t = [], r = [], u, z = !1; d = d || {}; f = d.encoding || "UTF8"; u = d.numRounds || 1; if (u !== parseInt(u, 10) || 1 > u) throw Error("numRounds must a integer >= 1"); if (0 === c.lastIndexOf("SHA-", 0)) if (q = function (b, a) { return A(b, a, c) }, y = function (b, a, l, f) {
        var g, e; if ("SHA-224" === c || "SHA-256" === c) g = (a + 65 >>> 9 << 4) + 15, e = 16; else throw Error("Unexpected error in SHA-2 implementation"); for (; b.length <= g;) b.push(0); b[a >>> 5] |= 128 << 24 - a % 32; a = a + l; b[g] = a & 4294967295;
        b[g - 1] = a / 4294967296 | 0; l = b.length; for (a = 0; a < l; a += e) f = A(b.slice(a, a + e), f, c); if ("SHA-224" === c) b = [f[0], f[1], f[2], f[3], f[4], f[5], f[6]]; else if ("SHA-256" === c) b = f; else throw Error("Unexpected error in SHA-2 implementation"); return b
        }, p = function (b) { return b.slice() }, "SHA-224" === c) h = 512, e = 224; else if ("SHA-256" === c) h = 512, e = 256; else throw Error("Chosen SHA variant is not supported"); else throw Error("Chosen SHA variant is not supported"); k = B(a, f); n = x(c); this.setHMACKey = function (b, a, g) {
            var e; if (!0 === m) throw Error("HMAC key already set");
            if (!0 === z) throw Error("Cannot set HMAC key after calling update"); f = (g || {}).encoding || "UTF8"; a = B(a, f)(b); b = a.binLen; a = a.value; e = h >>> 3; g = e / 4 - 1; if (e < b / 8) { for (a = y(a, b, 0, x(c)) ; a.length <= g;) a.push(0); a[g] &= 4294967040 } else if (e > b / 8) { for (; a.length <= g;) a.push(0); a[g] &= 4294967040 } for (b = 0; b <= g; b += 1) t[b] = a[b] ^ 909522486, r[b] = a[b] ^ 1549556828; n = q(t, n); l = h; m = !0
        }; this.update = function (a) {
            var c, f, e, d = 0, p = h >>> 5; c = k(a, b, g); a = c.binLen; f = c.value; c = a >>> 5; for (e = 0; e < c; e += p) d + h <= a && (n = q(f.slice(e, e + p), n), d += h); l += d; b = f.slice(d >>>
            5); g = a % h; z = !0
        }; this.getHash = function (a, f) {
            var d, h, k, q; if (!0 === m) throw Error("Cannot call getHash after setting HMAC key"); k = C(f); switch (a)
            {
                case "HEX": d = function (a) { return D(a, e, k) }; break; case "B64": d = function (a) { return E(a, e, k) }; break; case "BYTES": d = function (a) { return F(a, e) }; break; case "ARRAYBUFFER": try { h = new ArrayBuffer(0) } catch (v) { throw Error("ARRAYBUFFER not supported by this environment"); } d = function (a) { return G(a, e) }; break; default: throw Error("format must be HEX, B64, BYTES, or ARRAYBUFFER");
            } q = y(b.slice(), g, l, p(n)); for (h = 1; h < u; h += 1) q = y(q, e, 0, x(c)); return d(q)
        }; this.getHMAC = function (a, f) {
            var d, k, t, u; if (!1 === m) throw Error("Cannot call getHMAC without first setting HMAC key"); t = C(f); switch (a)
            {
                case "HEX": d = function (a) { return D(a, e, t) }; break; case "B64": d = function (a) { return E(a, e, t) }; break; case "BYTES": d = function (a) { return F(a, e) }; break; case "ARRAYBUFFER": try { d = new ArrayBuffer(0) } catch (v) { throw Error("ARRAYBUFFER not supported by this environment"); } d = function (a) { return G(a, e) }; break; default: throw Error("outputFormat must be HEX, B64, BYTES, or ARRAYBUFFER");
            } k = y(b.slice(), g, l, p(n)); u = q(r, x(c)); u = y(k, e, h, u); return d(u)
        }
    } function m() { } function D(c, a, d) { var l = ""; a /= 8; var b, g; for (b = 0; b < a; b += 1) g = c[b >>> 2] >>> 8 * (3 + b % 4 * -1), l += "0123456789abcdef".charAt(g >>> 4 & 15) + "0123456789abcdef".charAt(g & 15); return d.outputUpper ? l.toUpperCase() : l } function E(c, a, d) {
        var l = "", b = a / 8, g, f, n; for (g = 0; g < b; g += 3) for (f = g + 1 < b ? c[g + 1 >>> 2] : 0, n = g + 2 < b ? c[g + 2 >>> 2] : 0, n = (c[g >>> 2] >>> 8 * (3 + g % 4 * -1) & 255) << 16 | (f >>> 8 * (3 + (g + 1) % 4 * -1) & 255) << 8 | n >>> 8 * (3 + (g + 2) % 4 * -1) & 255, f = 0; 4 > f; f += 1) 8 * g + 6 * f <= a ? l += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(n >>>
        6 * (3 - f) & 63) : l += d.b64Pad; return l
    } function F(c, a) { var d = "", l = a / 8, b, g; for (b = 0; b < l; b += 1) g = c[b >>> 2] >>> 8 * (3 + b % 4 * -1) & 255, d += String.fromCharCode(g); return d } function G(c, a) { var d = a / 8, l, b = new ArrayBuffer(d), g; g = new Uint8Array(b); for (l = 0; l < d; l += 1) g[l] = c[l >>> 2] >>> 8 * (3 + l % 4 * -1) & 255; return b } function C(c) {
        var a = { outputUpper: !1, b64Pad: "=", shakeLen: -1 }; c = c || {}; a.outputUpper = c.outputUpper || !1; !0 === c.hasOwnProperty("b64Pad") && (a.b64Pad = c.b64Pad); if ("boolean" !== typeof a.outputUpper) throw Error("Invalid outputUpper formatting option");
        if ("string" !== typeof a.b64Pad) throw Error("Invalid b64Pad formatting option"); return a
    } function B(c, a) {
        var d; switch (a) { case "UTF8": case "UTF16BE": case "UTF16LE": break; default: throw Error("encoding must be UTF8, UTF16BE, or UTF16LE"); } switch (c)
        {
            case "HEX": d = function (a, b, c) {
                var f = a.length, d, k, e, h, q; if (0 !== f % 2) throw Error("String of HEX type must be in byte increments"); b = b || [0]; c = c || 0; q = c >>> 3; for (d = 0; d < f; d += 2)
                {
                    k = parseInt(a.substr(d, 2), 16); if (isNaN(k)) throw Error("String of HEX type contains invalid characters");
                    h = (d >>> 1) + q; for (e = h >>> 2; b.length <= e;) b.push(0); b[e] |= k << 8 * (3 + h % 4 * -1)
                } return { value: b, binLen: 4 * f + c }
            }; break; case "TEXT": d = function (c, b, d) {
                var f, n, k = 0, e, h, q, m, p, r; b = b || [0]; d = d || 0; q = d >>> 3; if ("UTF8" === a) for (r = 3, e = 0; e < c.length; e += 1) for (f = c.charCodeAt(e), n = [], 128 > f ? n.push(f) : 2048 > f ? (n.push(192 | f >>> 6), n.push(128 | f & 63)) : 55296 > f || 57344 <= f ? n.push(224 | f >>> 12, 128 | f >>> 6 & 63, 128 | f & 63) : (e += 1, f = 65536 + ((f & 1023) << 10 | c.charCodeAt(e) & 1023), n.push(240 | f >>> 18, 128 | f >>> 12 & 63, 128 | f >>> 6 & 63, 128 | f & 63)), h = 0; h < n.length; h += 1)
                    {
                    p = k +
                    q; for (m = p >>> 2; b.length <= m;) b.push(0); b[m] |= n[h] << 8 * (r + p % 4 * -1); k += 1
                } else if ("UTF16BE" === a || "UTF16LE" === a) for (r = 2, n = "UTF16LE" === a && !0 || "UTF16LE" !== a && !1, e = 0; e < c.length; e += 1) { f = c.charCodeAt(e); !0 === n && (h = f & 255, f = h << 8 | f >>> 8); p = k + q; for (m = p >>> 2; b.length <= m;) b.push(0); b[m] |= f << 8 * (r + p % 4 * -1); k += 2 } return { value: b, binLen: 8 * k + d }
            }; break; case "B64": d = function (a, b, c) {
                var f = 0, d, k, e, h, q, m, p; if (-1 === a.search(/^[a-zA-Z0-9=+\/]+$/)) throw Error("Invalid character in base-64 string"); k = a.indexOf("="); a = a.replace(/\=/g,
                ""); if (-1 !== k && k < a.length) throw Error("Invalid '=' found in base-64 string"); b = b || [0]; c = c || 0; m = c >>> 3; for (k = 0; k < a.length; k += 4) { q = a.substr(k, 4); for (e = h = 0; e < q.length; e += 1) d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".indexOf(q[e]), h |= d << 18 - 6 * e; for (e = 0; e < q.length - 1; e += 1) { p = f + m; for (d = p >>> 2; b.length <= d;) b.push(0); b[d] |= (h >>> 16 - 8 * e & 255) << 8 * (3 + p % 4 * -1); f += 1 } } return { value: b, binLen: 8 * f + c }
            }; break; case "BYTES": d = function (a, b, c) {
                var d, n, k, e, h; b = b || [0]; c = c || 0; k = c >>> 3; for (n = 0; n < a.length; n +=
                1) d = a.charCodeAt(n), h = n + k, e = h >>> 2, b.length <= e && b.push(0), b[e] |= d << 8 * (3 + h % 4 * -1); return { value: b, binLen: 8 * a.length + c }
            }; break; case "ARRAYBUFFER": try { d = new ArrayBuffer(0) } catch (l) { throw Error("ARRAYBUFFER not supported by this environment"); } d = function (a, b, c) { var d, n, k, e, h; b = b || [0]; c = c || 0; n = c >>> 3; h = new Uint8Array(a); for (d = 0; d < a.byteLength; d += 1) e = d + n, k = e >>> 2, b.length <= k && b.push(0), b[k] |= h[d] << 8 * (3 + e % 4 * -1); return { value: b, binLen: 8 * a.byteLength + c } }; break; default: throw Error("format must be HEX, TEXT, B64, BYTES, or ARRAYBUFFER");
        } return d
    } function r(c, a) { return c >>> a | c << 32 - a } function J(c, a, d) { return c & a ^ ~c & d } function K(c, a, d) { return c & a ^ c & d ^ a & d } function L(c) { return r(c, 2) ^ r(c, 13) ^ r(c, 22) } function M(c) { return r(c, 6) ^ r(c, 11) ^ r(c, 25) } function N(c) { return r(c, 7) ^ r(c, 18) ^ c >>> 3 } function O(c) { return r(c, 17) ^ r(c, 19) ^ c >>> 10 } function P(c, a) { var d = (c & 65535) + (a & 65535); return ((c >>> 16) + (a >>> 16) + (d >>> 16) & 65535) << 16 | d & 65535 } function Q(c, a, d, l) {
        var b = (c & 65535) + (a & 65535) + (d & 65535) + (l & 65535); return ((c >>> 16) + (a >>> 16) + (d >>> 16) + (l >>> 16) + (b >>>
        16) & 65535) << 16 | b & 65535
    } function R(c, a, d, l, b) { var g = (c & 65535) + (a & 65535) + (d & 65535) + (l & 65535) + (b & 65535); return ((c >>> 16) + (a >>> 16) + (d >>> 16) + (l >>> 16) + (b >>> 16) + (g >>> 16) & 65535) << 16 | g & 65535 } function x(c) {
        var a = [], d; if (0 === c.lastIndexOf("SHA-", 0)) switch (a = [3238371032, 914150663, 812702999, 4144912697, 4290775857, 1750603025, 1694076839, 3204075428], d = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225], c)
        {
            case "SHA-224": break; case "SHA-256": a = d; break; case "SHA-384": a = [new m, new m,
            new m, new m, new m, new m, new m, new m]; break; case "SHA-512": a = [new m, new m, new m, new m, new m, new m, new m, new m]; break; default: throw Error("Unknown SHA variant");
        } else throw Error("No SHA variants supported"); return a
    } function A(c, a, d) {
        var l, b, g, f, n, k, e, h, m, r, p, w, t, x, u, z, A, B, C, D, E, F, v = [], G; if ("SHA-224" === d || "SHA-256" === d) r = 64, w = 1, F = Number, t = P, x = Q, u = R, z = N, A = O, B = L, C = M, E = K, D = J, G = H; else throw Error("Unexpected error in SHA-2 implementation"); d = a[0]; l = a[1]; b = a[2]; g = a[3]; f = a[4]; n = a[5]; k = a[6]; e = a[7]; for (p =
        0; p < r; p += 1) 16 > p ? (m = p * w, h = c.length <= m ? 0 : c[m], m = c.length <= m + 1 ? 0 : c[m + 1], v[p] = new F(h, m)) : v[p] = x(A(v[p - 2]), v[p - 7], z(v[p - 15]), v[p - 16]), h = u(e, C(f), D(f, n, k), G[p], v[p]), m = t(B(d), E(d, l, b)), e = k, k = n, n = f, f = t(g, h), g = b, b = l, l = d, d = t(h, m); a[0] = t(d, a[0]); a[1] = t(l, a[1]); a[2] = t(b, a[2]); a[3] = t(g, a[3]); a[4] = t(f, a[4]); a[5] = t(n, a[5]); a[6] = t(k, a[6]); a[7] = t(e, a[7]); return a
    } var H; H = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206,
    2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474,
    2756734187, 3204031479, 3329325298]; "function" === typeof define && define.amd ? define(function () { return w }) : "undefined" !== typeof exports ? ("undefined" !== typeof module && module.exports && (module.exports = w), exports = w) : I.jsSHA = w
})(this);

//F7C5F693C657692AFB9F2B78C302E0ECD3EBB14B1BF28A590BEF7C3423498C63F9027EE44EF867F540F81B7B591B365F4CD1AE2679504B98DF881659F0AF5CB6++
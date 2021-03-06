! function() {
    function e(t, r, n) {
        function i(s, a) {
            if (!r[s]) {
                if (!t[s]) {
                    var u = "function" == typeof require && require;
                    if (!a && u) return u(s, !0);
                    if (o) return o(s, !0);
                    var c = new Error("Cannot find module '" + s + "'");
                    throw c.code = "MODULE_NOT_FOUND", c
                }
                var l = r[s] = {
                    exports: {}
                };
                t[s][0].call(l.exports, function(e) {
                    var r = t[s][1][e];
                    return i(r ? r : e)
                }, l, l.exports, e, t, r, n)
            }
            return r[s].exports
        }
        for (var o = "function" == typeof require && require, s = 0; s < n.length; s++) i(n[s]);
        return i
    }
    return e
}()({
    1: [function(e, t, r) {
        "use strict";
        var n = e("./helpers/TabManager"),
            i = e("./helpers/hideSiblingElements"),
            o = e("./helpers/showSiblingElements"),
            s = function(e, t) {
                t = t || {}, this._tabbables = null, this._excludeHidden = t.excludeHidden, this._firstTabbableElement = t.firstFocusElement, this._lastTabbableElement = null, this._relatedTarget = null, this.el = e, this._handleOnFocus = this._handleOnFocus.bind(this)
            },
            a = s.prototype;
        a.start = function() {
            this.updateTabbables(), i(this.el, null, this._excludeHidden), this._firstTabbableElement ? this.el.contains(document.activeElement) || this._firstTabbableElement.focus() : console.warn("this._firstTabbableElement is null, CircularTab needs at least one tabbable element."), this._relatedTarget = document.activeElement, document.addEventListener("focus", this._handleOnFocus, !0)
        }, a.stop = function() {
            o(this.el), document.removeEventListener("focus", this._handleOnFocus, !0)
        }, a.updateTabbables = function() {
            this._tabbables = n.getTabbableElements(this.el, this._excludeHidden), this._firstTabbableElement = this._firstTabbableElement || this._tabbables[0], this._lastTabbableElement = this._tabbables[this._tabbables.length - 1]
        }, a._handleOnFocus = function(e) {
            if (this.el.contains(e.target)) this._relatedTarget = e.target;
            else {
                if (e.preventDefault(), this.updateTabbables(), this._relatedTarget === this._lastTabbableElement || null === this._relatedTarget) return this._firstTabbableElement.focus(), void(this._relatedTarget = this._firstTabbableElement);
                if (this._relatedTarget === this._firstTabbableElement) return this._lastTabbableElement.focus(), void(this._relatedTarget = this._lastTabbableElement)
            }
        }, a.destroy = function() {
            this.stop(), this.el = null, this._tabbables = null, this._firstTabbableElement = null, this._lastTabbableElement = null, this._relatedTarget = null, this._handleOnFocus = null
        }, t.exports = s
    }, {
        "./helpers/TabManager": 4,
        "./helpers/hideSiblingElements": 6,
        "./helpers/showSiblingElements": 10
    }],
    2: [function(e, t, r) {
        "use strict";
        var n = e("./maps/keyMap"),
            i = 0,
            o = ["button", "checkbox", "listbox", "option", "menuitem", "menuitemradio", "menuitemcheckbox", "tab"],
            s = e("@marcom/ac-console/warn"),
            a = function() {
                this._elements = {}, this._callbacks = {}, this._bindEvents(), this._proxies = {}, this._setup()
            },
            u = a.prototype;
        u._bindEvents = function() {
            this._handleKeydown = this._handleKeydown.bind(this), this._handleHover = this._handleHover.bind(this)
        }, u._setup = function() {
            this._addProxy("click", this._clickProxy), this._addProxy("hover", this._hoverProxy)
        }, u._addProxy = function(e, t) {
            this._proxies[e] = this._proxies[e] || [], this._proxies[e].push(t)
        }, u._removeProxy = function(e, t) {
            if (this._proxies[e]) {
                var r = this._proxies[e].indexOf(t);
                r > -1 && this._proxies[e].splice(r, 1), 0 === this._proxies[e].length && delete this._proxies[e]
            }
        }, u.addEventListener = function(e, t, r) {
            this._proxies[t] && (this._proxies[t].forEach(function(n) {
                n.call(this, e, t, r)
            }.bind(this)), e.addEventListener(t, r))
        }, u.removeEventListener = function(e, t, r) {
            this._proxies[t] && (this._proxies[t].forEach(function(n) {
                n.call(this, e, t, r, !0)
            }.bind(this)), e.removeEventListener(t, r))
        }, u._clickProxy = function(e, t, r, n) {
            var i = e.getAttribute("role");
            o.indexOf(i) < 0 && s("element's role is not set to any of the following " + o.join(", ")), n ? (e.removeEventListener("keydown", this._handleKeydown), this._removeCallback(e, t, r)) : (e.addEventListener("keydown", this._handleKeydown), this._addCallback(e, t, r))
        }, u._hoverProxy = function(e, t, r, n) {
            n ? (e.removeEventListener("focus", this._handleHover, !0), e.removeEventListener("blur", this._handleHover, !0), r && this._removeCallback(e, t, r)) : (e.addEventListener("focus", this._handleHover, !0), e.addEventListener("blur", this._handleHover, !0), r && this._addCallback(e, t, r))
        }, u._handleKeydown = function(e) {
            return !!(e.ctrlKey || e.altKey || e.metaKey) || void(e.keyCode !== n.SPACEBAR && e.keyCode !== n.ENTER || this._executeCallback(e, "click"))
        }, u._handleHover = function(e) {
            "focus" === e.type ? e.currentTarget.classList.add("hover") : e.currentTarget.classList.remove("hover"), this._executeCallback(e, "hover")
        }, u._executeCallback = function(e, t) {
            var r = this._getCallbacksByElement(e.currentTarget, t);
            if (r)
                for (var n = 0; n < r.length; n++) r[n](e)
        }, u._addCallback = function(e, t, r) {
            var n = this._getIDByElement(e) || this._generateId();
            this._elements[n] = e, r instanceof Function && (this._callbacks[n] = this._callbacks[n] || {}, this._callbacks[n][t] = this._callbacks[n][t] || [], this._callbacks[n][t].push(r))
        }, u._removeCallback = function(e, t, r) {
            var n = this._getIDByElement(e),
                i = this._callbacks[n];
            if (i && i[t]) {
                var o = i[t].indexOf(r);
                i[t].splice(o, 1), 0 === i[t].length && (delete i[t], this._isEmpty(i) && (delete this._callbacks[n], delete this._elements[n]))
            }
        }, u._getIDByElement = function(e) {
            for (var t in this._elements)
                if (this._elements.hasOwnProperty(t) && this._elements[t] === e) return t
        }, u._getCallbacksByElement = function(e, t) {
            var r = this._getIDByElement(e);
            if (r) return this._callbacks[r][t]
        }, u._generateId = function() {
            return (++i).toString()
        }, u._isEmpty = function(e) {
            for (var t in e)
                if (e.hasOwnProperty(t)) return !1;
            return !0
        }, t.exports = new a
    }, {
        "./maps/keyMap": 13,
        "@marcom/ac-console/warn": 24
    }],
    3: [function(e, t, r) {
        "use strict";

        function n() {
            this._createElemnts(), this._bindEvents()
        }
        var i = n.prototype;
        i._bindEvents = function() {
            this._onResize = this._resize.bind(this)
        }, i._createElemnts = function() {
            this.span = document.createElement("span");
            var e = this.span.style;
            e.visibility = "hidden", e.position = "absolute", e.top = "0", e.bottom = "0", e.zIndex = "-1", this.span.innerHTML = "&nbsp;", this.iframe = document.createElement("iframe");
            var t = this.iframe.style;
            t.position = "absolute", t.top = "0", t.left = "0", t.width = "100%", t.height = "100%", this.span.appendChild(this.iframe), document.body.appendChild(this.span)
        }, i.detect = function(e) {
            this.originalSize = e || 17, this.currentSize = parseFloat(window.getComputedStyle(this.span)["font-size"]), this.currentSize > this.originalSize && this._onResize(), this.isDetecting || (this.iframe.contentWindow.addEventListener("resize", this._onResize), this.isDetecting = !0)
        }, i._resize = function(e) {
            this.currentSize = parseFloat(window.getComputedStyle(this.span)["font-size"]), this.originalSize < this.currentSize ? document.documentElement.classList.add("text-zoom") : document.documentElement.classList.remove("text-zoom"), window.dispatchEvent(new Event("resize"))
        }, i.remove = function() {
            this.isDetecting && (this.iframe.contentWindow.removeEventListener("resize", this._onResize), this.isDetecting = !1)
        }, i.destroy = function() {
            this.remove(), this.span && this.span.parentElement && this.span.parentElement.removeChild(this.span), this.span = null, this.iframe = null
        }, t.exports = new n
    }, {}],
    4: [function(e, t, r) {
        "use strict";
        var n = e("./../maps/focusableElement"),
            i = function() {
                this.focusableSelectors = n.join(",")
            },
            o = i.prototype;
        o.isFocusableElement = function(e, t, r) {
            if (t && !this._isDisplayed(e)) return !1;
            var i = e.nodeName.toLowerCase(),
                o = n.indexOf(i) > -1;
            return "a" === i || (o ? !e.disabled : !e.contentEditable || (r = r || parseFloat(e.getAttribute("tabindex")), !isNaN(r)))
        }, o.isTabbableElement = function(e, t) {
            if (t && !this._isDisplayed(e)) return !1;
            var r = e.getAttribute("tabindex");
            return r = parseFloat(r), isNaN(r) ? this.isFocusableElement(e, t, r) : r >= 0
        }, o._isDisplayed = function(e) {
            var t = e.getBoundingClientRect();
            return (0 !== t.top || 0 !== t.left || 0 !== t.width || 0 !== t.height) && "hidden" !== window.getComputedStyle(e).visibility
        }, o.getTabbableElements = function(e, t) {
            for (var r = e.querySelectorAll(this.focusableSelectors), n = r.length, i = [], o = 0; o < n; o++) this.isTabbableElement(r[o], t) && i.push(r[o]);
            return i
        }, o.getFocusableElements = function(e, t) {
            for (var r = e.querySelectorAll(this.focusableSelectors), n = r.length, i = [], o = 0; o < n; o++) this.isFocusableElement(r[o], t) && i.push(r[o]);
            return i
        }, t.exports = new i
    }, {
        "./../maps/focusableElement": 12
    }],
    5: [function(e, t, r) {
        "use strict";
        var n = e("./setAttributes"),
            i = e("./../maps/ariaMap"),
            o = e("./TabManager"),
            s = "data-original-",
            a = "tabindex",
            u = function(e, t) {
                var r = e.getAttribute(s + t);
                r || (r = e.getAttribute(t) || "", n(e, s + t, r))
            };
        t.exports = function(e, t) {
            if (o.isFocusableElement(e, t)) u(e, a), n(e, a, -1);
            else
                for (var r = o.getTabbableElements(e, t), s = r.length; s--;) u(r[s], a), n(r[s], a, -1);
            u(e, i.HIDDEN), n(e, i.HIDDEN, !0)
        }
    }, {
        "./../maps/ariaMap": 11,
        "./TabManager": 4,
        "./setAttributes": 8
    }],
    6: [function(e, t, r) {
        "use strict";
        var n = e("./hide");
        t.exports = function i(e, t, r) {
            t = t || document.body;
            for (var o = e, s = e; o = o.previousElementSibling;) n(o, r);
            for (; s = s.nextElementSibling;) n(s, r);
            e.parentElement && e.parentElement !== t && i(e.parentElement)
        }
    }, {
        "./hide": 5
    }],
    7: [function(e, t, r) {
        "use strict";
        var n = function(e, t) {
                if ("string" == typeof t)
                    for (var r = t.split(/\s+/), n = 0; n < r.length; n++) e.getAttribute(r[n]) && e.removeAttribute(r[n])
            },
            i = function(e, t) {
                if (e.length)
                    for (var r = 0; r < e.length; r++) n(e[r], t);
                else n(e, t)
            };
        t.exports = i
    }, {}],
    8: [function(e, t, r) {
        "use strict";
        var n = function(e, t, r) {
                e && 1 === e.nodeType && e.setAttribute(t, r)
            },
            i = function(e, t, r) {
                if ("string" != typeof r && (r = r.toString()), e)
                    if (e.length)
                        for (var i = 0; i < e.length; i++) n(e[i], t, r);
                    else n(e, t, r)
            };
        t.exports = i
    }, {}],
    9: [function(e, t, r) {
        "use strict";
        var n = e("./removeAttributes"),
            i = e("./setAttributes"),
            o = e("./../maps/ariaMap"),
            s = "data-original-",
            a = "tabindex",
            u = function(e, t) {
                var r = e.getAttribute(s + t);
                "string" == typeof r && (r.length ? i(e, t, r) : n(e, t), n(e, s + t))
            };
        t.exports = function(e) {
            n(e, a + " " + o.HIDDEN), u(e, a), u(e, o.HIDDEN);
            for (var t = e.querySelectorAll("[" + s + a + "]"), r = t.length; r--;) u(t[r], a)
        }
    }, {
        "./../maps/ariaMap": 11,
        "./removeAttributes": 7,
        "./setAttributes": 8
    }],
    10: [function(e, t, r) {
        "use strict";
        var n = e("./show");
        t.exports = function i(e, t) {
            t = t || document.body;
            for (var r = e, o = e; r = r.previousElementSibling;) n(r);
            for (; o = o.nextElementSibling;) n(o);
            e.parentElement && e.parentElement !== t && i(e.parentElement)
        }
    }, {
        "./show": 9
    }],
    11: [function(e, t, r) {
        "use strict";
        t.exports = {
            AUTOCOMPLETE: "aria-autocomplete",
            CHECKED: "aria-checked",
            DISABLED: "aria-disabled",
            EXPANDED: "aria-expanded",
            HASPOPUP: "aria-haspopup",
            HIDDEN: "aria-hidden",
            INVALID: "aria-invalid",
            LABEL: "aria-label",
            LEVEL: "aria-level",
            MULTILINE: "aria-multiline",
            MULTISELECTABLE: "aria-multiselectable",
            ORIENTATION: "aria-orientation",
            PRESSED: "aria-pressed",
            READONLY: "aria-readonly",
            REQUIRED: "aria-required",
            SELECTED: "aria-selected",
            SORT: "aria-sort",
            VALUEMAX: "aria-valuemax",
            VALUEMIN: "aria-valuemin",
            VALUENOW: "aria-valuenow",
            VALUETEXT: "aria-valuetext",
            ATOMIC: "aria-atomic",
            BUSY: "aria-busy",
            LIVE: "aria-live",
            RELEVANT: "aria-relevant",
            DROPEFFECT: "aria-dropeffect",
            GRABBED: "aria-grabbed",
            ACTIVEDESCENDANT: "aria-activedescendant",
            CONTROLS: "aria-controls",
            DESCRIBEDBY: "aria-describedby",
            FLOWTO: "aria-flowto",
            LABELLEDBY: "aria-labelledby",
            OWNS: "aria-owns",
            POSINSET: "aria-posinset",
            SETSIZE: "aria-setsize"
        }
    }, {}],
    12: [function(e, t, r) {
        "use strict";
        t.exports = ["input", "select", "textarea", "button", "optgroup", "option", "menuitem", "fieldset", "object", "a[href]", "*[tabindex]", "*[contenteditable]"]
    }, {}],
    13: [function(e, t, r) {
        "use strict";
        t.exports = e("@marcom/ac-keyboard/keyMap")
    }, {
        "@marcom/ac-keyboard/keyMap": 68
    }],
    14: [function(e, t, r) {
        "use strict";
        t.exports = {
            BreakpointsDelegate: e("./ac-breakpoints-delegate/BreakpointsDelegate")
        }
    }, {
        "./ac-breakpoints-delegate/BreakpointsDelegate": 15
    }],
    15: [function(e, t, r) {
        "use strict";

        function n(e) {
            this._customEvent = new a(l, this._onBreakpointListenerAdded.bind(this), this._onBreakpointListenerRemoved.bind(this)), this.setBreakpoints(f)
        }
        var i = e("@marcom/ac-shared-instance").SharedInstance,
            o = e("@marcom/ac-object"),
            s = e("@marcom/ac-window-delegate").WindowDelegate,
            a = e("@marcom/ac-window-delegate").WindowDelegateCustomEvent,
            u = (e("@marcom/ac-event-emitter").EventEmitter, "ac-breakpoints-delegate:BreakpointsDelegate"),
            c = "2.1.1",
            l = "breakpoint",
            h = "resize orientationchange",
            f = {
                large: {
                    "min-width": 1069,
                    "max-width": 1441,
                    content: 980,
                    oldie: !0
                },
                xlarge: {
                    "min-width": 1442,
                    content: 980
                },
                medium: {
                    "min-width": 736,
                    "max-width": 1068,
                    content: 692
                },
                small: {
                    "min-width": 320,
                    "max-width": 735,
                    content: 288,
                    "max-device-width": 768
                }
            },
            p = {
                minWidth: "min-width",
                maxWidth: "max-width",
                maxDeviceWidth: "max-device-width",
                content: "content",
                oldIE: "oldie"
            },
            d = n.prototype;
        d.initialize = function() {
            this._breakpoint = null, this._lastBreakpoint = null, this._handleOldIE(), this._breakpointOrder = this._setBreakpointOrder(), this._isOldIE || this._handleResize()
        }, d.getCustomEvent = function() {
            return this._customEvent
        }, d.getBreakpoint = function() {
            return this._customEvent.active || this._handleResize(), this._breakpoint
        }, d.setBreakpoints = function(e) {
            this.breakpoints = o.clone(e), this.initialize()
        }, d._handleResize = function() {
            var e, t, r, n, i = s.clientWidth(),
                o = this._breakpointOrder.length;
            for (t = 0; t < o && (r = this._breakpointOrder[t], n = this.breakpoints[r], !(n._breakPosition > i)); t++);
            return t > 0 && (t -= 1), e = this.breakpoints[this._breakpointOrder[t]], this._breakpoint ? void(e.name !== this._breakpoint.name && (this._lastBreakpoint = this._breakpoint, this._breakpoint = e, s.trigger(l, {
                incoming: this._breakpoint,
                outgoing: this._lastBreakpoint
            }))) : void(this._breakpoint = e)
        }, d._setBreakpointOrder = function() {
            var e, t = 0,
                r = [],
                n = [],
                i = p.minWidth;
            for (e in this.breakpoints) this.breakpoints.hasOwnProperty(e) && (this.breakpoints[e].name = e, r.push(this.breakpoints[e][i]));
            return r.sort(function(e, t) {
                return e - t
            }), r.forEach(function(e) {
                var t;
                for (t in this.breakpoints) this.breakpoints.hasOwnProperty(t) && this.breakpoints[t][i] === e && n.push(t)
            }, this), n.forEach(function(e, r) {
                this.breakpoints[e]._breakPosition = t, n[r + 1] && (t = this.breakpoints[n[r + 1]][i])
            }, this), n
        }, d._handleOldIE = function() {
            var e = document.documentElement,
                t = p.oldIE;
            if (!(e.className.indexOf("no-" + t) > -1 || e.className.indexOf(t) === -1)) {
                this._isOldIE = !0, this._replaceBreakpoints(function(e) {
                    return e[t] === !0
                });
                var r;
                for (r in this.breakpoints)
                    if (this.breakpoints.hasOwnProperty(r)) return void(this._breakpoint = this.breakpoints[r])
            }
        }, d._replaceBreakpoints = function(e) {
            var t, r, n = {};
            for (t in this.breakpoints) this.breakpoints.hasOwnProperty(t) && (r = this.breakpoints[t], e(r) && (n[t] = o.clone(this.breakpoints[t])));
            this.breakpoints = n
        }, d._onBreakpointListenerAdded = function() {
            s.on(h, this._handleResize, this)
        }, d._onBreakpointListenerRemoved = function() {
            s.off(h, this._handleResize, this)
        }, t.exports = i.share(u, c, n)
    }, {
        "@marcom/ac-event-emitter": 57,
        "@marcom/ac-object": 69,
        "@marcom/ac-shared-instance": 117,
        "@marcom/ac-window-delegate": 130
    }],
    16: [function(e, t, r) {
        "use strict";
        var n = e("./ac-clock/Clock"),
            i = e("./ac-clock/ThrottledClock"),
            o = e("./ac-clock/sharedClockInstance");
        o.Clock = n, o.ThrottledClock = i, t.exports = o
    }, {
        "./ac-clock/Clock": 17,
        "./ac-clock/ThrottledClock": 18,
        "./ac-clock/sharedClockInstance": 19
    }],
    17: [function(e, t, r) {
        "use strict";

        function n() {
            o.call(this), this.lastFrameTime = null, this._animationFrame = null, this._active = !1, this._startTime = null, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._getTime = Date.now || function() {
                return (new Date).getTime()
            }
        }
        e("https://www.apple.com/v/ios/ios-13/b/built/scripts/@marcom/ac-polyfills/Function/prototype.bind"), e("@marcom/ac-polyfills/requestAnimationFrame");
        var i, o = e("@marcom/ac-event-emitter-micro").EventEmitterMicro;
        (new Date).getTime();
        i = n.prototype = new o(null), i.start = function() {
            this._active || this._tick()
        }, i.stop = function() {
            this._active && window.cancelAnimationFrame(this._animationFrame), this._animationFrame = null, this.lastFrameTime = null, this._active = !1
        }, i.destroy = function() {
            this.stop(), this.off();
            var e;
            for (e in this) this.hasOwnProperty(e) && (this[e] = null)
        }, i.isRunning = function() {
            return this._active
        }, i._tick = function() {
            this._active || (this._active = !0), this._animationFrame = window.requestAnimationFrame(this._boundOnAnimationFrame)
        }, i._onAnimationFrame = function(e) {
            null === this.lastFrameTime && (this.lastFrameTime = e);
            var t = e - this.lastFrameTime,
                r = 0;
            if (t >= 1e3 && (t = 0), 0 !== t && (r = 1e3 / t), this._firstFrame === !0 && (t = 0, this._firstFrame = !1), 0 === r) this._firstFrame = !0;
            else {
                var n = {
                    time: e,
                    delta: t,
                    fps: r,
                    naturalFps: r,
                    timeNow: this._getTime()
                };
                this.trigger("update", n), this.trigger("draw", n)
            }
            this._animationFrame = null, this.lastFrameTime = e, this._active !== !1 ? this._tick() : this.lastFrameTime = null
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro": 55,
        "https://www.apple.com/v/ios/ios-13/b/built/scripts/@marcom/ac-polyfills/Function/prototype.bind": void 0,
        "@marcom/ac-polyfills/requestAnimationFrame": void 0
    }],
    18: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            null !== e && (s.call(this), t = t || {}, this._fps = e || null, this._clock = t.clock || o, this._lastThrottledTime = null, this._clockEvent = null, this._boundOnClockDraw = this._onClockDraw.bind(this), this._boundOnClockUpdate = this._onClockUpdate.bind(this), this._clock.on("update", this._boundOnClockUpdate))
        }
        e("@marcom/ac-polyfills/requestAnimationFrame");
        var i, o = e("./sharedClockInstance"),
            s = e("@marcom/ac-event-emitter-micro").EventEmitterMicro;
        i = n.prototype = new s(null), i.setFps = function(e) {
            return this._fps = e, this
        }, i.getFps = function() {
            return this._fps
        }, i.start = function() {
            return this._clock.start(), this
        }, i.stop = function() {
            return this._clock.stop(), this
        }, i.isRunning = function() {
            return this._clock.isRunning()
        }, i.destroy = function() {
            this._clock.off("update", this._boundOnClockUpdate), this._clock.destroy.call(this)
        }, i._onClockUpdate = function(e) {
            null === this._lastThrottledTime && (this._lastThrottledTime = this._clock.lastFrameTime);
            var t = e.time - this._lastThrottledTime;
            if (!this._fps) throw new TypeError("FPS is not defined.");
            Math.ceil(1e3 / t) >= this._fps + 2 || (this._clockEvent = e, this._clockEvent.delta = t, this._clockEvent.fps = 1e3 / t, this._lastThrottledTime = this._clockEvent.time, this._clock.once("draw", this._boundOnClockDraw), this.trigger("update", this._clockEvent))
        }, i._onClockDraw = function() {
            this.trigger("draw", this._clockEvent)
        }, t.exports = n
    }, {
        "./sharedClockInstance": 19,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-polyfills/requestAnimationFrame": void 0
    }],
    19: [function(e, t, r) {
        "use strict";
        var n = e("./Clock");
        t.exports = new n
    }, {
        "./Clock": 17
    }],
    20: [function(e, t, r) {
        "use strict";
        var n = "f7c9180f-5c45-47b4-8de4-428015f096c0",
            i = !1,
            o = window || self;
        try {
            i = !!o.localStorage.getItem(n)
        } catch (s) {}
        t.exports = i
    }, {}],
    21: [function(e, t, r) {
        "use strict";
        t.exports = e("./internal/expose")("error")
    }, {
        "./internal/expose": 22
    }],
    22: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = e("../enabled");
        t.exports = function(e) {
            return function() {
                if (i && "object" === n(window.console) && "function" == typeof console[e]) return console[e].apply(console, Array.prototype.slice.call(arguments, 0))
            }
        }
    }, {
        "../enabled": 20
    }],
    23: [function(e, t, r) {
        "use strict";
        t.exports = e("./internal/expose")("log")
    }, {
        "./internal/expose": 22
    }],
    24: [function(e, t, r) {
        "use strict";
        t.exports = e("./internal/expose")("warn")
    }, {
        "./internal/expose": 22
    }],
    25: [function(e, t, r) {
        "use strict";
        t.exports = {
            DOMEmitter: e("./ac-dom-emitter/DOMEmitter")
        }
    }, {
        "./ac-dom-emitter/DOMEmitter": 26
    }],
    26: [function(e, t, r) {
        "use strict";

        function n(e) {
            null !== e && (this.el = e, this._bindings = {}, this._delegateFuncs = {}, this._eventEmitter = new s)
        }
        var i, o = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            s = e("ac-event-emitter").EventEmitter,
            a = e("./DOMEmitterEvent"),
            u = {
                addEventListener: e("@marcom/ac-dom-events/addEventListener"),
                removeEventListener: e("@marcom/ac-dom-events/removeEventListener"),
                dispatchEvent: e("@marcom/ac-dom-events/dispatchEvent")
            },
            c = {
                querySelectorAll: e("@marcom/ac-dom-traversal/querySelectorAll"),
                matchesSelector: e("@marcom/ac-dom-traversal/matchesSelector")
            },
            l = "dom-emitter";
        i = n.prototype, i.on = function() {
            return this._normalizeArgumentsAndCall(Array.prototype.slice.call(arguments, 0), this._on), this
        }, i.once = function() {
            return this._normalizeArgumentsAndCall(Array.prototype.slice.call(arguments, 0), this._once), this
        }, i.off = function() {
            return this._normalizeArgumentsAndCall(Array.prototype.slice.call(arguments, 0), this._off), this
        }, i.has = function(e, t, r, n) {
            var i, o;
            if ("string" == typeof t ? (i = t, o = r) : (o = t, n = r), i) {
                var s = this._getDelegateFuncBindingIdx(e, i, o, n, !0);
                return s > -1
            }
            return !(!this._eventEmitter || !this._eventEmitter.has.apply(this._eventEmitter, arguments))
        }, i.trigger = function(e, t, r, n) {
            e = this._parseEventNames(e), e = this._cleanStringData(e);
            var i, o, s, a = e.length;
            for ("string" == typeof t ? (i = this._cleanStringData(t), o = r) : (o = t, n = r), s = 0; s < a; s++) this._triggerDOMEvents(e[s], o, i);
            return this
        }, i.emitterTrigger = function(e, t, r) {
            if (!this._eventEmitter) return this;
            e = this._parseEventNames(e), e = this._cleanStringData(e), t = new a(t, this);
            var n, i = e.length;
            for (n = 0; n < i; n++) this._eventEmitter.trigger(e[n], t, r);
            return this
        }, i.propagateTo = function(e, t) {
            return this._eventEmitter.propagateTo(e, t), this
        }, i.stopPropagatingTo = function(e) {
            return this._eventEmitter.stopPropagatingTo(e), this
        }, i.stopImmediatePropagation = function() {
            return this._eventEmitter.stopImmediatePropagation(), this
        }, i.destroy = function() {
            this._triggerInternalEvent("willdestroy"), this.off();
            var e;
            for (e in this) this.hasOwnProperty(e) && (this[e] = null)
        }, i._parseEventNames = function(e) {
            return e ? e.split(" ") : [e]
        }, i._onListenerEvent = function(e, t) {
            var r = new a(t, this);
            this._eventEmitter.trigger(e, r, !1)
        }, i._setListener = function(e) {
            this._bindings[e] = this._onListenerEvent.bind(this, e), u.addEventListener(this.el, e, this._bindings[e])
        }, i._removeListener = function(e) {
            u.removeEventListener(this.el, e, this._bindings[e]), this._bindings[e] = null
        }, i._triggerInternalEvent = function(e, t) {
            this.emitterTrigger(l + ":" + e, t)
        }, i._normalizeArgumentsAndCall = function(e, t) {
            var r = {};
            if (0 === e.length) return void t.call(this, r);
            if ("string" == typeof e[0] || null === e[0]) return e = this._cleanStringData(e), r.events = e[0], "string" == typeof e[1] ? (r.delegateQuery = e[1], r.callback = e[2], r.context = e[3]) : (r.callback = e[1], r.context = e[2]), void t.call(this, r);
            var n, i, o = ":",
                s = e[0];
            for (n in s) s.hasOwnProperty(n) && (r = {}, i = this._cleanStringData(n.split(o)), r.events = i[0], r.delegateQuery = i[1], r.callback = s[n], r.context = e[1], t.call(this, r))
        }, i._registerDelegateFunc = function(e, t, r, n, i) {
            var o = this._delegateFunc.bind(this, e, t, r, i);
            return this._delegateFuncs[t] = this._delegateFuncs[t] || {}, this._delegateFuncs[t][e] = this._delegateFuncs[t][e] || [], this._delegateFuncs[t][e].push({
                func: n,
                context: i,
                delegateFunc: o
            }), o
        }, i._cleanStringData = function(e) {
            var t = !1;
            "string" == typeof e && (e = [e], t = !0);
            var r, n, i, o = [],
                s = e.length;
            for (r = 0; r < s; r++) {
                if (n = e[r], "string" == typeof n) {
                    if ("" === n || " " === n) continue;
                    for (i = n.length;
                        " " === n[0];) n = n.slice(1, i), i--;
                    for (;
                        " " === n[i - 1];) n = n.slice(0, i - 1), i--
                }
                o.push(n)
            }
            return t ? o[0] : o
        }, i._unregisterDelegateFunc = function(e, t, r, n) {
            if (this._delegateFuncs[t] && this._delegateFuncs[t][e]) {
                var i, o = this._getDelegateFuncBindingIdx(e, t, r, n);
                return o > -1 && (i = this._delegateFuncs[t][e][o].delegateFunc, this._delegateFuncs[t][e].splice(o, 1), 0 === this._delegateFuncs[t][e].length && (this._delegateFuncs[t][e] = null)), i
            }
        }, i._unregisterDelegateFuncs = function(e, t) {
            if (this._delegateFuncs[t] && (null === e || this._delegateFuncs[t][e]))
                if (null !== e) this._unbindDelegateFunc(e, t);
                else {
                    var r;
                    for (r in this._delegateFuncs[t]) this._delegateFuncs[t].hasOwnProperty(r) && this._unbindDelegateFunc(r, t)
                }
        }, i._unbindDelegateFunc = function(e, t) {
            for (var r, n, i = 0; this._delegateFuncs[t][e] && this._delegateFuncs[t][e][i];) r = this._delegateFuncs[t][e][i], n = this._delegateFuncs[t][e][i].length, this._off({
                events: e,
                delegateQuery: t,
                callback: r.func,
                context: r.context
            }), this._delegateFuncs[t][e] && n === this._delegateFuncs[t][e].length && i++;
            r = n = null
        }, i._unregisterDelegateFuncsByEvent = function(e) {
            var t;
            for (t in this._delegateFuncs) this._delegateFuncs.hasOwnProperty(t) && this._unregisterDelegateFuncs(e, t)
        }, i._delegateFunc = function(e, t, r, n, i) {
            if (this._targetHasDelegateAncestor(i.target, t)) {
                var s = Array.prototype.slice.call(arguments, 0),
                    a = s.slice(4, s.length);
                n = n || window, "object" === o(i.detail) && (a[0] = i.detail), r.apply(n, a)
            }
        }, i._targetHasDelegateAncestor = function(e, t) {
            for (var r = e; r && r !== this.el && r !== document.documentElement;) {
                if (c.matchesSelector(r, t)) return !0;
                r = r.parentNode
            }
            return !1
        }, i._on = function(e) {
            var t = e.events,
                r = e.callback,
                n = e.delegateQuery,
                i = e.context,
                o = e.unboundCallback || r;
            t = this._parseEventNames(t), t.forEach(function(e, t, r, n, i) {
                this.has(i) || this._setListener(i), "string" == typeof n && (e = this._registerDelegateFunc(i, n, e, t, r)), this._triggerInternalEvent("willon", {
                    evt: i,
                    callback: e,
                    context: r,
                    delegateQuery: n
                }), this._eventEmitter.on(i, e, r), this._triggerInternalEvent("didon", {
                    evt: i,
                    callback: e,
                    context: r,
                    delegateQuery: n
                })
            }.bind(this, r, o, i, n)), t = r = o = n = i = null
        }, i._off = function(e) {
            var t = e.events,
                r = e.callback,
                n = e.delegateQuery,
                i = e.context,
                o = e.unboundCallback || r;
            if ("undefined" != typeof t) t = this._parseEventNames(t), t.forEach(function(e, t, r, n, i) {
                if ("string" != typeof n || "function" != typeof t || (e = this._unregisterDelegateFunc(i, n, t, r))) return "string" == typeof n && "undefined" == typeof e ? void this._unregisterDelegateFuncs(i, n) : void("string" == typeof i && "undefined" == typeof e && (this._unregisterDelegateFuncsByEvent(i), "string" == typeof n) || (this._triggerInternalEvent("willoff", {
                    evt: i,
                    callback: e,
                    context: r,
                    delegateQuery: n
                }), this._eventEmitter.off(i, e, r), this._triggerInternalEvent("didoff", {
                    evt: i,
                    callback: e,
                    context: r,
                    delegateQuery: n
                }), this.has(i) || this._removeListener(i)))
            }.bind(this, r, o, i, n)), t = r = o = n = i = null;
            else {
                this._eventEmitter.off();
                var s;
                for (s in this._bindings) this._bindings.hasOwnProperty(s) && this._removeListener(s);
                for (s in this._delegateFuncs) this._delegateFuncs.hasOwnProperty(s) && (this._delegateFuncs[s] = null)
            }
        }, i._once = function(e) {
            var t = e.events,
                r = e.callback,
                n = e.delegateQuery,
                i = e.context;
            t = this._parseEventNames(t), t.forEach(function(e, t, r, n) {
                return "string" == typeof r ? this._handleDelegateOnce(n, e, t, r) : (this.has(n) || this._setListener(n), this._triggerInternalEvent("willonce", {
                    evt: n,
                    callback: e,
                    context: t,
                    delegateQuery: r
                }), this._eventEmitter.once.call(this, n, e, t), void this._triggerInternalEvent("didonce", {
                    evt: n,
                    callback: e,
                    context: t,
                    delegateQuery: r
                }))
            }.bind(this, r, i, n)), t = r = n = i = null
        }, i._handleDelegateOnce = function(e, t, r, n) {
            return this._triggerInternalEvent("willonce", {
                evt: e,
                callback: t,
                context: r,
                delegateQuery: n
            }), this._on({
                events: e,
                context: r,
                delegateQuery: n,
                callback: this._getDelegateOnceCallback.bind(this, e, t, r, n),
                unboundCallback: t
            }), this._triggerInternalEvent("didonce", {
                evt: e,
                callback: t,
                context: r,
                delegateQuery: n
            }), this
        }, i._getDelegateOnceCallback = function(e, t, r, n) {
            var i = Array.prototype.slice.call(arguments, 0),
                o = i.slice(4, i.length);
            t.apply(r, o), this._off({
                events: e,
                delegateQuery: n,
                callback: t,
                context: r
            })
        }, i._getDelegateFuncBindingIdx = function(e, t, r, n, i) {
            var o = -1;
            if (this._delegateFuncs[t] && this._delegateFuncs[t][e]) {
                var s, a, u = this._delegateFuncs[t][e].length;
                for (s = 0; s < u; s++)
                    if (a = this._delegateFuncs[t][e][s], i && "undefined" == typeof r && (r = a.func), a.func === r && a.context === n) {
                        o = s;
                        break
                    }
            }
            return o
        }, i._triggerDOMEvents = function(e, t, r) {
            var n = [this.el];
            r && (n = c.querySelectorAll(r, this.el));
            var i, o = n.length;
            for (i = 0; i < o; i++) u.dispatchEvent(n[i], e, {
                bubbles: !0,
                cancelable: !0,
                detail: t
            })
        }, t.exports = n
    }, {
        "./DOMEmitterEvent": 27,
        "@marcom/ac-dom-events/addEventListener": 28,
        "@marcom/ac-dom-events/dispatchEvent": 29,
        "@marcom/ac-dom-events/removeEventListener": 31,
        "@marcom/ac-dom-traversal/matchesSelector": 51,
        "@marcom/ac-dom-traversal/querySelectorAll": 52,
        "ac-event-emitter": 195
    }],
    27: [function(e, t, r) {
        "use strict";
        var n, i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = {
                preventDefault: e("@marcom/ac-dom-events/preventDefault"),
                stopPropagation: e("@marcom/ac-dom-events/stopPropagation"),
                target: e("@marcom/ac-dom-events/target")
            },
            s = function(e, t) {
                this._domEmitter = t, this.originalEvent = e || {}, this._originalTarget = o.target(this.originalEvent), this.target = this._originalTarget || this._domEmitter.el, this.currentTarget = this._domEmitter.el, this.timeStamp = this.originalEvent.timeStamp || Date.now(), this._isDOMEvent(this.originalEvent) ? "object" === i(this.originalEvent.detail) && (this.data = this.originalEvent.detail) : e && (this.data = this.originalEvent, this.originalEvent = {})
            };
        n = s.prototype, n.preventDefault = function() {
            o.preventDefault(this.originalEvent)
        }, n.stopPropagation = function() {
            o.stopPropagation(this.originalEvent)
        }, n.stopImmediatePropagation = function() {
            this.originalEvent.stopImmediatePropagation && this.originalEvent.stopImmediatePropagation(), this._domEmitter.stopImmediatePropagation()
        }, n._isDOMEvent = function(e) {
            return !!(this._originalTarget || "undefined" !== document.createEvent && "undefined" != typeof CustomEvent && e instanceof CustomEvent)
        }, t.exports = s
    }, {
        "@marcom/ac-dom-events/preventDefault": 30,
        "@marcom/ac-dom-events/stopPropagation": 33,
        "@marcom/ac-dom-events/target": 34
    }],
    28: [function(e, t, r) {
        "use strict";
        var n = e("./utils/addEventListener"),
            i = e("./shared/getEventType");
        t.exports = function(e, t, r, o) {
            return t = i(e, t), n(e, t, r, o)
        }
    }, {
        "./shared/getEventType": 32,
        "./utils/addEventListener": 35
    }],
    29: [function(e, t, r) {
        "use strict";
        var n = e("./utils/dispatchEvent"),
            i = e("./shared/getEventType");
        t.exports = function(e, t, r) {
            return t = i(e, t), n(e, t, r)
        }
    }, {
        "./shared/getEventType": 32,
        "./utils/dispatchEvent": 36
    }],
    30: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            e = e || window.event, e.preventDefault ? e.preventDefault() : e.returnValue = !1
        }
    }, {}],
    31: [function(e, t, r) {
        "use strict";
        var n = e("./utils/removeEventListener"),
            i = e("./shared/getEventType");
        t.exports = function(e, t, r, o) {
            return t = i(e, t), n(e, t, r, o)
        }
    }, {
        "./shared/getEventType": 32,
        "./utils/removeEventListener": 37
    }],
    32: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/ac-prefixer/getEventType");
        t.exports = function(e, t) {
            var r, i;
            return r = "tagName" in e ? e.tagName : e === window ? "window" : "document", i = n(t, r), i ? i : t
        }
    }, {
        "@marcom/ac-prefixer/getEventType": 79
    }],
    33: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            e = e || window.event, e.stopPropagation ? e.stopPropagation() : e.cancelBubble = !0
        }
    }, {}],
    34: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            return e = e || window.event, "undefined" != typeof e.target ? e.target : e.srcElement
        }
    }, {}],
    35: [function(e, t, r) {
        "use strict";
        t.exports = function(e, t, r, n) {
            return e.addEventListener ? e.addEventListener(t, r, !!n) : e.attachEvent("on" + t, r), e
        }
    }, {}],
    36: [function(e, t, r) {
        "use strict";
        e("@marcom/ac-polyfills/CustomEvent"), t.exports = function(e, t, r) {
            var n;
            return e.dispatchEvent ? (n = r ? new CustomEvent(t, r) : new CustomEvent(t), e.dispatchEvent(n)) : (n = document.createEventObject(), r && "detail" in r && (n.detail = r.detail), e.fireEvent("on" + t, n)), e
        }
    }, {
        "@marcom/ac-polyfills/CustomEvent": void 0
    }],
    37: [function(e, t, r) {
        "use strict";
        t.exports = function(e, t, r, n) {
            return e.removeEventListener ? e.removeEventListener(t, r, !!n) : e.detachEvent("on" + t, r), e
        }
    }, {}],
    38: [function(e, t, r) {
        "use strict";
        t.exports = 8
    }, {}],
    39: [function(e, t, r) {
        "use strict";
        t.exports = 11
    }, {}],
    40: [function(e, t, r) {
        "use strict";
        t.exports = 9
    }, {}],
    41: [function(e, t, r) {
        "use strict";
        t.exports = 1
    }, {}],
    42: [function(e, t, r) {
        "use strict";
        t.exports = 3
    }, {}],
    43: [function(e, t, r) {
        "use strict";
        var n = e("../isNode");
        t.exports = function(e, t) {
            return !!n(e) && ("number" == typeof t ? e.nodeType === t : t.indexOf(e.nodeType) !== -1)
        }
    }, {
        "../isNode": 47
    }],
    44: [function(e, t, r) {
        "use strict";
        var n = e("./isNodeType"),
            i = e("../COMMENT_NODE"),
            o = e("../DOCUMENT_FRAGMENT_NODE"),
            s = e("../ELEMENT_NODE"),
            a = e("../TEXT_NODE"),
            u = [s, a, i, o],
            c = " must be an Element, TextNode, Comment, or Document Fragment",
            l = [s, a, i],
            h = " must be an Element, TextNode, or Comment",
            f = [s, o],
            p = " must be an Element, or Document Fragment",
            d = " must have a parentNode";
        t.exports = {
            parentNode: function(e, t, r, i) {
                if (i = i || "target", (e || t) && !n(e, f)) throw new TypeError(r + ": " + i + p)
            },
            childNode: function(e, t, r, i) {
                if (i = i || "target", (e || t) && !n(e, l)) throw new TypeError(r + ": " + i + h)
            },
            insertNode: function(e, t, r, i) {
                if (i = i || "node", (e || t) && !n(e, u)) throw new TypeError(r + ": " + i + c)
            },
            hasParentNode: function(e, t, r) {
                if (r = r || "target", !e.parentNode) throw new TypeError(t + ": " + r + d)
            }
        }
    }, {
        "../COMMENT_NODE": 38,
        "../DOCUMENT_FRAGMENT_NODE": 39,
        "../ELEMENT_NODE": 41,
        "../TEXT_NODE": 42,
        "./isNodeType": 43
    }],
    45: [function(e, t, r) {
        "use strict";
        var n = e("./internal/isNodeType"),
            i = e("./DOCUMENT_FRAGMENT_NODE");
        t.exports = function(e) {
            return n(e, i)
        }
    }, {
        "./DOCUMENT_FRAGMENT_NODE": 39,
        "./internal/isNodeType": 43
    }],
    46: [function(e, t, r) {
        "use strict";
        var n = e("./internal/isNodeType"),
            i = e("./ELEMENT_NODE");
        t.exports = function(e) {
            return n(e, i);
        }
    }, {
        "./ELEMENT_NODE": 41,
        "./internal/isNodeType": 43
    }],
    47: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            return !(!e || !e.nodeType)
        }
    }, {}],
    48: [function(e, t, r) {
        "use strict";
        var n = e("./internal/validate");
        t.exports = function(e) {
            return n.childNode(e, !0, "remove"), e.parentNode ? e.parentNode.removeChild(e) : e
        }
    }, {
        "./internal/validate": 44
    }],
    49: [function(e, t, r) {
        "use strict";
        t.exports = window.Element ? function(e) {
            return e.matches || e.matchesSelector || e.webkitMatchesSelector || e.mozMatchesSelector || e.msMatchesSelector || e.oMatchesSelector
        }(Element.prototype) : null
    }, {}],
    50: [function(e, t, r) {
        "use strict";
        e("@marcom/ac-polyfills/Array/prototype.indexOf");
        var n = e("@marcom/ac-dom-nodes/isNode"),
            i = e("@marcom/ac-dom-nodes/COMMENT_NODE"),
            o = e("@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE"),
            s = e("@marcom/ac-dom-nodes/DOCUMENT_NODE"),
            a = e("@marcom/ac-dom-nodes/ELEMENT_NODE"),
            u = e("@marcom/ac-dom-nodes/TEXT_NODE"),
            c = function(e, t) {
                return !!n(e) && ("number" == typeof t ? e.nodeType === t : t.indexOf(e.nodeType) !== -1)
            },
            l = [a, s, o],
            h = " must be an Element, Document, or Document Fragment",
            f = [a, u, i],
            p = " must be an Element, TextNode, or Comment",
            d = " must be a string";
        t.exports = {
            parentNode: function(e, t, r, n) {
                if (n = n || "node", (e || t) && !c(e, l)) throw new TypeError(r + ": " + n + h)
            },
            childNode: function(e, t, r, n) {
                if (n = n || "node", (e || t) && !c(e, f)) throw new TypeError(r + ": " + n + p)
            },
            selector: function(e, t, r, n) {
                if (n = n || "selector", (e || t) && "string" != typeof e) throw new TypeError(r + ": " + n + d)
            }
        }
    }, {
        "@marcom/ac-dom-nodes/COMMENT_NODE": 38,
        "@marcom/ac-dom-nodes/DOCUMENT_FRAGMENT_NODE": 39,
        "@marcom/ac-dom-nodes/DOCUMENT_NODE": 40,
        "@marcom/ac-dom-nodes/ELEMENT_NODE": 41,
        "@marcom/ac-dom-nodes/TEXT_NODE": 42,
        "@marcom/ac-dom-nodes/isNode": 47,
        "@marcom/ac-polyfills/Array/prototype.indexOf": void 0
    }],
    51: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/ac-dom-nodes/isElement"),
            i = e("./internal/validate"),
            o = e("./internal/nativeMatches"),
            s = e("./shims/matchesSelector");
        t.exports = function(e, t) {
            return i.selector(t, !0, "matchesSelector"), !!n(e) && (o ? o.call(e, t) : s(e, t))
        }
    }, {
        "./internal/nativeMatches": 49,
        "./internal/validate": 50,
        "./shims/matchesSelector": 53,
        "@marcom/ac-dom-nodes/isElement": 46
    }],
    52: [function(e, t, r) {
        "use strict";
        e("@marcom/ac-polyfills/Array/prototype.slice");
        var n = e("./internal/validate"),
            i = e("./shims/querySelectorAll"),
            o = "querySelectorAll" in document;
        t.exports = function(e, t) {
            return t = t || document, n.parentNode(t, !0, "querySelectorAll", "context"), n.selector(e, !0, "querySelectorAll"), o ? Array.prototype.slice.call(t.querySelectorAll(e)) : i(e, t)
        }
    }, {
        "./internal/validate": 50,
        "./shims/querySelectorAll": 54,
        "@marcom/ac-polyfills/Array/prototype.slice": void 0
    }],
    53: [function(e, t, r) {
        "use strict";
        var n = e("../querySelectorAll");
        t.exports = function(e, t) {
            var r, i = e.parentNode || document,
                o = n(t, i);
            for (r = 0; r < o.length; r++)
                if (o[r] === e) return !0;
            return !1
        }
    }, {
        "../querySelectorAll": 52
    }],
    54: [function(e, t, r) {
        "use strict";
        e("@marcom/ac-polyfills/Array/prototype.indexOf");
        var n = e("@marcom/ac-dom-nodes/isElement"),
            i = e("@marcom/ac-dom-nodes/isDocumentFragment"),
            o = e("@marcom/ac-dom-nodes/remove"),
            s = "_ac_qsa_",
            a = function(e, t) {
                var r;
                if (t === document) return !0;
                for (r = e;
                    (r = r.parentNode) && n(r);)
                    if (r === t) return !0;
                return !1
            },
            u = function(e) {
                "recalc" in e ? e.recalc(!1) : document.recalc(!1), window.scrollBy(0, 0)
            };
        t.exports = function(e, t) {
            var r, n = document.createElement("style"),
                c = s + (Math.random() + "").slice(-6),
                l = [];
            for (t = t || document, document[c] = [], i(t) ? t.appendChild(n) : document.documentElement.firstChild.appendChild(n), n.styleSheet.cssText = "*{display:recalc;}" + e + '{ac-qsa:expression(document["' + c + '"] && document["' + c + '"].push(this));}', u(t); document[c].length;) r = document[c].shift(), r.style.removeAttribute("ac-qsa"), l.indexOf(r) === -1 && a(r, t) && l.push(r);
            return document[c] = null, o(n), u(t), l
        }
    }, {
        "@marcom/ac-dom-nodes/isDocumentFragment": 45,
        "@marcom/ac-dom-nodes/isElement": 46,
        "@marcom/ac-dom-nodes/remove": 48,
        "@marcom/ac-polyfills/Array/prototype.indexOf": void 0
    }],
    55: [function(e, t, r) {
        "use strict";
        t.exports = {
            EventEmitterMicro: e("./ac-event-emitter-micro/EventEmitterMicro")
        }
    }, {
        "./ac-event-emitter-micro/EventEmitterMicro": 56
    }],
    56: [function(e, t, r) {
        "use strict";

        function n() {
            this._events = {}
        }
        var i = n.prototype;
        i.on = function(e, t) {
            this._events[e] = this._events[e] || [], this._events[e].unshift(t)
        }, i.once = function(e, t) {
            function r(i) {
                n.off(e, r), void 0 !== i ? t(i) : t()
            }
            var n = this;
            this.on(e, r)
        }, i.off = function(e, t) {
            if (this.has(e)) {
                if (1 === arguments.length) return this._events[e] = null, void delete this._events[e];
                var r = this._events[e].indexOf(t);
                r !== -1 && this._events[e].splice(r, 1)
            }
        }, i.trigger = function(e, t) {
            if (this.has(e))
                for (var r = this._events[e].length - 1; r >= 0; r--) void 0 !== t ? this._events[e][r](t) : this._events[e][r]()
        }, i.has = function(e) {
            return e in this._events != !1 && 0 !== this._events[e].length
        }, i.destroy = function() {
            for (var e in this._events) this._events[e] = null;
            this._events = null
        }, t.exports = n
    }, {}],
    57: [function(e, t, r) {
        "use strict";
        t.exports.EventEmitter = e("./ac-event-emitter/EventEmitter")
    }, {
        "./ac-event-emitter/EventEmitter": 58
    }],
    58: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = "EventEmitter:propagation",
            o = function(e) {
                e && (this.context = e)
            },
            s = o.prototype,
            a = function() {
                return this.hasOwnProperty("_events") || "object" === n(this._events) || (this._events = {}), this._events
            },
            u = function(e, t) {
                var r = e[0],
                    i = e[1],
                    o = e[2];
                if ("string" != typeof r && "object" !== ("undefined" == typeof r ? "undefined" : n(r)) || null === r || Array.isArray(r)) throw new TypeError("Expecting event name to be a string or object.");
                if ("string" == typeof r && !i) throw new Error("Expecting a callback function to be provided.");
                if (i && "function" != typeof i) {
                    if ("object" !== ("undefined" == typeof r ? "undefined" : n(r)) || "object" !== ("undefined" == typeof i ? "undefined" : n(i))) throw new TypeError("Expecting callback to be a function.");
                    o = i
                }
                if ("object" === ("undefined" == typeof r ? "undefined" : n(r)))
                    for (var s in r) t.call(this, s, r[s], o);
                "string" == typeof r && (r = r.split(" "), r.forEach(function(e) {
                    t.call(this, e, i, o)
                }, this))
            },
            c = function(e, t) {
                var r, n, i;
                if (r = a.call(this)[e], r && 0 !== r.length)
                    for (r = r.slice(), this._stoppedImmediatePropagation = !1, n = 0, i = r.length; n < i && (!this._stoppedImmediatePropagation && !t(r[n], n)); n++);
            },
            l = function(e, t, r) {
                var n = -1;
                c.call(this, t, function(e, t) {
                    if (e.callback === r) return n = t, !0
                }), n !== -1 && e[t].splice(n, 1)
            };
        s.on = function() {
            var e = a.call(this);
            return u.call(this, arguments, function(t, r, n) {
                e[t] = e[t] || (e[t] = []), e[t].push({
                    callback: r,
                    context: n
                })
            }), this
        }, s.once = function() {
            return u.call(this, arguments, function(e, t, r) {
                var n = function i(n) {
                    t.call(r || this, n), this.off(e, i)
                };
                this.on(e, n, this)
            }), this
        }, s.off = function(e, t) {
            var r = a.call(this);
            if (0 === arguments.length) this._events = {};
            else if (!e || "string" != typeof e && "object" !== ("undefined" == typeof e ? "undefined" : n(e)) || Array.isArray(e)) throw new TypeError("Expecting event name to be a string or object.");
            if ("object" === ("undefined" == typeof e ? "undefined" : n(e)))
                for (var i in e) l.call(this, r, i, e[i]);
            if ("string" == typeof e) {
                var o = e.split(" ");
                1 === o.length ? t ? l.call(this, r, e, t) : r[e] = [] : o.forEach(function(e) {
                    r[e] = []
                })
            }
            return this
        }, s.trigger = function(e, t, r) {
            if (!e) throw new Error("trigger method requires an event name");
            if ("string" != typeof e) throw new TypeError("Expecting event names to be a string.");
            if (r && "boolean" != typeof r) throw new TypeError("Expecting doNotPropagate to be a boolean.");
            return e = e.split(" "), e.forEach(function(e) {
                c.call(this, e, function(e) {
                    e.callback.call(e.context || this.context || this, t)
                }.bind(this)), r || c.call(this, i, function(r) {
                    var n = e;
                    r.prefix && (n = r.prefix + n), r.emitter.trigger(n, t)
                })
            }, this), this
        }, s.propagateTo = function(e, t) {
            var r = a.call(this);
            r[i] || (this._events[i] = []), r[i].push({
                emitter: e,
                prefix: t
            })
        }, s.stopPropagatingTo = function(e) {
            var t = a.call(this);
            if (!e) return void(t[i] = []);
            var r, n = t[i],
                o = n.length;
            for (r = 0; r < o; r++)
                if (n[r].emitter === e) {
                    n.splice(r, 1);
                    break
                }
        }, s.stopImmediatePropagation = function() {
            this._stoppedImmediatePropagation = !0
        }, s.has = function(e, t, r) {
            var n = a.call(this),
                i = n[e];
            if (0 === arguments.length) return Object.keys(n);
            if (!i) return !1;
            if (!t) return i.length > 0;
            for (var o = 0, s = i.length; o < s; o++) {
                var u = i[o];
                if (r && t && u.context === r && u.callback === t) return !0;
                if (t && !r && u.callback === t) return !0
            }
            return !1
        }, t.exports = o
    }, {}],
    59: [function(e, t, r) {
        "use strict";
        t.exports = {
            getWindow: function() {
                return window
            },
            getDocument: function() {
                return document
            },
            getNavigator: function() {
                return navigator
            }
        }
    }, {}],
    60: [function(e, t, r) {
        "use strict";

        function n() {
            var e = i.getWindow(),
                t = e.matchMedia("(prefers-reduced-motion)");
            return !(!t || !t.matches)
        }
        var i = e("./helpers/globals");
        t.exports = n
    }, {
        "./helpers/globals": 59
    }],
    61: [function(e, t, r) {
        "use strict";

        function n(e) {
            var t = e.length;
            if (t % 4 > 0) throw new Error("Invalid string. Length must be a multiple of 4");
            return "=" === e[t - 2] ? 2 : "=" === e[t - 1] ? 1 : 0
        }

        function i(e) {
            return 3 * e.length / 4 - n(e)
        }

        function o(e) {
            var t, r, i, o, s, a = e.length;
            o = n(e), s = new h(3 * a / 4 - o), r = o > 0 ? a - 4 : a;
            var u = 0;
            for (t = 0; t < r; t += 4) i = l[e.charCodeAt(t)] << 18 | l[e.charCodeAt(t + 1)] << 12 | l[e.charCodeAt(t + 2)] << 6 | l[e.charCodeAt(t + 3)], s[u++] = i >> 16 & 255, s[u++] = i >> 8 & 255, s[u++] = 255 & i;
            return 2 === o ? (i = l[e.charCodeAt(t)] << 2 | l[e.charCodeAt(t + 1)] >> 4, s[u++] = 255 & i) : 1 === o && (i = l[e.charCodeAt(t)] << 10 | l[e.charCodeAt(t + 1)] << 4 | l[e.charCodeAt(t + 2)] >> 2, s[u++] = i >> 8 & 255, s[u++] = 255 & i), s
        }

        function s(e) {
            return c[e >> 18 & 63] + c[e >> 12 & 63] + c[e >> 6 & 63] + c[63 & e]
        }

        function a(e, t, r) {
            for (var n, i = [], o = t; o < r; o += 3) n = (e[o] << 16 & 16711680) + (e[o + 1] << 8 & 65280) + (255 & e[o + 2]), i.push(s(n));
            return i.join("")
        }

        function u(e) {
            for (var t, r = e.length, n = r % 3, i = "", o = [], s = 16383, u = 0, l = r - n; u < l; u += s) o.push(a(e, u, u + s > l ? l : u + s));
            return 1 === n ? (t = e[r - 1], i += c[t >> 2], i += c[t << 4 & 63], i += "==") : 2 === n && (t = (e[r - 2] << 8) + e[r - 1], i += c[t >> 10], i += c[t >> 4 & 63], i += c[t << 2 & 63], i += "="), o.push(i), o.join("")
        }
        r.byteLength = i, r.toByteArray = o, r.fromByteArray = u;
        for (var c = [], l = [], h = "undefined" != typeof Uint8Array ? Uint8Array : Array, f = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", p = 0, d = f.length; p < d; ++p) c[p] = f[p], l[f.charCodeAt(p)] = p;
        l["-".charCodeAt(0)] = 62, l["_".charCodeAt(0)] = 63
    }, {}],
    62: [function(e, t, r) {
        (function(t) {
            "use strict";

            function n() {
                try {
                    var e = new Uint8Array(1);
                    return e.__proto__ = {
                        __proto__: Uint8Array.prototype,
                        foo: function() {
                            return 42
                        }
                    }, 42 === e.foo() && "function" == typeof e.subarray && 0 === e.subarray(1, 1).byteLength
                } catch (t) {
                    return !1
                }
            }

            function i() {
                return s.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            }

            function o(e, t) {
                if (i() < t) throw new RangeError("Invalid typed array length");
                return s.TYPED_ARRAY_SUPPORT ? (e = new Uint8Array(t), e.__proto__ = s.prototype) : (null === e && (e = new s(t)), e.length = t), e
            }

            function s(e, t, r) {
                if (!(s.TYPED_ARRAY_SUPPORT || this instanceof s)) return new s(e, t, r);
                if ("number" == typeof e) {
                    if ("string" == typeof t) throw new Error("If encoding is specified then the first argument must be a string");
                    return l(this, e)
                }
                return a(this, e, t, r)
            }

            function a(e, t, r, n) {
                if ("number" == typeof t) throw new TypeError('"value" argument must not be a number');
                return "undefined" != typeof ArrayBuffer && t instanceof ArrayBuffer ? p(e, t, r, n) : "string" == typeof t ? h(e, t, r) : d(e, t)
            }

            function u(e) {
                if ("number" != typeof e) throw new TypeError('"size" argument must be a number');
                if (e < 0) throw new RangeError('"size" argument must not be negative')
            }

            function c(e, t, r, n) {
                return u(t), t <= 0 ? o(e, t) : void 0 !== r ? "string" == typeof n ? o(e, t).fill(r, n) : o(e, t).fill(r) : o(e, t)
            }

            function l(e, t) {
                if (u(t), e = o(e, t < 0 ? 0 : 0 | m(t)), !s.TYPED_ARRAY_SUPPORT)
                    for (var r = 0; r < t; ++r) e[r] = 0;
                return e
            }

            function h(e, t, r) {
                if ("string" == typeof r && "" !== r || (r = "utf8"), !s.isEncoding(r)) throw new TypeError('"encoding" must be a valid string encoding');
                var n = 0 | y(t, r);
                e = o(e, n);
                var i = e.write(t, r);
                return i !== n && (e = e.slice(0, i)), e
            }

            function f(e, t) {
                var r = t.length < 0 ? 0 : 0 | m(t.length);
                e = o(e, r);
                for (var n = 0; n < r; n += 1) e[n] = 255 & t[n];
                return e
            }

            function p(e, t, r, n) {
                if (t.byteLength, r < 0 || t.byteLength < r) throw new RangeError("'offset' is out of bounds");
                if (t.byteLength < r + (n || 0)) throw new RangeError("'length' is out of bounds");
                return t = void 0 === r && void 0 === n ? new Uint8Array(t) : void 0 === n ? new Uint8Array(t, r) : new Uint8Array(t, r, n), s.TYPED_ARRAY_SUPPORT ? (e = t, e.__proto__ = s.prototype) : e = f(e, t), e
            }

            function d(e, t) {
                if (s.isBuffer(t)) {
                    var r = 0 | m(t.length);
                    return e = o(e, r), 0 === e.length ? e : (t.copy(e, 0, 0, r), e)
                }
                if (t) {
                    if ("undefined" != typeof ArrayBuffer && t.buffer instanceof ArrayBuffer || "length" in t) return "number" != typeof t.length || Q(t.length) ? o(e, 0) : f(e, t);
                    if ("Buffer" === t.type && $(t.data)) return f(e, t.data)
                }
                throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")
            }

            function m(e) {
                if (e >= i()) throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i().toString(16) + " bytes");
                return 0 | e
            }

            function v(e) {
                return +e != e && (e = 0), s.alloc(+e)
            }

            function y(e, t) {
                if (s.isBuffer(e)) return e.length;
                if ("undefined" != typeof ArrayBuffer && "function" == typeof ArrayBuffer.isView && (ArrayBuffer.isView(e) || e instanceof ArrayBuffer)) return e.byteLength;
                "string" != typeof e && (e = "" + e);
                var r = e.length;
                if (0 === r) return 0;
                for (var n = !1;;) switch (t) {
                    case "ascii":
                    case "latin1":
                    case "binary":
                        return r;
                    case "utf8":
                    case "utf-8":
                    case void 0:
                        return Y(e).length;
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return 2 * r;
                    case "hex":
                        return r >>> 1;
                    case "base64":
                        return G(e).length;
                    default:
                        if (n) return Y(e).length;
                        t = ("" + t).toLowerCase(), n = !0
                }
            }

            function _(e, t, r) {
                var n = !1;
                if ((void 0 === t || t < 0) && (t = 0), t > this.length) return "";
                if ((void 0 === r || r > this.length) && (r = this.length), r <= 0) return "";
                if (r >>>= 0, t >>>= 0, r <= t) return "";
                for (e || (e = "utf8");;) switch (e) {
                    case "hex":
                        return M(this, t, r);
                    case "utf8":
                    case "utf-8":
                        return P(this, t, r);
                    case "ascii":
                        return R(this, t, r);
                    case "latin1":
                    case "binary":
                        return I(this, t, r);
                    case "base64":
                        return k(this, t, r);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return F(this, t, r);
                    default:
                        if (n) throw new TypeError("Unknown encoding: " + e);
                        e = (e + "").toLowerCase(), n = !0
                }
            }

            function g(e, t, r) {
                var n = e[t];
                e[t] = e[r], e[r] = n
            }

            function b(e, t, r, n, i) {
                if (0 === e.length) return -1;
                if ("string" == typeof r ? (n = r, r = 0) : r > 2147483647 ? r = 2147483647 : r < -2147483648 && (r = -2147483648), r = +r, isNaN(r) && (r = i ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length) {
                    if (i) return -1;
                    r = e.length - 1
                } else if (r < 0) {
                    if (!i) return -1;
                    r = 0
                }
                if ("string" == typeof t && (t = s.from(t, n)), s.isBuffer(t)) return 0 === t.length ? -1 : E(e, t, r, n, i);
                if ("number" == typeof t) return t = 255 & t, s.TYPED_ARRAY_SUPPORT && "function" == typeof Uint8Array.prototype.indexOf ? i ? Uint8Array.prototype.indexOf.call(e, t, r) : Uint8Array.prototype.lastIndexOf.call(e, t, r) : E(e, [t], r, n, i);
                throw new TypeError("val must be string, number or Buffer")
            }

            function E(e, t, r, n, i) {
                function o(e, t) {
                    return 1 === s ? e[t] : e.readUInt16BE(t * s)
                }
                var s = 1,
                    a = e.length,
                    u = t.length;
                if (void 0 !== n && (n = String(n).toLowerCase(), "ucs2" === n || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
                    if (e.length < 2 || t.length < 2) return -1;
                    s = 2, a /= 2, u /= 2, r /= 2
                }
                var c;
                if (i) {
                    var l = -1;
                    for (c = r; c < a; c++)
                        if (o(e, c) === o(t, l === -1 ? 0 : c - l)) {
                            if (l === -1 && (l = c), c - l + 1 === u) return l * s
                        } else l !== -1 && (c -= c - l), l = -1
                } else
                    for (r + u > a && (r = a - u), c = r; c >= 0; c--) {
                        for (var h = !0, f = 0; f < u; f++)
                            if (o(e, c + f) !== o(t, f)) {
                                h = !1;
                                break
                            }
                        if (h) return c
                    }
                return -1
            }

            function w(e, t, r, n) {
                r = Number(r) || 0;
                var i = e.length - r;
                n ? (n = Number(n), n > i && (n = i)) : n = i;
                var o = t.length;
                if (o % 2 !== 0) throw new TypeError("Invalid hex string");
                n > o / 2 && (n = o / 2);
                for (var s = 0; s < n; ++s) {
                    var a = parseInt(t.substr(2 * s, 2), 16);
                    if (isNaN(a)) return s;
                    e[r + s] = a
                }
                return s
            }

            function x(e, t, r, n) {
                return X(Y(t, e.length - r), e, r, n)
            }

            function A(e, t, r, n) {
                return X(W(t), e, r, n)
            }

            function S(e, t, r, n) {
                return A(e, t, r, n)
            }

            function O(e, t, r, n) {
                return X(G(t), e, r, n)
            }

            function T(e, t, r, n) {
                return X(H(t, e.length - r), e, r, n)
            }

            function k(e, t, r) {
                return 0 === t && r === e.length ? Z.fromByteArray(e) : Z.fromByteArray(e.slice(t, r))
            }

            function P(e, t, r) {
                r = Math.min(e.length, r);
                for (var n = [], i = t; i < r;) {
                    var o = e[i],
                        s = null,
                        a = o > 239 ? 4 : o > 223 ? 3 : o > 191 ? 2 : 1;
                    if (i + a <= r) {
                        var u, c, l, h;
                        switch (a) {
                            case 1:
                                o < 128 && (s = o);
                                break;
                            case 2:
                                u = e[i + 1], 128 === (192 & u) && (h = (31 & o) << 6 | 63 & u, h > 127 && (s = h));
                                break;
                            case 3:
                                u = e[i + 1], c = e[i + 2], 128 === (192 & u) && 128 === (192 & c) && (h = (15 & o) << 12 | (63 & u) << 6 | 63 & c, h > 2047 && (h < 55296 || h > 57343) && (s = h));
                                break;
                            case 4:
                                u = e[i + 1], c = e[i + 2], l = e[i + 3], 128 === (192 & u) && 128 === (192 & c) && 128 === (192 & l) && (h = (15 & o) << 18 | (63 & u) << 12 | (63 & c) << 6 | 63 & l, h > 65535 && h < 1114112 && (s = h))
                        }
                    }
                    null === s ? (s = 65533, a = 1) : s > 65535 && (s -= 65536, n.push(s >>> 10 & 1023 | 55296), s = 56320 | 1023 & s), n.push(s), i += a
                }
                return C(n)
            }

            function C(e) {
                var t = e.length;
                if (t <= ee) return String.fromCharCode.apply(String, e);
                for (var r = "", n = 0; n < t;) r += String.fromCharCode.apply(String, e.slice(n, n += ee));
                return r
            }

            function R(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i) n += String.fromCharCode(127 & e[i]);
                return n
            }

            function I(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; ++i) n += String.fromCharCode(e[i]);
                return n
            }

            function M(e, t, r) {
                var n = e.length;
                (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
                for (var i = "", o = t; o < r; ++o) i += K(e[o]);
                return i
            }

            function F(e, t, r) {
                for (var n = e.slice(t, r), i = "", o = 0; o < n.length; o += 2) i += String.fromCharCode(n[o] + 256 * n[o + 1]);
                return i
            }

            function D(e, t, r) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
            }

            function L(e, t, r, n, i, o) {
                if (!s.isBuffer(e)) throw new TypeError('"buffer" argument must be a Buffer instance');
                if (t > i || t < o) throw new RangeError('"value" argument is out of bounds');
                if (r + n > e.length) throw new RangeError("Index out of range")
            }

            function N(e, t, r, n) {
                t < 0 && (t = 65535 + t + 1);
                for (var i = 0, o = Math.min(e.length - r, 2); i < o; ++i) e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> 8 * (n ? i : 1 - i)
            }

            function j(e, t, r, n) {
                t < 0 && (t = 4294967295 + t + 1);
                for (var i = 0, o = Math.min(e.length - r, 4); i < o; ++i) e[r + i] = t >>> 8 * (n ? i : 3 - i) & 255
            }

            function U(e, t, r, n, i, o) {
                if (r + n > e.length) throw new RangeError("Index out of range");
                if (r < 0) throw new RangeError("Index out of range")
            }

            function B(e, t, r, n, i) {
                return i || U(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38), J.write(e, t, r, n, 23, 4), r + 4
            }

            function V(e, t, r, n, i) {
                return i || U(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308), J.write(e, t, r, n, 52, 8), r + 8
            }

            function z(e) {
                if (e = q(e).replace(te, ""), e.length < 2) return "";
                for (; e.length % 4 !== 0;) e += "=";
                return e
            }

            function q(e) {
                return e.trim ? e.trim() : e.replace(/^\s+|\s+$/g, "")
            }

            function K(e) {
                return e < 16 ? "0" + e.toString(16) : e.toString(16)
            }

            function Y(e, t) {
                t = t || 1 / 0;
                for (var r, n = e.length, i = null, o = [], s = 0; s < n; ++s) {
                    if (r = e.charCodeAt(s), r > 55295 && r < 57344) {
                        if (!i) {
                            if (r > 56319) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            if (s + 1 === n) {
                                (t -= 3) > -1 && o.push(239, 191, 189);
                                continue
                            }
                            i = r;
                            continue
                        }
                        if (r < 56320) {
                            (t -= 3) > -1 && o.push(239, 191, 189), i = r;
                            continue
                        }
                        r = (i - 55296 << 10 | r - 56320) + 65536
                    } else i && (t -= 3) > -1 && o.push(239, 191, 189);
                    if (i = null, r < 128) {
                        if ((t -= 1) < 0) break;
                        o.push(r)
                    } else if (r < 2048) {
                        if ((t -= 2) < 0) break;
                        o.push(r >> 6 | 192, 63 & r | 128)
                    } else if (r < 65536) {
                        if ((t -= 3) < 0) break;
                        o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
                    } else {
                        if (!(r < 1114112)) throw new Error("Invalid code point");
                        if ((t -= 4) < 0) break;
                        o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
                    }
                }
                return o
            }

            function W(e) {
                for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
                return t
            }

            function H(e, t) {
                for (var r, n, i, o = [], s = 0; s < e.length && !((t -= 2) < 0); ++s) r = e.charCodeAt(s), n = r >> 8, i = r % 256, o.push(i), o.push(n);
                return o
            }

            function G(e) {
                return Z.toByteArray(z(e))
            }

            function X(e, t, r, n) {
                for (var i = 0; i < n && !(i + r >= t.length || i >= e.length); ++i) t[i + r] = e[i];
                return i
            }

            function Q(e) {
                return e !== e
            }
            var Z = e("base64-js"),
                J = e("ieee754"),
                $ = e("isarray");
            r.Buffer = s, r.SlowBuffer = v, r.INSPECT_MAX_BYTES = 50, s.TYPED_ARRAY_SUPPORT = void 0 !== t.TYPED_ARRAY_SUPPORT ? t.TYPED_ARRAY_SUPPORT : n(), r.kMaxLength = i(), s.poolSize = 8192, s._augment = function(e) {
                return e.__proto__ = s.prototype, e
            }, s.from = function(e, t, r) {
                return a(null, e, t, r)
            }, s.TYPED_ARRAY_SUPPORT && (s.prototype.__proto__ = Uint8Array.prototype, s.__proto__ = Uint8Array, "undefined" != typeof Symbol && Symbol.species && s[Symbol.species] === s && Object.defineProperty(s, Symbol.species, {
                value: null,
                configurable: !0
            })), s.alloc = function(e, t, r) {
                return c(null, e, t, r)
            }, s.allocUnsafe = function(e) {
                return l(null, e)
            }, s.allocUnsafeSlow = function(e) {
                return l(null, e)
            }, s.isBuffer = function(e) {
                return !(null == e || !e._isBuffer)
            }, s.compare = function(e, t) {
                if (!s.isBuffer(e) || !s.isBuffer(t)) throw new TypeError("Arguments must be Buffers");
                if (e === t) return 0;
                for (var r = e.length, n = t.length, i = 0, o = Math.min(r, n); i < o; ++i)
                    if (e[i] !== t[i]) {
                        r = e[i], n = t[i];
                        break
                    }
                return r < n ? -1 : n < r ? 1 : 0
            }, s.isEncoding = function(e) {
                switch (String(e).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "latin1":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return !0;
                    default:
                        return !1
                }
            }, s.concat = function(e, t) {
                if (!$(e)) throw new TypeError('"list" argument must be an Array of Buffers');
                if (0 === e.length) return s.alloc(0);
                var r;
                if (void 0 === t)
                    for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
                var n = s.allocUnsafe(t),
                    i = 0;
                for (r = 0; r < e.length; ++r) {
                    var o = e[r];
                    if (!s.isBuffer(o)) throw new TypeError('"list" argument must be an Array of Buffers');
                    o.copy(n, i), i += o.length
                }
                return n
            }, s.byteLength = y, s.prototype._isBuffer = !0, s.prototype.swap16 = function() {
                var e = this.length;
                if (e % 2 !== 0) throw new RangeError("Buffer size must be a multiple of 16-bits");
                for (var t = 0; t < e; t += 2) g(this, t, t + 1);
                return this
            }, s.prototype.swap32 = function() {
                var e = this.length;
                if (e % 4 !== 0) throw new RangeError("Buffer size must be a multiple of 32-bits");
                for (var t = 0; t < e; t += 4) g(this, t, t + 3), g(this, t + 1, t + 2);
                return this
            }, s.prototype.swap64 = function() {
                var e = this.length;
                if (e % 8 !== 0) throw new RangeError("Buffer size must be a multiple of 64-bits");
                for (var t = 0; t < e; t += 8) g(this, t, t + 7), g(this, t + 1, t + 6), g(this, t + 2, t + 5), g(this, t + 3, t + 4);
                return this
            }, s.prototype.toString = function() {
                var e = 0 | this.length;
                return 0 === e ? "" : 0 === arguments.length ? P(this, 0, e) : _.apply(this, arguments)
            }, s.prototype.equals = function(e) {
                if (!s.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                return this === e || 0 === s.compare(this, e)
            }, s.prototype.inspect = function() {
                var e = "",
                    t = r.INSPECT_MAX_BYTES;
                return this.length > 0 && (e = this.toString("hex", 0, t).match(/.{2}/g).join(" "), this.length > t && (e += " ... ")), "<Buffer " + e + ">"
            }, s.prototype.compare = function(e, t, r, n, i) {
                if (!s.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === i && (i = this.length), t < 0 || r > e.length || n < 0 || i > this.length) throw new RangeError("out of range index");
                if (n >= i && t >= r) return 0;
                if (n >= i) return -1;
                if (t >= r) return 1;
                if (t >>>= 0, r >>>= 0, n >>>= 0, i >>>= 0, this === e) return 0;
                for (var o = i - n, a = r - t, u = Math.min(o, a), c = this.slice(n, i), l = e.slice(t, r), h = 0; h < u; ++h)
                    if (c[h] !== l[h]) {
                        o = c[h], a = l[h];
                        break
                    }
                return o < a ? -1 : a < o ? 1 : 0
            }, s.prototype.includes = function(e, t, r) {
                return this.indexOf(e, t, r) !== -1
            }, s.prototype.indexOf = function(e, t, r) {
                return b(this, e, t, r, !0)
            }, s.prototype.lastIndexOf = function(e, t, r) {
                return b(this, e, t, r, !1)
            }, s.prototype.write = function(e, t, r, n) {
                if (void 0 === t) n = "utf8", r = this.length, t = 0;
                else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
                else {
                    if (!isFinite(t)) throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
                    t = 0 | t, isFinite(r) ? (r = 0 | r, void 0 === n && (n = "utf8")) : (n = r, r = void 0)
                }
                var i = this.length - t;
                if ((void 0 === r || r > i) && (r = i), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw new RangeError("Attempt to write outside buffer bounds");
                n || (n = "utf8");
                for (var o = !1;;) switch (n) {
                    case "hex":
                        return w(this, e, t, r);
                    case "utf8":
                    case "utf-8":
                        return x(this, e, t, r);
                    case "ascii":
                        return A(this, e, t, r);
                    case "latin1":
                    case "binary":
                        return S(this, e, t, r);
                    case "base64":
                        return O(this, e, t, r);
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return T(this, e, t, r);
                    default:
                        if (o) throw new TypeError("Unknown encoding: " + n);
                        n = ("" + n).toLowerCase(), o = !0
                }
            }, s.prototype.toJSON = function() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            };
            var ee = 4096;
            s.prototype.slice = function(e, t) {
                var r = this.length;
                e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r, e < 0 && (e = 0)) : e > r && (e = r), t < 0 ? (t += r, t < 0 && (t = 0)) : t > r && (t = r), t < e && (t = e);
                var n;
                if (s.TYPED_ARRAY_SUPPORT) n = this.subarray(e, t), n.__proto__ = s.prototype;
                else {
                    var i = t - e;
                    n = new s(i, (void 0));
                    for (var o = 0; o < i; ++o) n[o] = this[o + e]
                }
                return n
            }, s.prototype.readUIntLE = function(e, t, r) {
                e = 0 | e, t = 0 | t, r || D(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                return n
            }, s.prototype.readUIntBE = function(e, t, r) {
                e = 0 | e, t = 0 | t, r || D(e, t, this.length);
                for (var n = this[e + --t], i = 1; t > 0 && (i *= 256);) n += this[e + --t] * i;
                return n
            }, s.prototype.readUInt8 = function(e, t) {
                return t || D(e, 1, this.length), this[e]
            }, s.prototype.readUInt16LE = function(e, t) {
                return t || D(e, 2, this.length), this[e] | this[e + 1] << 8
            }, s.prototype.readUInt16BE = function(e, t) {
                return t || D(e, 2, this.length), this[e] << 8 | this[e + 1]
            }, s.prototype.readUInt32LE = function(e, t) {
                return t || D(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 16777216 * this[e + 3]
            }, s.prototype.readUInt32BE = function(e, t) {
                return t || D(e, 4, this.length), 16777216 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            }, s.prototype.readIntLE = function(e, t, r) {
                e = 0 | e, t = 0 | t, r || D(e, t, this.length);
                for (var n = this[e], i = 1, o = 0; ++o < t && (i *= 256);) n += this[e + o] * i;
                return i *= 128, n >= i && (n -= Math.pow(2, 8 * t)), n
            }, s.prototype.readIntBE = function(e, t, r) {
                e = 0 | e, t = 0 | t, r || D(e, t, this.length);
                for (var n = t, i = 1, o = this[e + --n]; n > 0 && (i *= 256);) o += this[e + --n] * i;
                return i *= 128, o >= i && (o -= Math.pow(2, 8 * t)), o
            }, s.prototype.readInt8 = function(e, t) {
                return t || D(e, 1, this.length), 128 & this[e] ? (255 - this[e] + 1) * -1 : this[e]
            }, s.prototype.readInt16LE = function(e, t) {
                t || D(e, 2, this.length);
                var r = this[e] | this[e + 1] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, s.prototype.readInt16BE = function(e, t) {
                t || D(e, 2, this.length);
                var r = this[e + 1] | this[e] << 8;
                return 32768 & r ? 4294901760 | r : r
            }, s.prototype.readInt32LE = function(e, t) {
                return t || D(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            }, s.prototype.readInt32BE = function(e, t) {
                return t || D(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            }, s.prototype.readFloatLE = function(e, t) {
                return t || D(e, 4, this.length), J.read(this, e, !0, 23, 4)
            }, s.prototype.readFloatBE = function(e, t) {
                return t || D(e, 4, this.length), J.read(this, e, !1, 23, 4)
            }, s.prototype.readDoubleLE = function(e, t) {
                return t || D(e, 8, this.length), J.read(this, e, !0, 52, 8)
            }, s.prototype.readDoubleBE = function(e, t) {
                return t || D(e, 8, this.length), J.read(this, e, !1, 52, 8)
            }, s.prototype.writeUIntLE = function(e, t, r, n) {
                if (e = +e, t = 0 | t, r = 0 | r, !n) {
                    var i = Math.pow(2, 8 * r) - 1;
                    L(this, e, t, r, i, 0)
                }
                var o = 1,
                    s = 0;
                for (this[t] = 255 & e; ++s < r && (o *= 256);) this[t + s] = e / o & 255;
                return t + r
            }, s.prototype.writeUIntBE = function(e, t, r, n) {
                if (e = +e, t = 0 | t, r = 0 | r, !n) {
                    var i = Math.pow(2, 8 * r) - 1;
                    L(this, e, t, r, i, 0)
                }
                var o = r - 1,
                    s = 1;
                for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) this[t + o] = e / s & 255;
                return t + r
            }, s.prototype.writeUInt8 = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 1, 255, 0), s.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), this[t] = 255 & e, t + 1
            }, s.prototype.writeUInt16LE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 2, 65535, 0), s.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0), t + 2
            }, s.prototype.writeUInt16BE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 2, 65535, 0), s.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1), t + 2
            }, s.prototype.writeUInt32LE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 4, 4294967295, 0), s.TYPED_ARRAY_SUPPORT ? (this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e) : j(this, e, t, !0), t + 4
            }, s.prototype.writeUInt32BE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 4, 4294967295, 0), s.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : j(this, e, t, !1), t + 4
            }, s.prototype.writeIntLE = function(e, t, r, n) {
                if (e = +e, t = 0 | t, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    L(this, e, t, r, i - 1, -i)
                }
                var o = 0,
                    s = 1,
                    a = 0;
                for (this[t] = 255 & e; ++o < r && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o - 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                return t + r
            }, s.prototype.writeIntBE = function(e, t, r, n) {
                if (e = +e, t = 0 | t, !n) {
                    var i = Math.pow(2, 8 * r - 1);
                    L(this, e, t, r, i - 1, -i)
                }
                var o = r - 1,
                    s = 1,
                    a = 0;
                for (this[t + o] = 255 & e; --o >= 0 && (s *= 256);) e < 0 && 0 === a && 0 !== this[t + o + 1] && (a = 1), this[t + o] = (e / s >> 0) - a & 255;
                return t + r
            }, s.prototype.writeInt8 = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 1, 127, -128), s.TYPED_ARRAY_SUPPORT || (e = Math.floor(e)), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
            }, s.prototype.writeInt16LE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 2, 32767, -32768), s.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8) : N(this, e, t, !0), t + 2
            }, s.prototype.writeInt16BE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 2, 32767, -32768), s.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 8, this[t + 1] = 255 & e) : N(this, e, t, !1), t + 2
            }, s.prototype.writeInt32LE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 4, 2147483647, -2147483648), s.TYPED_ARRAY_SUPPORT ? (this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24) : j(this, e, t, !0), t + 4
            }, s.prototype.writeInt32BE = function(e, t, r) {
                return e = +e, t = 0 | t, r || L(this, e, t, 4, 2147483647, -2147483648), e < 0 && (e = 4294967295 + e + 1), s.TYPED_ARRAY_SUPPORT ? (this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e) : j(this, e, t, !1), t + 4
            }, s.prototype.writeFloatLE = function(e, t, r) {
                return B(this, e, t, !0, r)
            }, s.prototype.writeFloatBE = function(e, t, r) {
                return B(this, e, t, !1, r)
            }, s.prototype.writeDoubleLE = function(e, t, r) {
                return V(this, e, t, !0, r)
            }, s.prototype.writeDoubleBE = function(e, t, r) {
                return V(this, e, t, !1, r)
            }, s.prototype.copy = function(e, t, r, n) {
                if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r) return 0;
                if (0 === e.length || 0 === this.length) return 0;
                if (t < 0) throw new RangeError("targetStart out of bounds");
                if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                if (n < 0) throw new RangeError("sourceEnd out of bounds");
                n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
                var i, o = n - r;
                if (this === e && r < t && t < n)
                    for (i = o - 1; i >= 0; --i) e[i + t] = this[i + r];
                else if (o < 1e3 || !s.TYPED_ARRAY_SUPPORT)
                    for (i = 0; i < o; ++i) e[i + t] = this[i + r];
                else Uint8Array.prototype.set.call(e, this.subarray(r, r + o), t);
                return o
            }, s.prototype.fill = function(e, t, r, n) {
                if ("string" == typeof e) {
                    if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), 1 === e.length) {
                        var i = e.charCodeAt(0);
                        i < 256 && (e = i)
                    }
                    if (void 0 !== n && "string" != typeof n) throw new TypeError("encoding must be a string");
                    if ("string" == typeof n && !s.isEncoding(n)) throw new TypeError("Unknown encoding: " + n)
                } else "number" == typeof e && (e = 255 & e);
                if (t < 0 || this.length < t || this.length < r) throw new RangeError("Out of range index");
                if (r <= t) return this;
                t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0);
                var o;
                if ("number" == typeof e)
                    for (o = t; o < r; ++o) this[o] = e;
                else {
                    var a = s.isBuffer(e) ? e : Y(new s(e, n).toString()),
                        u = a.length;
                    for (o = 0; o < r - t; ++o) this[o + t] = a[o % u]
                }
                return this
            };
            var te = /[^+\/0-9A-Za-z-_]/g
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "base64-js": 61,
        ieee754: 63,
        isarray: 64
    }],
    63: [function(e, t, r) {
        "use strict";
        r.read = function(e, t, r, n, i) {
            var o, s, a = 8 * i - n - 1,
                u = (1 << a) - 1,
                c = u >> 1,
                l = -7,
                h = r ? i - 1 : 0,
                f = r ? -1 : 1,
                p = e[t + h];
            for (h += f, o = p & (1 << -l) - 1, p >>= -l, l += a; l > 0; o = 256 * o + e[t + h], h += f, l -= 8);
            for (s = o & (1 << -l) - 1, o >>= -l, l += n; l > 0; s = 256 * s + e[t + h], h += f, l -= 8);
            if (0 === o) o = 1 - c;
            else {
                if (o === u) return s ? NaN : (p ? -1 : 1) * (1 / 0);
                s += Math.pow(2, n), o -= c
            }
            return (p ? -1 : 1) * s * Math.pow(2, o - n)
        }, r.write = function(e, t, r, n, i, o) {
            var s, a, u, c = 8 * o - i - 1,
                l = (1 << c) - 1,
                h = l >> 1,
                f = 23 === i ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
                p = n ? 0 : o - 1,
                d = n ? 1 : -1,
                m = t < 0 || 0 === t && 1 / t < 0 ? 1 : 0;
            for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (a = isNaN(t) ? 1 : 0, s = l) : (s = Math.floor(Math.log(t) / Math.LN2), t * (u = Math.pow(2, -s)) < 1 && (s--, u *= 2), t += s + h >= 1 ? f / u : f * Math.pow(2, 1 - h), t * u >= 2 && (s++, u /= 2), s + h >= l ? (a = 0, s = l) : s + h >= 1 ? (a = (t * u - 1) * Math.pow(2, i), s += h) : (a = t * Math.pow(2, h - 1) * Math.pow(2, i), s = 0)); i >= 8; e[r + p] = 255 & a, p += d, a /= 256, i -= 8);
            for (s = s << i | a, c += i; c > 0; e[r + p] = 255 & s, p += d, s /= 256, c -= 8);
            e[r + p - d] |= 128 * m
        }
    }, {}],
    64: [function(e, t, r) {
        "use strict";
        var n = {}.toString;
        t.exports = Array.isArray || function(e) {
            return "[object Array]" == n.call(e)
        }
    }, {}],
    65: [function(e, t, r) {
        "use strict";

        function n(e) {
            this._keysDown = {}, this._DOMKeyDown = this._DOMKeyDown.bind(this), this._DOMKeyUp = this._DOMKeyUp.bind(this), this._context = e || document, o(this._context, c, this._DOMKeyDown, !0), o(this._context, l, this._DOMKeyUp, !0), i.call(this)
        }
        var i = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("@marcom/ac-dom-events/utils/addEventListener"),
            s = e("@marcom/ac-dom-events/utils/removeEventListener"),
            a = e("@marcom/ac-object/create"),
            u = e("./internal/KeyEvent"),
            c = "keydown",
            l = "keyup",
            h = n.prototype = a(i.prototype);
        h.onDown = function(e, t) {
            return this.on(c + ":" + e, t)
        }, h.onceDown = function(e, t) {
            return this.once(c + ":" + e, t)
        }, h.offDown = function(e, t) {
            return this.off(c + ":" + e, t)
        }, h.onUp = function(e, t) {
            return this.on(l + ":" + e, t)
        }, h.onceUp = function(e, t) {
            return this.once(l + ":" + e, t)
        }, h.offUp = function(e, t) {
            return this.off(l + ":" + e, t)
        }, h.isDown = function(e) {
            return e += "", this._keysDown[e] || !1;
        }, h.isUp = function(e) {
            return !this.isDown(e)
        }, h.destroy = function() {
            return s(this._context, c, this._DOMKeyDown, !0), s(this._context, l, this._DOMKeyUp, !0), this._keysDown = null, this._context = null, i.prototype.destroy.call(this), this
        }, h._DOMKeyDown = function(e) {
            var t = this._normalizeKeyboardEvent(e),
                r = t.keyCode += "";
            this._trackKeyDown(r), this.trigger(c + ":" + r, t)
        }, h._DOMKeyUp = function(e) {
            var t = this._normalizeKeyboardEvent(e),
                r = t.keyCode += "";
            this._trackKeyUp(r), this.trigger(l + ":" + r, t)
        }, h._normalizeKeyboardEvent = function(e) {
            return new u(e)
        }, h._trackKeyUp = function(e) {
            this._keysDown[e] && (this._keysDown[e] = !1)
        }, h._trackKeyDown = function(e) {
            this._keysDown[e] || (this._keysDown[e] = !0)
        }, t.exports = n
    }, {
        "./internal/KeyEvent": 67,
        "@marcom/ac-dom-events/utils/addEventListener": 35,
        "@marcom/ac-dom-events/utils/removeEventListener": 37,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-object/create": 71
    }],
    66: [function(e, t, r) {
        "use strict";
        var n = e("./Keyboard");
        t.exports = new n
    }, {
        "./Keyboard": 65
    }],
    67: [function(e, t, r) {
        "use strict";

        function n(e) {
            this.originalEvent = e;
            var t;
            for (t in e) i.indexOf(t) === -1 && "function" != typeof e[t] && (this[t] = e[t]);
            this.location = void 0 !== this.originalEvent.location ? this.originalEvent.location : this.originalEvent.keyLocation
        }
        var i = ["keyLocation"];
        n.prototype = {
            preventDefault: function() {
                return "function" != typeof this.originalEvent.preventDefault ? void(this.originalEvent.returnValue = !1) : this.originalEvent.preventDefault()
            },
            stopPropagation: function() {
                return this.originalEvent.stopPropagation()
            }
        }, t.exports = n
    }, {}],
    68: [function(e, t, r) {
        "use strict";
        t.exports = {
            BACKSPACE: 8,
            TAB: 9,
            ENTER: 13,
            SHIFT: 16,
            CONTROL: 17,
            ALT: 18,
            COMMAND: 91,
            CAPSLOCK: 20,
            ESCAPE: 27,
            PAGE_UP: 33,
            PAGE_DOWN: 34,
            END: 35,
            HOME: 36,
            ARROW_LEFT: 37,
            ARROW_UP: 38,
            ARROW_RIGHT: 39,
            ARROW_DOWN: 40,
            DELETE: 46,
            ZERO: 48,
            ONE: 49,
            TWO: 50,
            THREE: 51,
            FOUR: 52,
            FIVE: 53,
            SIX: 54,
            SEVEN: 55,
            EIGHT: 56,
            NINE: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            NUMPAD_ZERO: 96,
            NUMPAD_ONE: 97,
            NUMPAD_TWO: 98,
            NUMPAD_THREE: 99,
            NUMPAD_FOUR: 100,
            NUMPAD_FIVE: 101,
            NUMPAD_SIX: 102,
            NUMPAD_SEVEN: 103,
            NUMPAD_EIGHT: 104,
            NUMPAD_NINE: 105,
            NUMPAD_ASTERISK: 106,
            NUMPAD_PLUS: 107,
            NUMPAD_DASH: 109,
            NUMPAD_DOT: 110,
            NUMPAD_SLASH: 111,
            NUMPAD_EQUALS: 187,
            TICK: 192,
            LEFT_BRACKET: 219,
            RIGHT_BRACKET: 221,
            BACKSLASH: 220,
            SEMICOLON: 186,
            APOSTRAPHE: 222,
            APOSTROPHE: 222,
            SPACEBAR: 32,
            CLEAR: 12,
            COMMA: 188,
            DOT: 190,
            SLASH: 191
        }
    }, {}],
    69: [function(e, t, r) {
        "use strict";
        t.exports = {
            clone: e("./clone"),
            create: e("./create"),
            defaults: e("./defaults"),
            extend: e("./extend"),
            getPrototypeOf: e("./getPrototypeOf"),
            isDate: e("./isDate"),
            isEmpty: e("./isEmpty"),
            isRegExp: e("./isRegExp"),
            toQueryParameters: e("./toQueryParameters")
        }
    }, {
        "./clone": 70,
        "./create": 71,
        "./defaults": 72,
        "./extend": 73,
        "./getPrototypeOf": 74,
        "./isDate": 75,
        "./isEmpty": 76,
        "./isRegExp": 77,
        "./toQueryParameters": 78
    }],
    70: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
        };
        e("@marcom/ac-polyfills/Array/isArray");
        var i = e("./extend"),
            o = Object.prototype.hasOwnProperty,
            s = function a(e, t) {
                var r;
                for (r in t) o.call(t, r) && (null === t[r] ? e[r] = null : "object" === n(t[r]) ? (e[r] = Array.isArray(t[r]) ? [] : {}, a(e[r], t[r])) : e[r] = t[r]);
                return e
            };
        t.exports = function(e, t) {
            return t ? s({}, e) : i({}, e)
        }
    }, {
        "./extend": 73,
        "@marcom/ac-polyfills/Array/isArray": void 0
    }],
    71: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = function() {};
        t.exports = function(e) {
            if (arguments.length > 1) throw new Error("Second argument not supported");
            if (null === e || "object" !== ("undefined" == typeof e ? "undefined" : n(e))) throw new TypeError("Object prototype may only be an Object.");
            return "function" == typeof Object.create ? Object.create(e) : (i.prototype = e, new i)
        }
    }, {}],
    72: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = e("./extend");
        t.exports = function(e, t) {
            if ("object" !== ("undefined" == typeof e ? "undefined" : n(e))) throw new TypeError("defaults: must provide a defaults object");
            if (t = t || {}, "object" !== ("undefined" == typeof t ? "undefined" : n(t))) throw new TypeError("defaults: options must be a typeof object");
            return i({}, e, t)
        }
    }, {
        "./extend": 73
    }],
    73: [function(e, t, r) {
        "use strict";
        e("@marcom/ac-polyfills/Array/prototype.forEach");
        var n = Object.prototype.hasOwnProperty;
        t.exports = function() {
            var e, t;
            return e = arguments.length < 2 ? [{}, arguments[0]] : [].slice.call(arguments), t = e.shift(), e.forEach(function(e) {
                if (null != e)
                    for (var r in e) n.call(e, r) && (t[r] = e[r])
            }), t
        }
    }, {
        "@marcom/ac-polyfills/Array/prototype.forEach": void 0
    }],
    74: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = Object.prototype.hasOwnProperty;
        t.exports = function(e) {
            if (Object.getPrototypeOf) return Object.getPrototypeOf(e);
            if ("object" !== ("undefined" == typeof e ? "undefined" : n(e))) throw new Error("Requested prototype of a value that is not an object.");
            if ("object" === n(this.__proto__)) return e.__proto__;
            var t, r = e.constructor;
            if (i.call(e, "constructor")) {
                if (t = r, !delete e.constructor) return null;
                r = e.constructor, e.constructor = t
            }
            return r ? r.prototype : null
        }
    }, {}],
    75: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            return "[object Date]" === Object.prototype.toString.call(e)
        }
    }, {}],
    76: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = Object.prototype.hasOwnProperty;
        t.exports = function(e) {
            var t;
            if ("object" !== ("undefined" == typeof e ? "undefined" : n(e))) throw new TypeError("ac-base.Object.isEmpty : Invalid parameter - expected object");
            for (t in e)
                if (i.call(e, t)) return !1;
            return !0
        }
    }, {}],
    77: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            return !!window.RegExp && e instanceof RegExp
        }
    }, {}],
    78: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = e("@marcom/ac-url/joinSearchParams");
        t.exports = function(e) {
            if ("object" !== ("undefined" == typeof e ? "undefined" : n(e))) throw new TypeError("toQueryParameters error: argument is not an object");
            return i(e, !1)
        }
    }, {
        "@marcom/ac-url/joinSearchParams": 125
    }],
    79: [function(e, t, r) {
        "use strict";
        var n = e("./utils/eventTypeAvailable"),
            i = e("./shared/camelCasedEventTypes"),
            o = e("./shared/windowFallbackEventTypes"),
            s = e("./shared/prefixHelper"),
            a = {};
        t.exports = function u(e, t) {
            var r, c, l;
            if (t = t || "div", e = e.toLowerCase(), t in a || (a[t] = {}), c = a[t], e in c) return c[e];
            if (n(e, t)) return c[e] = e;
            if (e in i)
                for (l = 0; l < i[e].length; l++)
                    if (r = i[e][l], n(r.toLowerCase(), t)) return c[e] = r;
            for (l = 0; l < s.evt.length; l++)
                if (r = s.evt[l] + e, n(r, t)) return s.reduce(l), c[e] = r;
            return "window" !== t && o.indexOf(e) ? c[e] = u(e, "window") : c[e] = !1
        }
    }, {
        "./shared/camelCasedEventTypes": 80,
        "./shared/prefixHelper": 81,
        "./shared/windowFallbackEventTypes": 82,
        "./utils/eventTypeAvailable": 83
    }],
    80: [function(e, t, r) {
        "use strict";
        t.exports = {
            transitionend: ["webkitTransitionEnd", "MSTransitionEnd"],
            animationstart: ["webkitAnimationStart", "MSAnimationStart"],
            animationend: ["webkitAnimationEnd", "MSAnimationEnd"],
            animationiteration: ["webkitAnimationIteration", "MSAnimationIteration"],
            fullscreenchange: ["MSFullscreenChange"],
            fullscreenerror: ["MSFullscreenError"]
        }
    }, {}],
    81: [function(e, t, r) {
        "use strict";
        var n = ["-webkit-", "-moz-", "-ms-"],
            i = ["Webkit", "Moz", "ms"],
            o = ["webkit", "moz", "ms"],
            s = function() {
                this.initialize()
            },
            a = s.prototype;
        a.initialize = function() {
            this.reduced = !1, this.css = n, this.dom = i, this.evt = o
        }, a.reduce = function(e) {
            this.reduced || (this.reduced = !0, this.css = [this.css[e]], this.dom = [this.dom[e]], this.evt = [this.evt[e]])
        }, t.exports = new s
    }, {}],
    82: [function(e, t, r) {
        "use strict";
        t.exports = ["transitionend", "animationstart", "animationend", "animationiteration"]
    }, {}],
    83: [function(e, t, r) {
        "use strict";
        var n = {
            window: window,
            document: document
        };
        t.exports = function(e, t) {
            var r;
            return e = "on" + e, t in n || (n[t] = document.createElement(t)), r = n[t], e in r || "setAttribute" in r && (r.setAttribute(e, "return;"), "function" == typeof r[e])
        }
    }, {}],
    84: [function(e, t, r) {
        "use strict";

        function n(e) {
            e = e || {}, o.call(this), this.id = a.getNewID(), this.executor = e.executor || s, this._reset(), this._willRun = !1, this._didDestroy = !1
        }
        var i, o = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = e("@marcom/ac-raf-executor/sharedRAFExecutorInstance"),
            a = e("@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance");
        i = n.prototype = Object.create(o.prototype), i.run = function() {
            return this._willRun || (this._willRun = !0), this._subscribe()
        }, i.cancel = function() {
            this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
        }, i.destroy = function() {
            var e = this.willRun();
            return this.cancel(), this.executor = null, o.prototype.destroy.call(this), this._didDestroy = !0, e
        }, i.willRun = function() {
            return this._willRun
        }, i.isRunning = function() {
            return this._isRunning
        }, i._subscribe = function() {
            return this.executor.subscribe(this)
        }, i._unsubscribe = function() {
            return this.executor.unsubscribe(this)
        }, i._onAnimationFrameStart = function(e) {
            this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", e))
        }, i._onAnimationFrameEnd = function(e) {
            this._willRun || (this.trigger("stop", e), this._reset())
        }, i._reset = function() {
            this._didEmitFrameData = !1, this._isRunning = !1
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-raf-emitter-id-generator/sharedRAFEmitterIDGeneratorInstance": 97,
        "@marcom/ac-raf-executor/sharedRAFExecutorInstance": 91
    }],
    85: [function(e, t, r) {
        "use strict";
        var n = e("./SingleCallRAFEmitter"),
            i = function(e) {
                this.rafEmitter = new n, this.rafEmitter.on(e, this._onRAFExecuted.bind(this)), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._frameCallbacks = [], this._nextFrameCallbacks = [], this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
            },
            o = i.prototype;
        o.requestAnimationFrame = function(e) {
            return this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, e), this._nextFrameCallbacksLength += 2, this._currentFrameID
        }, o.cancelAnimationFrame = function(e) {
            this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(e), this._cancelFrameIdx !== -1 && (this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel())
        }, o._onRAFExecuted = function(e) {
            for (this._frameCallbacks = this._nextFrameCallbacks, this._frameCallbackLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks = [], this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](e.time, e)
        }, t.exports = i
    }, {
        "./SingleCallRAFEmitter": 87
    }],
    86: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterface"),
            i = function() {
                this.events = {}
            },
            o = i.prototype;
        o.requestAnimationFrame = function(e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].requestAnimationFrame
        }, o.cancelAnimationFrame = function(e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].cancelAnimationFrame
        }, t.exports = new i
    }, {
        "./RAFInterface": 85
    }],
    87: [function(e, t, r) {
        "use strict";
        var n = e("./RAFEmitter"),
            i = function(e) {
                n.call(this, e)
            },
            o = i.prototype = Object.create(n.prototype);
        o._subscribe = function() {
            return this.executor.subscribe(this, !0)
        }, t.exports = i
    }, {
        "./RAFEmitter": 84
    }],
    88: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 86
    }],
    89: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 86
    }],
    90: [function(e, t, r) {
        "use strict";

        function n(e) {
            e = e || {}, this._reset(), this._willRun = !1, this._totalSubscribeCount = -1, this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
        }
        e("@marcom/ac-polyfills/performance/now");
        var i;
        i = n.prototype, i.subscribe = function(e, t) {
            return this._totalSubscribeCount++, this._nextFrameSubscribers[e.id] || (t ? this._nextFrameSubscribersOrder.unshift(e.id) : this._nextFrameSubscribersOrder.push(e.id), this._nextFrameSubscribers[e.id] = e, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
        }, i.unsubscribe = function(e) {
            return !!this._nextFrameSubscribers[e.id] && (this._nextFrameSubscribers[e.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
        }, i.trigger = function(e, t) {
            var r;
            for (r = 0; r < this._subscriberArrayLength; r++) null !== this._subscribers[this._subscribersOrder[r]] && this._subscribers[this._subscribersOrder[r]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[r]].trigger(e, t)
        }, i.destroy = function() {
            var e = this._cancel();
            return this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, e
        }, i.useExternalAnimationFrame = function(e) {
            if ("boolean" == typeof e) {
                var t = this._isUsingExternalAnimationFrame;
                return e && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || e || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = e, e ? this._boundOnExternalAnimationFrame : t || !1
            }
        }, i._run = function() {
            if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), !0
        }, i._cancel = function() {
            var e = !1;
            return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, e = !0), this._isRunning || this._reset(), e
        }, i._onSubscribersAnimationFrameStart = function(e) {
            var t;
            for (t = 0; t < this._subscriberArrayLength; t++) null !== this._subscribers[this._subscribersOrder[t]] && this._subscribers[this._subscribersOrder[t]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[t]]._onAnimationFrameStart(e)
        }, i._onSubscribersAnimationFrameEnd = function(e) {
            var t;
            for (t = 0; t < this._subscriberArrayLength; t++) null !== this._subscribers[this._subscribersOrder[t]] && this._subscribers[this._subscribersOrder[t]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[t]]._onAnimationFrameEnd(e)
        }, i._onAnimationFrame = function(e) {
            this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder, this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = e - this.lastFrameTime, this.lastFrameTime = e, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = e, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this._onSubscribersAnimationFrameStart(this._rafData), this.trigger("update", this._rafData), this.trigger("external", this._rafData), this.trigger("draw", this._rafData), this._onSubscribersAnimationFrameEnd(this._rafData), this._willRun || this._reset()
        }, i._onExternalAnimationFrame = function(e) {
            this._isUsingExternalAnimationFrame && this._onAnimationFrame(e)
        }, i._reset = function() {
            this._rafData = {
                time: 0,
                delta: 0,
                fps: 0,
                naturalFps: 0,
                timeNow: 0
            }, this._subscribers = {}, this._subscribersOrder = [], this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0
        }, t.exports = n
    }, {
        "@marcom/ac-polyfills/performance/now": void 0
    }],
    91: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            i = "ac-raf-executor:sharedRAFExecutorInstance",
            o = "2.0.1",
            s = e("./RAFExecutor");
        t.exports = n.share(i, o, s)
    }, {
        "./RAFExecutor": 90,
        "@marcom/ac-shared-instance": 117
    }],
    92: [function(e, t, r) {
        "use strict";

        function n(e) {
            s.call(this), this.options = i(c, e), this.loadingOptions = null, this.els = [], this.loadingQueue = null, this._queueItems = [], this._queueItemsObj = {}, this._loadOrder = [], this._timeout = null, this._didCallLoad = !1
        }
        var i = e("@marcom/ac-object/defaults"),
            o = e("@marcom/ac-queue").LiveQueue,
            s = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            a = e("@marcom/ac-raf-emitter/update"),
            u = e("@marcom/ac-raf-emitter/draw"),
            c = {
                container: document.body,
                includeContainer: !1
            },
            l = {
                loadingPoolSize: 8,
                timeout: null,
                imageDataAttribute: "data-progressive-image",
                imageAnimate: !0,
                imageAnimateClass: "progressive-image-animated"
            };
        n.Events = {
            ImageLoad: "image-load",
            Complete: "complete"
        };
        var h = n.prototype = Object.create(s.prototype);
        h.load = function(e) {
            this._didCallLoad || (this._didCallLoad = !0, this.loadingOptions = i(l, e), this.loadingQueue = new o(this.loadingOptions.loadingPoolSize), this.els = Array.from(this._getProgressiveImageElements()), this.options.includeContainer && this.options.container.hasAttribute(this._getProgressiveImageDataAttribute()) && this.els.unshift(this.options.container), u(function() {
                var e, t, r = this.els.length;
                for (e = 0; e < r; e++) t = {
                    queueItem: this.loadingQueue.enqueue(this._loadNextItem.bind(this, e), e),
                    el: this.els[e],
                    id: e
                }, this._queueItems.push(t), this._queueItemsObj[e] = t, this.loadingOptions.imageAnimate && this.els[e].classList.add(this.loadingOptions.imageAnimateClass);
                a(function() {
                    this.loadingQueue.start(), "number" == typeof this.loadingOptions.timeout && (this._timeout = setTimeout(this.cancel.bind(this), this.loadingOptions.timeout))
                }.bind(this))
            }.bind(this)))
        }, h.setVisible = function(e) {
            return new Promise(function(t, r) {
                u(function() {
                    e.removeAttribute(this._getProgressiveImageDataAttribute()), t(), e = null
                }.bind(this))
            }.bind(this))
        }, h.cancel = function() {
            if (this.els) {
                var e, t = this.els.length;
                for (e = 0; e < t; e++) this.setVisible(this.els[e]), this.loadingOptions.imageAnimate && u(function() {
                    this.els[e].setAttribute("data-progressive-image-loaded", "")
                }.bind(this, e))
            }
            this._handleLoadingComplete()
        }, h.destroy = function() {
            this.cancel(), this.off(), s.prototype.destroy.call(this)
        }, h._loadNextItem = function(e) {
            return new Promise(function(e, t, r) {
                var n = this._queueItemsObj[e];
                this._loadAndSetVisible(n.el).then(function() {
                    var e = this._queueItems.indexOf(n);
                    this._queueItems.splice(e, 1), this._queueItemsObj[n.id] = null, t(), this._handleImageLoad(n.el), n = t = null, 1 === this.loadingQueue.count() && this._handleLoadingComplete()
                }.bind(this))
            }.bind(this, e))
        }, h._loadAndSetVisible = function(e) {
            return new Promise(function(t, r) {
                this.setVisible(e).then(function() {
                    this._getBackgroundImageSrc(e).then(function(r) {
                        this._loadImage(r).then(t), e = null
                    }.bind(this))
                }.bind(this))
            }.bind(this))
        }, h._getBackgroundImageSrc = function(e) {
            return new Promise(function(t, r) {
                a(function() {
                    var r = e.currentStyle;
                    return r || (r = window.getComputedStyle(e, !1)), e = null, 0 === r.backgroundImage.indexOf("url(") ? void t(r.backgroundImage.slice(4, -1).replace(/"/g, "")) : void t(null)
                }.bind(this))
            }.bind(this))
        }, h._getProgressiveImageDataAttribute = function() {
            return this.loadingOptions.imageDataAttribute
        }, h._getProgressiveImageCSSQuery = function() {
            return "[" + this._getProgressiveImageDataAttribute() + "]"
        }, h._getProgressiveImageElements = function() {
            return this.options.container.querySelectorAll(this._getProgressiveImageCSSQuery()) || []
        }, h._loadImage = function(e) {
            return new Promise(this._loadImagePromiseFunc.bind(this, e))
        }, h._loadImagePromiseFunc = function(e, t, r) {
            function n() {
                this.removeEventListener("load", n), t(this), t = null
            }
            if (!e) return void t(null);
            var i = new Image;
            i.addEventListener("load", n), i.src = e
        }, h._clearTimeout = function() {
            this._timeout && (window.clearTimeout(this._timeout), this._timeout = null)
        }, h._handleImageLoad = function(e) {
            u(function() {
                this.trigger(n.Events.ImageLoad, e), this.loadingOptions.imageAnimate && e.setAttribute("data-progressive-image-loaded", ""), e = null
            }.bind(this))
        }, h._handleLoadingComplete = function() {
            this.loadingQueue.stop(), this._clearTimeout(), this.trigger(n.Events.Complete)
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-object/defaults": 72,
        "@marcom/ac-queue": 93,
        "@marcom/ac-raf-emitter/draw": 88,
        "@marcom/ac-raf-emitter/update": 89
    }],
    93: [function(e, t, r) {
        "use strict";
        t.exports = {
            Queue: e("./ac-queue/Queue"),
            QueueItem: e("./ac-queue/QueueItem"),
            LiveQueue: e("./ac-queue/LiveQueue")
        }
    }, {
        "./ac-queue/LiveQueue": 94,
        "./ac-queue/Queue": 95,
        "./ac-queue/QueueItem": 96
    }],
    94: [function(e, t, r) {
        "use strict";

        function n(e) {
            this._queue = new i, this._maxProcesses = e || 1, this._availableSlots = this._maxProcesses, this._rafId = 0, this._isRunning = !1, this._boundFunctions = {
                _run: this._run.bind(this),
                _releaseSlot: this._releaseSlot.bind(this)
            }
        }
        e("@marcom/ac-polyfills/Promise"), e("@marcom/ac-polyfills/requestAnimationFrame"), e("https://www.apple.com/v/ios/ios-13/b/built/scripts/@marcom/ac-polyfills/Function/prototype.bind");
        var i = e("./Queue"),
            o = e("./QueueItem"),
            s = n.prototype;
        s.start = function() {
            this._isRunning && cancelAnimationFrame(this._rafId), this._rafId = requestAnimationFrame(this._boundFunctions._run), this._isRunning = !0
        }, s.pause = function() {
            this._isRunning && (cancelAnimationFrame(this._rafId), this._rafId = 0), this._isRunning = !1
        }, s.stop = function() {
            this.pause(), this.clear()
        }, s.enqueue = function(e, t) {
            if ("function" != typeof e) throw new Error("LiveQueue can only enqueue functions");
            void 0 === t && (t = i.PRIORITY_DEFAULT);
            var r = new o(e, t);
            return this.enqueueQueueItem(r)
        }, s.enqueueQueueItem = function(e) {
            return this._queue.enqueueQueueItem(e), this._isRunning && 0 === this._rafId && this.start(), e
        }, s.dequeueQueueItem = function(e) {
            return this._queue.dequeueQueueItem(e)
        }, s.clear = function() {
            this._queue = new i
        }, s.destroy = function() {
            this.pause(), this._isRunning = !1, this._queue = null, this._boundFunctions = null
        }, s.count = function() {
            return this._queue.count() + this.pending()
        }, s.pending = function() {
            return this._maxProcesses - this._availableSlots
        }, s.isEmpty = function() {
            return 0 === this.count()
        }, s._run = function() {
            if (this._isRunning && (this._rafId = requestAnimationFrame(this._boundFunctions._run), !this._queue.isEmpty() && 0 !== this._availableSlots)) {
                var e = this._queue.dequeue(),
                    t = e.data();
                this._isPromise(t) && (this._retainSlot(), t.then(this._boundFunctions._releaseSlot, this._boundFunctions._releaseSlot)), this._stopRunningIfDone()
            }
        }, s._retainSlot = function() {
            this._availableSlots--
        }, s._releaseSlot = function() {
            this._availableSlots++, this._stopRunningIfDone()
        }, s._stopRunningIfDone = function() {
            0 != this._rafId && 0 === this._queue.count() && this._availableSlots == this._maxProcesses && (cancelAnimationFrame(this._rafId), this._rafId = 0)
        }, s._isPromise = function(e) {
            return !(!e || "function" != typeof e.then)
        }, t.exports = n
    }, {
        "./Queue": 95,
        "./QueueItem": 96,
        "https://www.apple.com/v/ios/ios-13/b/built/scripts/@marcom/ac-polyfills/Function/prototype.bind": void 0,
        "@marcom/ac-polyfills/Promise": void 0,
        "@marcom/ac-polyfills/requestAnimationFrame": void 0
    }],
    95: [function(e, t, r) {
        "use strict";

        function n() {
            this._items = []
        }
        var i = e("./QueueItem"),
            o = n.prototype;
        o.enqueue = function(e, t) {
            void 0 === t && (t = n.PRIORITY_DEFAULT);
            var r = new i(e, t);
            return this.enqueueQueueItem(r)
        }, o.enqueueQueueItem = function(e) {
            return this._items.indexOf(e) === -1 && this._items.push(e), e
        }, o.dequeue = function() {
            this._heapSort();
            var e = this._items.length - 1,
                t = this._items[0];
            return this._items[0] = this._items[e], this._items.pop(), t
        }, o.dequeueQueueItem = function(e) {
            var t = this._items.indexOf(e);
            return t > -1 && this._items.splice(t, 1), e
        }, o.peek = function() {
            return 0 == this.count() ? null : (this._heapSort(), this._items[0])
        }, o.isEmpty = function() {
            return 0 === this._items.length
        }, o.count = function() {
            return this._items.length
        }, o.toString = function() {
            for (var e = ["Queue total items: " + this.count() + "\n"], t = 0; t < this.count(); ++t) e.push(this._items[t].toString() + "\n");
            return e.join("")
        }, o._heapSort = function() {
            for (var e = 0, t = this._items.length - 1; t >= 0; t--)
                for (var r = t; r > 0;) {
                    e++;
                    var n = Math.floor((r - 1) / 2);
                    if (this._items[r].compareTo(this._items[n]) >= 0) break;
                    var i = this._items[r];
                    this._items[r] = this._items[n], this._items[n] = i, r = n
                }
        }, n.PRIORITY_LOW = 10, n.PRIORITY_DEFAULT = 5, n.PRIORITY_HIGH = 1, t.exports = n
    }, {
        "./QueueItem": 96
    }],
    96: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            this.priority = t, this.data = e, this.insertionOrder = i++
        }
        var i = 0,
            o = n.prototype;
        o.compareTo = function(e) {
            return this.priority < e.priority ? -1 : this.priority > e.priority ? 1 : this.insertionOrder < e.insertionOrder ? -1 : 1
        }, o.toString = function() {
            return "QueueItem {priority:" + this.priority + ",\tdata:" + this.data + "\tinsertionOrder:" + this.insertionOrder + "}"
        }, t.exports = n
    }, {}],
    97: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            i = "ac-raf-emitter-id-generator:sharedRAFEmitterIDGeneratorInstance",
            o = "1.0.3",
            s = function() {
                this._currentID = 0
            };
        s.prototype.getNewID = function() {
            return this._currentID++, "raf:" + this._currentID
        }, t.exports = n.share(i, o, s)
    }, {
        "@marcom/ac-shared-instance": 117
    }],
    98: [function(e, t, r) {
        "use strict";
        t.exports = {
            majorVersionNumber: "3.x"
        }
    }, {}],
    99: [function(e, t, r) {
        "use strict";

        function n(e) {
            e = e || {}, o.call(this), this.id = a.getNewID(), this.executor = e.executor || s, this._reset(), this._willRun = !1, this._didDestroy = !1
        }
        var i, o = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            s = e("./sharedRAFExecutorInstance"),
            a = e("./sharedRAFEmitterIDGeneratorInstance");
        i = n.prototype = Object.create(o.prototype), i.run = function() {
            return this._willRun || (this._willRun = !0), this._subscribe()
        }, i.cancel = function() {
            this._unsubscribe(), this._willRun && (this._willRun = !1), this._reset()
        }, i.destroy = function() {
            var e = this.willRun();
            return this.cancel(), this.executor = null, o.prototype.destroy.call(this), this._didDestroy = !0, e
        }, i.willRun = function() {
            return this._willRun
        }, i.isRunning = function() {
            return this._isRunning
        }, i._subscribe = function() {
            return this.executor.subscribe(this)
        }, i._unsubscribe = function() {
            return this.executor.unsubscribe(this)
        }, i._onAnimationFrameStart = function(e) {
            this._isRunning = !0, this._willRun = !1, this._didEmitFrameData || (this._didEmitFrameData = !0, this.trigger("start", e))
        }, i._onAnimationFrameEnd = function(e) {
            this._willRun || (this.trigger("stop", e), this._reset())
        }, i._reset = function() {
            this._didEmitFrameData = !1, this._isRunning = !1
        }, t.exports = n
    }, {
        "./sharedRAFEmitterIDGeneratorInstance": 107,
        "./sharedRAFExecutorInstance": 108,
        "@marcom/ac-event-emitter-micro": 55
    }],
    100: [function(e, t, r) {
        "use strict";

        function n(e) {
            e = e || {}, this._reset(), this.updatePhases(), this.eventEmitter = new o, this._willRun = !1, this._totalSubscribeCount = -1, this._requestAnimationFrame = window.requestAnimationFrame, this._cancelAnimationFrame = window.cancelAnimationFrame, this._boundOnAnimationFrame = this._onAnimationFrame.bind(this), this._boundOnExternalAnimationFrame = this._onExternalAnimationFrame.bind(this)
        }
        var i, o = e("@marcom/ac-event-emitter-micro/EventEmitterMicro");
        i = n.prototype, i.frameRequestedPhase = "requested", i.startPhase = "start", i.runPhases = ["update", "external", "draw"], i.endPhase = "end", i.disabledPhase = "disabled", i.beforePhaseEventPrefix = "before:", i.afterPhaseEventPrefix = "after:", i.subscribe = function(e, t) {
            return this._totalSubscribeCount++, this._nextFrameSubscribers[e.id] || (t ? this._nextFrameSubscribersOrder.unshift(e.id) : this._nextFrameSubscribersOrder.push(e.id), this._nextFrameSubscribers[e.id] = e, this._nextFrameSubscriberArrayLength++, this._nextFrameSubscriberCount++, this._run()), this._totalSubscribeCount
        }, i.subscribeImmediate = function(e, t) {
            return this._totalSubscribeCount++, this._subscribers[e.id] || (t ? this._subscribersOrder.splice(this._currentSubscriberIndex + 1, 0, e.id) : this._subscribersOrder.unshift(e.id), this._subscribers[e.id] = e, this._subscriberArrayLength++, this._subscriberCount++), this._totalSubscribeCount
        }, i.unsubscribe = function(e) {
            return !!this._nextFrameSubscribers[e.id] && (this._nextFrameSubscribers[e.id] = null, this._nextFrameSubscriberCount--, 0 === this._nextFrameSubscriberCount && this._cancel(), !0)
        }, i.getSubscribeID = function() {
            return this._totalSubscribeCount += 1
        }, i.destroy = function() {
            var e = this._cancel();
            return this.eventEmitter.destroy(), this.eventEmitter = null, this.phases = null, this._subscribers = null, this._subscribersOrder = null, this._nextFrameSubscribers = null, this._nextFrameSubscribersOrder = null, this._rafData = null, this._boundOnAnimationFrame = null, this._onExternalAnimationFrame = null, e
        }, i.useExternalAnimationFrame = function(e) {
            if ("boolean" == typeof e) {
                var t = this._isUsingExternalAnimationFrame;
                return e && this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), !this._willRun || e || this._animationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this._isUsingExternalAnimationFrame = e, e ? this._boundOnExternalAnimationFrame : t || !1
            }
        }, i.updatePhases = function() {
            this.phases || (this.phases = []), this.phases.length = 0, this.phases.push(this.frameRequestedPhase), this.phases.push(this.startPhase), Array.prototype.push.apply(this.phases, this.runPhases), this.phases.push(this.endPhase), this._runPhasesLength = this.runPhases.length, this._phasesLength = this.phases.length
        }, i._run = function() {
            if (!this._willRun) return this._willRun = !0, 0 === this.lastFrameTime && (this.lastFrameTime = performance.now()), this._animationFrameActive = !0, this._isUsingExternalAnimationFrame || (this._animationFrame = this._requestAnimationFrame.call(window, this._boundOnAnimationFrame)), this.phase === this.disabledPhase && (this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex]), !0
        }, i._cancel = function() {
            var e = !1;
            return this._animationFrameActive && (this._animationFrame && (this._cancelAnimationFrame.call(window, this._animationFrame), this._animationFrame = null), this._animationFrameActive = !1, this._willRun = !1, e = !0), this._isRunning || this._reset(), e
        }, i._onAnimationFrame = function(e) {
            for (this._subscribers = this._nextFrameSubscribers, this._subscribersOrder = this._nextFrameSubscribersOrder, this._subscriberArrayLength = this._nextFrameSubscriberArrayLength, this._subscriberCount = this._nextFrameSubscriberCount, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this.phaseIndex = 0, this.phase = this.phases[this.phaseIndex], this._isRunning = !0, this._willRun = !1, this._didRequestNextRAF = !1, this._rafData.delta = e - this.lastFrameTime, this.lastFrameTime = e, this._rafData.fps = 0, this._rafData.delta >= 1e3 && (this._rafData.delta = 0), 0 !== this._rafData.delta && (this._rafData.fps = 1e3 / this._rafData.delta), this._rafData.time = e, this._rafData.naturalFps = this._rafData.fps, this._rafData.timeNow = Date.now(), this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameStart(this._rafData);
            for (this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._runPhaseIndex = 0; this._runPhaseIndex < this._runPhasesLength; this._runPhaseIndex++) {
                for (this.phaseIndex++,
                    this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]].trigger(this.phase, this._rafData);
                this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase)
            }
            for (this.phaseIndex++, this.phase = this.phases[this.phaseIndex], this.eventEmitter.trigger(this.beforePhaseEventPrefix + this.phase), this._currentSubscriberIndex = 0; this._currentSubscriberIndex < this._subscriberArrayLength; this._currentSubscriberIndex++) null !== this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]] && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._didDestroy === !1 && this._subscribers[this._subscribersOrder[this._currentSubscriberIndex]]._onAnimationFrameEnd(this._rafData);
            this.eventEmitter.trigger(this.afterPhaseEventPrefix + this.phase), this._willRun ? (this.phaseIndex = 0, this.phaseIndex = this.phases[this.phaseIndex]) : this._reset()
        }, i._onExternalAnimationFrame = function(e) {
            this._isUsingExternalAnimationFrame && this._onAnimationFrame(e)
        }, i._reset = function() {
            this._rafData || (this._rafData = {}), this._rafData.time = 0, this._rafData.delta = 0, this._rafData.fps = 0, this._rafData.naturalFps = 0, this._rafData.timeNow = 0, this._subscribers = {}, this._subscribersOrder = [], this._currentSubscriberIndex = -1, this._subscriberArrayLength = 0, this._subscriberCount = 0, this._nextFrameSubscribers = {}, this._nextFrameSubscribersOrder = [], this._nextFrameSubscriberArrayLength = 0, this._nextFrameSubscriberCount = 0, this._didEmitFrameData = !1, this._animationFrame = null, this._animationFrameActive = !1, this._isRunning = !1, this._shouldReset = !1, this.lastFrameTime = 0, this._runPhaseIndex = -1, this.phaseIndex = -1, this.phase = this.disabledPhase
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro/EventEmitterMicro": 56
    }],
    101: [function(e, t, r) {
        "use strict";
        var n = e("./SingleCallRAFEmitter"),
            i = function(e) {
                this.phase = e, this.rafEmitter = new n, this._cachePhaseIndex(), this.requestAnimationFrame = this.requestAnimationFrame.bind(this), this.cancelAnimationFrame = this.cancelAnimationFrame.bind(this), this._onBeforeRAFExecutorStart = this._onBeforeRAFExecutorStart.bind(this), this._onBeforeRAFExecutorPhase = this._onBeforeRAFExecutorPhase.bind(this), this._onAfterRAFExecutorPhase = this._onAfterRAFExecutorPhase.bind(this), this.rafEmitter.on(this.phase, this._onRAFExecuted.bind(this)), this.rafEmitter.executor.eventEmitter.on("before:start", this._onBeforeRAFExecutorStart), this.rafEmitter.executor.eventEmitter.on("before:" + this.phase, this._onBeforeRAFExecutorPhase), this.rafEmitter.executor.eventEmitter.on("after:" + this.phase, this._onAfterRAFExecutorPhase), this._frameCallbacks = [], this._currentFrameCallbacks = [], this._nextFrameCallbacks = [], this._phaseActive = !1, this._currentFrameID = -1, this._cancelFrameIdx = -1, this._frameCallbackLength = 0, this._currentFrameCallbacksLength = 0, this._nextFrameCallbacksLength = 0, this._frameCallbackIteration = 0
            },
            o = i.prototype;
        o.requestAnimationFrame = function(e, t) {
            return t === !0 && this.rafEmitter.executor.phaseIndex > 0 && this.rafEmitter.executor.phaseIndex <= this.phaseIndex ? this._phaseActive ? (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !0), this._frameCallbacks.push(this._currentFrameID, e), this._frameCallbackLength += 2) : (this._currentFrameID = this.rafEmitter.executor.subscribeImmediate(this.rafEmitter, !1), this._currentFrameCallbacks.push(this._currentFrameID, e), this._currentFrameCallbacksLength += 2) : (this._currentFrameID = this.rafEmitter.run(), this._nextFrameCallbacks.push(this._currentFrameID, e), this._nextFrameCallbacksLength += 2), this._currentFrameID
        }, o.cancelAnimationFrame = function(e) {
            this._cancelFrameIdx = this._nextFrameCallbacks.indexOf(e), this._cancelFrameIdx > -1 ? this._cancelNextAnimationFrame() : (this._cancelFrameIdx = this._currentFrameCallbacks.indexOf(e), this._cancelFrameIdx > -1 ? this._cancelCurrentAnimationFrame() : (this._cancelFrameIdx = this._frameCallbacks.indexOf(e), this._cancelFrameIdx > -1 && this._cancelRunningAnimationFrame()))
        }, o._onRAFExecuted = function(e) {
            for (this._frameCallbackIteration = 0; this._frameCallbackIteration < this._frameCallbackLength; this._frameCallbackIteration += 2) this._frameCallbacks[this._frameCallbackIteration + 1](e.time, e);
            this._frameCallbacks.length = 0, this._frameCallbackLength = 0
        }, o._onBeforeRAFExecutorStart = function() {
            Array.prototype.push.apply(this._currentFrameCallbacks, this._nextFrameCallbacks.splice(0, this._nextFrameCallbacksLength)), this._currentFrameCallbacksLength = this._nextFrameCallbacksLength, this._nextFrameCallbacks.length = 0, this._nextFrameCallbacksLength = 0
        }, o._onBeforeRAFExecutorPhase = function() {
            this._phaseActive = !0, Array.prototype.push.apply(this._frameCallbacks, this._currentFrameCallbacks.splice(0, this._currentFrameCallbacksLength)), this._frameCallbackLength = this._currentFrameCallbacksLength, this._currentFrameCallbacks.length = 0, this._currentFrameCallbacksLength = 0
        }, o._onAfterRAFExecutorPhase = function() {
            this._phaseActive = !1
        }, o._cachePhaseIndex = function() {
            this.phaseIndex = this.rafEmitter.executor.phases.indexOf(this.phase)
        }, o._cancelRunningAnimationFrame = function() {
            this._frameCallbacks.splice(this._cancelFrameIdx, 2), this._frameCallbackLength -= 2
        }, o._cancelCurrentAnimationFrame = function() {
            this._currentFrameCallbacks.splice(this._cancelFrameIdx, 2), this._currentFrameCallbacksLength -= 2
        }, o._cancelNextAnimationFrame = function() {
            this._nextFrameCallbacks.splice(this._cancelFrameIdx, 2), this._nextFrameCallbacksLength -= 2, 0 === this._nextFrameCallbacksLength && this.rafEmitter.cancel()
        }, t.exports = i
    }, {
        "./SingleCallRAFEmitter": 103
    }],
    102: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterface"),
            i = function() {
                this.events = {}
            },
            o = i.prototype;
        o.requestAnimationFrame = function(e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].requestAnimationFrame
        }, o.cancelAnimationFrame = function(e) {
            return this.events[e] || (this.events[e] = new n(e)), this.events[e].cancelAnimationFrame
        }, t.exports = new i
    }, {
        "./RAFInterface": 101
    }],
    103: [function(e, t, r) {
        "use strict";
        var n = e("./RAFEmitter"),
            i = function(e) {
                n.call(this, e)
            },
            o = i.prototype = Object.create(n.prototype);
        o._subscribe = function() {
            return this.executor.subscribe(this, !0)
        }, t.exports = i
    }, {
        "./RAFEmitter": 99
    }],
    104: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.cancelAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 102
    }],
    105: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("draw")
    }, {
        "./RAFInterfaceController": 102
    }],
    106: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("external")
    }, {
        "./RAFInterfaceController": 102
    }],
    107: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            i = e("../.release-info.js").majorVersionNumber,
            o = function() {
                this._currentID = 0
            };
        o.prototype.getNewID = function() {
            return this._currentID++, "raf:" + this._currentID
        }, t.exports = n.share("@marcom/ac-raf-emitter/sharedRAFEmitterIDGeneratorInstance", i, o)
    }, {
        "../.release-info.js": 98,
        "@marcom/ac-shared-instance": 117
    }],
    108: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/ac-shared-instance").SharedInstance,
            i = e("../.release-info.js").majorVersionNumber,
            o = e("./RAFExecutor");
        t.exports = n.share("@marcom/ac-raf-emitter/sharedRAFExecutorInstance", i, o)
    }, {
        "../.release-info.js": 98,
        "./RAFExecutor": 100,
        "@marcom/ac-shared-instance": 117
    }],
    109: [function(e, t, r) {
        "use strict";
        var n = e("./RAFInterfaceController");
        t.exports = n.requestAnimationFrame("update")
    }, {
        "./RAFInterfaceController": 102
    }],
    110: [function(e, t, r) {
        "use strict";
        t.exports = {
            ShaderPlayer2D: e("./ac-shader-player-2d/ShaderPlayer2D")
        }
    }, {
        "./ac-shader-player-2d/ShaderPlayer2D": 113
    }],
    111: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = function(e) {
                this.w = 0, this.x = 0, this.y = 0, this.z = 0, 0 !== e && (Array.isArray(e) ? this._setFromArray(e) : "object" === ("undefined" == typeof e ? "undefined" : n(e)) ? this._setFromObject(e) : "number" == typeof e ? this._setFromHexNumber(e) : "string" == typeof e && this._setFromHexString(e))
            },
            o = i.prototype;
        o._setFromArray = function(e) {
            this._replaceColorVals.apply(this, e)
        }, o._setFromObject = function(e) {
            this._replaceColorVals(e.r, e.g, e.b, e.a)
        }, o._setFromHexNumber = function(e) {
            this._setFromHexString(e.toString(16))
        }, o._setFromHexString = function(e) {
            var t = this._hexToRGB(e);
            this._setFromObject(t)
        }, o._replaceColorVals = function(e, t, r, n) {
            this._replaceColorVal("w", e), this._replaceColorVal("x", t), this._replaceColorVal("y", r), this._replaceColorVal("z", n)
        }, o._replaceColorVal = function(e, t) {
            "undefined" != typeof t && (t /= 255, t < 0 ? t = 0 : t > 1 && (t = 1), this[e] = t)
        }, o._hexToRGB = function(e) {
            var t = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            e = e.replace(t, function(e, t, r, n) {
                return t + t + r + r + n + n
            });
            var r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
            return r ? {
                r: parseInt(r[1], 16),
                g: parseInt(r[2], 16),
                b: parseInt(r[3], 16)
            } : null
        }, t.exports = i
    }, {}],
    112: [function(e, t, r) {
        "use strict";
        var n = function(e) {
                this.extensions = {}, this.context = e
            },
            i = n.prototype;
        i.get = function(e) {
            if ("undefined" != typeof this.extensions[e]) return this.extensions[e];
            var t, r = this.context;
            return t = "EXT_texture_filter_anisotropic" === e ? r.getExtension("EXT_texture_filter_anisotropic") || r.getExtension("MOZ_EXT_texture_filter_anisotropic") || r.getExtension("WEBKIT_EXT_texture_filter_anisotropic") : "WEBGL_compressed_texture_s3tc" === e ? r.getExtension("WEBGL_compressed_texture_s3tc") || r.getExtension("MOZ_WEBGL_compressed_texture_s3tc") || r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc") : "WEBGL_compressed_texture_pvrtc" === e ? r.getExtension("WEBGL_compressed_texture_pvrtc") || r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc") : r.getExtension(e), null === t ? (this.extensions[e] = null, null) : (this.extensions[e] = t, t)
        }, t.exports = n
    }, {}],
    113: [function(e, t, r) {
        "use strict";

        function n(e) {
            c.call(this), this.options = l(m, e || {}), this.clock = e.clock || f, this.className = e.className || this.className, this.activeClassName = e.activeClassName || this.activeClassName, this._currentSize = {}, this._textureController = null, this._texturesReady = !0, this._shouldUpdate = !0, this._progressValue = null, this._renderingReady = !1, this._didBindBreakpoint = !1, this._renderCount = 0, this._didRender = !1, this._textureKeyMap = {}, this._textureValMap = {}, this._textureUpdateMap = {}, this.devicePixelRatio = this._getDevicePixelRatio(), this._breakpointName = this.getCurrentBreakpointName(), this._setBreakpointSizes(), this._boundOnUpdate = this._onUpdate.bind(this), this._boundOnDraw = this._onDraw.bind(this), this.initialize(), this.domEmitter = new p(this.el), this.clock.on("update", this._boundOnUpdate), this.clock.on("draw", this._boundOnDraw), (this._getSizesLength() > 1 || this.options.reloadOnBreakpoint) && (this._didBindBreakpoint = !0, this._boundOnShaderPlayer2DBreakpoint = this._onShaderPlayer2DBreakpoint.bind(this), d.on("breakpoint", this._boundOnShaderPlayer2DBreakpoint)), this._bindDOMEvents()
        }
        var i = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            o = e("./WebGLRenderer"),
            s = e("./Color"),
            a = e("./TextureController"),
            u = e("./vertexShader"),
            c = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            l = e("@marcom/ac-object/defaults"),
            h = e("@marcom/ac-object/clone"),
            f = e("@marcom/ac-clock"),
            p = e("@marcom/ac-dom-emitter").DOMEmitter,
            d = e("@marcom/ac-viewport").Viewport,
            m = {
                sizes: {},
                vertexShader: u,
                antialias: !1,
                preserveDrawingBuffer: !1,
                transparent: !1,
                mipmap: 1,
                reloadOnBreakpoint: !1,
                clearColor: 0,
                autoClearColor: !1,
                allowXLarge: !1,
                backgroundOpacity: 0,
                vertexShadersPath: null,
                fragmentShadersPath: null,
                invertX: !1,
                invertY: !1,
                uniforms: {},
                minFilter: "LINEAR_MIPMAP_LINEAR",
                magFilter: "LINEAR"
            },
            v = {
                update: "update",
                draw: "draw",
                textureLoadStart: "texture-load-start",
                textureReloadStart: "texture-reload-start",
                textureLoad: "texture-load",
                texturesComplete: "textures-complete",
                resize: "resize"
            },
            y = n.prototype = Object.create(c.prototype);
        y.rendersBeforeVisible = 0, y.className = "webgl-object", y.activeClassName = "active", y.initialize = function() {
            this.options.uniforms = this._appendIncludedUniforms(this.options.uniforms), this.renderer = this.createRenderer(), this.options.textures && this._setTextureUniforms(this.options.textures), this._initializeRenderer(), this.el = this.renderer.el, this.el.className = this.className, this.setSize()
        }, y.load = function() {
            this._textureController && (this.trigger(v.textureLoadStart), this._textureController.load())
        }, y.start = function() {
            this.clock.start()
        }, y.stop = function() {
            this.clock.stop()
        }, y.render = function() {
            if (this.renderer && this._texturesReady) {
                if (this._didRender || (this._setInitialUniforms(), this._didRender = !0), this._renderCount++, !this._renderingReady) {
                    if (this._renderCount < this.rendersBeforeVisible) return;
                    this.setActive()
                }
                this.renderer.render(this.scene, this.camera)
            }
        }, y.createRenderer = function() {
            return new o(this, this._getRendererOptions())
        }, y.setClearColor = function(e) {
            e = e || this.options.clearColor, this.options.clearColor = e, this.renderer.setClearColor(this._getClearColor(e))
        }, y.setBackgroundOpacity = function(e) {
            this.options.backgroundOpacity = e, this.setClearColor()
        }, y.setTextureMagFilter = function(e, t) {
            var r = this.getTexture(e);
            return r || "undefined" === this.renderer.context[t] ? (r.texture.magFilter = this.renderer.context[t], !0) : null
        }, y.setTextureMinFilter = function(e, t) {
            var r = this.getTexture(e);
            return r || "undefined" === this.renderer.context[t] ? (r.texture.minFilter = this.renderer.context[t], !0) : null
        }, y.createTextureController = function(e) {
            e = e || {}, this.options.allowXLarge && (e.allowXLarge = !0), this.options.magFilter && (e.magFilter = this.options.magFilter), this.options.minFilter && (e.minFilter = this.options.minFilter), this._textureController = new a(this, e), this._boundOnTextureControllerLoad = this._onTextureControllerLoad.bind(this), this._boundOnTextureControllerComplete = this._onTextureControllerComplete.bind(this), this._boundOnTextureControllerReadyStateChanged = this._onTextureControllerReadyStateChanged.bind(this), this._textureController.on("load", this._boundOnTextureControllerLoad), this._textureController.on("complete", this._boundOnTextureControllerComplete), this._textureController.on("readystatechanged", this._boundOnTextureControllerReadyStateChanged)
        }, y.getSizesForBreakpoint = function(e) {
            return e = e || d.getBreakpoint().name, this.options.sizes[e] || (e = "defaults"), {
                name: e,
                sizes: this.options.sizes[e]
            }
        }, y.getUniform = function(e) {
            return this.renderer ? this.renderer.getUniform(e) : null
        }, y.setUniform = function(e, t) {
            return !!this.renderer && this.renderer.setUniform(e, t)
        }, y.getAttribute = function(e) {
            return this.renderer ? this.renderer.getAttribute(e) : null
        }, y.setAttribute = function(e, t) {
            return !!this.renderer && this.renderer.setAttribute(e, t)
        }, y.setUniforms = function(e) {
            if ("object" !== ("undefined" == typeof e ? "undefined" : i(e))) return !1;
            var t;
            for (t in e) e.hasOwnProperty(t) && this.setUniform(t, e[t])
        }, y.setSize = function(e, t) {
            "undefined" != typeof e && (this.width = e), "undefined" != typeof t && (this.height = t), this._setResolution(), this.renderer && this.renderer.setSize(this.width * this.devicePixelRatio, this.height * this.devicePixelRatio, this.options.mipmap), this.el && (this.el.style.width = this.width + "px", this.el.style.height = this.height + "px")
        }, y.setBasePath = function(e) {
            this._textureController && (this._textureController.options.basePath = e)
        }, y.setActive = function() {
            this.el.classList.add(this.activeClassName), this._renderingReady = !0
        }, y.setInactive = function() {
            this.el.classList.remove(this.activeClassName), this._renderCount = 0, this._renderingReady = !1
        }, y.getTexture = function(e) {
            return this.renderer && this._textureController ? ("undefined" != typeof this._textureKeyMap[e] && (e = this._textureKeyMap[e]), this._textureController.getTexture(e)) : null
        }, y.setTexture = function(e, t) {}, y.getCurrentBreakpointName = function() {
            var e = d.getBreakpoint().name;
            return this.options.allowXLarge || "xlarge" !== e || (e = "large"), e
        }, y.getTextures = function() {
            var e, t = {};
            for (e in this._textureKeyMap) this._textureKeyMap.hasOwnProperty(e) && (t[e] = this.getTexture(e));
            return t
        }, y.getTextureControllerTextures = function() {
            if (!this._textureController) return null;
            var e, t = {},
                r = this._textureController._textureLoader.textures;
            for (e in r) r.hasOwnProperty(e) && (t[e] = r[e].texture);
            return t
        }, y.refreshTexture = function(e) {
            this._textureUpdateMap[e] = !0
        }, y.destroy = function() {
            this.stop(), this._textureController && this._textureController.destroy(), this._didBindBreakpoint && d.off("breakpoint", this._boundOnShaderPlayer2DBreakpoint), this.domEmitter.destroy();
            var e;
            for (e in this) this.hasOwnProperty(e) && (this[e] = null);
            c.prototype.destroy.call(this)
        }, y._onTextureControllerLoad = function(e) {
            this.trigger(v.textureLoad, e)
        }, y._onTextureControllerComplete = function() {
            this._texturesReady = !0, this.trigger(v.texturesComplete)
        }, y._onTextureControllerReadyStateChanged = function(e) {
            this._texturesReady = e.texturesReady
        }, y._setTextureUniforms = function(e) {
            var t, r, n = this.renderer.context;
            for (t in e) e.hasOwnProperty(t) && (r = e[t], this._textureController || this.createTextureController(), this._texturesRequired++, this._textureKeyMap[t] = r.name, this._textureValMap[r.name] = t, this.options.uniforms[t] = {
                type: "sampler2D",
                value: this._textureController.createTexture(n, r.name, r)
            })
        }, y._setTime = function(e) {
            this.setUniform("time", e)
        }, y._setResolution = function() {
            this.setUniform("resolution", [this.width, this.height])
        }, y._setPointer = function(e, t) {
            this.options.invertX && (e = 1 - e), this.options.invertY && (t = 1 - t), this.setUniform("pointer", [e, t])
        }, y._getDevicePixelRatio = function() {
            return this.options.devicePixelRatio ? this.options.devicePixelRatio : window.devicePixelRatio || 1
        }, y._onShaderPlayer2DBreakpoint = function(e) {
            var t = this.getCurrentBreakpointName();
            this._breakpointName !== t && (this._breakpointName = t, this._shouldChangeSize(t) && this._setBreakpointSizes(), this.options.reloadOnBreakpoint && this._textureController && (this._texturesReady = !1, this.setInactive(), this._textureController.load(), this.trigger(v.textureReloadStart)))
        }, y._getSizesLength = function() {
            return Object.keys(this.options.sizes).length
        }, y._shouldChangeSize = function(e) {
            var t = this.getSizesForBreakpoint(e);
            return t.sizes.width !== this._currentSize.sizes.width || t.sizes.height !== this._currentSize.sizes.height
        }, y._setBreakpointSizes = function() {
            var e = this.getSizesForBreakpoint();
            this._currentSize = e, this.setSize(e.sizes.width, e.sizes.height), this.trigger(v.resize)
        }, y._appendIncludedUniforms = function(e) {
            return e = e || {}, e.progress || (e.progress = {
                type: "float",
                value: 0
            }), e.time || (e.time = {
                type: "float",
                value: 0
            }), e.resolution || (e.resolution = {
                type: "vec2",
                value: [this.width, this.height]
            }), e.pointer || (e.pointer = {
                type: "vec2",
                value: [0, 0]
            }), h(e, !0)
        }, y._setInitialUniforms = function() {
            if (this.options && this.options.uniforms) {
                var e;
                for (e in this.options.uniforms) this.options.uniforms.hasOwnProperty(e) && this.setUniform(e, this.options.uniforms[e].value)
            }
        }, y._onUpdate = function(e) {
            this._setTime(e.time), this.trigger(v.update, e)
        }, y._onDraw = function(e) {
            this.render(), this.trigger(v.draw, e)
        }, y._refreshTexture = function(e) {
            var t = this.getTexture(e);
            return t ? void t.texture.setPixels(t.el) : null
        }, y._bindDOMEvents = function() {
            this.domEmitter.on("mousemove", this._handleMouseMove, this), this.domEmitter.on("touchmove", this._handleTouchMove, this)
        }, y._getClearColor = function(e) {
            var t = new s(e);
            return t.z = this.options.backgroundOpacity, t
        }, y._initializeRenderer = function() {
            this.renderer.initialize(this._getRendererOptions())
        }, y._getRendererOptions = function() {
            return {
                clearColor: this._getClearColor(this.options.clearColor),
                transparent: this.options.transparent,
                fragmentShader: this.options.fragmentShader,
                vertexShader: this.options.vertexShader,
                uniforms: this.options.uniforms,
                antialias: this.options.antialias
            }
        }, y._handleMouseMove = function(e) {
            this._setPointer(e.originalEvent.offsetX / this.width, 1 - e.originalEvent.offsetY / this.height)
        }, y._handleTouchMove = function(e) {
            this._setPointer(e.originalEvent.touches[0].offsetX / this.width, 1 - e.originalEvent.touches[0].offsetY / this.height)
        }, t.exports = n
    }, {
        "./Color": 111,
        "./TextureController": 114,
        "./WebGLRenderer": 115,
        "./vertexShader": 116,
        "@marcom/ac-clock": 16,
        "@marcom/ac-dom-emitter": 25,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-object/clone": 70,
        "@marcom/ac-object/defaults": 72,
        "@marcom/ac-viewport": 128
    }],
    114: [function(e, t, r) {
        "use strict";
        var n, i = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("@marcom/ac-object/defaults"),
            s = e("@marcom/ac-texture-loader").TextureLoader,
            a = function(e, t) {
                i.call(this), this.options = t || {}, this.controller = e, this.options.basePath = this.options.basePath || window.location.pathname, this._textureLoader = new s(this.options), this._texturesRequired = 0, this._texturesLoaded = 0, this._textureLoader.on("load", this._handleTextureLoaderLoaded.bind(this))
            };
        n = a.prototype = Object.create(i.prototype), n.createTexture = function(e, t, r) {
            if (this._textureLoader.textures[t]) throw 'Existing texture "' + t + '" already registered.';
            if (!e) throw "Textures require a WebGL context in order to be created.";
            return r = o(this.options, r || {}), this._textureLoader.createTexture(e, t, r), this._texturesRequired++, this.getTexture(t)
        }, n.getTexture = function(e) {
            return this._textureLoader ? this._textureLoader.textures[e] : null
        }, n.load = function(e) {
            if (e = o(this.options, e || {}), this._texturesLoaded = 0, this._textureLoader) {
                var t;
                for (t in this._textureLoader.textures) this._textureLoader.textures.hasOwnProperty(t) && this._textureLoader.load(t, e)
            }
        }, n.destroy = function() {
            this._textureLoader.destroy();
            var e;
            for (e in this) this.hasOwnProperty(e) && (this[e] = null);
            i.prototype.destroy.call(this)
        }, n._handleTextureLoaderLoaded = function(e) {
            if (this.controller && this.controller.renderer) {
                var t = this.controller._textureValMap[e.name],
                    r = e.el.width,
                    n = e.el.height;
                e.el instanceof HTMLVideoElement && (r = e.el.videoWidth, n = e.el.videoHeight), this._isPowerOfTwo(r) && this._isPowerOfTwo(n) ? (e.texture.generateMipmap(), this.options.magFilter && (e.texture.magFilter = e.texture.gl[this.options.magFilter]), this.options.minFilter && (e.texture.minFilter = e.texture.gl[this.options.minFilter])) : (e.texture.magFilter = e.texture.gl.LINEAR, e.texture.minFilter = e.texture.gl.LINEAR, e.texture.wrapT = e.texture.gl.CLAMP_TO_EDGE, e.texture.wrapS = e.texture.gl.CLAMP_TO_EDGE), this.controller.renderer.bindTexture(t)
            }
            this.trigger("load", e), this._texturesLoaded++, this._texturesLoaded === this._texturesRequired && this.trigger("complete")
        }, n._isPowerOfTwo = function(e) {
            return 0 === (e & e - 1)
        }, t.exports = a
    }, {
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-object/defaults": 72,
        "@marcom/ac-texture-loader": 123
    }],
    115: [function(e, t, r) {
        "use strict";
        var n, i = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("./ExtensionsController"),
            s = e("a-big-triangle"),
            a = e("gl-shader-core"),
            u = {
                clearDepth: 1,
                clearColor: [0, 0, 0, 0],
                clearStencil: 0
            },
            c = ["OES_texture_float", "OES_texture_float_linear", "OES_texture_half_float", "OES_texture_half_float_linear", "OES_standard_derivatives"],
            l = function(e, t) {
                i.call(this), this.options = this._initializeOptions(t), this.controller = e;
                var r = document.createElement("canvas"),
                    n = r.getContext("webgl", this.options) || r.getContext("experimental-webgl", this.options);
                return n ? (this.el = r, void(this.context = n)) : (this.trigger("error", "Unable to initialize WebGL"), null)
            };
        n = l.prototype = Object.create(l.prototype), n.initialize = function(e) {
            var t = this.context;
            this.options = this._initializeOptions(e), this._shouldClearColor = !0, this.options._transformedUniforms = this.transformShaderParameters(this.options.uniforms), this.options.attributes && (this.options._transformedAttributes = this.transformShaderParameters(this.options.attributes));
            var r = {};
            r.clearFlags = void 0 === this.options.clearFlags ? t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT : this.options.clearFlags;
            var n;
            for (n in u) u.hasOwnProperty(n) && (r[n] = u[n], "undefined" != typeof this.options[n] && (r[n] = this.options[n]));
            this._renderSettings = r, this.shader = this.createShader(t, this.options.vertexShader, this.options.fragmentShader, this.options._transformedUniforms, this.options._transformedAttributes), t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !0), t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), this.extensions = new o(this.context);
            var i = c.length;
            for (n = 0; n < i; n++) this.extensions.get(c[n]);
            this.bindShader()
        }, n.createShader = function(e, t, r, n, i) {
            var o = this._normalizeShaderParams({
                context: e,
                vertexShader: t,
                fragmentShader: r,
                uniforms: n || [],
                attributes: i || []
            });
            return a(o.context, o.vertexShader, o.fragmentShader, o.uniforms, o.attributes)
        }, n.linkProgram = function(e, t, r) {
            var n = e.createProgram();
            e.attachShader(n, t), e.attachShader(n, r), e.linkProgram(n), e.useProgram(n)
        }, n.bindShader = function() {
            this.shader.bind()
        }, n.bindTextures = function() {
            if (this.controller && this.controller.options && this.controller.options.textures) {
                var e, t = this.controller.options.textures;
                for (e in t) t.hasOwnProperty(e) && this.bindTexture(e)
            }
        }, n.bindTexture = function(e, t) {
            (t || this.controller._textureUpdateMap[e]) && (this.controller._refreshTexture(e), this.controller._textureUpdateMap[e] = !1);
            var r = this.controller.getTexture(e);
            r && (this.shader.uniforms[e] = r.texture.bind(r.unit))
        }, n.setClearColor = function(e) {
            this._renderSettings.clearColor = e, this._shouldClearColor = !0
        }, n.clearColor = function() {
            var e = this.context,
                t = this._renderSettings;
            e.bindFramebuffer(e.FRAMEBUFFER, null), t.clearFlags & e.STENCIL_BUFFER_BIT && e.clearStencil(t.clearStencil), t.clearFlags & e.COLOR_BUFFER_BIT && e.clearColor(t.clearColor.w, t.clearColor.x, t.clearColor.y, t.clearColor.z), t.clearFlags & e.DEPTH_BUFFER_BIT && e.clearDepth(t.clearDepth), t.clearFlags && e.clear(e.COLOR_BUFFER_BIT | e.DEPTH_BUFFER_BIT | e.STENCIL_BUFFER_BIT)
        }, n.render = function() {
            (this.options.autoClearColor || this._shouldClearColor) && (this.clearColor(), this._shouldClearColor = !1), this.bindShader(), this.bindTextures(), s(this.context)
        }, n.updateShader = function(e) {
            e = e || {}, e.uniforms && (e.uniforms = this.transformShaderParameters(e.uniforms)), e.vertexShader = e.vertexShader || this.options.vertexShader, e.fragmentShader = e.fragmentShader || this.options.fragmentShader, e.uniforms = e.uniforms || this.options.uniforms, e.attributes = e.attributes || this.options.attributes, e = this._normalizeShaderParams(e), this.shader.dispose(), this.shader = this.createShader(this.context, e.vertexShader, e.fragmentShader, e.uniforms, e.attributes), this.options.vertexShader = e.vertexShader, this.options.fragmentShader = e.fragmentShader, this.options.uniforms = e.uniforms, this.options.attributes = e.attributes
        }, n.getUniform = function(e) {
            return this._hasUniform(e) ? this.options.uniforms[e].value : null
        }, n.setUniform = function(e, t) {
            this._hasUniform(e) && (this.options.uniforms[e].value = t, this.shader.uniforms[e] = t)
        }, n.getAttribute = function(e, t) {
            return this.shader ? this.shader.attributes[e] : null
        }, n.setAttribute = function(e, t) {
            this.shader && (this.shader.attributes[e] = t)
        }, n.setSize = function(e, t, r) {
            var n = e * r,
                i = t * r;
            this.el.setAttribute("width", n), this.el.setAttribute("height", i), this.el.style.width = e + "px", this.el.style.height = t + "px", this.context.viewport(0, 0, 0 | n, 0 | i)
        }, n.transformShaderParameters = function(e) {
            e = e || {};
            var t, r = [];
            for (t in e) e.hasOwnProperty(t) && r.push({
                name: t,
                type: e[t].type
            });
            return r
        }, n.destroy = function() {
            this.shader.dispose(), i.prototype.destroy.call(this)
        }, n._normalizeShaderParams = function(e) {
            return this.options.setFloatPrecision !== !1 && (e.fragmentShader = "precision highp float;\n" + e.fragmentShader), e
        }, n._initializeOptions = function(e) {
            return e.alpha = e.transparent, e
        }, n._hasUniform = function(e) {
            return this.options || this.options.uniforms || this.options.uniforms[e]
        }, t.exports = l
    }, {
        "./ExtensionsController": 112,
        "@marcom/ac-event-emitter-micro": 55,
        "a-big-triangle": 192,
        "gl-shader-core": 216
    }],
    116: [function(e, t, r) {
        "use strict";
        t.exports = "attribute vec3 position;\t\t\t\t\tvarying vec2 vUV;\t\t\t\t\tvoid main() {\t\t\t\t\t\tgl_Position = vec4(position, 1.0);\t\t\t\t\t\tvUV = position.xy * 0.5 + 0.5;\t\t\t\t\t}"
    }, {}],
    117: [function(e, t, r) {
        "use strict";
        t.exports = {
            SharedInstance: e("./ac-shared-instance/SharedInstance")
        }
    }, {
        "./ac-shared-instance/SharedInstance": 118
    }],
    118: [function(e, t, r) {
        "use strict";
        var n = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            i = window,
            o = "AC",
            s = "SharedInstance",
            a = i[o],
            u = function() {
                var e = {};
                return {
                    get: function(t, r) {
                        var n = null;
                        return e[t] && e[t][r] && (n = e[t][r]), n
                    },
                    set: function(t, r, n) {
                        return e[t] || (e[t] = {}), "function" == typeof n ? e[t][r] = new n : e[t][r] = n, e[t][r]
                    },
                    share: function(e, t, r) {
                        var n = this.get(e, t);
                        return n || (n = this.set(e, t, r)), n
                    },
                    remove: function(t, r) {
                        var i = "undefined" == typeof r ? "undefined" : n(r);
                        if ("string" === i || "number" === i) {
                            if (!e[t] || !e[t][r]) return;
                            return void(e[t][r] = null)
                        }
                        e[t] && (e[t] = null)
                    }
                }
            }();
        a || (a = i[o] = {}), a[s] || (a[s] = u), t.exports = a[s]
    }, {}],
    119: [function(e, t, r) {
        "use strict";
        t.exports = {
            SiriPlayer: e("./ac-siri-player/SiriPlayer")
        }
    }, {
        "./ac-siri-player/SiriPlayer": 120
    }],
    120: [function(e, t, r) {
        "use strict";

        function n(e) {
            e = e || {}, e.uniforms = a(u.uniforms, e.uniforms), e = a(u, e), e.white === !0 && (e.fragmentShader = s), i.call(this, e), this.setUniform("fj", this.getUniform("resolution")), this.on("update", this._updateChangedUniforms.bind(this))
        }
        var i = e("@marcom/ac-shader-player-2d").ShaderPlayer2D,
            o = e("./fragmentShader.js"),
            s = e("./white-fragmentShader.js"),
            a = e("@marcom/ac-object/defaults"),
            u = {
                antialias: !1,
                mipmap: 1,
                alpha: !1,
                transparent: !1,
                fragmentShader: o,
                uniforms: {
                    fw: {
                        type: "float",
                        value: 0
                    },
                    fj: {
                        type: "vec2",
                        value: [0, 0]
                    },
                    ee: {
                        type: "float",
                        value: 1.5
                    },
                    kq: {
                        type: "float",
                        value: 0
                    },
                    et: {
                        type: "float",
                        value: .2
                    },
                    dq: {
                        type: "float",
                        value: 1.5
                    },
                    ww: {
                        type: "float",
                        value: .15
                    },
                    qa: {
                        type: "float",
                        value: .5
                    },
                    te: {
                        type: "float",
                        value: .05
                    },
                    jf: {
                        type: "vec2",
                        value: [0, 0]
                    },
                    qd: {
                        type: "vec2",
                        value: [1, 1]
                    }
                },
                sizes: {
                    defaults: {
                        width: 800,
                        height: 180
                    }
                }
            },
            c = n.prototype = Object.create(i.prototype);
        c._updateChangedUniforms = function(e) {
            this.setUniform("fw", this.getUniform("time") / 1e3), this.setUniform("fj", this.getUniform("resolution"));
            var t = this.getUniform("kq"),
                r = this.getUniform("ee"),
                n = (e.time - this.clock.lastFrameTime) / 1e3,
                i = t + n * r;
            this.setUniform("kq", i)
        }, t.exports = n
    }, {
        "./fragmentShader.js": 121,
        "./white-fragmentShader.js": 122,
        "@marcom/ac-object/defaults": 72,
        "@marcom/ac-shader-player-2d": 110
    }],
    121: [function(e, t, r) {
        "use strict";
        t.exports = "/* * Description : Array and textureless GLSL 2D/3D/4D simplex  *            noise functions. *     Author : Ian McEwan, Ashima Arts. * Maintainer : stegu *   Lastmod : 20110822 (ijm) *   License : Copyright (C) 2011 Ashima Arts. All rights reserved. *             Distributed under the MIT License. See LICENSE file. *             https://github.com/ashima/webgl-noise *             https://github.com/stegu/webgl-noise */vec3 mod289(vec3 x) {  return x - floor(x * (1.0 / 289.0)) * 289.0;}vec4 mod289(vec4 x) {  return x - floor(x * (1.0 / 289.0)) * 289.0;}vec4 permute(vec4 x) {     return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){  return 1.79284291400159 - 0.85373472095314 * r;}float snoise(vec3 v)  {   const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);  vec3 i  = floor(v + dot(v, C.yyy) );  vec3 x0 =   v - i + dot(i, C.xxx) ;  vec3 g = step(x0.yzx, x0.xyz);  vec3 l = 1.0 - g;  vec3 i1 = min( g.xyz, l.zxy );  vec3 i2 = max( g.xyz, l.zxy );  vec3 x1 = x0 - i1 + C.xxx;  vec3 x2 = x0 - i2 + C.yyy;  vec3 x3 = x0 - D.yyy;  i = mod289(i);   vec4 p = permute( permute( permute(              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));  float n_ = 0.142857142857;  vec3  ns = n_ * D.wyz - D.xzx;  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  vec4 x_ = floor(j * ns.z);  vec4 y_ = floor(j - 7.0 * x_ );  vec4 x = x_ *ns.x + ns.yyyy;  vec4 y = y_ *ns.x + ns.yyyy;  vec4 h = 1.0 - abs(x) - abs(y);  vec4 b0 = vec4( x.xy, y.xy );  vec4 b1 = vec4( x.zw, y.zw );  vec4 s0 = floor(b0)*2.0 + 1.0;  vec4 s1 = floor(b1)*2.0 + 1.0;  vec4 sh = -step(h, vec4(0.0));  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;  vec3 p0 = vec3(a0.xy,h.x);  vec3 p1 = vec3(a0.zw,h.y);  vec3 p2 = vec3(a1.xy,h.z);  vec3 p3 = vec3(a1.zw,h.w);  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));  p0 *= norm.x;  p1 *= norm.y;  p2 *= norm.z;  p3 *= norm.w;  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);  m = m * m;  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),                                 dot(p2,x2), dot(p3,x3) ) );  }/**  * @copyright 2016 Apple Inc. All rights reserved. */varying vec2 vUV;uniform float fw;uniform vec2 fj;uniform float et;uniform float dq;uniform float ee;uniform float kq;uniform vec2 qd;uniform vec2 jf;uniform float ww;uniform float qa;uniform float te; void main() {if ((vUV.x< 1.0-qd.x-jf.x)||(vUV.y<1.0-qd.y-jf.y)){return;}vec2 ge=vUV+jf;float gd=snoise(vec3(0.,0.,fw));float wa=snoise(vec3(0.,0.,kq*3.))*0.3+0.7;float qf=snoise(vec3(0.,0.,kq*3.))*0.1+0.9;vec2 dz=vec2(kq+gd*0.1*ee,(ge.x-0.5)/et/qf);vec3 yf=abs(vec3(snoise(vec3(dz,1.0)),snoise(vec3(dz,5.0)),snoise(vec3(dz,9.0))))*0.5+0.01;yf *=min(1.,smoothstep(ww,qa+ww,ge.x)*smoothstep(1.-ww,1.-ww-qa,ge.x))*wa;float da=abs(ge.y-0.5);vec3 kp=smoothstep(yf+(dq/fj.y),yf,vec3(da));kp*=smoothstep(0.25,0.0,yf)*0.7+0.3;kp*= min(1., smoothstep(0., te, ge.x)*smoothstep(1.,1.-te, ge.x));vec4 ca=vec4(1.0,0.176,0.333,.1)*kp.x;vec4 op=vec4(0.251,1.0,0.639,.1)*kp.y;vec4 sf=vec4(0.0,0.478,1.0,.1)*kp.z;gl_FragColor=1.0-(1.0-ca)*(1.0-op)*(1.0-sf);}";
    }, {}],
    122: [function(e, t, r) {
        "use strict";
        t.exports = "/* * Description : Array and textureless GLSL 2D/3D/4D simplex  *            noise functions. *     Author : Ian McEwan, Ashima Arts. * Maintainer : stegu *   Lastmod : 20110822 (ijm) *   License : Copyright (C) 2011 Ashima Arts. All rights reserved. *             Distributed under the MIT License. See LICENSE file. *             https://github.com/ashima/webgl-noise *             https://github.com/stegu/webgl-noise */vec3 mod289(vec3 x) {  return x - floor(x * (1.0 / 289.0)) * 289.0;}vec4 mod289(vec4 x) {  return x - floor(x * (1.0 / 289.0)) * 289.0;}vec4 permute(vec4 x) {     return mod289(((x*34.0)+1.0)*x);}vec4 taylorInvSqrt(vec4 r){  return 1.79284291400159 - 0.85373472095314 * r;}float snoise(vec3 v)  {   const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);  vec3 i  = floor(v + dot(v, C.yyy) );  vec3 x0 =   v - i + dot(i, C.xxx) ;  vec3 g = step(x0.yzx, x0.xyz);  vec3 l = 1.0 - g;  vec3 i1 = min( g.xyz, l.zxy );  vec3 i2 = max( g.xyz, l.zxy );  vec3 x1 = x0 - i1 + C.xxx;  vec3 x2 = x0 - i2 + C.yyy;  vec3 x3 = x0 - D.yyy;  i = mod289(i);   vec4 p = permute( permute( permute(              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));  float n_ = 0.142857142857;  vec3  ns = n_ * D.wyz - D.xzx;  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  vec4 x_ = floor(j * ns.z);  vec4 y_ = floor(j - 7.0 * x_ );  vec4 x = x_ *ns.x + ns.yyyy;  vec4 y = y_ *ns.x + ns.yyyy;  vec4 h = 1.0 - abs(x) - abs(y);  vec4 b0 = vec4( x.xy, y.xy );  vec4 b1 = vec4( x.zw, y.zw );  vec4 s0 = floor(b0)*2.0 + 1.0;  vec4 s1 = floor(b1)*2.0 + 1.0;  vec4 sh = -step(h, vec4(0.0));  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;  vec3 p0 = vec3(a0.xy,h.x);  vec3 p1 = vec3(a0.zw,h.y);  vec3 p2 = vec3(a1.xy,h.z);  vec3 p3 = vec3(a1.zw,h.w);  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));  p0 *= norm.x;  p1 *= norm.y;  p2 *= norm.z;  p3 *= norm.w;  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);  m = m * m;  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),                                 dot(p2,x2), dot(p3,x3) ) );  }/** * @copyright 2016 Apple Inc. All rights reserved.*//*  time -> fw  resolution -> fj  speed -> ee  timeSpeed -> kq  scale -> et  thickness -> dq  envelopeStart -> ww  envelope2 -> te  offset -> jf  limit -> qd */varying vec2 vUV;uniform float fw;uniform vec2 fj;uniform float et;uniform float dq;uniform float ee;uniform float kq;uniform vec2 qd;uniform vec2 jf;uniform float ww;uniform float qa;uniform float te;void main() {float gd = snoise(vec3(0., 0., fw));float wa = snoise(vec3(0., 0., kq*3.))*0.3+0.7;float qf = snoise(vec3(0., 0., kq*3.))*0.1+0.9;vec2  dz = vec2(kq+gd*0.1*ee,(vUV.x-0.5)/et/qf);vec3 yf = abs(vec3(snoise(vec3(dz, 1.0)), snoise(vec3(dz, 5.0)), snoise(vec3(dz, 9.0))))*0.5;yf *= min(1., smoothstep(    ww,    qa+ww, vUV.x)            * smoothstep( 1.-ww, 1.-ww-qa, vUV.x))* wa;float p = abs(vUV.y-0.5);vec3 kp = smoothstep(yf,yf-(dq/fj.y),vec3(p));vec3 dr = vec3(255., 69., 61.)/255.;vec3 lr = vec3(255., 103., 92.)/255.;vec3 dg = vec3(50., 201., 69.)/255.;vec3 lg = vec3(164., 255., 196.)/255.;vec3 db = vec3(21., 124., 255.)/255.;vec3 lb = vec3(80., 227., 255.)/255.;vec3 rr   = mix(dr, lr, yf.x*6.);vec3 gg   = mix(dg, lg, yf.y*6.);vec3 bb   = mix(db, lb, yf.z*6.);vec4 xx       = vec4(rr, 1. )*( kp.x);vec4 yy       = vec4(gg, 1. )*( kp.y);vec4 zz       = vec4(bb, 1. )*( kp.z); gl_FragColor =  1.-(1.-xx)*(1.-yy)*(1.-zz);}"
    }, {}],
    123: [function(e, t, r) {
        "use strict";
        t.exports = {
            TextureLoader: e("./ac-texture-loader/TextureLoader")
        }
    }, {
        "./ac-texture-loader/TextureLoader": 124
    }],
    124: [function(e, t, r) {
        "use strict";

        function n(e) {
            i.call(this), e = e || {}, this.options = s.defaults(l, e), this.textureUnitCount = 0, this._boundOnBreakpoint = this._onBreakpoint.bind(this), c.on("breakpoint", this._boundOnBreakpoint), this._onBreakpoint(), this.textures = {}
        }
        var i = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("gl-texture2d"),
            s = e("@marcom/ac-object"),
            a = e("ac-cname").cname,
            u = e("@marcom/ac-dom-emitter").DOMEmitter,
            c = e("@marcom/ac-viewport").Viewport,
            l = {
                basePath: "/",
                ignoreBreakpoint: !1,
                type: "image",
                extension: "png",
                allowXLarge: !1,
                timeout: 5e3
            },
            h = ["mp4"],
            f = n.prototype = Object.create(i.prototype);
        f.createTexture = function(e, t, r) {
            var n = this._getTextureDOMElement(r);
            return this.textures[t] = {
                texture: {},
                el: n,
                unit: this.textureUnitCount,
                context: e,
                options: r || {}
            }, this.textureUnitCount++, this.textures[t].texture
        }, f.load = function(e, t) {
            if ("string" != typeof e) return !1;
            var r = this.textures[e];
            r || (this.createTexture(e, t), r = this.textures[e]);
            var n = s.defaults(r.options, t || {}),
                i = this.getAssetPath(e, n),
                o = new XMLHttpRequest;
            return o.open("GET", i, !0), o.responseType = "arraybuffer", o.onload = this._handleXHRLoaded.bind(this, e, r, n, o), o.send(null), r.texture
        }, f.emptyTextureCache = function() {
            var e;
            for (e in this.textures) this.textures.hasOwnProperty(e) && this.textures[e].texture.dispose();
            this.textures = {}
        }, f.getAssetPath = function(e, t) {
            t = s.defaults(this.options, t || {});
            var r = t.basePath,
                n = t.extension,
                i = "",
                o = "_2x";
            if (n = "." + n, !t.ignoreBreakpoint) {
                var u = this.breakpointName;
                "xlarge" !== u || t.allowXLarge || (u = "large"), i += "_" + u
            }
            if (t.retina === !0) i += o;
            else if (t.retina === !1) i += "";
            else {
                var c = "";
                window.devicePixelRatio > 1.5 && (c = o), i += c
            }
            return a.formatUrl(r, e + i, n)
        }, f.cancelXHR = function() {}, f.destroy = function() {
            this.emptyTextureCache(), this.cancelXHR(), c.off("breakpoint", this._boundOnBreakpoint);
            var e;
            for (e in this) this.hasOwnProperty(e) && (this[e] = null)
        }, f._getTextureDOMElement = function(e) {
            var t = "img";
            return h.indexOf(e.extension) > -1 && (t = "video"), document.createElement(t)
        }, f._handleXHRLoaded = function(e, t, r, n) {
            if (n.status >= 400) return this.trigger("error", {
                name: e,
                xhr: n
            }), void(n = null);
            var i = window.URL || window.webkitURL,
                o = "image",
                s = t.el.tagName.toLowerCase();
            "video" === s && (o = "video");
            var a = new Uint8Array(n.response),
                c = new Blob([a], {
                    type: o + "/" + r.extension
                }),
                l = i.createObjectURL(c),
                h = new u(t.el),
                f = "load";
            "video" === s && (f = "canplay"), h.on(f, this._onImageBlobTextureLoaded.bind(this, e, t, h, n)), t.el.src = l
        }, f._onImageBlobTextureLoaded = function(e, t, r, n) {
            t.texture = o(t.context, t.el), this.textures[e] = t, this.trigger("load", {
                name: e,
                texture: t.texture,
                el: t.el
            }), r.destroy(), n = r = null
        }, f._onBreakpoint = function() {
            this.breakpointName = c.getBreakpoint().name
        }, t.exports = n
    }, {
        "@marcom/ac-dom-emitter": 25,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-object": 69,
        "@marcom/ac-viewport": 128,
        "ac-cname": 193,
        "gl-texture2d": 217
    }],
    125: [function(e, t, r) {
        "use strict";
        t.exports = function(e, t) {
            var r = "&",
                n = "";
            if (e) {
                var i = Object.keys(e),
                    o = i.length - 1;
                i.forEach(function(t, i) {
                    var s = e[t];
                    t = t.trim(), s = s && "string" == typeof s ? s.trim() : s, s = null === s ? "" : "=" + s;
                    var a = t + s + (i === o ? "" : r);
                    n = n ? n.concat(a) : a
                })
            }
            return n && t !== !1 ? "?" + n : n
        }
    }, {}],
    126: [function(e, t, r) {
        "use strict";
        t.exports = function(e) {
            e = e || window.location.search, e = e.replace(/^[^?]*\?/, "");
            var t = "&",
                r = e ? e.split(t) : [],
                n = {},
                i = "=",
                o = new RegExp(i);
            return r.forEach(function(e) {
                var t, r;
                if (o.test(e)) {
                    var s = e.split(i, 2);
                    t = s[0], r = s[1]
                } else t = e, r = null;
                n[t] = r
            }), n
        }
    }, {}],
    127: [function(e, t, r) {
        "use strict";

        function n(e) {
            var t = e.port,
                r = new RegExp(":" + t);
            return t && !r.test(e.href) && r.test(e.host)
        }
        var i = e("./parseSearchParams");
        t.exports = function(e) {
            var t, r = "",
                o = !1;
            return e ? window.URL && "function" == typeof window.URL ? t = new URL(e, window.location) : (t = document.createElement("a"), t.href = e, t.href = t.href, n(t) && (r = t.host.replace(new RegExp(":" + t.port), ""), o = !0)) : t = window.location, {
                hash: t.hash,
                host: r || t.host,
                hostname: t.hostname,
                href: t.href,
                origin: t.origin || t.protocol + "//" + (r || t.host),
                pathname: t.pathname,
                port: o ? "" : t.port,
                protocol: t.protocol,
                search: t.search,
                searchParams: i(t.search)
            }
        }
    }, {
        "./parseSearchParams": 126
    }],
    128: [function(e, t, r) {
        "use strict";
        t.exports = {
            Viewport: e("./ac-viewport/Viewport")
        }
    }, {
        "./ac-viewport/Viewport": 129
    }],
    129: [function(e, t, r) {
        "use strict";

        function n(e) {
            var t, r = s;
            for (t in r) r.hasOwnProperty(t) ? this[t] = r[t] : i[t] = r[t];
            this.addCustomEvent(a.getCustomEvent())
        }
        var i, o = e("@marcom/ac-shared-instance").SharedInstance,
            s = e("@marcom/ac-window-delegate").WindowDelegate,
            a = e("@marcom/ac-breakpoints-delegate").BreakpointsDelegate,
            u = "ac-viewport:Viewport",
            c = "3.2.0";
        i = n.prototype, i.getBreakpoint = function() {
            return a.getBreakpoint()
        }, i.setBreakpoints = function(e) {
            return a.setBreakpoints(e)
        }, t.exports = o.share(u, c, n)
    }, {
        "@marcom/ac-breakpoints-delegate": 14,
        "@marcom/ac-shared-instance": 117,
        "@marcom/ac-window-delegate": 130
    }],
    130: [function(e, t, r) {
        "use strict";
        t.exports = {
            WindowDelegate: e("./ac-window-delegate/WindowDelegate"),
            WindowDelegateOptimizer: e("./ac-window-delegate/WindowDelegateOptimizer"),
            WindowDelegateCustomEvent: e("./ac-window-delegate/WindowDelegateCustomEvent")
        }
    }, {
        "./ac-window-delegate/WindowDelegate": 133,
        "./ac-window-delegate/WindowDelegateCustomEvent": 134,
        "./ac-window-delegate/WindowDelegateOptimizer": 135
    }],
    131: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/ac-event-emitter").EventEmitter,
            i = function() {
                this._emitter = new n, this._customEvents = {}
            },
            o = i.prototype;
        o.on = function(e, t, r) {
            return this._activateCustomEvents(e), this._emitterOn.apply(this, arguments), this
        }, o.once = function(e, t, r) {
            return this._emitterOnce.apply(this, arguments), this
        }, o.off = function(e, t, r) {
            return this._emitterOff.apply(this, arguments), this._deactivateCustomEvents(e), this
        }, o.has = function(e, t, r) {
            return this._emitter.has.apply(this._emitter, arguments)
        }, o.trigger = function() {
            return this._emitter.trigger.apply(this._emitter, arguments), this
        }, o.propagateTo = function() {
            return this._emitter.propagateTo.apply(this._emitter, arguments), this
        }, o.stopPropagatingTo = function() {
            return this._emitter.stopPropagatingTo.apply(this._emitter, arguments), this
        }, o.add = function(e) {
            this._customEvents[e.name] = e
        }, o.canHandleCustomEvent = function(e) {
            return this._customEvents.hasOwnProperty(e)
        }, o.isHandlingCustomEvent = function(e) {
            return !(!this._customEvents[e] || !this._customEvents[e].active)
        }, o._activateCustomEvents = function(e) {
            var t, r, n = e.split(" "),
                i = n.length;
            for (r = 0; r < i; r++) t = n[r], this._customEvents[t] && !this._customEvents[t].active && (this._customEvents[t].initialize(), this._customEvents[t].active = !0)
        }, o._deactivateCustomEvents = function(e) {
            var t;
            if (e && 0 !== e.length) {
                var r = e.split(" "),
                    n = r.length;
                for (t = 0; t < n; t++) this._deactivateCustomEvent(r[t])
            } else
                for (t in this._customEvents) this._customEvents.hasOwnProperty(t) && this._deactivateCustomEvent(t)
        }, o._deactivateCustomEvent = function(e) {
            !this.has(e) && this._customEvents[e] && this._customEvents[e].active && (this._customEvents[e].deinitialize(), this._customEvents[e].active = !1)
        }, o._emitterOn = function() {
            this._emitter.on.apply(this._emitter, arguments)
        }, o._emitterOnce = function() {
            this._emitter.once.apply(this._emitter, arguments)
        }, o._emitterOff = function() {
            this._emitter.off.apply(this._emitter, arguments)
        }, t.exports = i
    }, {
        "@marcom/ac-event-emitter": 57
    }],
    132: [function(e, t, r) {
        "use strict";
        var n, i = e("@marcom/ac-event-emitter").EventEmitter,
            o = function(e) {
                i.call(this), this.optimizers = e, this._events = {}, this._properties = {}, this._initialize()
            };
        n = o.prototype = new i(null), n.canOptimizeEvent = function(e) {
            return this._events.hasOwnProperty(e)
        }, n.canOptimizeProperty = function(e) {
            return this._properties.hasOwnProperty(e)
        }, n.isOptimizingEvent = function(e) {
            return !(!this._events[e] || !this._events[e].active)
        }, n.isOptimizingProperty = function(e) {
            return !(!this._properties[e] || !this._properties[e].active)
        }, n.add = function(e) {
            this._setOptimizerEvents(e), this._setOptimizerProperties(e), e.on("update", this._onUpdate, this), e.on("activate", this._onActivate, this), e.on("deactivate", this._onDeactivate, this)
        }, n.get = function(e) {
            return this.isOptimizingProperty(e) ? this._properties[e].value : null
        }, n.set = function(e, t) {
            return !!this._properties[e] && (this._properties[e].value = t, this)
        }, n.getOptimizerByEvent = function(e) {
            return this._events[e] ? this._events[e] : null
        }, n._initialize = function() {
            var e;
            for (e in this.optimizers) this.optimizers.hasOwnProperty(e) && this.add(this.optimizers[e])
        }, n._onUpdate = function(e) {
            this.set(e.prop, e.val)
        }, n._onActivate = function(e) {
            var t, r = e.propertyNames,
                n = r.length;
            for (t = 0; t < n; t++) this._properties[r[t]].active = !0
        }, n._onDeactivate = function(e) {
            var t, r = e.propertyNames,
                n = r.length;
            for (t = 0; t < n; t++) this._properties[r[t]].active = !1
        }, n._setOptimizerEvents = function(e) {
            var t, r = e.eventNames,
                n = r.length;
            for (t = 0; t < n; t++) this._setOptimizerEvent(r[t], e)
        }, n._setOptimizerEvent = function(e, t) {
            this._events[e] || (this._events[e] = t)
        }, n._setOptimizerProperties = function(e) {
            var t, r = e.propertyNames,
                n = r.length;
            for (t = 0; t < n; t++) this._setOptimizerProperty(r[t])
        }, n._setOptimizerProperty = function(e) {
            this._properties.hasOwnProperty(e) || (this._properties[e] = {}, this._properties[e].active = !1, this._properties[e].value = null)
        }, t.exports = o
    }, {
        "@marcom/ac-event-emitter": 57
    }],
    133: [function(e, t, r) {
        "use strict";

        function n() {
            this._emitter = new s(window), this._controllers = {
                optimizer: new a(l),
                customEvent: new u
            };
            var e;
            for (e in c) c.hasOwnProperty(e) && (this[e] = this._getProperty.bind(this, e), c[e] = c[e].bind(this));
            this._bindEvents()
        }
        var i, o = e("@marcom/ac-shared-instance").SharedInstance,
            s = e("@marcom/ac-dom-emitter").DOMEmitter,
            a = e("./OptimizerController"),
            u = e("./CustomEventController"),
            c = e("./queries/queries"),
            l = e("./optimizers/optimizers"),
            h = "ac-window-delegate:WindowDelegate",
            f = "3.0.2";
        i = n.prototype, i.on = function(e, t, r) {
            var n = this._seperateCustomEvents(e);
            return this._optimizeEvents(n.standardEvents), this._customEventOn(n.customEvents, t, r), this._emitterOn.apply(this, arguments), this
        }, i.once = function(e, t, r) {
            var n = this._seperateCustomEvents(e);
            return this._optimizeEvents(n.standardEvents), this._customEventOnce(n.customEvents, t, r), this._emitterOnce.apply(this, arguments), this
        }, i.off = function(e, t, r) {
            var n = this._seperateCustomEvents(e),
                i = !1;
            if (e || (i = !0), this._customEventOff(n.customEvents, t, r, i), this._emitterOff.apply(this, arguments), i) try {
                var o;
                for (o in this._controllers.optimizer._events) this._controllers.optimizer._events.hasOwnProperty(o) && this._shouldDeoptimizeEvent(o, !0) && this._deoptimizeEvent(o);
                this._bindEvents()
            } catch (s) {}
            return this
        }, i.has = function(e, t, r) {
            return this._emitter.has.apply(this._emitter, arguments)
        }, i.trigger = function() {
            return this._emitter.trigger.apply(this._emitter, arguments), this
        }, i.emitterTrigger = function() {
            return this._emitter.emitterTrigger.apply(this._emitter, arguments), this
        }, i.propagateTo = function() {
            return this._emitter.propagateTo.apply(this._emitter, arguments), this
        }, i.stopPropagatingTo = function() {
            return this._emitter.stopPropagatingTo.apply(this._emitter, arguments), this
        }, i.addOptimizer = function(e) {
            return this._controllers.optimizer.add(e), this
        }, i.addCustomEvent = function(e) {
            return this._controllers.customEvent.add(e), this
        }, i._emitterOn = function() {
            this._emitter.on.apply(this._emitter, arguments)
        }, i._emitterOnce = function() {
            this._emitter.once.apply(this._emitter, arguments)
        }, i._emitterOff = function() {
            this._emitter.off.apply(this._emitter, arguments)
        }, i._onEventUnbound = function(e) {
            var t = e.data.evt;
            this._shouldDeoptimizeEvent(t) && this._deoptimizeEvent(t)
        }, i._customEventOn = function(e, t, r) {
            0 !== e.length && this._controllers.customEvent.on(e.join(" "), t, r)
        }, i._customEventOnce = function(e, t, r) {
            0 !== e.length && this._controllers.customEvent.once(e.join(" "), t, r)
        }, i._customEventOff = function(e, t, r, n) {
            if (n || 0 !== e.length) return n && 0 === e.length ? void this._controllers.customEvent.off() : void this._controllers.customEvent.off(e.join(" "), t, r)
        }, i._getProperty = function(e, t) {
            var r = null;
            return t || (r = this._getOptimizedValue(e)), null === r && (r = c[e].call(this, t)), r
        }, i._optimizeEvents = function(e) {
            var t, r, n = e.length;
            for (r = 0; r < n; r++) t = e[r], this._shouldOptimizeEvent(t) && this._optimizeEvent(t)
        }, i._shouldOptimizeEvent = function(e) {
            return !(!this._controllers.optimizer.canOptimizeEvent(e) || this._controllers.optimizer.isOptimizingEvent(e))
        }, i._shouldDeoptimizeEvent = function(e, t) {
            return !(!this._controllers.optimizer.isOptimizingEvent(e) || !(t || this._emitter._eventEmitter._events[e].length <= 1))
        }, i._optimizeEvent = function(e) {
            var t = this._controllers.optimizer.getOptimizerByEvent(e);
            t.activate(), this._emitterOn(e, t.callback, t)
        }, i._deoptimizeEvent = function(e) {
            var t = this._controllers.optimizer.getOptimizerByEvent(e);
            t.deactivate(), this._emitterOff(e, t.callback, t)
        }, i._getOptimizedValue = function(e) {
            return this._controllers.optimizer.get(e)
        }, i._seperateCustomEvents = function(e) {
            var t = {
                customEvents: [],
                standardEvents: []
            };
            if ("string" == typeof e) {
                var r, n, i = e.split(" "),
                    o = i.length;
                for (n = 0; n < o; n++) r = i[n], this._controllers.customEvent.canHandleCustomEvent(r) ? t.customEvents.push(r) : t.standardEvents.push(r)
            }
            return t
        }, i._bindEvents = function() {
            this._emitter.on("dom-emitter:didoff", this._onEventUnbound, this)
        }, t.exports = o.share(h, f, n)
    }, {
        "./CustomEventController": 131,
        "./OptimizerController": 132,
        "./optimizers/optimizers": 138,
        "./queries/queries": 147,
        "@marcom/ac-dom-emitter": 25,
        "@marcom/ac-shared-instance": 117
    }],
    134: [function(e, t, r) {
        "use strict";

        function n(e, t, r) {
            i.call(this), this.name = e, this.active = !1, this._initializeFunc = t, this._deinitializeFunc = r
        }
        var i = e("@marcom/ac-event-emitter").EventEmitter,
            o = n.prototype = new i(null);
        o.initialize = function() {
            return this._initializeFunc && this._initializeFunc(), this
        }, o.deinitialize = function() {
            return this._deinitializeFunc && this._deinitializeFunc(), this
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter": 57
    }],
    135: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            i.call(this), this.active = !1, this.eventNames = e.eventNames, this.propertyNames = e.propertyNames, this.options = e.options || {}, this.callback = t
        }
        var i = e("@marcom/ac-event-emitter").EventEmitter,
            o = n.prototype = new i(null);
        o.update = function(e, t) {
            this.trigger("update", {
                prop: e,
                val: t
            })
        }, o.activate = function() {
            this.active = !0, this.trigger("activate", this)
        }, o.deactivate = function() {
            this.active = !1, this.trigger("deactivate", this)
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter": 57
    }],
    136: [function(e, t, r) {
        "use strict";
        var n = e("../../WindowDelegateOptimizer"),
            i = e("../../queries/queries"),
            o = {
                eventNames: ["resize"],
                propertyNames: ["clientWidth", "clientHeight", "innerWidth", "innerHeight"]
            },
            s = new n(o, function(e) {
                var t, r = o.propertyNames,
                    n = r.length;
                for (t = 0; t < n; t++) this.update(r[t], i[r[t]](!0))
            });
        t.exports = s
    }, {
        "../../WindowDelegateOptimizer": 135,
        "../../queries/queries": 147
    }],
    137: [function(e, t, r) {
        "use strict";
        var n = e("../../WindowDelegateOptimizer"),
            i = e("../../queries/queries"),
            o = {
                eventNames: ["scroll"],
                propertyNames: ["scrollX", "scrollY", "maxScrollX", "maxScrollY"]
            },
            s = new n(o, function(e) {
                var t, r = o.propertyNames,
                    n = r.length;
                for (t = 0; t < n; t++) this.update(r[t], i[r[t]](!0))
            });
        t.exports = s
    }, {
        "../../WindowDelegateOptimizer": 135,
        "../../queries/queries": 147
    }],
    138: [function(e, t, r) {
        "use strict";
        var n = e("./events/resize"),
            i = e("./events/scroll");
        t.exports = [n, i]
    }, {
        "./events/resize": 136,
        "./events/scroll": 137
    }],
    139: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            return document.documentElement.clientHeight
        };
        t.exports = n
    }, {}],
    140: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            return document.documentElement.clientWidth
        };
        t.exports = n
    }, {}],
    141: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            return window.innerHeight || this.clientHeight(e)
        };
        t.exports = n
    }, {}],
    142: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            return window.innerWidth || this.clientWidth(e)
        };
        t.exports = n
    }, {}],
    143: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            return document.body.scrollWidth - this.innerWidth()
        };
        t.exports = n
    }, {}],
    144: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            return document.body.scrollHeight - this.innerHeight()
        };
        t.exports = n
    }, {}],
    145: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            var t = window.pageXOffset;
            if (!t) {
                var r = document.documentElement || document.body.parentNode || document.body;
                t = r.scrollLeft
            }
            return t
        };
        t.exports = n
    }, {}],
    146: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            var t = window.pageYOffset;
            if (!t) {
                var r = document.documentElement || document.body.parentNode || document.body;
                t = r.scrollTop
            }
            return t
        };
        t.exports = n
    }, {}],
    147: [function(e, t, r) {
        "use strict";
        var n = e("./methods/innerWidth"),
            i = e("./methods/innerHeight"),
            o = e("./methods/clientWidth"),
            s = e("./methods/clientHeight"),
            a = e("./methods/scrollX"),
            u = e("./methods/scrollY"),
            c = e("./methods/maxScrollX"),
            l = e("./methods/maxScrollY");
        t.exports = {
            innerWidth: n,
            innerHeight: i,
            clientWidth: o,
            clientHeight: s,
            scrollX: a,
            scrollY: u,
            maxScrollX: c,
            maxScrollY: l
        }
    }, {
        "./methods/clientHeight": 139,
        "./methods/clientWidth": 140,
        "./methods/innerHeight": 141,
        "./methods/innerWidth": 142,
        "./methods/maxScrollX": 143,
        "./methods/maxScrollY": 144,
        "./methods/scrollX": 145,
        "./methods/scrollY": 146
    }],
    148: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            u = e("./Model/AnimSystemModel"),
            c = e("./Keyframes/Keyframe"),
            l = e("./Keyframes/KeyframeCSSClass"),
            h = e("./Keyframes/KeyframeDiscreteEvent"),
            f = e("./ScrollGroup"),
            p = e("./TimeGroup"),
            d = (e("./utils/arrayToObject"), {
                update: e("@marcom/ac-raf-emitter/update"),
                cancelUpdate: e("@marcom/ac-raf-emitter/cancelUpdate"),
                external: e("@marcom/ac-raf-emitter/external"),
                draw: e("@marcom/ac-raf-emitter/draw")
            }),
            m = null,
            v = function(e) {
                function t() {
                    n(this, t);
                    var e = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    if (m) throw "You cannot create multiple AnimSystems. You probably want to create multiple groups instead. You can have unlimited groups on a page";
                    return m = e, e.groups = [], e.scrollSystems = [], e.timeSystems = [], e._forceUpdateRAFId = -1, e.onScroll = e.onScroll.bind(e), e.onResizedDebounced = e.onResizedDebounced.bind(e), e.onResizeImmediate = e.onResizeImmediate.bind(e), e
                }
                return o(t, e), s(t, [{
                    key: "initialize",
                    value: function() {
                        this.timeSystems = [], this.scrollSystems = [], this.groups = [], this.setupEvents(), this.initializeResizeFilter(), this.initializeModel(), this.createDOMGroups(), this.createDOMKeyframes()
                    }
                }, {
                    key: "remove",
                    value: function() {
                        var e = this;
                        return Promise.all(this.groups.map(function(e) {
                            return e.remove()
                        })).then(function() {
                            e.groups = null, e.scrollSystems = null, e.timeSystems = null, window.clearTimeout(u.RESIZE_TIMEOUT), window.removeEventListener("scroll", e.onScroll), window.removeEventListener("resize", e.onResizeImmediate), e._events = {}
                        })
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.remove()
                    }
                }, {
                    key: "createTimeGroup",
                    value: function(e) {
                        var t = new p(e, this);
                        return this.groups.push(t), this.timeSystems.push(t), this.trigger(u.EVENTS.ON_GROUP_CREATED, t), t
                    }
                }, {
                    key: "createScrollGroup",
                    value: function(e) {
                        if (!e) throw "AnimSystem scroll based groups must supply an HTMLElement";
                        var t = new f(e, this);
                        return this.groups.push(t), this.scrollSystems.push(t), this.trigger(u.EVENTS.ON_GROUP_CREATED, t), t
                    }
                }, {
                    key: "removeGroup",
                    value: function(e) {
                        var t = this;
                        return Promise.all(e.keyframeControllers.map(function(t) {
                            return e.removeKeyframeController(t)
                        })).then(function() {
                            return new Promise(function(r) {
                                var n = t.groups.indexOf(e);
                                n !== -1 && t.groups.splice(n, 1), n = t.scrollSystems.indexOf(e), n !== -1 && t.scrollSystems.splice(n, 1), n = t.timeSystems.indexOf(e), n !== -1 && t.timeSystems.splice(n, 1), e.destroy(), r()
                            })
                        })
                    }
                }, {
                    key: "createDOMGroups",
                    value: function() {
                        var e = this;
                        document.body.setAttribute("data-anim-scroll-group", "body"), document.querySelectorAll("[data-anim-scroll-group]").forEach(function(t) {
                            return e.createScrollGroup(t)
                        }), document.querySelectorAll("[data-anim-time-group]").forEach(function(t) {
                            return e.createTimeGroup(t)
                        }), this.trigger(u.EVENTS.ON_DOM_GROUPS_CREATED, this.groups)
                    }
                }, {
                    key: "createDOMKeyframes",
                    value: function() {
                        var e = this,
                            t = [];
                        [c.DATA_ATTRIBUTE, l.DATA_ATTRIBUTE, h.DATA_ATTRIBUTE].forEach(function(e) {
                            for (var r = 0; r < 12; r++) t.push(e + (0 === r ? "" : "-" + (r - 1)))
                        });
                        for (var r = 0; r < t.length; r++)
                            for (var n = t[r], i = document.querySelectorAll("[" + n + "]"), o = 0; o < i.length; o++) {
                                var s = i[o],
                                    a = JSON.parse(s.getAttribute(n));
                                this.addKeyframe(s, a)
                            }
                        d.update(function() {
                            e.groups.forEach(function(e) {
                                return e.onKeyframesDirty({
                                    silent: !0
                                })
                            }), e.groups.forEach(function(e) {
                                return e.trigger(u.EVENTS.ON_DOM_KEYFRAMES_CREATED, e)
                            }), e.trigger(u.EVENTS.ON_DOM_KEYFRAMES_CREATED, e), e.groups.forEach(function(e) {
                                e.forceUpdate({
                                    waitForNextUpdate: !1,
                                    silent: !0
                                }), e.reconcile()
                            }), e.onScroll()
                        }, !0)
                    }
                }, {
                    key: "initializeResizeFilter",
                    value: function() {
                        if (!u.cssDimensionsTracker) {
                            var e = document.createElement("div");
                            e.setAttribute("cssDimensionsTracker", "true"), e.style.position = "fixed", e.style.top = "0", e.style.width = "100%", e.style.height = "100vh", e.style.pointerEvents = "none", e.style.visibility = "hidden", e.style.zIndex = "-1", document.documentElement.appendChild(e), u.cssDimensionsTracker = e
                        }
                    }
                }, {
                    key: "initializeModel",
                    value: function() {
                        u.pageMetrics.windowHeight = u.cssDimensionsTracker.clientHeight, u.pageMetrics.windowWidth = u.cssDimensionsTracker.clientWidth, u.pageMetrics.scrollY = window.scrollY || window.pageYOffset, u.pageMetrics.scrollX = window.scrollX || window.pageXOffset, u.pageMetrics.breakpoint = u.getBreakpoint();
                        var e = document.documentElement.getBoundingClientRect();
                        u.pageMetrics.documentOffsetX = e.left + u.pageMetrics.scrollX, u.pageMetrics.documentOffsetY = e.top + u.pageMetrics.scrollY
                    }
                }, {
                    key: "setupEvents",
                    value: function() {
                        window.removeEventListener("scroll", this.onScroll), window.addEventListener("scroll", this.onScroll), window.removeEventListener("resize", this.onResizeImmediate), window.addEventListener("resize", this.onResizeImmediate)
                    }
                }, {
                    key: "onScroll",
                    value: function() {
                        u.pageMetrics.scrollY = window.scrollY || window.pageYOffset, u.pageMetrics.scrollX = window.scrollX || window.pageXOffset;
                        for (var e = 0, t = this.scrollSystems.length; e < t; e++) this.scrollSystems[e]._onScroll();
                        this.trigger(u.PageEvents.ON_SCROLL, u.pageMetrics)
                    }
                }, {
                    key: "onResizeImmediate",
                    value: function() {
                        var e = u.cssDimensionsTracker.clientWidth,
                            t = u.cssDimensionsTracker.clientHeight;
                        if (e !== u.pageMetrics.windowWidth || t !== u.pageMetrics.windowHeight) {
                            u.pageMetrics.windowWidth = e, u.pageMetrics.windowHeight = t, u.pageMetrics.scrollY = window.scrollY || window.pageYOffset, u.pageMetrics.scrollX = window.scrollX || window.pageXOffset;
                            var r = document.documentElement.getBoundingClientRect();
                            u.pageMetrics.documentOffsetX = r.left + u.pageMetrics.scrollX, u.pageMetrics.documentOffsetY = r.top + u.pageMetrics.scrollY, window.clearTimeout(u.RESIZE_TIMEOUT), u.RESIZE_TIMEOUT = window.setTimeout(this.onResizedDebounced, 250), this.trigger(u.PageEvents.ON_RESIZE_IMMEDIATE, u.pageMetrics)
                        }
                    }
                }, {
                    key: "onResizedDebounced",
                    value: function() {
                        var e = this;
                        d.update(function() {
                            var t = u.pageMetrics.breakpoint,
                                r = u.getBreakpoint(),
                                n = r !== t;
                            if (n) {
                                u.pageMetrics.previousBreakpoint = t, u.pageMetrics.breakpoint = r;
                                for (var i = 0, o = e.groups.length; i < o; i++) e.groups[i]._onBreakpointChange();
                                e.trigger(u.PageEvents.ON_BREAKPOINT_CHANGE, u.pageMetrics)
                            }
                            for (var s = 0, a = e.groups.length; s < a; s++) e.groups[s].forceUpdate({
                                waitForNextUpdate: !1
                            });
                            e.trigger(u.PageEvents.ON_RESIZE_DEBOUNCED, u.pageMetrics)
                        }, !0)
                    }
                }, {
                    key: "forceUpdate",
                    value: function() {
                        var e = this,
                            t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            r = t.waitForNextUpdate,
                            n = void 0 === r || r,
                            i = t.silent,
                            o = void 0 !== i && i;
                        this._forceUpdateRAFId !== -1 && d.cancelUpdate(this._forceUpdateRAFId);
                        var s = function() {
                            for (var t = 0, r = e.groups.length; t < r; t++) {
                                var n = e.groups[t];
                                n.forceUpdate({
                                    waitForNextUpdate: !1,
                                    silent: o
                                })
                            }
                            return -1
                        };
                        this._forceUpdateRAFId = n ? d.update(s, !0) : s()
                    }
                }, {
                    key: "addKeyframe",
                    value: function(e, t) {
                        var r = this.getGroupForTarget(e);
                        return r = r || this.getGroupForTarget(document.body), r.addKeyframe(e, t)
                    }
                }, {
                    key: "getGroupForTarget",
                    value: function(e) {
                        if (e._animInfo && e._animInfo.group) return e._animInfo.group;
                        for (var t = e; t;) {
                            if (t._animInfo && t._animInfo.isGroup) return t._animInfo.group;
                            t = t.parentElement
                        }
                    }
                }, {
                    key: "getControllerForTarget",
                    value: function(e) {
                        return e._animInfo && e._animInfo.controller ? e._animInfo.controller : null
                    }
                }]), t
            }(a);
        t.exports = new v
    }, {
        "./Keyframes/Keyframe": 149,
        "./Keyframes/KeyframeCSSClass": 150,
        "./Keyframes/KeyframeDiscreteEvent": 152,
        "./Model/AnimSystemModel": 153,
        "./ScrollGroup": 162,
        "./TimeGroup": 163,
        "./utils/arrayToObject": 164,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-raf-emitter/cancelUpdate": 104,
        "@marcom/ac-raf-emitter/draw": 105,
        "@marcom/ac-raf-emitter/external": 106,
        "@marcom/ac-raf-emitter/update": 109
    }],
    149: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = e("../Model/AnimSystemModel"),
            s = e("@marcom/sm-math-utils"),
            a = e("../Model/EasingFunctions"),
            u = e("../Model/UnitBezier"),
            c = e("../utils/arrayToObject"),
            l = function() {
                function e(t, r) {
                    n(this, e), this.controller = t, this.anchors = [], this.jsonProps = r, this.ease = t.group.defaultEase, this.easeFunctionString = o.KeyframeDefaults.easeFunctionString, this.easeFunction = a[this.easeFunctionString], this.start = 0, this.end = 0, this.localT = 0, this.curvedT = 0, this.id = 0, this.event = "", this.needsEventDispatch = !1, this.snapAtCreation = !1, this.isEnabled = !1, this.animValues = {}, this.breakpointMask = "SMLX", this.disabledWhen = [], this.keyframeType = o.KeyframeTypes.Interpolation, this.hold = !1
                }
                return i(e, [{
                    key: "destroy",
                    value: function() {
                        this.controller = null, this.anchors = null, this.jsonProps = null, this.easeFunction = null, this.animValues = null
                    }
                }, {
                    key: "remove",
                    value: function() {
                        return this.controller.removeKeyframe(this)
                    }
                }, {
                    key: "parseOptions",
                    value: function(e) {
                        var t = this;
                        if (this.jsonProps = e, e.relativeTo && console.error("KeyframeError: relativeTo has been removed. Use 'anchors' property instead. Found 'relativeTo':\"" + e.relativeTo + '"'), "" !== e.anchors && e.anchors) {
                            var r = Array.isArray(e.anchors) ? e.anchors : [e.anchors];
                            this.anchors = [], r.forEach(function(e) {
                                var r = t.controller.group.element.querySelector(e) || document.querySelector(e);
                                return null === r ? void console.warn("Keyframe for", t.controller.friendlyName, " `anchor` failed to find '" + e + "' via querySelector in group.element or document") : (t.anchors.push(r), void t.controller.group.metrics.add(r))
                            })
                        } else this.anchors = [], e.anchors = [];
                        if (e.ease ? this.ease = parseFloat(e.ease) : e.ease = this.ease, e.hasOwnProperty("snapAtCreation") ? this.snapAtCreation = e.snapAtCreation : e.snapAtCreation = this.snapAtCreation, e.easeFunction ? this.easeFunction = e.easeFunction : e.easeFunction = this.easeFunctionString, e.breakpointMask ? this.breakpointMask = e.breakpointMask : e.breakpointMask = this.breakpointMask, e.disabledWhen ? this.disabledWhen = Array.isArray(e.disabledWhen) ? e.disabledWhen : [e.disabledWhen] : e.disabledWhen = this.disabledWhen, e.hasOwnProperty("hold") ? this.hold = e.hold : e.hold = this.hold, this.easeFunction = a[e.easeFunction], !a.hasOwnProperty(e.easeFunction)) {
                            var n = u.fromCSSString(e.easeFunction);
                            n ? this.easeFunction = n : console.error("Keyframe parseOptions cannot find EasingFunction named '" + e.easingFunction + "'")
                        }
                        for (var i in e)
                            if (o.KeyframeJSONReservedWords.indexOf(i) === -1) {
                                var s = e[i];
                                if (Array.isArray(s)) {
                                    if (this.animValues[i] = this.controller.group.expressionParser.parseArray(this, s), void 0 === this.controller.tweenProps[i] || !this.controller._ownerIsElement) {
                                        var c = 0;
                                        this.controller._ownerIsElement || (c = this.controller.element[i]);
                                        var l = new o.TargetValue(c, o.KeyframeDefaults.epsilon, this.snapAtCreation);
                                        this.controller.tweenProps[i] = l
                                    }
                                    var h = this.controller.tweenProps[i];
                                    if (e.epsilon) h.epsilon = e.epsilon;
                                    else {
                                        var f = Math.abs(this.animValues[i][0] - this.animValues[i][1]),
                                            p = Math.min(.001 * f, h.epsilon, o.KeyframeDefaults.epsilon);
                                        h.epsilon = Math.max(p, 1e-4)
                                    }
                                }
                            }
                        this.keyframeType = this.hold ? o.KeyframeTypes.InterpolationForward : o.KeyframeTypes.Interpolation, e.event && (this.event = e.event)
                    }
                }, {
                    key: "overwriteProps",
                    value: function(e) {
                        this.animValues = {};
                        var t = Object.assign({}, this.jsonProps, e);
                        this.controller.updateKeyframe(this, t)
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function(e) {
                        if (this.start === this.end || e > this.end) return this.localT = 1, void(this.curvedT = this.easeFunction(this.localT));
                        var t = (e - this.start) / (this.end - this.start),
                            r = this.hold ? this.localT : 0;
                        this.localT = s.clamp(t, r, 1), this.curvedT = this.easeFunction(this.localT)
                    }
                }, {
                    key: "reconcile",
                    value: function(e) {
                        var t = this.animValues[e],
                            r = this.controller.tweenProps[e];
                        r.initialValue = t[0], r.target = t[0] + this.curvedT * (t[1] - t[0]), r.current !== r.target && (r.current = r.target, this.needsEventDispatch || (this.needsEventDispatch = !0, this.controller.keyframesRequiringDispatch.push(this)))
                    }
                }, {
                    key: "reset",
                    value: function(e) {
                        this.localT = e || 0;
                        var t = this.ease;
                        this.ease = 1;
                        for (var r in this.animValues) this.reconcile(r);
                        this.ease = t
                    }
                }, {
                    key: "onDOMRead",
                    value: function(e) {
                        var t = this.animValues[e],
                            r = this.controller.tweenProps[e];
                        r.target = t[0] + this.curvedT * (t[1] - t[0]);
                        var n = r.current;
                        r.current += (r.target - r.current) * this.ease;
                        var i = r.current - r.target;
                        i < r.epsilon && i > -r.epsilon && (r.current = r.target, i = 0), "" === this.event || this.needsEventDispatch || (i > r.epsilon || i < -r.epsilon || 0 === i && n !== r.current) && (this.needsEventDispatch = !0, this.controller.keyframesRequiringDispatch.push(this))
                    }
                }, {
                    key: "isInRange",
                    value: function(e) {
                        return e >= this.start && e <= this.end
                    }
                }, {
                    key: "setEnabled",
                    value: function(e) {
                        e = e || c(Array.from(document.documentElement.classList));
                        var t = this.breakpointMask.indexOf(o.pageMetrics.breakpoint) !== -1,
                            r = !1;
                        return this.disabledWhen.length > 0 && (r = this.disabledWhen.some(function(t) {
                            return "undefined" != typeof e[t]
                        })), this.isEnabled = t && !r, this.isEnabled
                    }
                }, {
                    key: "updateAnimationConstraints",
                    value: function() {
                        this.start = this.controller.group.timeParser.parse(this, this.jsonProps.start), this.end = this.controller.group.timeParser.parse(this, this.jsonProps.end), this.updateAnimatedValueConstraints()
                    }
                }, {
                    key: "updateAnimatedValueConstraints",
                    value: function() {
                        for (var e in this.animValues) {
                            var t = this.jsonProps[e];
                            this.animValues[e] = this.controller.group.expressionParser.parseArray(this, t)
                        }
                    }
                }]), e
            }();
        l.DATA_ATTRIBUTE = "data-anim-tween", t.exports = l
    }, {
        "../Model/AnimSystemModel": 153,
        "../Model/EasingFunctions": 154,
        "../Model/UnitBezier": 158,
        "../utils/arrayToObject": 164,
        "@marcom/sm-math-utils": 175
    }],
    150: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                return typeof e
            } : function(e) {
                return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
            },
            a = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            u = e("./Keyframe"),
            c = e("../Model/AnimSystemModel.js"),
            l = function(e) {
                function t(e, r) {
                    n(this, t);
                    var o = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return o.keyframeType = c.KeyframeTypes.CSSClass, o._triggerType = t.TRIGGER_TYPE_CSS_CLASS, o.cssClass = "", o.friendlyName = "", o.style = {
                        on: null,
                        off: null
                    }, o.toggle = !1, o.isApplied = !1, o
                }
                return o(t, e), a(t, [{
                    key: "parseOptions",
                    value: function(e) {
                        if (!this.controller._ownerIsElement) throw new TypeError("CSS Keyframes cannot be applied to JS Objects");
                        if (e.x = void 0, e.y = void 0, e.scale = void 0, e.scaleX = void 0, e.scaleY = void 0, e.rotation = void 0, e.opacity = void 0, e.hold = void 0, void 0 !== e.toggle && (this.toggle = e.toggle), void 0 !== e.cssClass) this._triggerType = t.TRIGGER_TYPE_CSS_CLASS, this.cssClass = e.cssClass, this.friendlyName = "." + this.cssClass, void 0 === this.controller.tweenProps.targetClasses && (this.controller.tweenProps.targetClasses = {
                            add: [],
                            remove: []
                        });
                        else {
                            if (void 0 === e.style || !this.isValidStyleProperty(e.style)) throw new TypeError("KeyframeCSSClass no 'cssClass` property found. If using `style` property its also missing or invalid");
                            if (this._triggerType = t.TRIGGER_TYPE_STYLE_PROPERTY, this.style = e.style, this.friendlyName = "style", this.toggle = void 0 !== this.style.off || this.toggle, this.toggle && void 0 === this.style.off) {
                                this.style.off = {};
                                for (var r in this.style.on) this.style.off[r] = ""
                            }
                            void 0 === this.controller.tweenProps.targetStyles && (this.controller.tweenProps.targetStyles = {})
                        }
                        if (void 0 === e.end && (e.end = e.start), e.toggle = this.toggle, this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.isApplied = this.controller.element.classList.contains(this.cssClass);
                        else {
                            var n = getComputedStyle(this.controller.element);
                            this.isApplied = !0;
                            for (var i in this.style.on)
                                if (n[i] !== this.style.on[i]) {
                                    this.isApplied = !1;
                                    break
                                }
                        }
                        u.prototype.parseOptions.call(this, e), this.animValues[this.friendlyName] = [0, 0], void 0 === this.controller.tweenProps[this.friendlyName] && (this.controller.tweenProps[this.friendlyName] = new c.TargetValue(0, 1, (!1))), this.keyframeType = c.KeyframeTypes.CSSClass
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function(e) {
                        this.isApplied && !this.toggle || (this.start !== this.end ? !this.isApplied && e >= this.start && e <= this.end ? this._apply() : this.isApplied && this.toggle && (e < this.start || e > this.end) && this._unapply() : !this.isApplied && e >= this.start ? this._apply() : this.isApplied && this.toggle && e < this.start && this._unapply())
                    }
                }, {
                    key: "_apply",
                    value: function() {
                        if (this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.controller.tweenProps.targetClasses.add.push(this.cssClass), this.controller.needsClassUpdate = !0;
                        else {
                            for (var e in this.style.on) this.controller.tweenProps.targetStyles[e] = this.style.on[e];
                            this.controller.needsStyleUpdate = !0
                        }
                        this.isApplied = !0
                    }
                }, {
                    key: "_unapply",
                    value: function() {
                        if (this._triggerType === t.TRIGGER_TYPE_CSS_CLASS) this.controller.tweenProps.targetClasses.remove.push(this.cssClass), this.controller.needsClassUpdate = !0;
                        else {
                            for (var e in this.style.off) this.controller.tweenProps.targetStyles[e] = this.style.off[e];
                            this.controller.needsStyleUpdate = !0
                        }
                        this.isApplied = !1
                    }
                }, {
                    key: "isValidStyleProperty",
                    value: function(e) {
                        if (!e.hasOwnProperty("on")) return !1;
                        if ("object" !== s(e.on)) throw new TypeError("KeyframeCSSClass `style` property should be in the form of: {on:{visibility:hidden, otherProperty: value}}");
                        if (this.toggle && e.hasOwnProperty("off") && "object" !== s(e.off)) throw new TypeError("KeyframeCSSClass `style` property should be in the form of: {on:{visibility:hidden, otherProperty: value}}");
                        return !0
                    }
                }, {
                    key: "reconcile",
                    value: function(e, t) {}
                }, {
                    key: "onDOMRead",
                    value: function(e, t) {}
                }, {
                    key: "updateAnimatedValueConstraints",
                    value: function() {}
                }]), t
            }(u);
        l.TRIGGER_TYPE_CSS_CLASS = 0, l.TRIGGER_TYPE_STYLE_PROPERTY = 1, l.DATA_ATTRIBUTE = "data-anim-classname", t.exports = l
    }, {
        "../Model/AnimSystemModel.js": 153,
        "./Keyframe": 149
    }],
    151: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = function g(e, t, r) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : g(i, t, r)
                }
                if ("value" in n) return n.value;
                var o = n.get;
                if (void 0 !== o) return o.call(r)
            },
            u = e("../Model/AnimSystemModel"),
            c = (e("./Keyframe"), e("./KeyframeCSSClass")),
            l = e("../Model/InferKeyframeFromProps"),
            h = e("../utils/arrayToObject"),
            f = e("../Model/UUID"),
            p = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            d = e("@marcom/decompose-css-transform"),
            m = {
                update: e("@marcom/ac-raf-emitter/update"),
                external: e("@marcom/ac-raf-emitter/external"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            v = Math.PI / 180,
            y = {
                create: e("gl-mat4/create"),
                rotateX: e("gl-mat4/rotateX"),
                rotateY: e("gl-mat4/rotateY"),
                rotateZ: e("gl-mat4/rotateZ"),
                scale: e("gl-mat4/scale")
            },
            _ = function(e) {
                function t(e, r) {
                    n(this, t);
                    var o = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return o.uuid = f(), o.group = e, o.element = r, o._ownerIsElement = o.element instanceof Element, o._ownerIsElement ? o.friendlyName = o.element.tagName + "." + Array.from(o.element.classList).join(".") : o.friendlyName = o.element.friendlyName || o.uuid, o.element._animInfo = o.element._animInfo || new u.AnimInfo(e, o), o.element._animInfo.controller = o, o.element._animInfo.group = o.group, o.element._animInfo.controllers.push(o), o.tweenProps = new u.TweenProps, o.eventObject = new u.EventObject(o), o.needsStyleUpdate = !1, o.needsClassUpdate = !1, o.elementMetrics = o.group.metrics.add(o.element), o._parentElementMetrics = null, o.attributes = [], o.keyframes = {}, o._allKeyframes = [], o._activeKeyframes = [], o.keyframesRequiringDispatch = [], o.updateCachedValuesFromElement(), o.boundsMin = 0, o.boundsMax = 0, o.mat2d = new Float32Array(6), o.mat4 = y.create(), o.needsWrite = !0, o.onDOMWriteImp = o._ownerIsElement ? o.onDOMWriteForElement : o.onDOMWriteForObject, o
                }
                return o(t, e), s(t, [{
                    key: "destroy",
                    value: function() {
                        if (this.element._animInfo) {
                            this.element._animInfo.controller === this && (this.element._animInfo.controller = null);
                            var e = this.element._animInfo.controllers.indexOf(this);
                            e !== -1 && this.element._animInfo.controllers.splice(e, 1), 0 === this.element._animInfo.controllers.length ? this.element._animInfo = null : (this.element._animInfo.controller = this.element._animInfo.controllers[this.element._animInfo.controllers.length - 1], this.element._animInfo.group = this.element._animInfo.controller.group)
                        }
                        this._parentElementMetrics = null, this.eventObject.controller = null, this.eventObject.element = null, this.eventObject.keyframe = null, this.eventObject.tweenProps = null, this.eventObject = null, this.elementMetrics = null, this.group = null, this.keyframesRequiringDispatch = null;
                        for (var r = 0; r < this._allKeyframes.length; r++) this._allKeyframes[r].destroy();
                        this._allKeyframes = null, this._activeKeyframes = null, this.attributes = null, this.keyframes = null, this.element = null, this.tweenProps = null, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "remove",
                    value: function() {
                        return this.group.removeKeyframeController(this)
                    }
                }, {
                    key: "updateCachedValuesFromElement",
                    value: function() {
                        if (this._ownerIsElement) {
                            var e = getComputedStyle(this.element),
                                t = d(this.element, !0),
                                r = u.KeyframeDefaults.epsilon,
                                n = !1;
                            this.tweenProps.x = new u.TargetValue(t.translation[0], r, n), this.tweenProps.y = new u.TargetValue(t.translation[1], r, n), this.tweenProps.z = new u.TargetValue(t.translation[2], r, n), this.tweenProps.rotation = new u.TargetValue(t.eulerRotation[2], r, n), this.tweenProps.rotationX = new u.TargetValue(t.eulerRotation[0], r, n), this.tweenProps.rotationY = new u.TargetValue(t.eulerRotation[1], r, n), this.tweenProps.rotationZ = new u.TargetValue(t.eulerRotation[2], r, n), this.tweenProps.scale = new u.TargetValue(t.scale[0], r, n), this.tweenProps.scaleX = new u.TargetValue(t.scale[0], r, n), this.tweenProps.scaleY = new u.TargetValue(t.scale[1], r, n), this.tweenProps.opacity = new u.TargetValue(parseFloat(e.opacity), r, n)
                        }
                    }
                }, {
                    key: "addKeyframe",
                    value: function(e) {
                        var t = l(e);
                        if (!t) throw new Error("AnimSystem Cannot create keyframe for from options `" + e + "`");
                        var r = new t(this, e);
                        return r.parseOptions(e), r.id = this._allKeyframes.length, this._allKeyframes.push(r), r
                    }
                }, {
                    key: "needsUpdate",
                    value: function() {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var r = this.attributes[e],
                                n = this.tweenProps[r],
                                i = Math.abs(n.current - n.target);
                            if (i > n.epsilon) return !0
                        }
                        return !1
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function(e) {
                        for (var t = 0, r = this.attributes.length; t < r; t++) {
                            var n = this.attributes[t],
                                i = this.keyframes[this.attributes[t]];
                            if (1 !== i.length) {
                                var o = this.getNearestKeyframeForAttribute(n, e);
                                o && o.updateLocalProgress(e)
                            } else i[0].updateLocalProgress(e)
                        }
                    }
                }, {
                    key: "reconcile",
                    value: function() {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var r = this.attributes[e],
                                n = this.getNearestKeyframeForAttribute(r, this.group.position.local);
                            n.updateLocalProgress(this.group.position.local), n.snapAtCreation && n.reconcile(r)
                        }
                    }
                }, {
                    key: "determineActiveKeyframes",
                    value: function(e) {
                        var t = this;
                        e = e || h(Array.from(document.documentElement.classList));
                        var r = this._activeKeyframes,
                            n = this.attributes;
                        this._activeKeyframes = [], this.attributes = [], this.keyframes = {};
                        for (var i = 0; i < this._allKeyframes.length; i++) {
                            var o = this._allKeyframes[i];
                            if (o.setEnabled(e)) {
                                this._activeKeyframes.push(o);
                                for (var s in o.animValues) this.keyframes[s] = this.keyframes[s] || [], this.keyframes[s].push(o), this.attributes.indexOf(s) === -1 && (this.attributes.push(s), this.tweenProps[s].isActive = !0)
                            }
                        }
                        var a = r.filter(function(e) {
                            return t._activeKeyframes.indexOf(e) === -1
                        });
                        if (0 !== a.length) {
                            var u = n.filter(function(e) {
                                return t.attributes.indexOf(e) === -1
                            });
                            if (0 !== u.length)
                                if (this.needsWrite = !0, this._ownerIsElement) m.external(function() {
                                    var e = ["x", "y", "z", "scale", "scaleX", "scaleY", "rotation", "rotationX", "rotationY", "rotationZ"],
                                        r = u.filter(function(t) {
                                            return e.indexOf(t) !== -1
                                        });
                                    r.length > 0 && t.element.style.removeProperty("transform");
                                    for (var n = 0, i = u.length; n < i; ++n) {
                                        var o = u[n],
                                            s = t.tweenProps[o];
                                        s.current = s.target = s.initialValue, s.isActive = !1, "opacity" === o && t.element.style.removeProperty("opacity")
                                    }
                                    for (var l = 0, h = a.length; l < h; ++l) {
                                        var f = a[l];
                                        f instanceof c && f._unapply()
                                    }
                                }, !0);
                                else
                                    for (var l = 0, f = u.length; l < f; ++l) {
                                        var p = this.tweenProps[u[l]];
                                        p.current = p.target = p.initialValue, p.isActive = !1
                                    }
                        }
                    }
                }, {
                    key: "onDOMRead",
                    value: function(e) {
                        for (var t = 0, r = this.attributes.length; t < r; t++) {
                            var n = this.attributes[t];
                            this.tweenProps[n].previousValue = this.tweenProps[n].current;
                            var i = this.getNearestKeyframeForAttribute(n, e.local);
                            i && i.onDOMRead(n), this.tweenProps[n].previousValue !== this.tweenProps[n].current && (this.needsWrite = !0)
                        }
                    }
                }, {
                    key: "onDOMWrite",
                    value: function() {
                        (this.needsWrite || this.needsClassUpdate || this.needsStyleUpdate) && (this.needsWrite = !1, this.onDOMWriteImp(), this.handleEventDispatch())
                    }
                }, {
                    key: "onDOMWriteForObject",
                    value: function() {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var r = this.attributes[e];
                            this.element[r] = this.tweenProps[r].current
                        }
                    }
                }, {
                    key: "onDOMWriteForElement",
                    value: function() {
                        var e = this.tweenProps;
                        if (e.z.isActive || e.rotationX.isActive || e.rotationY.isActive) {
                            var t = this.mat4;
                            if (t[0] = 1, t[1] = 0, t[2] = 0, t[3] = 0, t[4] = 0, t[5] = 1, t[6] = 0, t[7] = 0, t[8] = 0, t[9] = 0, t[10] = 1, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, e.x.isActive || e.y.isActive || e.z.isActive) {
                                var r = e.x.current,
                                    n = e.y.current,
                                    i = e.z.current;
                                t[12] = t[0] * r + t[4] * n + t[8] * i + t[12], t[13] = t[1] * r + t[5] * n + t[9] * i + t[13], t[14] = t[2] * r + t[6] * n + t[10] * i + t[14], t[15] = t[3] * r + t[7] * n + t[11] * i + t[15]
                            }
                            if (e.rotation.isActive || e.rotationZ.isActive) {
                                var o = (e.rotation.current || e.rotationZ.current) * v;
                                y.rotateZ(t, t, o)
                            }
                            if (e.rotationX.isActive) {
                                var s = e.rotationX.current * v;
                                y.rotateX(t, t, s)
                            }
                            if (e.rotationY.isActive) {
                                var a = e.rotationY.current * v;
                                y.rotateY(t, t, a)
                            }(e.scale.isActive || e.scaleX.isActive || e.scaleY.isActive) && y.scale(t, t, [e.scale.current, e.scale.current, 1]), this.element.style.transform = "matrix3d(" + t[0] + "," + t[1] + "," + t[2] + "," + t[3] + "," + t[4] + "," + t[5] + "," + t[6] + "," + t[7] + "," + t[8] + "," + t[9] + "," + t[10] + "," + t[11] + "," + t[12] + "," + t[13] + "," + t[14] + "," + t[15] + ")"
                        } else if (e.x.isActive || e.y.isActive || e.rotation.isActive || e.rotationZ.isActive || e.scale.isActive || e.scaleX.isActive || e.scaleY.isActive) {
                            var u = this.mat2d;
                            if (u[0] = 1, u[1] = 0, u[2] = 0, u[3] = 1, u[4] = 0, u[5] = 0, e.x.isActive || e.y.isActive) {
                                var c = e.x.current,
                                    l = e.y.current,
                                    h = u[0],
                                    f = u[1],
                                    p = u[2],
                                    d = u[3],
                                    m = u[4],
                                    _ = u[5];
                                u[0] = h, u[1] = f, u[2] = p, u[3] = d, u[4] = h * c + p * l + m, u[5] = f * c + d * l + _
                            }
                            if (e.rotation.isActive || e.rotationZ.isActive) {
                                var g = (e.rotation.current || e.rotationZ.current) * v,
                                    b = u[0],
                                    E = u[1],
                                    w = u[2],
                                    x = u[3],
                                    A = u[4],
                                    S = u[5],
                                    O = Math.sin(g),
                                    T = Math.cos(g);
                                u[0] = b * T + w * O, u[1] = E * T + x * O, u[2] = b * -O + w * T, u[3] = E * -O + x * T, u[4] = A, u[5] = S
                            }
                            e.scale.isActive ? (u[0] = u[0] * e.scale.current, u[1] = u[1] * e.scale.current, u[2] = u[2] * e.scale.current, u[3] = u[3] * e.scale.current, u[4] = u[4], u[5] = u[5]) : (e.scaleX.isActive || e.scaleY.isActive) && (u[0] = u[0] * e.scaleX.current, u[1] = u[1] * e.scaleX.current, u[2] = u[2] * e.scaleY.current, u[3] = u[3] * e.scaleY.current, u[4] = u[4], u[5] = u[5]), this.element.style.transform = "matrix(" + u[0] + ", " + u[1] + ", " + u[2] + ", " + u[3] + ", " + u[4] + ", " + u[5] + ")"
                        }
                        if (e.opacity.isActive && (this.element.style.opacity = e.opacity.current), this.needsStyleUpdate) {
                            for (var k in this.tweenProps.targetStyles) null !== this.tweenProps.targetStyles[k] && (this.element.style[k] = this.tweenProps.targetStyles[k]), this.tweenProps.targetStyles[k] = null;
                            this.needsStyleUpdate = !1
                        }
                        this.needsClassUpdate && (this.tweenProps.targetClasses.add.length > 0 && this.element.classList.add.apply(this.element.classList, this.tweenProps.targetClasses.add), this.tweenProps.targetClasses.remove.length > 0 && this.element.classList.remove.apply(this.element.classList, this.tweenProps.targetClasses.remove), this.tweenProps.targetClasses.add.length = 0, this.tweenProps.targetClasses.remove.length = 0, this.needsClassUpdate = !1)
                    }
                }, {
                    key: "handleEventDispatch",
                    value: function() {
                        if (0 !== this.keyframesRequiringDispatch.length) {
                            for (var e = 0, t = this.keyframesRequiringDispatch.length; e < t; e++) {
                                var r = this.keyframesRequiringDispatch[e];
                                r.needsEventDispatch = !1, this.eventObject.keyframe = r, this.eventObject.pageMetrics = u.pageMetrics, this.eventObject.event = r.event, this.trigger(r.event, this.eventObject)
                            }
                            this.keyframesRequiringDispatch.length = 0
                        }
                    }
                }, {
                    key: "updateAnimationConstraints",
                    value: function() {
                        for (var e = this, t = 0, r = this._activeKeyframes.length; t < r; t++) this._activeKeyframes[t].updateAnimationConstraints();
                        this.attributes.forEach(function(t) {
                            1 !== e.keyframes[t].length && e.keyframes[t].sort(u.KeyframeComparison)
                        }), this.updateDeferredPropertyValues()
                    }
                }, {
                    key: "refreshMetrics",
                    value: function() {
                        var e = new Set([this.element]);
                        this._parentElementMetrics && e.add(this.element.parentElement), this._allKeyframes.forEach(function(t) {
                            return t.anchors.forEach(function(t) {
                                return e.add(t)
                            })
                        }), this.group.metrics.refreshCollection(e), this.group.keyframesDirty = !0
                    }
                }, {
                    key: "updateDeferredPropertyValues",
                    value: function() {
                        for (var e = 0, t = this.attributes.length; e < t; e++) {
                            var r = this.attributes[e],
                                n = this.keyframes[r],
                                i = n[0];
                            if (!(i.keyframeType > u.KeyframeTypes.InterpolationForward))
                                for (var o = 0, s = n.length; o < s; o++) {
                                    var a = n[o];
                                    if (null === a.jsonProps[r][0]) {
                                        if (0 === o) {
                                            a.animValues[r][0] = this.tweenProps[r].initialValue;
                                            continue
                                        }
                                        a.animValues[r][0] = n[o - 1].animValues[r][1]
                                    }
                                    if (null === a.jsonProps[r][1]) {
                                        if (o === s - 1) throw new RangeError("AnimSystem - last keyframe cannot defer it's end value! " + r + ":[" + a.jsonProps[r][0] + ",null]");
                                        a.animValues[r][1] = n[o + 1].animValues[r][0]
                                    }
                                }
                        }
                    }
                }, {
                    key: "getBounds",
                    value: function(e) {
                        this.boundsMin = Number.MAX_VALUE, this.boundsMax = -Number.MAX_VALUE;
                        for (var t = 0, r = this.attributes.length; t < r; t++)
                            for (var n = this.keyframes[this.attributes[t]], i = 0; i < n.length; i++) {
                                var o = n[i];
                                this.boundsMin = Math.min(o.start, this.boundsMin), this.boundsMax = Math.max(o.end, this.boundsMax), e.min = Math.min(o.start, e.min), e.max = Math.max(o.end, e.max)
                            }
                    }
                }, {
                    key: "getNearestKeyframeForAttribute",
                    value: function(e, t) {
                        t = void 0 !== t ? t : this.group.lastPosition;
                        var r = null,
                            n = Number.POSITIVE_INFINITY,
                            i = this.keyframes[e];
                        if (void 0 === i) return null;
                        var o = i.length;
                        if (0 === o) return null;
                        if (1 === o) return i[0];
                        for (var s = 0; s < o; s++) {
                            var a = i[s];
                            if (a.isInRange(t)) {
                                r = a;
                                break
                            }
                            var u = Math.min(Math.abs(t - a.start), Math.abs(t - a.end));
                            u < n && (n = u, r = a)
                        }
                        return r
                    }
                }, {
                    key: "getAllKeyframesForAttribute",
                    value: function(e) {
                        return this.keyframes[e]
                    }
                }, {
                    key: "updateKeyframe",
                    value: function(e, t) {
                        var r = this;
                        e.parseOptions(t), e.updateAnimationConstraints(), this.group.keyframesDirty = !0, m.update(function() {
                            r.trigger(u.EVENTS.ON_KEYFRAME_UPDATED, e), r.group.trigger(u.EVENTS.ON_KEYFRAME_UPDATED, e)
                        }, !0)
                    }
                }, {
                    key: "removeKeyframe",
                    value: function(e) {
                        var t = this,
                            r = this._allKeyframes.indexOf(e);
                        return r === -1 ? Promise.resolve(null) : (this._allKeyframes.splice(r, 1), this.group.keyframesDirty = !0, new Promise(function(r) {
                            t.group.rafEmitter.executor.eventEmitter.once("before:draw", function() {
                                return r(e)
                            })
                        }))
                    }
                }, {
                    key: "updateAnimation",
                    value: function(e, t) {
                        return this.group.gui && console.warn("KeyframeController.updateAnimation(keyframe,props) has been deprecated. Please use updateKeyframe(keyframe,props)"), this.updateKeyframe(e, t)
                    }
                }]), t
            }(p);
        Object.defineProperty(_.prototype, "parentElementMetrics", {
            get: function() {
                return null === this._parentElementMetrics && (this._parentElementMetrics = this.group.metrics.add(this.element.parentElement)), this._parentElementMetrics
            }
        }), t.exports = _
    }, {
        "../Model/AnimSystemModel": 153,
        "../Model/InferKeyframeFromProps": 156,
        "../Model/UUID": 157,
        "../utils/arrayToObject": 164,
        "./Keyframe": 149,
        "./KeyframeCSSClass": 150,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-raf-emitter/draw": 105,
        "@marcom/ac-raf-emitter/external": 106,
        "@marcom/ac-raf-emitter/update": 109,
        "@marcom/decompose-css-transform": 171,
        "gl-mat4/create": 206,
        "gl-mat4/rotateX": 208,
        "gl-mat4/rotateY": 209,
        "gl-mat4/rotateZ": 210,
        "gl-mat4/scale": 211
    }],
    152: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = function h(e, t, r) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : h(i, t, r)
                }
                if ("value" in n) return n.value;
                var o = n.get;
                if (void 0 !== o) return o.call(r)
            },
            u = e("./Keyframe"),
            c = e("../Model/AnimSystemModel.js"),
            l = function(e) {
                function t(e, r) {
                    n(this, t);
                    var o = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return o.keyframeType = c.KeyframeTypes.Event, o.isApplied = !1, o.hasDuration = !1, o.isCurrentlyInRange = !1, o
                }
                return o(t, e), s(t, [{
                    key: "parseOptions",
                    value: function(e) {
                        e.x = void 0, e.y = void 0, e.scale = void 0, e.scaleX = void 0, e.scaleY = void 0, e.rotation = void 0, e.style = void 0, e.cssClass = void 0, e.rotation = void 0, e.opacity = void 0, e.hold = void 0, void 0 === e.end && (e.end = e.start), this.event = e.event, this.animValues[this.event] = [0, 0], "undefined" == typeof this.controller.tweenProps[this.event] && (this.controller.tweenProps[this.event] = new c.TargetValue(0, 1, (!1))), a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "parseOptions", this).call(this, e), this.keyframeType = c.KeyframeTypes.Event
                    }
                }, {
                    key: "updateLocalProgress",
                    value: function(e) {
                        if (this.hasDuration) {
                            var t = this.isCurrentlyInRange,
                                r = e >= this.start && e <= this.end;
                            if (t === r) return;
                            return this.isCurrentlyInRange = r, void(r && !t ? this._trigger(this.event + ":enter") : t && !r && this._trigger(this.event + ":exit"))
                        }!this.isApplied && e >= this.start ? (this.isApplied = !0, this._trigger(this.event)) : this.isApplied && e < this.start && (this.isApplied = !1, this._trigger(this.event + ":reverse"))
                    }
                }, {
                    key: "_trigger",
                    value: function(e) {
                        this.controller.eventObject.event = e, this.controller.eventObject.keyframe = this, this.controller.trigger(e, this.controller.eventObject)
                    }
                }, {
                    key: "updateAnimationConstraints",
                    value: function() {
                        a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "updateAnimationConstraints", this).call(this), this.hasDuration = this.start !== this.end
                    }
                }, {
                    key: "reset",
                    value: function(e) {
                        this.isApplied = !1, this.isCurrentlyInRange = !1, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "reset", this).call(this, e)
                    }
                }, {
                    key: "onDOMRead",
                    value: function(e, t) {}
                }, {
                    key: "reconcile",
                    value: function(e, t) {}
                }, {
                    key: "updateAnimatedValueConstraints",
                    value: function() {}
                }]), t
            }(u);
        l.DATA_ATTRIBUTE = "data-anim-event", t.exports = l
    }, {
        "../Model/AnimSystemModel.js": 153,
        "./Keyframe": 149
    }],
    153: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = {
            GUI_INSTANCE: null,
            ANIM_INSTANCE: null,
            VIEWPORT_EMITTER_ELEMENT: void 0,
            LOCAL_STORAGE_KEYS: {
                GuiPosition: "GuiPosition-0"
            },
            RESIZE_TIMEOUT: -1,
            BREAKPOINTS: [{
                name: "S",
                mediaQuery: "only screen and (max-width: 735px)"
            }, {
                name: "M",
                mediaQuery: "only screen and (max-width: 1068px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1442px)"
            }, {
                name: "L",
                mediaQuery: "only screen and (min-width: 1069px)"
            }],
            getBreakpoint: function() {
                for (var e = 0; e < i.BREAKPOINTS.length; e++) {
                    var t = i.BREAKPOINTS[e],
                        r = window.matchMedia(t.mediaQuery);
                    if (r.matches) return t.name
                }
            },
            KeyframeDefaults: {
                ease: 1,
                epsilon: .05,
                easeFunctionString: "linear",
                easeFunction: "linear",
                hold: !1,
                snapAtCreation: !1,
                toggle: !1,
                breakpointMask: "SMLX",
                event: "",
                disabledWhen: [],
                cssClass: ""
            },
            KeyframeTypes: {
                Interpolation: 0,
                InterpolationForward: 1,
                CSSClass: 2,
                Event: 3
            },
            EVENTS: {
                ON_DOM_KEYFRAMES_CREATED: "ON_DOM_KEYFRAMES_CREATED",
                ON_DOM_GROUPS_CREATED: "ON_DOM_GROUPS_CREATED",
                ON_GROUP_CREATED: "ON_GROUP_CREATED",
                ON_KEYFRAME_UPDATED: "ON_KEYFRAME_UPDATED",
                ON_TIMELINE_START: "ON_TIMELINE_START",
                ON_TIMELINE_UPDATE: "ON_TIMELINE_UPDATE",
                ON_TIMELINE_COMPLETE: "ON_TIMELINE_COMPLETE"
            },
            PageEvents: {
                ON_SCROLL: "ON_SCROLL",
                ON_RESIZE_IMMEDIATE: "ON_RESIZE_IMMEDIATE",
                ON_RESIZE_DEBOUNCED: "ON_RESIZE_DEBOUNCED",
                ON_BREAKPOINT_CHANGE: "ON_BREAKPOINT_CHANGE"
            },
            KeyframeJSONReservedWords: ["event", "cssClass", "style", "anchors", "start", "end", "epsilon", "easeFunction", "ease", "breakpointMask", "disabledWhen"],
            TweenProps: function o() {
                n(this, o)
            },
            TargetValue: function s(e, t, r) {
                n(this, s), this.epsilon = parseFloat(t), this.snapAtCreation = r, this.initialValue = e, this.target = e, this.current = e, this.previousValue = e, this.isActive = !1
            },
            AnimInfo: function(e, t) {
                var r = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
                this.isGroup = r, this.group = e, this.controller = t, this.controllers = []
            },
            Progress: function() {
                this.local = 0, this.localUnclamped = 0, this.lastPosition = 0
            },
            ViewableRange: function(e, t) {
                this.a = e.top - t, this.a < 0 && (this.a = e.top), this.b = e.top, this.d = e.bottom, this.c = Math.max(this.d - t, this.b)
            },
            pageMetrics: new function() {
                this.scrollX = 0, this.scrollY = 0, this.windowWidth = 0, this.windowHeight = 0, this.documentOffsetX = 0, this.documentOffsetY = 0, this.previousBreakpoint = "", this.breakpoint = ""
            },
            EventObject: function(e) {
                this.controller = e, this.element = this.controller.element, this.keyframe = null, this.event = "", this.tweenProps = this.controller.tweenProps
            },
            KeyframeComparison: function(e, t) {
                return e.start < t.start ? -1 : e.start > t.start ? 1 : 0
            }
        };
        t.exports = i
    }, {}],
    154: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function o() {
            n(this, o), this.linear = function(e) {
                return e
            }, this.easeInQuad = function(e) {
                return e * e
            }, this.easeOutQuad = function(e) {
                return e * (2 - e)
            }, this.easeInOutQuad = function(e) {
                return e < .5 ? 2 * e * e : -1 + (4 - 2 * e) * e
            }, this.easeInSin = function(e) {
                return 1 + Math.sin(Math.PI / 2 * e - Math.PI / 2)
            }, this.easeOutSin = function(e) {
                return Math.sin(Math.PI / 2 * e)
            }, this.easeInOutSin = function(e) {
                return (1 + Math.sin(Math.PI * e - Math.PI / 2)) / 2
            }, this.easeInElastic = function(e) {
                return 0 === e ? e : (.04 - .04 / e) * Math.sin(25 * e) + 1
            }, this.easeOutElastic = function(e) {
                return .04 * e / --e * Math.sin(25 * e)
            }, this.easeInOutElastic = function(e) {
                return (e -= .5) < 0 ? (.02 + .01 / e) * Math.sin(50 * e) : (.02 - .01 / e) * Math.sin(50 * e) + 1
            }, this.easeOutBack = function(e) {
                return e -= 1, e * e * (2.70158 * e + 1.70158) + 1
            }, this.easeInCubic = function(e) {
                return e * e * e
            }, this.easeOutCubic = function(e) {
                return --e * e * e + 1
            }, this.easeInOutCubic = function(e) {
                return e < .5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1
            }, this.easeInQuart = function(e) {
                return e * e * e * e
            }, this.easeOutQuart = function(e) {
                return 1 - --e * e * e * e
            }, this.easeInOutQuart = function(e) {
                return e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e
            }, this.easeInQuint = function(e) {
                return e * e * e * e * e
            }, this.easeOutQuint = function(e) {
                return 1 + --e * e * e * e * e
            }, this.easeInOutQuint = function(e) {
                return e < .5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e
            }
        };
        t.exports = new i
    }, {}],
    155: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = e("./AnimSystemModel"),
            s = function(e, t) {
                return void 0 === e || null === e ? t : e
            },
            a = function() {
                function e() {
                    n(this, e), this._metrics = new WeakMap
                }
                return i(e, [{
                    key: "destroy",
                    value: function() {
                        this._metrics = null
                    }
                }, {
                    key: "add",
                    value: function(e) {
                        var t = this._metrics.get(e);
                        if (t) return t;
                        var r = new u(e);
                        return this._metrics.set(e, r), this._refreshMetrics(e, r)
                    }
                }, {
                    key: "get",
                    value: function(e) {
                        return this._metrics.get(e)
                    }
                }, {
                    key: "refreshCollection",
                    value: function(e) {
                        var t = this;
                        e.forEach(function(e) {
                            return t._refreshMetrics(e, null)
                        })
                    }
                }, {
                    key: "refreshMetrics",
                    value: function(e) {
                        return this._refreshMetrics(e)
                    }
                }, {
                    key: "_refreshMetrics",
                    value: function(e, t) {
                        if (t = t || this._metrics.get(e), !(e instanceof Element)) return t.width = s(e.width, 0), t.height = s(e.height, 0), t.top = s(e.top, 0), t.left = s(e.left, 0), t.right = t.left + t.width, t.bottom = t.top + t.height, t;
                        if (void 0 === e.offsetWidth) {
                            var r = e.getBoundingClientRect();
                            return t.width = r.width, t.height = r.height, t.top = o.pageMetrics.scrollY + r.top, t.left = o.pageMetrics.scrollX + r.left, t.right = t.left + t.width, t.bottom = t.top + t.height, t
                        }
                        t.width = e.offsetWidth, t.height = e.offsetHeight, t.top = o.pageMetrics.documentOffsetY, t.left = o.pageMetrics.documentOffsetX;
                        for (var n = e; n;) t.top += n.offsetTop, t.left += n.offsetLeft, n = n.offsetParent;
                        return t.right = t.left + t.width, t.bottom = t.top + t.height, t
                    }
                }]), e
            }(),
            u = function() {
                function e(t) {
                    n(this, e), this.top = 0, this.bottom = 0, this.left = 0, this.right = 0, this.height = 0, this.width = 0
                }
                return i(e, [{
                    key: "toString",
                    value: function() {
                        return "top:" + this.top + ", bottom:" + this.bottom + ", left:" + this.left + ", right:" + this.right + ", height:" + this.height + ", width:" + this.width
                    }
                }, {
                    key: "toObject",
                    value: function() {
                        return {
                            top: this.top,
                            bottom: this.bottom,
                            left: this.left,
                            right: this.right,
                            height: this.height,
                            width: this.width
                        }
                    }
                }]), e
            }();
        t.exports = a
    }, {
        "./AnimSystemModel": 153
    }],
    156: [function(e, t, r) {
        "use strict";
        var n = e("./AnimSystemModel"),
            i = e("../Keyframes/Keyframe"),
            o = e("../Keyframes/KeyframeDiscreteEvent"),
            s = e("../Keyframes/KeyframeCSSClass"),
            a = function(e) {
                for (var t in e) {
                    var r = e[t];
                    if (n.KeyframeJSONReservedWords.indexOf(t) === -1 && Array.isArray(r)) return !0
                }
                return !1
            };
        t.exports = function(e) {
            if (void 0 !== e.cssClass || void 0 !== e.style) {
                if (a(e)) throw "CSS Keyframes cannot tween values, please use multiple keyframes instead";
                return s
            }
            if (a(e)) return i;
            if (e.event) return o;
            throw "Could not determine tween type based on " + JSON.stringify(e)
        }
    }, {
        "../Keyframes/Keyframe": 149,
        "../Keyframes/KeyframeCSSClass": 150,
        "../Keyframes/KeyframeDiscreteEvent": 152,
        "./AnimSystemModel": 153
    }],
    157: [function(e, t, r) {
        "use strict";
        t.exports = function() {
            for (var e = "", t = 0; t < 8; t++) {
                var r = 16 * Math.random() | 0;
                8 !== t && 12 !== t && 16 !== t && 20 !== t || (e += "-"), e += (12 === t ? 4 : 16 === t ? 3 & r | 8 : r).toString(16)
            }
            return e
        }
    }, {}],
    158: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = 1e-5,
            s = Math.abs,
            a = 5,
            u = function() {
                function e(t, r, i, o) {
                    n(this, e), this.cp = new Float32Array(6), this.cp[0] = 3 * t, this.cp[1] = 3 * (i - t) - this.cp[0], this.cp[2] = 1 - this.cp[0] - this.cp[1],
                        this.cp[3] = 3 * r, this.cp[4] = 3 * (o - r) - this.cp[3], this.cp[5] = 1 - this.cp[3] - this.cp[4]
                }
                return i(e, [{
                    key: "sampleCurveX",
                    value: function(e) {
                        return ((this.cp[2] * e + this.cp[1]) * e + this.cp[0]) * e
                    }
                }, {
                    key: "sampleCurveY",
                    value: function(e) {
                        return ((this.cp[5] * e + this.cp[4]) * e + this.cp[3]) * e
                    }
                }, {
                    key: "sampleCurveDerivativeX",
                    value: function(e) {
                        return (3 * this.cp[2] * e + 2 * this.cp[1]) * e + this.cp[0]
                    }
                }, {
                    key: "solveCurveX",
                    value: function(e) {
                        var t, r, n, i, u, c;
                        for (n = e, c = 0; c < a; c++) {
                            if (i = this.sampleCurveX(n) - e, s(i) < o) return n;
                            if (u = this.sampleCurveDerivativeX(n), s(u) < o) break;
                            n -= i / u
                        }
                        if (t = 0, r = 1, n = e, n < t) return t;
                        if (n > r) return r;
                        for (; t < r;) {
                            if (i = this.sampleCurveX(n), s(i - e) < o) return n;
                            e > i ? t = n : r = n, n = .5 * (r - t) + t
                        }
                        return n
                    }
                }, {
                    key: "solve",
                    value: function(e) {
                        return this.sampleCurveY(this.solveCurveX(e))
                    }
                }]), e
            }(),
            c = /\d*\.?\d+/g;
        u.fromCSSString = function(e) {
            var t = e.match(c);
            if (4 !== t.length) throw "UnitBezier could not convert " + e + " to cubic-bezier";
            var r = t.map(Number),
                n = new u(r[0], r[1], r[2], r[3]);
            return n.solve.bind(n)
        }, t.exports = u
    }, {}],
    159: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = e("../Model/AnimSystemModel"),
            s = e("./Operations"),
            a = /([-|+])?(\d+\.?\d*)(px|vh|vw|%w|%h|%|h|w|a\dt|a\dl|a\db|a\dr|a\dw|a\dh|ph|pw|t|l|b|r])?|([-+*\/])|(a\dt|a\dl|a\db|a\dr|a\dw|a\dh)|([tlbr])/g,
            u = /a(\d)([tlbrhw])/g,
            c = /^[-+]?(?:[0-9]{0,30}\.)?[0-9]{1,30}(?:[Ee][-+]?[1-2]?[0-9])?$/g,
            l = function() {
                function e(t) {
                    n(this, e), this.group = t
                }
                return i(e, [{
                    key: "parseArray",
                    value: function(e, t) {
                        var r = this.parseExpression(e, t[0]),
                            n = this.parseExpression(e, t[1]);
                        return [r, n]
                    }
                }, {
                    key: "parseExpression",
                    value: function(e, t) {
                        if (null === t) return 0;
                        if ("number" == typeof t) return t;
                        for (var r = 5, n = void 0;
                            (n = t.indexOf("(")) !== -1 && --r > 0;) {
                            var i = this.captureParenthesis(t, n),
                                o = this.parseExpression(e, i);
                            t = t.replace("(" + i + ")", o)
                        }
                        for (var u = void 0, c = []; null !== (u = a.exec(t));)
                            if (u.index === a.lastIndex && a.lastIndex++, u[4]) c.push(s.GetOpCode(u[4]));
                            else if (u[5]) {
                            var l = this.parseAnchorUnit(e, 1, u[5]);
                            c.push(l)
                        } else if (u[6]) {
                            var h = this.parseMetric(e, u[6]);
                            c.push(h)
                        } else {
                            var f = u[1],
                                p = parseFloat(u[2]),
                                d = u[3],
                                m = 0;
                            "-" === f && (p *= -1), m = d && "a" === d[0] ? this.parseAnchorUnit(e, p, d) : this.parseSplitUnit(e, p, d), c.push(m)
                        }
                        var v = c.length;
                        if (3 === v && "function" == typeof c[1]) return c[1](c[0], c[2]);
                        for (var y = 0; y < v; y++)
                            if ("function" == typeof c[y] && 1 === c[y].priority) {
                                var _ = c[y - 1],
                                    g = c[y + 1],
                                    b = c[y](_, g);
                                c[y - 1] = null, c[y + 0] = null, c[y + 1] = b, y += 1
                            }
                        for (var E = 0; null === c[E] && E < v;) E += 1;
                        var w = c[E],
                            x = null,
                            A = null;
                        for (E += 1; E < v; E++) null !== c[E] ? c[E] instanceof Function ? x = c[E] : (null === A && (A = c[E]), null !== A && (x = x || s.add, w = x(w, A), x = null, A = null)) : E += 1;
                        return w
                    }
                }, {
                    key: "parseAnchorUnit",
                    value: function(e, t, r) {
                        var n = u.exec(r);
                        u.lastIndex = 0;
                        var i = parseInt(n[1]),
                            o = n[2];
                        if (i + 1 > e.anchors.length) return console.error("AnimSystem.ExpressionParser - invalid anchor[" + i + "] for expression " + JSON.stringify(e.jsonProps) + " on target, not enough anchors", e.controller.element), 0;
                        var s = this.group.metrics.get(e.anchors[i]);
                        switch (o) {
                            case "t":
                                return s.top;
                            case "b":
                                return s.bottom;
                            case "l":
                                return s.left;
                            case "r":
                                return s.right;
                            case "h":
                                return .01 * t * s.height;
                            case "w":
                                return .01 * t * s.width
                        }
                    }
                }, {
                    key: "parseSplitUnit",
                    value: function(e, t, r) {
                        if ("undefined" == typeof r) return parseFloat(t);
                        switch (r) {
                            case "vh":
                                return .01 * t * o.pageMetrics.windowHeight;
                            case "h":
                                return .01 * t * e.controller.elementMetrics.height;
                            case "w":
                                return .01 * t * e.controller.elementMetrics.width;
                            case "%":
                                return .01 * t * e.controller.elementMetrics.height;
                            case "px":
                                return t;
                            case "vw":
                                return .01 * t * o.pageMetrics.windowWidth;
                            case "%w":
                                return .01 * t * e.controller.elementMetrics.width;
                            case "%h":
                                return .01 * t * e.controller.elementMetrics.height;
                            case "pw":
                                return .01 * t * e.controller.parentElementMetrics.width;
                            case "ph":
                                return .01 * t * e.controller.parentElementMetrics.height;
                            default:
                                throw new Error("ExpressionParser: no strategy found for unit `" + r + "` only `vh, vw, %, %w, %h, t, l, b, r, a#h, a#w` are supported (ph/pw have been removed. Use anchors[] in their place)")
                        }
                    }
                }, {
                    key: "parseMetric",
                    value: function(e, t) {
                        switch (t) {
                            case "t":
                                return e.controller.elementMetrics.top;
                            case "l":
                                return e.controller.elementMetrics.left;
                            case "b":
                                return e.controller.elementMetrics.bottom;
                            case "r":
                                return e.controller.elementMetrics.right
                        }
                    }
                }, {
                    key: "captureParenthesis",
                    value: function(e, t) {
                        for (var r = "", n = 0, i = !1, o = e.length, s = t; s < o; s++)
                            if ("(" === e[s] ? (n += 1, i && (r += e[s]), i = !0) : ")" === e[s] ? (n -= 1, 0 !== n && (r += e[s])) : i && (r += e[s]), i && 0 === n) return r
                    }
                }, {
                    key: "isUnitlessNumber",
                    value: function(e) {
                        return String(e).match(c)
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.group = null
                    }
                }, {
                    key: "logParts",
                    value: function(e) {
                        console.log(e.reduce(function(e, t) {
                            return "function" == typeof t ? e + t.friendlyName + " " : e + (t + " ")
                        }, ""))
                    }
                }]), e
            }();
        t.exports = l
    }, {
        "../Model/AnimSystemModel": 153,
        "./Operations": 160
    }],
    160: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function o() {
            n(this, o), this.add = function(e, t) {
                return e + t
            }, this.sub = function(e, t) {
                return e - t
            }, this.mul = function(e, t) {
                return e * t
            }, this.div = function(e, t) {
                return e / t
            }, this.add.friendlyName = "add", this.sub.friendlyName = "sub", this.mul.friendlyName = "mul", this.div.friendlyName = "div", this.add.priority = 0, this.sub.priority = 0, this.mul.priority = 1, this.div.priority = 1, this.GetOpCode = function(e) {
                switch (e) {
                    case "-":
                        return this.sub;
                    case "+":
                        return this.add;
                    case "*":
                        return this.mul;
                    case "/":
                        return this.div;
                    default:
                        throw new Error('AnimSystem.parsing.Operations - op code "' + e + "\" was found. Only '+ - * /' are supported. Check expression for typos/spacing issues")
                }
            }
        };
        t.exports = new i
    }, {}],
    161: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = function() {
                function e(t) {
                    n(this, e), this.group = t
                }
                return i(e, [{
                    key: "parse",
                    value: function(e, t) {
                        if ("number" == typeof t) return t;
                        var r = this.group.expressionParser.parseExpression(e, t);
                        return this.group.convertScrollPositionToTValue(r)
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.group = null
                    }
                }]), e
            }();
        t.exports = o
    }, {}],
    162: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = function _(e, t, r) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : _(i, t, r)
                }
                if ("value" in n) return n.value;
                var o = n.get;
                if (void 0 !== o) return o.call(r)
            },
            u = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            c = e("@marcom/sm-math-utils"),
            l = e("./utils/arrayToObject"),
            h = e("./Model/AnimSystemModel"),
            f = e("./Model/ElementMetricsLookup"),
            p = e("./Parsing/ExpressionParser"),
            d = e("./Parsing/TimeParser"),
            m = e("./Keyframes/KeyframeController"),
            v = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter"),
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            y = function(e) {
                function t(e, r) {
                    n(this, t);
                    var o = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return o.anim = r, o.element = e, o.name = o.name || e.getAttribute("data-anim-scroll-group"), o.isEnabled = !0, o.position = new h.Progress, o.metrics = new f, o.metrics.add(o.element), o.expressionParser = new p(o), o.timeParser = new d(o), o.boundsMin = 0, o.boundsMax = 0, o.timelineUpdateRequired = !1, o._keyframesDirty = !1, o.viewableRange = o.createViewableRange(), o.defaultEase = h.KeyframeDefaults.ease, o.keyframeControllers = [], o.updateProgress(o.getPosition()), o.onDOMRead = o.onDOMRead.bind(o), o.onDOMWrite = o.onDOMWrite.bind(o), o.gui = null, o.finalizeInit(), o
                }
                return o(t, e), s(t, [{
                    key: "finalizeInit",
                    value: function() {
                        this.element._animInfo = new h.AnimInfo(this, null, (!0)), this.setupRAFEmitter()
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.expressionParser.destroy(), this.expressionParser = null, this.timeParser.destroy(), this.timeParser = null;
                        for (var e = 0, r = this.keyframeControllers.length; e < r; e++) this.keyframeControllers[e].destroy();
                        this.keyframeControllers = null, this.position = null, this.viewableRange = null, this.gui && (this.gui.destroy(), this.gui = null), this.metrics.destroy(), this.metrics = null, this.rafEmitter.destroy(), this.rafEmitter = null, this.anim = null, this.element._animInfo && this.element._animInfo.group === this && (this.element._animInfo.group = null, this.element._animInfo = null), this.element = null, this.isEnabled = !1, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "removeKeyframeController",
                    value: function(e) {
                        var t = this;
                        if (!this.keyframeControllers.includes(e)) return Promise.resolve();
                        var r = e._allKeyframes;
                        return e._allKeyframes = [], this.keyframesDirty = !0, new Promise(function(n) {
                            v.draw(function() {
                                var i = t.keyframeControllers.indexOf(e);
                                return i === -1 ? void n() : (t.keyframeControllers.splice(i, 1), e.onDOMWrite(), r.forEach(function(e) {
                                    return e.destroy()
                                }), e.destroy(), t.gui && t.gui.create(), void n())
                            }, !0)
                        })
                    }
                }, {
                    key: "remove",
                    value: function() {
                        return this.anim.removeGroup(this)
                    }
                }, {
                    key: "setupRAFEmitter",
                    value: function(e) {
                        var t = this;
                        this.rafEmitter && this.rafEmitter.destroy(), this.rafEmitter = e || new v.create, this.rafEmitter.on("update", this.onDOMRead), this.rafEmitter.on("draw", this.onDOMWrite), this.rafEmitter.once("external", function() {
                            return t.reconcile()
                        })
                    }
                }, {
                    key: "requestDOMChange",
                    value: function() {
                        return !!this.isEnabled && this.rafEmitter.run()
                    }
                }, {
                    key: "onDOMRead",
                    value: function() {
                        this.keyframesDirty && this.onKeyframesDirty();
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].onDOMRead(this.position)
                    }
                }, {
                    key: "onDOMWrite",
                    value: function() {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].onDOMWrite(this.position);
                        this.needsUpdate() && this.requestDOMChange()
                    }
                }, {
                    key: "needsUpdate",
                    value: function() {
                        if (this._keyframesDirty) return !0;
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++)
                            if (this.keyframeControllers[e].needsUpdate()) return !0;
                        return !1
                    }
                }, {
                    key: "addKeyframe",
                    value: function(e, t) {
                        var r = this.getControllerForTarget(e);
                        return null === r && (r = new m(this, e), this.keyframeControllers.push(r)), this.keyframesDirty = !0, r.addKeyframe(t)
                    }
                }, {
                    key: "forceUpdate",
                    value: function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            t = e.waitForNextUpdate,
                            r = void 0 === t || t,
                            n = e.silent,
                            i = void 0 !== n && n;
                        this.isEnabled && (this.refreshMetrics(), this.timelineUpdateRequired = !0, r ? this.keyframesDirty = !0 : this.onKeyframesDirty({
                            silent: i
                        }))
                    }
                }, {
                    key: "onKeyframesDirty",
                    value: function() {
                        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                            t = e.silent,
                            r = void 0 !== t && t;
                        this.determineActiveKeyframes(), this.keyframesDirty = !1;
                        for (var n = 0, i = this.keyframeControllers.length; n < i; n++) this.keyframeControllers[n].updateAnimationConstraints();
                        this.updateProgress(this.getPosition()), this.updateBounds(), r || this._onScroll(), this.gui && this.gui.create()
                    }
                }, {
                    key: "refreshMetrics",
                    value: function() {
                        var e = new Set([this.element]);
                        this.keyframeControllers.forEach(function(t) {
                            e.add(t.element), t._parentElementMetrics && e.add(t.element.parentElement), t._allKeyframes.forEach(function(t) {
                                return t.anchors.forEach(function(t) {
                                    return e.add(t)
                                })
                            })
                        }), this.metrics.refreshCollection(e), this.viewableRange = this.createViewableRange()
                    }
                }, {
                    key: "reconcile",
                    value: function() {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].reconcile()
                    }
                }, {
                    key: "determineActiveKeyframes",
                    value: function(e) {
                        e = e || l(Array.from(document.documentElement.classList));
                        for (var t = 0, r = this.keyframeControllers.length; t < r; t++) this.keyframeControllers[t].determineActiveKeyframes(e)
                    }
                }, {
                    key: "updateBounds",
                    value: function() {
                        if (0 === this.keyframeControllers.length) return this.boundsMin = 0, void(this.boundsMax = 0);
                        for (var e = {
                                min: Number.POSITIVE_INFINITY,
                                max: Number.NEGATIVE_INFINITY
                            }, t = 0, r = this.keyframeControllers.length; t < r; t++) this.keyframeControllers[t].getBounds(e);
                        var n = this.convertTValueToScrollPosition(e.min),
                            i = this.convertTValueToScrollPosition(e.max);
                        i - n < h.pageMetrics.windowHeight ? (e.min = this.convertScrollPositionToTValue(n - .5 * h.pageMetrics.windowHeight), e.max = this.convertScrollPositionToTValue(i + .5 * h.pageMetrics.windowHeight)) : (e.min -= .001, e.max += .001), this.boundsMin = e.min, this.boundsMax = e.max, this.timelineUpdateRequired = !0
                    }
                }, {
                    key: "createViewableRange",
                    value: function() {
                        return new h.ViewableRange(this.metrics.get(this.element), h.pageMetrics.windowHeight)
                    }
                }, {
                    key: "_onBreakpointChange",
                    value: function(e, t) {
                        this.keyframesDirty = !0, this.determineActiveKeyframes()
                    }
                }, {
                    key: "updateProgress",
                    value: function(e) {
                        return this.hasDuration() ? void(this.position.localUnclamped = (e - this.viewableRange.a) / (this.viewableRange.d - this.viewableRange.a)) : void(this.position.local = this.position.localUnclamped = 0)
                    }
                }, {
                    key: "performTimelineDispatch",
                    value: function() {
                        for (var e = 0, t = this.keyframeControllers.length; e < t; e++) this.keyframeControllers[e].updateLocalProgress(this.position.local);
                        this.trigger(h.EVENTS.ON_TIMELINE_UPDATE, this.position.local), this.timelineUpdateRequired = !1, this.position.lastPosition !== this.position.local && (this.position.lastPosition <= this.boundsMin && this.position.localUnclamped > this.boundsMin ? this.trigger(h.EVENTS.ON_TIMELINE_START, this) : this.position.lastPosition >= this.boundsMin && this.position.localUnclamped < this.boundsMin ? this.trigger(h.EVENTS.ON_TIMELINE_START + ":reverse", this) : this.position.lastPosition <= this.boundsMax && this.position.localUnclamped >= this.boundsMax ? this.trigger(h.EVENTS.ON_TIMELINE_COMPLETE, this) : this.position.lastPosition >= this.boundsMax && this.position.localUnclamped < this.boundsMax && this.trigger(h.EVENTS.ON_TIMELINE_COMPLETE + ":reverse", this)), null !== this.gui && this.gui.onScrollUpdate(this.position)
                    }
                }, {
                    key: "_onScroll",
                    value: function(e) {
                        if (!this.isEnabled) return !1;
                        void 0 === e && (e = this.getPosition()), this.updateProgress(e);
                        var t = this.position.lastPosition === this.boundsMin || this.position.lastPosition === this.boundsMax,
                            r = this.position.localUnclamped === this.boundsMin || this.position.localUnclamped === this.boundsMax;
                        if (!this.timelineUpdateRequired && t && r && this.position.lastPosition === e) return void(this.position.local = this.position.localUnclamped);
                        if (this.timelineUpdateRequired || this.position.localUnclamped > this.boundsMin && this.position.localUnclamped < this.boundsMax) return this.position.local = c.clamp(this.position.localUnclamped, this.boundsMin, this.boundsMax), this.performTimelineDispatch(), this.requestDOMChange(), void(this.position.lastPosition = this.position.localUnclamped);
                        var n = this.position.lastPosition > this.boundsMin && this.position.lastPosition < this.boundsMax,
                            i = this.position.localUnclamped <= this.boundsMin || this.position.localUnclamped >= this.boundsMax;
                        return n && i ? (this.position.local = c.clamp(this.position.localUnclamped, this.boundsMin, this.boundsMax), this.performTimelineDispatch(), this.requestDOMChange(), void(this.position.lastPosition = this.position.localUnclamped)) : void(null !== this.gui && this.gui.onScrollUpdate(this.position))
                    }
                }, {
                    key: "convertScrollPositionToTValue",
                    value: function(e) {
                        return this.hasDuration() ? c.map(e, this.viewableRange.a, this.viewableRange.d, 0, 1) : 0
                    }
                }, {
                    key: "convertTValueToScrollPosition",
                    value: function(e) {
                        return this.hasDuration() ? c.map(e, 0, 1, this.viewableRange.a, this.viewableRange.d) : 0
                    }
                }, {
                    key: "hasDuration",
                    value: function() {
                        return this.viewableRange.a !== this.viewableRange.d
                    }
                }, {
                    key: "getPosition",
                    value: function() {
                        return h.pageMetrics.scrollY
                    }
                }, {
                    key: "getControllerForTarget",
                    value: function(e) {
                        if (!e._animInfo || !e._animInfo.controllers) return null;
                        if (e._animInfo.controller && e._animInfo.controller.group === this) return e._animInfo.controller;
                        for (var t = e._animInfo.controllers, r = 0, n = t.length; r < n; r++)
                            if (t[r].group === this) return t[r];
                        return null
                    }
                }, {
                    key: "trigger",
                    value: function(e, t) {
                        if ("undefined" != typeof this._events[e])
                            for (var r = this._events[e].length - 1; r >= 0; r--) void 0 !== t ? this._events[e][r](t) : this._events[e][r]()
                    }
                }, {
                    key: "keyframesDirty",
                    set: function(e) {
                        this._keyframesDirty = e, this._keyframesDirty && this.requestDOMChange()
                    },
                    get: function() {
                        return this._keyframesDirty
                    }
                }, {
                    key: "keyFrames",
                    get: function() {
                        return this.viewableRange
                    }
                }]), t
            }(u);
        t.exports = y
    }, {
        "./Keyframes/KeyframeController": 151,
        "./Model/AnimSystemModel": 153,
        "./Model/ElementMetricsLookup": 155,
        "./Parsing/ExpressionParser": 159,
        "./Parsing/TimeParser": 161,
        "./utils/arrayToObject": 164,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-raf-emitter/RAFEmitter": 99,
        "@marcom/ac-raf-emitter/draw": 105,
        "@marcom/ac-raf-emitter/update": 109,
        "@marcom/sm-math-utils": 175
    }],
    163: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = function p(e, t, r) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : p(i, t, r)
                }
                if ("value" in n) return n.value;
                var o = n.get;
                if (void 0 !== o) return o.call(r)
            },
            u = e("./ScrollGroup"),
            c = e("@marcom/sm-math-utils"),
            l = 0,
            h = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter")
            },
            f = function(e) {
                function t(e, r) {
                    n(this, t), e || (e = document.createElement("div"), e.className = "TimeGroup-" + l++);
                    var o = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e, r));
                    return o.name = o.name || e.getAttribute("data-anim-time-group"), o._isPaused = !0, o._repeats = 0, o._isReversed = !1, o._timeScale = 1, o
                }
                return o(t, e), s(t, [{
                    key: "finalizeInit",
                    value: function() {
                        if (!this.anim) throw "TimeGroup not instantiated correctly. Please use `AnimSystem.createTimeGroup(el)`";
                        this.defaultEase = 1, this.onPlayTimeUpdate = this.onPlayTimeUpdate.bind(this), a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "finalizeInit", this).call(this)
                    }
                }, {
                    key: "progress",
                    value: function(e) {
                        if (void 0 === e) return 0 === this.boundsMax ? 0 : this.position.local / this.boundsMax;
                        var t = e * this.boundsMax;
                        this.timelineUpdateRequired = !0, this._onScroll(t)
                    }
                }, {
                    key: "time",
                    value: function(e) {
                        return void 0 === e ? this.position.local : (e = c.clamp(e, this.boundsMin, this.boundsMax), this.timelineUpdateRequired = !0, void this._onScroll(e))
                    }
                }, {
                    key: "play",
                    value: function(e) {
                        this.reversed(!1), this.isEnabled = !0, this._isPaused = !1, this.time(e), this._playheadEmitter.run()
                    }
                }, {
                    key: "reverse",
                    value: function(e) {
                        this.reversed(!0), this.isEnabled = !0, this._isPaused = !1, this.time(e), this._playheadEmitter.run()
                    }
                }, {
                    key: "reversed",
                    value: function(e) {
                        return void 0 === e ? this._isReversed : void(this._isReversed = e)
                    }
                }, {
                    key: "restart",
                    value: function() {
                        this._isReversed ? (this.progress(1), this.reverse(this.time())) : (this.progress(0), this.play(this.time()))
                    }
                }, {
                    key: "pause",
                    value: function(e) {
                        this.time(e), this._isPaused = !0
                    }
                }, {
                    key: "paused",
                    value: function(e) {
                        return void 0 === e ? this._isPaused : (this._isPaused = e, this._isPaused || this.play(), this)
                    }
                }, {
                    key: "onPlayTimeUpdate",
                    value: function(e) {
                        if (!this._isPaused) {
                            var r = c.clamp(e.delta / 1e3, 0, .5);
                            this._isReversed && (r = -r);
                            var n = this.time(),
                                i = n + r * this._timeScale;
                            if (this._repeats === t.REPEAT_FOREVER || this._repeats > 0) {
                                var o = !1;
                                !this._isReversed && i > this.boundsMax ? (i -= this.boundsMax, o = !0) : this._isReversed && i < 0 && (i = this.boundsMax + i, o = !0), o && (this._repeats = this._repeats === t.REPEAT_FOREVER ? t.REPEAT_FOREVER : this._repeats - 1)
                            }
                            this.time(i);
                            var s = !this._isReversed && this.position.local !== this.duration,
                                a = this._isReversed && 0 !== this.position.local;
                            s || a ? this._playheadEmitter.run() : this.paused(!0)
                        }
                    }
                }, {
                    key: "updateProgress",
                    value: function(e) {
                        return this.hasDuration() ? void(this.position.localUnclamped = e) : void(this.position.local = this.position.localUnclamped = 0)
                    }
                }, {
                    key: "updateBounds",
                    value: function() {
                        if (0 === this.keyframeControllers.length) return this.boundsMin = 0, void(this.boundsMax = 0);
                        for (var e = {
                                min: Number.POSITIVE_INFINITY,
                                max: Number.NEGATIVE_INFINITY
                            }, t = 0, r = this.keyframeControllers.length; t < r; t++) this.keyframeControllers[t].getBounds(e);
                        this.boundsMin = 0, this.boundsMax = e.max, this.viewableRange.a = this.viewableRange.b = 0, this.viewableRange.c = this.viewableRange.d = this.boundsMax, this.timelineUpdateRequired = !0
                    }
                }, {
                    key: "setupRAFEmitter",
                    value: function(e) {
                        this._playheadEmitter = new h.create, this._playheadEmitter.on("update", this.onPlayTimeUpdate), a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "setupRAFEmitter", this).call(this, e)
                    }
                }, {
                    key: "needsUpdate",
                    value: function() {
                        return !0
                    }
                }, {
                    key: "timeScale",
                    value: function(e) {
                        return void 0 === e ? this._timeScale : (this._timeScale = e, this)
                    }
                }, {
                    key: "repeats",
                    value: function(e) {
                        return void 0 === e ? this._repeats : void(this._repeats = e)
                    }
                }, {
                    key: "getPosition",
                    value: function() {
                        return this.position.local
                    }
                }, {
                    key: "convertScrollPositionToTValue",
                    value: function(e) {
                        return e
                    }
                }, {
                    key: "convertTValueToScrollPosition",
                    value: function(e) {
                        return e
                    }
                }, {
                    key: "hasDuration",
                    value: function() {
                        return this.duration > 0
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this._playheadEmitter.destroy(), this._playheadEmitter = null, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "duration",
                    get: function() {
                        return this.keyframesDirty && this.onKeyframesDirty({
                            silent: !0
                        }), this.boundsMax
                    }
                }]), t
            }(u);
        f.REPEAT_FOREVER = -1, t.exports = f
    }, {
        "./ScrollGroup": 162,
        "@marcom/ac-raf-emitter/RAFEmitter": 99,
        "@marcom/sm-math-utils": 175
    }],
    164: [function(e, t, r) {
        "use strict";
        var n = function(e) {
            return e.reduce(function(e, t) {
                return e[t] = t, e
            }, {})
        };
        t.exports = n
    }, {}],
    165: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = e("./SourceTemplate.js"),
            s = e("@marcom/xhr-request"),
            a = Object.freeze({
                responseType: "blob"
            }),
            u = function() {
                function e(t) {
                    n(this, e), t = Object.assign({}, t), this._requestOptions = Object.assign({}, a, t.xhr), this._template = new o(t), this._evtObserver = null, this._state = {
                        viewport: t.viewport,
                        resolution: t.resolution,
                        request: null,
                        objectUrl: ""
                    }, this._requestCache = new Map, this._history = [], this._initialize()
                }
                return i(e, null, [{
                    key: "convertToResolution",
                    value: function(e) {
                        return "boolean" != typeof e ? null : e ? "2x" : "1x"
                    }
                }, {
                    key: "convertViewportName",
                    value: function(e, t) {
                        return "L" === e || t !== !0 && "xlarge" === e ? "large" : "M" === e ? "medium" : "S" === e ? "small" : e
                    }
                }]), i(e, [{
                    key: "load",
                    value: function() {
                        var e = this,
                            t = this._state.request,
                            r = t.xhr.response,
                            n = !r,
                            i = void 0;
                        return i = n ? t.send() : 200 === t.xhr.status ? Promise.resolve({
                            response: r
                        }) : Promise.reject({
                            error: this._state.requestErr
                        }), i.then(function(t) {
                            var r = t.response;
                            return "blob" === e._requestOptions.responseType && (e._state.objectUrl = r = window.URL.createObjectURL(t.response), e._updateHistory()), Promise.resolve(r)
                        }, function(t) {
                            var r = e._state.requestErr = t.error;
                            return Promise.reject(r)
                        })
                    }
                }, {
                    key: "change",
                    value: function(t, r) {
                        t = t.toLowerCase(), "viewport" !== t && "resolution" !== t || ("viewport" === t ? r = e.convertViewportName(r) : "boolean" == typeof r && (r = e.convertToResolution(r)), this._state[t] = r, this._createOpenRequest())
                    }
                }, {
                    key: "abortLoad",
                    value: function() {
                        this._state.request.xhr.abort()
                    }
                }, {
                    key: "revokeLastObjectUrl",
                    value: function() {
                        if ("blob" === this._requestOptions.responseType) {
                            var e = this._history.length,
                                t = 2,
                                r = e - t;
                            if (r < 0) return;
                            var n = this._history[r];
                            window.URL.revokeObjectURL(n.objectUrl)
                        }
                    }
                }, {
                    key: "_createOpenRequest",
                    value: function() {
                        var e = this._state,
                            t = e.viewport + "_" + e.resolution,
                            r = this._requestCache.get(t);
                        if (!r) {
                            var n = this._template.createPath(e.viewport, e.resolution);
                            r = new s(n, this._requestOptions), this._requestCache.set(t, r), r.open()
                        }
                        e.request = r
                    }
                }, {
                    key: "_initialize",
                    value: function() {
                        this._createOpenRequest()
                    }
                }, {
                    key: "_updateHistory",
                    value: function() {
                        this._history.push(Object.assign({}, this._state))
                    }
                }, {
                    key: "_revokeAllObjectUrls",
                    value: function() {
                        "blob" === this._requestOptions.responseType && this._history.forEach(function(e) {
                            window.URL.revokeObjectURL(e.objectUrl)
                        })
                    }
                }, {
                    key: "request",
                    get: function() {
                        return this._state.request
                    }
                }, {
                    key: "assetUrl",
                    get: function() {
                        return this._state.request.requestUrl
                    }
                }, {
                    key: "objectUrl",
                    get: function() {
                        return this._state.objectUrl
                    }
                }, {
                    key: "viewport",
                    get: function() {
                        return this._state.viewport
                    }
                }, {
                    key: "resolution",
                    get: function() {
                        return this._state.resolution
                    }
                }, {
                    key: "requestCache",
                    get: function() {
                        return this._requestCache
                    }
                }, {
                    key: "history",
                    get: function() {
                        return this._history
                    }
                }]), e
            }();
        t.exports = u
    }, {
        "./SourceTemplate.js": 166,
        "@marcom/xhr-request": 191
    }],
    166: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e) {
            var t = new Map;
            return e.forEach(function(e, r) {
                t.set(r, e)
            }), t
        }
        var o = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            s = e("./model"),
            a = function() {
                function e(t) {
                    n(this, e), t = Object.assign({}, t), this._template = "", this._model = t.model || s, this._state = {
                        viewport: "",
                        resolution: ""
                    }, this._initialize(t)
                }
                return o(e, null, [{
                    key: "formatPathSegment",
                    value: function(e) {
                        var t = /^\s*\/*\s*|\s*\/*\s*$/g;
                        return "/" + e.replace(t, "")
                    }
                }]), o(e, [{
                    key: "createPath",
                    value: function(e, t) {
                        this._updateState(e, t);
                        var r = this._model.TEMPLATE_PLACEHOLDERS;
                        return t = "1x" === t ? "" : "_" + t, this._template.replace(r.viewport, e).replace(r.resolution, t)
                    }
                }, {
                    key: "changeViewport",
                    value: function(e) {
                        return this.createPath(e, this._state.resolution)
                    }
                }, {
                    key: "changeResolution",
                    value: function(e) {
                        return this.createPath(this._state.viewport, e)
                    }
                }, {
                    key: "_initialize",
                    value: function(e) {
                        var t = this._setSegmentValues(e);
                        this._template = this._createTemplate(t)
                    }
                }, {
                    key: "_setSegmentValues",
                    value: function(e) {
                        var t = e.el,
                            r = this._model,
                            n = i(r.SEGMENT_MAP);
                        return n.forEach(function(n, i, o) {
                            var s = e[i];
                            n = s ? s : n;
                            var a = r.ATTRIB[i];
                            n = a && t && t.hasAttribute(a) ? t.getAttribute(a) : n, o.set(i, n)
                        }), n
                    }
                }, {
                    key: "_createTemplate",
                    value: function(t) {
                        var r = "",
                            n = this._model.TEMPLATE_PLACEHOLDERS;
                        return t.forEach(function(t, i) {
                            r += "viewport" === i ? e.formatPathSegment(n.viewport) : "resolution" === i ? n.resolution : "format" === i ? "." + t : e.formatPathSegment(t)
                        }), r
                    }
                }, {
                    key: "_updateState",
                    value: function(e, t) {
                        this._state.viewport = e, this._state.resolution = t
                    }
                }, {
                    key: "viewport",
                    get: function() {
                        return this._state.viewport
                    }
                }, {
                    key: "resolution",
                    get: function() {
                        return this._state.resolution
                    }
                }]), e
            }();
        t.exports = a
    }, {
        "./model": 167
    }],
    167: [function(e, t, r) {
        "use strict";

        function n() {
            var e = new Map;
            return e.set("basePath", "/105/media/"), e.set("locale", "us"), e.set("path", ""), e.set("name", ""), e.set("viewport", ""), e.set("resolution", ""), e.set("format", "mp4"), e
        }
        t.exports = {
            ATTRIB: {
                resolution: "data-source-resolution",
                viewport: "data-source-viewport",
                basePath: "data-source-basePath",
                locale: "data-source-locale",
                path: "data-source-path",
                name: "data-source-name"
            },
            TEMPLATE_PLACEHOLDERS: {
                viewport: "{{viewport}}",
                resolution: "{{resolution}}"
            },
            SEGMENT_MAP: n()
        }
    }, {}],
    168: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = function d(e, t, r) {
                null === e && (e = Function.prototype);
                var n = Object.getOwnPropertyDescriptor(e, t);
                if (void 0 === n) {
                    var i = Object.getPrototypeOf(e);
                    return null === i ? void 0 : d(i, t, r)
                }
                if ("value" in n) return n.value;
                var o = n.get;
                if (void 0 !== o) return o.call(r)
            },
            u = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            c = e("@marcom/anim-system/Model/AnimSystemModel"),
            l = {
                create: e("@marcom/ac-raf-emitter/RAFEmitter"),
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            h = function() {},
            f = 0,
            p = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return r.el = e.el, r.gum = e.gum, r.componentName = e.componentName, r._keyframeController = null, r
                }
                return o(t, e), s(t, [{
                    key: "destroy",
                    value: function() {
                        this.el = null, this.gum = null, this._keyframeController = null, a(t.prototype.__proto__ || Object.getPrototypeOf(t.prototype), "destroy", this).call(this)
                    }
                }, {
                    key: "addKeyframe",
                    value: function(e) {
                        var t = e.el || this.el;
                        return (e.group || this.anim).addKeyframe(t, e)
                    }
                }, {
                    key: "addDiscreteEvent",
                    value: function(e) {
                        e.event = e.event || "Generic-Event-Name-" + f++;
                        var t = void 0 !== e.end && e.end !== e.start,
                            r = this.addKeyframe(e);
                        return t ? (e.onEnterOnce && r.controller.once(e.event + ":enter", e.onEnterOnce), e.onExitOnce && r.controller.once(e.event + ":exit", e.onExitOnce), e.onEnter && r.controller.on(e.event + ":enter", e.onEnter), e.onExit && r.controller.on(e.event + ":exit", e.onExit)) : (e.onEventOnce && r.controller.once(e.event, e.onEventOnce), e.onEventReverseOnce && r.controller.once(e.event + ":reverse", e.onEventReverseOnce), e.onEvent && r.controller.on(e.event, e.onEvent), e.onEventReverse && r.controller.on(e.event + ":reverse", e.onEventReverse)), r
                    }
                }, {
                    key: "addRAFLoop",
                    value: function(e) {
                        var t = ["start", "end"];
                        if (!t.every(function(t) {
                                return e.hasOwnProperty(t)
                            })) return void console.log("BubbleGum.BaseComponent::addRAFLoop required options are missing: " + t.join(" "));
                        var r = new l.create;
                        r.on("update", e.onUpdate || h), r.on("draw", e.onDraw || h), r.on("draw", function() {
                            return r.run()
                        });
                        var n = e.onEnter,
                            i = e.onExit;
                        return e.onEnter = function() {
                            r.run(), n ? n() : 0
                        }, e.onExit = function() {
                            r.cancel(), i ? i() : 0
                        }, this.addDiscreteEvent(e)
                    }
                }, {
                    key: "addContinuousEvent",
                    value: function(e) {
                        e.onDraw || console.log("BubbleGum.BaseComponent::addContinuousEvent required option `onDraw` is missing. Consider using a regular keyframe if you do not need a callback"), e.event = e.event || "Generic-Event-Name-" + f++;
                        var t = this.addKeyframe(e);
                        return t.controller.on(e.event, e.onDraw), t
                    }
                }, {
                    key: "mounted",
                    value: function() {}
                }, {
                    key: "onResizeImmediate",
                    value: function(e) {}
                }, {
                    key: "onResizeDebounced",
                    value: function(e) {}
                }, {
                    key: "onBreakpointChange",
                    value: function(e) {}
                }, {
                    key: "anim",
                    get: function() {
                        return this.gum.anim
                    }
                }, {
                    key: "keyframeController",
                    get: function() {
                        return this._keyframeController || (this._keyframeController = this.anim.getControllerForTarget(this.el))
                    }
                }, {
                    key: "pageMetrics",
                    get: function() {
                        return c.pageMetrics
                    }
                }]), t
            }(u);
        t.exports = p
    }, {
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-raf-emitter/RAFEmitter": 99,
        "@marcom/ac-raf-emitter/draw": 105,
        "@marcom/ac-raf-emitter/update": 109,
        "@marcom/anim-system/Model/AnimSystemModel": 153
    }],
    169: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            u = e("@marcom/delayed-initializer"),
            c = e("@marcom/anim-system"),
            l = e("@marcom/anim-system/Model/AnimSystemModel"),
            h = e("./ComponentMap"),
            f = {},
            p = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return r.el = e, r.anim = c, r.components = [], r.el.getAttribute("data-anim-scroll-group") || r.el.setAttribute("data-anim-scroll-group", "bubble-gum-group"), c.on(l.EVENTS.ON_DOM_GROUPS_CREATED, function(e) {
                        r.componentsInitialized = !1, r.initComponents(), r.setupEvents()
                    }), c.on(l.EVENTS.ON_DOM_KEYFRAMES_CREATED, function() {
                        r.components.forEach(function(e) {
                            return e.mounted()
                        }), r.trigger(t.EVENTS.DOM_COMPONENTS_MOUNTED)
                    }), u.add(function() {
                        return c.initialize()
                    }), r
                }
                return o(t, e), s(t, [{
                    key: "initComponents",
                    value: function() {
                        var e = Array.prototype.slice.call(this.el.querySelectorAll("[data-component-list]"));
                        this.el.hasAttribute("data-component-list") && e.push(this.el);
                        for (var t = 0; t < e.length; t++)
                            for (var r = e[t], n = r.getAttribute("data-component-list"), i = n.split(" "), o = 0, s = i.length; o < s; o++) {
                                var a = i[o];
                                "" !== a && " " !== a && this.addComponent({
                                    el: r,
                                    componentName: a
                                })
                            }
                        this.componentsInitialized = !0
                    }
                }, {
                    key: "setupEvents",
                    value: function() {
                        this.onResizeDebounced = this.onResizeDebounced.bind(this), this.onResizeImmediate = this.onResizeImmediate.bind(this), this.onBreakpointChange = this.onBreakpointChange.bind(this), c.on(l.PageEvents.ON_RESIZE_IMMEDIATE, this.onResizeImmediate), c.on(l.PageEvents.ON_RESIZE_DEBOUNCED, this.onResizeDebounced), c.on(l.PageEvents.ON_BREAKPOINT_CHANGE, this.onBreakpointChange)
                    }
                }, {
                    key: "addComponent",
                    value: function(e) {
                        var r = e.el,
                            n = e.componentName,
                            i = e.data;
                        if (!h.hasOwnProperty(n)) throw "BubbleGum::addComponent could not add component to '" + r.className + "'. No component type '" + n + "' found!";
                        var o = h[n];
                        if (!t.componentIsSupported(o, n)) return void 0 === f[n] && (console.log("BubbleGum::addComponent unsupported component '" + n + "'. Reason: '" + n + ".IS_SUPPORTED' returned false"), f[n] = !0), null;
                        var s = r.dataset.componentList || "";
                        s.includes(n) || (r.dataset.componentList = s.split(" ").concat(n).join(" "));
                        var a = new o({
                            el: r,
                            data: i,
                            componentName: e.componentName,
                            gum: this,
                            pageMetrics: l.pageMetrics
                        });
                        return this.components.push(a), this.componentsInitialized && a.mounted(), a
                    }
                }, {
                    key: "removeComponent",
                    value: function(e) {
                        var t = this.components.indexOf(e);
                        t !== -1 && (this.components.splice(t, 1), e.el.dataset.componentList = e.el.dataset.componentList.split(" ").filter(function(t) {
                            return t !== e.componentName
                        }).join(" "), e.destroy())
                    }
                }, {
                    key: "getComponentOfType",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.documentElement,
                            r = "[data-component-list*=" + e + "]",
                            n = t.matches(r) ? t : t.querySelector(r);
                        return n ? this.components.find(function(t) {
                            return t instanceof h[e] && t.el === n
                        }) : null
                    }
                }, {
                    key: "getComponentsOfType",
                    value: function(e) {
                        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.documentElement,
                            r = "[data-component-list*=" + e + "]",
                            n = t.matches(r) ? [t] : Array.from(t.querySelectorAll(r));
                        return this.components.filter(function(t) {
                            return t instanceof h[e] && n.includes(t.el)
                        })
                    }
                }, {
                    key: "getComponentsForElement",
                    value: function(e) {
                        return this.components.filter(function(t) {
                            return t.el === e
                        })
                    }
                }, {
                    key: "onResizeImmediate",
                    value: function() {
                        this.components.forEach(function(e) {
                            return e.onResizeImmediate(l.pageMetrics)
                        })
                    }
                }, {
                    key: "onResizeDebounced",
                    value: function() {
                        this.components.forEach(function(e) {
                            return e.onResizeDebounced(l.pageMetrics)
                        })
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function() {
                        this.components.forEach(function(e) {
                            return e.onBreakpointChange(l.pageMetrics)
                        })
                    }
                }], [{
                    key: "componentIsSupported",
                    value: function(e, t) {
                        var r = e.IS_SUPPORTED;
                        if (void 0 === r) return !0;
                        if ("function" != typeof r) return console.error('BubbleGum::addComponent error in "' + t + '".IS_SUPPORTED - it should be a function which returns true/false'), !0;
                        var n = e.IS_SUPPORTED();
                        return void 0 === n ? (console.error('BubbleGum::addComponent error in "' + t + '".IS_SUPPORTED - it should be a function which returns true/false'), !0) : n
                    }
                }]), t
            }(a);
        p.EVENTS = {
            DOM_COMPONENTS_MOUNTED: "DOM_COMPONENTS_MOUNTED"
        }, t.exports = p
    }, {
        "./ComponentMap": 170,
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/anim-system": 148,
        "@marcom/anim-system/Model/AnimSystemModel": 153,
        "@marcom/delayed-initializer": 172
    }],
    170: [function(e, t, r) {
        "use strict";
        t.exports = {
            BaseComponent: e("./BaseComponent")
        }
    }, {
        "./BaseComponent": 168
    }],
    171: [function(e, t, r) {
        "use strict";
        var n = {
                create: e("gl-mat4/create"),
                invert: e("gl-mat4/invert"),
                clone: e("gl-mat4/clone"),
                transpose: e("gl-mat4/transpose")
            },
            i = {
                create: e("gl-vec3/create"),
                dot: e("gl-vec3/dot"),
                normalize: e("gl-vec3/normalize"),
                length: e("gl-vec3/length"),
                cross: e("gl-vec3/cross"),
                fromValues: e("gl-vec3/fromValues")
            },
            o = {
                create: e("gl-vec4/create"),
                transformMat4: e("gl-vec4/transformMat4"),
                fromValues: e("gl-vec4/fromValues")
            },
            s = (Math.PI / 180, 180 / Math.PI),
            a = 0,
            u = 1,
            c = 3,
            l = 4,
            h = 5,
            f = 7,
            p = 11,
            d = 12,
            m = 13,
            v = 15,
            y = function(e, t) {
                t = t || !1;
                for (var r = n.clone(e), a = i.create(), u = i.create(), l = i.create(), h = o.create(), d = o.create(), m = (i.create(), 0); m < 16; m++) r[m] /= r[v];
                var y = n.clone(r);
                y[c] = 0, y[f] = 0, y[p] = 0, y[v] = 1;
                var E = (r[3], r[7], r[11], r[12]),
                    w = r[13],
                    x = r[14],
                    A = (r[15], o.create());
                if (b(r[c]) && b(r[f]) && b(r[p])) h = o.fromValues(0, 0, 0, 1);
                else {
                    A[0] = r[c], A[1] = r[f], A[2] = r[p], A[3] = r[v];
                    var S = n.invert(n.create(), y),
                        O = n.transpose(n.create(), S);
                    h = o.transformMat4(h, A, O)
                }
                a[0] = E, a[1] = w, a[2] = x;
                var T = [i.create(), i.create(), i.create()];
                T[0][0] = r[0], T[0][1] = r[1], T[0][2] = r[2], T[1][0] = r[4], T[1][1] = r[5], T[1][2] = r[6], T[2][0] = r[8], T[2][1] = r[9], T[2][2] = r[10], u[0] = i.length(T[0]), i.normalize(T[0], T[0]), l[0] = i.dot(T[0], T[1]), T[1] = _(T[1], T[0], 1, -l[0]), u[1] = i.length(T[1]), i.normalize(T[1], T[1]), l[0] /= u[1], l[1] = i.dot(T[0], T[2]), T[2] = _(T[2], T[0], 1, -l[1]), l[2] = i.dot(T[1], T[2]), T[2] = _(T[2], T[1], 1, -l[2]), u[2] = i.length(T[2]), i.normalize(T[2], T[2]), l[1] /= u[2], l[2] /= u[2];
                var k = i.cross(i.create(), T[1], T[2]);
                if (i.dot(T[0], k) < 0)
                    for (m = 0; m < 3; m++) u[m] *= -1, T[m][0] *= -1, T[m][1] *= -1, T[m][2] *= -1;
                d[0] = .5 * Math.sqrt(Math.max(1 + T[0][0] - T[1][1] - T[2][2], 0)), d[1] = .5 * Math.sqrt(Math.max(1 - T[0][0] + T[1][1] - T[2][2], 0)), d[2] = .5 * Math.sqrt(Math.max(1 - T[0][0] - T[1][1] + T[2][2], 0)), d[3] = .5 * Math.sqrt(Math.max(1 + T[0][0] + T[1][1] + T[2][2], 0)), T[2][1] > T[1][2] && (d[0] = -d[0]), T[0][2] > T[2][0] && (d[1] = -d[1]), T[1][0] > T[0][1] && (d[2] = -d[2]);
                var P = o.fromValues(d[0], d[1], d[2], 2 * Math.acos(d[3])),
                    C = g(d);
                return t && (l[0] = Math.round(l[0] * s * 100) / 100, l[1] = Math.round(l[1] * s * 100) / 100, l[2] = Math.round(l[2] * s * 100) / 100, C[0] = Math.round(C[0] * s * 100) / 100, C[1] = Math.round(C[1] * s * 100) / 100, C[2] = Math.round(C[2] * s * 100) / 100, P[3] = Math.round(P[3] * s * 100) / 100), {
                    translation: a,
                    scale: u,
                    skew: l,
                    perspective: h,
                    quaternion: d,
                    eulerRotation: C,
                    axisAngle: P
                }
            },
            _ = function(e, t, r, n) {
                var o = i.create();
                return o[0] = r * e[0] + n * t[0], o[1] = r * e[1] + n * t[1], o[2] = r * e[2] + n * t[2], o
            },
            g = function(e) {
                var t, r, n, o = e[3] * e[3],
                    s = e[0] * e[0],
                    a = e[1] * e[1],
                    u = e[2] * e[2],
                    c = s + a + u + o,
                    l = e[0] * e[1] + e[2] * e[3];
                return l > .499 * c ? (r = 2 * Math.atan2(e[0], e[3]), n = Math.PI / 2, t = 0, i.fromValues(t, r, n)) : l < -.499 * c ? (r = -2 * Math.atan2(e[0], e[3]), n = -Math.PI / 2, t = 0, i.fromValues(t, r, n)) : (r = Math.atan2(2 * e[1] * e[3] - 2 * e[0] * e[2], s - a - u + o), n = Math.asin(2 * l / c), t = Math.atan2(2 * e[0] * e[3] - 2 * e[1] * e[2], -s + a - u + o), i.fromValues(t, r, n))
            },
            b = function(e) {
                return Math.abs(e) < 1e-4
            },
            E = function(e) {
                var t = String(getComputedStyle(e).transform).trim(),
                    r = n.create();
                if ("none" === t || "" === t) return r;
                var i, o, s = t.slice(0, t.indexOf("("));
                if ("matrix3d" === s)
                    for (i = t.slice(9, -1).split(","), o = 0; o < i.length; o++) r[o] = parseFloat(i[o]);
                else {
                    if ("matrix" !== s) throw new TypeError("Invalid Matrix Value");
                    for (i = t.slice(7, -1).split(","), o = i.length; o--;) i[o] = parseFloat(i[o]);
                    r[a] = i[0], r[u] = i[1], r[d] = i[4], r[l] = i[2], r[h] = i[3], r[m] = i[5]
                }
                return r
            };
        t.exports = function(e, t) {
            var r = E(e);
            return y(r, t)
        }
    }, {
        "gl-mat4/clone": 205,
        "gl-mat4/create": 206,
        "gl-mat4/invert": 207,
        "gl-mat4/transpose": 212,
        "gl-vec3/create": 222,
        "gl-vec3/cross": 223,
        "gl-vec3/dot": 224,
        "gl-vec3/fromValues": 225,
        "gl-vec3/length": 226,
        "gl-vec3/normalize": 227,
        "gl-vec4/create": 228,
        "gl-vec4/fromValues": 229,
        "gl-vec4/transformMat4": 230
    }],
    172: [function(e, t, r) {
        "use strict";
        var n = !1,
            i = !1,
            o = [];
        t.exports = {
            NUMBER_OF_FRAMES_TO_WAIT: 30,
            add: function(e) {
                var t = this;
                if (i && e(), o.push(e), !n) {
                    n = !0;
                    var r = document.documentElement.scrollHeight,
                        s = 0,
                        a = function u() {
                            var e = document.documentElement.scrollHeight;
                            if (r !== e) s = 0;
                            else if (s++, s >= t.NUMBER_OF_FRAMES_TO_WAIT) return void o.forEach(function(e) {
                                return e()
                            });
                            r = e, requestAnimationFrame(u)
                        };
                    requestAnimationFrame(a)
                }
            }
        }
    }, {}],
    173: [function(e, t, r) {
        "use strict";
        t.exports = {
            getWindow: function() {
                return window
            },
            getDocument: function() {
                return document
            },
            getNavigator: function() {
                return navigator
            }
        }
    }, {}],
    174: [function(e, t, r) {
        "use strict";

        function n() {
            var e = i.getWindow(),
                t = e.matchMedia("(prefers-reduced-motion)");
            return !(!t || !t.matches)
        }
        var i = e("./helpers/globals");
        t.exports = n
    }, {
        "./helpers/globals": 173
    }],
    175: [function(e, t, r) {
        "use strict";
        t.exports = {
            lerp: function(e, t, r) {
                return t + (r - t) * e
            },
            map: function(e, t, r, n, i) {
                return n + (i - n) * (e - t) / (r - t)
            },
            mapClamp: function(e, t, r, n, i) {
                var o = n + (i - n) * (e - t) / (r - t);
                return Math.max(n, Math.min(i, o))
            },
            norm: function(e, t, r) {
                return (e - t) / (r - t)
            },
            clamp: function(e, t, r) {
                return Math.max(t, Math.min(r, e))
            },
            randFloat: function(e, t) {
                return Math.random() * (t - e) + e
            },
            randInt: function(e, t) {
                return Math.floor(Math.random() * (t - e) + e)
            }
        }
    }, {}],
    176: [function(e, t, r) {
        "use strict";
        t.exports = {
            browser: {
                safari: !1,
                chrome: !1,
                firefox: !1,
                ie: !1,
                opera: !1,
                android: !1,
                edge: !1,
                version: {
                    string: "",
                    major: 0,
                    minor: 0,
                    patch: 0,
                    documentMode: !1
                }
            },
            os: {
                osx: !1,
                ios: !1,
                android: !1,
                windows: !1,
                linux: !1,
                fireos: !1,
                chromeos: !1,
                version: {
                    string: "",
                    major: 0,
                    minor: 0,
                    patch: 0
                }
            }
        }
    }, {}],
    177: [function(e, t, r) {
        "use strict";
        t.exports = {
            browser: [{
                name: "edge",
                userAgent: "Edge",
                version: ["rv", "Edge"],
                test: function(e) {
                    return e.ua.indexOf("Edge") > -1 || "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" === e.ua
                }
            }, {
                name: "chrome",
                userAgent: "Chrome"
            }, {
                name: "firefox",
                test: function(e) {
                    return e.ua.indexOf("Firefox") > -1 && e.ua.indexOf("Opera") === -1
                },
                version: "Firefox"
            }, {
                name: "android",
                userAgent: "Android"
            }, {
                name: "safari",
                test: function(e) {
                    return e.ua.indexOf("Safari") > -1 && e.vendor.indexOf("Apple") > -1
                },
                version: "Version"
            }, {
                name: "ie",
                test: function(e) {
                    return e.ua.indexOf("IE") > -1 || e.ua.indexOf("Trident") > -1
                },
                version: ["MSIE", "rv"],
                parseDocumentMode: function() {
                    var e = !1;
                    return document.documentMode && (e = parseInt(document.documentMode, 10)), e
                }
            }, {
                name: "opera",
                userAgent: "Opera",
                version: ["Version", "Opera"]
            }],
            os: [{
                name: "windows",
                test: function(e) {
                    return e.ua.indexOf("Windows") > -1
                },
                version: "Windows NT"
            }, {
                name: "osx",
                userAgent: "Mac",
                test: function(e) {
                    return e.ua.indexOf("Macintosh") > -1
                }
            }, {
                name: "ios",
                test: function(e) {
                    return e.ua.indexOf("iPhone") > -1 || e.ua.indexOf("iPad") > -1
                },
                version: ["iPhone OS", "CPU OS"]
            }, {
                name: "linux",
                userAgent: "Linux",
                test: function(e) {
                    return (e.ua.indexOf("Linux") > -1 || e.platform.indexOf("Linux") > -1) && e.ua.indexOf("Android") === -1
                }
            }, {
                name: "fireos",
                test: function(e) {
                    return e.ua.indexOf("Firefox") > -1 && e.ua.indexOf("Mobile") > -1
                },
                version: "rv"
            }, {
                name: "android",
                userAgent: "Android",
                test: function(e) {
                    return e.ua.indexOf("Android") > -1
                }
            }, {
                name: "chromeos",
                userAgent: "CrOS"
            }]
        }
    }, {}],
    178: [function(e, t, r) {
        "use strict";

        function n(e) {
            return new RegExp(e + "[a-zA-Z\\s/:]+([0-9_.]+)", "i")
        }

        function i(e, t) {
            if ("function" == typeof e.parseVersion) return e.parseVersion(t);
            var r = e.version || e.userAgent;
            "string" == typeof r && (r = [r]);
            for (var i, o = r.length, s = 0; s < o; s++)
                if (i = t.match(n(r[s])), i && i.length > 1) return i[1].replace(/_/g, ".");
            return !1
        }

        function o(e, t, r) {
            for (var n, o, s = e.length, a = 0; a < s; a++)
                if ("function" == typeof e[a].test ? e[a].test(r) === !0 && (n = e[a].name) : r.ua.indexOf(e[a].userAgent) > -1 && (n = e[a].name), n) {
                    if (t[n] = !0, o = i(e[a], r.ua), "string" == typeof o) {
                        var u = o.split(".");
                        t.version.string = o, u && u.length > 0 && (t.version.major = parseInt(u[0] || 0), t.version.minor = parseInt(u[1] || 0), t.version.patch = parseInt(u[2] || 0))
                    } else "edge" === n && (t.version.string = "12.0.0", t.version.major = "12", t.version.minor = "0", t.version.patch = "0");
                    return "function" == typeof e[a].parseDocumentMode && (t.version.documentMode = e[a].parseDocumentMode()), t
                }
            return t
        }

        function s(e) {
            var t = {};
            return t.browser = o(u.browser, a.browser, e), t.os = o(u.os, a.os, e), t
        }
        var a = e("./defaults"),
            u = e("./dictionary");
        t.exports = s
    }, {
        "./defaults": 176,
        "./dictionary": 177
    }],
    179: [function(e, t, r) {
        "use strict";
        var n = {
            ua: window.navigator.userAgent,
            platform: window.navigator.platform,
            vendor: window.navigator.vendor
        };
        t.exports = e("./parseUserAgent")(n)
    }, {
        "./parseUserAgent": 178
    }],
    180: [function(e, t, r) {
        arguments[4][98][0].apply(r, arguments)
    }, {
        dup: 98
    }],
    181: [function(e, t, r) {
        arguments[4][99][0].apply(r, arguments)
    }, {
        "./sharedRAFEmitterIDGeneratorInstance": 186,
        "./sharedRAFExecutorInstance": 187,
        "@marcom/ac-event-emitter-micro": 55,
        dup: 99
    }],
    182: [function(e, t, r) {
        arguments[4][100][0].apply(r, arguments)
    }, {
        "@marcom/ac-event-emitter-micro/EventEmitterMicro": 56,
        dup: 100
    }],
    183: [function(e, t, r) {
        arguments[4][101][0].apply(r, arguments)
    }, {
        "./SingleCallRAFEmitter": 185,
        dup: 101
    }],
    184: [function(e, t, r) {
        arguments[4][102][0].apply(r, arguments)
    }, {
        "./RAFInterface": 183,
        dup: 102
    }],
    185: [function(e, t, r) {
        arguments[4][103][0].apply(r, arguments)
    }, {
        "./RAFEmitter": 181,
        dup: 103
    }],
    186: [function(e, t, r) {
        arguments[4][107][0].apply(r, arguments)
    }, {
        "../.release-info.js": 180,
        "@marcom/ac-shared-instance": 117,
        dup: 107
    }],
    187: [function(e, t, r) {
        arguments[4][108][0].apply(r, arguments)
    }, {
        "../.release-info.js": 180,
        "./RAFExecutor": 182,
        "@marcom/ac-shared-instance": 117,
        dup: 108
    }],
    188: [function(e, t, r) {
        arguments[4][109][0].apply(r, arguments)
    }, {
        "./RAFInterfaceController": 184,
        dup: 109
    }],
    189: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            i.call(this), this._id = e || s.ID, this._options = Object.assign({}, s.OPTIONS, t), this._allowDOMEventDispatch = !1, this._allowElementStateData = !1, this._options.removeNamespace = "boolean" != typeof this._options.removeNamespace || this._options.removeNamespace, this._el = this._initViewportEl(this._id), this._resizing = !1, this._mediaQueryLists = {
                resolution: {
                    retina: window.matchMedia(c.RETINA)
                },
                orientation: {
                    portrait: window.matchMedia(c.PORTRAIT),
                    landscape: window.matchMedia(c.LANDSCAPE)
                }
            }, this._viewport = this._getViewport(this._options.removeNamespace), this._retina = this._getRetina(this._mediaQueryLists.resolution.retina), this._orientation = this._initOrientation(), this._addListeners(), this._updateElementStateData()
        }
        var i = e("@marcom/ac-event-emitter-micro").EventEmitterMicro,
            o = e("@marcom/ac-raf-emitter/update"),
            s = {
                ID: "viewport-emitter",
                OPTIONS: {
                    removeNamespace: !0
                }
            },
            a = {
                DOM_DISPATCH: "data-viewport-emitter-dispatch",
                STATE: "data-viewport-emitter-state"
            },
            u = "::before",
            c = {
                RETINA: "only screen and (-webkit-min-device-pixel-ratio: 1.5), screen and (min-resolution: 1.5dppx), screen and (min-resolution: 144dpi)",
                PORTRAIT: "only screen and (orientation: portrait)",
                LANDSCAPE: "only screen and (orientation: landscape)"
            },
            l = {
                any: "change:any",
                orientation: "change:orientation",
                retina: "change:retina",
                viewport: "change:viewport"
            };
        Object.defineProperty(n, "DOM_DISPATCH_ATTRIBUTE", {
            get: function() {
                return a.DOM_DISPATCH
            }
        }), Object.defineProperty(n, "DOM_STATE_ATTRIBUTE", {
            get: function() {
                return a.STATE
            }
        });
        var h = n.prototype = Object.create(i.prototype);
        Object.defineProperty(h, "id", {
            get: function() {
                return this._id
            }
        }), Object.defineProperty(h, "element", {
            get: function() {
                return this._el
            }
        }), Object.defineProperty(h, "mediaQueryLists", {
            get: function() {
                return this._mediaQueryLists
            }
        }), Object.defineProperty(h, "viewport", {
            get: function() {
                return this._viewport
            }
        }), Object.defineProperty(h, "retina", {
            get: function() {
                return this._retina
            }
        }), Object.defineProperty(h, "orientation", {
            get: function() {
                return this._orientation
            }
        }), Object.defineProperty(h, "hasDomDispatch", {
            get: function() {
                return this._allowDOMEventDispatch
            }
        }), h.destroy = function() {
            this._removeListeners();
            for (var e in this._options) this._options[e] = null;
            for (var t in this._mediaQueryLists) {
                var r = this._mediaQueryLists[t];
                for (var n in r) r[n] = null
            }
            this._id = null, this._el = null, this._viewport = null, this._retina = null, this._orientation = null, i.prototype.destroy.call(this)
        }, h._initViewportEl = function(e) {
            var t = document.getElementById(e);
            return t || (t = document.createElement("div"), t.id = e, t = document.body.appendChild(t)), t.hasAttribute(a.DOM_DISPATCH) || (t.setAttribute(a.DOM_DISPATCH, ""), this._allowDOMEventDispatch = !0), t.hasAttribute(a.STATE) || (this._allowElementStateData = !0), t
        }, h._dispatch = function(e, t) {
            var r = {
                viewport: this._viewport,
                orientation: this._orientation,
                retina: this._retina
            };
            if (this._allowDOMEventDispatch) {
                var n = new CustomEvent(e, {
                        detail: t
                    }),
                    i = new CustomEvent(l.any, {
                        detail: r
                    });
                this._el.dispatchEvent(n), this._el.dispatchEvent(i)
            }
            this.trigger(e, t), this.trigger(l.any, r)
        }, h._addListeners = function() {
            this._onOrientationChange = this._onOrientationChange.bind(this), this._onRetinaChange = this._onRetinaChange.bind(this), this._onViewportChange = this._onViewportChange.bind(this), this._onViewportChangeUpdate = this._onViewportChangeUpdate.bind(this), this._mediaQueryLists.orientation.portrait.addListener(this._onOrientationChange), this._mediaQueryLists.orientation.landscape.addListener(this._onOrientationChange), this._mediaQueryLists.resolution.retina.addListener(this._onRetinaChange), window.addEventListener("resize", this._onViewportChange)
        }, h._removeListeners = function() {
            this._mediaQueryLists.orientation.portrait.removeListener(this._onOrientationChange), this._mediaQueryLists.orientation.landscape.removeListener(this._onOrientationChange), this._mediaQueryLists.resolution.retina.removeListener(this._onRetinaChange), window.removeEventListener("resize", this._onViewportChange)
        }, h._updateElementStateData = function() {
            if (this._allowElementStateData) {
                var e = JSON.stringify({
                    viewport: this._viewport,
                    orientation: this._orientation,
                    retina: this._retina
                });
                this._el.setAttribute(a.STATE, e)
            }
        }, h._getViewport = function(e) {
            var t = window.getComputedStyle(this._el, u).content;
            return t ? (t = t.replace(/["']/g, ""), e ? t.split(":").pop() : t) : null
        }, h._getRetina = function(e) {
            return e.matches
        }, h._getOrientation = function(e) {
            var t = this._orientation;
            if (e.matches) {
                var r = /portrait|landscape/;
                return e.media.match(r)[0]
            }
            return t
        }, h._initOrientation = function() {
            var e = this._getOrientation(this._mediaQueryLists.orientation.portrait);
            return e ? e : this._getOrientation(this._mediaQueryLists.orientation.landscape)
        }, h._onViewportChange = function() {
            this._resizing || (this._resizing = !0, o(this._onViewportChangeUpdate))
        }, h._onViewportChangeUpdate = function() {
            var e = this._viewport;
            if (this._viewport = this._getViewport(this._options.removeNamespace), e !== this._viewport) {
                var t = {
                    from: e,
                    to: this._viewport
                };
                this._updateElementStateData(), this._dispatch(l.viewport, t)
            }
            this._resizing = !1
        }, h._onRetinaChange = function(e) {
            var t = this._retina;
            if (this._retina = this._getRetina(e), t !== this._retina) {
                var r = {
                    from: t,
                    to: this._retina
                };
                this._updateElementStateData(), this._dispatch(l.retina, r)
            }
        }, h._onOrientationChange = function(e) {
            var t = this._orientation;
            if (this._orientation = this._getOrientation(e), t !== this._orientation) {
                var r = {
                    from: t,
                    to: this._orientation
                };
                this._updateElementStateData(), this._dispatch(l.orientation, r)
            }
        }, t.exports = n
    }, {
        "@marcom/ac-event-emitter-micro": 55,
        "@marcom/ac-raf-emitter/update": 188
    }],
    190: [function(e, t, r) {
        "use strict";
        var n = e("./ViewportEmitter");
        t.exports = new n
    }, {
        "./ViewportEmitter": 189
    }],
    191: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = e("@marcom/ac-url/parseURL"),
            s = e("@marcom/ac-console/error"),
            a = e("@marcom/ac-console/log"),
            u = {
                requestMethod: "GET",
                timeout: 3e4
            };
        Object.freeze(u);
        var c = {
            response: null,
            xhr: null
        };
        Object.freeze(c);
        var l = {
            evt: null,
            xhr: null
        };
        Object.freeze(l);
        var h = "href",
            f = function() {
                function e(t, r) {
                    return n(this, e), t || "string" == typeof t ? (this._src = o(t)[h], this._opts = Object.assign({}, u, r), this._xhr = new XMLHttpRequest, this._promise = null, this._metrics = {
                        progress: 0,
                        totalAssetSize: null,
                        time: {
                            requested: null,
                            load: {
                                start: null,
                                end: null,
                                total: null
                            }
                        }
                    }, this._onLoadStart = this._onLoadStart.bind(this), this._onProgress = this._onProgress.bind(this), void(this._rejectData = this._rejectData.bind(this))) : void s("createXhr(src, opts), a src is required to create an XMLHttpRequest")
                }
                return i(e, null, [{
                    key: "isCORSRequest",
                    value: function(e) {
                        return window.location.hostname !== o(e).hostname
                    }
                }, {
                    key: "IS_SUPPORTED",
                    get: function() {
                        var e = window.XMLHttpRequest,
                            t = window.Promise,
                            r = e && "function" == typeof e,
                            n = t && "function" == typeof t;
                        return r && n
                    }
                }]), i(e, [{
                    key: "open",
                    value: function() {
                        0 === this._xhr.readyState && (this._xhr.open(this._opts.requestMethod, this._src, !0, this._opts.user, this._opts.password), this._setXhrProps(), a("XmlHttpRequest opened and properties set"))
                    }
                }, {
                    key: "send",
                    value: function(e) {
                        var t = this;
                        return e = void 0 === e ? null : e, this._promise ? this._promise : this._promise = new Promise(function(r, n) {
                            t._xhr.onprogress = t._onProgress, t._xhr.onloadstart = t._onLoadStart, t._xhr.onload = function(e) {
                                return t._onLoad(r, n, e)
                            }, t._xhr.ontimeout = function(e) {
                                return t._rejectData(n, e)
                            }, t._xhr.onerror = function(e) {
                                return t._rejectData(n, e)
                            }, t._xhr.onabort = function(e) {
                                return t._rejectData(n, e)
                            }, t._metrics.time.requested = Date.now(), t._xhr.send(e), a("XmlHttpRequest sent")
                        })
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        var e = this;
                        return 4 !== this._xhr.readyState && this._xhr.abort(), this._promise = this._promise || Promise.resolve(), this._promise.then(function() {
                            e._nullifyConstructorProps()
                        }, function() {
                            e._nullifyConstructorProps()
                        }).then(function() {
                            return Promise.resolve()
                        })
                    }
                }, {
                    key: "_nullifyConstructorProps",
                    value: function() {
                        this._src = null, this._metrics = {
                            progress: null,
                            totalAssetSize: null,
                            time: {
                                requested: null,
                                load: {
                                    start: null,
                                    end: null,
                                    total: null
                                }
                            }
                        }
                    }
                }, {
                    key: "_calcTotalLoadTime",
                    value: function() {
                        this._metrics.time.load.end = Date.now(), this._metrics.time.load.total = this._metrics.time.load.end - this._metrics.time.load.start
                    }
                }, {
                    key: "_setXhrProps",
                    value: function() {
                        var e = this;
                        Object.keys(this._opts).forEach(function(t) {
                            t in e._xhr && "function" != typeof e._xhr[t] && (e._xhr[t] = e._opts[t])
                        })
                    }
                }, {
                    key: "_onLoadStart",
                    value: function() {
                        this._metrics.time.load.start = Date.now(), this._metrics.progress = 0, a("XmlHttpRequest loading")
                    }
                }, {
                    key: "_onLoad",
                    value: function(e, t, r) {
                        var n = this._xhr.status;
                        if (200 !== n) return this._rejectData(t, r);
                        this._calcTotalLoadTime();
                        var i = Object.assign({}, c, {
                            response: this._xhr.response,
                            xhr: this._xhr
                        });
                        return a("XmlHttpRequest loaded"), e(i)
                    }
                }, {
                    key: "_onProgress",
                    value: function(e) {
                        this._metrics.totalAssetSize || (this._metrics.totalAssetSize = e.total), this._metrics.progress = e.total ? e.loaded / e.total : 0
                    }
                }, {
                    key: "_rejectData",
                    value: function(e, t) {
                        var r = Object.assign({}, l, {
                            evt: t,
                            xhr: this._xhr
                        });
                        return s("XhrRequest failed due to", r), e(r)
                    }
                }, {
                    key: "xhr",
                    get: function() {
                        return this._xhr
                    }
                }, {
                    key: "requestUrl",
                    get: function() {
                        return this._src
                    }
                }, {
                    key: "progress",
                    get: function() {
                        return this._metrics.progress
                    }
                }, {
                    key: "totalAssetSize",
                    get: function() {
                        return this._metrics.totalAssetSize
                    }
                }, {
                    key: "requestedAtTime",
                    get: function() {
                        return this._metrics.time.requested
                    }
                }, {
                    key: "loadStartTime",
                    get: function() {
                        return this._metrics.time.load.start
                    }
                }, {
                    key: "loadEndTime",
                    get: function() {
                        return this._metrics.time.load.end
                    }
                }, {
                    key: "totalLoadTime",
                    get: function() {
                        return this._metrics.time.load.total
                    }
                }]), e
            }();
        t.exports = f
    }, {
        "@marcom/ac-console/error": 21,
        "@marcom/ac-console/log": 23,
        "@marcom/ac-url/parseURL": 127
    }],
    192: [function(e, t, r) {
        "use strict";

        function n(e) {
            var t = a.get(e),
                r = t && (t._triangleBuffer.handle || t._triangleBuffer.buffer);
            if (!r || !e.isBuffer(r)) {
                var n = o(e, new Float32Array([-1, -1, -1, 4, 4, -1]));
                t = s(e, [{
                    buffer: n,
                    type: e.FLOAT,
                    size: 2
                }]), t._triangleBuffer = n, a.set(e, t)
            }
            t.bind(), e.drawArrays(e.TRIANGLES, 0, 3), t.unbind()
        }
        var i = "undefined" == typeof WeakMap ? e("weak-map") : WeakMap,
            o = e("gl-buffer"),
            s = e("gl-vao"),
            a = new i;
        t.exports = n
    }, {
        "gl-buffer": 204,
        "gl-vao": 221,
        "weak-map": 237
    }],
    193: [function(e, t, r) {
        "use strict";
        t.exports = {
            cname: e("./ac-cname/cname")
        }
    }, {
        "./ac-cname/cname": 194
    }],
    194: [function(e, t, r) {
        "use strict";

        function n(e) {
            return n.addPrefix(e)
        }
        var i = e("ac-path").path;
        n._prefix = function() {
            var e = "blank.gif" /*tpa=https://www.apple.com/global/elements/blank.gif*/ ;
            return e.replace(/global\/.*/, "")
        }(), n.addPrefix = function(e) {
            return i.isAbsolute(e) ? e : (n._assertRootRelative(e), e = n._prefix + e.replace(/^\//, ""), e = e.replace(/(^.+)(\/105\/)/, "$1/"))
        }, n.formatUrl = function(e, t, r, o) {
            var s = i.format({
                dirname: e,
                filename: t,
                extname: r
            }, o);
            if (i.isAbsolute(s)) return s;
            n._assertRootRelative(e);
            var a = n.addPrefix(s);
            return a
        }, n._assertRootRelative = function(e) {
            if (!i.isRootRelative(e)) throw new URIError("Only root-relative paths are currently supported")
        }, t.exports = n
    }, {
        "ac-path": 197
    }],
    195: [function(e, t, r) {
        t.exports.EventEmitter = e("./ac-event-emitter/EventEmitter")
    }, {
        "./ac-event-emitter/EventEmitter": 196
    }],
    196: [function(e, t, r) {
        "use strict";
        var n = "EventEmitter:propagation",
            i = function(e) {
                e && (this.context = e)
            },
            o = i.prototype,
            s = function() {
                return this.hasOwnProperty("_events") || "object" == typeof this._events || (this._events = {}), this._events
            },
            a = function(e, t) {
                var r = e[0],
                    n = e[1],
                    i = e[2];
                if ("string" != typeof r && "object" != typeof r || null === r || Array.isArray(r)) throw new TypeError("Expecting event name to be a string or object.");
                if ("string" == typeof r && !n) throw new Error("Expecting a callback function to be provided.");
                if (n && "function" != typeof n) {
                    if ("object" != typeof r || "object" != typeof n) throw new TypeError("Expecting callback to be a function.");
                    i = n
                }
                if ("object" == typeof r)
                    for (var o in r) t.call(this, o, r[o], i);
                "string" == typeof r && (r = r.split(" "), r.forEach(function(e) {
                    t.call(this, e, n, i)
                }, this))
            },
            u = function(e, t) {
                var r, n, i;
                if (r = s.call(this)[e], r && 0 !== r.length)
                    for (r = r.slice(), this._stoppedImmediatePropagation = !1, n = 0, i = r.length; n < i && (!this._stoppedImmediatePropagation && !t(r[n], n)); n++);
            },
            c = function(e, t, r) {
                var n = -1;
                u.call(this, t, function(e, t) {
                    if (e.callback === r) return n = t, !0
                }), n !== -1 && e[t].splice(n, 1)
            };
        o.on = function() {
            var e = s.call(this);
            return a.call(this, arguments, function(t, r, n) {
                e[t] = e[t] || (e[t] = []), e[t].push({
                    callback: r,
                    context: n
                })
            }), this
        }, o.once = function() {
            return a.call(this, arguments, function(e, t, r) {
                var n = function(i) {
                    t.call(r || this, i), this.off(e, n)
                };
                this.on(e, n, this)
            }), this
        }, o.off = function(e, t) {
            var r = s.call(this);
            if (0 === arguments.length) this._events = {};
            else if (!e || "string" != typeof e && "object" != typeof e || Array.isArray(e)) throw new TypeError("Expecting event name to be a string or object.");
            if ("object" == typeof e)
                for (var n in e) c.call(this, r, n, e[n]);
            if ("string" == typeof e) {
                var i = e.split(" ");
                1 === i.length ? t ? c.call(this, r, e, t) : r[e] = [] : i.forEach(function(e) {
                    r[e] = []
                })
            }
            return this
        }, o.trigger = function(e, t, r) {
            if (!e) throw new Error("trigger method requires an event name");
            if ("string" != typeof e) throw new TypeError("Expecting event names to be a string.");
            if (r && "boolean" != typeof r) throw new TypeError("Expecting doNotPropagate to be a boolean.");
            return e = e.split(" "), e.forEach(function(e) {
                u.call(this, e, function(e) {
                    e.callback.call(e.context || this.context || this, t)
                }.bind(this)), r || u.call(this, n, function(r) {
                    var n = e;
                    r.prefix && (n = r.prefix + n), r.emitter.trigger(n, t)
                })
            }, this), this
        }, o.propagateTo = function(e, t) {
            var r = s.call(this);
            r[n] || (this._events[n] = []), r[n].push({
                emitter: e,
                prefix: t
            })
        }, o.stopPropagatingTo = function(e) {
            var t = s.call(this);
            if (!e) return void(t[n] = []);
            var r, i = t[n],
                o = i.length;
            for (r = 0; r < o; r++)
                if (i[r].emitter === e) {
                    i.splice(r, 1);
                    break
                }
        }, o.stopImmediatePropagation = function() {
            this._stoppedImmediatePropagation = !0
        }, o.has = function(e, t, r) {
            var n = s.call(this),
                i = n[e];
            if (0 === arguments.length) return Object.keys(n);
            if (!i) return !1;
            if (!t) return i.length > 0;
            for (var o = 0, a = i.length; o < a; o++) {
                var u = i[o];
                if (r && t && u.context === r && u.callback === t) return !0;
                if (t && !r && u.callback === t) return !0
            }
            return !1
        }, t.exports = i
    }, {}],
    197: [function(e, t, r) {
        "use strict";
        t.exports = {
            path: e("./ac-path/path")
        }
    }, {
        "./ac-path/path": 198
    }],
    198: [function(e, t, r) {
        "use strict";

        function n(e) {
            return n.parse(e)
        }
        n.basename = function(e, t) {
            n._assertStr(e);
            var r, i = e.match(/[^\/]*$/)[0];
            return t && (r = i.match(new RegExp("(.*)" + t + "$")), r && (i = r[1])), i
        }, n.dirname = function(e) {
            n._assertStr(e);
            var t = e.match(/^(.*)\b\/|.*/);
            return t[1] || e
        }, n.extname = function(e) {
            n._assertStr(e);
            var t = e.match(/\.[^.]*$/);
            return t ? t[0] : ""
        }, n.filename = function(e) {
            return n._assertStr(e), n.basename(e, n.extname(e))
        }, n.format = function(e, t) {
            n._assertObj(e);
            var r = e.dirname ? e.dirname + "/" : "";
            return e.basename ? r += e.basename : e.filename && (r += e.filename, e.extname && (r += e.extname)), t && ("string" == typeof t ? r += "?" + t : Object.prototype.toString.call(t) === Object.prototype.toString.call([]) && (r += "?" + t.join("&"))), r
        }, n.isAbsolute = function(e) {
            return n._assertStr(e), !!e.match(/(^http(s?))/)
        }, n.isRootRelative = function(e) {
            return n._assertStr(e), !!e.match(/^\/(?!\/)/)
        }, n.parse = function(e) {
            return n._assertStr(e), {
                dirname: n.dirname(e),
                basename: n.basename(e),
                filename: n.filename(e),
                extname: n.extname(e)
            }
        }, n._assertStr = function(e) {
            n._assertType(e, "string")
        }, n._assertObj = function(e) {
            n._assertType(e, "object")
        }, n._assertType = function(e, t) {
            var r = typeof e;
            if ("undefined" === r || r !== t) throw new TypeError("path param must be of type " + t)
        }, t.exports = n
    }, {}],
    199: [function(e, t, r) {
        "use strict";
        "use restrict";

        function n(e) {
            var t = 32;
            return e &= -e, e && t--, 65535 & e && (t -= 16), 16711935 & e && (t -= 8), 252645135 & e && (t -= 4), 858993459 & e && (t -= 2), 1431655765 & e && (t -= 1), t
        }
        var i = 32;
        r.INT_BITS = i, r.INT_MAX = 2147483647, r.INT_MIN = -1 << i - 1, r.sign = function(e) {
            return (e > 0) - (e < 0)
        }, r.abs = function(e) {
            var t = e >> i - 1;
            return (e ^ t) - t
        }, r.min = function(e, t) {
            return t ^ (e ^ t) & -(e < t)
        }, r.max = function(e, t) {
            return e ^ (e ^ t) & -(e < t)
        }, r.isPow2 = function(e) {
            return !(e & e - 1 || !e)
        }, r.log2 = function(e) {
            var t, r;
            return t = (e > 65535) << 4, e >>>= t, r = (e > 255) << 3, e >>>= r, t |= r, r = (e > 15) << 2, e >>>= r, t |= r, r = (e > 3) << 1, e >>>= r, t |= r, t | e >> 1
        }, r.log10 = function(e) {
            return e >= 1e9 ? 9 : e >= 1e8 ? 8 : e >= 1e7 ? 7 : e >= 1e6 ? 6 : e >= 1e5 ? 5 : e >= 1e4 ? 4 : e >= 1e3 ? 3 : e >= 100 ? 2 : e >= 10 ? 1 : 0
        }, r.popCount = function(e) {
            return e -= e >>> 1 & 1431655765, e = (858993459 & e) + (e >>> 2 & 858993459), 16843009 * (e + (e >>> 4) & 252645135) >>> 24
        }, r.countTrailingZeros = n, r.nextPow2 = function(e) {
            return e += 0 === e, --e, e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e + 1
        }, r.prevPow2 = function(e) {
            return e |= e >>> 1, e |= e >>> 2, e |= e >>> 4, e |= e >>> 8, e |= e >>> 16, e - (e >>> 1)
        }, r.parity = function(e) {
            return e ^= e >>> 16, e ^= e >>> 8, e ^= e >>> 4, e &= 15, 27030 >>> e & 1
        };
        var o = new Array(256);
        ! function(e) {
            for (var t = 0; t < 256; ++t) {
                var r = t,
                    n = t,
                    i = 7;
                for (r >>>= 1; r; r >>>= 1) n <<= 1, n |= 1 & r, --i;
                e[t] = n << i & 255
            }
        }(o), r.reverse = function(e) {
            return o[255 & e] << 24 | o[e >>> 8 & 255] << 16 | o[e >>> 16 & 255] << 8 | o[e >>> 24 & 255]
        }, r.interleave2 = function(e, t) {
            return e &= 65535, e = 16711935 & (e | e << 8), e = 252645135 & (e | e << 4), e = 858993459 & (e | e << 2), e = 1431655765 & (e | e << 1), t &= 65535, t = 16711935 & (t | t << 8), t = 252645135 & (t | t << 4), t = 858993459 & (t | t << 2), t = 1431655765 & (t | t << 1), e | t << 1
        }, r.deinterleave2 = function(e, t) {
            return e = e >>> t & 1431655765, e = 858993459 & (e | e >>> 1), e = 252645135 & (e | e >>> 2), e = 16711935 & (e | e >>> 4), e = 65535 & (e | e >>> 16), e << 16 >> 16
        }, r.interleave3 = function(e, t, r) {
            return e &= 1023, e = 4278190335 & (e | e << 16), e = 251719695 & (e | e << 8), e = 3272356035 & (e | e << 4), e = 1227133513 & (e | e << 2), t &= 1023, t = 4278190335 & (t | t << 16), t = 251719695 & (t | t << 8), t = 3272356035 & (t | t << 4), t = 1227133513 & (t | t << 2), e |= t << 1, r &= 1023, r = 4278190335 & (r | r << 16), r = 251719695 & (r | r << 8), r = 3272356035 & (r | r << 4), r = 1227133513 & (r | r << 2), e | r << 2
        }, r.deinterleave3 = function(e, t) {
            return e = e >>> t & 1227133513, e = 3272356035 & (e | e >>> 2), e = 251719695 & (e | e >>> 4), e = 4278190335 & (e | e >>> 8), e = 1023 & (e | e >>> 16), e << 22 >> 22
        }, r.nextCombination = function(e) {
            var t = e | e - 1;
            return t + 1 | (~t & -~t) - 1 >>> n(e) + 1
        }
    }, {}],
    200: [function(e, t, r) {
        "use strict";

        function n() {
            this.argTypes = [], this.shimArgs = [],
                this.arrayArgs = [], this.arrayBlockIndices = [], this.scalarArgs = [], this.offsetArgs = [], this.offsetArgIndex = [], this.indexArgs = [], this.shapeArgs = [], this.funcName = "", this.pre = null, this.body = null, this.post = null, this.debug = !1
        }

        function i(e) {
            var t = new n;
            t.pre = e.pre, t.body = e.body, t.post = e.post;
            var r = e.args.slice(0);
            t.argTypes = r;
            for (var i = 0; i < r.length; ++i) {
                var s = r[i];
                if ("array" === s || "object" == typeof s && s.blockIndices) {
                    if (t.argTypes[i] = "array", t.arrayArgs.push(i), t.arrayBlockIndices.push(s.blockIndices ? s.blockIndices : 0), t.shimArgs.push("array" + i), i < t.pre.args.length && t.pre.args[i].count > 0) throw new Error("cwise: pre() block may not reference array args");
                    if (i < t.post.args.length && t.post.args[i].count > 0) throw new Error("cwise: post() block may not reference array args")
                } else if ("scalar" === s) t.scalarArgs.push(i), t.shimArgs.push("scalar" + i);
                else if ("index" === s) {
                    if (t.indexArgs.push(i), i < t.pre.args.length && t.pre.args[i].count > 0) throw new Error("cwise: pre() block may not reference array index");
                    if (i < t.body.args.length && t.body.args[i].lvalue) throw new Error("cwise: body() block may not write to array index");
                    if (i < t.post.args.length && t.post.args[i].count > 0) throw new Error("cwise: post() block may not reference array index")
                } else if ("shape" === s) {
                    if (t.shapeArgs.push(i), i < t.pre.args.length && t.pre.args[i].lvalue) throw new Error("cwise: pre() block may not write to array shape");
                    if (i < t.body.args.length && t.body.args[i].lvalue) throw new Error("cwise: body() block may not write to array shape");
                    if (i < t.post.args.length && t.post.args[i].lvalue) throw new Error("cwise: post() block may not write to array shape")
                } else {
                    if ("object" != typeof s || !s.offset) throw new Error("cwise: Unknown argument type " + r[i]);
                    t.argTypes[i] = "offset", t.offsetArgs.push({
                        array: s.array,
                        offset: s.offset
                    }), t.offsetArgIndex.push(i)
                }
            }
            if (t.arrayArgs.length <= 0) throw new Error("cwise: No array arguments specified");
            if (t.pre.args.length > r.length) throw new Error("cwise: Too many arguments in pre() block");
            if (t.body.args.length > r.length) throw new Error("cwise: Too many arguments in body() block");
            if (t.post.args.length > r.length) throw new Error("cwise: Too many arguments in post() block");
            return t.debug = !!e.printCode || !!e.debug, t.funcName = e.funcName || "cwise", t.blockSize = e.blockSize || 64, o(t)
        }
        var o = e("./lib/thunk.js");
        t.exports = i
    }, {
        "./lib/thunk.js": 202
    }],
    201: [function(e, t, r) {
        "use strict";

        function n(e, t, r) {
            var n, i, o = e.length,
                s = t.arrayArgs.length,
                a = t.indexArgs.length > 0,
                u = [],
                c = [],
                l = 0,
                h = 0;
            for (n = 0; n < o; ++n) c.push(["i", n, "=0"].join(""));
            for (i = 0; i < s; ++i)
                for (n = 0; n < o; ++n) h = l, l = e[n], 0 === n ? c.push(["d", i, "s", n, "=t", i, "p", l].join("")) : c.push(["d", i, "s", n, "=(t", i, "p", l, "-s", h, "*t", i, "p", h, ")"].join(""));
            for (c.length > 0 && u.push("var " + c.join(",")), n = o - 1; n >= 0; --n) l = e[n], u.push(["for(i", n, "=0;i", n, "<s", l, ";++i", n, "){"].join(""));
            for (u.push(r), n = 0; n < o; ++n) {
                for (h = l, l = e[n], i = 0; i < s; ++i) u.push(["p", i, "+=d", i, "s", n].join(""));
                a && (n > 0 && u.push(["index[", h, "]-=s", h].join("")), u.push(["++index[", l, "]"].join(""))), u.push("}")
            }
            return u.join("\n")
        }

        function i(e, t, r, i) {
            for (var o = t.length, s = r.arrayArgs.length, a = r.blockSize, u = r.indexArgs.length > 0, c = [], l = 0; l < s; ++l) c.push(["var offset", l, "=p", l].join(""));
            for (var l = e; l < o; ++l) c.push(["for(var j" + l + "=SS[", t[l], "]|0;j", l, ">0;){"].join("")), c.push(["if(j", l, "<", a, "){"].join("")), c.push(["s", t[l], "=j", l].join("")), c.push(["j", l, "=0"].join("")), c.push(["}else{s", t[l], "=", a].join("")), c.push(["j", l, "-=", a, "}"].join("")), u && c.push(["index[", t[l], "]=j", l].join(""));
            for (var l = 0; l < s; ++l) {
                for (var h = ["offset" + l], f = e; f < o; ++f) h.push(["j", f, "*t", l, "p", t[f]].join(""));
                c.push(["p", l, "=(", h.join("+"), ")"].join(""))
            }
            c.push(n(t, r, i));
            for (var l = e; l < o; ++l) c.push("}");
            return c.join("\n")
        }

        function o(e) {
            for (var t = 0, r = e[0].length; t < r;) {
                for (var n = 1; n < e.length; ++n)
                    if (e[n][t] !== e[0][t]) return t;
                    ++t
            }
            return t
        }

        function s(e, t, r) {
            for (var n = e.body, i = [], o = [], s = 0; s < e.args.length; ++s) {
                var a = e.args[s];
                if (!(a.count <= 0)) {
                    var u = new RegExp(a.name, "g"),
                        c = "",
                        l = t.arrayArgs.indexOf(s);
                    switch (t.argTypes[s]) {
                        case "offset":
                            var h = t.offsetArgIndex.indexOf(s),
                                f = t.offsetArgs[h];
                            l = f.array, c = "+q" + h;
                        case "array":
                            c = "p" + l + c;
                            var p = "l" + s,
                                d = "a" + l;
                            if (0 === t.arrayBlockIndices[l]) 1 === a.count ? "generic" === r[l] ? a.lvalue ? (i.push(["var ", p, "=", d, ".get(", c, ")"].join("")), n = n.replace(u, p), o.push([d, ".set(", c, ",", p, ")"].join(""))) : n = n.replace(u, [d, ".get(", c, ")"].join("")) : n = n.replace(u, [d, "[", c, "]"].join("")) : "generic" === r[l] ? (i.push(["var ", p, "=", d, ".get(", c, ")"].join("")), n = n.replace(u, p), a.lvalue && o.push([d, ".set(", c, ",", p, ")"].join(""))) : (i.push(["var ", p, "=", d, "[", c, "]"].join("")), n = n.replace(u, p), a.lvalue && o.push([d, "[", c, "]=", p].join("")));
                            else {
                                for (var m = [a.name], v = [c], y = 0; y < Math.abs(t.arrayBlockIndices[l]); y++) m.push("\\s*\\[([^\\]]+)\\]"), v.push("$" + (y + 1) + "*t" + l + "b" + y);
                                if (u = new RegExp(m.join(""), "g"), c = v.join("+"), "generic" === r[l]) throw new Error("cwise: Generic arrays not supported in combination with blocks!");
                                n = n.replace(u, [d, "[", c, "]"].join(""))
                            }
                            break;
                        case "scalar":
                            n = n.replace(u, "Y" + t.scalarArgs.indexOf(s));
                            break;
                        case "index":
                            n = n.replace(u, "index");
                            break;
                        case "shape":
                            n = n.replace(u, "shape")
                    }
                }
            }
            return [i.join("\n"), n, o.join("\n")].join("\n").trim()
        }

        function a(e) {
            for (var t = new Array(e.length), r = !0, n = 0; n < e.length; ++n) {
                var i = e[n],
                    o = i.match(/\d+/);
                o = o ? o[0] : "", 0 === i.charAt(0) ? t[n] = "u" + i.charAt(1) + o : t[n] = i.charAt(0) + o, n > 0 && (r = r && t[n] === t[n - 1])
            }
            return r ? t[0] : t.join("")
        }

        function u(e, t) {
            for (var r = t[1].length - Math.abs(e.arrayBlockIndices[0]) | 0, u = new Array(e.arrayArgs.length), l = new Array(e.arrayArgs.length), h = 0; h < e.arrayArgs.length; ++h) l[h] = t[2 * h], u[h] = t[2 * h + 1];
            for (var f = [], p = [], d = [], m = [], v = [], h = 0; h < e.arrayArgs.length; ++h) {
                e.arrayBlockIndices[h] < 0 ? (d.push(0), m.push(r), f.push(r), p.push(r + e.arrayBlockIndices[h])) : (d.push(e.arrayBlockIndices[h]), m.push(e.arrayBlockIndices[h] + r), f.push(0), p.push(e.arrayBlockIndices[h]));
                for (var y = [], _ = 0; _ < u[h].length; _++) d[h] <= u[h][_] && u[h][_] < m[h] && y.push(u[h][_] - d[h]);
                v.push(y)
            }
            for (var g = ["SS"], b = ["'use strict'"], E = [], _ = 0; _ < r; ++_) E.push(["s", _, "=SS[", _, "]"].join(""));
            for (var h = 0; h < e.arrayArgs.length; ++h) {
                g.push("a" + h), g.push("t" + h), g.push("p" + h);
                for (var _ = 0; _ < r; ++_) E.push(["t", h, "p", _, "=t", h, "[", d[h] + _, "]"].join(""));
                for (var _ = 0; _ < Math.abs(e.arrayBlockIndices[h]); ++_) E.push(["t", h, "b", _, "=t", h, "[", f[h] + _, "]"].join(""))
            }
            for (var h = 0; h < e.scalarArgs.length; ++h) g.push("Y" + h);
            if (e.shapeArgs.length > 0 && E.push("shape=SS.slice(0)"), e.indexArgs.length > 0) {
                for (var w = new Array(r), h = 0; h < r; ++h) w[h] = "0";
                E.push(["index=[", w.join(","), "]"].join(""))
            }
            for (var h = 0; h < e.offsetArgs.length; ++h) {
                for (var x = e.offsetArgs[h], A = [], _ = 0; _ < x.offset.length; ++_) 0 !== x.offset[_] && (1 === x.offset[_] ? A.push(["t", x.array, "p", _].join("")) : A.push([x.offset[_], "*t", x.array, "p", _].join("")));
                0 === A.length ? E.push("q" + h + "=0") : E.push(["q", h, "=", A.join("+")].join(""))
            }
            var S = c([].concat(e.pre.thisVars).concat(e.body.thisVars).concat(e.post.thisVars));
            E = E.concat(S), E.length > 0 && b.push("var " + E.join(","));
            for (var h = 0; h < e.arrayArgs.length; ++h) b.push("p" + h + "|=0");
            e.pre.body.length > 3 && b.push(s(e.pre, e, l));
            var O = s(e.body, e, l),
                T = o(v);
            T < r ? b.push(i(T, v[0], e, O)) : b.push(n(v[0], e, O)), e.post.body.length > 3 && b.push(s(e.post, e, l)), e.debug && console.log("-----Generated cwise routine for ", t, ":\n" + b.join("\n") + "\n----------");
            var k = [e.funcName || "unnamed", "_cwise_loop_", u[0].join("s"), "m", T, a(l)].join(""),
                P = new Function(["function ", k, "(", g.join(","), "){", b.join("\n"), "} return ", k].join(""));
            return P()
        }
        var c = e("uniq");
        t.exports = u
    }, {
        uniq: 236
    }],
    202: [function(e, t, r) {
        "use strict";

        function n(e) {
            var t = ["'use strict'", "var CACHED={}"],
                r = [],
                n = e.funcName + "_cwise_thunk";
            t.push(["return function ", n, "(", e.shimArgs.join(","), "){"].join(""));
            for (var o = [], s = [], a = [
                    ["array", e.arrayArgs[0], ".shape.slice(", Math.max(0, e.arrayBlockIndices[0]), e.arrayBlockIndices[0] < 0 ? "," + e.arrayBlockIndices[0] + ")" : ")"].join("")
                ], u = [], c = [], l = 0; l < e.arrayArgs.length; ++l) {
                var h = e.arrayArgs[l];
                r.push(["t", h, "=array", h, ".dtype,", "r", h, "=array", h, ".order"].join("")), o.push("t" + h), o.push("r" + h), s.push("t" + h), s.push("r" + h + ".join()"), a.push("array" + h + ".data"), a.push("array" + h + ".stride"), a.push("array" + h + ".offset|0"), l > 0 && (u.push("array" + e.arrayArgs[0] + ".shape.length===array" + h + ".shape.length+" + (Math.abs(e.arrayBlockIndices[0]) - Math.abs(e.arrayBlockIndices[l]))), c.push("array" + e.arrayArgs[0] + ".shape[shapeIndex+" + Math.max(0, e.arrayBlockIndices[0]) + "]===array" + h + ".shape[shapeIndex+" + Math.max(0, e.arrayBlockIndices[l]) + "]"))
            }
            e.arrayArgs.length > 1 && (t.push("if (!(" + u.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same dimensionality!')"), t.push("for(var shapeIndex=array" + e.arrayArgs[0] + ".shape.length-" + Math.abs(e.arrayBlockIndices[0]) + "; shapeIndex-->0;) {"), t.push("if (!(" + c.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same shape!')"), t.push("}"));
            for (var l = 0; l < e.scalarArgs.length; ++l) a.push("scalar" + e.scalarArgs[l]);
            r.push(["type=[", s.join(","), "].join()"].join("")), r.push("proc=CACHED[type]"), t.push("var " + r.join(",")), t.push(["if(!proc){", "CACHED[type]=proc=compile([", o.join(","), "])}", "return proc(", a.join(","), ")}"].join("")), e.debug && console.log("-----Generated thunk:\n" + t.join("\n") + "\n----------");
            var f = new Function("compile", t.join("\n"));
            return f(i.bind(void 0, e))
        }
        var i = e("./compile.js");
        t.exports = n
    }, {
        "./compile.js": 201
    }],
    203: [function(e, t, r) {
        "use strict";

        function n(e, t, r) {
            var i = 0 | e[r];
            if (i <= 0) return [];
            var o, s = new Array(i);
            if (r === e.length - 1)
                for (o = 0; o < i; ++o) s[o] = t;
            else
                for (o = 0; o < i; ++o) s[o] = n(e, t, r + 1);
            return s
        }

        function i(e, t) {
            var r, n;
            for (r = new Array(e), n = 0; n < e; ++n) r[n] = t;
            return r
        }

        function o(e, t) {
            switch ("undefined" == typeof t && (t = 0), typeof e) {
                case "number":
                    if (e > 0) return i(0 | e, t);
                    break;
                case "object":
                    if ("number" == typeof e.length) return n(e, t, 0)
            }
            return []
        }
        t.exports = o
    }, {}],
    204: [function(e, t, r) {
        "use strict";

        function n(e, t, r, n, i) {
            this.gl = e, this.type = t, this.handle = r, this.length = n, this.usage = i
        }

        function i(e, t, r, n, i, o) {
            var s = i.length * i.BYTES_PER_ELEMENT;
            if (o < 0) return e.bufferData(t, i, n), s;
            if (s + o > r) throw new Error("gl-buffer: If resizing buffer, must not specify offset");
            return e.bufferSubData(t, o, i), r
        }

        function o(e, t) {
            for (var r = u.malloc(e.length, t), n = e.length, i = 0; i < n; ++i) r[i] = e[i];
            return r
        }

        function s(e, t) {
            for (var r = 1, n = t.length - 1; n >= 0; --n) {
                if (t[n] !== r) return !1;
                r *= e[n]
            }
            return !0
        }

        function a(e, t, r, i) {
            if (r = r || e.ARRAY_BUFFER, i = i || e.DYNAMIC_DRAW, r !== e.ARRAY_BUFFER && r !== e.ELEMENT_ARRAY_BUFFER) throw new Error("gl-buffer: Invalid type for webgl buffer, must be either gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER");
            if (i !== e.DYNAMIC_DRAW && i !== e.STATIC_DRAW && i !== e.STREAM_DRAW) throw new Error("gl-buffer: Invalid usage for buffer, must be either gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW");
            var o = e.createBuffer(),
                s = new n(e, r, o, 0, i);
            return s.update(t), s
        }
        var u = e("typedarray-pool"),
            c = e("ndarray-ops"),
            l = e("ndarray"),
            h = ["uint8", "uint8_clamped", "uint16", "uint32", "int8", "int16", "int32", "float32"],
            f = n.prototype;
        f.bind = function() {
            this.gl.bindBuffer(this.type, this.handle)
        }, f.unbind = function() {
            this.gl.bindBuffer(this.type, null)
        }, f.dispose = function() {
            this.gl.deleteBuffer(this.handle)
        }, f.update = function(e, t) {
            if ("number" != typeof t && (t = -1), this.bind(), "object" == typeof e && "undefined" != typeof e.shape) {
                var r = e.dtype;
                if (h.indexOf(r) < 0 && (r = "float32"), this.type === this.gl.ELEMENT_ARRAY_BUFFER) {
                    var n = gl.getExtension("OES_element_index_uint");
                    r = n && "uint16" !== r ? "uint32" : "uint16"
                }
                if (r === e.dtype && s(e.shape, e.stride)) 0 === e.offset && e.data.length === e.shape[0] ? this.length = i(this.gl, this.type, this.length, this.usage, e.data, t) : this.length = i(this.gl, this.type, this.length, this.usage, e.data.subarray(e.offset, e.shape[0]), t);
                else {
                    var a = u.malloc(e.size, r),
                        f = l(a, e.shape);
                    c.assign(f, e), t < 0 ? this.length = i(this.gl, this.type, this.length, this.usage, a, t) : this.length = i(this.gl, this.type, this.length, this.usage, a.subarray(0, e.size), t), u.free(a)
                }
            } else if (Array.isArray(e)) {
                var p;
                p = this.type === this.gl.ELEMENT_ARRAY_BUFFER ? o(e, "uint16") : o(e, "float32"), t < 0 ? this.length = i(this.gl, this.type, this.length, this.usage, p, t) : this.length = i(this.gl, this.type, this.length, this.usage, p.subarray(0, e.length), t), u.free(p)
            } else if ("object" == typeof e && "number" == typeof e.length) this.length = i(this.gl, this.type, this.length, this.usage, e, t);
            else {
                if ("number" != typeof e && void 0 !== e) throw new Error("gl-buffer: Invalid data type");
                if (t >= 0) throw new Error("gl-buffer: Cannot specify offset when resizing buffer");
                e = 0 | e, e <= 0 && (e = 1), this.gl.bufferData(this.type, 0 | e, this.usage), this.length = e
            }
        }, t.exports = a
    }, {
        ndarray: 234,
        "ndarray-ops": 233,
        "typedarray-pool": 235
    }],
    205: [function(e, t, r) {
        function n(e) {
            var t = new Float32Array(16);
            return t[0] = e[0], t[1] = e[1], t[2] = e[2], t[3] = e[3], t[4] = e[4], t[5] = e[5], t[6] = e[6], t[7] = e[7], t[8] = e[8], t[9] = e[9], t[10] = e[10], t[11] = e[11], t[12] = e[12], t[13] = e[13], t[14] = e[14], t[15] = e[15], t
        }
        t.exports = n
    }, {}],
    206: [function(e, t, r) {
        function n() {
            var e = new Float32Array(16);
            return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 0, e[4] = 0, e[5] = 1, e[6] = 0, e[7] = 0, e[8] = 0, e[9] = 0, e[10] = 1, e[11] = 0, e[12] = 0, e[13] = 0, e[14] = 0, e[15] = 1, e
        }
        t.exports = n
    }, {}],
    207: [function(e, t, r) {
        function n(e, t) {
            var r = t[0],
                n = t[1],
                i = t[2],
                o = t[3],
                s = t[4],
                a = t[5],
                u = t[6],
                c = t[7],
                l = t[8],
                h = t[9],
                f = t[10],
                p = t[11],
                d = t[12],
                m = t[13],
                v = t[14],
                y = t[15],
                _ = r * a - n * s,
                g = r * u - i * s,
                b = r * c - o * s,
                E = n * u - i * a,
                w = n * c - o * a,
                x = i * c - o * u,
                A = l * m - h * d,
                S = l * v - f * d,
                O = l * y - p * d,
                T = h * v - f * m,
                k = h * y - p * m,
                P = f * y - p * v,
                C = _ * P - g * k + b * T + E * O - w * S + x * A;
            return C ? (C = 1 / C, e[0] = (a * P - u * k + c * T) * C, e[1] = (i * k - n * P - o * T) * C, e[2] = (m * x - v * w + y * E) * C, e[3] = (f * w - h * x - p * E) * C, e[4] = (u * O - s * P - c * S) * C, e[5] = (r * P - i * O + o * S) * C, e[6] = (v * b - d * x - y * g) * C, e[7] = (l * x - f * b + p * g) * C, e[8] = (s * k - a * O + c * A) * C, e[9] = (n * O - r * k - o * A) * C, e[10] = (d * w - m * b + y * _) * C, e[11] = (h * b - l * w - p * _) * C, e[12] = (a * S - s * T - u * A) * C, e[13] = (r * T - n * S + i * A) * C, e[14] = (m * g - d * E - v * _) * C, e[15] = (l * E - h * g + f * _) * C, e) : null
        }
        t.exports = n
    }, {}],
    208: [function(e, t, r) {
        function n(e, t, r) {
            var n = Math.sin(r),
                i = Math.cos(r),
                o = t[4],
                s = t[5],
                a = t[6],
                u = t[7],
                c = t[8],
                l = t[9],
                h = t[10],
                f = t[11];
            return t !== e && (e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[4] = o * i + c * n, e[5] = s * i + l * n, e[6] = a * i + h * n, e[7] = u * i + f * n, e[8] = c * i - o * n, e[9] = l * i - s * n, e[10] = h * i - a * n, e[11] = f * i - u * n, e
        }
        t.exports = n
    }, {}],
    209: [function(e, t, r) {
        function n(e, t, r) {
            var n = Math.sin(r),
                i = Math.cos(r),
                o = t[0],
                s = t[1],
                a = t[2],
                u = t[3],
                c = t[8],
                l = t[9],
                h = t[10],
                f = t[11];
            return t !== e && (e[4] = t[4], e[5] = t[5], e[6] = t[6], e[7] = t[7], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = o * i - c * n, e[1] = s * i - l * n, e[2] = a * i - h * n, e[3] = u * i - f * n, e[8] = o * n + c * i, e[9] = s * n + l * i, e[10] = a * n + h * i, e[11] = u * n + f * i, e
        }
        t.exports = n
    }, {}],
    210: [function(e, t, r) {
        function n(e, t, r) {
            var n = Math.sin(r),
                i = Math.cos(r),
                o = t[0],
                s = t[1],
                a = t[2],
                u = t[3],
                c = t[4],
                l = t[5],
                h = t[6],
                f = t[7];
            return t !== e && (e[8] = t[8], e[9] = t[9], e[10] = t[10], e[11] = t[11], e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15]), e[0] = o * i + c * n, e[1] = s * i + l * n, e[2] = a * i + h * n, e[3] = u * i + f * n, e[4] = c * i - o * n, e[5] = l * i - s * n, e[6] = h * i - a * n, e[7] = f * i - u * n, e
        }
        t.exports = n
    }, {}],
    211: [function(e, t, r) {
        function n(e, t, r) {
            var n = r[0],
                i = r[1],
                o = r[2];
            return e[0] = t[0] * n, e[1] = t[1] * n, e[2] = t[2] * n, e[3] = t[3] * n, e[4] = t[4] * i, e[5] = t[5] * i, e[6] = t[6] * i, e[7] = t[7] * i, e[8] = t[8] * o, e[9] = t[9] * o, e[10] = t[10] * o, e[11] = t[11] * o, e[12] = t[12], e[13] = t[13], e[14] = t[14], e[15] = t[15], e
        }
        t.exports = n
    }, {}],
    212: [function(e, t, r) {
        function n(e, t) {
            if (e === t) {
                var r = t[1],
                    n = t[2],
                    i = t[3],
                    o = t[6],
                    s = t[7],
                    a = t[11];
                e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = r, e[6] = t[9], e[7] = t[13], e[8] = n, e[9] = o, e[11] = t[14], e[12] = i, e[13] = s, e[14] = a
            } else e[0] = t[0], e[1] = t[4], e[2] = t[8], e[3] = t[12], e[4] = t[1], e[5] = t[5], e[6] = t[9], e[7] = t[13], e[8] = t[2], e[9] = t[6], e[10] = t[10], e[11] = t[14], e[12] = t[3], e[13] = t[7], e[14] = t[11], e[15] = t[15];
            return e
        }
        t.exports = n
    }, {}],
    213: [function(e, t, r) {
        "use strict";

        function n(e, t, r, n, i, o, s) {
            this._gl = e, this._program = t, this._location = r, this._dimension = n, this._name = i, this._constFunc = o, this._relink = s
        }

        function i(e, t, r, i, o, s, a) {
            for (var u = ["gl", "v"], c = [], l = 0; l < i; ++l) u.push("x" + l), c.push("x" + l);
            u.push(["if(x0.length===void 0){return gl.vertexAttrib", i, "f(v,", c.join(), ")}else{return gl.vertexAttrib", i, "fv(v,x0)}"].join(""));
            var h = Function.apply(void 0, u),
                f = new n(e, t, r, i, s, h, a);
            Object.defineProperty(o, s, {
                set: function(t) {
                    return e.disableVertexAttribArray(f._location), h(e, f._location, t), t
                },
                get: function() {
                    return f
                },
                enumerable: !0
            })
        }

        function o(e, t, r, n) {
            for (var o = {}, s = 0, a = r.length; s < a; ++s) {
                var u = r[s],
                    c = u.name,
                    l = u.type,
                    h = e.getAttribLocation(t, c);
                switch (l) {
                    case "bool":
                    case "int":
                    case "float":
                        i(e, t, h, 1, o, c, n);
                        break;
                    default:
                        if (!(l.indexOf("vec") >= 0)) throw new Error("gl-shader: Unknown data type for attribute " + c + ": " + l);
                        var f = l.charCodeAt(l.length - 1) - 48;
                        if (f < 2 || f > 4) throw new Error("gl-shader: Invalid data type for attribute " + c + ": " + l);
                        i(e, t, h, f, o, c, n)
                }
            }
            return o
        }
        t.exports = o;
        var s = n.prototype;
        s.pointer = function(e, t, r, n) {
            var i = this._gl;
            i.vertexAttribPointer(this._location, this._dimension, e || i.FLOAT, !!t, r || 0, n || 0), this._gl.enableVertexAttribArray(this._location)
        }, Object.defineProperty(s, "location", {
            get: function() {
                return this._location
            },
            set: function(e) {
                e !== this._location && (this._location = e, this._gl.bindAttribLocation(this._program, e, this._name), this._gl.linkProgram(this._program), this._relink())
            }
        })
    }, {}],
    214: [function(e, t, r) {
        "use strict";

        function n(e) {
            var t = new Function("y", "return function(){return y}");
            return t(e)
        }

        function i(e, t, r, i) {
            function a(r) {
                var n = new Function("gl", "prog", "locations", "return function(){return gl.getUniform(prog,locations[" + r + "])}");
                return n(e, t, i)
            }

            function u(e, t, r) {
                switch (r) {
                    case "bool":
                    case "int":
                    case "sampler2D":
                    case "samplerCube":
                        return "gl.uniform1i(locations[" + t + "],obj" + e + ")";
                    case "float":
                        return "gl.uniform1f(locations[" + t + "],obj" + e + ")";
                    default:
                        var n = r.indexOf("vec");
                        if (!(0 <= n && n <= 1 && r.length === 4 + n)) {
                            if (0 === r.indexOf("mat") && 4 === r.length) {
                                var i = r.charCodeAt(r.length - 1) - 48;
                                if (i < 2 || i > 4) throw new Error("gl-shader: Invalid uniform dimension type for matrix " + name + ": " + r);
                                return "gl.uniformMatrix" + i + "fv(locations[" + t + "],false,obj" + e + ")"
                            }
                            throw new Error("gl-shader: Unknown uniform data type for " + name + ": " + r)
                        }
                        var i = r.charCodeAt(r.length - 1) - 48;
                        if (i < 2 || i > 4) throw new Error("gl-shader: Invalid data type");
                        switch (r.charAt(0)) {
                            case "b":
                            case "i":
                                return "gl.uniform" + i + "iv(locations[" + t + "],obj" + e + ")";
                            case "v":
                                return "gl.uniform" + i + "fv(locations[" + t + "],obj" + e + ")";
                            default:
                                throw new Error("gl-shader: Unrecognized data type for vector " + name + ": " + r)
                        }
                }
            }

            function c(e, t) {
                if ("object" != typeof t) return [
                    [e, t]
                ];
                var r = [];
                for (var n in t) {
                    var i = t[n],
                        o = e;
                    o += parseInt(n) + "" === n ? "[" + n + "]" : "." + n, "object" == typeof i ? r.push.apply(r, c(o, i)) : r.push([o, i])
                }
                return r
            }

            function l(n) {
                for (var o = ["return function updateProperty(obj){"], s = c("", n), a = 0; a < s.length; ++a) {
                    var l = s[a],
                        h = l[0],
                        f = l[1];
                    i[f] && o.push(u(h, f, r[f].type))
                }
                o.push("return obj}");
                var p = new Function("gl", "prog", "locations", o.join("\n"));
                return p(e, t, i)
            }

            function h(e) {
                switch (e) {
                    case "bool":
                        return !1;
                    case "int":
                    case "sampler2D":
                    case "samplerCube":
                        return 0;
                    case "float":
                        return 0;
                    default:
                        var t = e.indexOf("vec");
                        if (0 <= t && t <= 1 && e.length === 4 + t) {
                            var r = e.charCodeAt(e.length - 1) - 48;
                            if (r < 2 || r > 4) throw new Error("gl-shader: Invalid data type");
                            return "b" === e.charAt(0) ? o(r, !1) : o(r)
                        }
                        if (0 === e.indexOf("mat") && 4 === e.length) {
                            var r = e.charCodeAt(e.length - 1) - 48;
                            if (r < 2 || r > 4) throw new Error("gl-shader: Invalid uniform dimension type for matrix " + name + ": " + e);
                            return o([r, r])
                        }
                        throw new Error("gl-shader: Unknown uniform data type for " + name + ": " + e)
                }
            }

            function f(e, t, o) {
                if ("object" == typeof o) {
                    var s = p(o);
                    Object.defineProperty(e, t, {
                        get: n(s),
                        set: l(o),
                        enumerable: !0,
                        configurable: !1
                    })
                } else i[o] ? Object.defineProperty(e, t, {
                    get: a(o),
                    set: l(o),
                    enumerable: !0,
                    configurable: !1
                }) : e[t] = h(r[o].type)
            }

            function p(e) {
                var t;
                if (Array.isArray(e)) {
                    t = new Array(e.length);
                    for (var r = 0; r < e.length; ++r) f(t, r, e[r])
                } else {
                    t = {};
                    for (var n in e) f(t, n, e[n])
                }
                return t
            }
            var d = s(r, !0);
            return {
                get: n(p(d)),
                set: l(d),
                enumerable: !0,
                configurable: !0
            }
        }
        var o = e("dup"),
            s = e("./reflect");
        t.exports = i
    }, {
        "./reflect": 215,
        dup: 203
    }],
    215: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            for (var r = {}, n = 0; n < e.length; ++n)
                for (var i = e[n].name, o = i.split("."), s = r, a = 0; a < o.length; ++a) {
                    var u = o[a].split("[");
                    if (u.length > 1) {
                        u[0] in s || (s[u[0]] = []), s = s[u[0]];
                        for (var c = 1; c < u.length; ++c) {
                            var l = parseInt(u[c]);
                            c < u.length - 1 || a < o.length - 1 ? (l in s || (c < u.length - 1 ? s[l] = [] : s[l] = {}), s = s[l]) : t ? s[l] = n : s[l] = e[n].type
                        }
                    } else a < o.length - 1 ? (u[0] in s || (s[u[0]] = {}), s = s[u[0]]) : t ? s[u[0]] = n : s[u[0]] = e[n].type
                }
            return r
        }
        t.exports = n
    }, {}],
    216: [function(e, t, r) {
        "use strict";

        function n(e, t, r, n) {
            this.gl = e, this.handle = t, this.attributes = null, this.uniforms = null, this.types = null, this.vertexShader = r, this.fragmentShader = n
        }

        function i(e, t, r, n) {
            for (var i = 0; i < n.length; ++i) r[i] = e.getUniformLocation(t, n[i].name)
        }

        function o(e, t, r, i, o) {
            var s = e.createShader(e.VERTEX_SHADER);
            if (e.shaderSource(s, t), e.compileShader(s), !e.getShaderParameter(s, e.COMPILE_STATUS)) {
                var a = e.getShaderInfoLog(s);
                throw console.error("gl-shader: Error compling vertex shader:", a), new Error("gl-shader: Error compiling vertex shader:" + a)
            }
            var u = e.createShader(e.FRAGMENT_SHADER);
            if (e.shaderSource(u, r), e.compileShader(u), !e.getShaderParameter(u, e.COMPILE_STATUS)) {
                var a = e.getShaderInfoLog(u);
                throw console.error("gl-shader: Error compiling fragment shader:", a), new Error("gl-shader: Error compiling fragment shader:" + a)
            }
            var c = e.createProgram();
            if (e.attachShader(c, u), e.attachShader(c, s), o.forEach(function(t) {
                    "number" == typeof t.location && e.bindAttribLocation(c, t.location, t.name)
                }), e.linkProgram(c), !e.getProgramParameter(c, e.LINK_STATUS)) {
                var a = e.getProgramInfoLog(c);
                throw console.error("gl-shader: Error linking shader program:", a), new Error("gl-shader: Error linking shader program:" + a)
            }
            var l = new n(e, c, s, u);
            return l.updateExports(i, o), l
        }
        var s = e("./lib/create-uniforms"),
            a = e("./lib/create-attributes"),
            u = e("./lib/reflect");
        n.prototype.bind = function() {
            this.gl.useProgram(this.handle)
        }, n.prototype.dispose = function() {
            var e = this.gl;
            e.deleteShader(this.vertexShader), e.deleteShader(this.fragmentShader), e.deleteProgram(this.handle)
        }, n.prototype.updateExports = function(e, t) {
            var r = new Array(e.length),
                n = this.handle,
                o = this.gl,
                c = i.bind(void 0, o, n, r, e);
            c(), this.types = {
                uniforms: u(e),
                attributes: u(t)
            }, this.attributes = a(o, n, t, c), Object.defineProperty(this, "uniforms", s(o, n, e, r))
        }, t.exports = o
    }, {
        "./lib/create-attributes": 213,
        "./lib/create-uniforms": 214,
        "./lib/reflect": 215
    }],
    217: [function(e, t, r) {
        "use strict";

        function n(e) {
            y = [e.LINEAR, e.NEAREST_MIPMAP_LINEAR, e.LINEAR_MIPMAP_NEAREST, e.LINEAR_MIPMAP_NEAREST], _ = [e.NEAREST, e.LINEAR, e.NEAREST_MIPMAP_NEAREST, e.NEAREST_MIPMAP_LINEAR, e.LINEAR_MIPMAP_NEAREST, e.LINEAR_MIPMAP_LINEAR], g = [e.REPEAT, e.CLAMP_TO_EDGE, e.MIRRORED_REPEAT]
        }

        function i(e) {
            return "undefined" != typeof HTMLCanvasElement && e instanceof HTMLCanvasElement || "undefined" != typeof HTMLImageElement && e instanceof HTMLImageElement || "undefined" != typeof HTMLVideoElement && e instanceof HTMLVideoElement || "undefined" != typeof ImageData && e instanceof ImageData
        }

        function o(e, t, r) {
            var n = e.gl,
                i = n.getParameter(n.MAX_TEXTURE_SIZE);
            if (t < 0 || t > i || r < 0 || r > i) throw new Error("gl-texture2d: Invalid texture size");
            return e._shape = [t, r], e.bind(), n.texImage2D(n.TEXTURE_2D, 0, e.format, t, r, 0, e.format, e.type, null), e._mipLevels = [0], e
        }

        function s(e, t, r, n, i, o) {
            this.gl = e, this.handle = t, this.format = i, this.type = o, this._shape = [r, n], this._mipLevels = [0], this._magFilter = e.NEAREST, this._minFilter = e.NEAREST, this._wrapS = e.CLAMP_TO_EDGE, this._wrapT = e.CLAMP_TO_EDGE, this._anisoSamples = 1;
            var s = this,
                a = [this._wrapS, this._wrapT];
            Object.defineProperties(a, [{
                get: function() {
                    return s._wrapS
                },
                set: function(e) {
                    return s.wrapS = e
                }
            }, {
                get: function() {
                    return s._wrapT
                },
                set: function(e) {
                    return s.wrapT = e
                }
            }]), this._wrapVector = a;
            var u = [this._shape[0], this._shape[1]];
            Object.defineProperties(u, [{
                get: function() {
                    return s._shape[0]
                },
                set: function(e) {
                    return s.width = e
                }
            }, {
                get: function() {
                    return s._shape[1]
                },
                set: function(e) {
                    return s.height = e
                }
            }]), this._shapeVector = u
        }

        function a(e, t) {
            return 3 === e.length ? 1 === t[2] && t[1] === e[0] * e[2] && t[0] === e[2] : 1 === t[0] && t[1] === e[0]
        }

        function u(e, t, r, n, i, o, s, u) {
            var c = u.dtype,
                l = u.shape.slice();
            if (l.length < 2 || l.length > 3) throw new Error("gl-texture2d: Invalid ndarray, must be 2d or 3d");
            var h = 0,
                f = 0,
                p = a(l, u.stride.slice());
            "float32" === c ? h = e.FLOAT : "float64" === c ? (h = e.FLOAT, p = !1, c = "float32") : "uint8" === c ? h = e.UNSIGNED_BYTE : (h = e.UNSIGNED_BYTE, p = !1, c = "uint8");
            var y = 1;
            if (2 === l.length) f = e.LUMINANCE, l = [l[0], l[1], 1], u = d(u.data, l, [u.stride[0], u.stride[1], 1], u.offset);
            else {
                if (3 !== l.length) throw new Error("gl-texture2d: Invalid shape for texture");
                if (1 === l[2]) f = e.ALPHA;
                else if (2 === l[2]) f = e.LUMINANCE_ALPHA;
                else if (3 === l[2]) f = e.RGB;
                else {
                    if (4 !== l[2]) throw new Error("gl-texture2d: Invalid shape for pixel coords");
                    f = e.RGBA
                }
                y = l[2]
            }
            if (f !== e.LUMINANCE && f !== e.ALPHA || i !== e.LUMINANCE && i !== e.ALPHA || (f = i), f !== i) throw new Error("gl-texture2d: Incompatible texture format for setPixels");
            var _ = u.size,
                g = s.indexOf(n) < 0;
            if (g && s.push(n), h === o && p) 0 === u.offset && u.data.length === _ ? g ? e.texImage2D(e.TEXTURE_2D, n, i, l[0], l[1], 0, i, o, u.data) : e.texSubImage2D(e.TEXTURE_2D, n, t, r, l[0], l[1], i, o, u.data) : g ? e.texImage2D(e.TEXTURE_2D, n, i, l[0], l[1], 0, i, o, u.data.subarray(u.offset, u.offset + _)) : e.texSubImage2D(e.TEXTURE_2D, n, t, r, l[0], l[1], i, o, u.data.subarray(u.offset, u.offset + _));
            else {
                var E;
                E = o === e.FLOAT ? v.mallocFloat32(_) : v.mallocUint8(_);
                var w = d(E, l, [l[2], l[2] * l[0], 1]);
                h === e.FLOAT && o === e.UNSIGNED_BYTE ? b(w, u) : m.assign(w, u), g ? e.texImage2D(e.TEXTURE_2D, n, i, l[0], l[1], 0, i, o, E.subarray(0, _)) : e.texSubImage2D(e.TEXTURE_2D, n, t, r, l[0], l[1], i, o, E.subarray(0, _)), o === e.FLOAT ? v.freeFloat32(E) : v.freeUint8(E)
            }
        }

        function c(e) {
            var t = e.createTexture();
            return e.bindTexture(e.TEXTURE_2D, t), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), t
        }

        function l(e, t, r, n, i) {
            var o = e.getParameter(e.MAX_TEXTURE_SIZE);
            if (t < 0 || t > o || r < 0 || r > o) throw new Error("gl-texture2d: Invalid texture shape");
            if (i === e.FLOAT && !e.getExtension("OES_texture_float")) throw new Error("gl-texture2d: Floating point textures not supported on this platform");
            var a = c(e);
            return e.texImage2D(e.TEXTURE_2D, 0, n, t, r, 0, n, i, null), new s(e, a, t, r, n, i)
        }

        function h(e, t, r, n, i, o) {
            var a = c(e);
            return e.texImage2D(e.TEXTURE_2D, 0, i, i, o, t), new s(e, a, r, n, i, o)
        }

        function f(e, t) {
            var r = t.dtype,
                n = t.shape.slice(),
                i = e.getParameter(e.MAX_TEXTURE_SIZE);
            if (n[0] < 0 || n[0] > i || n[1] < 0 || n[1] > i) throw new Error("gl-texture2d: Invalid texture size");
            var o = a(n, t.stride.slice()),
                u = 0;
            "float32" === r ? u = e.FLOAT : "float64" === r ? (u = e.FLOAT, o = !1, r = "float32") : "uint8" === r ? u = e.UNSIGNED_BYTE : (u = e.UNSIGNED_BYTE, o = !1, r = "uint8");
            var l = 0;
            if (2 === n.length) l = e.LUMINANCE, n = [n[0], n[1], 1], t = d(t.data, n, [t.stride[0], t.stride[1], 1], t.offset);
            else {
                if (3 !== n.length) throw new Error("gl-texture2d: Invalid shape for texture");
                if (1 === n[2]) l = e.ALPHA;
                else if (2 === n[2]) l = e.LUMINANCE_ALPHA;
                else if (3 === n[2]) l = e.RGB;
                else {
                    if (4 !== n[2]) throw new Error("gl-texture2d: Invalid shape for pixel coords");
                    l = e.RGBA
                }
            }
            u !== e.FLOAT || e.getExtension("OES_texture_float") || (u = e.UNSIGNED_BYTE, o = !1);
            var h, f, p = t.size;
            if (o) h = 0 === t.offset && t.data.length === p ? t.data : t.data.subarray(t.offset, t.offset + p);
            else {
                var y = [n[2], n[2] * n[0], 1];
                f = v.malloc(p, r);
                var _ = d(f, n, y, 0);
                "float32" !== r && "float64" !== r || u !== e.UNSIGNED_BYTE ? m.assign(_, t) : b(_, t), h = f.subarray(0, p)
            }
            var g = c(e);
            return e.texImage2D(e.TEXTURE_2D, 0, l, n[0], n[1], 0, l, u, h), o || v.free(f), new s(e, g, n[0], n[1], l, u)
        }

        function p(e) {
            if (arguments.length <= 1) throw new Error("gl-texture2d: Missing arguments for texture2d constructor");
            if (y || n(e), "number" == typeof arguments[1]) return l(e, arguments[1], arguments[2], arguments[3] || e.RGBA, arguments[4] || e.UNSIGNED_BYTE);
            if (Array.isArray(arguments[1])) return l(e, 0 | arguments[1][0], 0 | arguments[1][1], arguments[2] || e.RGBA, arguments[3] || e.UNSIGNED_BYTE);
            if ("object" == typeof arguments[1]) {
                var t = arguments[1],
                    r = i(t) ? t : t.raw;
                if (r) return h(e, r, 0 | t.width, 0 | t.height, arguments[2] || e.RGBA, arguments[3] || e.UNSIGNED_BYTE);
                if (t.shape && t.data && t.stride) return f(e, t)
            }
            throw new Error("gl-texture2d: Invalid arguments for texture2d constructor")
        }
        var d = e("ndarray"),
            m = e("ndarray-ops"),
            v = e("typedarray-pool");
        t.exports = p;
        var y = null,
            _ = null,
            g = null,
            b = function(e, t) {
                m.muls(e, t, 255)
            },
            E = s.prototype;
        Object.defineProperties(E, {
            minFilter: {
                get: function() {
                    return this._minFilter
                },
                set: function(e) {
                    this.bind();
                    var t = this.gl;
                    if (this.type === t.FLOAT && y.indexOf(e) >= 0 && (t.getExtension("OES_texture_float_linear") || (e = t.NEAREST)), _.indexOf(e) < 0) throw new Error("gl-texture2d: Unknown filter mode " + e);
                    return t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, e), this._minFilter = e
                }
            },
            magFilter: {
                get: function() {
                    return this._magFilter
                },
                set: function(e) {
                    this.bind();
                    var t = this.gl;
                    if (this.type === t.FLOAT && y.indexOf(e) >= 0 && (t.getExtension("OES_texture_float_linear") || (e = t.NEAREST)), _.indexOf(e) < 0) throw new Error("gl-texture2d: Unknown filter mode " + e);
                    return t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, e), this._magFilter = e
                }
            },
            mipSamples: {
                get: function() {
                    return this._anisoSamples
                },
                set: function(e) {
                    var t = this._anisoSamples;
                    if (this._anisoSamples = 0 | Math.max(e, 1), t !== this._anisoSamples) {
                        var r = this.gl.getExtension("EXT_texture_filter_anisotropic");
                        r && this.gl.texParameterf(this.gl.TEXTURE_2D, r.TEXTURE_MAX_ANISOTROPY_EXT, this._anisoSamples)
                    }
                    return this._anisoSamples
                }
            },
            wrapS: {
                get: function() {
                    return this._wrapS
                },
                set: function(e) {
                    if (this.bind(), g.indexOf(e) < 0) throw new Error("gl-texture2d: Unknown wrap mode " + e);
                    return this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, e), this._wrapS = e
                }
            },
            wrapT: {
                get: function() {
                    return this._wrapT
                },
                set: function(e) {
                    if (this.bind(), g.indexOf(e) < 0) throw new Error("gl-texture2d: Unknown wrap mode " + e);
                    return this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, e), this._wrapT = e
                }
            },
            wrap: {
                get: function() {
                    return this._wrapVector
                },
                set: function(e) {
                    if (Array.isArray(e) || (e = [e, e]), 2 !== e.length) throw new Error("gl-texture2d: Must specify wrap mode for rows and columns");
                    for (var t = 0; t < 2; ++t)
                        if (g.indexOf(e[t]) < 0) throw new Error("gl-texture2d: Unknown wrap mode " + e);
                    this._wrapS = e[0], this._wrapT = e[1];
                    var r = this.gl;
                    return this.bind(), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_S, this._wrapS), r.texParameteri(r.TEXTURE_2D, r.TEXTURE_WRAP_T, this._wrapT), e
                }
            },
            shape: {
                get: function() {
                    return this._shapeVector
                },
                set: function(e) {
                    if (Array.isArray(e)) {
                        if (2 !== e.length) throw new Error("gl-texture2d: Invalid texture shape")
                    } else e = [0 | e, 0 | e];
                    return o(this, 0 | e[0], 0 | e[1]), [0 | e[0], 0 | e[1]]
                }
            },
            width: {
                get: function() {
                    return this._shape[0]
                },
                set: function(e) {
                    return e = 0 | e, o(this, e, this._shape[1]), e
                }
            },
            height: {
                get: function() {
                    return this._shape[1]
                },
                set: function(e) {
                    return e = 0 | e, o(this, this._shape[0], e), e
                }
            }
        }), E.bind = function(e) {
            var t = this.gl;
            return void 0 !== e && t.activeTexture(t.TEXTURE0 + (0 | e)), t.bindTexture(t.TEXTURE_2D, this.handle), void 0 !== e ? 0 | e : t.getParameter(t.ACTIVE_TEXTURE) - t.TEXTURE0
        }, E.dispose = function() {
            this.gl.deleteTexture(this.handle)
        }, E.generateMipmap = function() {
            this.bind(), this.gl.generateMipmap(this.gl.TEXTURE_2D);
            for (var e = Math.min(this._shape[0], this._shape[1]), t = 0; e > 0; ++t, e >>>= 1) this._mipLevels.indexOf(t) < 0 && this._mipLevels.push(t)
        }, E.setPixels = function(e, t, r, n) {
            var o = this.gl;
            this.bind(), Array.isArray(t) ? (n = r, r = 0 | t[1], t = 0 | t[0]) : (t = t || 0, r = r || 0), n = n || 0;
            var s = i(e) ? e : e.raw;
            if (s) {
                var a = this._mipLevels.indexOf(n) < 0;
                a ? (o.texImage2D(o.TEXTURE_2D, 0, this.format, this.format, this.type, s), this._mipLevels.push(n)) : o.texSubImage2D(o.TEXTURE_2D, n, t, r, this.format, this.type, s)
            } else {
                if (!(e.shape && e.stride && e.data)) throw new Error("gl-texture2d: Unsupported data type");
                if (e.shape.length < 2 || t + e.shape[1] > this._shape[1] >>> n || r + e.shape[0] > this._shape[0] >>> n || t < 0 || r < 0) throw new Error("gl-texture2d: Texture dimensions are out of bounds");
                u(o, t, r, n, this.format, this.type, this._mipLevels, e)
            }
        }
    }, {
        ndarray: 234,
        "ndarray-ops": 233,
        "typedarray-pool": 235
    }],
    218: [function(e, t, r) {
        "use strict";

        function n(e, t, r) {
            t ? t.bind() : e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, null);
            var n = 0 | e.getParameter(e.MAX_VERTEX_ATTRIBS);
            if (r) {
                if (r.length > n) throw new Error("gl-vao: Too many vertex attributes");
                for (var i = 0; i < r.length; ++i) {
                    var o = r[i];
                    if (o.buffer) {
                        var s = o.buffer,
                            a = o.size || 4,
                            u = o.type || e.FLOAT,
                            c = !!o.normalized,
                            l = o.stride || 0,
                            h = o.offset || 0;
                        s.bind(), e.enableVertexAttribArray(i), e.vertexAttribPointer(i, a, u, c, l, h)
                    } else {
                        if ("number" == typeof o) e.vertexAttrib1f(i, o);
                        else if (1 === o.length) e.vertexAttrib1f(i, o[0]);
                        else if (2 === o.length) e.vertexAttrib2f(i, o[0], o[1]);
                        else if (3 === o.length) e.vertexAttrib3f(i, o[0], o[1], o[2]);
                        else {
                            if (4 !== o.length) throw new Error("gl-vao: Invalid vertex attribute");
                            e.vertexAttrib4f(i, o[0], o[1], o[2], o[3])
                        }
                        e.disableVertexAttribArray(i)
                    }
                }
                for (; i < n; ++i) e.disableVertexAttribArray(i)
            } else {
                e.bindBuffer(e.ARRAY_BUFFER, null);
                for (var i = 0; i < n; ++i) e.disableVertexAttribArray(i)
            }
        }
        t.exports = n
    }, {}],
    219: [function(e, t, r) {
        "use strict";

        function n(e) {
            this.gl = e, this._elements = null, this._attributes = null, this._elementsType = e.UNSIGNED_SHORT
        }

        function i(e) {
            return new n(e)
        }
        var o = e("./do-bind.js");
        n.prototype.bind = function() {
            o(this.gl, this._elements, this._attributes)
        }, n.prototype.update = function(e, t, r) {
            this._elements = t, this._attributes = e, this._elementsType = r || this.gl.UNSIGNED_SHORT
        }, n.prototype.dispose = function() {}, n.prototype.unbind = function() {}, n.prototype.draw = function(e, t, r) {
            r = r || 0;
            var n = this.gl;
            this._elements ? n.drawElements(e, t, this._elementsType, r) : n.drawArrays(e, r, t)
        }, t.exports = i
    }, {
        "./do-bind.js": 218
    }],
    220: [function(e, t, r) {
        "use strict";

        function n(e, t, r, n, i, o) {
            this.location = e, this.dimension = t, this.a = r, this.b = n, this.c = i, this.d = o
        }

        function i(e, t, r) {
            this.gl = e, this._ext = t, this.handle = r, this._attribs = [], this._useElements = !1, this._elementsType = e.UNSIGNED_SHORT
        }

        function o(e, t) {
            return new i(e, t, t.createVertexArrayOES())
        }
        var s = e("./do-bind.js");
        n.prototype.bind = function(e) {
            switch (this.dimension) {
                case 1:
                    e.vertexAttrib1f(this.location, this.a);
                    break;
                case 2:
                    e.vertexAttrib2f(this.location, this.a, this.b);
                    break;
                case 3:
                    e.vertexAttrib3f(this.location, this.a, this.b, this.c);
                    break;
                case 4:
                    e.vertexAttrib4f(this.location, this.a, this.b, this.c, this.d)
            }
        }, i.prototype.bind = function() {
            this._ext.bindVertexArrayOES(this.handle);
            for (var e = 0; e < this._attribs.length; ++e) this._attribs[e].bind(this.gl)
        }, i.prototype.unbind = function() {
            this._ext.bindVertexArrayOES(null)
        }, i.prototype.dispose = function() {
            this._ext.deleteVertexArrayOES(this.handle)
        }, i.prototype.update = function(e, t, r) {
            if (this.bind(), s(this.gl, t, e), this.unbind(), this._attribs.length = 0, e)
                for (var i = 0; i < e.length; ++i) {
                    var o = e[i];
                    "number" == typeof o ? this._attribs.push(new n(i, 1, o)) : Array.isArray(o) && this._attribs.push(new n(i, o.length, o[0], o[1], o[2], o[3]))
                }
            this._useElements = !!t, this._elementsType = r || this.gl.UNSIGNED_SHORT
        }, i.prototype.draw = function(e, t, r) {
            r = r || 0;
            var n = this.gl;
            this._useElements ? n.drawElements(e, t, this._elementsType, r) : n.drawArrays(e, r, t)
        }, t.exports = o
    }, {
        "./do-bind.js": 218
    }],
    221: [function(e, t, r) {
        "use strict";

        function n(e) {
            this.bindVertexArrayOES = e.bindVertexArray.bind(e), this.createVertexArrayOES = e.createVertexArray.bind(e), this.deleteVertexArrayOES = e.deleteVertexArray.bind(e)
        }

        function i(e, t, r, i) {
            var a, u = e.createVertexArray ? new n(e) : e.getExtension("OES_vertex_array_object");
            return a = u ? o(e, u) : s(e), a.update(t, r, i), a
        }
        var o = e("./lib/vao-native.js"),
            s = e("./lib/vao-emulated.js");
        t.exports = i
    }, {
        "./lib/vao-emulated.js": 219,
        "./lib/vao-native.js": 220
    }],
    222: [function(e, t, r) {
        function n() {
            var e = new Float32Array(3);
            return e[0] = 0, e[1] = 0, e[2] = 0, e
        }
        t.exports = n
    }, {}],
    223: [function(e, t, r) {
        function n(e, t, r) {
            var n = t[0],
                i = t[1],
                o = t[2],
                s = r[0],
                a = r[1],
                u = r[2];
            return e[0] = i * u - o * a, e[1] = o * s - n * u, e[2] = n * a - i * s, e
        }
        t.exports = n
    }, {}],
    224: [function(e, t, r) {
        function n(e, t) {
            return e[0] * t[0] + e[1] * t[1] + e[2] * t[2]
        }
        t.exports = n
    }, {}],
    225: [function(e, t, r) {
        function n(e, t, r) {
            var n = new Float32Array(3);
            return n[0] = e, n[1] = t, n[2] = r, n
        }
        t.exports = n
    }, {}],
    226: [function(e, t, r) {
        function n(e) {
            var t = e[0],
                r = e[1],
                n = e[2];
            return Math.sqrt(t * t + r * r + n * n)
        }
        t.exports = n
    }, {}],
    227: [function(e, t, r) {
        function n(e, t) {
            var r = t[0],
                n = t[1],
                i = t[2],
                o = r * r + n * n + i * i;
            return o > 0 && (o = 1 / Math.sqrt(o), e[0] = t[0] * o, e[1] = t[1] * o, e[2] = t[2] * o), e
        }
        t.exports = n
    }, {}],
    228: [function(e, t, r) {
        function n() {
            var e = new Float32Array(4);
            return e[0] = 0, e[1] = 0, e[2] = 0, e[3] = 0, e
        }
        t.exports = n
    }, {}],
    229: [function(e, t, r) {
        function n(e, t, r, n) {
            var i = new Float32Array(4);
            return i[0] = e, i[1] = t, i[2] = r, i[3] = n, i
        }
        t.exports = n
    }, {}],
    230: [function(e, t, r) {
        function n(e, t, r) {
            var n = t[0],
                i = t[1],
                o = t[2],
                s = t[3];
            return e[0] = r[0] * n + r[4] * i + r[8] * o + r[12] * s, e[1] = r[1] * n + r[5] * i + r[9] * o + r[13] * s, e[2] = r[2] * n + r[6] * i + r[10] * o + r[14] * s, e[3] = r[3] * n + r[7] * i + r[11] * o + r[15] * s, e
        }
        t.exports = n
    }, {}],
    231: [function(e, t, r) {
        "use strict";

        function n(e) {
            for (var t = new Array(e), r = 0; r < e; ++r) t[r] = r;
            return t
        }
        t.exports = n
    }, {}],
    232: [function(e, t, r) {
        function n(e) {
            return !!e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
        }

        function i(e) {
            return "function" == typeof e.readFloatLE && "function" == typeof e.slice && n(e.slice(0, 0))
        }
        t.exports = function(e) {
            return null != e && (n(e) || i(e) || !!e._isBuffer)
        }
    }, {}],
    233: [function(e, t, r) {
        "use strict";

        function n(e) {
            if (!e) return a;
            for (var t = 0; t < e.args.length; ++t) {
                var r = e.args[t];
                0 === t ? e.args[t] = {
                    name: r,
                    lvalue: !0,
                    rvalue: !!e.rvalue,
                    count: e.count || 1
                } : e.args[t] = {
                    name: r,
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }
            }
            return e.thisVars || (e.thisVars = []), e.localVars || (e.localVars = []), e
        }

        function i(e) {
            return s({
                args: e.args,
                pre: n(e.pre),
                body: n(e.body),
                post: n(e.proc),
                funcName: e.funcName
            })
        }

        function o(e) {
            for (var t = [], r = 0; r < e.args.length; ++r) t.push("a" + r);
            var n = new Function("P", ["return function ", e.funcName, "_ndarrayops(", t.join(","), ") {P(", t.join(","), ");return a0}"].join(""));
            return n(i(e))
        }
        var s = e("cwise-compiler"),
            a = {
                body: "",
                args: [],
                thisVars: [],
                localVars: []
            },
            u = {
                add: "+",
                sub: "-",
                mul: "*",
                div: "/",
                mod: "%",
                band: "&",
                bor: "|",
                bxor: "^",
                lshift: "<<",
                rshift: ">>",
                rrshift: ">>>"
            };
        ! function() {
            for (var e in u) {
                var t = u[e];
                r[e] = o({
                    args: ["array", "array", "array"],
                    body: {
                        args: ["a", "b", "c"],
                        body: "a=b" + t + "c"
                    },
                    funcName: e
                }), r[e + "eq"] = o({
                    args: ["array", "array"],
                    body: {
                        args: ["a", "b"],
                        body: "a" + t + "=b"
                    },
                    rvalue: !0,
                    funcName: e + "eq"
                }), r[e + "s"] = o({
                    args: ["array", "array", "scalar"],
                    body: {
                        args: ["a", "b", "s"],
                        body: "a=b" + t + "s"
                    },
                    funcName: e + "s"
                }), r[e + "seq"] = o({
                    args: ["array", "scalar"],
                    body: {
                        args: ["a", "s"],
                        body: "a" + t + "=s"
                    },
                    rvalue: !0,
                    funcName: e + "seq"
                })
            }
        }();
        var c = {
            not: "!",
            bnot: "~",
            neg: "-",
            recip: "1.0/"
        };
        ! function() {
            for (var e in c) {
                var t = c[e];
                r[e] = o({
                    args: ["array", "array"],
                    body: {
                        args: ["a", "b"],
                        body: "a=" + t + "b"
                    },
                    funcName: e
                }), r[e + "eq"] = o({
                    args: ["array"],
                    body: {
                        args: ["a"],
                        body: "a=" + t + "a"
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: e + "eq"
                })
            }
        }();
        var l = {
            and: "&&",
            or: "||",
            eq: "===",
            neq: "!==",
            lt: "<",
            gt: ">",
            leq: "<=",
            geq: ">="
        };
        ! function() {
            for (var e in l) {
                var t = l[e];
                r[e] = o({
                    args: ["array", "array", "array"],
                    body: {
                        args: ["a", "b", "c"],
                        body: "a=b" + t + "c"
                    },
                    funcName: e
                }), r[e + "s"] = o({
                    args: ["array", "array", "scalar"],
                    body: {
                        args: ["a", "b", "s"],
                        body: "a=b" + t + "s"
                    },
                    funcName: e + "s"
                }), r[e + "eq"] = o({
                    args: ["array", "array"],
                    body: {
                        args: ["a", "b"],
                        body: "a=a" + t + "b"
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: e + "eq"
                }), r[e + "seq"] = o({
                    args: ["array", "scalar"],
                    body: {
                        args: ["a", "s"],
                        body: "a=a" + t + "s"
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: e + "seq"
                })
            }
        }();
        var h = ["abs", "acos", "asin", "atan", "ceil", "cos", "exp", "floor", "log", "round", "sin", "sqrt", "tan"];
        ! function() {
            for (var e = 0; e < h.length; ++e) {
                var t = h[e];
                r[t] = o({
                    args: ["array", "array"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b"],
                        body: "a=this_f(b)",
                        thisVars: ["this_f"]
                    },
                    funcName: t
                }), r[t + "eq"] = o({
                    args: ["array"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a"],
                        body: "a=this_f(a)",
                        thisVars: ["this_f"]
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: t + "eq"
                })
            }
        }();
        var f = ["max", "min", "atan2", "pow"];
        ! function() {
            for (var e = 0; e < f.length; ++e) {
                var t = f[e];
                r[t] = o({
                    args: ["array", "array", "array"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b", "c"],
                        body: "a=this_f(b,c)",
                        thisVars: ["this_f"]
                    },
                    funcName: t
                }), r[t + "s"] = o({
                    args: ["array", "array", "scalar"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b", "c"],
                        body: "a=this_f(b,c)",
                        thisVars: ["this_f"]
                    },
                    funcName: t + "s"
                }), r[t + "eq"] = o({
                    args: ["array", "array"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b"],
                        body: "a=this_f(a,b)",
                        thisVars: ["this_f"]
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: t + "eq"
                }), r[t + "seq"] = o({
                    args: ["array", "scalar"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b"],
                        body: "a=this_f(a,b)",
                        thisVars: ["this_f"]
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: t + "seq"
                })
            }
        }();
        var p = ["atan2", "pow"];
        ! function() {
            for (var e = 0; e < p.length; ++e) {
                var t = p[e];
                r[t + "op"] = o({
                    args: ["array", "array", "array"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b", "c"],
                        body: "a=this_f(c,b)",
                        thisVars: ["this_f"]
                    },
                    funcName: t + "op"
                }), r[t + "ops"] = o({
                    args: ["array", "array", "scalar"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b", "c"],
                        body: "a=this_f(c,b)",
                        thisVars: ["this_f"]
                    },
                    funcName: t + "ops"
                }), r[t + "opeq"] = o({
                    args: ["array", "array"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b"],
                        body: "a=this_f(b,a)",
                        thisVars: ["this_f"]
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: t + "opeq"
                }), r[t + "opseq"] = o({
                    args: ["array", "scalar"],
                    pre: {
                        args: [],
                        body: "this_f=Math." + t,
                        thisVars: ["this_f"]
                    },
                    body: {
                        args: ["a", "b"],
                        body: "a=this_f(b,a)",
                        thisVars: ["this_f"]
                    },
                    rvalue: !0,
                    count: 2,
                    funcName: t + "opseq"
                })
            }
        }(), r.any = s({
            args: ["array"],
            pre: a,
            body: {
                args: [{
                    name: "a",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }],
                body: "if(a){return true}",
                localVars: [],
                thisVars: []
            },
            post: {
                args: [],
                localVars: [],
                thisVars: [],
                body: "return false"
            },
            funcName: "any"
        }), r.all = s({
            args: ["array"],
            pre: a,
            body: {
                args: [{
                    name: "x",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }],
                body: "if(!x){return false}",
                localVars: [],
                thisVars: []
            },
            post: {
                args: [],
                localVars: [],
                thisVars: [],
                body: "return true"
            },
            funcName: "all"
        }), r.sum = s({
            args: ["array"],
            pre: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "this_s=0"
            },
            body: {
                args: [{
                    name: "a",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }],
                body: "this_s+=a",
                localVars: [],
                thisVars: ["this_s"]
            },
            post: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "return this_s"
            },
            funcName: "sum"
        }), r.prod = s({
            args: ["array"],
            pre: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "this_s=1"
            },
            body: {
                args: [{
                    name: "a",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }],
                body: "this_s*=a",
                localVars: [],
                thisVars: ["this_s"]
            },
            post: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "return this_s"
            },
            funcName: "prod"
        }), r.norm2squared = s({
            args: ["array"],
            pre: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "this_s=0"
            },
            body: {
                args: [{
                    name: "a",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }],
                body: "this_s+=a*a",
                localVars: [],
                thisVars: ["this_s"]
            },
            post: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "return this_s"
            },
            funcName: "norm2squared"
        }), r.norm2 = s({
            args: ["array"],
            pre: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "this_s=0"
            },
            body: {
                args: [{
                    name: "a",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }],
                body: "this_s+=a*a",
                localVars: [],
                thisVars: ["this_s"]
            },
            post: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "return Math.sqrt(this_s)"
            },
            funcName: "norm2"
        }), r.norminf = s({
            args: ["array"],
            pre: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "this_s=0"
            },
            body: {
                args: [{
                    name: "a",
                    lvalue: !1,
                    rvalue: !0,
                    count: 4
                }],
                body: "if(-a>this_s){this_s=-a}else if(a>this_s){this_s=a}",
                localVars: [],
                thisVars: ["this_s"]
            },
            post: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "return this_s"
            },
            funcName: "norminf"
        }), r.norm1 = s({
            args: ["array"],
            pre: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "this_s=0"
            },
            body: {
                args: [{
                    name: "a",
                    lvalue: !1,
                    rvalue: !0,
                    count: 3
                }],
                body: "this_s+=a<0?-a:a",
                localVars: [],
                thisVars: ["this_s"]
            },
            post: {
                args: [],
                localVars: [],
                thisVars: ["this_s"],
                body: "return this_s"
            },
            funcName: "norm1"
        }), r.sup = s({
            args: ["array"],
            pre: {
                body: "this_h=-Infinity",
                args: [],
                thisVars: ["this_h"],
                localVars: []
            },
            body: {
                body: "if(_inline_1_arg0_>this_h)this_h=_inline_1_arg0_",
                args: [{
                    name: "_inline_1_arg0_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }],
                thisVars: ["this_h"],
                localVars: []
            },
            post: {
                body: "return this_h",
                args: [],
                thisVars: ["this_h"],
                localVars: []
            }
        }), r.inf = s({
            args: ["array"],
            pre: {
                body: "this_h=Infinity",
                args: [],
                thisVars: ["this_h"],
                localVars: []
            },
            body: {
                body: "if(_inline_1_arg0_<this_h)this_h=_inline_1_arg0_",
                args: [{
                    name: "_inline_1_arg0_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }],
                thisVars: ["this_h"],
                localVars: []
            },
            post: {
                body: "return this_h",
                args: [],
                thisVars: ["this_h"],
                localVars: []
            }
        }), r.argmin = s({
            args: ["index", "array", "shape"],
            pre: {
                body: "{this_v=Infinity;this_i=_inline_0_arg2_.slice(0)}",
                args: [{
                    name: "_inline_0_arg0_",
                    lvalue: !1,
                    rvalue: !1,
                    count: 0
                }, {
                    name: "_inline_0_arg1_",
                    lvalue: !1,
                    rvalue: !1,
                    count: 0
                }, {
                    name: "_inline_0_arg2_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }],
                thisVars: ["this_i", "this_v"],
                localVars: []
            },
            body: {
                body: "{if(_inline_1_arg1_<this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
                args: [{
                    name: "_inline_1_arg0_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }, {
                    name: "_inline_1_arg1_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }],
                thisVars: ["this_i", "this_v"],
                localVars: ["_inline_1_k"]
            },
            post: {
                body: "{return this_i}",
                args: [],
                thisVars: ["this_i"],
                localVars: []
            }
        }), r.argmax = s({
            args: ["index", "array", "shape"],
            pre: {
                body: "{this_v=-Infinity;this_i=_inline_0_arg2_.slice(0)}",
                args: [{
                    name: "_inline_0_arg0_",
                    lvalue: !1,
                    rvalue: !1,
                    count: 0
                }, {
                    name: "_inline_0_arg1_",
                    lvalue: !1,
                    rvalue: !1,
                    count: 0
                }, {
                    name: "_inline_0_arg2_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }],
                thisVars: ["this_i", "this_v"],
                localVars: []
            },
            body: {
                body: "{if(_inline_1_arg1_>this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
                args: [{
                    name: "_inline_1_arg0_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }, {
                    name: "_inline_1_arg1_",
                    lvalue: !1,
                    rvalue: !0,
                    count: 2
                }],
                thisVars: ["this_i", "this_v"],
                localVars: ["_inline_1_k"]
            },
            post: {
                body: "{return this_i}",
                args: [],
                thisVars: ["this_i"],
                localVars: []
            }
        }), r.random = o({
            args: ["array"],
            pre: {
                args: [],
                body: "this_f=Math.random",
                thisVars: ["this_f"]
            },
            body: {
                args: ["a"],
                body: "a=this_f()",
                thisVars: ["this_f"]
            },
            funcName: "random"
        }), r.assign = o({
            args: ["array", "array"],
            body: {
                args: ["a", "b"],
                body: "a=b"
            },
            funcName: "assign"
        }), r.assigns = o({
            args: ["array", "scalar"],
            body: {
                args: ["a", "b"],
                body: "a=b"
            },
            funcName: "assigns"
        }), r.equals = s({
            args: ["array", "array"],
            pre: a,
            body: {
                args: [{
                    name: "x",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }, {
                    name: "y",
                    lvalue: !1,
                    rvalue: !0,
                    count: 1
                }],
                body: "if(x!==y){return false}",
                localVars: [],
                thisVars: []
            },
            post: {
                args: [],
                localVars: [],
                thisVars: [],
                body: "return true"
            },
            funcName: "equals"
        })
    }, {
        "cwise-compiler": 200
    }],
    234: [function(e, t, r) {
        function n(e, t) {
            return e[0] - t[0]
        }

        function i() {
            var e, t = this.stride,
                r = new Array(t.length);
            for (e = 0; e < r.length; ++e) r[e] = [Math.abs(t[e]), e];
            r.sort(n);
            var i = new Array(r.length);
            for (e = 0; e < i.length; ++e) i[e] = r[e][1];
            return i
        }

        function o(e, t) {
            var r = ["View", t, "d", e].join("");
            t < 0 && (r = "View_Nil" + e);
            var n = "generic" === e;
            if (t === -1) {
                var o = "function " + r + "(a){this.data=a;};var proto=" + r + ".prototype;proto.dtype='" + e + "';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new " + r + "(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_" + r + "(a){return new " + r + "(a);}",
                    s = new Function(o);
                return s()
            }
            if (0 === t) {
                var o = "function " + r + "(a,d) {this.data = a;this.offset = d};var proto=" + r + ".prototype;proto.dtype='" + e + "';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function " + r + "_copy() {return new " + r + "(this.data,this.offset)};proto.pick=function " + r + "_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function " + r + "_get(){return " + (n ? "this.data.get(this.offset)" : "this.data[this.offset]") + "};proto.set=function " + r + "_set(v){return " + (n ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v") + "};return function construct_" + r + "(a,b,c,d){return new " + r + "(a,d)}",
                    s = new Function("TrivialArray", o);
                return s(h[e][0])
            }
            var o = ["'use strict'"],
                a = u(t),
                c = a.map(function(e) {
                    return "i" + e
                }),
                l = "this.offset+" + a.map(function(e) {
                    return "this.stride[" + e + "]*i" + e
                }).join("+"),
                f = a.map(function(e) {
                    return "b" + e
                }).join(","),
                p = a.map(function(e) {
                    return "c" + e
                }).join(",");
            o.push("function " + r + "(a," + f + "," + p + ",d){this.data=a", "this.shape=[" + f + "]", "this.stride=[" + p + "]", "this.offset=d|0}", "var proto=" + r + ".prototype", "proto.dtype='" + e + "'", "proto.dimension=" + t), o.push("Object.defineProperty(proto,'size',{get:function " + r + "_size(){return " + a.map(function(e) {
                return "this.shape[" + e + "]"
            }).join("*"), "}})"), 1 === t ? o.push("proto.order=[0]") : (o.push("Object.defineProperty(proto,'order',{get:"), t < 4 ? (o.push("function " + r + "_order(){"), 2 === t ? o.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})") : 3 === t && o.push("var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})")) : o.push("ORDER})")), o.push("proto.set=function " + r + "_set(" + c.join(",") + ",v){"), n ? o.push("return this.data.set(" + l + ",v)}") : o.push("return this.data[" + l + "]=v}"), o.push("proto.get=function " + r + "_get(" + c.join(",") + "){"), n ? o.push("return this.data.get(" + l + ")}") : o.push("return this.data[" + l + "]}"), o.push("proto.index=function " + r + "_index(", c.join(), "){return " + l + "}"), o.push("proto.hi=function " + r + "_hi(" + c.join(",") + "){return new " + r + "(this.data," + a.map(function(e) {
                return ["(typeof i", e, "!=='number'||i", e, "<0)?this.shape[", e, "]:i", e, "|0"].join("")
            }).join(",") + "," + a.map(function(e) {
                return "this.stride[" + e + "]"
            }).join(",") + ",this.offset)}");
            var d = a.map(function(e) {
                    return "a" + e + "=this.shape[" + e + "]"
                }),
                m = a.map(function(e) {
                    return "c" + e + "=this.stride[" + e + "]"
                });
            o.push("proto.lo=function " + r + "_lo(" + c.join(",") + "){var b=this.offset,d=0," + d.join(",") + "," + m.join(","));
            for (var v = 0; v < t; ++v) o.push("if(typeof i" + v + "==='number'&&i" + v + ">=0){d=i" + v + "|0;b+=c" + v + "*d;a" + v + "-=d}");
            o.push("return new " + r + "(this.data," + a.map(function(e) {
                return "a" + e
            }).join(",") + "," + a.map(function(e) {
                return "c" + e
            }).join(",") + ",b)}"), o.push("proto.step=function " + r + "_step(" + c.join(",") + "){var " + a.map(function(e) {
                return "a" + e + "=this.shape[" + e + "]"
            }).join(",") + "," + a.map(function(e) {
                return "b" + e + "=this.stride[" + e + "]"
            }).join(",") + ",c=this.offset,d=0,ceil=Math.ceil");
            for (var v = 0; v < t; ++v) o.push("if(typeof i" + v + "==='number'){d=i" + v + "|0;if(d<0){c+=b" + v + "*(a" + v + "-1);a" + v + "=ceil(-a" + v + "/d)}else{a" + v + "=ceil(a" + v + "/d)}b" + v + "*=d}");
            o.push("return new " + r + "(this.data," + a.map(function(e) {
                return "a" + e
            }).join(",") + "," + a.map(function(e) {
                return "b" + e
            }).join(",") + ",c)}");
            for (var y = new Array(t), _ = new Array(t), v = 0; v < t; ++v) y[v] = "a[i" + v + "]", _[v] = "b[i" + v + "]";
            o.push("proto.transpose=function " + r + "_transpose(" + c + "){" + c.map(function(e, t) {
                return e + "=(" + e + "===undefined?" + t + ":" + e + "|0)"
            }).join(";"), "var a=this.shape,b=this.stride;return new " + r + "(this.data," + y.join(",") + "," + _.join(",") + ",this.offset)}"), o.push("proto.pick=function " + r + "_pick(" + c + "){var a=[],b=[],c=this.offset");
            for (var v = 0; v < t; ++v) o.push("if(typeof i" + v + "==='number'&&i" + v + ">=0){c=(c+this.stride[" + v + "]*i" + v + ")|0}else{a.push(this.shape[" + v + "]);b.push(this.stride[" + v + "])}");
            o.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}"), o.push("return function construct_" + r + "(data,shape,stride,offset){return new " + r + "(data," + a.map(function(e) {
                return "shape[" + e + "]"
            }).join(",") + "," + a.map(function(e) {
                return "stride[" + e + "]"
            }).join(",") + ",offset)}");
            var s = new Function("CTOR_LIST", "ORDER", o.join("\n"));
            return s(h[e], i)
        }

        function s(e) {
            if (c(e)) return "buffer";
            if (l) switch (Object.prototype.toString.call(e)) {
                case "[object Float64Array]":
                    return "float64";
                case "[object Float32Array]":
                    return "float32";
                case "[object Int8Array]":
                    return "int8";
                case "[object Int16Array]":
                    return "int16";
                case "[object Int32Array]":
                    return "int32";
                case "[object Uint8Array]":
                    return "uint8";
                case "[object Uint16Array]":
                    return "uint16";
                case "[object Uint32Array]":
                    return "uint32";
                case "[object Uint8ClampedArray]":
                    return "uint8_clamped"
            }
            return Array.isArray(e) ? "array" : "generic"
        }

        function a(e, t, r, n) {
            if (void 0 === e) {
                var i = h.array[0];
                return i([])
            }
            "number" == typeof e && (e = [e]), void 0 === t && (t = [e.length]);
            var a = t.length;
            if (void 0 === r) {
                r = new Array(a);
                for (var u = a - 1, c = 1; u >= 0; --u) r[u] = c, c *= t[u]
            }
            if (void 0 === n) {
                n = 0;
                for (var u = 0; u < a; ++u) r[u] < 0 && (n -= (t[u] - 1) * r[u])
            }
            for (var l = s(e), f = h[l]; f.length <= a + 1;) f.push(o(l, f.length - 1));
            var i = f[a + 1];
            return i(e, t, r, n)
        }
        var u = e("iota-array"),
            c = e("is-buffer"),
            l = "undefined" != typeof Float64Array,
            h = {
                float32: [],
                float64: [],
                int8: [],
                int16: [],
                int32: [],
                uint8: [],
                uint16: [],
                uint32: [],
                array: [],
                uint8_clamped: [],
                buffer: [],
                generic: []
            };
        t.exports = a
    }, {
        "iota-array": 231,
        "is-buffer": 232
    }],
    235: [function(e, t, r) {
        (function(t, n) {
            "use strict";

            function i(e) {
                if (e) {
                    var t = e.length || e.byteLength,
                        r = _.log2(t);
                    w[r].push(e)
                }
            }

            function o(e) {
                i(e.buffer)
            }

            function s(e) {
                var e = _.nextPow2(e),
                    t = _.log2(e),
                    r = w[t];
                return r.length > 0 ? r.pop() : new ArrayBuffer(e)
            }

            function a(e) {
                return new Uint8Array(s(e), 0, e)
            }

            function u(e) {
                return new Uint16Array(s(2 * e), 0, e)
            }

            function c(e) {
                return new Uint32Array(s(4 * e), 0, e)
            }

            function l(e) {
                return new Int8Array(s(e), 0, e)
            }

            function h(e) {
                return new Int16Array(s(2 * e), 0, e)
            }

            function f(e) {
                return new Int32Array(s(4 * e), 0, e)
            }

            function p(e) {
                return new Float32Array(s(4 * e), 0, e)
            }

            function d(e) {
                return new Float64Array(s(8 * e), 0, e)
            }

            function m(e) {
                return b ? new Uint8ClampedArray(s(e), 0, e) : a(e)
            }

            function v(e) {
                return new DataView(s(e), 0, e)
            }

            function y(e) {
                e = _.nextPow2(e);
                var t = _.log2(e),
                    r = x[t];
                return r.length > 0 ? r.pop() : new n(e)
            }
            var _ = e("bit-twiddle"),
                g = e("dup");
            t.__TYPEDARRAY_POOL || (t.__TYPEDARRAY_POOL = {
                UINT8: g([32, 0]),
                UINT16: g([32, 0]),
                UINT32: g([32, 0]),
                INT8: g([32, 0]),
                INT16: g([32, 0]),
                INT32: g([32, 0]),
                FLOAT: g([32, 0]),
                DOUBLE: g([32, 0]),
                DATA: g([32, 0]),
                UINT8C: g([32, 0]),
                BUFFER: g([32, 0])
            });
            var b = "undefined" != typeof Uint8ClampedArray,
                E = t.__TYPEDARRAY_POOL;
            E.UINT8C || (E.UINT8C = g([32, 0])), E.BUFFER || (E.BUFFER = g([32, 0]));
            var w = E.DATA,
                x = E.BUFFER;
            r.free = function(e) {
                if (n.isBuffer(e)) x[_.log2(e.length)].push(e);
                else {
                    if ("[object ArrayBuffer]" !== Object.prototype.toString.call(e) && (e = e.buffer), !e) return;
                    var t = e.length || e.byteLength,
                        r = 0 | _.log2(t);
                    w[r].push(e)
                }
            }, r.freeUint8 = r.freeUint16 = r.freeUint32 = r.freeInt8 = r.freeInt16 = r.freeInt32 = r.freeFloat32 = r.freeFloat = r.freeFloat64 = r.freeDouble = r.freeUint8Clamped = r.freeDataView = o, r.freeArrayBuffer = i, r.freeBuffer = function(e) {
                x[_.log2(e.length)].push(e)
            }, r.malloc = function(e, t) {
                if (void 0 === t || "arraybuffer" === t) return s(e);
                switch (t) {
                    case "uint8":
                        return a(e);
                    case "uint16":
                        return u(e);
                    case "uint32":
                        return c(e);
                    case "int8":
                        return l(e);
                    case "int16":
                        return h(e);
                    case "int32":
                        return f(e);
                    case "float":
                    case "float32":
                        return p(e);
                    case "double":
                    case "float64":
                        return d(e);
                    case "uint8_clamped":
                        return m(e);
                    case "buffer":
                        return y(e);
                    case "data":
                    case "dataview":
                        return v(e);
                    default:
                        return null
                }
                return null
            }, r.mallocArrayBuffer = s, r.mallocUint8 = a, r.mallocUint16 = u, r.mallocUint32 = c, r.mallocInt8 = l, r.mallocInt16 = h, r.mallocInt32 = f, r.mallocFloat32 = r.mallocFloat = p, r.mallocFloat64 = r.mallocDouble = d, r.mallocUint8Clamped = m, r.mallocDataView = v, r.mallocBuffer = y, r.clearCache = function() {
                for (var e = 0; e < 32; ++e) E.UINT8[e].length = 0, E.UINT16[e].length = 0, E.UINT32[e].length = 0, E.INT8[e].length = 0, E.INT16[e].length = 0, E.INT32[e].length = 0, E.FLOAT[e].length = 0, E.DOUBLE[e].length = 0, E.UINT8C[e].length = 0, w[e].length = 0, x[e].length = 0
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}, e("buffer").Buffer)
    }, {
        "bit-twiddle": 199,
        buffer: 62,
        dup: 203
    }],
    236: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            for (var r = 1, n = e.length, i = e[0], o = e[0], s = 1; s < n; ++s)
                if (o = i, i = e[s], t(i, o)) {
                    if (s === r) {
                        r++;
                        continue
                    }
                    e[r++] = i
                }
            return e.length = r, e
        }

        function i(e) {
            for (var t = 1, r = e.length, n = e[0], i = e[0], o = 1; o < r; ++o, i = n)
                if (i = n, n = e[o], n !== i) {
                    if (o === t) {
                        t++;
                        continue
                    }
                    e[t++] = n
                }
            return e.length = t, e
        }

        function o(e, t, r) {
            return 0 === e.length ? e : t ? (r || e.sort(t), n(e, t)) : (r || e.sort(), i(e))
        }
        t.exports = o
    }, {}],
    237: [function(e, t, r) {
        ! function() {
            "use strict";

            function e(t) {
                t.permitHostObjects___ && t.permitHostObjects___(e)
            }

            function r(e) {
                return !(e.substr(0, p.length) == p && "___" === e.substr(e.length - 3))
            }

            function n(e) {
                if (e !== Object(e)) throw new TypeError("Not an object: " + e);
                var t = e[d];
                if (t && t.key === e) return t;
                if (f(e)) {
                    t = {
                        key: e
                    };
                    try {
                        return h(e, d, {
                            value: t,
                            writable: !1,
                            enumerable: !1,
                            configurable: !1
                        }), t
                    } catch (r) {
                        return
                    }
                }
            }

            function i(e) {
                return e.prototype = null, Object.freeze(e)
            }

            function o() {
                _ || "undefined" == typeof console || (_ = !0, console.warn("WeakMap should be invoked as new WeakMap(), not WeakMap(). This will be an error in the future."))
            }
            if ("undefined" == typeof ses || !ses.ok || ses.ok()) {
                "undefined" != typeof ses && (ses.weakMapPermitHostObjects = e);
                var s = !1;
                if ("function" == typeof WeakMap) {
                    var a = WeakMap;
                    if ("undefined" != typeof navigator && /Firefox/.test(navigator.userAgent));
                    else {
                        var u = new a,
                            c = Object.freeze({});
                        if (u.set(c, 1), 1 === u.get(c)) return void(t.exports = WeakMap);
                        s = !0
                    }
                }
                var l = (Object.prototype.hasOwnProperty, Object.getOwnPropertyNames),
                    h = Object.defineProperty,
                    f = Object.isExtensible,
                    p = "weakmap:",
                    d = p + "ident:" + Math.random() + "___";
                if ("undefined" != typeof crypto && "function" == typeof crypto.getRandomValues && "function" == typeof ArrayBuffer && "function" == typeof Uint8Array) {
                    var m = new ArrayBuffer(25),
                        v = new Uint8Array(m);
                    crypto.getRandomValues(v), d = p + "rand:" + Array.prototype.map.call(v, function(e) {
                        return (e % 36).toString(36)
                    }).join("") + "___"
                }
                if (h(Object, "getOwnPropertyNames", {
                        value: function(e) {
                            return l(e).filter(r)
                        }
                    }), "getPropertyNames" in Object) {
                    var y = Object.getPropertyNames;
                    h(Object, "getPropertyNames", {
                        value: function(e) {
                            return y(e).filter(r)
                        }
                    })
                }! function() {
                    var e = Object.freeze;
                    h(Object, "freeze", {
                        value: function(t) {
                            return n(t), e(t)
                        }
                    });
                    var t = Object.seal;
                    h(Object, "seal", {
                        value: function(e) {
                            return n(e), t(e)
                        }
                    });
                    var r = Object.preventExtensions;
                    h(Object, "preventExtensions", {
                        value: function(e) {
                            return n(e), r(e)
                        }
                    })
                }();
                var _ = !1,
                    g = 0,
                    b = function() {
                        function e(e, t) {
                            var r, i = n(e);
                            return i ? c in i ? i[c] : t : (r = a.indexOf(e), r >= 0 ? u[r] : t)
                        }

                        function t(e) {
                            var t = n(e);
                            return t ? c in t : a.indexOf(e) >= 0
                        }

                        function r(e, t) {
                            var r, i = n(e);
                            return i ? i[c] = t : (r = a.indexOf(e), r >= 0 ? u[r] = t : (r = a.length, u[r] = t, a[r] = e)), this
                        }

                        function s(e) {
                            var t, r, i = n(e);
                            return i ? c in i && delete i[c] : (t = a.indexOf(e), !(t < 0) && (r = a.length - 1, a[t] = void 0, u[t] = u[r], a[t] = a[r], a.length = r, u.length = r, !0))
                        }
                        this instanceof b || o();
                        var a = [],
                            u = [],
                            c = g++;
                        return Object.create(b.prototype, {
                            get___: {
                                value: i(e)
                            },
                            has___: {
                                value: i(t)
                            },
                            set___: {
                                value: i(r)
                            },
                            delete___: {
                                value: i(s)
                            }
                        })
                    };
                b.prototype = Object.create(Object.prototype, {
                    get: {
                        value: function(e, t) {
                            return this.get___(e, t)
                        },
                        writable: !0,
                        configurable: !0
                    },
                    has: {
                        value: function(e) {
                            return this.has___(e)
                        },
                        writable: !0,
                        configurable: !0
                    },
                    set: {
                        value: function(e, t) {
                            return this.set___(e, t)
                        },
                        writable: !0,
                        configurable: !0
                    },
                    "delete": {
                        value: function(e) {
                            return this.delete___(e)
                        },
                        writable: !0,
                        configurable: !0
                    }
                }), "function" == typeof a ? ! function() {
                    function r() {
                        function t(e, t) {
                            return l ? c.has(e) ? c.get(e) : l.get___(e, t) : c.get(e, t)
                        }

                        function r(e) {
                            return c.has(e) || !!l && l.has___(e)
                        }

                        function n(e) {
                            var t = !!c["delete"](e);
                            return l ? l.delete___(e) || t : t
                        }
                        this instanceof b || o();
                        var u, c = new a,
                            l = void 0,
                            h = !1;
                        return u = s ? function(e, t) {
                            return c.set(e, t), c.has(e) || (l || (l = new b), l.set(e, t)), this
                        } : function(e, t) {
                            if (h) try {
                                c.set(e, t)
                            } catch (r) {
                                l || (l = new b), l.set___(e, t)
                            } else c.set(e, t);
                            return this
                        }, Object.create(b.prototype, {
                            get___: {
                                value: i(t)
                            },
                            has___: {
                                value: i(r)
                            },
                            set___: {
                                value: i(u)
                            },
                            delete___: {
                                value: i(n)
                            },
                            permitHostObjects___: {
                                value: i(function(t) {
                                    if (t !== e) throw new Error("bogus call to permitHostObjects___");
                                    h = !0
                                })
                            }
                        })
                    }
                    s && "undefined" != typeof Proxy && (Proxy = void 0), r.prototype = b.prototype, t.exports = r, Object.defineProperty(WeakMap.prototype, "constructor", {
                        value: WeakMap,
                        enumerable: !1,
                        configurable: !0,
                        writable: !0
                    })
                }() : ("undefined" != typeof Proxy && (Proxy = void 0), t.exports = b)
            }
        }()
    }, {}],
    238: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("./FaceIdUnlockSequence/SpriteSheetPlayer"),
            c = e("@marcom/ac-feature/prefersReducedMotion"),
            l = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r._player = {}, r._frame = r.el.querySelector(".sprite-sequence"), r._canvas = r.el.querySelector("canvas#appleUnlockAnimation"), r._state = {
                        reducedMotion: c()
                    }, r
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        this._player = new u({
                            canvas: this._canvas,
                            ctrlPanel: this.el.parentNode.querySelector(".inline-video-controls-panel"),
                            spritePath: "/ios/ios-13/2019/2ddec70b_a677_4795_86e9_7198f89c77d4/anim/apple-secure/",
                            spriteName: "unlock"
                        }), this._setupAnimLoad(), this._setupAnimPlay()
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function(e) {
                        this._player.state.loaded && this._player.reload()
                    }
                }, {
                    key: "_setupAnimLoad",
                    value: function() {
                        var e = this;
                        this.addDiscreteEvent({
                            start: "t + 150vh",
                            end: "b - 150vh",
                            event: "sprite-animation-load",
                            onEnterOnce: function() {
                                e._player.state.loaded || e._player.state.loading || e._player.load().then(function(t) {
                                    e._state.reducedMotion && (e._frame.classList.remove("frame-active"), e._player.gotoEnd())
                                }, function(e) {
                                    console.log("_setupAnimLoad: player did not load", e)
                                })
                            }
                        })
                    }
                }, {
                    key: "_setupAnimPlay",
                    value: function() {
                        var e = this,
                            t = function() {
                                e._frame.classList.remove("frame-active"), e._canvas.classList.remove("canvas-inactive"), e._player.play()
                            };
                        this.addDiscreteEvent({
                            start: "t - 40vh",
                            end: "t - 10vh",
                            event: "sprite-animation-play",
                            onEnter: function() {
                                e._player.state.loaded ? t() : e._player.load().then(t, function(e) {
                                    console.log("_setupAnimPlay: player did not load", e)
                                })
                            }
                        }), this.addDiscreteEvent({
                            start: "t - 100vh",
                            end: "b",
                            event: "sprite-animation-reset",
                            onExit: function() {
                                e._frame.classList.add("frame-active"), e._canvas.classList.add("canvas-inactive"), e._player.reset()
                            }
                        })
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return document.documentElement.classList.contains("sprite-animations")
                    }
                }]), t
            }(a);
        t.exports = l
    }, {
        "./FaceIdUnlockSequence/SpriteSheetPlayer": 241,
        "@marcom/ac-feature/prefersReducedMotion": 60,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    239: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("./audio/_AudioPlayer"),
            c = function(e) {
                function t(e) {
                    return n(this, t), i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        u.initialize("ac-audio-player")
                    }
                }]), t
            }(a);
        t.exports = c
    }, {
        "./audio/_AudioPlayer": 252,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    240: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("./FaceIdUnlockSequence/SpriteSheetPlayer"),
            c = e("@marcom/feature-detect/prefersReducedMotion"),
            l = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r._player = {}, r._frame = r.el.querySelector(".tile-faster-unlock .sprite-sequence"),
                        r._canvas = r.el.querySelector("canvas.sprite-media"), r._state = {
                            reducedMotion: c()
                        }, r
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        this._player = new u({
                            canvas: document.getElementById("unlockAnimation"),
                            ctrlPanel: this.el.parentNode.querySelector(".inline-video-controls-panel"),
                            spritePath: "/ios/ios-13/2019/2ddec70b_a677_4795_86e9_7198f89c77d4/anim/face-id/",
                            spriteName: "unlock"
                        }), this._setupAnimLoad(), this._setupAnimPlay()
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function(e) {
                        this._player.state.loaded && this._player.reload()
                    }
                }, {
                    key: "_setupAnimLoad",
                    value: function() {
                        var e = this;
                        this.addDiscreteEvent({
                            start: "t + 150vh",
                            end: "b - 150vh",
                            event: "sprite-animation-load",
                            onEnterOnce: function() {
                                e._player.state.loaded || e._player.state.loading || e._player.load().then(function(t) {
                                    e._state.reducedMotion && (e._frame.classList.remove("frame-active"), e._player.gotoEnd())
                                }, function(e) {
                                    console.log("_setupAnimLoad: player did not load", e)
                                })
                            }
                        })
                    }
                }, {
                    key: "_setupAnimPlay",
                    value: function() {
                        var e = this,
                            t = function() {
                                e._frame.classList.remove("frame-active"), e._canvas.classList.remove("canvas-inactive"), e._player.play()
                            };
                        this.addDiscreteEvent({
                            start: "t - 40vh",
                            end: "t - 10vh",
                            event: "sprite-animation-play",
                            onEnter: function() {
                                e._player.state.loaded ? t() : e._player.load().then(t, function(e) {
                                    console.log("_setupAnimPlay: player did not load", e)
                                })
                            }
                        }), this.addDiscreteEvent({
                            start: "t - 100vh",
                            end: "b",
                            event: "sprite-animation-reset",
                            onExit: function() {
                                e._frame.classList.add("frame-active"), e._canvas.classList.add("canvas-inactive"), e._player.reset()
                            }
                        })
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return document.documentElement.classList.contains("sprite-animations")
                    }
                }]), t
            }(a);
        t.exports = l
    }, {
        "./FaceIdUnlockSequence/SpriteSheetPlayer": 241,
        "@marcom/bubble-gum/BaseComponent": 168,
        "@marcom/feature-detect/prefersReducedMotion": 174
    }],
    241: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        var i = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            o = e("@marcom/asset-source/AssetSource"),
            s = e("@marcom/viewport-emitter"),
            a = e("@marcom/ac-raf-emitter/RAFEmitter"),
            u = function() {
                function e(t) {
                    var r = this;
                    n(this, e), t = Object.assign({}, t);
                    var i = t.canvas,
                        o = t.ctrlPanel;
                    this.spritePath = t.spritePath, this.spriteName = t.spriteName, this._el = {
                        canvas: t.canvas,
                        ctrlPanel: o || null,
                        btnReplay: o ? o.querySelector(".inline-video-controls-replay") : null
                    }, this._rafEmitter = new a, this._spriteSheet = new Image, this._ctx = i.getContext("2d"), this._animationMetrics = {
                        frameData: {},
                        frameWidth: 0,
                        frameHeight: 0,
                        frameIndex: 0,
                        tickCount: 0,
                        totalFrames: 0
                    }, this._promise = {
                        load: null
                    }, this._state = {
                        loading: !1,
                        loaded: !1
                    }, this._onDraw = this._onDraw.bind(this), this._setSpriteCanvasFrameSize = this._setSpriteCanvasFrameSize.bind(this), this.play = this.play.bind(this), this.replay = this.replay.bind(this), this.reset = this.reset.bind(this), this.gotoStart = this.gotoStart.bind(this), this.gotoEnd = this.gotoEnd.bind(this), i.addEventListener("click", function() {
                        r._animationMetrics.frameIndex = 0
                    })
                }
                return i(e, [{
                    key: "load",
                    value: function() {
                        var e = this;
                        if (this._state.loading || this._state.loaded) return this._promise.load;
                        this._state.loading = !0;
                        var t = [this._getFrameData(), this._getSpriteSheet()];
                        return this._promise.load = Promise.all(t).then(function(t) {
                            var r = t[0],
                                n = ("string" == typeof t[0] ? JSON.parse(r) : r).frames,
                                i = t[1];
                            return new Promise(function(t, r) {
                                e._initAnimationMetrics(n);
                                var o = function s() {
                                    e._spriteSheet.removeEventListener("load", s), t(e._spriteSheet)
                                };
                                e._spriteSheet.addEventListener("load", o), e._spriteSheet.src = i
                            })
                        }, function(e) {}).then(this._setSpriteCanvasFrameSize).then(function() {
                            e._state.loading = !1, e._state.loaded = !0
                        }).then(this.gotoStart)
                    }
                }, {
                    key: "reload",
                    value: function() {
                        var e = this;
                        return this._state.loading = !1, this._state.loaded = !1, this.load().then(function() {
                            e._goToEndFrame()
                        })
                    }
                }, {
                    key: "play",
                    value: function() {
                        this._rafEmitter.on("draw", this._onDraw), this._rafEmitter.run()
                    }
                }, {
                    key: "replay",
                    value: function() {
                        this.reset(), this.play()
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this._animationMetrics.frameIndex = 0
                    }
                }, {
                    key: "gotoStart",
                    value: function() {
                        this._goToStartFrame()
                    }
                }, {
                    key: "gotoEnd",
                    value: function() {
                        this._goToEndFrame(), this._el.btnReplay.removeAttribute("disabled")
                    }
                }, {
                    key: "_onDraw",
                    value: function() {
                        var e = this._animationMetrics,
                            t = e.totalFrames - 1;
                        this._update(), this._render(), e.frameIndex < t ? this._rafEmitter.run() : this._rafEmitter.off("draw", this._onDraw)
                    }
                }, {
                    key: "_getFrameData",
                    value: function() {
                        var e = new o({
                            path: this.spritePath,
                            name: this.spriteName,
                            viewport: o.convertViewportName(s.viewport),
                            resolution: o.convertToResolution(s.retina),
                            format: "json",
                            xhr: {
                                responseType: "json"
                            }
                        });
                        return e.load()
                    }
                }, {
                    key: "_convertFrameDataToArray",
                    value: function(e) {
                        var t = [];
                        return Object.keys(e).forEach(function(r) {
                            t.push(e[r])
                        }), t
                    }
                }, {
                    key: "_initAnimationMetrics",
                    value: function(e) {
                        var t = this._convertFrameDataToArray(e),
                            r = t.length,
                            n = t[0].sourceSize;
                        this._animationMetrics.frameData = t, this._animationMetrics.frameWidth = n.w, this._animationMetrics.frameHeight = n.h, this._animationMetrics.totalFrames = r
                    }
                }, {
                    key: "_getSpriteSheet",
                    value: function() {
                        var e = new o({
                            path: this.spritePath,
                            name: this.spriteName,
                            viewport: o.convertViewportName(s.viewport),
                            resolution: o.convertToResolution(s.retina),
                            format: "png"
                        });
                        return e.load()
                    }
                }, {
                    key: "_setSpriteCanvasFrameSize",
                    value: function() {
                        var e = this,
                            t = this._el.canvas,
                            r = this._animationMetrics,
                            n = s.retina,
                            i = n ? .5 : 1;
                        return new Promise(function(n, o) {
                            e._rafEmitter.once("draw", function() {
                                var e = t.width = r.frameWidth,
                                    o = t.height = r.frameHeight;
                                t.style.width = Math.round(e * i) + "px", t.style.height = Math.round(o * i) + "px", n()
                            }), e._rafEmitter.run()
                        })
                    }
                }, {
                    key: "_update",
                    value: function() {
                        var e = this._animationMetrics,
                            t = e.totalFrames - 1;
                        e.frameIndex < t ? this._animationMetrics.frameIndex += 1 : this._animationMetrics.frameIndex = t
                    }
                }, {
                    key: "_render",
                    value: function(e) {
                        var t = this._animationMetrics;
                        e = e || t.frameIndex;
                        var r = this._ctx,
                            n = this._el.canvas,
                            i = t.frameData[e];
                        r.clearRect(0, 0, n.width, n.height), r.drawImage(this._spriteSheet, i.frame.x, i.frame.y, i.frame.w, i.frame.h, i.spriteSourceSize.x, i.spriteSourceSize.y, i.frame.w, i.frame.h)
                    }
                }, {
                    key: "_goToStartFrame",
                    value: function() {
                        var e = 0;
                        this._render(e)
                    }
                }, {
                    key: "_goToEndFrame",
                    value: function() {
                        var e = this._animationMetrics.totalFrames - 1;
                        this._render(e)
                    }
                }, {
                    key: "state",
                    get: function() {
                        return this._state
                    }
                }]), e
            }();
        t.exports = u
    }, {
        "@marcom/ac-raf-emitter/RAFEmitter": 99,
        "@marcom/asset-source/AssetSource": 165,
        "@marcom/viewport-emitter": 190
    }],
    242: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("@marcom/anim-system"),
            c = function(e) {
                function t(e) {
                    return n(this, t), i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        var e = u.createTimeGroup(),
                            t = this.el.querySelector(".image-stage-light-white-color");
                        this.addDiscreteEvent({
                            start: "t - 35vh",
                            end: "t",
                            event: "HighKeyMono:play",
                            onEnter: function() {
                                return e.play()
                            }
                        }), e.addKeyframe(t, {
                            start: .5,
                            end: 1,
                            cssClass: "hide",
                            toggle: !0
                        }), this.addDiscreteEvent({
                            start: "t - 100vh",
                            end: "b",
                            event: "HighKeyMono:reset",
                            onEnter: function(t) {
                                return e.progress(0, !0)
                            }
                        })
                    }
                }]), t
            }(a);
        t.exports = c
    }, {
        "@marcom/anim-system": 148,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    243: [function(e, t, r) {
        "use strict";

        function n(e) {
            if (Array.isArray(e)) {
                for (var t = 0, r = Array(e.length); t < e.length; t++) r[t] = e[t];
                return r
            }
            return Array.from(e)
        }

        function i(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function o(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var a = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            u = e("@marcom/bubble-gum/BaseComponent"),
            c = e("@marcom/anim-system"),
            l = e("@marcom/useragent-detect"),
            h = {
                update: e("@marcom/ac-raf-emitter/update")
            },
            f = function(e) {
                function t(e) {
                    i(this, t);
                    var r = o(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.scrollGroup = c.getGroupForTarget(r.el), r.coordinates = [], r.currentBreakpoint = e.pageMetrics.breakpoint, r.customBezier = "cubic-bezier(.44,.01,.33,.98)", r.spacing = {
                        L: 150,
                        M: 112,
                        S: 110
                    }, r
                }
                return s(t, e), a(t, [{
                    key: "mounted",
                    value: function() {
                        var e = this;
                        this.circles = [].concat(n(this.el.getElementsByClassName("circle"))), this._updateCirclesCoordinate(this.currentBreakpoint), this.el.style.opacity = 1, this.addDiscreteEvent({
                            start: "a0t - 100vh",
                            end: "a0b",
                            event: "MapsCollection:reset",
                            anchors: [".tile-collections"],
                            onEnter: function(t) {
                                return e.timeline.progress(0, !0)
                            }
                        });
                        var t = {
                                start: "t - 125vh",
                                end: "b + 125vh",
                                cssClass: "will-change",
                                toggle: !0
                            },
                            r = this.circles.concat([".app", ".app-name", ".app-description"].map(function(t) {
                                return e.el.querySelector(t)
                            }));
                        r.forEach(function(r) {
                            e.scrollGroup.addKeyframe(r, t)
                        });
                        var i = c.getControllerForTarget(this.el);
                        i.on("MapsCollection:play:enter", function(t) {
                            e.timeline.play()
                        })
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function(e) {
                        this._updateCirclesCoordinate(e.breakpoint)
                    }
                }, {
                    key: "_createLattice",
                    value: function(e, t, r) {
                        for (var n = [], i = r * Math.sqrt(3) / 2, o = 0; o < e; o++)
                            for (var s = (o - (e - 1) / 2) * i, a = t[o], u = 0; u < a; u++) {
                                var c = (u - (a - 1) / 2) * r;
                                n.push([c, s])
                            }
                        return n
                    }
                }, {
                    key: "_updateCirclesCoordinate",
                    value: function(e) {
                        var t = 4,
                            r = [3, 4, 3, 4];
                        this.coordinates = this._createLattice(t, r, this.spacing[e]);
                        for (var n = 0; n < this.circles.length; n++) this.circles[n].style.transform = "translate(" + this.coordinates[n][0] + "px, " + this.coordinates[n][1] + "px)";
                        this._setupTimeline()
                    }
                }, {
                    key: "_setupTimeline",
                    value: function() {
                        var e = this,
                            t = function() {
                                var t = c.createTimeGroup();
                                t.defaultEase = 1, t.name = "Maps Collection", e.timeline = t;
                                var r = [.9, 1],
                                    n = e.el.querySelector(".app"),
                                    i = e.el.querySelector(".app-name"),
                                    o = e.el.querySelector(".app-description"),
                                    s = e.el.querySelector(".shadow");
                                e.circles.forEach(function(n, i) {
                                    t.addKeyframe(n, {
                                        start: .5,
                                        end: .8,
                                        easeFunction: e.customBezier,
                                        scale: r
                                    }), t.addKeyframe(n, {
                                        start: .8,
                                        end: 1.2,
                                        easeFunction: e.customBezier,
                                        x: [e.coordinates[i][0], 0],
                                        y: [e.coordinates[i][1], 0]
                                    }), t.addKeyframe(n, {
                                        start: 1.3,
                                        end: 2.2,
                                        easeFunction: e.customBezier,
                                        opacity: [1, 0]
                                    })
                                }), t.addKeyframe(n, {
                                    start: 1.1,
                                    end: 1.35,
                                    easeFunction: e.customBezier,
                                    opacity: [0, 1]
                                }), t.addKeyframe(n, {
                                    start: 1.3,
                                    end: 1.6,
                                    easeFunction: e.customBezier,
                                    scale: [.7, 1]
                                }), t.addKeyframe(n, {
                                    start: 1.3,
                                    easeFunction: e.customBezier,
                                    cssClass: "addTransparentBorder",
                                    toggle: !0
                                }), t.addKeyframe(n, {
                                    start: 1.5,
                                    easeFunction: e.customBezier,
                                    cssClass: "addBorder",
                                    toggle: !0
                                });
                                var a = t.addKeyframe(n, {
                                    start: 1.3,
                                    end: 1.6,
                                    borderRadius: [50, 15],
                                    event: "updateBorderRadius",
                                    easeFunction: e.customBezier,
                                    ease: 1
                                });
                                a.controller.on("updateBorderRadius", function(e) {
                                    var t = e.tweenProps;
                                    n.style.borderRadius = t.borderRadius.current + "%"
                                }), t.addKeyframe(s, {
                                    start: 1.3,
                                    end: 2.3,
                                    x: [0, "-15px"],
                                    y: ["-25px", "-45px"],
                                    easeFunction: "easeInOutCubic",
                                    opacity: [0, 1]
                                }), t.addKeyframe(i, {
                                    start: 1.5,
                                    end: 2,
                                    easeFunction: e.customBezier,
                                    opacity: [0, 1],
                                    y: ["20px", 0]
                                }), t.addKeyframe(o, {
                                    start: 1.6,
                                    end: 2,
                                    easeFunction: e.customBezier,
                                    opacity: [0, 1],
                                    y: ["20px", 0]
                                })
                            };
                        this.timeline ? (this.timeline.remove(), h.update(t)) : t()
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return !l.browser.ie
                    }
                }]), t
            }(u);
        t.exports = f
    }, {
        "@marcom/ac-raf-emitter/update": 109,
        "@marcom/anim-system": 148,
        "@marcom/bubble-gum/BaseComponent": 168,
        "@marcom/useragent-detect": 179
    }],
    244: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("./VideoViewportSource"),
            c = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.player = null, r
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        this.attachToVideoPlayer(), this.setupButtons()
                    }
                }, {
                    key: "attachToVideoPlayer",
                    value: function() {
                        for (var e = this, t = this.el.parentElement; t;) {
                            var r = this.gum.getComponentOfType("VideoViewportSource", t);
                            if (r) {
                                this.player = r;
                                break
                            }
                            t = t.parentElement
                        }
                        return this.player ? (this.player.video.addEventListener("playing", function() {
                            e.el.classList.remove("waiting-to-start"), e.el.classList.remove("ended")
                        }), void this.player.video.addEventListener("ended", function() {
                            e.el.classList.remove("waiting-to-start"), e.el.classList.add("ended")
                        })) : void console.log("MediaButton could not find a VideoViewportSource component")
                    }
                }, {
                    key: "setupButtons",
                    value: function() {
                        var e = this;
                        this.buttons = {
                            play: this.el.querySelector(".icon-play"),
                            pause: this.el.querySelector(".icon-pause"),
                            replay: this.el.querySelector(".icon-replay")
                        }, Object.keys(this.buttons).forEach(function(t) {
                            var r = "play" === t,
                                n = "pause" === t,
                                i = "replay" === t,
                                o = e.buttons[t];
                            o.addEventListener("click", function() {
                                (r || n) && (e.buttons.play.classList.toggle("hidden"), e.buttons.pause.classList.toggle("hidden")), (r || i) && e.player.queueVideoPlayback(), n && e.player.pauseVideoPlayback()
                            })
                        })
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return u.IS_SUPPORTED()
                    }
                }]), t
            }(a);
        t.exports = c
    }, {
        "./VideoViewportSource": 250,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    245: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("@marcom/anim-system"),
            c = function(e) {
                function t(e) {
                    return n(this, t), i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        var e = u.createTimeGroup(),
                            t = this.el.querySelector(".image-old-map");
                        this.addDiscreteEvent({
                            start: "t - 35vh",
                            end: "t",
                            event: "NewMap:play",
                            onEnter: function() {
                                return e.play()
                            }
                        }), e.addKeyframe(t, {
                            start: .5,
                            end: 1,
                            cssClass: "wipe",
                            toggle: !0
                        }), this.addDiscreteEvent({
                            start: "t - 100vh",
                            end: "b",
                            event: "NewMap:reset",
                            onEnter: function(t) {
                                return e.progress(0, !0)
                            }
                        })
                    }
                }]), t
            }(a);
        t.exports = c
    }, {
        "@marcom/anim-system": 148,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    246: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("@marcom/ac-progressive-image-loader/ProgressiveImageLoader"),
            c = {
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            l = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    try {
                        r._loadOptions = JSON.parse(r.el.getAttribute("data-progressive-image-options"))
                    } catch (o) {
                        r._loadOptions = null
                    }
                    return r.imageLoader = new u({
                        container: r.el,
                        includeContainer: !0
                    }), r
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        var e = this,
                            t = this.el.querySelectorAll("[data-progressive-image]").length,
                            r = this.el.querySelectorAll("figure").length;
                        return 0 === t && r > 0 ? void console.log("Warning: Attempting to progressively load images on a container without any progressive-images", this.el) : void c.update(function() {
                            e.addDiscreteEvent({
                                start: "t - 200vh",
                                end: "b + 100vh",
                                event: "ProgressiveImageLoad",
                                allowRTL: !0,
                                onEnter: function() {
                                    return e.imageLoader.load(e._loadOptions)
                                }
                            })
                        })
                    }
                }, {
                    key: "destroy",
                    value: function() {
                        this.imageLoader.destroy(), this.imageLoader = null
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return document.documentElement.classList.contains("progressive-image")
                    }
                }]), t
            }(a);
        t.exports = l
    }, {
        "@marcom/ac-progressive-image-loader/ProgressiveImageLoader": 92,
        "@marcom/ac-raf-emitter/draw": 105,
        "@marcom/ac-raf-emitter/update": 109,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    247: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("@marcom/anim-system"),
            c = (e("@marcom/anim-system/Model/AnimSystemModel"), e("@marcom/ac-siri-player").SiriPlayer),
            l = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.currentBreakpoint = e.pageMetrics.breakpoint, r.NORMAL_ENVELOPE = {
                        L: .5,
                        M: .5,
                        S: .65
                    }, r.SILENT_ENVELOPE = {
                        L: .95,
                        M: .95,
                        S: .95
                    }, r.PAUSE_ENVELOPE = {
                        L: .5,
                        M: .5,
                        S: .5
                    }, r.NORMAL_ENVELOPE_2 = {
                        L: .05,
                        M: .05,
                        S: .65
                    }, r.SILENT_ENVELOPE_2 = {
                        L: .3,
                        M: .3,
                        S: .3
                    }, r.PAUSE_ENVELOPE_2 = {
                        L: .3,
                        M: .3,
                        S: .3
                    }, r.NORMAL_SCALE = {
                        L: .2,
                        M: .2,
                        S: .2
                    }, r.SILENT_SCALE = {
                        L: .85,
                        M: .85,
                        S: .85
                    }, r.PAUSE_SCALE = {
                        L: .2,
                        M: .2,
                        S: .2
                    }, r.NORMAL_SPEED = {
                        L: 1.5,
                        M: 1.5,
                        S: 1.5
                    }, r.SILENT_SPEED = {
                        L: .5,
                        M: .5,
                        S: .5
                    }, r.PAUSE_SPEED = {
                        L: .1,
                        M: .1,
                        S: .1
                    }, r
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        this._setUpDom()
                    }
                }, {
                    key: "_setUpDom",
                    value: function() {
                        var e = this,
                            t = document.querySelector(".tile-new-siri-voice .front-panel .panel-content");
                        this.siriWave = new c({
                            transparent: !0
                        }), this.siriWave.setSize(515, 200), this.siriWave.el.style.width = "100%", t.appendChild(this.siriWave.el), this.siriWave.setUniforms({
                            et: this.SILENT_SCALE,
                            ee: this.SILENT_SPEED,
                            qa: this.SILENT_ENVELOPE,
                            te: this.SILENT_ENVELOPE_2
                        }), this.addDiscreteEvent({
                            el: t,
                            start: "t - 100vh",
                            end: "b + 100vh",
                            event: "SiriWave: prepare",
                            onEnter: function(t) {
                                return e.siriWave.start()
                            },
                            onExit: function(t) {
                                return e.siriWave.stop()
                            }
                        }), this.addDiscreteEvent({
                            el: t,
                            start: "t -31vh",
                            end: "t",
                            event: "SiriWave:play",
                            onEnter: function(t) {
                                return e.timeline.play()
                            }
                        }), this.addDiscreteEvent({
                            el: t,
                            start: "t - 100vh",
                            end: "b",
                            event: "SiriWave:reset",
                            onEnter: function(t) {
                                1 === e.timeline.progress() && e.timeline.progress(0)
                            }
                        });
                        var r = document.querySelector(".tile-new-siri-voice .front-panel-headline");
                        this.timeline = u.createTimeGroup(r), this.timeline.name = "siri-wave", this._initSiriTextTimeline(r), this._initSiriWaveTimeline()
                    }
                }, {
                    key: "round10",
                    value: function(e) {
                        return Math.round(100 * e) / 100
                    }
                }, {
                    key: "_initSiriTextTimeline",
                    value: function(e) {
                        var t = this,
                            r = Array.prototype.slice.call(e.querySelectorAll("span"));
                        r.reduce(function(e, r) {
                            var n = e,
                                i = t.round10(.05 * r.innerText.length),
                                o = 0;
                            r.innerText.indexOf(".") !== -1 && (o = t.round10(i + .25));
                            var s = t.round10(n + i);
                            return t.timeline.addKeyframe(r, {
                                start: n,
                                end: s,
                                ease: 1,
                                opacity: [0, 1]
                            }), t.round10(s + o)
                        }, .1)
                    }
                }, {
                    key: "_initSiriWaveTimeline",
                    value: function() {
                        var e = this,
                            t = (this.timeline.addKeyframe(this.siriWave.el, {
                                start: .1,
                                end: .6,
                                ease: 1,
                                easeFunction: "easeInOutQuad",
                                event: "update-siri-wave",
                                et: [this.SILENT_SCALE[this.currentBreakpoint], this.NORMAL_SCALE[this.currentBreakpoint]],
                                ee: [this.SILENT_SPEED[this.currentBreakpoint], this.NORMAL_SPEED[this.currentBreakpoint]],
                                qa: [this.SILENT_ENVELOPE[this.currentBreakpoint], this.NORMAL_ENVELOPE[this.currentBreakpoint]],
                                te: [this.SILENT_ENVELOPE_2[this.currentBreakpoint], this.NORMAL_ENVELOPE_2[this.currentBreakpoint]]
                            }), this.timeline.addKeyframe(this.siriWave.el, {
                                start: 3.3,
                                end: 3.8,
                                ease: 1,
                                easeFunction: "easeInOutQuad",
                                event: "update-siri-wave",
                                et: [this.NORMAL_SCALE[this.currentBreakpoint], this.SILENT_SCALE[this.currentBreakpoint]],
                                ee: [this.NORMAL_SPEED[this.currentBreakpoint], this.SILENT_SPEED[this.currentBreakpoint]],
                                qa: [this.NORMAL_ENVELOPE[this.currentBreakpoint], this.SILENT_ENVELOPE[this.currentBreakpoint]],
                                te: [this.NORMAL_ENVELOPE_2[this.currentBreakpoint], this.SILENT_ENVELOPE_2[this.currentBreakpoint]]
                            }), this.timeline.addKeyframe(this.siriWave.el, {
                                start: 4.3,
                                end: 4.8,
                                ease: 1,
                                easeFunction: "easeInOutQuad",
                                event: "update-siri-wave",
                                et: [this.SILENT_SCALE[this.currentBreakpoint], this.NORMAL_SCALE[this.currentBreakpoint]],
                                ee: [this.SILENT_SPEED[this.currentBreakpoint], this.NORMAL_SPEED[this.currentBreakpoint]],
                                qa: [this.SILENT_ENVELOPE[this.currentBreakpoint], this.NORMAL_ENVELOPE[this.currentBreakpoint]],
                                te: [this.SILENT_ENVELOPE_2[this.currentBreakpoint], this.NORMAL_ENVELOPE_2[this.currentBreakpoint]]
                            }), this.timeline.addKeyframe(this.siriWave.el, {
                                start: 6,
                                end: 6.5,
                                ease: 1,
                                easeFunction: "easeInOutQuad",
                                event: "update-siri-wave",
                                et: [this.NORMAL_SCALE[this.currentBreakpoint], this.SILENT_SCALE[this.currentBreakpoint]],
                                ee: [this.NORMAL_SPEED[this.currentBreakpoint], this.SILENT_SPEED[this.currentBreakpoint]],
                                qa: [this.NORMAL_ENVELOPE[this.currentBreakpoint], this.SILENT_ENVELOPE[this.currentBreakpoint]],
                                te: [this.NORMAL_ENVELOPE_2[this.currentBreakpoint], this.SILENT_ENVELOPE_2[this.currentBreakpoint]]
                            }));
                        t.controller.on(t.event, function(t) {
                            e.siriWave.setUniforms({
                                et: t.tweenProps.et.current,
                                ee: t.tweenProps.ee.current,
                                qa: t.tweenProps.qa.current,
                                te: t.tweenProps.te.current
                            })
                        })
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function(e) {
                        var t = this,
                            r = this.timeline.getControllerForTarget(this.siriWave.el);
                        r && r.remove(), this.currentBreakpoint = e.breakpoint, requestAnimationFrame(function() {
                            t._initSiriWaveTimeline()
                        })
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return document.documentElement.classList.contains("siri-wave")
                    }
                }]), t
            }(a);
        t.exports = l
    }, {
        "@marcom/ac-siri-player": 119,
        "@marcom/anim-system": 148,
        "@marcom/anim-system/Model/AnimSystemModel": 153,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    248: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("@marcom/ac-accessibility/EventProxy"),
            c = e("@marcom/ac-accessibility/CircularTab"),
            l = e("@marcom/ac-keyboard"),
            h = e("@marcom/ac-keyboard/keyMap"),
            f = "data-tile-id",
            p = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.overlay = r.el.querySelector(".features-overlay"), r.tileElements = r.el.querySelectorAll('[data-tile-type="tile-flip"]'), r.tiles = {}, r.currentTile = null, r.initialScrollY = null, r.isScrollClose = null, r.isTileOpen = !1, r
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        this._initTiles(), this._bindEvents(), this._setupEvents()
                    }
                }, {
                    key: "_bindEvents",
                    value: function() {
                        this._openTile = this._openTile.bind(this), this._closeTile = this._closeTile.bind(this), this._onTileExit = this._onTileExit.bind(this), this._onButtonOver = this._onButtonOver.bind(this), this._onButtonOut = this._onButtonOut.bind(this), this._onOrientationChange = this._onOrientationChange.bind(this), this._onCardTransitionInEnded = this._onCardTransitionInEnded.bind(this), this._onCardTransitionOutEnded = this._onCardTransitionOutEnded.bind(this), this._onOverlayTransitionOutEnded = this._onOverlayTransitionOutEnded.bind(this)
                    }
                }, {
                    key: "_initTiles",
                    value: function() {
                        var e = this;
                        this.tileElements.forEach(function(t) {
                            var r = {},
                                n = t.querySelector(".back-panel");
                            r.el = t, r.buttonOpen = t.querySelector(".button-open"), r.buttonClose = t.querySelector(".button-close"), r.backPanelHeadline = t.querySelector(".back-panel-headline"), r.cirTab = new c(n, {
                                firstFocusElement: r.backPanelHeadline
                            }), e.tiles[t.getAttribute([f])] = r
                        })
                    }
                }, {
                    key: "_setupEvents",
                    value: function() {
                        var e = this;
                        this.overlay.addEventListener("click", this._closeTile, !0), l.onUp(h.ESCAPE, this._closeTile), Object.keys(this.tiles).forEach(function(t) {
                            u.addEventListener(e.tiles[t].buttonOpen, "click", e._openTile), u.addEventListener(e.tiles[t].buttonClose, "click", e._closeTile), e.tiles[t].buttonOpen.addEventListener("mouseover", e._onButtonOver, !1), e.tiles[t].buttonOpen.addEventListener("mouseout", e._onButtonOut, !1)
                        }), window.addEventListener("orientationchange", this._onOrientationChange, !1)
                    }
                }, {
                    key: "_setFocus",
                    value: function(e) {
                        setTimeout(function() {
                            e.focus()
                        }, 300)
                    }
                }, {
                    key: "_openTile",
                    value: function(e) {
                        e.preventDefault(), this.currentTile = this.tiles[e.target.parentNode.parentNode.getAttribute([f])], this.currentTile.el.classList.add("flip", "transitioning"), this.currentTile.el.addEventListener("transitionend", this._onCardTransitionInEnded, !1), this.currentTile.buttonOpen.classList.add("hide"), this.overlay.classList.add("fade-in"), this.currentTile.cirTab.start(), this.isTileOpen = !0
                    }
                }, {
                    key: "_closeTile",
                    value: function(e, t) {
                        this.isScrollClose = t, this.isTileOpen && (this.currentTile.el.classList.remove("flip"), this.currentTile.el.addEventListener("transitionend", this._onCardTransitionOutEnded, !1), this.currentTile.buttonOpen.classList.remove("hide"), this.overlay.classList.add("fade-out"), this.overlay.classList.remove("fade-in"), this.overlay.addEventListener("transitionend", this._onOverlayTransitionOutEnded, !1), this.currentTile.cirTab.stop(), this.isTileOpen = !1)
                    }
                }, {
                    key: "_onButtonOver",
                    value: function(e) {
                        var t = e.target.parentElement.querySelector(".icon-open");
                        t.classList.add("hover")
                    }
                }, {
                    key: "_onButtonOut",
                    value: function(e) {
                        var t = e.target.parentElement.querySelector(".icon-open");
                        t.classList.remove("hover")
                    }
                }, {
                    key: "_addScrollClose",
                    value: function() {
                        var e = {
                            el: this.currentTile.el,
                            start: "t - 100vh",
                            end: "t + 100%",
                            event: "TileScrollClose",
                            onExit: this._onTileExit
                        };
                        this.TileScrollClose = this.addDiscreteEvent(e)
                    }
                }, {
                    key: "_removeScrollClose",
                    value: function() {
                        this.TileScrollClose.remove()
                    }
                }, {
                    key: "_onTileExit",
                    value: function() {
                        this._closeTile(null, !0)
                    }
                }, {
                    key: "onBreakpointChange",
                    value: function() {
                        this._closeTile(null, !1)
                    }
                }, {
                    key: "_onOrientationChange",
                    value: function(e) {
                        this._closeTile(null, !1)
                    }
                }, {
                    key: "_onCardTransitionInEnded",
                    value: function() {
                        var e = this;
                        this.currentTile.el.removeEventListener("transitionend", this._onCardTransitionInEnded, !1), setTimeout(function() {
                            e._addScrollClose()
                        }, 500)
                    }
                }, {
                    key: "_onCardTransitionOutEnded",
                    value: function() {
                        this.currentTile.el.classList.remove("transitioning"), this.currentTile.el.removeEventListener("transitionend", this._onCardTransitionOutEnded, !1), this.isScrollClose || this._setFocus(this.currentTile.buttonOpen)
                    }
                }, {
                    key: "_onOverlayTransitionOutEnded",
                    value: function() {
                        this.overlay.classList.remove("fade-out"), this.overlay.removeEventListener("transitionend", this._onOverlayTransitionOutEnded, !1), this._removeScrollClose()
                    }
                }]), t
            }(a);
        t.exports = p
    }, {
        "@marcom/ac-accessibility/CircularTab": 1,
        "@marcom/ac-accessibility/EventProxy": 2,
        "@marcom/ac-keyboard": 66,
        "@marcom/ac-keyboard/keyMap": 68,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    249: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/bubble-gum/BaseComponent"),
            u = e("./VideoViewportSource"),
            c = function(e) {
                function t(e) {
                    return n(this, t), i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e))
                }
                return o(t, e), s(t, [{
                    key: "mounted",
                    value: function() {
                        var e = this.gum.getComponentOfType("VideoViewportSource", this.el);
                        e.autoplayKeyframe.remove().then(function() {
                            e.addDiscreteEvent({
                                event: "Video:Play",
                                start: "t - 50vh",
                                end: "b - 50vh",
                                onEnter: function() {
                                    e.el.classList.contains("waiting-to-start") && e.queueVideoPlayback()
                                }
                            }), e.addDiscreteEvent({
                                event: "Video:Reset",
                                start: "t - 100vh",
                                end: "b + 20vh",
                                onExit: function() {
                                    e.el.classList.contains("ended") && e.showStartFrame()
                                }
                            })
                        })
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return u.IS_SUPPORTED()
                    }
                }]), t
            }(a);
        t.exports = c
    }, {
        "./VideoViewportSource": 250,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    250: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }

        function s(e) {
            return {
                X: "xlarge",
                L: "large",
                M: "medium",
                S: "small"
            }[e]
        }
        var a = function() {
                function e(e, t) {
                    var r = [],
                        n = !0,
                        i = !1,
                        o = void 0;
                    try {
                        for (var s, a = e[Symbol.iterator](); !(n = (s = a.next()).done) && (r.push(s.value), !t || r.length !== t); n = !0);
                    } catch (u) {
                        i = !0, o = u
                    } finally {
                        try {
                            !n && a["return"] && a["return"]()
                        } finally {
                            if (i) throw o
                        }
                    }
                    return r
                }
                return function(t, r) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, r);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            u = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            c = e("@marcom/bubble-gum/BaseComponent"),
            l = 3,
            h = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    r.video = r.el.querySelector("video") || r.el, r.options = e.data || {}, r.pauseRelativeTo = r.options.pauseRelativeTo || r.el.getAttribute("data-pause-relative-to"), r.sources = {}, Object.entries(r.video.dataset).filter(function(e) {
                        var t = a(e, 1),
                            r = t[0];
                        return 0 === r.indexOf("src")
                    }).forEach(function(e) {
                        var t = a(e, 2),
                            n = t[0],
                            i = t[1],
                            o = n.replace(/^src/, "").toLowerCase();
                        r.sources[o] = i
                    });
                    var o = void 0;
                    return Object.defineProperty(r, "currentViewport", {
                        set: function(e) {
                            o = s(e), r.load(o)
                        },
                        get: function() {
                            return o
                        }
                    }), r.currentViewport = e.pageMetrics.breakpoint, r.previousSource = null, r.inLoadArea = !1, r.addDiscreteEvent({
                        event: "Video: Load",
                        start: r.options.loadAreaStart || "t - 200vh",
                        end: r.options.loadAreaEnd || "b + 100vh",
                        onEnter: function() {
                            r.inLoadArea = !0, r.load()
                        },
                        onExit: function() {
                            r.inLoadArea = !1
                        }
                    }), r.autoplayKeyframe = r.addDiscreteEvent({
                        event: "Video: Pause Offscreen",
                        start: "t - 50vh + 50%h",
                        end: "b + 50vh - 50%h",
                        onEnter: function() {
                            return r.queueVideoPlayback()
                        },
                        onExit: function() {
                            return r.pauseVideoPlayback()
                        }
                    }), r.video.addEventListener("playing", function() {
                        r.el.classList.remove("waiting-to-start"), r.el.classList.remove("ended")
                    }), r.video.addEventListener("ended", function() {
                        r.el.classList.remove("waiting-to-start"), r.el.classList.add("ended")
                    }), r
                }
                return o(t, e), u(t, [{
                    key: "onBreakpointChange",
                    value: function(e) {
                        this.currentViewport = e.breakpoint
                    }
                }, {
                    key: "load",
                    value: function(e) {
                        if (this.inLoadArea) {
                            e = e || this.currentViewport;
                            var t = this.sources[e],
                                r = window.devicePixelRatio >= 2 ? "_2x" : "",
                                n = t.split(".")[1];
                            t = t.replace("." + n, r + "." + n), t && t !== this.previousSource && (this.video.autoplay = this.video.readyState >= l && !this.video.paused, this.video.src = this.previousSource = t, this.video.load())
                        }
                    }
                }, {
                    key: "showStartFrame",
                    value: function() {
                        this.video.currentTime = 0, this.el.classList.add("waiting-to-start"), this.el.classList.remove("ended"), this.pauseVideoPlayback()
                    }
                }, {
                    key: "queueVideoPlayback",
                    value: function() {
                        var e = this;
                        "function" == typeof this._onCanPlay && this.video.removeEventListener("canplay", this._onCanPlay), this.video.readyState < l ? (this._onCanPlay = function() {
                            e.video.play(), e.video.removeEventListener("canplay", e._onCanPlay)
                        }, this.video.addEventListener("canplay", this._onCanPlay)) : this.video.play()
                    }
                }, {
                    key: "pauseVideoPlayback",
                    value: function() {
                        this.video.paused || this.video.pause()
                    }
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return document.documentElement.classList.contains("no-ie")
                    }
                }]), t
            }(c);
        t.exports = h
    }, {
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    251: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/useragent-detect"),
            i = n.browser.ie && n.browser.version.major <= 11,
            o = e("@marcom/viewport-emitter");
        if (i) {
            var s = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "classList");
            Object.defineProperty(SVGElement.prototype, "classList", s)
        }
        var a = function(e) {
                this._wrapper = e, this._progressSizeSettings = null, this._mediaSettings = {
                    selected: !1,
                    player: !1,
                    circumference: 0,
                    percentage: 0,
                    currentProgress: 0
                }, this._wrapper.getAttribute("data-progress-settings") && (this._progressSizeSettings = JSON.parse(this._wrapper.getAttribute("data-progress-settings"))), this.resizeProgressBar(), this._setResizeEvents()
            },
            u = a.prototype;
        u.player = !1, u._setResizeEvents = function() {
            o.on("change", this.resizeProgressBar.bind(this))
        }, u._setCircumference = function() {
            var e = parseFloat(this._progressElements[0].getAttribute("r")),
                t = 0;
            for (this._mediaSettings.circumference = 2 * Math.PI * e, t; t < this._progressElements.length; t++) this._progressElements[t].setAttribute("style", "stroke-dashoffset: " + this._mediaSettings.circumference + "px; stroke-dasharray: " + this._mediaSettings.circumference + "px")
        }, u.resetCircumference = function(e) {
            e.setAttribute("style", "stroke-dashoffset: " + this._mediaSettings.circumference + "px; stroke-dasharray: " + this._mediaSettings.circumference + "px")
        }, u.resizeProgressBar = function() {
            this._progressElements = this._wrapper.querySelectorAll(".progress-bar");
            var e = 0;
            for (e; e < this._progressElements.length; e++) {
                var t = "xlarge" === o.viewport ? "large" : o.viewport;
                this._progressElements[e].setAttribute("r", this._progressSizeSettings[t].r), this._progressElements[e].setAttribute("cx", this._progressSizeSettings[t].cx), this._progressElements[e].setAttribute("cy", this._progressSizeSettings[t].cy)
            }
            this._setCircumference()
        }, u._progressAnimation = null, u._runProgressAnimation = function() {
            this._progressAnimation = window.requestAnimationFrame(this._updateProgress.bind(this))
        }, u._updateProgress = function() {
            this._mediaSettings.percentage = this._mediaSettings.player.currentTime / this._mediaSettings.player.duration, this._mediaSettings.percentage > 1 && (this._mediaSettings.percentage = 1), this._mediaSettings.currentProgress = this._mediaSettings.circumference - this._mediaSettings.percentage * this._mediaSettings.circumference, isNaN(this._mediaSettings.currentProgress) || this._mediaSettings.selected.setAttribute("style", "stroke-dashoffset: " + this._mediaSettings.currentProgress + "px; stroke-dasharray: " + this._mediaSettings.circumference + "px"), this._runProgressAnimation()
        }, u._setProgressEvents = function(e, t) {
            this._mediaSettings.player = t || document.querySelector(".ac-video-media-controller"), this._mediaSettings.player.addEventListener("play", function(e) {
                this._runProgressAnimation(), this._mediaSettings.selected.classList.add("playing")
            }.bind(this)), this._mediaSettings.player.addEventListener("pause", function(t) {
                window.cancelAnimationFrame(this._progressAnimation);
                var r = 0;
                for (r; r < this._progressElements.length; r++) this._progressElements[r].setAttribute("style", "");
                this._mediaSettings.selected.classList.remove("playing"), e.classList.remove("current-progress")
            }.bind(this)), this._mediaSettings.player.addEventListener("ended", function(t) {
                window.cancelAnimationFrame(this._progressAnimation);
                var r = 0;
                for (r; r < this._progressElements.length; r++) this._progressElements[r].setAttribute("style", "");
                this._mediaSettings.selected.classList.remove("playing"), e.classList.remove("current-progress")
            }.bind(this))
        }, u.startProgress = function(e, t) {
            e.classList.add("current-progress");
            var r = e;
            this._mediaSettings.player = t || this._wrapper.querySelector(".ac-video-media-controller"), this._mediaSettings.selected = r.querySelector(".progress-bar"), this._setProgressEvents(r, t), this.player = !0
        }, t.exports = a
    }, {
        "@marcom/useragent-detect": 179,
        "@marcom/viewport-emitter": 190
    }],
    252: [function(e, t, r) {
        "use strict";
        var n = e("./ProgressBar"),
            i = function() {
                return {
                    __defaultOptions: {
                        registerWithController: !0,
                        trackAnalytics: !0
                    },
                    initialize: function(e) {
                        this.isPlaying = !1, this.trigger = null, this.activeAudio = null, this.audioSrc = null, this.activeAudioController = null, this.animating = !1, this.videoPlaying = !1, this.mp3Support = this._canPlayMP3Audio(), this.triggerClassName = e;
                        var t = document.querySelectorAll("." + e),
                            r = this._bindAsEventListener(this._triggerHandler, this),
                            n = this._bindAsEventListener(this.galleryTriggerHandler, this);
                        this._bindVideoResetEvents(), [].slice.call(t).forEach(function(e) {
                            e.classList.contains("gallery-video-trigger") ? e.addEventListener("click", n) : e.addEventListener("click", r)
                        })
                    },
                    _bindVideoResetEvents: function() {
                        var e = this;
                        if (this.videos = document.querySelectorAll("video"), this.videos.length)
                            for (var t = 0; t < this.videos.length; t++) this.videos[t].addEventListener("playing", function() {
                                e.__testActiveAudio(), e.videoPlaying = !0
                            }), this.videos[t].addEventListener("pause", function() {
                                e.videoPlaying = !1
                            })
                    },
                    pauseVideos: function() {
                        for (var e = 0; e < this.videos.length; e++) this.videos[e].pause()
                    },
                    _bindAsEventListener: function(e, t) {
                        var r = Array.prototype.slice.call(arguments, 2);
                        return function(n) {
                            return e.apply(t, [n || window.event].concat(r))
                        }
                    },
                    _canPlayMP3Audio: function() {
                        var e = document.createElement("audio");
                        return "undefined" != typeof e.canPlayType && "" != e.canPlayType("audio/mp3")
                    },
                    _triggerHandler: function(e) {
                        this.videoPlaying && this.pauseVideos();
                        var t = e.target || e.srcElement,
                            r = this;
                        e.preventDefault && e.preventDefault(), this.animating || (this.trigger = this.__getTriggerElement(t), document.documentElement.classList.contains("oldie") && window.open(this.trigger.getAttribute("data-audio-href")), 1 == this.isPlaying ? this.__testActiveAudio() : this.__canPlayAudio(), this.animating = !0, window.setTimeout(function() {
                            r._switchAnimating()
                        }, 1e3))
                    },
                    _switchAnimating: function() {
                        this.animating ? this.animating = !1 : this.animating = !0
                    },
                    __getTriggerElement: function(e) {
                        for (var t = 0;
                            "A" != e.tagName && t < 5;) e = e.parentNode, t++;
                        return e
                    },
                    __testActiveAudio: function() {
                        this.activeAudio = document.querySelector("#audio-clip"), this.activeAudio && (this.activeAudio.parentNode && (this.activeAudioController = this.activeAudio.parentNode), "undefined" != typeof this.activeAudio && null != this.activeAudio && this.activeAudioController == this.trigger ? this.stopAudio() : this.__stopActiveAudio())
                    },
                    __stopActiveAudio: function() {
                        var e = this.activeAudioController;
                        this.pauseAudio(this.activeAudio), this.__resetController(e), this.__canPlayAudio()
                    },
                    __canPlayAudio: function() {
                        this.audioSrc = this.trigger.getAttribute("data-audio-href"), this.mp3Support ? this.__buildHTML5Controller() : this.__buildQuickTimeController()
                    },
                    __buildQuickTimeController: function() {
                        if (!(navigator.userAgent.indexOf("MSIE") > -1)) {
                            var e = document.createElement("object"),
                                t = document.createElement("param"),
                                r = document.createElement("embed");
                            e.setAttribute("id", "audio-clip"), e.setAttribute("classid", "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B"), e.setAttribute("codebase", "https://www.apple.com/qtactivex/qtplugin.cab"), e.setAttribute("width", "0"), e.setAttribute("height", "0"), t.setAttribute("name", "src"), t.setAttribute("value", this.audioSrc), r.setAttribute("src", this.audioSrc), r.setAttribute("height", "0"), r.setAttribute("width", "0"), r.setAttribute("type", "video/quicktime"), r.setAttribute("pluginspage", "https://www.apple.com/quicktime/download/"), r.setAttribute("enablejavascript", "true"), r.setAttribute("postdomevents", "true"), e.appendChild(t), e.appendChild(r), this.trigger.appendChild(e), this.playAudio()
                        }
                    },
                    __buildHTML5Controller: function() {
                        var e, t = document.createElement("audio"),
                            r = document.createElement("source");
                        t.setAttribute("id", "audio-clip"), t.appendChild(r), r.setAttribute("src", this.audioSrc), r.setAttribute("type", "audio/mp3"), this.trigger.appendChild(t), e = document.getElementById("audio-clip"), this.playAudio()
                    },
                    playAudio: function() {
                        var e = this,
                            t = document.getElementById("audio-clip"),
                            r = (this.trigger, this.trigger.querySelector(".audio-figure")),
                            i = t.tagName.toLowerCase(),
                            o = this._bindAsEventListener(this.stopAudio, this);
                        switch (this.isPlaying = !0, this._switchAllStopIcons(), r.classList.remove("audio-play"), r.classList.add("audio-stop"), this.mp3Support && setTimeout(function() {
                            t.addEventListener("playing", function() {
                                e._setAnalyticsClick("stop")
                            }, !1), t.addEventListener("ended", function() {
                                e._setAnalyticsClick("play")
                            }, !1), t.play();
                            var r = document.querySelector(".current-progress");
                            null != r && r.classList.remove("current-progress"), e._progressBar = new n(e.trigger), e._progressBar.startProgress(e.trigger, t)
                        }, 100), i) {
                            case "audio":
                                t.addEventListener("ended", o);
                                break;
                            case "object":
                            case "embed":
                                t.addEventListener("qt_ended", o);
                                break;
                            default:
                                return
                        }
                    },
                    stopAudio: function() {
                        var e = this,
                            t = this.trigger;
                        this.isPlaying = !1;
                        var r = document.getElementById("audio-clip");
                        r.addEventListener("pause", function() {
                            e._setAnalyticsClick("play")
                        }, !1), this.pauseAudio(r), this.__resetController(t), this.trigger.querySelector(".audio-figure").classList.remove("audio-stop"), this.trigger.querySelector(".audio-figure").classList.add("audio-play")
                    },
                    pauseAudio: function(e) {
                        this.mp3Support && e && e.pause()
                    },
                    _setAnalyticsClick: function(e) {
                        this.trigger.setAttribute("data-analytics-click", "prop3:" + e + " - " + this.trigger.getAttribute("data-analytics-title"))
                    },
                    __resetController: function(e) {
                        var t = document.getElementById("audio-clip");
                        t && (this.elementRemove(t), this.selectElement(".audio-figure", e).classList.add("audio-stop"), e != this.trigger && this.selectElement(".audio-figure", e).classList.remove("audio-play"), this.selectElement(".audio-figure", this.trigger).classList.add("audio-play"))
                    },
                    galleryTriggerHandler: function() {
                        this.stopAudio()
                    },
                    _switchAllStopIcons: function() {
                        for (var e = document.querySelectorAll(".audio-stop"), t = 0; t < e.length; t++) e[t].classList.add("audio-play"), e[t].classList.remove("audio-stop")
                    },
                    elementRemove: function(e, t) {
                        if (t === !0) {
                            var r = e.parentNode.removeChild(e);
                            return r
                        }
                        e && e.parentNode.removeChild(e)
                    },
                    selectElement: function(e, t) {
                        if ("undefined" == typeof t) t = document;
                        else if (!this.isElement(t) && 9 !== t.nodeType && 11 !== t.nodeType) throw new TypeError("Invalid context nodeType");
                        if ("string" != typeof e) throw new TypeError("Selector must be a string");
                        return t.querySelector(e)
                    },
                    isElement: function(e) {
                        return !(!e || 1 !== e.nodeType)
                    }
                }
            }();
        t.exports = i
    }, {
        "./ProgressBar": 251
    }],
    253: [function(e, t, r) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }

        function i(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }

        function o(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        var s = function() {
                function e(e, t) {
                    for (var r = 0; r < t.length; r++) {
                        var n = t[r];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, r, n) {
                    return r && e(t.prototype, r), n && e(t, n), t
                }
            }(),
            a = e("@marcom/anim-system"),
            u = e("@marcom/anim-system/src/Model/AnimSystemModel"),
            c = {
                update: e("@marcom/ac-raf-emitter/update"),
                draw: e("@marcom/ac-raf-emitter/draw")
            },
            l = e("@marcom/bubble-gum/BaseComponent"),
            h = function(e) {
                function t(e) {
                    n(this, t);
                    var r = i(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this, e));
                    return r.group = a.createScrollGroup(r.el), r.group.name = "Hero Group", r.heroDevice = r.el.querySelector(".hero-device"), r.deviceAnchor = r.el.querySelector(".device-anchor"), r.scrim = r.el.querySelector(".hero .scrim"), r
                }
                return o(t, e), s(t, [{
                    key: "getDesiredScale",
                    value: function() {
                        this.perspective = parseFloat(getComputedStyle(this.el.querySelector(".hero")).perspective);
                        var e = this.el.querySelector(".center-image .screen"),
                            t = .94 * e.clientWidth,
                            r = u.pageMetrics.windowWidth / t,
                            n = .89 * e.clientHeight,
                            i = u.pageMetrics.windowHeight / n;
                        return Math.max(r, i)
                    }
                }, {
                    key: "scaleToPosition",
                    value: function(e) {
                        return Math.min(this.perspective * (1 - 1 / e), this.perspective - .1)
                    }
                }, {
                    key: "mounted",
                    value: function(e) {
                        var t = this;
                        this.videoPlayer = this.gum.getComponentOfType("VideoViewportSource", this.el), this.videoPlayer.showStartFrame();
                        var r = "(100a0h - 100a1h - 100vh)";
                        this.group.addKeyframe(this.deviceAnchor, {
                            start: "a0t + " + r,
                            end: "a0t + 100vh + " + r,
                            scale: [this.getDesiredScale(), 1],
                            z: [0, 1],
                            easeFunction: "easeInOutQuad",
                            anchors: [".sticky-container", ".sticky-content"],
                            ease: 1
                        }), this.group.addKeyframe(this.heroDevice, {
                            start: "a0t + " + r,
                            end: "a0t + 100vh + " + r,
                            scale: [this.getDesiredScale(), 1],
                            easeFunction: "easeInOutQuad",
                            anchors: [".sticky-container", ".sticky-content"],
                            ease: 1
                        });
                        var n = {
                                start: "a0t - 25vh",
                                end: "a0b + 25vh",
                                anchors: [".sticky-container"],
                                cssClass: "will-change",
                                toggle: !0
                            },
                            i = this.el.closest(".section");
                        this.sectionContent = i.querySelector(".section-content"), [".device-anchor", ".device-container.dark", ".device-container.light", ".scrim"].forEach(function(e) {
                            var r = i.querySelector(e);
                            t.group.addKeyframe(r, Object.assign({}, n))
                        }), [".section-content"].forEach(function(e, r, o) {
                            var s = (1 - r / o.length, i.querySelector(e));
                            t.group.addKeyframe(s, Object.assign({
                                breakpointMask: "LM"
                            }, n)), t.group.addKeyframe(s, {
                                start: "a0t",
                                end: "a0t + 30h",
                                anchors: [".sticky-container", ".content-container .section-content"],
                                opacity: [null, 0],
                                breakpointMask: "LM",
                                ease: 1,
                                easeFunction: "linear"
                            })
                        });
                        var o = i.querySelector(".headline-wrapper"),
                            s = i.querySelector(".copy-block");
                        [o, s].forEach(function(e) {
                            t.group.addKeyframe(e, Object.assign({
                                breakpointMask: "S"
                            }, n))
                        }), this.group.addKeyframe(o, {
                            start: "(a0t + a1t) * 0.25",
                            end: "a1t",
                            opacity: [null, 0],
                            easeFunction: "linear",
                            anchors: [".sticky-container", ".headline-container"],
                            breakpointMask: "S",
                            ease: 1
                        }), this.group.addKeyframe(s, {
                            start: "a0t",
                            end: "a1t",
                            y: [null, "-15vh"],
                            easeFunction: "easeInOutCubic",
                            anchors: [".sticky-container", ".headline-container"],
                            breakpointMask: "S",
                            ease: 1
                        }), this.group.addKeyframe(this.scrim, {
                            start: "a0t",
                            end: "a1t",
                            opacity: [null, 0],
                            easeFunction: "easeInOutCubic",
                            anchors: [".sticky-container", ".headline-container"],
                            breakpointMask: "LM"
                        }), this.group.addKeyframe(this.scrim, {
                            start: "a0t",
                            end: "a1t - 10vh",
                            opacity: [null, 0],
                            easeFunction: "easeInQuad",
                            anchors: [".sticky-container", ".section-content .copy-block"],
                            breakpointMask: "S"
                        });
                        var a = "a0t + (100a0h - 100a1h) * 0.85";
                        this.group.addKeyframe(this.heroDevice, {
                            start: "a0t + (100a0h - 100a1h - 30vh)",
                            toggle: !0,
                            cssClass: "will-change",
                            anchors: [".sticky-container", ".sticky-content"]
                        }), this.group.addKeyframe(this.el, {
                            start: "a0t - 25vh",
                            end: a,
                            cssClass: "light",
                            toggle: !0,
                            anchors: [".sticky-container", ".sticky-content"]
                        });
                        var u = this.el.querySelector(".device-container.dark");
                        this.group.addKeyframe(u, {
                            start: "a0t + (100a0h - 100a1h) * 0.65",
                            cssClass: "show",
                            toggle: !0,
                            anchors: [".sticky-container", ".sticky-content"]
                        }), this.group.addKeyframe(this.el, {
                            start: a,
                            cssClass: "dark",
                            toggle: !0,
                            anchors: [".sticky-container", ".sticky-content"]
                        });
                        var l = document.querySelector("#ac-localnav"),
                            h = document.querySelector(".section-compatibility"),
                            f = this.anim.getGroupForTarget(h);
                        f.addKeyframe(l, {
                            anchors: [".sticky-container", ".sticky-content", ".section-compatibility"],
                            start: a,
                            end: "a2t",
                            cssClass: "ac-localnav-dark",
                            toggle: !0
                        }), this.group.forceUpdate({
                            waitForNextUpdate: !1,
                            silent: !0
                        }), this.onResizeImmediate(this.pageMetrics), this.overwriteVideoKeyframes(), c.draw(function() {
                            u.classList.add("hide"), document.body.classList.remove("initial-state")
                        })
                    }
                }, {
                    key: "overwriteVideoKeyframes",
                    value: function() {
                        var e = this,
                            t = this.group.getControllerForTarget(this.el).getNearestKeyframeForAttribute(".dark"),
                            r = t.jsonProps,
                            n = r.start,
                            i = r.anchors;
                        this.videoPlayer.autoplayKeyframe.remove(), this.el.querySelector(".background-light").addEventListener("transitionend", function(t) {
                            c.draw(function() {
                                e.videoPlayer.video.currentTime = 0, c.update(function() {
                                    e.el.classList.contains("dark") && e.videoPlayer.queueVideoPlayback()
                                })
                            })
                        }), this.videoPlayer.addDiscreteEvent({
                            start: n + " - 10vh",
                            anchors: i,
                            onEventReverse: function() {
                                e.videoPlayer.showStartFrame()
                            }
                        })
                    }
                }, {
                    key: "onResizeImmediate",
                    value: function(e) {
                        "S" !== e.breakpoint && e.windowHeight < 1.2 * this.sectionContent.clientHeight && a.getControllerForTarget(this.sectionContent).getNearestKeyframeForAttribute("opacity").overwriteProps({
                            start: "a1t",
                            end: "a1t + 50a1h"
                        }), a.getControllerForTarget(this.heroDevice).getNearestKeyframeForAttribute("scale").overwriteProps({
                            scale: [this.getDesiredScale(), 1]
                        }), a.getControllerForTarget(this.deviceAnchor).getNearestKeyframeForAttribute("scale").overwriteProps({
                            scale: [this.getDesiredScale(), 1]
                        })
                    }
                }, {
                    key: "onResizeDebounced",
                    value: function(e) {}
                }, {
                    key: "onBreakpointChange",
                    value: function(e) {}
                }], [{
                    key: "IS_SUPPORTED",
                    value: function() {
                        return document.documentElement.classList.contains("hero-animation")
                    }
                }]), t
            }(l);
        t.exports = h
    }, {
        "@marcom/ac-raf-emitter/draw": 105,
        "@marcom/ac-raf-emitter/update": 109,
        "@marcom/anim-system": 148,
        "@marcom/anim-system/src/Model/AnimSystemModel": 153,
        "@marcom/bubble-gum/BaseComponent": 168
    }],
    254: [function(e, t, r) {
        "use strict";
        var n = e("@marcom/bubble-gum/BubbleGum"),
            i = e("@marcom/bubble-gum/ComponentMap"),
            o = e("./model/SiteComponentMap"),
            s = e("@marcom/ac-accessibility/TextZoom"),
            a = e("@marcom/ac-accessibility/EventProxy"),
            u = {
                initialize: function() {
                    Object.assign(i, o), document.querySelectorAll("main section").forEach(function(e) {
                        e.setAttribute("data-anim-scroll-group", e.className.replace(/ /g, "."))
                    });
                    var e = document.querySelector("body"),
                        t = [],
                        r = document.querySelector("#film-memoji"),
                        u = document.querySelector(".siri-audio-button");
                    r && t.push(r), u && t.push(u), new n(e), s.detect(), t.length > 0 && t.forEach(function(e) {
                        a.addEventListener(e, "click", function(e) {
                            "Space" === e.code && (e.preventDefault(), e.target.click())
                        })
                    })
                }
            };
        u.initialize()
    }, {
        "./model/SiteComponentMap": 255,
        "@marcom/ac-accessibility/EventProxy": 2,
        "@marcom/ac-accessibility/TextZoom": 3,
        "@marcom/bubble-gum/BubbleGum": 169,
        "@marcom/bubble-gum/ComponentMap": 170
    }],
    255: [function(e, t, r) {
        "use strict";

        function n(e, t, r) {
            return t in e ? Object.defineProperty(e, t, {
                value: r,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = r, e
        }
        var i;
        t.exports = (i = {
            ProgressiveImage: e("../components/ProgressiveImage"),
            Tile: e("../components/Tile"),
            VideoViewportSource: e("../components/VideoViewportSource"),
            AudioComponent: e("../components/AudioComponent"),
            SiriVoice: e("../components/SiriVoice"),
            FaceIdUnlockSequence: e("../components/FaceIdUnlockSequence"),
            ApplePrivacyUnlock: e("../components/ApplePrivacyUnlock"),
            NewMap: e("../components/NewMap"),
            MapsCollection: e("../components/MapsCollection"),
            HeroAnimation: e("../components/hero/HeroAnimation"),
            HighKeyMono: e("../components/HighKeyMono")
        }, n(i, "VideoViewportSource", e("../components/VideoViewportSource")), n(i, "VideoTile", e("../components/VideoTile")), n(i, "MediaButton", e("../components/MediaButton")), i)
    }, {
        "../components/ApplePrivacyUnlock": 238,
        "../components/AudioComponent": 239,
        "../components/FaceIdUnlockSequence": 240,
        "../components/HighKeyMono": 242,
        "../components/MapsCollection": 243,
        "../components/MediaButton": 244,
        "../components/NewMap": 245,
        "../components/ProgressiveImage": 246,
        "../components/SiriVoice": 247,
        "../components/Tile": 248,
        "../components/VideoTile": 249,
        "../components/VideoViewportSource": 250,
        "../components/hero/HeroAnimation": 253
    }]
}, {}, [254]);
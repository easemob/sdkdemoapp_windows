(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["easemob-emedia"] = factory();
	else
		root["easemob-emedia"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/Users/DATA/WORK.HOME/projects/CO./EASEMOB_2016.05.03~/EMedia";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

var adapter;

if (!!document.documentMode) {
    // Detect IE (6-11)
    var hasMatch = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [];

    var webrtcDetectedBrowser = 'IE';
    var webrtcDetectedVersion = parseInt(hasMatch[1], 10);
    var webrtcMinimumVersion = 9;
    var webrtcDetectedType = 'plugin';
    var webrtcDetectedDCSupport = 'SCTP';

    if (!webrtcDetectedVersion) {
        hasMatch = /\bMSIE[ :]+(\d+)/g.exec(navigator.userAgent) || [];

        webrtcDetectedVersion = parseInt(hasMatch[1] || '0', 10);
    }

    //adapter = require('./adapter.ie');
    logger.error("adapter.ie not required");

    adapter.__browser = webrtcDetectedBrowser;
    adapter.__browserVersion = webrtcDetectedVersion;

    //adapter = require('./Temasys.wrapper'); //6.0.3
} else {
    adapter = __webpack_require__(3); //6.2.0
    wrapAttachMediaStream();
}

adapter.__browser = adapter.__browser || adapter.browserDetails.browser; // firefox chrome safari
adapter.__browserVersion = adapter.__browserVersion || adapter.browserDetails.version;

console && typeof console.info === "function" && console.info("Current browser", adapter.__browser, adapter.__browserVersion);

if ("Not a supported browser." === adapter.__browser) {
    logger.error("Not a supported browser");
}

module.exports = adapter;

function wrapAttachMediaStream() {
    function _attachMediaStream(element, stream) {
        element.srcObject = stream;
    }

    /**
     * muted undefined, stream _located true 时muted
     *
     * @param element
     * @param stream
     * @param muted
     * @returns {*}
     */
    function easemobAttachMediaStream(element, stream, muted, _fun) {
        function mute() {
            muted = !!(muted === undefined ? stream._located : muted);

            //为了解决某些手机mute造成本地图像卡的问题
            element.muted = false;
            if (muted !== element.muted) {
                element.muted = true;
            }
        }

        _fun || (_fun = window.__attachMediaStream) || (_fun = _attachMediaStream);

        if (!element) {
            return;
        }

        if (!stream) {
            _fun(element, stream);
            return;
        }

        if (!element.srcObject) {
            mute();
            _fun(element, stream);
            return element;
        }

        if (element.srcObject._located //old stream 也是 _located
        && stream._located && element.srcObject.id === stream.id) {
            return element.srcObject;
        }

        mute();
        _fun(element, stream);

        return element;
    }

    if (window.attachMediaStream && window.attachMediaStream._wrapped !== true) {
        window.__attachMediaStream = window.attachMediaStream;
    }

    window.attachMediaStream = easemobAttachMediaStream;
    window.attachMediaStream._wrapped = true;
    console && typeof console.info === "function" && console.info("Wrap the attachMediaStream ", adapter.__browser, adapter.__browserVersion);
}

/***/ }),
/* 3 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

//6.2.0
(function (f) {
    if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
        module.exports = f();
    } else if (typeof define === "function" && define.amd) {
        define([], f);
    } else {
        var g;if (typeof window !== "undefined") {
            g = window;
        } else if (typeof global !== "undefined") {
            g = global;
        } else if (typeof self !== "undefined") {
            g = self;
        } else {
            g = this;
        }g.adapter = f();
    }
})(function () {
    var define, module, exports;return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }return n[o].exports;
        }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    }({ 1: [function (require, module, exports) {
            /*
             *  Version: 6.2.0
             *
             *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
             *
             *  Use of this source code is governed by a BSD-style license
             *  that can be found in the LICENSE file in the root of the source
             *  tree.
             */
            /* eslint-env node */
            'use strict';

            var SDPUtils = require('sdp');

            function fixStatsType(stat) {
                return {
                    inboundrtp: 'inbound-rtp',
                    outboundrtp: 'outbound-rtp',
                    candidatepair: 'candidate-pair',
                    localcandidate: 'local-candidate',
                    remotecandidate: 'remote-candidate'
                }[stat.type] || stat.type;
            }

            function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
                var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

                // Map ICE parameters (ufrag, pwd) to SDP.
                sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());

                // Map DTLS parameters to SDP.
                sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : dtlsRole || 'active');

                sdp += 'a=mid:' + transceiver.mid + '\r\n';

                if (transceiver.rtpSender && transceiver.rtpReceiver) {
                    sdp += 'a=sendrecv\r\n';
                } else if (transceiver.rtpSender) {
                    sdp += 'a=sendonly\r\n';
                } else if (transceiver.rtpReceiver) {
                    sdp += 'a=recvonly\r\n';
                } else {
                    sdp += 'a=inactive\r\n';
                }

                if (transceiver.rtpSender) {
                    var trackId = transceiver.rtpSender._initialTrackId || transceiver.rtpSender.track.id;
                    transceiver.rtpSender._initialTrackId = trackId;
                    // spec.
                    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' + trackId + '\r\n';
                    sdp += 'a=' + msid;
                    // for Chrome. Legacy should no longer be required.
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid;

                    // RTX
                    if (transceiver.sendEncodingParameters[0].rtx) {
                        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' ' + msid;
                        sdp += 'a=ssrc-group:FID ' + transceiver.sendEncodingParameters[0].ssrc + ' ' + transceiver.sendEncodingParameters[0].rtx.ssrc + '\r\n';
                    }
                }
                // FIXME: this should be written by writeRtpDescription.
                sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
                if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
                }
                return sdp;
            }

            // Edge does not like
            // 1) stun: filtered after 14393 unless ?transport=udp is present
            // 2) turn: that does not have all of turn:host:port?transport=udp
            // 3) turn: with ipv6 addresses
            // 4) turn: occurring muliple times
            function filterIceServers(iceServers, edgeVersion) {
                var hasTurn = false;
                iceServers = JSON.parse(JSON.stringify(iceServers));
                return iceServers.filter(function (server) {
                    if (server && (server.urls || server.url)) {
                        var urls = server.urls || server.url;
                        if (server.url && !server.urls) {
                            console.warn('RTCIceServer.url is deprecated! Use urls instead.');
                        }
                        var isString = typeof urls === 'string';
                        if (isString) {
                            urls = [urls];
                        }
                        urls = urls.filter(function (url) {
                            var validTurn = url.indexOf('turn:') === 0 && url.indexOf('transport=udp') !== -1 && url.indexOf('turn:[') === -1 && !hasTurn;

                            if (validTurn) {
                                hasTurn = true;
                                return true;
                            }
                            return url.indexOf('stun:') === 0 && edgeVersion >= 14393 && url.indexOf('?transport=udp') === -1;
                        });

                        delete server.url;
                        server.urls = isString ? urls[0] : urls;
                        return !!urls.length;
                    }
                });
            }

            // Determines the intersection of local and remote capabilities.
            function getCommonCapabilities(localCapabilities, remoteCapabilities) {
                var commonCapabilities = {
                    codecs: [],
                    headerExtensions: [],
                    fecMechanisms: []
                };

                var findCodecByPayloadType = function findCodecByPayloadType(pt, codecs) {
                    pt = parseInt(pt, 10);
                    for (var i = 0; i < codecs.length; i++) {
                        if (codecs[i].payloadType === pt || codecs[i].preferredPayloadType === pt) {
                            return codecs[i];
                        }
                    }
                };

                var rtxCapabilityMatches = function rtxCapabilityMatches(lRtx, rRtx, lCodecs, rCodecs) {
                    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
                    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
                    return lCodec && rCodec && lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
                };

                localCapabilities.codecs.forEach(function (lCodec) {
                    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
                        var rCodec = remoteCapabilities.codecs[i];
                        if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() && lCodec.clockRate === rCodec.clockRate) {
                            if (lCodec.name.toLowerCase() === 'rtx' && lCodec.parameters && rCodec.parameters.apt) {
                                // for RTX we need to find the local rtx that has a apt
                                // which points to the same local codec as the remote one.
                                if (!rtxCapabilityMatches(lCodec, rCodec, localCapabilities.codecs, remoteCapabilities.codecs)) {
                                    continue;
                                }
                            }
                            rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
                            // number of channels is the highest common number of channels
                            rCodec.numChannels = Math.min(lCodec.numChannels, rCodec.numChannels);
                            // push rCodec so we reply with offerer payload type
                            commonCapabilities.codecs.push(rCodec);

                            // determine common feedback mechanisms
                            rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function (fb) {
                                for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                                    if (lCodec.rtcpFeedback[j].type === fb.type && lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                                        return true;
                                    }
                                }
                                return false;
                            });
                            // FIXME: also need to determine .parameters
                            //  see https://github.com/openpeer/ortc/issues/569
                            break;
                        }
                    }
                });

                localCapabilities.headerExtensions.forEach(function (lHeaderExtension) {
                    for (var i = 0; i < remoteCapabilities.headerExtensions.length; i++) {
                        var rHeaderExtension = remoteCapabilities.headerExtensions[i];
                        if (lHeaderExtension.uri === rHeaderExtension.uri) {
                            commonCapabilities.headerExtensions.push(rHeaderExtension);
                            break;
                        }
                    }
                });

                // FIXME: fecMechanisms
                return commonCapabilities;
            }

            // is action=setLocalDescription with type allowed in signalingState
            function isActionAllowedInSignalingState(action, type, signalingState) {
                return {
                    offer: {
                        setLocalDescription: ['stable', 'have-local-offer'],
                        setRemoteDescription: ['stable', 'have-remote-offer']
                    },
                    answer: {
                        setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
                        setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
                    }
                }[type][action].indexOf(signalingState) !== -1;
            }

            function maybeAddCandidate(iceTransport, candidate) {
                // Edge's internal representation adds some fields therefore
                // not all fieldѕ are taken into account.
                var alreadyAdded = iceTransport.getRemoteCandidates().find(function (remoteCandidate) {
                    return candidate.foundation === remoteCandidate.foundation && candidate.ip === remoteCandidate.ip && candidate.port === remoteCandidate.port && candidate.priority === remoteCandidate.priority && candidate.protocol === remoteCandidate.protocol && candidate.type === remoteCandidate.type;
                });
                if (!alreadyAdded) {
                    iceTransport.addRemoteCandidate(candidate);
                }
                return !alreadyAdded;
            }

            function makeError(name, description) {
                var e = new Error(description);
                e.name = name;
                // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
                e.code = {
                    NotSupportedError: 9,
                    InvalidStateError: 11,
                    InvalidAccessError: 15,
                    TypeError: undefined,
                    OperationError: undefined
                }[name];
                return e;
            }

            module.exports = function (window, edgeVersion) {
                // https://w3c.github.io/mediacapture-main/#mediastream
                // Helper function to add the track to the stream and
                // dispatch the event ourselves.
                function addTrackToStreamAndFireEvent(track, stream) {
                    stream.addTrack(track);
                    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack', { track: track }));
                }

                function removeTrackFromStreamAndFireEvent(track, stream) {
                    stream.removeTrack(track);
                    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack', { track: track }));
                }

                function fireAddTrack(pc, track, receiver, streams) {
                    var trackEvent = new Event('track');
                    trackEvent.track = track;
                    trackEvent.receiver = receiver;
                    trackEvent.transceiver = { receiver: receiver };
                    trackEvent.streams = streams;
                    window.setTimeout(function () {
                        pc._dispatchEvent('track', trackEvent);
                    });
                }

                var RTCPeerConnection = function RTCPeerConnection(config) {
                    var pc = this;

                    var _eventTarget = document.createDocumentFragment();
                    ['addEventListener', 'removeEventListener', 'dispatchEvent'].forEach(function (method) {
                        pc[method] = _eventTarget[method].bind(_eventTarget);
                    });

                    this.canTrickleIceCandidates = null;

                    this.needNegotiation = false;

                    this.localStreams = [];
                    this.remoteStreams = [];

                    this.localDescription = null;
                    this.remoteDescription = null;

                    this.signalingState = 'stable';
                    this.iceConnectionState = 'new';
                    this.connectionState = 'new';
                    this.iceGatheringState = 'new';

                    config = JSON.parse(JSON.stringify(config || {}));

                    this.usingBundle = config.bundlePolicy === 'max-bundle';
                    if (config.rtcpMuxPolicy === 'negotiate') {
                        throw makeError('NotSupportedError', 'rtcpMuxPolicy \'negotiate\' is not supported');
                    } else if (!config.rtcpMuxPolicy) {
                        config.rtcpMuxPolicy = 'require';
                    }

                    switch (config.iceTransportPolicy) {
                        case 'all':
                        case 'relay':
                            break;
                        default:
                            config.iceTransportPolicy = 'all';
                            break;
                    }

                    switch (config.bundlePolicy) {
                        case 'balanced':
                        case 'max-compat':
                        case 'max-bundle':
                            break;
                        default:
                            config.bundlePolicy = 'balanced';
                            break;
                    }

                    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

                    this._iceGatherers = [];
                    if (config.iceCandidatePoolSize) {
                        for (var i = config.iceCandidatePoolSize; i > 0; i--) {
                            this._iceGatherers.push(new window.RTCIceGatherer({
                                iceServers: config.iceServers,
                                gatherPolicy: config.iceTransportPolicy
                            }));
                        }
                    } else {
                        config.iceCandidatePoolSize = 0;
                    }

                    this._config = config;

                    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
                    // everything that is needed to describe a SDP m-line.
                    this.transceivers = [];

                    this._sdpSessionId = SDPUtils.generateSessionId();
                    this._sdpSessionVersion = 0;

                    this._dtlsRole = undefined; // role for a=setup to use in answers.

                    this._isClosed = false;
                };

                // set up event handlers on prototype
                RTCPeerConnection.prototype.onicecandidate = null;
                RTCPeerConnection.prototype.onaddstream = null;
                RTCPeerConnection.prototype.ontrack = null;
                RTCPeerConnection.prototype.onremovestream = null;
                RTCPeerConnection.prototype.onsignalingstatechange = null;
                RTCPeerConnection.prototype.oniceconnectionstatechange = null;
                RTCPeerConnection.prototype.onconnectionstatechange = null;
                RTCPeerConnection.prototype.onicegatheringstatechange = null;
                RTCPeerConnection.prototype.onnegotiationneeded = null;
                RTCPeerConnection.prototype.ondatachannel = null;

                RTCPeerConnection.prototype._dispatchEvent = function (name, event) {
                    if (this._isClosed) {
                        return;
                    }
                    this.dispatchEvent(event);
                    if (typeof this['on' + name] === 'function') {
                        this['on' + name](event);
                    }
                };

                RTCPeerConnection.prototype._emitGatheringStateChange = function () {
                    var event = new Event('icegatheringstatechange');
                    this._dispatchEvent('icegatheringstatechange', event);
                };

                RTCPeerConnection.prototype.getConfiguration = function () {
                    return this._config;
                };

                RTCPeerConnection.prototype.getLocalStreams = function () {
                    return this.localStreams;
                };

                RTCPeerConnection.prototype.getRemoteStreams = function () {
                    return this.remoteStreams;
                };

                // internal helper to create a transceiver object.
                // (which is not yet the same as the WebRTC 1.0 transceiver)
                RTCPeerConnection.prototype._createTransceiver = function (kind, doNotAdd) {
                    var hasBundleTransport = this.transceivers.length > 0;
                    var transceiver = {
                        track: null,
                        iceGatherer: null,
                        iceTransport: null,
                        dtlsTransport: null,
                        localCapabilities: null,
                        remoteCapabilities: null,
                        rtpSender: null,
                        rtpReceiver: null,
                        kind: kind,
                        mid: null,
                        sendEncodingParameters: null,
                        recvEncodingParameters: null,
                        stream: null,
                        associatedRemoteMediaStreams: [],
                        wantReceive: true
                    };
                    if (this.usingBundle && hasBundleTransport) {
                        transceiver.iceTransport = this.transceivers[0].iceTransport;
                        transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
                    } else {
                        var transports = this._createIceAndDtlsTransports();
                        transceiver.iceTransport = transports.iceTransport;
                        transceiver.dtlsTransport = transports.dtlsTransport;
                    }
                    if (!doNotAdd) {
                        this.transceivers.push(transceiver);
                    }
                    return transceiver;
                };

                RTCPeerConnection.prototype.addTrack = function (track, stream) {
                    if (this._isClosed) {
                        throw makeError('InvalidStateError', 'Attempted to call addTrack on a closed peerconnection.');
                    }

                    var alreadyExists = this.transceivers.find(function (s) {
                        return s.track === track;
                    });

                    if (alreadyExists) {
                        throw makeError('InvalidAccessError', 'Track already exists.');
                    }

                    var transceiver;
                    for (var i = 0; i < this.transceivers.length; i++) {
                        if (!this.transceivers[i].track && this.transceivers[i].kind === track.kind) {
                            transceiver = this.transceivers[i];
                        }
                    }
                    if (!transceiver) {
                        transceiver = this._createTransceiver(track.kind);
                    }

                    this._maybeFireNegotiationNeeded();

                    if (this.localStreams.indexOf(stream) === -1) {
                        this.localStreams.push(stream);
                    }

                    transceiver.track = track;
                    transceiver.stream = stream;
                    transceiver.rtpSender = new window.RTCRtpSender(track, transceiver.dtlsTransport);
                    return transceiver.rtpSender;
                };

                RTCPeerConnection.prototype.addStream = function (stream) {
                    var pc = this;
                    if (edgeVersion >= 15025) {
                        stream.getTracks().forEach(function (track) {
                            pc.addTrack(track, stream);
                        });
                    } else {
                        // Clone is necessary for local demos mostly, attaching directly
                        // to two different senders does not work (build 10547).
                        // Fixed in 15025 (or earlier)
                        var clonedStream = stream.clone();
                        stream.getTracks().forEach(function (track, idx) {
                            var clonedTrack = clonedStream.getTracks()[idx];
                            track.addEventListener('enabled', function (event) {
                                clonedTrack.enabled = event.enabled;
                            });
                        });
                        clonedStream.getTracks().forEach(function (track) {
                            pc.addTrack(track, clonedStream);
                        });
                    }
                };

                RTCPeerConnection.prototype.removeTrack = function (sender) {
                    if (this._isClosed) {
                        throw makeError('InvalidStateError', 'Attempted to call removeTrack on a closed peerconnection.');
                    }

                    if (!(sender instanceof window.RTCRtpSender)) {
                        throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.');
                    }

                    var transceiver = this.transceivers.find(function (t) {
                        return t.rtpSender === sender;
                    });

                    if (!transceiver) {
                        throw makeError('InvalidAccessError', 'Sender was not created by this connection.');
                    }
                    var stream = transceiver.stream;

                    transceiver.rtpSender.stop();
                    transceiver.rtpSender = null;
                    transceiver.track = null;
                    transceiver.stream = null;

                    // remove the stream from the set of local streams
                    var localStreams = this.transceivers.map(function (t) {
                        return t.stream;
                    });
                    if (localStreams.indexOf(stream) === -1 && this.localStreams.indexOf(stream) > -1) {
                        this.localStreams.splice(this.localStreams.indexOf(stream), 1);
                    }

                    this._maybeFireNegotiationNeeded();
                };

                RTCPeerConnection.prototype.removeStream = function (stream) {
                    var pc = this;
                    stream.getTracks().forEach(function (track) {
                        var sender = pc.getSenders().find(function (s) {
                            return s.track === track;
                        });
                        if (sender) {
                            pc.removeTrack(sender);
                        }
                    });
                };

                RTCPeerConnection.prototype.getSenders = function () {
                    return this.transceivers.filter(function (transceiver) {
                        return !!transceiver.rtpSender;
                    }).map(function (transceiver) {
                        return transceiver.rtpSender;
                    });
                };

                RTCPeerConnection.prototype.getReceivers = function () {
                    return this.transceivers.filter(function (transceiver) {
                        return !!transceiver.rtpReceiver;
                    }).map(function (transceiver) {
                        return transceiver.rtpReceiver;
                    });
                };

                RTCPeerConnection.prototype._createIceGatherer = function (sdpMLineIndex, usingBundle) {
                    var pc = this;
                    if (usingBundle && sdpMLineIndex > 0) {
                        return this.transceivers[0].iceGatherer;
                    } else if (this._iceGatherers.length) {
                        return this._iceGatherers.shift();
                    }
                    var iceGatherer = new window.RTCIceGatherer({
                        iceServers: this._config.iceServers,
                        gatherPolicy: this._config.iceTransportPolicy
                    });
                    Object.defineProperty(iceGatherer, 'state', { value: 'new', writable: true });

                    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
                    this.transceivers[sdpMLineIndex].bufferCandidates = function (event) {
                        var end = !event.candidate || Object.keys(event.candidate).length === 0;
                        // polyfill since RTCIceGatherer.state is not implemented in
                        // Edge 10547 yet.
                        iceGatherer.state = end ? 'completed' : 'gathering';
                        if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
                            pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
                        }
                    };
                    iceGatherer.addEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);
                    return iceGatherer;
                };

                // start gathering from an RTCIceGatherer.
                RTCPeerConnection.prototype._gather = function (mid, sdpMLineIndex) {
                    var pc = this;
                    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
                    if (iceGatherer.onlocalcandidate) {
                        return;
                    }
                    var bufferedCandidateEvents = this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
                    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
                    iceGatherer.removeEventListener('localcandidate', this.transceivers[sdpMLineIndex].bufferCandidates);
                    iceGatherer.onlocalcandidate = function (evt) {
                        if (pc.usingBundle && sdpMLineIndex > 0) {
                            // if we know that we use bundle we can drop candidates with
                            // ѕdpMLineIndex > 0. If we don't do this then our state gets
                            // confused since we dispose the extra ice gatherer.
                            return;
                        }
                        var event = new Event('icecandidate');
                        event.candidate = { sdpMid: mid, sdpMLineIndex: sdpMLineIndex };

                        var cand = evt.candidate;
                        // Edge emits an empty object for RTCIceCandidateComplete‥
                        var end = !cand || Object.keys(cand).length === 0;
                        if (end) {
                            // polyfill since RTCIceGatherer.state is not implemented in
                            // Edge 10547 yet.
                            if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
                                iceGatherer.state = 'completed';
                            }
                        } else {
                            if (iceGatherer.state === 'new') {
                                iceGatherer.state = 'gathering';
                            }
                            // RTCIceCandidate doesn't have a component, needs to be added
                            cand.component = 1;
                            // also the usernameFragment. TODO: update SDP to take both variants.
                            cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

                            var serializedCandidate = SDPUtils.writeCandidate(cand);
                            event.candidate = Object.assign(event.candidate, SDPUtils.parseCandidate(serializedCandidate));

                            event.candidate.candidate = serializedCandidate;
                            event.candidate.toJSON = function () {
                                return {
                                    candidate: event.candidate.candidate,
                                    sdpMid: event.candidate.sdpMid,
                                    sdpMLineIndex: event.candidate.sdpMLineIndex,
                                    usernameFragment: event.candidate.usernameFragment
                                };
                            };
                        }

                        // update local description.
                        var sections = SDPUtils.getMediaSections(pc.localDescription.sdp);
                        if (!end) {
                            sections[event.candidate.sdpMLineIndex] += 'a=' + event.candidate.candidate + '\r\n';
                        } else {
                            sections[event.candidate.sdpMLineIndex] += 'a=end-of-candidates\r\n';
                        }
                        pc.localDescription.sdp = SDPUtils.getDescription(pc.localDescription.sdp) + sections.join('');
                        var complete = pc.transceivers.every(function (transceiver) {
                            return transceiver.iceGatherer && transceiver.iceGatherer.state === 'completed';
                        });

                        if (pc.iceGatheringState !== 'gathering') {
                            pc.iceGatheringState = 'gathering';
                            pc._emitGatheringStateChange();
                        }

                        // Emit candidate. Also emit null candidate when all gatherers are
                        // complete.
                        if (!end) {
                            pc._dispatchEvent('icecandidate', event);
                        }
                        if (complete) {
                            pc._dispatchEvent('icecandidate', new Event('icecandidate'));
                            pc.iceGatheringState = 'complete';
                            pc._emitGatheringStateChange();
                        }
                    };

                    // emit already gathered candidates.
                    window.setTimeout(function () {
                        bufferedCandidateEvents.forEach(function (e) {
                            iceGatherer.onlocalcandidate(e);
                        });
                    }, 0);
                };

                // Create ICE transport and DTLS transport.
                RTCPeerConnection.prototype._createIceAndDtlsTransports = function () {
                    var pc = this;
                    var iceTransport = new window.RTCIceTransport(null);
                    iceTransport.onicestatechange = function () {
                        pc._updateIceConnectionState();
                        pc._updateConnectionState();
                    };

                    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
                    dtlsTransport.ondtlsstatechange = function () {
                        pc._updateConnectionState();
                    };
                    dtlsTransport.onerror = function () {
                        // onerror does not set state to failed by itself.
                        Object.defineProperty(dtlsTransport, 'state', { value: 'failed', writable: true });
                        pc._updateConnectionState();
                    };

                    return {
                        iceTransport: iceTransport,
                        dtlsTransport: dtlsTransport
                    };
                };

                // Destroy ICE gatherer, ICE transport and DTLS transport.
                // Without triggering the callbacks.
                RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function (sdpMLineIndex) {
                    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
                    if (iceGatherer) {
                        delete iceGatherer.onlocalcandidate;
                        delete this.transceivers[sdpMLineIndex].iceGatherer;
                    }
                    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
                    if (iceTransport) {
                        delete iceTransport.onicestatechange;
                        delete this.transceivers[sdpMLineIndex].iceTransport;
                    }
                    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
                    if (dtlsTransport) {
                        delete dtlsTransport.ondtlsstatechange;
                        delete dtlsTransport.onerror;
                        delete this.transceivers[sdpMLineIndex].dtlsTransport;
                    }
                };

                // Start the RTP Sender and Receiver for a transceiver.
                RTCPeerConnection.prototype._transceive = function (transceiver, send, recv) {
                    var params = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);
                    if (send && transceiver.rtpSender) {
                        params.encodings = transceiver.sendEncodingParameters;
                        params.rtcp = {
                            cname: SDPUtils.localCName,
                            compound: transceiver.rtcpParameters.compound
                        };
                        if (transceiver.recvEncodingParameters.length) {
                            params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
                        }
                        transceiver.rtpSender.send(params);
                    }
                    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
                        // remove RTX field in Edge 14942
                        if (transceiver.kind === 'video' && transceiver.recvEncodingParameters && edgeVersion < 15019) {
                            transceiver.recvEncodingParameters.forEach(function (p) {
                                delete p.rtx;
                            });
                        }
                        if (transceiver.recvEncodingParameters.length) {
                            params.encodings = transceiver.recvEncodingParameters;
                        } else {
                            params.encodings = [{}];
                        }
                        params.rtcp = {
                            compound: transceiver.rtcpParameters.compound
                        };
                        if (transceiver.rtcpParameters.cname) {
                            params.rtcp.cname = transceiver.rtcpParameters.cname;
                        }
                        if (transceiver.sendEncodingParameters.length) {
                            params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
                        }
                        transceiver.rtpReceiver.receive(params);
                    }
                };

                RTCPeerConnection.prototype.setLocalDescription = function (description) {
                    var pc = this;

                    // Note: pranswer is not supported.
                    if (['offer', 'answer'].indexOf(description.type) === -1) {
                        return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
                    }

                    if (!isActionAllowedInSignalingState('setLocalDescription', description.type, pc.signalingState) || pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not set local ' + description.type + ' in state ' + pc.signalingState));
                    }

                    var sections;
                    var sessionpart;
                    if (description.type === 'offer') {
                        // VERY limited support for SDP munging. Limited to:
                        // * changing the order of codecs
                        sections = SDPUtils.splitSections(description.sdp);
                        sessionpart = sections.shift();
                        sections.forEach(function (mediaSection, sdpMLineIndex) {
                            var caps = SDPUtils.parseRtpParameters(mediaSection);
                            pc.transceivers[sdpMLineIndex].localCapabilities = caps;
                        });

                        pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
                            pc._gather(transceiver.mid, sdpMLineIndex);
                        });
                    } else if (description.type === 'answer') {
                        sections = SDPUtils.splitSections(pc.remoteDescription.sdp);
                        sessionpart = sections.shift();
                        var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
                        sections.forEach(function (mediaSection, sdpMLineIndex) {
                            var transceiver = pc.transceivers[sdpMLineIndex];
                            var iceGatherer = transceiver.iceGatherer;
                            var iceTransport = transceiver.iceTransport;
                            var dtlsTransport = transceiver.dtlsTransport;
                            var localCapabilities = transceiver.localCapabilities;
                            var remoteCapabilities = transceiver.remoteCapabilities;

                            // treat bundle-only as not-rejected.
                            var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

                            if (!rejected && !transceiver.rejected) {
                                var remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                                var remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
                                if (isIceLite) {
                                    remoteDtlsParameters.role = 'server';
                                }

                                if (!pc.usingBundle || sdpMLineIndex === 0) {
                                    pc._gather(transceiver.mid, sdpMLineIndex);
                                    if (iceTransport.state === 'new') {
                                        iceTransport.start(iceGatherer, remoteIceParameters, isIceLite ? 'controlling' : 'controlled');
                                    }
                                    if (dtlsTransport.state === 'new') {
                                        dtlsTransport.start(remoteDtlsParameters);
                                    }
                                }

                                // Calculate intersection of capabilities.
                                var params = getCommonCapabilities(localCapabilities, remoteCapabilities);

                                // Start the RTCRtpSender. The RTCRtpReceiver for this
                                // transceiver has already been started in setRemoteDescription.
                                pc._transceive(transceiver, params.codecs.length > 0, false);
                            }
                        });
                    }

                    pc.localDescription = {
                        type: description.type,
                        sdp: description.sdp
                    };
                    if (description.type === 'offer') {
                        pc._updateSignalingState('have-local-offer');
                    } else {
                        pc._updateSignalingState('stable');
                    }

                    return Promise.resolve();
                };

                RTCPeerConnection.prototype.setRemoteDescription = function (description) {
                    var pc = this;

                    // Note: pranswer is not supported.
                    if (['offer', 'answer'].indexOf(description.type) === -1) {
                        return Promise.reject(makeError('TypeError', 'Unsupported type "' + description.type + '"'));
                    }

                    if (!isActionAllowedInSignalingState('setRemoteDescription', description.type, pc.signalingState) || pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not set remote ' + description.type + ' in state ' + pc.signalingState));
                    }

                    var streams = {};
                    pc.remoteStreams.forEach(function (stream) {
                        streams[stream.id] = stream;
                    });
                    var receiverList = [];
                    var sections = SDPUtils.splitSections(description.sdp);
                    var sessionpart = sections.shift();
                    var isIceLite = SDPUtils.matchPrefix(sessionpart, 'a=ice-lite').length > 0;
                    var usingBundle = SDPUtils.matchPrefix(sessionpart, 'a=group:BUNDLE ').length > 0;
                    pc.usingBundle = usingBundle;
                    var iceOptions = SDPUtils.matchPrefix(sessionpart, 'a=ice-options:')[0];
                    if (iceOptions) {
                        pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ').indexOf('trickle') >= 0;
                    } else {
                        pc.canTrickleIceCandidates = false;
                    }

                    sections.forEach(function (mediaSection, sdpMLineIndex) {
                        var lines = SDPUtils.splitLines(mediaSection);
                        var kind = SDPUtils.getKind(mediaSection);
                        // treat bundle-only as not-rejected.
                        var rejected = SDPUtils.isRejected(mediaSection) && SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
                        var protocol = lines[0].substr(2).split(' ')[2];

                        var direction = SDPUtils.getDirection(mediaSection, sessionpart);
                        var remoteMsid = SDPUtils.parseMsid(mediaSection);

                        var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

                        // Reject datachannels which are not implemented yet.
                        if (kind === 'application' && protocol === 'DTLS/SCTP' || rejected) {
                            // TODO: this is dangerous in the case where a non-rejected m-line
                            //     becomes rejected.
                            pc.transceivers[sdpMLineIndex] = {
                                mid: mid,
                                kind: kind,
                                rejected: true
                            };
                            return;
                        }

                        if (!rejected && pc.transceivers[sdpMLineIndex] && pc.transceivers[sdpMLineIndex].rejected) {
                            // recycle a rejected transceiver.
                            pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
                        }

                        var transceiver;
                        var iceGatherer;
                        var iceTransport;
                        var dtlsTransport;
                        var rtpReceiver;
                        var sendEncodingParameters;
                        var recvEncodingParameters;
                        var localCapabilities;

                        var track;
                        // FIXME: ensure the mediaSection has rtcp-mux set.
                        var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
                        var remoteIceParameters;
                        var remoteDtlsParameters;
                        if (!rejected) {
                            remoteIceParameters = SDPUtils.getIceParameters(mediaSection, sessionpart);
                            remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection, sessionpart);
                            remoteDtlsParameters.role = 'client';
                        }
                        recvEncodingParameters = SDPUtils.parseRtpEncodingParameters(mediaSection);

                        var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

                        var isComplete = SDPUtils.matchPrefix(mediaSection, 'a=end-of-candidates', sessionpart).length > 0;
                        var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:').map(function (cand) {
                            return SDPUtils.parseCandidate(cand);
                        }).filter(function (cand) {
                            return cand.component === 1;
                        });

                        // Check if we can use BUNDLE and dispose transports.
                        if ((description.type === 'offer' || description.type === 'answer') && !rejected && usingBundle && sdpMLineIndex > 0 && pc.transceivers[sdpMLineIndex]) {
                            pc._disposeIceAndDtlsTransports(sdpMLineIndex);
                            pc.transceivers[sdpMLineIndex].iceGatherer = pc.transceivers[0].iceGatherer;
                            pc.transceivers[sdpMLineIndex].iceTransport = pc.transceivers[0].iceTransport;
                            pc.transceivers[sdpMLineIndex].dtlsTransport = pc.transceivers[0].dtlsTransport;
                            if (pc.transceivers[sdpMLineIndex].rtpSender) {
                                pc.transceivers[sdpMLineIndex].rtpSender.setTransport(pc.transceivers[0].dtlsTransport);
                            }
                            if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
                                pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(pc.transceivers[0].dtlsTransport);
                            }
                        }
                        if (description.type === 'offer' && !rejected) {
                            transceiver = pc.transceivers[sdpMLineIndex] || pc._createTransceiver(kind);
                            transceiver.mid = mid;

                            if (!transceiver.iceGatherer) {
                                transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, usingBundle);
                            }

                            if (cands.length && transceiver.iceTransport.state === 'new') {
                                if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                                    transceiver.iceTransport.setRemoteCandidates(cands);
                                } else {
                                    cands.forEach(function (candidate) {
                                        maybeAddCandidate(transceiver.iceTransport, candidate);
                                    });
                                }
                            }

                            localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

                            // filter RTX until additional stuff needed for RTX is implemented
                            // in adapter.js
                            if (edgeVersion < 15019) {
                                localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
                                    return codec.name !== 'rtx';
                                });
                            }

                            sendEncodingParameters = transceiver.sendEncodingParameters || [{
                                ssrc: (2 * sdpMLineIndex + 2) * 1001
                            }];

                            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
                            var isNewTrack = false;
                            if (direction === 'sendrecv' || direction === 'sendonly') {
                                isNewTrack = !transceiver.rtpReceiver;
                                rtpReceiver = transceiver.rtpReceiver || new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

                                if (isNewTrack) {
                                    var stream;
                                    track = rtpReceiver.track;
                                    // FIXME: does not work with Plan B.
                                    if (remoteMsid && remoteMsid.stream === '-') {
                                        // no-op. a stream id of '-' means: no associated stream.
                                    } else if (remoteMsid) {
                                        if (!streams[remoteMsid.stream]) {
                                            streams[remoteMsid.stream] = new window.MediaStream();
                                            Object.defineProperty(streams[remoteMsid.stream], 'id', {
                                                get: function get() {
                                                    return remoteMsid.stream;
                                                }
                                            });
                                        }
                                        Object.defineProperty(track, 'id', {
                                            get: function get() {
                                                return remoteMsid.track;
                                            }
                                        });
                                        stream = streams[remoteMsid.stream];
                                    } else {
                                        if (!streams.default) {
                                            streams.default = new window.MediaStream();
                                        }
                                        stream = streams.default;
                                    }
                                    if (stream) {
                                        addTrackToStreamAndFireEvent(track, stream);
                                        transceiver.associatedRemoteMediaStreams.push(stream);
                                    }
                                    receiverList.push([track, rtpReceiver, stream]);
                                }
                            } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
                                transceiver.associatedRemoteMediaStreams.forEach(function (s) {
                                    var nativeTrack = s.getTracks().find(function (t) {
                                        return t.id === transceiver.rtpReceiver.track.id;
                                    });
                                    if (nativeTrack) {
                                        removeTrackFromStreamAndFireEvent(nativeTrack, s);
                                    }
                                });
                                transceiver.associatedRemoteMediaStreams = [];
                            }

                            transceiver.localCapabilities = localCapabilities;
                            transceiver.remoteCapabilities = remoteCapabilities;
                            transceiver.rtpReceiver = rtpReceiver;
                            transceiver.rtcpParameters = rtcpParameters;
                            transceiver.sendEncodingParameters = sendEncodingParameters;
                            transceiver.recvEncodingParameters = recvEncodingParameters;

                            // Start the RTCRtpReceiver now. The RTPSender is started in
                            // setLocalDescription.
                            pc._transceive(pc.transceivers[sdpMLineIndex], false, isNewTrack);
                        } else if (description.type === 'answer' && !rejected) {
                            transceiver = pc.transceivers[sdpMLineIndex];
                            iceGatherer = transceiver.iceGatherer;
                            iceTransport = transceiver.iceTransport;
                            dtlsTransport = transceiver.dtlsTransport;
                            rtpReceiver = transceiver.rtpReceiver;
                            sendEncodingParameters = transceiver.sendEncodingParameters;
                            localCapabilities = transceiver.localCapabilities;

                            pc.transceivers[sdpMLineIndex].recvEncodingParameters = recvEncodingParameters;
                            pc.transceivers[sdpMLineIndex].remoteCapabilities = remoteCapabilities;
                            pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

                            if (cands.length && iceTransport.state === 'new') {
                                if ((isIceLite || isComplete) && (!usingBundle || sdpMLineIndex === 0)) {
                                    iceTransport.setRemoteCandidates(cands);
                                } else {
                                    cands.forEach(function (candidate) {
                                        maybeAddCandidate(transceiver.iceTransport, candidate);
                                    });
                                }
                            }

                            if (!usingBundle || sdpMLineIndex === 0) {
                                if (iceTransport.state === 'new') {
                                    iceTransport.start(iceGatherer, remoteIceParameters, 'controlling');
                                }
                                if (dtlsTransport.state === 'new') {
                                    dtlsTransport.start(remoteDtlsParameters);
                                }
                            }

                            pc._transceive(transceiver, direction === 'sendrecv' || direction === 'recvonly', direction === 'sendrecv' || direction === 'sendonly');

                            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
                            if (rtpReceiver && (direction === 'sendrecv' || direction === 'sendonly')) {
                                track = rtpReceiver.track;
                                if (remoteMsid) {
                                    if (!streams[remoteMsid.stream]) {
                                        streams[remoteMsid.stream] = new window.MediaStream();
                                    }
                                    addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
                                    receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
                                } else {
                                    if (!streams.default) {
                                        streams.default = new window.MediaStream();
                                    }
                                    addTrackToStreamAndFireEvent(track, streams.default);
                                    receiverList.push([track, rtpReceiver, streams.default]);
                                }
                            } else {
                                // FIXME: actually the receiver should be created later.
                                delete transceiver.rtpReceiver;
                            }
                        }
                    });

                    if (pc._dtlsRole === undefined) {
                        pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
                    }

                    pc.remoteDescription = {
                        type: description.type,
                        sdp: description.sdp
                    };
                    if (description.type === 'offer') {
                        pc._updateSignalingState('have-remote-offer');
                    } else {
                        pc._updateSignalingState('stable');
                    }
                    Object.keys(streams).forEach(function (sid) {
                        var stream = streams[sid];
                        if (stream.getTracks().length) {
                            if (pc.remoteStreams.indexOf(stream) === -1) {
                                pc.remoteStreams.push(stream);
                                var event = new Event('addstream');
                                event.stream = stream;
                                window.setTimeout(function () {
                                    pc._dispatchEvent('addstream', event);
                                });
                            }

                            receiverList.forEach(function (item) {
                                var track = item[0];
                                var receiver = item[1];
                                if (stream.id !== item[2].id) {
                                    return;
                                }
                                fireAddTrack(pc, track, receiver, [stream]);
                            });
                        }
                    });
                    receiverList.forEach(function (item) {
                        if (item[2]) {
                            return;
                        }
                        fireAddTrack(pc, item[0], item[1], []);
                    });

                    // check whether addIceCandidate({}) was called within four seconds after
                    // setRemoteDescription.
                    window.setTimeout(function () {
                        if (!(pc && pc.transceivers)) {
                            return;
                        }
                        pc.transceivers.forEach(function (transceiver) {
                            if (transceiver.iceTransport && transceiver.iceTransport.state === 'new' && transceiver.iceTransport.getRemoteCandidates().length > 0) {
                                console.warn('Timeout for addRemoteCandidate. Consider sending ' + 'an end-of-candidates notification');
                                transceiver.iceTransport.addRemoteCandidate({});
                            }
                        });
                    }, 4000);

                    return Promise.resolve();
                };

                RTCPeerConnection.prototype.close = function () {
                    this.transceivers.forEach(function (transceiver) {
                        /* not yet
                        if (transceiver.iceGatherer) {
                        transceiver.iceGatherer.close();
                        }
                        */
                        if (transceiver.iceTransport) {
                            transceiver.iceTransport.stop();
                        }
                        if (transceiver.dtlsTransport) {
                            transceiver.dtlsTransport.stop();
                        }
                        if (transceiver.rtpSender) {
                            transceiver.rtpSender.stop();
                        }
                        if (transceiver.rtpReceiver) {
                            transceiver.rtpReceiver.stop();
                        }
                    });
                    // FIXME: clean up tracks, local streams, remote streams, etc
                    this._isClosed = true;
                    this._updateSignalingState('closed');
                };

                // Update the signaling state.
                RTCPeerConnection.prototype._updateSignalingState = function (newState) {
                    this.signalingState = newState;
                    var event = new Event('signalingstatechange');
                    this._dispatchEvent('signalingstatechange', event);
                };

                // Determine whether to fire the negotiationneeded event.
                RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function () {
                    var pc = this;
                    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
                        return;
                    }
                    this.needNegotiation = true;
                    window.setTimeout(function () {
                        if (pc.needNegotiation) {
                            pc.needNegotiation = false;
                            var event = new Event('negotiationneeded');
                            pc._dispatchEvent('negotiationneeded', event);
                        }
                    }, 0);
                };

                // Update the ice connection state.
                RTCPeerConnection.prototype._updateIceConnectionState = function () {
                    var newState;
                    var states = {
                        'new': 0,
                        closed: 0,
                        checking: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    this.transceivers.forEach(function (transceiver) {
                        states[transceiver.iceTransport.state]++;
                    });

                    newState = 'new';
                    if (states.failed > 0) {
                        newState = 'failed';
                    } else if (states.checking > 0) {
                        newState = 'checking';
                    } else if (states.disconnected > 0) {
                        newState = 'disconnected';
                    } else if (states.new > 0) {
                        newState = 'new';
                    } else if (states.connected > 0) {
                        newState = 'connected';
                    } else if (states.completed > 0) {
                        newState = 'completed';
                    }

                    if (newState !== this.iceConnectionState) {
                        this.iceConnectionState = newState;
                        var event = new Event('iceconnectionstatechange');
                        this._dispatchEvent('iceconnectionstatechange', event);
                    }
                };

                // Update the connection state.
                RTCPeerConnection.prototype._updateConnectionState = function () {
                    var newState;
                    var states = {
                        'new': 0,
                        closed: 0,
                        connecting: 0,
                        connected: 0,
                        completed: 0,
                        disconnected: 0,
                        failed: 0
                    };
                    this.transceivers.forEach(function (transceiver) {
                        states[transceiver.iceTransport.state]++;
                        states[transceiver.dtlsTransport.state]++;
                    });
                    // ICETransport.completed and connected are the same for this purpose.
                    states.connected += states.completed;

                    newState = 'new';
                    if (states.failed > 0) {
                        newState = 'failed';
                    } else if (states.connecting > 0) {
                        newState = 'connecting';
                    } else if (states.disconnected > 0) {
                        newState = 'disconnected';
                    } else if (states.new > 0) {
                        newState = 'new';
                    } else if (states.connected > 0) {
                        newState = 'connected';
                    }

                    if (newState !== this.connectionState) {
                        this.connectionState = newState;
                        var event = new Event('connectionstatechange');
                        this._dispatchEvent('connectionstatechange', event);
                    }
                };

                RTCPeerConnection.prototype.createOffer = function () {
                    var pc = this;

                    if (pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not call createOffer after close'));
                    }

                    var numAudioTracks = pc.transceivers.filter(function (t) {
                        return t.kind === 'audio';
                    }).length;
                    var numVideoTracks = pc.transceivers.filter(function (t) {
                        return t.kind === 'video';
                    }).length;

                    // Determine number of audio and video tracks we need to send/recv.
                    var offerOptions = arguments[0];
                    if (offerOptions) {
                        // Reject Chrome legacy constraints.
                        if (offerOptions.mandatory || offerOptions.optional) {
                            throw new TypeError('Legacy mandatory/optional constraints not supported.');
                        }
                        if (offerOptions.offerToReceiveAudio !== undefined) {
                            if (offerOptions.offerToReceiveAudio === true) {
                                numAudioTracks = 1;
                            } else if (offerOptions.offerToReceiveAudio === false) {
                                numAudioTracks = 0;
                            } else {
                                numAudioTracks = offerOptions.offerToReceiveAudio;
                            }
                        }
                        if (offerOptions.offerToReceiveVideo !== undefined) {
                            if (offerOptions.offerToReceiveVideo === true) {
                                numVideoTracks = 1;
                            } else if (offerOptions.offerToReceiveVideo === false) {
                                numVideoTracks = 0;
                            } else {
                                numVideoTracks = offerOptions.offerToReceiveVideo;
                            }
                        }
                    }

                    pc.transceivers.forEach(function (transceiver) {
                        if (transceiver.kind === 'audio') {
                            numAudioTracks--;
                            if (numAudioTracks < 0) {
                                transceiver.wantReceive = false;
                            }
                        } else if (transceiver.kind === 'video') {
                            numVideoTracks--;
                            if (numVideoTracks < 0) {
                                transceiver.wantReceive = false;
                            }
                        }
                    });

                    // Create M-lines for recvonly streams.
                    while (numAudioTracks > 0 || numVideoTracks > 0) {
                        if (numAudioTracks > 0) {
                            pc._createTransceiver('audio');
                            numAudioTracks--;
                        }
                        if (numVideoTracks > 0) {
                            pc._createTransceiver('video');
                            numVideoTracks--;
                        }
                    }

                    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
                    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
                        // For each track, create an ice gatherer, ice transport,
                        // dtls transport, potentially rtpsender and rtpreceiver.
                        var track = transceiver.track;
                        var kind = transceiver.kind;
                        var mid = transceiver.mid || SDPUtils.generateIdentifier();
                        transceiver.mid = mid;

                        if (!transceiver.iceGatherer) {
                            transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex, pc.usingBundle);
                        }

                        var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
                        // filter RTX until additional stuff needed for RTX is implemented
                        // in adapter.js
                        if (edgeVersion < 15019) {
                            localCapabilities.codecs = localCapabilities.codecs.filter(function (codec) {
                                return codec.name !== 'rtx';
                            });
                        }
                        localCapabilities.codecs.forEach(function (codec) {
                            // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
                            // by adding level-asymmetry-allowed=1
                            if (codec.name === 'H264' && codec.parameters['level-asymmetry-allowed'] === undefined) {
                                codec.parameters['level-asymmetry-allowed'] = '1';
                            }

                            // for subsequent offers, we might have to re-use the payload
                            // type of the last offer.
                            if (transceiver.remoteCapabilities && transceiver.remoteCapabilities.codecs) {
                                transceiver.remoteCapabilities.codecs.forEach(function (remoteCodec) {
                                    if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() && codec.clockRate === remoteCodec.clockRate) {
                                        codec.preferredPayloadType = remoteCodec.payloadType;
                                    }
                                });
                            }
                        });
                        localCapabilities.headerExtensions.forEach(function (hdrExt) {
                            var remoteExtensions = transceiver.remoteCapabilities && transceiver.remoteCapabilities.headerExtensions || [];
                            remoteExtensions.forEach(function (rHdrExt) {
                                if (hdrExt.uri === rHdrExt.uri) {
                                    hdrExt.id = rHdrExt.id;
                                }
                            });
                        });

                        // generate an ssrc now, to be used later in rtpSender.send
                        var sendEncodingParameters = transceiver.sendEncodingParameters || [{
                            ssrc: (2 * sdpMLineIndex + 1) * 1001
                        }];
                        if (track) {
                            // add RTX
                            if (edgeVersion >= 15019 && kind === 'video' && !sendEncodingParameters[0].rtx) {
                                sendEncodingParameters[0].rtx = {
                                    ssrc: sendEncodingParameters[0].ssrc + 1
                                };
                            }
                        }

                        if (transceiver.wantReceive) {
                            transceiver.rtpReceiver = new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);
                        }

                        transceiver.localCapabilities = localCapabilities;
                        transceiver.sendEncodingParameters = sendEncodingParameters;
                    });

                    // always offer BUNDLE and dispose on return if not supported.
                    if (pc._config.bundlePolicy !== 'max-compat') {
                        sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function (t) {
                            return t.mid;
                        }).join(' ') + '\r\n';
                    }
                    sdp += 'a=ice-options:trickle\r\n';

                    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
                        sdp += writeMediaSection(transceiver, transceiver.localCapabilities, 'offer', transceiver.stream, pc._dtlsRole);
                        sdp += 'a=rtcp-rsize\r\n';

                        if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' && (sdpMLineIndex === 0 || !pc.usingBundle)) {
                            transceiver.iceGatherer.getLocalCandidates().forEach(function (cand) {
                                cand.component = 1;
                                sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
                            });

                            if (transceiver.iceGatherer.state === 'completed') {
                                sdp += 'a=end-of-candidates\r\n';
                            }
                        }
                    });

                    var desc = new window.RTCSessionDescription({
                        type: 'offer',
                        sdp: sdp
                    });
                    return Promise.resolve(desc);
                };

                RTCPeerConnection.prototype.createAnswer = function () {
                    var pc = this;

                    if (pc._isClosed) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer after close'));
                    }

                    if (!(pc.signalingState === 'have-remote-offer' || pc.signalingState === 'have-local-pranswer')) {
                        return Promise.reject(makeError('InvalidStateError', 'Can not call createAnswer in signalingState ' + pc.signalingState));
                    }

                    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId, pc._sdpSessionVersion++);
                    if (pc.usingBundle) {
                        sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function (t) {
                            return t.mid;
                        }).join(' ') + '\r\n';
                    }
                    var mediaSectionsInOffer = SDPUtils.getMediaSections(pc.remoteDescription.sdp).length;
                    pc.transceivers.forEach(function (transceiver, sdpMLineIndex) {
                        if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
                            return;
                        }
                        if (transceiver.rejected) {
                            if (transceiver.kind === 'application') {
                                sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
                            } else if (transceiver.kind === 'audio') {
                                sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' + 'a=rtpmap:0 PCMU/8000\r\n';
                            } else if (transceiver.kind === 'video') {
                                sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' + 'a=rtpmap:120 VP8/90000\r\n';
                            }
                            sdp += 'c=IN IP4 0.0.0.0\r\n' + 'a=inactive\r\n' + 'a=mid:' + transceiver.mid + '\r\n';
                            return;
                        }

                        // FIXME: look at direction.
                        if (transceiver.stream) {
                            var localTrack;
                            if (transceiver.kind === 'audio') {
                                localTrack = transceiver.stream.getAudioTracks()[0];
                            } else if (transceiver.kind === 'video') {
                                localTrack = transceiver.stream.getVideoTracks()[0];
                            }
                            if (localTrack) {
                                // add RTX
                                if (edgeVersion >= 15019 && transceiver.kind === 'video' && !transceiver.sendEncodingParameters[0].rtx) {
                                    transceiver.sendEncodingParameters[0].rtx = {
                                        ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
                                    };
                                }
                            }
                        }

                        // Calculate intersection of capabilities.
                        var commonCapabilities = getCommonCapabilities(transceiver.localCapabilities, transceiver.remoteCapabilities);

                        var hasRtx = commonCapabilities.codecs.filter(function (c) {
                            return c.name.toLowerCase() === 'rtx';
                        }).length;
                        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
                            delete transceiver.sendEncodingParameters[0].rtx;
                        }

                        sdp += writeMediaSection(transceiver, commonCapabilities, 'answer', transceiver.stream, pc._dtlsRole);
                        if (transceiver.rtcpParameters && transceiver.rtcpParameters.reducedSize) {
                            sdp += 'a=rtcp-rsize\r\n';
                        }
                    });

                    var desc = new window.RTCSessionDescription({
                        type: 'answer',
                        sdp: sdp
                    });
                    return Promise.resolve(desc);
                };

                RTCPeerConnection.prototype.addIceCandidate = function (candidate) {
                    var pc = this;
                    var sections;
                    if (candidate && !(candidate.sdpMLineIndex !== undefined || candidate.sdpMid)) {
                        return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
                    }

                    // TODO: needs to go into ops queue.
                    return new Promise(function (resolve, reject) {
                        if (!pc.remoteDescription) {
                            return reject(makeError('InvalidStateError', 'Can not add ICE candidate without a remote description'));
                        } else if (!candidate || candidate.candidate === '') {
                            for (var j = 0; j < pc.transceivers.length; j++) {
                                if (pc.transceivers[j].rejected) {
                                    continue;
                                }
                                pc.transceivers[j].iceTransport.addRemoteCandidate({});
                                sections = SDPUtils.getMediaSections(pc.remoteDescription.sdp);
                                sections[j] += 'a=end-of-candidates\r\n';
                                pc.remoteDescription.sdp = SDPUtils.getDescription(pc.remoteDescription.sdp) + sections.join('');
                                if (pc.usingBundle) {
                                    break;
                                }
                            }
                        } else {
                            var sdpMLineIndex = candidate.sdpMLineIndex;
                            if (candidate.sdpMid) {
                                for (var i = 0; i < pc.transceivers.length; i++) {
                                    if (pc.transceivers[i].mid === candidate.sdpMid) {
                                        sdpMLineIndex = i;
                                        break;
                                    }
                                }
                            }
                            var transceiver = pc.transceivers[sdpMLineIndex];
                            if (transceiver) {
                                if (transceiver.rejected) {
                                    return resolve();
                                }
                                var cand = Object.keys(candidate.candidate).length > 0 ? SDPUtils.parseCandidate(candidate.candidate) : {};
                                // Ignore Chrome's invalid candidates since Edge does not like them.
                                if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
                                    return resolve();
                                }
                                // Ignore RTCP candidates, we assume RTCP-MUX.
                                if (cand.component && cand.component !== 1) {
                                    return resolve();
                                }
                                // when using bundle, avoid adding candidates to the wrong
                                // ice transport. And avoid adding candidates added in the SDP.
                                if (sdpMLineIndex === 0 || sdpMLineIndex > 0 && transceiver.iceTransport !== pc.transceivers[0].iceTransport) {
                                    if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                                        return reject(makeError('OperationError', 'Can not add ICE candidate'));
                                    }
                                }

                                // update the remoteDescription.
                                var candidateString = candidate.candidate.trim();
                                if (candidateString.indexOf('a=') === 0) {
                                    candidateString = candidateString.substr(2);
                                }
                                sections = SDPUtils.getMediaSections(pc.remoteDescription.sdp);
                                sections[sdpMLineIndex] += 'a=' + (cand.type ? candidateString : 'end-of-candidates') + '\r\n';
                                pc.remoteDescription.sdp = SDPUtils.getDescription(pc.remoteDescription.sdp) + sections.join('');
                            } else {
                                return reject(makeError('OperationError', 'Can not add ICE candidate'));
                            }
                        }
                        resolve();
                    });
                };

                RTCPeerConnection.prototype.getStats = function (selector) {
                    if (selector && selector instanceof window.MediaStreamTrack) {
                        var senderOrReceiver = null;
                        this.transceivers.forEach(function (transceiver) {
                            if (transceiver.rtpSender && transceiver.rtpSender.track === selector) {
                                senderOrReceiver = transceiver.rtpSender;
                            } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track === selector) {
                                senderOrReceiver = transceiver.rtpReceiver;
                            }
                        });
                        if (!senderOrReceiver) {
                            throw makeError('InvalidAccessError', 'Invalid selector.');
                        }
                        return senderOrReceiver.getStats();
                    }

                    var promises = [];
                    this.transceivers.forEach(function (transceiver) {
                        ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport', 'dtlsTransport'].forEach(function (method) {
                            if (transceiver[method]) {
                                promises.push(transceiver[method].getStats());
                            }
                        });
                    });
                    return Promise.all(promises).then(function (allStats) {
                        var results = new Map();
                        allStats.forEach(function (stats) {
                            stats.forEach(function (stat) {
                                results.set(stat.id, stat);
                            });
                        });
                        return results;
                    });
                };

                // fix low-level stat names and return Map instead of object.
                var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer', 'RTCIceTransport', 'RTCDtlsTransport'];
                ortcObjects.forEach(function (ortcObjectName) {
                    var obj = window[ortcObjectName];
                    if (obj && obj.prototype && obj.prototype.getStats) {
                        var nativeGetstats = obj.prototype.getStats;
                        obj.prototype.getStats = function () {
                            return nativeGetstats.apply(this).then(function (nativeStats) {
                                var mapStats = new Map();
                                Object.keys(nativeStats).forEach(function (id) {
                                    nativeStats[id].type = fixStatsType(nativeStats[id]);
                                    mapStats.set(id, nativeStats[id]);
                                });
                                return mapStats;
                            });
                        };
                    }
                });

                // legacy callback shims. Should be moved to adapter.js some days.
                var methods = ['createOffer', 'createAnswer'];
                methods.forEach(function (method) {
                    var nativeMethod = RTCPeerConnection.prototype[method];
                    RTCPeerConnection.prototype[method] = function () {
                        var args = arguments;
                        if (typeof args[0] === 'function' || typeof args[1] === 'function') {
                            // legacy
                            return nativeMethod.apply(this, [arguments[2]]).then(function (description) {
                                if (typeof args[0] === 'function') {
                                    args[0].apply(null, [description]);
                                }
                            }, function (error) {
                                if (typeof args[1] === 'function') {
                                    args[1].apply(null, [error]);
                                }
                            });
                        }
                        return nativeMethod.apply(this, arguments);
                    };
                });

                methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
                methods.forEach(function (method) {
                    var nativeMethod = RTCPeerConnection.prototype[method];
                    RTCPeerConnection.prototype[method] = function () {
                        var args = arguments;
                        if (typeof args[1] === 'function' || typeof args[2] === 'function') {
                            // legacy
                            return nativeMethod.apply(this, arguments).then(function () {
                                if (typeof args[1] === 'function') {
                                    args[1].apply(null);
                                }
                            }, function (error) {
                                if (typeof args[2] === 'function') {
                                    args[2].apply(null, [error]);
                                }
                            });
                        }
                        return nativeMethod.apply(this, arguments);
                    };
                });

                // getStats is special. It doesn't have a spec legacy method yet we support
                // getStats(something, cb) without error callbacks.
                ['getStats'].forEach(function (method) {
                    var nativeMethod = RTCPeerConnection.prototype[method];
                    RTCPeerConnection.prototype[method] = function () {
                        var args = arguments;
                        if (typeof args[1] === 'function') {
                            return nativeMethod.apply(this, arguments).then(function () {
                                if (typeof args[1] === 'function') {
                                    args[1].apply(null);
                                }
                            });
                        }
                        return nativeMethod.apply(this, arguments);
                    };
                });

                return RTCPeerConnection;
            };
        }, { "sdp": 2 }], 2: [function (require, module, exports) {
            /* eslint-env node */
            'use strict';

            // SDP helpers.

            var SDPUtils = {};

            // Generate an alphanumeric identifier for cname or mids.
            // TODO: use UUIDs instead? https://gist.github.com/jed/982883
            SDPUtils.generateIdentifier = function () {
                return Math.random().toString(36).substr(2, 10);
            };

            // The RTCP CNAME used by all peerconnections from the same JS.
            SDPUtils.localCName = SDPUtils.generateIdentifier();

            // Splits SDP into lines, dealing with both CRLF and LF.
            SDPUtils.splitLines = function (blob) {
                return blob.trim().split('\n').map(function (line) {
                    return line.trim();
                });
            };
            // Splits SDP into sessionpart and mediasections. Ensures CRLF.
            SDPUtils.splitSections = function (blob) {
                var parts = blob.split('\nm=');
                return parts.map(function (part, index) {
                    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
                });
            };

            // returns the session description.
            SDPUtils.getDescription = function (blob) {
                var sections = SDPUtils.splitSections(blob);
                return sections && sections[0];
            };

            // returns the individual media sections.
            SDPUtils.getMediaSections = function (blob) {
                var sections = SDPUtils.splitSections(blob);
                sections.shift();
                return sections;
            };

            // Returns lines that start with a certain prefix.
            SDPUtils.matchPrefix = function (blob, prefix) {
                return SDPUtils.splitLines(blob).filter(function (line) {
                    return line.indexOf(prefix) === 0;
                });
            };

            // Parses an ICE candidate line. Sample input:
            // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
            // rport 55996"
            SDPUtils.parseCandidate = function (line) {
                var parts;
                // Parse both variants.
                if (line.indexOf('a=candidate:') === 0) {
                    parts = line.substring(12).split(' ');
                } else {
                    parts = line.substring(10).split(' ');
                }

                var candidate = {
                    foundation: parts[0],
                    component: parseInt(parts[1], 10),
                    protocol: parts[2].toLowerCase(),
                    priority: parseInt(parts[3], 10),
                    ip: parts[4],
                    port: parseInt(parts[5], 10),
                    // skip parts[6] == 'typ'
                    type: parts[7]
                };

                for (var i = 8; i < parts.length; i += 2) {
                    switch (parts[i]) {
                        case 'raddr':
                            candidate.relatedAddress = parts[i + 1];
                            break;
                        case 'rport':
                            candidate.relatedPort = parseInt(parts[i + 1], 10);
                            break;
                        case 'tcptype':
                            candidate.tcpType = parts[i + 1];
                            break;
                        case 'ufrag':
                            candidate.ufrag = parts[i + 1]; // for backward compability.
                            candidate.usernameFragment = parts[i + 1];
                            break;
                        default:
                            // extension handling, in particular ufrag
                            candidate[parts[i]] = parts[i + 1];
                            break;
                    }
                }
                return candidate;
            };

            // Translates a candidate object into SDP candidate attribute.
            SDPUtils.writeCandidate = function (candidate) {
                var sdp = [];
                sdp.push(candidate.foundation);
                sdp.push(candidate.component);
                sdp.push(candidate.protocol.toUpperCase());
                sdp.push(candidate.priority);
                sdp.push(candidate.ip);
                sdp.push(candidate.port);

                var type = candidate.type;
                sdp.push('typ');
                sdp.push(type);
                if (type !== 'host' && candidate.relatedAddress && candidate.relatedPort) {
                    sdp.push('raddr');
                    sdp.push(candidate.relatedAddress);
                    sdp.push('rport');
                    sdp.push(candidate.relatedPort);
                }
                if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
                    sdp.push('tcptype');
                    sdp.push(candidate.tcpType);
                }
                if (candidate.usernameFragment || candidate.ufrag) {
                    sdp.push('ufrag');
                    sdp.push(candidate.usernameFragment || candidate.ufrag);
                }
                return 'candidate:' + sdp.join(' ');
            };

            // Parses an ice-options line, returns an array of option tags.
            // a=ice-options:foo bar
            SDPUtils.parseIceOptions = function (line) {
                return line.substr(14).split(' ');
            };

            // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
            // a=rtpmap:111 opus/48000/2
            SDPUtils.parseRtpMap = function (line) {
                var parts = line.substr(9).split(' ');
                var parsed = {
                    payloadType: parseInt(parts.shift(), 10) // was: id
                };

                parts = parts[0].split('/');

                parsed.name = parts[0];
                parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
                parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
                // legacy alias, got renamed back to channels in ORTC.
                parsed.numChannels = parsed.channels;
                return parsed;
            };

            // Generate an a=rtpmap line from RTCRtpCodecCapability or
            // RTCRtpCodecParameters.
            SDPUtils.writeRtpMap = function (codec) {
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType;
                }
                var channels = codec.channels || codec.numChannels || 1;
                return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate + (channels !== 1 ? '/' + channels : '') + '\r\n';
            };

            // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
            // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
            // a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
            SDPUtils.parseExtmap = function (line) {
                var parts = line.substr(9).split(' ');
                return {
                    id: parseInt(parts[0], 10),
                    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
                    uri: parts[1]
                };
            };

            // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
            // RTCRtpHeaderExtension.
            SDPUtils.writeExtmap = function (headerExtension) {
                return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) + (headerExtension.direction && headerExtension.direction !== 'sendrecv' ? '/' + headerExtension.direction : '') + ' ' + headerExtension.uri + '\r\n';
            };

            // Parses an ftmp line, returns dictionary. Sample input:
            // a=fmtp:96 vbr=on;cng=on
            // Also deals with vbr=on; cng=on
            SDPUtils.parseFmtp = function (line) {
                var parsed = {};
                var kv;
                var parts = line.substr(line.indexOf(' ') + 1).split(';');
                for (var j = 0; j < parts.length; j++) {
                    kv = parts[j].trim().split('=');
                    parsed[kv[0].trim()] = kv[1];
                }
                return parsed;
            };

            // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
            SDPUtils.writeFmtp = function (codec) {
                var line = '';
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType;
                }
                if (codec.parameters && Object.keys(codec.parameters).length) {
                    var params = [];
                    Object.keys(codec.parameters).forEach(function (param) {
                        if (codec.parameters[param]) {
                            params.push(param + '=' + codec.parameters[param]);
                        } else {
                            params.push(param);
                        }
                    });
                    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
                }
                return line;
            };

            // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
            // a=rtcp-fb:98 nack rpsi
            SDPUtils.parseRtcpFb = function (line) {
                var parts = line.substr(line.indexOf(' ') + 1).split(' ');
                return {
                    type: parts.shift(),
                    parameter: parts.join(' ')
                };
            };
            // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
            SDPUtils.writeRtcpFb = function (codec) {
                var lines = '';
                var pt = codec.payloadType;
                if (codec.preferredPayloadType !== undefined) {
                    pt = codec.preferredPayloadType;
                }
                if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
                    // FIXME: special handling for trr-int?
                    codec.rtcpFeedback.forEach(function (fb) {
                        lines += 'a=rtcp-fb:' + pt + ' ' + fb.type + (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') + '\r\n';
                    });
                }
                return lines;
            };

            // Parses an RFC 5576 ssrc media attribute. Sample input:
            // a=ssrc:3735928559 cname:something
            SDPUtils.parseSsrcMedia = function (line) {
                var sp = line.indexOf(' ');
                var parts = {
                    ssrc: parseInt(line.substr(7, sp - 7), 10)
                };
                var colon = line.indexOf(':', sp);
                if (colon > -1) {
                    parts.attribute = line.substr(sp + 1, colon - sp - 1);
                    parts.value = line.substr(colon + 1);
                } else {
                    parts.attribute = line.substr(sp + 1);
                }
                return parts;
            };

            // Extracts the MID (RFC 5888) from a media section.
            // returns the MID or undefined if no mid line was found.
            SDPUtils.getMid = function (mediaSection) {
                var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
                if (mid) {
                    return mid.substr(6);
                }
            };

            SDPUtils.parseFingerprint = function (line) {
                var parts = line.substr(14).split(' ');
                return {
                    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
                    value: parts[1]
                };
            };

            // Extracts DTLS parameters from SDP media section or sessionpart.
            // FIXME: for consistency with other functions this should only
            //   get the fingerprint line as input. See also getIceParameters.
            SDPUtils.getDtlsParameters = function (mediaSection, sessionpart) {
                var lines = SDPUtils.matchPrefix(mediaSection + sessionpart, 'a=fingerprint:');
                // Note: a=setup line is ignored since we use the 'auto' role.
                // Note2: 'algorithm' is not case sensitive except in Edge.
                return {
                    role: 'auto',
                    fingerprints: lines.map(SDPUtils.parseFingerprint)
                };
            };

            // Serializes DTLS parameters to SDP.
            SDPUtils.writeDtlsParameters = function (params, setupType) {
                var sdp = 'a=setup:' + setupType + '\r\n';
                params.fingerprints.forEach(function (fp) {
                    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
                });
                return sdp;
            };
            // Parses ICE information from SDP media section or sessionpart.
            // FIXME: for consistency with other functions this should only
            //   get the ice-ufrag and ice-pwd lines as input.
            SDPUtils.getIceParameters = function (mediaSection, sessionpart) {
                var lines = SDPUtils.splitLines(mediaSection);
                // Search in session part, too.
                lines = lines.concat(SDPUtils.splitLines(sessionpart));
                var iceParameters = {
                    usernameFragment: lines.filter(function (line) {
                        return line.indexOf('a=ice-ufrag:') === 0;
                    })[0].substr(12),
                    password: lines.filter(function (line) {
                        return line.indexOf('a=ice-pwd:') === 0;
                    })[0].substr(10)
                };
                return iceParameters;
            };

            // Serializes ICE parameters to SDP.
            SDPUtils.writeIceParameters = function (params) {
                return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' + 'a=ice-pwd:' + params.password + '\r\n';
            };

            // Parses the SDP media section and returns RTCRtpParameters.
            SDPUtils.parseRtpParameters = function (mediaSection) {
                var description = {
                    codecs: [],
                    headerExtensions: [],
                    fecMechanisms: [],
                    rtcp: []
                };
                var lines = SDPUtils.splitLines(mediaSection);
                var mline = lines[0].split(' ');
                for (var i = 3; i < mline.length; i++) {
                    // find all codecs from mline[3..]
                    var pt = mline[i];
                    var rtpmapline = SDPUtils.matchPrefix(mediaSection, 'a=rtpmap:' + pt + ' ')[0];
                    if (rtpmapline) {
                        var codec = SDPUtils.parseRtpMap(rtpmapline);
                        var fmtps = SDPUtils.matchPrefix(mediaSection, 'a=fmtp:' + pt + ' ');
                        // Only the first a=fmtp:<pt> is considered.
                        codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
                        codec.rtcpFeedback = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-fb:' + pt + ' ').map(SDPUtils.parseRtcpFb);
                        description.codecs.push(codec);
                        // parse FEC mechanisms from rtpmap lines.
                        switch (codec.name.toUpperCase()) {
                            case 'RED':
                            case 'ULPFEC':
                                description.fecMechanisms.push(codec.name.toUpperCase());
                                break;
                            default:
                                // only RED and ULPFEC are recognized as FEC mechanisms.
                                break;
                        }
                    }
                }
                SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function (line) {
                    description.headerExtensions.push(SDPUtils.parseExtmap(line));
                });
                // FIXME: parse rtcp.
                return description;
            };

            // Generates parts of the SDP media section describing the capabilities /
            // parameters.
            SDPUtils.writeRtpDescription = function (kind, caps) {
                var sdp = '';

                // Build the mline.
                sdp += 'm=' + kind + ' ';
                sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
                sdp += ' UDP/TLS/RTP/SAVPF ';
                sdp += caps.codecs.map(function (codec) {
                    if (codec.preferredPayloadType !== undefined) {
                        return codec.preferredPayloadType;
                    }
                    return codec.payloadType;
                }).join(' ') + '\r\n';

                sdp += 'c=IN IP4 0.0.0.0\r\n';
                sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

                // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
                caps.codecs.forEach(function (codec) {
                    sdp += SDPUtils.writeRtpMap(codec);
                    sdp += SDPUtils.writeFmtp(codec);
                    sdp += SDPUtils.writeRtcpFb(codec);
                });
                var maxptime = 0;
                caps.codecs.forEach(function (codec) {
                    if (codec.maxptime > maxptime) {
                        maxptime = codec.maxptime;
                    }
                });
                if (maxptime > 0) {
                    sdp += 'a=maxptime:' + maxptime + '\r\n';
                }
                sdp += 'a=rtcp-mux\r\n';

                if (caps.headerExtensions) {
                    caps.headerExtensions.forEach(function (extension) {
                        sdp += SDPUtils.writeExtmap(extension);
                    });
                }
                // FIXME: write fecMechanisms.
                return sdp;
            };

            // Parses the SDP media section and returns an array of
            // RTCRtpEncodingParameters.
            SDPUtils.parseRtpEncodingParameters = function (mediaSection) {
                var encodingParameters = [];
                var description = SDPUtils.parseRtpParameters(mediaSection);
                var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
                var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

                // filter a=ssrc:... cname:, ignore PlanB-msid
                var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
                    return SDPUtils.parseSsrcMedia(line);
                }).filter(function (parts) {
                    return parts.attribute === 'cname';
                });
                var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
                var secondarySsrc;

                var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID').map(function (line) {
                    var parts = line.substr(17).split(' ');
                    return parts.map(function (part) {
                        return parseInt(part, 10);
                    });
                });
                if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
                    secondarySsrc = flows[0][1];
                }

                description.codecs.forEach(function (codec) {
                    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
                        var encParam = {
                            ssrc: primarySsrc,
                            codecPayloadType: parseInt(codec.parameters.apt, 10)
                        };
                        if (primarySsrc && secondarySsrc) {
                            encParam.rtx = { ssrc: secondarySsrc };
                        }
                        encodingParameters.push(encParam);
                        if (hasRed) {
                            encParam = JSON.parse(JSON.stringify(encParam));
                            encParam.fec = {
                                ssrc: secondarySsrc,
                                mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
                            };
                            encodingParameters.push(encParam);
                        }
                    }
                });
                if (encodingParameters.length === 0 && primarySsrc) {
                    encodingParameters.push({
                        ssrc: primarySsrc
                    });
                }

                // we support both b=AS and b=TIAS but interpret AS as TIAS.
                var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
                if (bandwidth.length) {
                    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
                        bandwidth = parseInt(bandwidth[0].substr(7), 10);
                    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
                        // use formula from JSEP to convert b=AS to TIAS value.
                        bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95 - 50 * 40 * 8;
                    } else {
                        bandwidth = undefined;
                    }
                    encodingParameters.forEach(function (params) {
                        params.maxBitrate = bandwidth;
                    });
                }
                return encodingParameters;
            };

            // parses http://draft.ortc.org/#rtcrtcpparameters*
            SDPUtils.parseRtcpParameters = function (mediaSection) {
                var rtcpParameters = {};

                var cname;
                // Gets the first SSRC. Note that with RTX there might be multiple
                // SSRCs.
                var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
                    return SDPUtils.parseSsrcMedia(line);
                }).filter(function (obj) {
                    return obj.attribute === 'cname';
                })[0];
                if (remoteSsrc) {
                    rtcpParameters.cname = remoteSsrc.value;
                    rtcpParameters.ssrc = remoteSsrc.ssrc;
                }

                // Edge uses the compound attribute instead of reducedSize
                // compound is !reducedSize
                var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
                rtcpParameters.reducedSize = rsize.length > 0;
                rtcpParameters.compound = rsize.length === 0;

                // parses the rtcp-mux attrіbute.
                // Note that Edge does not support unmuxed RTCP.
                var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
                rtcpParameters.mux = mux.length > 0;

                return rtcpParameters;
            };

            // parses either a=msid: or a=ssrc:... msid lines and returns
            // the id of the MediaStream and MediaStreamTrack.
            SDPUtils.parseMsid = function (mediaSection) {
                var parts;
                var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
                if (spec.length === 1) {
                    parts = spec[0].substr(7).split(' ');
                    return { stream: parts[0], track: parts[1] };
                }
                var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:').map(function (line) {
                    return SDPUtils.parseSsrcMedia(line);
                }).filter(function (parts) {
                    return parts.attribute === 'msid';
                });
                if (planB.length > 0) {
                    parts = planB[0].value.split(' ');
                    return { stream: parts[0], track: parts[1] };
                }
            };

            // Generate a session ID for SDP.
            // https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
            // recommends using a cryptographically random +ve 64-bit value
            // but right now this should be acceptable and within the right range
            SDPUtils.generateSessionId = function () {
                return Math.random().toString().substr(2, 21);
            };

            // Write boilder plate for start of SDP
            // sessId argument is optional - if not supplied it will
            // be generated randomly
            // sessVersion is optional and defaults to 2
            SDPUtils.writeSessionBoilerplate = function (sessId, sessVer) {
                var sessionId;
                var version = sessVer !== undefined ? sessVer : 2;
                if (sessId) {
                    sessionId = sessId;
                } else {
                    sessionId = SDPUtils.generateSessionId();
                }
                // FIXME: sess-id should be an NTP timestamp.
                return 'v=0\r\n' + 'o=thisisadapterortc ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' + 's=-\r\n' + 't=0 0\r\n';
            };

            SDPUtils.writeMediaSection = function (transceiver, caps, type, stream) {
                var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

                // Map ICE parameters (ufrag, pwd) to SDP.
                sdp += SDPUtils.writeIceParameters(transceiver.iceGatherer.getLocalParameters());

                // Map DTLS parameters to SDP.
                sdp += SDPUtils.writeDtlsParameters(transceiver.dtlsTransport.getLocalParameters(), type === 'offer' ? 'actpass' : 'active');

                sdp += 'a=mid:' + transceiver.mid + '\r\n';

                if (transceiver.direction) {
                    sdp += 'a=' + transceiver.direction + '\r\n';
                } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
                    sdp += 'a=sendrecv\r\n';
                } else if (transceiver.rtpSender) {
                    sdp += 'a=sendonly\r\n';
                } else if (transceiver.rtpReceiver) {
                    sdp += 'a=recvonly\r\n';
                } else {
                    sdp += 'a=inactive\r\n';
                }

                if (transceiver.rtpSender) {
                    // spec.
                    var msid = 'msid:' + stream.id + ' ' + transceiver.rtpSender.track.id + '\r\n';
                    sdp += 'a=' + msid;

                    // for Chrome.
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' ' + msid;
                    if (transceiver.sendEncodingParameters[0].rtx) {
                        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' ' + msid;
                        sdp += 'a=ssrc-group:FID ' + transceiver.sendEncodingParameters[0].ssrc + ' ' + transceiver.sendEncodingParameters[0].rtx.ssrc + '\r\n';
                    }
                }
                // FIXME: this should be written by writeRtpDescription.
                sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
                if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
                    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc + ' cname:' + SDPUtils.localCName + '\r\n';
                }
                return sdp;
            };

            // Gets the direction from the mediaSection or the sessionpart.
            SDPUtils.getDirection = function (mediaSection, sessionpart) {
                // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
                var lines = SDPUtils.splitLines(mediaSection);
                for (var i = 0; i < lines.length; i++) {
                    switch (lines[i]) {
                        case 'a=sendrecv':
                        case 'a=sendonly':
                        case 'a=recvonly':
                        case 'a=inactive':
                            return lines[i].substr(2);
                        default:
                        // FIXME: What should happen here?
                    }
                }
                if (sessionpart) {
                    return SDPUtils.getDirection(sessionpart);
                }
                return 'sendrecv';
            };

            SDPUtils.getKind = function (mediaSection) {
                var lines = SDPUtils.splitLines(mediaSection);
                var mline = lines[0].split(' ');
                return mline[0].substr(2);
            };

            SDPUtils.isRejected = function (mediaSection) {
                return mediaSection.split(' ', 2)[1] === '0';
            };

            SDPUtils.parseMLine = function (mediaSection) {
                var lines = SDPUtils.splitLines(mediaSection);
                var parts = lines[0].substr(2).split(' ');
                return {
                    kind: parts[0],
                    port: parseInt(parts[1], 10),
                    protocol: parts[2],
                    fmt: parts.slice(3).join(' ')
                };
            };

            SDPUtils.parseOLine = function (mediaSection) {
                var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
                var parts = line.substr(2).split(' ');
                return {
                    username: parts[0],
                    sessionId: parts[1],
                    sessionVersion: parseInt(parts[2], 10),
                    netType: parts[3],
                    addressType: parts[4],
                    address: parts[5]
                };
            };

            // Expose public methods.
            if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === 'object') {
                module.exports = SDPUtils;
            }
        }, {}], 3: [function (require, module, exports) {
            (function (global) {
                /*
                *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
                *
                *  Use of this source code is governed by a BSD-style license
                *  that can be found in the LICENSE file in the root of the source
                *  tree.
                */
                /* eslint-env node */

                'use strict';

                var adapterFactory = require('./adapter_factory.js');
                module.exports = adapterFactory({ window: global.window });
            }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
        }, { "./adapter_factory.js": 4 }], 4: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */

            'use strict';

            var utils = require('./utils');
            // Shimming starts here.
            module.exports = function (dependencies, opts) {
                var window = dependencies && dependencies.window;

                var options = {
                    shimChrome: true,
                    shimFirefox: true,
                    shimEdge: true,
                    shimSafari: true
                };

                for (var key in opts) {
                    if (hasOwnProperty.call(opts, key)) {
                        options[key] = opts[key];
                    }
                }

                // Utils.
                var logging = utils.log;
                var browserDetails = utils.detectBrowser(window);

                // Uncomment the line below if you want logging to occur, including logging
                // for the switch statement below. Can also be turned on in the browser via
                // adapter.disableLog(false), but then logging from the switch statement below
                // will not appear.
                // require('./utils').disableLog(false);

                // Browser shims.
                var chromeShim = require('./chrome/chrome_shim') || null;
                var edgeShim = require('./edge/edge_shim') || null;
                var firefoxShim = require('./firefox/firefox_shim') || null;
                var safariShim = require('./safari/safari_shim') || null;
                var commonShim = require('./common_shim') || null;

                // Export to the adapter global object visible in the browser.
                var adapter = {
                    browserDetails: browserDetails,
                    commonShim: commonShim,
                    extractVersion: utils.extractVersion,
                    disableLog: utils.disableLog,
                    disableWarnings: utils.disableWarnings
                };

                // Shim browser if found.
                switch (browserDetails.browser) {
                    case 'chrome':
                        if (!chromeShim || !chromeShim.shimPeerConnection || !options.shimChrome) {
                            logging('Chrome shim is not included in this adapter release.');
                            return adapter;
                        }
                        logging('adapter.js shimming chrome.');
                        // Export to the adapter global object visible in the browser.
                        adapter.browserShim = chromeShim;
                        commonShim.shimCreateObjectURL(window);

                        chromeShim.shimGetUserMedia(window);
                        chromeShim.shimMediaStream(window);
                        chromeShim.shimSourceObject(window);
                        chromeShim.shimPeerConnection(window);
                        chromeShim.shimOnTrack(window);
                        chromeShim.shimAddTrackRemoveTrack(window);
                        chromeShim.shimGetSendersWithDtmf(window);
                        chromeShim.shimSenderReceiverGetStats(window);

                        commonShim.shimRTCIceCandidate(window);
                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        break;
                    case 'firefox':
                        if (!firefoxShim || !firefoxShim.shimPeerConnection || !options.shimFirefox) {
                            logging('Firefox shim is not included in this adapter release.');
                            return adapter;
                        }
                        logging('adapter.js shimming firefox.');
                        // Export to the adapter global object visible in the browser.
                        adapter.browserShim = firefoxShim;
                        commonShim.shimCreateObjectURL(window);

                        firefoxShim.shimGetUserMedia(window);
                        firefoxShim.shimSourceObject(window);
                        firefoxShim.shimPeerConnection(window);
                        firefoxShim.shimOnTrack(window);
                        firefoxShim.shimRemoveStream(window);
                        firefoxShim.shimSenderGetStats(window);
                        firefoxShim.shimReceiverGetStats(window);
                        firefoxShim.shimRTCDataChannel(window);

                        commonShim.shimRTCIceCandidate(window);
                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        break;
                    case 'edge':
                        if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
                            logging('MS edge shim is not included in this adapter release.');
                            return adapter;
                        }
                        logging('adapter.js shimming edge.');
                        // Export to the adapter global object visible in the browser.
                        adapter.browserShim = edgeShim;
                        commonShim.shimCreateObjectURL(window);

                        edgeShim.shimGetUserMedia(window);
                        edgeShim.shimPeerConnection(window);
                        edgeShim.shimReplaceTrack(window);

                        // the edge shim implements the full RTCIceCandidate object.

                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        break;
                    case 'safari':
                        if (!safariShim || !options.shimSafari) {
                            logging('Safari shim is not included in this adapter release.');
                            return adapter;
                        }
                        logging('adapter.js shimming safari.');
                        // Export to the adapter global object visible in the browser.
                        adapter.browserShim = safariShim;
                        commonShim.shimCreateObjectURL(window);

                        safariShim.shimRTCIceServerUrls(window);
                        safariShim.shimCallbacksAPI(window);
                        safariShim.shimLocalStreamsAPI(window);
                        safariShim.shimRemoteStreamsAPI(window);
                        safariShim.shimTrackEventTransceiver(window);
                        safariShim.shimGetUserMedia(window);
                        safariShim.shimCreateOfferLegacy(window);

                        commonShim.shimRTCIceCandidate(window);
                        commonShim.shimMaxMessageSize(window);
                        commonShim.shimSendThrowTypeError(window);
                        break;
                    default:
                        logging('Unsupported browser!');
                        break;
                }

                return adapter;
            };
        }, { "./chrome/chrome_shim": 5, "./common_shim": 7, "./edge/edge_shim": 8, "./firefox/firefox_shim": 11, "./safari/safari_shim": 13, "./utils": 14 }], 5: [function (require, module, exports) {

            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var utils = require('../utils.js');
            var logging = utils.log;

            /* iterates the stats graph recursively. */
            function walkStats(stats, base, resultSet) {
                if (!base || resultSet.has(base.id)) {
                    return;
                }
                resultSet.set(base.id, base);
                Object.keys(base).forEach(function (name) {
                    if (name.endsWith('Id')) {
                        walkStats(stats, stats.get(base[name]), resultSet);
                    } else if (name.endsWith('Ids')) {
                        base[name].forEach(function (id) {
                            walkStats(stats, stats.get(id), resultSet);
                        });
                    }
                });
            }

            /* filter getStats for a sender/receiver track. */
            function filterStats(result, track, outbound) {
                var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
                var filteredResult = new Map();
                if (track === null) {
                    return filteredResult;
                }
                var trackStats = [];
                result.forEach(function (value) {
                    if (value.type === 'track' && value.trackIdentifier === track.id) {
                        trackStats.push(value);
                    }
                });
                trackStats.forEach(function (trackStat) {
                    result.forEach(function (stats) {
                        if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
                            walkStats(result, stats, filteredResult);
                        }
                    });
                });
                return filteredResult;
            }

            module.exports = {
                shimGetUserMedia: require('./getusermedia'),
                shimMediaStream: function shimMediaStream(window) {
                    window.MediaStream = window.MediaStream || window.webkitMediaStream;
                },

                shimOnTrack: function shimOnTrack(window) {
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
                        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
                            get: function get() {
                                return this._ontrack;
                            },
                            set: function set(f) {
                                if (this._ontrack) {
                                    this.removeEventListener('track', this._ontrack);
                                }
                                this.addEventListener('track', this._ontrack = f);
                            }
                        });
                        var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
                        window.RTCPeerConnection.prototype.setRemoteDescription = function () {
                            var pc = this;
                            if (!pc._ontrackpoly) {
                                pc._ontrackpoly = function (e) {
                                    // onaddstream does not fire when a track is added to an existing
                                    // stream. But stream.onaddtrack is implemented so we use that.
                                    e.stream.addEventListener('addtrack', function (te) {
                                        var receiver;
                                        if (window.RTCPeerConnection.prototype.getReceivers) {
                                            receiver = pc.getReceivers().find(function (r) {
                                                return r.track && r.track.id === te.track.id;
                                            });
                                        } else {
                                            receiver = { track: te.track };
                                        }

                                        var event = new Event('track');
                                        event.track = te.track;
                                        event.receiver = receiver;
                                        event.transceiver = { receiver: receiver };
                                        event.streams = [e.stream];
                                        pc.dispatchEvent(event);
                                    });
                                    e.stream.getTracks().forEach(function (track) {
                                        var receiver;
                                        if (window.RTCPeerConnection.prototype.getReceivers) {
                                            receiver = pc.getReceivers().find(function (r) {
                                                return r.track && r.track.id === track.id;
                                            });
                                        } else {
                                            receiver = { track: track };
                                        }
                                        var event = new Event('track');
                                        event.track = track;
                                        event.receiver = receiver;
                                        event.transceiver = { receiver: receiver };
                                        event.streams = [e.stream];
                                        pc.dispatchEvent(event);
                                    });
                                };
                                pc.addEventListener('addstream', pc._ontrackpoly);
                            }
                            return origSetRemoteDescription.apply(pc, arguments);
                        };
                    } else if (!('RTCRtpTransceiver' in window)) {
                        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
                            if (!e.transceiver) {
                                e.transceiver = { receiver: e.receiver };
                            }
                            return e;
                        });
                    }
                },

                shimGetSendersWithDtmf: function shimGetSendersWithDtmf(window) {
                    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && !('getSenders' in window.RTCPeerConnection.prototype) && 'createDTMFSender' in window.RTCPeerConnection.prototype) {
                        var shimSenderWithDtmf = function shimSenderWithDtmf(pc, track) {
                            return {
                                track: track,
                                get dtmf() {
                                    if (this._dtmf === undefined) {
                                        if (track.kind === 'audio') {
                                            this._dtmf = pc.createDTMFSender(track);
                                        } else {
                                            this._dtmf = null;
                                        }
                                    }
                                    return this._dtmf;
                                },
                                _pc: pc
                            };
                        };

                        // augment addTrack when getSenders is not available.
                        if (!window.RTCPeerConnection.prototype.getSenders) {
                            window.RTCPeerConnection.prototype.getSenders = function () {
                                this._senders = this._senders || [];
                                return this._senders.slice(); // return a copy of the internal state.
                            };
                            var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                            window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
                                var pc = this;
                                var sender = origAddTrack.apply(pc, arguments);
                                if (!sender) {
                                    sender = shimSenderWithDtmf(pc, track);
                                    pc._senders.push(sender);
                                }
                                return sender;
                            };

                            var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
                            window.RTCPeerConnection.prototype.removeTrack = function (sender) {
                                var pc = this;
                                origRemoveTrack.apply(pc, arguments);
                                var idx = pc._senders.indexOf(sender);
                                if (idx !== -1) {
                                    pc._senders.splice(idx, 1);
                                }
                            };
                        }
                        var origAddStream = window.RTCPeerConnection.prototype.addStream;
                        window.RTCPeerConnection.prototype.addStream = function (stream) {
                            var pc = this;
                            pc._senders = pc._senders || [];
                            origAddStream.apply(pc, [stream]);
                            stream.getTracks().forEach(function (track) {
                                pc._senders.push(shimSenderWithDtmf(pc, track));
                            });
                        };

                        var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
                        window.RTCPeerConnection.prototype.removeStream = function (stream) {
                            var pc = this;
                            pc._senders = pc._senders || [];
                            origRemoveStream.apply(pc, [stream]);

                            stream.getTracks().forEach(function (track) {
                                var sender = pc._senders.find(function (s) {
                                    return s.track === track;
                                });
                                if (sender) {
                                    pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
                                }
                            });
                        };
                    } else if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && 'getSenders' in window.RTCPeerConnection.prototype && 'createDTMFSender' in window.RTCPeerConnection.prototype && window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
                        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
                        window.RTCPeerConnection.prototype.getSenders = function () {
                            var pc = this;
                            var senders = origGetSenders.apply(pc, []);
                            senders.forEach(function (sender) {
                                sender._pc = pc;
                            });
                            return senders;
                        };

                        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
                            get: function get() {
                                if (this._dtmf === undefined) {
                                    if (this.track.kind === 'audio') {
                                        this._dtmf = this._pc.createDTMFSender(this.track);
                                    } else {
                                        this._dtmf = null;
                                    }
                                }
                                return this._dtmf;
                            }
                        });
                    }
                },

                shimSenderReceiverGetStats: function shimSenderReceiverGetStats(window) {
                    if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender && window.RTCRtpReceiver)) {
                        return;
                    }

                    // shim sender stats.
                    if (!('getStats' in window.RTCRtpSender.prototype)) {
                        var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
                        if (origGetSenders) {
                            window.RTCPeerConnection.prototype.getSenders = function () {
                                var pc = this;
                                var senders = origGetSenders.apply(pc, []);
                                senders.forEach(function (sender) {
                                    sender._pc = pc;
                                });
                                return senders;
                            };
                        }

                        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                        if (origAddTrack) {
                            window.RTCPeerConnection.prototype.addTrack = function () {
                                var sender = origAddTrack.apply(this, arguments);
                                sender._pc = this;
                                return sender;
                            };
                        }
                        window.RTCRtpSender.prototype.getStats = function () {
                            var sender = this;
                            return this._pc.getStats().then(function (result) {
                                /* Note: this will include stats of all senders that
                                *   send a track with the same id as sender.track as
                                *   it is not possible to identify the RTCRtpSender.
                                */
                                return filterStats(result, sender.track, true);
                            });
                        };
                    }

                    // shim receiver stats.
                    if (!('getStats' in window.RTCRtpReceiver.prototype)) {
                        var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
                        if (origGetReceivers) {
                            window.RTCPeerConnection.prototype.getReceivers = function () {
                                var pc = this;
                                var receivers = origGetReceivers.apply(pc, []);
                                receivers.forEach(function (receiver) {
                                    receiver._pc = pc;
                                });
                                return receivers;
                            };
                        }
                        utils.wrapPeerConnectionEvent(window, 'track', function (e) {
                            e.receiver._pc = e.srcElement;
                            return e;
                        });
                        window.RTCRtpReceiver.prototype.getStats = function () {
                            var receiver = this;
                            return this._pc.getStats().then(function (result) {
                                return filterStats(result, receiver.track, false);
                            });
                        };
                    }

                    if (!('getStats' in window.RTCRtpSender.prototype && 'getStats' in window.RTCRtpReceiver.prototype)) {
                        return;
                    }

                    // shim RTCPeerConnection.getStats(track).
                    var origGetStats = window.RTCPeerConnection.prototype.getStats;
                    window.RTCPeerConnection.prototype.getStats = function () {
                        var pc = this;
                        if (arguments.length > 0 && arguments[0] instanceof window.MediaStreamTrack) {
                            var track = arguments[0];
                            var sender;
                            var receiver;
                            var err;
                            pc.getSenders().forEach(function (s) {
                                if (s.track === track) {
                                    if (sender) {
                                        err = true;
                                    } else {
                                        sender = s;
                                    }
                                }
                            });
                            pc.getReceivers().forEach(function (r) {
                                if (r.track === track) {
                                    if (receiver) {
                                        err = true;
                                    } else {
                                        receiver = r;
                                    }
                                }
                                return r.track === track;
                            });
                            if (err || sender && receiver) {
                                return Promise.reject(new DOMException('There are more than one sender or receiver for the track.', 'InvalidAccessError'));
                            } else if (sender) {
                                return sender.getStats();
                            } else if (receiver) {
                                return receiver.getStats();
                            }
                            return Promise.reject(new DOMException('There is no sender or receiver for the track.', 'InvalidAccessError'));
                        }
                        return origGetStats.apply(pc, arguments);
                    };
                },

                shimSourceObject: function shimSourceObject(window) {
                    var URL = window && window.URL;

                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
                        if (window.HTMLMediaElement && !('srcObject' in window.HTMLMediaElement.prototype)) {
                            // Shim the srcObject property, once, when HTMLMediaElement is found.
                            Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
                                get: function get() {
                                    return this._srcObject;
                                },
                                set: function set(stream) {
                                    var self = this;
                                    // Use _srcObject as a private property for this shim
                                    this._srcObject = stream;
                                    if (this.src) {
                                        URL.revokeObjectURL(this.src);
                                    }

                                    if (!stream) {
                                        this.src = '';
                                        return undefined;
                                    }
                                    this.src = URL.createObjectURL(stream);
                                    // We need to recreate the blob url when a track is added or
                                    // removed. Doing it manually since we want to avoid a recursion.
                                    stream.addEventListener('addtrack', function () {
                                        if (self.src) {
                                            URL.revokeObjectURL(self.src);
                                        }
                                        self.src = URL.createObjectURL(stream);
                                    });
                                    stream.addEventListener('removetrack', function () {
                                        if (self.src) {
                                            URL.revokeObjectURL(self.src);
                                        }
                                        self.src = URL.createObjectURL(stream);
                                    });
                                }
                            });
                        }
                    }
                },

                shimAddTrackRemoveTrackWithNative: function shimAddTrackRemoveTrackWithNative(window) {
                    // shim addTrack/removeTrack with native variants in order to make
                    // the interactions with legacy getLocalStreams behave as in other browsers.
                    // Keeps a mapping stream.id => [stream, rtpsenders...]
                    window.RTCPeerConnection.prototype.getLocalStreams = function () {
                        var pc = this;
                        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                        return Object.keys(this._shimmedLocalStreams).map(function (streamId) {
                            return pc._shimmedLocalStreams[streamId][0];
                        });
                    };

                    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                    window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
                        if (!stream) {
                            return origAddTrack.apply(this, arguments);
                        }
                        this._shimmedLocalStreams = this._shimmedLocalStreams || {};

                        var sender = origAddTrack.apply(this, arguments);
                        if (!this._shimmedLocalStreams[stream.id]) {
                            this._shimmedLocalStreams[stream.id] = [stream, sender];
                        } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
                            this._shimmedLocalStreams[stream.id].push(sender);
                        }
                        return sender;
                    };

                    var origAddStream = window.RTCPeerConnection.prototype.addStream;
                    window.RTCPeerConnection.prototype.addStream = function (stream) {
                        var pc = this;
                        this._shimmedLocalStreams = this._shimmedLocalStreams || {};

                        stream.getTracks().forEach(function (track) {
                            var alreadyExists = pc.getSenders().find(function (s) {
                                return s.track === track;
                            });
                            if (alreadyExists) {
                                throw new DOMException('Track already exists.', 'InvalidAccessError');
                            }
                        });
                        var existingSenders = pc.getSenders();
                        origAddStream.apply(this, arguments);
                        var newSenders = pc.getSenders().filter(function (newSender) {
                            return existingSenders.indexOf(newSender) === -1;
                        });
                        this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
                    };

                    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
                    window.RTCPeerConnection.prototype.removeStream = function (stream) {
                        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                        delete this._shimmedLocalStreams[stream.id];
                        return origRemoveStream.apply(this, arguments);
                    };

                    var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
                    window.RTCPeerConnection.prototype.removeTrack = function (sender) {
                        var pc = this;
                        this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                        if (sender) {
                            Object.keys(this._shimmedLocalStreams).forEach(function (streamId) {
                                var idx = pc._shimmedLocalStreams[streamId].indexOf(sender);
                                if (idx !== -1) {
                                    pc._shimmedLocalStreams[streamId].splice(idx, 1);
                                }
                                if (pc._shimmedLocalStreams[streamId].length === 1) {
                                    delete pc._shimmedLocalStreams[streamId];
                                }
                            });
                        }
                        return origRemoveTrack.apply(this, arguments);
                    };
                },

                shimAddTrackRemoveTrack: function shimAddTrackRemoveTrack(window) {
                    var browserDetails = utils.detectBrowser(window);
                    // shim addTrack and removeTrack.
                    if (window.RTCPeerConnection.prototype.addTrack && browserDetails.version >= 65) {
                        return this.shimAddTrackRemoveTrackWithNative(window);
                    }

                    // also shim pc.getLocalStreams when addTrack is shimmed
                    // to return the original streams.
                    var origGetLocalStreams = window.RTCPeerConnection.prototype.getLocalStreams;
                    window.RTCPeerConnection.prototype.getLocalStreams = function () {
                        var pc = this;
                        var nativeStreams = origGetLocalStreams.apply(this);
                        pc._reverseStreams = pc._reverseStreams || {};
                        return nativeStreams.map(function (stream) {
                            return pc._reverseStreams[stream.id];
                        });
                    };

                    var origAddStream = window.RTCPeerConnection.prototype.addStream;
                    window.RTCPeerConnection.prototype.addStream = function (stream) {
                        var pc = this;
                        pc._streams = pc._streams || {};
                        pc._reverseStreams = pc._reverseStreams || {};

                        stream.getTracks().forEach(function (track) {
                            var alreadyExists = pc.getSenders().find(function (s) {
                                return s.track === track;
                            });
                            if (alreadyExists) {
                                throw new DOMException('Track already exists.', 'InvalidAccessError');
                            }
                        });
                        // Add identity mapping for consistency with addTrack.
                        // Unless this is being used with a stream from addTrack.
                        if (!pc._reverseStreams[stream.id]) {
                            var newStream = new window.MediaStream(stream.getTracks());
                            pc._streams[stream.id] = newStream;
                            pc._reverseStreams[newStream.id] = stream;
                            stream = newStream;
                        }
                        origAddStream.apply(pc, [stream]);
                    };

                    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
                    window.RTCPeerConnection.prototype.removeStream = function (stream) {
                        var pc = this;
                        pc._streams = pc._streams || {};
                        pc._reverseStreams = pc._reverseStreams || {};

                        origRemoveStream.apply(pc, [pc._streams[stream.id] || stream]);
                        delete pc._reverseStreams[pc._streams[stream.id] ? pc._streams[stream.id].id : stream.id];
                        delete pc._streams[stream.id];
                    };

                    window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
                        var pc = this;
                        if (pc.signalingState === 'closed') {
                            throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
                        }
                        var streams = [].slice.call(arguments, 1);
                        if (streams.length !== 1 || !streams[0].getTracks().find(function (t) {
                            return t === track;
                        })) {
                            // this is not fully correct but all we can manage without
                            // [[associated MediaStreams]] internal slot.
                            throw new DOMException('The adapter.js addTrack polyfill only supports a single ' + ' stream which is associated with the specified track.', 'NotSupportedError');
                        }

                        var alreadyExists = pc.getSenders().find(function (s) {
                            return s.track === track;
                        });
                        if (alreadyExists) {
                            throw new DOMException('Track already exists.', 'InvalidAccessError');
                        }

                        pc._streams = pc._streams || {};
                        pc._reverseStreams = pc._reverseStreams || {};
                        var oldStream = pc._streams[stream.id];
                        if (oldStream) {
                            // this is using odd Chrome behaviour, use with caution:
                            // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
                            // Note: we rely on the high-level addTrack/dtmf shim to
                            // create the sender with a dtmf sender.
                            oldStream.addTrack(track);

                            // Trigger ONN async.
                            Promise.resolve().then(function () {
                                pc.dispatchEvent(new Event('negotiationneeded'));
                            });
                        } else {
                            var newStream = new window.MediaStream([track]);
                            pc._streams[stream.id] = newStream;
                            pc._reverseStreams[newStream.id] = stream;
                            pc.addStream(newStream);
                        }
                        return pc.getSenders().find(function (s) {
                            return s.track === track;
                        });
                    };

                    // replace the internal stream id with the external one and
                    // vice versa.
                    function replaceInternalStreamId(pc, description) {
                        var sdp = description.sdp;
                        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
                            var externalStream = pc._reverseStreams[internalId];
                            var internalStream = pc._streams[externalStream.id];
                            sdp = sdp.replace(new RegExp(internalStream.id, 'g'), externalStream.id);
                        });
                        return new RTCSessionDescription({
                            type: description.type,
                            sdp: sdp
                        });
                    }
                    function replaceExternalStreamId(pc, description) {
                        var sdp = description.sdp;
                        Object.keys(pc._reverseStreams || []).forEach(function (internalId) {
                            var externalStream = pc._reverseStreams[internalId];
                            var internalStream = pc._streams[externalStream.id];
                            sdp = sdp.replace(new RegExp(externalStream.id, 'g'), internalStream.id);
                        });
                        return new RTCSessionDescription({
                            type: description.type,
                            sdp: sdp
                        });
                    }
                    ['createOffer', 'createAnswer'].forEach(function (method) {
                        var nativeMethod = window.RTCPeerConnection.prototype[method];
                        window.RTCPeerConnection.prototype[method] = function () {
                            var pc = this;
                            var args = arguments;
                            var isLegacyCall = arguments.length && typeof arguments[0] === 'function';
                            if (isLegacyCall) {
                                return nativeMethod.apply(pc, [function (description) {
                                    var desc = replaceInternalStreamId(pc, description);
                                    args[0].apply(null, [desc]);
                                }, function (err) {
                                    if (args[1]) {
                                        args[1].apply(null, err);
                                    }
                                }, arguments[2]]);
                            }
                            return nativeMethod.apply(pc, arguments).then(function (description) {
                                return replaceInternalStreamId(pc, description);
                            });
                        };
                    });

                    var origSetLocalDescription = window.RTCPeerConnection.prototype.setLocalDescription;
                    window.RTCPeerConnection.prototype.setLocalDescription = function () {
                        var pc = this;
                        if (!arguments.length || !arguments[0].type) {
                            return origSetLocalDescription.apply(pc, arguments);
                        }
                        arguments[0] = replaceExternalStreamId(pc, arguments[0]);
                        return origSetLocalDescription.apply(pc, arguments);
                    };

                    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

                    var origLocalDescription = Object.getOwnPropertyDescriptor(window.RTCPeerConnection.prototype, 'localDescription');
                    Object.defineProperty(window.RTCPeerConnection.prototype, 'localDescription', {
                        get: function get() {
                            var pc = this;
                            var description = origLocalDescription.get.apply(this);
                            if (description.type === '') {
                                return description;
                            }
                            return replaceInternalStreamId(pc, description);
                        }
                    });

                    window.RTCPeerConnection.prototype.removeTrack = function (sender) {
                        var pc = this;
                        if (pc.signalingState === 'closed') {
                            throw new DOMException('The RTCPeerConnection\'s signalingState is \'closed\'.', 'InvalidStateError');
                        }
                        // We can not yet check for sender instanceof RTCRtpSender
                        // since we shim RTPSender. So we check if sender._pc is set.
                        if (!sender._pc) {
                            throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' + 'does not implement interface RTCRtpSender.', 'TypeError');
                        }
                        var isLocal = sender._pc === pc;
                        if (!isLocal) {
                            throw new DOMException('Sender was not created by this connection.', 'InvalidAccessError');
                        }

                        // Search for the native stream the senders track belongs to.
                        pc._streams = pc._streams || {};
                        var stream;
                        Object.keys(pc._streams).forEach(function (streamid) {
                            var hasTrack = pc._streams[streamid].getTracks().find(function (track) {
                                return sender.track === track;
                            });
                            if (hasTrack) {
                                stream = pc._streams[streamid];
                            }
                        });

                        if (stream) {
                            if (stream.getTracks().length === 1) {
                                // if this is the last track of the stream, remove the stream. This
                                // takes care of any shimmed _senders.
                                pc.removeStream(pc._reverseStreams[stream.id]);
                            } else {
                                // relying on the same odd chrome behaviour as above.
                                stream.removeTrack(sender.track);
                            }
                            pc.dispatchEvent(new Event('negotiationneeded'));
                        }
                    };
                },

                shimPeerConnection: function shimPeerConnection(window) {
                    var browserDetails = utils.detectBrowser(window);

                    // The RTCPeerConnection object.
                    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
                        window.RTCPeerConnection = function (pcConfig, pcConstraints) {
                            // Translate iceTransportPolicy to iceTransports,
                            // see https://code.google.com/p/webrtc/issues/detail?id=4869
                            // this was fixed in M56 along with unprefixing RTCPeerConnection.
                            logging('PeerConnection');
                            if (pcConfig && pcConfig.iceTransportPolicy) {
                                pcConfig.iceTransports = pcConfig.iceTransportPolicy;
                            }

                            return new window.webkitRTCPeerConnection(pcConfig, pcConstraints);
                        };
                        window.RTCPeerConnection.prototype = window.webkitRTCPeerConnection.prototype;
                        // wrap static methods. Currently just generateCertificate.
                        if (window.webkitRTCPeerConnection.generateCertificate) {
                            Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
                                get: function get() {
                                    return window.webkitRTCPeerConnection.generateCertificate;
                                }
                            });
                        }
                    } else {
                        // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
                        var OrigPeerConnection = window.RTCPeerConnection;
                        window.RTCPeerConnection = function (pcConfig, pcConstraints) {
                            if (pcConfig && pcConfig.iceServers) {
                                var newIceServers = [];
                                for (var i = 0; i < pcConfig.iceServers.length; i++) {
                                    var server = pcConfig.iceServers[i];
                                    if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
                                        utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
                                        server = JSON.parse(JSON.stringify(server));
                                        server.urls = server.url;
                                        newIceServers.push(server);
                                    } else {
                                        newIceServers.push(pcConfig.iceServers[i]);
                                    }
                                }
                                pcConfig.iceServers = newIceServers;
                            }
                            return new OrigPeerConnection(pcConfig, pcConstraints);
                        };
                        window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
                        // wrap static methods. Currently just generateCertificate.
                        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
                            get: function get() {
                                return OrigPeerConnection.generateCertificate;
                            }
                        });
                    }

                    var origGetStats = window.RTCPeerConnection.prototype.getStats;
                    window.RTCPeerConnection.prototype.getStats = function (selector, successCallback, errorCallback) {
                        var pc = this;
                        var args = arguments;

                        // If selector is a function then we are in the old style stats so just
                        // pass back the original getStats format to avoid breaking old users.
                        if (arguments.length > 0 && typeof selector === 'function') {
                            return origGetStats.apply(this, arguments);
                        }

                        // When spec-style getStats is supported, return those when called with
                        // either no arguments or the selector argument is null.
                        if (origGetStats.length === 0 && (arguments.length === 0 || typeof arguments[0] !== 'function')) {
                            return origGetStats.apply(this, []);
                        }

                        var fixChromeStats_ = function fixChromeStats_(response) {
                            var standardReport = {};
                            var reports = response.result();
                            reports.forEach(function (report) {
                                var standardStats = {
                                    id: report.id,
                                    timestamp: report.timestamp,
                                    type: {
                                        localcandidate: 'local-candidate',
                                        remotecandidate: 'remote-candidate'
                                    }[report.type] || report.type
                                };
                                report.names().forEach(function (name) {
                                    standardStats[name] = report.stat(name);
                                });
                                standardReport[standardStats.id] = standardStats;
                            });

                            return standardReport;
                        };

                        // shim getStats with maplike support
                        var makeMapStats = function makeMapStats(stats) {
                            return new Map(Object.keys(stats).map(function (key) {
                                return [key, stats[key]];
                            }));
                        };

                        if (arguments.length >= 2) {
                            var successCallbackWrapper_ = function successCallbackWrapper_(response) {
                                args[1](makeMapStats(fixChromeStats_(response)));
                            };

                            return origGetStats.apply(this, [successCallbackWrapper_, arguments[0]]);
                        }

                        // promise-support
                        return new Promise(function (resolve, reject) {
                            origGetStats.apply(pc, [function (response) {
                                resolve(makeMapStats(fixChromeStats_(response)));
                            }, reject]);
                        }).then(successCallback, errorCallback);
                    };

                    // add promise support -- natively available in Chrome 51
                    if (browserDetails.version < 51) {
                        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
                            var nativeMethod = window.RTCPeerConnection.prototype[method];
                            window.RTCPeerConnection.prototype[method] = function () {
                                var args = arguments;
                                var pc = this;
                                var promise = new Promise(function (resolve, reject) {
                                    nativeMethod.apply(pc, [args[0], resolve, reject]);
                                });
                                if (args.length < 2) {
                                    return promise;
                                }
                                return promise.then(function () {
                                    args[1].apply(null, []);
                                }, function (err) {
                                    if (args.length >= 3) {
                                        args[2].apply(null, [err]);
                                    }
                                });
                            };
                        });
                    }

                    // promise support for createOffer and createAnswer. Available (without
                    // bugs) since M52: crbug/619289
                    if (browserDetails.version < 52) {
                        ['createOffer', 'createAnswer'].forEach(function (method) {
                            var nativeMethod = window.RTCPeerConnection.prototype[method];
                            window.RTCPeerConnection.prototype[method] = function () {
                                var pc = this;
                                if (arguments.length < 1 || arguments.length === 1 && _typeof(arguments[0]) === 'object') {
                                    var opts = arguments.length === 1 ? arguments[0] : undefined;
                                    return new Promise(function (resolve, reject) {
                                        nativeMethod.apply(pc, [resolve, reject, opts]);
                                    });
                                }
                                return nativeMethod.apply(this, arguments);
                            };
                        });
                    }

                    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
                    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
                        var nativeMethod = window.RTCPeerConnection.prototype[method];
                        window.RTCPeerConnection.prototype[method] = function () {
                            arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                            return nativeMethod.apply(this, arguments);
                        };
                    });

                    // support for addIceCandidate(null or undefined)
                    var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
                    window.RTCPeerConnection.prototype.addIceCandidate = function () {
                        if (!arguments[0]) {
                            if (arguments[1]) {
                                arguments[1].apply(null);
                            }
                            return Promise.resolve();
                        }
                        return nativeAddIceCandidate.apply(this, arguments);
                    };
                }
            };
        }, { "../utils.js": 14, "./getusermedia": 6 }], 6: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var utils = require('../utils.js');
            var logging = utils.log;

            // Expose public methods.
            module.exports = function (window) {
                var browserDetails = utils.detectBrowser(window);
                var navigator = window && window.navigator;

                var constraintsToChrome_ = function constraintsToChrome_(c) {
                    if ((typeof c === "undefined" ? "undefined" : _typeof(c)) !== 'object' || c.mandatory || c.optional) {
                        return c;
                    }
                    var cc = {};
                    Object.keys(c).forEach(function (key) {
                        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
                            return;
                        }
                        var r = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
                        if (r.exact !== undefined && typeof r.exact === 'number') {
                            r.min = r.max = r.exact;
                        }
                        var oldname_ = function oldname_(prefix, name) {
                            if (prefix) {
                                return prefix + name.charAt(0).toUpperCase() + name.slice(1);
                            }
                            return name === 'deviceId' ? 'sourceId' : name;
                        };
                        if (r.ideal !== undefined) {
                            cc.optional = cc.optional || [];
                            var oc = {};
                            if (typeof r.ideal === 'number') {
                                oc[oldname_('min', key)] = r.ideal;
                                cc.optional.push(oc);
                                oc = {};
                                oc[oldname_('max', key)] = r.ideal;
                                cc.optional.push(oc);
                            } else {
                                oc[oldname_('', key)] = r.ideal;
                                cc.optional.push(oc);
                            }
                        }
                        if (r.exact !== undefined && typeof r.exact !== 'number') {
                            cc.mandatory = cc.mandatory || {};
                            cc.mandatory[oldname_('', key)] = r.exact;
                        } else {
                            ['min', 'max'].forEach(function (mix) {
                                if (r[mix] !== undefined) {
                                    cc.mandatory = cc.mandatory || {};
                                    cc.mandatory[oldname_(mix, key)] = r[mix];
                                }
                            });
                        }
                    });
                    if (c.advanced) {
                        cc.optional = (cc.optional || []).concat(c.advanced);
                    }
                    return cc;
                };

                var shimConstraints_ = function shimConstraints_(constraints, func) {
                    if (browserDetails.version >= 61) {
                        return func(constraints);
                    }
                    constraints = JSON.parse(JSON.stringify(constraints));
                    if (constraints && _typeof(constraints.audio) === 'object') {
                        var remap = function remap(obj, a, b) {
                            if (a in obj && !(b in obj)) {
                                obj[b] = obj[a];
                                delete obj[a];
                            }
                        };
                        constraints = JSON.parse(JSON.stringify(constraints));
                        remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
                        remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
                        constraints.audio = constraintsToChrome_(constraints.audio);
                    }
                    if (constraints && _typeof(constraints.video) === 'object') {
                        // Shim facingMode for mobile & surface pro.
                        var face = constraints.video.facingMode;
                        face = face && ((typeof face === "undefined" ? "undefined" : _typeof(face)) === 'object' ? face : { ideal: face });
                        var getSupportedFacingModeLies = browserDetails.version < 66;

                        if (face && (face.exact === 'user' || face.exact === 'environment' || face.ideal === 'user' || face.ideal === 'environment') && !(navigator.mediaDevices.getSupportedConstraints && navigator.mediaDevices.getSupportedConstraints().facingMode && !getSupportedFacingModeLies)) {
                            delete constraints.video.facingMode;
                            var matches;
                            if (face.exact === 'environment' || face.ideal === 'environment') {
                                matches = ['back', 'rear'];
                            } else if (face.exact === 'user' || face.ideal === 'user') {
                                matches = ['front'];
                            }
                            if (matches) {
                                // Look for matches in label, or use last cam for back (typical).
                                return navigator.mediaDevices.enumerateDevices().then(function (devices) {
                                    devices = devices.filter(function (d) {
                                        return d.kind === 'videoinput';
                                    });
                                    var dev = devices.find(function (d) {
                                        return matches.some(function (match) {
                                            return d.label.toLowerCase().indexOf(match) !== -1;
                                        });
                                    });
                                    if (!dev && devices.length && matches.indexOf('back') !== -1) {
                                        dev = devices[devices.length - 1]; // more likely the back cam
                                    }
                                    if (dev) {
                                        constraints.video.deviceId = face.exact ? { exact: dev.deviceId } : { ideal: dev.deviceId };
                                    }
                                    constraints.video = constraintsToChrome_(constraints.video);
                                    logging('chrome: ' + JSON.stringify(constraints));
                                    return func(constraints);
                                });
                            }
                        }
                        constraints.video = constraintsToChrome_(constraints.video);
                    }
                    logging('chrome: ' + JSON.stringify(constraints));
                    return func(constraints);
                };

                var shimError_ = function shimError_(e) {
                    return {
                        name: {
                            PermissionDeniedError: 'NotAllowedError',
                            PermissionDismissedError: 'NotAllowedError',
                            InvalidStateError: 'NotAllowedError',
                            DevicesNotFoundError: 'NotFoundError',
                            ConstraintNotSatisfiedError: 'OverconstrainedError',
                            TrackStartError: 'NotReadableError',
                            MediaDeviceFailedDueToShutdown: 'NotAllowedError',
                            MediaDeviceKillSwitchOn: 'NotAllowedError',
                            TabCaptureError: 'AbortError',
                            ScreenCaptureError: 'AbortError',
                            DeviceCaptureError: 'AbortError'
                        }[e.name] || e.name,
                        message: e.message,
                        constraint: e.constraintName,
                        toString: function toString() {
                            return this.name + (this.message && ': ') + this.message;
                        }
                    };
                };

                var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
                    shimConstraints_(constraints, function (c) {
                        navigator.webkitGetUserMedia(c, onSuccess, function (e) {
                            if (onError) {
                                onError(shimError_(e));
                            }
                        });
                    });
                };

                navigator.getUserMedia = getUserMedia_;

                // Returns the result of getUserMedia as a Promise.
                var getUserMediaPromise_ = function getUserMediaPromise_(constraints) {
                    return new Promise(function (resolve, reject) {
                        navigator.getUserMedia(constraints, resolve, reject);
                    });
                };

                if (!navigator.mediaDevices) {
                    navigator.mediaDevices = {
                        getUserMedia: getUserMediaPromise_,
                        enumerateDevices: function enumerateDevices() {
                            return new Promise(function (resolve) {
                                var kinds = { audio: 'audioinput', video: 'videoinput' };
                                return window.MediaStreamTrack.getSources(function (devices) {
                                    resolve(devices.map(function (device) {
                                        return { label: device.label,
                                            kind: kinds[device.kind],
                                            deviceId: device.id,
                                            groupId: '' };
                                    }));
                                });
                            });
                        },
                        getSupportedConstraints: function getSupportedConstraints() {
                            return {
                                deviceId: true, echoCancellation: true, facingMode: true,
                                frameRate: true, height: true, width: true
                            };
                        }
                    };
                }

                // A shim for getUserMedia method on the mediaDevices object.
                // TODO(KaptenJansson) remove once implemented in Chrome stable.
                if (!navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia = function (constraints) {
                        return getUserMediaPromise_(constraints);
                    };
                } else {
                    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
                    // function which returns a Promise, it does not accept spec-style
                    // constraints.
                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function (cs) {
                        return shimConstraints_(cs, function (c) {
                            return origGetUserMedia(c).then(function (stream) {
                                if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                                    stream.getTracks().forEach(function (track) {
                                        track.stop();
                                    });
                                    throw new DOMException('', 'NotFoundError');
                                }
                                return stream;
                            }, function (e) {
                                return Promise.reject(shimError_(e));
                            });
                        });
                    };
                }

                // Dummy devicechange event methods.
                // TODO(KaptenJansson) remove once implemented in Chrome stable.
                if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
                    navigator.mediaDevices.addEventListener = function () {
                        logging('Dummy mediaDevices.addEventListener called.');
                    };
                }
                if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
                    navigator.mediaDevices.removeEventListener = function () {
                        logging('Dummy mediaDevices.removeEventListener called.');
                    };
                }
            };
        }, { "../utils.js": 14 }], 7: [function (require, module, exports) {
            /*
            *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var SDPUtils = require('sdp');
            var utils = require('./utils');

            module.exports = {
                shimRTCIceCandidate: function shimRTCIceCandidate(window) {
                    // foundation is arbitrarily chosen as an indicator for full support for
                    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
                    if (!window.RTCIceCandidate || window.RTCIceCandidate && 'foundation' in window.RTCIceCandidate.prototype) {
                        return;
                    }

                    var NativeRTCIceCandidate = window.RTCIceCandidate;
                    window.RTCIceCandidate = function (args) {
                        // Remove the a= which shouldn't be part of the candidate string.
                        if ((typeof args === "undefined" ? "undefined" : _typeof(args)) === 'object' && args.candidate && args.candidate.indexOf('a=') === 0) {
                            args = JSON.parse(JSON.stringify(args));
                            args.candidate = args.candidate.substr(2);
                        }

                        if (args.candidate && args.candidate.length) {
                            // Augment the native candidate with the parsed fields.
                            var nativeCandidate = new NativeRTCIceCandidate(args);
                            var parsedCandidate = SDPUtils.parseCandidate(args.candidate);
                            var augmentedCandidate = Object.assign(nativeCandidate, parsedCandidate);

                            // Add a serializer that does not serialize the extra attributes.
                            augmentedCandidate.toJSON = function () {
                                return {
                                    candidate: augmentedCandidate.candidate,
                                    sdpMid: augmentedCandidate.sdpMid,
                                    sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
                                    usernameFragment: augmentedCandidate.usernameFragment
                                };
                            };
                            return augmentedCandidate;
                        }
                        return new NativeRTCIceCandidate(args);
                    };
                    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

                    // Hook up the augmented candidate in onicecandidate and
                    // addEventListener('icecandidate', ...)
                    utils.wrapPeerConnectionEvent(window, 'icecandidate', function (e) {
                        if (e.candidate) {
                            Object.defineProperty(e, 'candidate', {
                                value: new window.RTCIceCandidate(e.candidate),
                                writable: 'false'
                            });
                        }
                        return e;
                    });
                },

                // shimCreateObjectURL must be called before shimSourceObject to avoid loop.

                shimCreateObjectURL: function shimCreateObjectURL(window) {
                    var URL = window && window.URL;

                    if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.HTMLMediaElement && 'srcObject' in window.HTMLMediaElement.prototype && URL.createObjectURL && URL.revokeObjectURL)) {
                        // Only shim CreateObjectURL using srcObject if srcObject exists.
                        return undefined;
                    }

                    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
                    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
                    var streams = new Map(),
                        newId = 0;

                    URL.createObjectURL = function (stream) {
                        if ('getTracks' in stream) {
                            var url = 'polyblob:' + ++newId;
                            streams.set(url, stream);
                            utils.deprecated('URL.createObjectURL(stream)', 'elem.srcObject = stream');
                            return url;
                        }
                        return nativeCreateObjectURL(stream);
                    };
                    URL.revokeObjectURL = function (url) {
                        nativeRevokeObjectURL(url);
                        streams.delete(url);
                    };

                    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype, 'src');
                    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
                        get: function get() {
                            return dsc.get.apply(this);
                        },
                        set: function set(url) {
                            this.srcObject = streams.get(url) || null;
                            return dsc.set.apply(this, [url]);
                        }
                    });

                    var nativeSetAttribute = window.HTMLMediaElement.prototype.setAttribute;
                    window.HTMLMediaElement.prototype.setAttribute = function () {
                        if (arguments.length === 2 && ('' + arguments[0]).toLowerCase() === 'src') {
                            this.srcObject = streams.get(arguments[1]) || null;
                        }
                        return nativeSetAttribute.apply(this, arguments);
                    };
                },

                shimMaxMessageSize: function shimMaxMessageSize(window) {
                    if (window.RTCSctpTransport || !window.RTCPeerConnection) {
                        return;
                    }
                    var browserDetails = utils.detectBrowser(window);

                    if (!('sctp' in window.RTCPeerConnection.prototype)) {
                        Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
                            get: function get() {
                                return typeof this._sctp === 'undefined' ? null : this._sctp;
                            }
                        });
                    }

                    var sctpInDescription = function sctpInDescription(description) {
                        var sections = SDPUtils.splitSections(description.sdp);
                        sections.shift();
                        return sections.some(function (mediaSection) {
                            var mLine = SDPUtils.parseMLine(mediaSection);
                            return mLine && mLine.kind === 'application' && mLine.protocol.indexOf('SCTP') !== -1;
                        });
                    };

                    var getRemoteFirefoxVersion = function getRemoteFirefoxVersion(description) {
                        // TODO: Is there a better solution for detecting Firefox?
                        var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
                        if (match === null || match.length < 2) {
                            return -1;
                        }
                        var version = parseInt(match[1], 10);
                        // Test for NaN (yes, this is ugly)
                        return version !== version ? -1 : version;
                    };

                    var getCanSendMaxMessageSize = function getCanSendMaxMessageSize(remoteIsFirefox) {
                        // Every implementation we know can send at least 64 KiB.
                        // Note: Although Chrome is technically able to send up to 256 KiB, the
                        //       data does not reach the other peer reliably.
                        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
                        var canSendMaxMessageSize = 65536;
                        if (browserDetails.browser === 'firefox') {
                            if (browserDetails.version < 57) {
                                if (remoteIsFirefox === -1) {
                                    // FF < 57 will send in 16 KiB chunks using the deprecated PPID
                                    // fragmentation.
                                    canSendMaxMessageSize = 16384;
                                } else {
                                    // However, other FF (and RAWRTC) can reassemble PPID-fragmented
                                    // messages. Thus, supporting ~2 GiB when sending.
                                    canSendMaxMessageSize = 2147483637;
                                }
                            } else if (browserDetails.version < 60) {
                                // Currently, all FF >= 57 will reset the remote maximum message size
                                // to the default value when a data channel is created at a later
                                // stage. :(
                                // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
                                canSendMaxMessageSize = browserDetails.version === 57 ? 65535 : 65536;
                            } else {
                                // FF >= 60 supports sending ~2 GiB
                                canSendMaxMessageSize = 2147483637;
                            }
                        }
                        return canSendMaxMessageSize;
                    };

                    var getMaxMessageSize = function getMaxMessageSize(description, remoteIsFirefox) {
                        // Note: 65536 bytes is the default value from the SDP spec. Also,
                        //       every implementation we know supports receiving 65536 bytes.
                        var maxMessageSize = 65536;

                        // FF 57 has a slightly incorrect default remote max message size, so
                        // we need to adjust it here to avoid a failure when sending.
                        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
                        if (browserDetails.browser === 'firefox' && browserDetails.version === 57) {
                            maxMessageSize = 65535;
                        }

                        var match = SDPUtils.matchPrefix(description.sdp, 'a=max-message-size:');
                        if (match.length > 0) {
                            maxMessageSize = parseInt(match[0].substr(19), 10);
                        } else if (browserDetails.browser === 'firefox' && remoteIsFirefox !== -1) {
                            // If the maximum message size is not present in the remote SDP and
                            // both local and remote are Firefox, the remote peer can receive
                            // ~2 GiB.
                            maxMessageSize = 2147483637;
                        }
                        return maxMessageSize;
                    };

                    var origSetRemoteDescription = window.RTCPeerConnection.prototype.setRemoteDescription;
                    window.RTCPeerConnection.prototype.setRemoteDescription = function () {
                        var pc = this;
                        pc._sctp = null;

                        if (sctpInDescription(arguments[0])) {
                            // Check if the remote is FF.
                            var isFirefox = getRemoteFirefoxVersion(arguments[0]);

                            // Get the maximum message size the local peer is capable of sending
                            var canSendMMS = getCanSendMaxMessageSize(isFirefox);

                            // Get the maximum message size of the remote peer.
                            var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

                            // Determine final maximum message size
                            var maxMessageSize;
                            if (canSendMMS === 0 && remoteMMS === 0) {
                                maxMessageSize = Number.POSITIVE_INFINITY;
                            } else if (canSendMMS === 0 || remoteMMS === 0) {
                                maxMessageSize = Math.max(canSendMMS, remoteMMS);
                            } else {
                                maxMessageSize = Math.min(canSendMMS, remoteMMS);
                            }

                            // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
                            // attribute.
                            var sctp = {};
                            Object.defineProperty(sctp, 'maxMessageSize', {
                                get: function get() {
                                    return maxMessageSize;
                                }
                            });
                            pc._sctp = sctp;
                        }

                        return origSetRemoteDescription.apply(pc, arguments);
                    };
                },

                shimSendThrowTypeError: function shimSendThrowTypeError(window) {
                    if (!(window.RTCPeerConnection && 'createDataChannel' in window.RTCPeerConnection.prototype)) {
                        return;
                    }

                    // Note: Although Firefox >= 57 has a native implementation, the maximum
                    //       message size can be reset for all data channels at a later stage.
                    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

                    function wrapDcSend(dc, pc) {
                        var origDataChannelSend = dc.send;
                        dc.send = function () {
                            var data = arguments[0];
                            var length = data.length || data.size || data.byteLength;
                            if (dc.readyState === 'open' && pc.sctp && length > pc.sctp.maxMessageSize) {
                                throw new TypeError('Message too large (can send a maximum of ' + pc.sctp.maxMessageSize + ' bytes)');
                            }
                            return origDataChannelSend.apply(dc, arguments);
                        };
                    }
                    var origCreateDataChannel = window.RTCPeerConnection.prototype.createDataChannel;
                    window.RTCPeerConnection.prototype.createDataChannel = function () {
                        var pc = this;
                        var dataChannel = origCreateDataChannel.apply(pc, arguments);
                        wrapDcSend(dataChannel, pc);
                        return dataChannel;
                    };
                    utils.wrapPeerConnectionEvent(window, 'datachannel', function (e) {
                        wrapDcSend(e.channel, e.target);
                        return e;
                    });
                }
            };
        }, { "./utils": 14, "sdp": 2 }], 8: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var utils = require('../utils');
            var filterIceServers = require('./filtericeservers');
            var shimRTCPeerConnection = require('rtcpeerconnection-shim');

            module.exports = {
                shimGetUserMedia: require('./getusermedia'),
                shimPeerConnection: function shimPeerConnection(window) {
                    var browserDetails = utils.detectBrowser(window);

                    if (window.RTCIceGatherer) {
                        if (!window.RTCIceCandidate) {
                            window.RTCIceCandidate = function (args) {
                                return args;
                            };
                        }
                        if (!window.RTCSessionDescription) {
                            window.RTCSessionDescription = function (args) {
                                return args;
                            };
                        }
                        // this adds an additional event listener to MediaStrackTrack that signals
                        // when a tracks enabled property was changed. Workaround for a bug in
                        // addStream, see below. No longer required in 15025+
                        if (browserDetails.version < 15025) {
                            var origMSTEnabled = Object.getOwnPropertyDescriptor(window.MediaStreamTrack.prototype, 'enabled');
                            Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
                                set: function set(value) {
                                    origMSTEnabled.set.call(this, value);
                                    var ev = new Event('enabled');
                                    ev.enabled = value;
                                    this.dispatchEvent(ev);
                                }
                            });
                        }
                    }

                    // ORTC defines the DTMF sender a bit different.
                    // https://github.com/w3c/ortc/issues/714
                    if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
                        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
                            get: function get() {
                                if (this._dtmf === undefined) {
                                    if (this.track.kind === 'audio') {
                                        this._dtmf = new window.RTCDtmfSender(this);
                                    } else if (this.track.kind === 'video') {
                                        this._dtmf = null;
                                    }
                                }
                                return this._dtmf;
                            }
                        });
                    }
                    // Edge currently only implements the RTCDtmfSender, not the
                    // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
                    if (window.RTCDtmfSender && !window.RTCDTMFSender) {
                        window.RTCDTMFSender = window.RTCDtmfSender;
                    }

                    var RTCPeerConnectionShim = shimRTCPeerConnection(window, browserDetails.version);
                    window.RTCPeerConnection = function (config) {
                        if (config.iceServers) {
                            config.iceServers = filterIceServers(config.iceServers);
                        }
                        return new RTCPeerConnectionShim(config);
                    };
                    window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
                },
                shimReplaceTrack: function shimReplaceTrack(window) {
                    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
                    if (window.RTCRtpSender && !('replaceTrack' in window.RTCRtpSender.prototype)) {
                        window.RTCRtpSender.prototype.replaceTrack = window.RTCRtpSender.prototype.setTrack;
                    }
                }
            };
        }, { "../utils": 14, "./filtericeservers": 9, "./getusermedia": 10, "rtcpeerconnection-shim": 1 }], 9: [function (require, module, exports) {
            /*
            *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var utils = require('../utils');
            // Edge does not like
            // 1) stun: filtered after 14393 unless ?transport=udp is present
            // 2) turn: that does not have all of turn:host:port?transport=udp
            // 3) turn: with ipv6 addresses
            // 4) turn: occurring muliple times
            module.exports = function (iceServers, edgeVersion) {
                var hasTurn = false;
                iceServers = JSON.parse(JSON.stringify(iceServers));
                return iceServers.filter(function (server) {
                    if (server && (server.urls || server.url)) {
                        var urls = server.urls || server.url;
                        if (server.url && !server.urls) {
                            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
                        }
                        var isString = typeof urls === 'string';
                        if (isString) {
                            urls = [urls];
                        }
                        urls = urls.filter(function (url) {
                            var validTurn = url.indexOf('turn:') === 0 && url.indexOf('transport=udp') !== -1 && url.indexOf('turn:[') === -1 && !hasTurn;

                            if (validTurn) {
                                hasTurn = true;
                                return true;
                            }
                            return url.indexOf('stun:') === 0 && edgeVersion >= 14393 && url.indexOf('?transport=udp') === -1;
                        });

                        delete server.url;
                        server.urls = isString ? urls[0] : urls;
                        return !!urls.length;
                    }
                });
            };
        }, { "../utils": 14 }], 10: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            // Expose public methods.

            module.exports = function (window) {
                var navigator = window && window.navigator;

                var shimError_ = function shimError_(e) {
                    return {
                        name: { PermissionDeniedError: 'NotAllowedError' }[e.name] || e.name,
                        message: e.message,
                        constraint: e.constraint,
                        toString: function toString() {
                            return this.name;
                        }
                    };
                };

                // getUserMedia error shim.
                var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                navigator.mediaDevices.getUserMedia = function (c) {
                    return origGetUserMedia(c).catch(function (e) {
                        return Promise.reject(shimError_(e));
                    });
                };
            };
        }, {}], 11: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var utils = require('../utils');

            module.exports = {
                shimGetUserMedia: require('./getusermedia'),
                shimOnTrack: function shimOnTrack(window) {
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && !('ontrack' in window.RTCPeerConnection.prototype)) {
                        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
                            get: function get() {
                                return this._ontrack;
                            },
                            set: function set(f) {
                                if (this._ontrack) {
                                    this.removeEventListener('track', this._ontrack);
                                    this.removeEventListener('addstream', this._ontrackpoly);
                                }
                                this.addEventListener('track', this._ontrack = f);
                                this.addEventListener('addstream', this._ontrackpoly = function (e) {
                                    e.stream.getTracks().forEach(function (track) {
                                        var event = new Event('track');
                                        event.track = track;
                                        event.receiver = { track: track };
                                        event.transceiver = { receiver: event.receiver };
                                        event.streams = [e.stream];
                                        this.dispatchEvent(event);
                                    }.bind(this));
                                }.bind(this));
                            }
                        });
                    }
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCTrackEvent && 'receiver' in window.RTCTrackEvent.prototype && !('transceiver' in window.RTCTrackEvent.prototype)) {
                        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
                            get: function get() {
                                return { receiver: this.receiver };
                            }
                        });
                    }
                },

                shimSourceObject: function shimSourceObject(window) {
                    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
                        if (window.HTMLMediaElement && !('srcObject' in window.HTMLMediaElement.prototype)) {
                            // Shim the srcObject property, once, when HTMLMediaElement is found.
                            Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
                                get: function get() {
                                    return this.mozSrcObject;
                                },
                                set: function set(stream) {
                                    this.mozSrcObject = stream;
                                }
                            });
                        }
                    }
                },

                shimPeerConnection: function shimPeerConnection(window) {
                    var browserDetails = utils.detectBrowser(window);

                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object' || !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
                        return; // probably media.peerconnection.enabled=false in about:config
                    }
                    // The RTCPeerConnection object.
                    if (!window.RTCPeerConnection) {
                        window.RTCPeerConnection = function (pcConfig, pcConstraints) {
                            if (browserDetails.version < 38) {
                                // .urls is not supported in FF < 38.
                                // create RTCIceServers with a single url.
                                if (pcConfig && pcConfig.iceServers) {
                                    var newIceServers = [];
                                    for (var i = 0; i < pcConfig.iceServers.length; i++) {
                                        var server = pcConfig.iceServers[i];
                                        if (server.hasOwnProperty('urls')) {
                                            for (var j = 0; j < server.urls.length; j++) {
                                                var newServer = {
                                                    url: server.urls[j]
                                                };
                                                if (server.urls[j].indexOf('turn') === 0) {
                                                    newServer.username = server.username;
                                                    newServer.credential = server.credential;
                                                }
                                                newIceServers.push(newServer);
                                            }
                                        } else {
                                            newIceServers.push(pcConfig.iceServers[i]);
                                        }
                                    }
                                    pcConfig.iceServers = newIceServers;
                                }
                            }
                            return new window.mozRTCPeerConnection(pcConfig, pcConstraints);
                        };
                        window.RTCPeerConnection.prototype = window.mozRTCPeerConnection.prototype;

                        // wrap static methods. Currently just generateCertificate.
                        if (window.mozRTCPeerConnection.generateCertificate) {
                            Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
                                get: function get() {
                                    return window.mozRTCPeerConnection.generateCertificate;
                                }
                            });
                        }

                        window.RTCSessionDescription = window.mozRTCSessionDescription;
                        window.RTCIceCandidate = window.mozRTCIceCandidate;
                    }

                    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
                    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'].forEach(function (method) {
                        var nativeMethod = window.RTCPeerConnection.prototype[method];
                        window.RTCPeerConnection.prototype[method] = function () {
                            arguments[0] = new (method === 'addIceCandidate' ? window.RTCIceCandidate : window.RTCSessionDescription)(arguments[0]);
                            return nativeMethod.apply(this, arguments);
                        };
                    });

                    // support for addIceCandidate(null or undefined)
                    var nativeAddIceCandidate = window.RTCPeerConnection.prototype.addIceCandidate;
                    window.RTCPeerConnection.prototype.addIceCandidate = function () {
                        if (!arguments[0]) {
                            if (arguments[1]) {
                                arguments[1].apply(null);
                            }
                            return Promise.resolve();
                        }
                        return nativeAddIceCandidate.apply(this, arguments);
                    };

                    // shim getStats with maplike support
                    var makeMapStats = function makeMapStats(stats) {
                        var map = new Map();
                        Object.keys(stats).forEach(function (key) {
                            map.set(key, stats[key]);
                            map[key] = stats[key];
                        });
                        return map;
                    };

                    var modernStatsTypes = {
                        inboundrtp: 'inbound-rtp',
                        outboundrtp: 'outbound-rtp',
                        candidatepair: 'candidate-pair',
                        localcandidate: 'local-candidate',
                        remotecandidate: 'remote-candidate'
                    };

                    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
                    window.RTCPeerConnection.prototype.getStats = function (selector, onSucc, onErr) {
                        return nativeGetStats.apply(this, [selector || null]).then(function (stats) {
                            if (browserDetails.version < 48) {
                                stats = makeMapStats(stats);
                            }
                            if (browserDetails.version < 53 && !onSucc) {
                                // Shim only promise getStats with spec-hyphens in type names
                                // Leave callback version alone; misc old uses of forEach before Map
                                try {
                                    stats.forEach(function (stat) {
                                        stat.type = modernStatsTypes[stat.type] || stat.type;
                                    });
                                } catch (e) {
                                    if (e.name !== 'TypeError') {
                                        throw e;
                                    }
                                    // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
                                    stats.forEach(function (stat, i) {
                                        stats.set(i, Object.assign({}, stat, {
                                            type: modernStatsTypes[stat.type] || stat.type
                                        }));
                                    });
                                }
                            }
                            return stats;
                        }).then(onSucc, onErr);
                    };
                },

                shimSenderGetStats: function shimSenderGetStats(window) {
                    if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
                        return;
                    }
                    if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
                        return;
                    }
                    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
                    if (origGetSenders) {
                        window.RTCPeerConnection.prototype.getSenders = function () {
                            var pc = this;
                            var senders = origGetSenders.apply(pc, []);
                            senders.forEach(function (sender) {
                                sender._pc = pc;
                            });
                            return senders;
                        };
                    }

                    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
                    if (origAddTrack) {
                        window.RTCPeerConnection.prototype.addTrack = function () {
                            var sender = origAddTrack.apply(this, arguments);
                            sender._pc = this;
                            return sender;
                        };
                    }
                    window.RTCRtpSender.prototype.getStats = function () {
                        return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map());
                    };
                },

                shimReceiverGetStats: function shimReceiverGetStats(window) {
                    if (!((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && window.RTCRtpSender)) {
                        return;
                    }
                    if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
                        return;
                    }
                    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
                    if (origGetReceivers) {
                        window.RTCPeerConnection.prototype.getReceivers = function () {
                            var pc = this;
                            var receivers = origGetReceivers.apply(pc, []);
                            receivers.forEach(function (receiver) {
                                receiver._pc = pc;
                            });
                            return receivers;
                        };
                    }
                    utils.wrapPeerConnectionEvent(window, 'track', function (e) {
                        e.receiver._pc = e.srcElement;
                        return e;
                    });
                    window.RTCRtpReceiver.prototype.getStats = function () {
                        return this._pc.getStats(this.track);
                    };
                },

                shimRemoveStream: function shimRemoveStream(window) {
                    if (!window.RTCPeerConnection || 'removeStream' in window.RTCPeerConnection.prototype) {
                        return;
                    }
                    window.RTCPeerConnection.prototype.removeStream = function (stream) {
                        var pc = this;
                        utils.deprecated('removeStream', 'removeTrack');
                        this.getSenders().forEach(function (sender) {
                            if (sender.track && stream.getTracks().indexOf(sender.track) !== -1) {
                                pc.removeTrack(sender);
                            }
                        });
                    };
                },

                shimRTCDataChannel: function shimRTCDataChannel(window) {
                    // rename DataChannel to RTCDataChannel (native fix in FF60):
                    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
                    if (window.DataChannel && !window.RTCDataChannel) {
                        window.RTCDataChannel = window.DataChannel;
                    }
                }
            };
        }, { "../utils": 14, "./getusermedia": 12 }], 12: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var utils = require('../utils');
            var logging = utils.log;

            // Expose public methods.
            module.exports = function (window) {
                var browserDetails = utils.detectBrowser(window);
                var navigator = window && window.navigator;
                var MediaStreamTrack = window && window.MediaStreamTrack;

                var shimError_ = function shimError_(e) {
                    return {
                        name: {
                            InternalError: 'NotReadableError',
                            NotSupportedError: 'TypeError',
                            PermissionDeniedError: 'NotAllowedError',
                            SecurityError: 'NotAllowedError'
                        }[e.name] || e.name,
                        message: {
                            'The operation is insecure.': 'The request is not allowed by the ' + 'user agent or the platform in the current context.'
                        }[e.message] || e.message,
                        constraint: e.constraint,
                        toString: function toString() {
                            return this.name + (this.message && ': ') + this.message;
                        }
                    };
                };

                // getUserMedia constraints shim.
                var getUserMedia_ = function getUserMedia_(constraints, onSuccess, onError) {
                    var constraintsToFF37_ = function constraintsToFF37_(c) {
                        if ((typeof c === "undefined" ? "undefined" : _typeof(c)) !== 'object' || c.require) {
                            return c;
                        }
                        var require = [];
                        Object.keys(c).forEach(function (key) {
                            if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
                                return;
                            }
                            var r = c[key] = _typeof(c[key]) === 'object' ? c[key] : { ideal: c[key] };
                            if (r.min !== undefined || r.max !== undefined || r.exact !== undefined) {
                                require.push(key);
                            }
                            if (r.exact !== undefined) {
                                if (typeof r.exact === 'number') {
                                    r.min = r.max = r.exact;
                                } else {
                                    c[key] = r.exact;
                                }
                                delete r.exact;
                            }
                            if (r.ideal !== undefined) {
                                c.advanced = c.advanced || [];
                                var oc = {};
                                if (typeof r.ideal === 'number') {
                                    oc[key] = { min: r.ideal, max: r.ideal };
                                } else {
                                    oc[key] = r.ideal;
                                }
                                c.advanced.push(oc);
                                delete r.ideal;
                                if (!Object.keys(r).length) {
                                    delete c[key];
                                }
                            }
                        });
                        if (require.length) {
                            c.require = require;
                        }
                        return c;
                    };
                    constraints = JSON.parse(JSON.stringify(constraints));
                    if (browserDetails.version < 38) {
                        logging('spec: ' + JSON.stringify(constraints));
                        if (constraints.audio) {
                            constraints.audio = constraintsToFF37_(constraints.audio);
                        }
                        if (constraints.video) {
                            constraints.video = constraintsToFF37_(constraints.video);
                        }
                        logging('ff37: ' + JSON.stringify(constraints));
                    }
                    return navigator.mozGetUserMedia(constraints, onSuccess, function (e) {
                        onError(shimError_(e));
                    });
                };

                // Returns the result of getUserMedia as a Promise.
                var getUserMediaPromise_ = function getUserMediaPromise_(constraints) {
                    return new Promise(function (resolve, reject) {
                        getUserMedia_(constraints, resolve, reject);
                    });
                };

                // Shim for mediaDevices on older versions.
                if (!navigator.mediaDevices) {
                    navigator.mediaDevices = { getUserMedia: getUserMediaPromise_,
                        addEventListener: function addEventListener() {},
                        removeEventListener: function removeEventListener() {}
                    };
                }
                navigator.mediaDevices.enumerateDevices = navigator.mediaDevices.enumerateDevices || function () {
                    return new Promise(function (resolve) {
                        var infos = [{ kind: 'audioinput', deviceId: 'default', label: '', groupId: '' }, { kind: 'videoinput', deviceId: 'default', label: '', groupId: '' }];
                        resolve(infos);
                    });
                };

                if (browserDetails.version < 41) {
                    // Work around http://bugzil.la/1169665
                    var orgEnumerateDevices = navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
                    navigator.mediaDevices.enumerateDevices = function () {
                        return orgEnumerateDevices().then(undefined, function (e) {
                            if (e.name === 'NotFoundError') {
                                return [];
                            }
                            throw e;
                        });
                    };
                }
                if (browserDetails.version < 49) {
                    var origGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function (c) {
                        return origGetUserMedia(c).then(function (stream) {
                            // Work around https://bugzil.la/802326
                            if (c.audio && !stream.getAudioTracks().length || c.video && !stream.getVideoTracks().length) {
                                stream.getTracks().forEach(function (track) {
                                    track.stop();
                                });
                                throw new DOMException('The object can not be found here.', 'NotFoundError');
                            }
                            return stream;
                        }, function (e) {
                            return Promise.reject(shimError_(e));
                        });
                    };
                }
                if (!(browserDetails.version > 55 && 'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
                    var remap = function remap(obj, a, b) {
                        if (a in obj && !(b in obj)) {
                            obj[b] = obj[a];
                            delete obj[a];
                        }
                    };

                    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
                    navigator.mediaDevices.getUserMedia = function (c) {
                        if ((typeof c === "undefined" ? "undefined" : _typeof(c)) === 'object' && _typeof(c.audio) === 'object') {
                            c = JSON.parse(JSON.stringify(c));
                            remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
                            remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
                        }
                        return nativeGetUserMedia(c);
                    };

                    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
                        var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
                        MediaStreamTrack.prototype.getSettings = function () {
                            var obj = nativeGetSettings.apply(this, arguments);
                            remap(obj, 'mozAutoGainControl', 'autoGainControl');
                            remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
                            return obj;
                        };
                    }

                    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
                        var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
                        MediaStreamTrack.prototype.applyConstraints = function (c) {
                            if (this.kind === 'audio' && (typeof c === "undefined" ? "undefined" : _typeof(c)) === 'object') {
                                c = JSON.parse(JSON.stringify(c));
                                remap(c, 'autoGainControl', 'mozAutoGainControl');
                                remap(c, 'noiseSuppression', 'mozNoiseSuppression');
                            }
                            return nativeApplyConstraints.apply(this, [c]);
                        };
                    }
                }
                navigator.getUserMedia = function (constraints, onSuccess, onError) {
                    if (browserDetails.version < 44) {
                        return getUserMedia_(constraints, onSuccess, onError);
                    }
                    // Replace Firefox 44+'s deprecation warning with unprefixed version.
                    utils.deprecated('navigator.getUserMedia', 'navigator.mediaDevices.getUserMedia');
                    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
                };
            };
        }, { "../utils": 14 }], 13: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            'use strict';

            var utils = require('../utils');

            module.exports = {
                shimLocalStreamsAPI: function shimLocalStreamsAPI(window) {
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
                        return;
                    }
                    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
                        window.RTCPeerConnection.prototype.getLocalStreams = function () {
                            if (!this._localStreams) {
                                this._localStreams = [];
                            }
                            return this._localStreams;
                        };
                    }
                    if (!('getStreamById' in window.RTCPeerConnection.prototype)) {
                        window.RTCPeerConnection.prototype.getStreamById = function (id) {
                            var result = null;
                            if (this._localStreams) {
                                this._localStreams.forEach(function (stream) {
                                    if (stream.id === id) {
                                        result = stream;
                                    }
                                });
                            }
                            if (this._remoteStreams) {
                                this._remoteStreams.forEach(function (stream) {
                                    if (stream.id === id) {
                                        result = stream;
                                    }
                                });
                            }
                            return result;
                        };
                    }
                    if (!('addStream' in window.RTCPeerConnection.prototype)) {
                        var _addTrack = window.RTCPeerConnection.prototype.addTrack;
                        window.RTCPeerConnection.prototype.addStream = function (stream) {
                            if (!this._localStreams) {
                                this._localStreams = [];
                            }
                            if (this._localStreams.indexOf(stream) === -1) {
                                this._localStreams.push(stream);
                            }
                            var pc = this;
                            stream.getTracks().forEach(function (track) {
                                _addTrack.call(pc, track, stream);
                            });
                        };

                        window.RTCPeerConnection.prototype.addTrack = function (track, stream) {
                            if (stream) {
                                if (!this._localStreams) {
                                    this._localStreams = [stream];
                                } else if (this._localStreams.indexOf(stream) === -1) {
                                    this._localStreams.push(stream);
                                }
                            }
                            return _addTrack.call(this, track, stream);
                        };
                    }
                    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
                        window.RTCPeerConnection.prototype.removeStream = function (stream) {
                            if (!this._localStreams) {
                                this._localStreams = [];
                            }
                            var index = this._localStreams.indexOf(stream);
                            if (index === -1) {
                                return;
                            }
                            this._localStreams.splice(index, 1);
                            var pc = this;
                            var tracks = stream.getTracks();
                            this.getSenders().forEach(function (sender) {
                                if (tracks.indexOf(sender.track) !== -1) {
                                    pc.removeTrack(sender);
                                }
                            });
                        };
                    }
                },
                shimRemoteStreamsAPI: function shimRemoteStreamsAPI(window) {
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
                        return;
                    }
                    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
                        window.RTCPeerConnection.prototype.getRemoteStreams = function () {
                            return this._remoteStreams ? this._remoteStreams : [];
                        };
                    }
                    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
                        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
                            get: function get() {
                                return this._onaddstream;
                            },
                            set: function set(f) {
                                var pc = this;
                                if (this._onaddstream) {
                                    this.removeEventListener('addstream', this._onaddstream);
                                    this.removeEventListener('track', this._onaddstreampoly);
                                }
                                this.addEventListener('addstream', this._onaddstream = f);
                                this.addEventListener('track', this._onaddstreampoly = function (e) {
                                    e.streams.forEach(function (stream) {
                                        if (!pc._remoteStreams) {
                                            pc._remoteStreams = [];
                                        }
                                        if (pc._remoteStreams.indexOf(stream) >= 0) {
                                            return;
                                        }
                                        pc._remoteStreams.push(stream);
                                        var event = new Event('addstream');
                                        event.stream = stream;
                                        pc.dispatchEvent(event);
                                    });
                                });
                            }
                        });
                    }
                },
                shimCallbacksAPI: function shimCallbacksAPI(window) {
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) !== 'object' || !window.RTCPeerConnection) {
                        return;
                    }
                    var prototype = window.RTCPeerConnection.prototype;
                    var createOffer = prototype.createOffer;
                    var createAnswer = prototype.createAnswer;
                    var setLocalDescription = prototype.setLocalDescription;
                    var setRemoteDescription = prototype.setRemoteDescription;
                    var addIceCandidate = prototype.addIceCandidate;

                    prototype.createOffer = function (successCallback, failureCallback) {
                        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
                        var promise = createOffer.apply(this, [options]);
                        if (!failureCallback) {
                            return promise;
                        }
                        promise.then(successCallback, failureCallback);
                        return Promise.resolve();
                    };

                    prototype.createAnswer = function (successCallback, failureCallback) {
                        var options = arguments.length >= 2 ? arguments[2] : arguments[0];
                        var promise = createAnswer.apply(this, [options]);
                        if (!failureCallback) {
                            return promise;
                        }
                        promise.then(successCallback, failureCallback);
                        return Promise.resolve();
                    };

                    var withCallback = function withCallback(description, successCallback, failureCallback) {
                        var promise = setLocalDescription.apply(this, [description]);
                        if (!failureCallback) {
                            return promise;
                        }
                        promise.then(successCallback, failureCallback);
                        return Promise.resolve();
                    };
                    prototype.setLocalDescription = withCallback;

                    withCallback = function withCallback(description, successCallback, failureCallback) {
                        var promise = setRemoteDescription.apply(this, [description]);
                        if (!failureCallback) {
                            return promise;
                        }
                        promise.then(successCallback, failureCallback);
                        return Promise.resolve();
                    };
                    prototype.setRemoteDescription = withCallback;

                    withCallback = function withCallback(candidate, successCallback, failureCallback) {
                        var promise = addIceCandidate.apply(this, [candidate]);
                        if (!failureCallback) {
                            return promise;
                        }
                        promise.then(successCallback, failureCallback);
                        return Promise.resolve();
                    };
                    prototype.addIceCandidate = withCallback;
                },
                shimGetUserMedia: function shimGetUserMedia(window) {
                    var navigator = window && window.navigator;

                    if (!navigator.getUserMedia) {
                        if (navigator.webkitGetUserMedia) {
                            navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
                        } else if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                            navigator.getUserMedia = function (constraints, cb, errcb) {
                                navigator.mediaDevices.getUserMedia(constraints).then(cb, errcb);
                            }.bind(navigator);
                        }
                    }
                },
                shimRTCIceServerUrls: function shimRTCIceServerUrls(window) {
                    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
                    var OrigPeerConnection = window.RTCPeerConnection;
                    window.RTCPeerConnection = function (pcConfig, pcConstraints) {
                        if (pcConfig && pcConfig.iceServers) {
                            var newIceServers = [];
                            for (var i = 0; i < pcConfig.iceServers.length; i++) {
                                var server = pcConfig.iceServers[i];
                                if (!server.hasOwnProperty('urls') && server.hasOwnProperty('url')) {
                                    utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
                                    server = JSON.parse(JSON.stringify(server));
                                    server.urls = server.url;
                                    delete server.url;
                                    newIceServers.push(server);
                                } else {
                                    newIceServers.push(pcConfig.iceServers[i]);
                                }
                            }
                            pcConfig.iceServers = newIceServers;
                        }
                        return new OrigPeerConnection(pcConfig, pcConstraints);
                    };
                    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
                    // wrap static methods. Currently just generateCertificate.
                    if ('generateCertificate' in window.RTCPeerConnection) {
                        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
                            get: function get() {
                                return OrigPeerConnection.generateCertificate;
                            }
                        });
                    }
                },
                shimTrackEventTransceiver: function shimTrackEventTransceiver(window) {
                    // Add event.transceiver member over deprecated event.receiver
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object' && window.RTCPeerConnection && 'receiver' in window.RTCTrackEvent.prototype &&
                    // can't check 'transceiver' in window.RTCTrackEvent.prototype, as it is
                    // defined for some reason even when window.RTCTransceiver is not.
                    !window.RTCTransceiver) {
                        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
                            get: function get() {
                                return { receiver: this.receiver };
                            }
                        });
                    }
                },

                shimCreateOfferLegacy: function shimCreateOfferLegacy(window) {
                    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
                    window.RTCPeerConnection.prototype.createOffer = function (offerOptions) {
                        var pc = this;
                        if (offerOptions) {
                            if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
                                // support bit values
                                offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
                            }
                            var audioTransceiver = pc.getTransceivers().find(function (transceiver) {
                                return transceiver.sender.track && transceiver.sender.track.kind === 'audio';
                            });
                            if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
                                if (audioTransceiver.direction === 'sendrecv') {
                                    if (audioTransceiver.setDirection) {
                                        audioTransceiver.setDirection('sendonly');
                                    } else {
                                        audioTransceiver.direction = 'sendonly';
                                    }
                                } else if (audioTransceiver.direction === 'recvonly') {
                                    if (audioTransceiver.setDirection) {
                                        audioTransceiver.setDirection('inactive');
                                    } else {
                                        audioTransceiver.direction = 'inactive';
                                    }
                                }
                            } else if (offerOptions.offerToReceiveAudio === true && !audioTransceiver) {
                                pc.addTransceiver('audio');
                            }

                            if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
                                // support bit values
                                offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
                            }
                            var videoTransceiver = pc.getTransceivers().find(function (transceiver) {
                                return transceiver.sender.track && transceiver.sender.track.kind === 'video';
                            });
                            if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
                                if (videoTransceiver.direction === 'sendrecv') {
                                    videoTransceiver.setDirection('sendonly');
                                } else if (videoTransceiver.direction === 'recvonly') {
                                    videoTransceiver.setDirection('inactive');
                                }
                            } else if (offerOptions.offerToReceiveVideo === true && !videoTransceiver) {
                                pc.addTransceiver('video');
                            }
                        }
                        return origCreateOffer.apply(pc, arguments);
                    };
                }
            };
        }, { "../utils": 14 }], 14: [function (require, module, exports) {
            /*
            *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
            *
            *  Use of this source code is governed by a BSD-style license
            *  that can be found in the LICENSE file in the root of the source
            *  tree.
            */
            /* eslint-env node */
            'use strict';

            var logDisabled_ = true;
            var deprecationWarnings_ = true;

            /**
             * Extract browser version out of the provided user agent string.
             *
             * @param {!string} uastring userAgent string.
             * @param {!string} expr Regular expression used as match criteria.
             * @param {!number} pos position in the version string to be returned.
             * @return {!number} browser version.
             */
            function extractVersion(uastring, expr, pos) {
                var match = uastring.match(expr);
                return match && match.length >= pos && parseInt(match[pos], 10);
            }

            // Wraps the peerconnection event eventNameToWrap in a function
            // which returns the modified event object.
            function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
                if (!window.RTCPeerConnection) {
                    return;
                }
                var proto = window.RTCPeerConnection.prototype;
                var nativeAddEventListener = proto.addEventListener;
                proto.addEventListener = function (nativeEventName, cb) {
                    if (nativeEventName !== eventNameToWrap) {
                        return nativeAddEventListener.apply(this, arguments);
                    }
                    var wrappedCallback = function wrappedCallback(e) {
                        cb(wrapper(e));
                    };
                    this._eventMap = this._eventMap || {};
                    this._eventMap[cb] = wrappedCallback;
                    return nativeAddEventListener.apply(this, [nativeEventName, wrappedCallback]);
                };

                var nativeRemoveEventListener = proto.removeEventListener;
                proto.removeEventListener = function (nativeEventName, cb) {
                    if (nativeEventName !== eventNameToWrap || !this._eventMap || !this._eventMap[cb]) {
                        return nativeRemoveEventListener.apply(this, arguments);
                    }
                    var unwrappedCb = this._eventMap[cb];
                    delete this._eventMap[cb];
                    return nativeRemoveEventListener.apply(this, [nativeEventName, unwrappedCb]);
                };

                Object.defineProperty(proto, 'on' + eventNameToWrap, {
                    get: function get() {
                        return this['_on' + eventNameToWrap];
                    },
                    set: function set(cb) {
                        if (this['_on' + eventNameToWrap]) {
                            this.removeEventListener(eventNameToWrap, this['_on' + eventNameToWrap]);
                            delete this['_on' + eventNameToWrap];
                        }
                        if (cb) {
                            this.addEventListener(eventNameToWrap, this['_on' + eventNameToWrap] = cb);
                        }
                    },
                    enumerable: true,
                    configurable: true
                });
            }

            // Utility methods.
            module.exports = {
                extractVersion: extractVersion,
                wrapPeerConnectionEvent: wrapPeerConnectionEvent,
                disableLog: function disableLog(bool) {
                    if (typeof bool !== 'boolean') {
                        return new Error('Argument type: ' + (typeof bool === "undefined" ? "undefined" : _typeof(bool)) + '. Please use a boolean.');
                    }
                    logDisabled_ = bool;
                    return bool ? 'adapter.js logging disabled' : 'adapter.js logging enabled';
                },

                /**
                 * Disable or enable deprecation warnings
                 * @param {!boolean} bool set to true to disable warnings.
                 */
                disableWarnings: function disableWarnings(bool) {
                    if (typeof bool !== 'boolean') {
                        return new Error('Argument type: ' + (typeof bool === "undefined" ? "undefined" : _typeof(bool)) + '. Please use a boolean.');
                    }
                    deprecationWarnings_ = !bool;
                    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
                },

                log: function log() {
                    if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object') {
                        if (logDisabled_) {
                            return;
                        }
                        if (typeof console !== 'undefined' && typeof console.log === 'function') {
                            console.log.apply(console, arguments);
                        }
                    }
                },

                /**
                 * Shows a deprecation warning suggesting the modern and spec-compatible API.
                 */
                deprecated: function deprecated(oldMethod, newMethod) {
                    if (!deprecationWarnings_) {
                        return;
                    }
                    console.warn(oldMethod + ' is deprecated, please use ' + newMethod + ' instead.');
                },

                /**
                 * Browser detector.
                 *
                 * @return {object} result containing browser and version
                 *     properties.
                 */
                detectBrowser: function detectBrowser(window) {
                    var navigator = window && window.navigator;

                    // Returned result object.
                    var result = {};
                    result.browser = null;
                    result.version = null;

                    // Fail early if it's not a browser
                    if (typeof window === 'undefined' || !window.navigator) {
                        result.browser = 'Not a browser.';
                        return result;
                    }

                    if (navigator.mozGetUserMedia) {
                        // Firefox.
                        result.browser = 'firefox';
                        result.version = extractVersion(navigator.userAgent, /Firefox\/(\d+)\./, 1);
                    } else if (navigator.webkitGetUserMedia) {
                        // Chrome, Chromium, Webview, Opera.
                        // Version matches Chrome/WebRTC version.
                        result.browser = 'chrome';
                        result.version = extractVersion(navigator.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
                    } else if (navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) {
                        // Edge.
                        result.browser = 'edge';
                        result.version = extractVersion(navigator.userAgent, /Edge\/(\d+).(\d+)$/, 2);
                    } else if (window.RTCPeerConnection && navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) {
                        // Safari.
                        result.browser = 'safari';
                        result.version = extractVersion(navigator.userAgent, /AppleWebKit\/(\d+)\./, 1);
                    } else {
                        // Default fallthrough: not supported.
                        result.browser = 'Not a supported browser.';
                        return result;
                    }

                    return result;
                }
            };
        }, {}] }, {}, [3])(3);
});

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var emedia = window.emedia = window.emedia || {};

var util = emedia.util = __webpack_require__(6);

emedia.config = function (cfg) {
    cfg = util.extend({}, cfg);

    for (var key in cfg) {
        emedia.config[key] = cfg[key];
        if (key === "logLevel") {
            emedia.LOG_LEVEL = cfg[key];
        }
    }

    if (emedia.config.loglastConfrCount && !emedia._logContext) {
        emedia._logContext = new Array(emedia.config.loglastConfrCount);
        emedia._logContextIndex = -1; //代表没有日志
    }
};
emedia.config({
    loglastConfrCount: 0,
    consoleLogger: true,

    rtcStatsTypeMath: function rtcStatsTypeMath(_stat, name) {
        switch (_stat.type) {
            case "remote-candidate":
            case "local-candidate":
            case "track":
            case "stream":
            case "inbound-rtp":
            case "outbound-rtp":
            case "transport":
                return true;
        }
        return false;
    }
});

emedia.LOG_LEVEL = 0;

util.logger.count();
//util.logger.info(navigator.userAgent);

(function requireWebrtcAdapter() {
    var adapter = __webpack_require__(2);
    emedia.browser = adapter.__browser; // firefox chrome safari IE
    emedia.browserVersion = adapter.__browserVersion;
})();
util.logger.info("Current browser", emedia.browser, emedia.browserVersion);

emedia.EWebrtc = __webpack_require__(7);

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
 * ! Math.uuid.js (v1.4) http://www.broofa.com mailto:robert@broofa.com
 *
 * Copyright (c) 2010 Robert Kieffer Dual licensed under the MIT and GPL
 * licenses.
 */

/*
 * Generate a random uuid.
 *
 * USAGE: Math.uuid(length, radix) length - the desired number of characters
 * radix - the number of allowable values for each character.
 *
 * EXAMPLES: // No arguments - returns RFC4122, version 4 ID >>> Math.uuid()
 * "92329D39-6F5C-4520-ABFC-AAB64544E172" // One argument - returns ID of the
 * specified length >>> Math.uuid(15) // 15 character ID (default base=62)
 * "VcydxgltxrVZSTV" // Two arguments - returns ID of the specified length, and
 * radix. (Radix must be <= 62) >>> Math.uuid(8, 2) // 8 character ID (base=2)
 * "01001010" >>> Math.uuid(8, 10) // 8 character ID (base=10) "47473046" >>>
 * Math.uuid(8, 16) // 8 character ID (base=16) "098F4D35"
 */
(function () {
    // Private array of chars to use
    var CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    Math.uuid = function (len, radix) {
        var chars = CHARS,
            uuid = [],
            i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) {
                uuid[i] = chars[0 | Math.random() * radix];
            }
        } else {
            // rfc4122, version 4 form
            var r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence
            // as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
                }
            }
        }

        return uuid.join('');
    };

    // A more performant, but slightly bulkier, RFC4122v4 solution. We boost
    // performance
    // by minimizing calls to random()
    Math.uuidFast = function () {
        var chars = CHARS,
            uuid = new Array(36),
            rnd = 0,
            r;
        for (var i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                uuid[i] = '-';
            } else if (i == 14) {
                uuid[i] = '4';
            } else {
                if (rnd <= 0x02) rnd = 0x2000000 + Math.random() * 0x1000000 | 0;
                r = rnd & 0xf;
                rnd = rnd >> 4;
                uuid[i] = chars[i == 19 ? r & 0x3 | 0x8 : r];
            }
        }
        return uuid.join('');
    };

    // A more compact, but less performant, RFC4122v4 solution:
    Math.uuidCompact = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : r & 0x3 | 0x8;
            return v.toString(16);
        });
    };
})();

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

/**
 * Util
 *
 * @constructor
 */
function Util() {}

/**
 * Function Logger
 *
 * @constructor
 */
var Logger = function Logger(tag) {
    var self = this;

    var LogLevel = {
        TRACE: 0,
        DEBUG: 1,
        INFO: 2,
        WARN: 3,
        ERROR: 4,
        FATAL: 5
    };

    var LogLevelName = ['TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'];

    this._log = function () {
        var level = arguments[0];

        level = arguments[0] = LogLevelName[level];

        emedia._logContext && sdklog.apply(null, arguments);
        if (emedia.config.consoleLogger !== true) {
            return;
        }

        if (emedia && emedia.isElectron) {
            console.log.apply(console, arguments);
            return;
        }
        if (console && level) {
            (console[level.toLowerCase()] || console.warn).apply(console, arguments);
        }
    };

    function callLog(level, args) {
        try {
            _callLog(level, args);
        } catch (e) {
            if (console) {
                if (console.error) {
                    console.error(e);
                    return;
                }
                if (console.log) {
                    console.log(e);
                    return;
                }
            }

            throw e;
        }
    }

    function _sdklog() {
        if (emedia._logContextIndex < 0) {
            return;
        }
        if (!emedia._logContext || !(emedia._logContext instanceof Array)) {
            return;
        }

        var contextIndex = emedia._logContextIndex % emedia._logContext.length;
        var logInfos = emedia._logContext[contextIndex];
        if (!logInfos || !(logInfos instanceof Array)) {
            logInfos = emedia._logContext[contextIndex] = [];
        }

        var info = [];
        info.push(emedia._logContextIndex);

        var now = new Date();
        if (typeof now.toLocaleString === 'function') {
            info.push(now.toLocaleString());
        } else if (now.toJSON) {
            info.push(now.toJSON());
        } else if (now.toISOString) {
            info.push(now.toISOString());
        } else {
            info.push(now + "");
        }

        for (var i = 0; i < arguments.length; i++) {
            var arg = arguments[i];

            if (typeof arg === "string") {
                info.push(arg);
                continue;
            }

            if (typeof arg.message === "string") {
                info.push(arg.message);
                continue;
            }
            if (typeof arg.message === "function") {
                info.push(arg.message());
                continue;
            }
            if (typeof arg.stack === "string") {
                info.push(arg.stack);
                continue;
            }
            if (arg.event && typeof arg.event.toString === "function") {
                info.push(arg.event.toString());
                continue;
            }
            if (arg.event && typeof arg.event.toString === "function") {
                info.push(arg.event.toString());
                continue;
            }

            if (typeof arg.candidate === "string") {
                info.push(arg.candidate);
                continue;
            }
            if (typeof arg.sdp === "string") {
                info.push(arg.sdp);
                continue;
            }

            arg && info.push(JSON.stringify(arg));
        }

        logInfos.push(info.join(' '));
    };

    function sdklog() {
        try {
            _sdklog.apply(null, arguments);
        } catch (e) {}
    };

    function _callLog(level, args) {
        if (emedia && emedia.LOG_LEVEL && level < emedia.LOG_LEVEL) {
            return;
        }

        var _args = [];

        _args.push(level);
        tag && _args.push(tag);

        for (var i = 0; i < args.length; i++) {
            _args.push(args[i] && args[i]._toString ? args[i]._toString.call(args[i]) : args[i]);
        }

        //_args.caller && _args.push(_args.caller);

        self._log.apply(self, _args);
    };

    this.log = function () {
        this._log && callLog(LogLevel.INFO, arguments);
    };

    this.trace = function () {
        this._log && callLog(LogLevel.TRACE, arguments);
    };

    this.debug = function () {
        this._log && callLog(LogLevel.DEBUG, arguments);
    };

    this.info = function () {
        this._log && callLog(LogLevel.INFO, arguments);
    };

    this.warn = function () {
        this._log && callLog(LogLevel.WARN, arguments);
    };

    this.error = function () {
        this._log && callLog(LogLevel.ERROR, arguments);
    };

    this.fatal = function () {
        this._log && callLog(LogLevel.FATAL, arguments);
    };
};

Logger.prototype.count = function () {
    if (emedia._logContext) {
        emedia._logContextIndex++;

        var contextIndex = emedia._logContextIndex % emedia._logContext.length;

        if (contextIndex === 0 && emedia._logContextIndex !== 0) {
            emedia._logContext.loadlogs = emedia._logContext[contextIndex];
        }
        emedia._logContext[contextIndex] = [];
    }
};

Util.prototype.logger = new Logger();

Util.prototype.tagLogger = function (tag) {
    return new Logger(tag);
};

/**
 * parse json
 *
 * @param jsonString
 */
Util.prototype.parseJSON = function (jsonString) {
    return JSON.parse(jsonString);
};

/**
 * json to string
 *
 * @type {Util.stringifyJSON}
 */
var stringifyJSON = Util.prototype.stringifyJSON = function (jsonObj) {
    return JSON.stringify(jsonObj);
};

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call(Object);

/**
 * check object type
 *
 * @type {Util.isPlainObject}
 */
var isPlainObject = Util.prototype.isPlainObject = function (obj) {
    var proto, Ctor;

    // Detect obvious negatives
    // Use toString instead of jQuery.type to catch host objects
    var objectString;
    if (!obj || (objectString = toString.call(obj)) !== "[object Object]" || obj.toString() === "<JSAPI-Auto Javascript Object>" || obj.toString() === "[object IFBComJavascriptObject]") {
        return false;
    }

    proto = Object.getPrototypeOf(obj);

    // Objects with no prototype (e.g., `Object.create( null )`) are plain
    if (!proto) {
        return true;
    }

    // Objects with prototype are plain iff they were constructed by a
    // global Object function
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && fnToString.call(Ctor) === ObjectFunctionString;
};

Util.prototype.isArray = Array.isArray;

/**
 * check empty object
 *
 * @param obj
 * @returns {boolean}
 */
Util.prototype.isEmptyObject = function (obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
};

Util.prototype.type = function (obj) {
    if (obj == null) {
        return obj + "";
    }
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
};

/**
 * Function extend
 *
 * @returns {*|{}}
 */
Util.prototype.extend = function () {
    var self = this;
    var options,
        name,
        src,
        copy,
        copyIsArray,
        clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false;

    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;

        // Skip the boolean and the target
        target = arguments[i] || {};
        i++;
    }

    // Handle case when target is a string or something (possible in deep
    // copy)
    if ((typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== "object" && !self.isFunction(target)) {
        target = {};
    }

    // Extend self itself if only one argument is passed
    if (i === length) {
        target = this;
        i--;
    }

    for (; i < length; i++) {

        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {

            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];

                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }

                // Recurse if we're merging plain objects or arrays
                if (deep && copy && (self.isPlainObject(copy) || (copyIsArray = self.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && self.isArray(src) ? src : [];
                    } else {
                        clone = src && self.isPlainObject(src) ? src : {};
                    }

                    // Never move original objects, clone them
                    target[name] = self.extend(deep, clone, copy);

                    // Don't bring in undefined values
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    // Return the modified object
    return target;
};

Util.prototype.removeAttribute = function (elem, key) {
    if (elem === null || elem === undefined) {
        return;
    }

    var obj = elem[key];

    // if(emedia.isSafari && obj && obj.__undefinedEQDelete){ // safari delete stream时，地址栏会有个小喇叭; 要延迟删除
    //     emedia._stream_garbages || (emedia._stream_garbages = [])
    //     emedia._stream_garbages.push(obj);
    // }
    delete elem[key];

    return obj;
};

Util.prototype.prototypeExtend_000 = Util.prototype.classExtend = function () {
    var self = this;

    function _Obj__() {
        for (var i = 0; i < arguments.length; i++) {
            var cfg = arguments[i] || {};
            self.extend(true, this, cfg);
        }

        this.__init__ && this.__init__.apply(this, arguments);
    }

    var lastConstructor;

    for (var i = 0; i < arguments.length; i++) {
        var cfg = arguments[i] || {};

        if (typeof cfg === "function") {
            if (lastConstructor) {
                cfg.constructor = lastConstructor;
                cfg.__proto__ = lastConstructor.prototype;
            } else {
                lastConstructor = cfg;
            }
        } else {
            self.extend(true, _Obj__.prototype, cfg);
        }
    }

    lastConstructor && (_Obj__.prototype.__proto__ = lastConstructor.prototype);
    lastConstructor && (_Obj__.prototype.constructor = lastConstructor);

    _Obj__.extend || (_Obj__.extend = function (_prototypeExtend) {
        return self.prototypeExtend(_Obj__, _prototypeExtend);
    });

    return _Obj__;
};

Util.prototype.prototypeExtend = Util.prototype.classExtend = function () {
    var self = this;

    function _Obj__() {
        for (var i = 0; i < arguments.length; i++) {
            var cfg = arguments[i] || {};
            self.extend(true, this, cfg);
        }

        this.__init__ && this.__init__.apply(this, arguments);
    }

    for (var i = 0; i < arguments.length; i++) {
        var cfg = arguments[i] || {};
        if (typeof cfg === "function") {
            cfg = cfg.prototype;
        }

        self.extend(true, _Obj__.prototype, cfg);
    }

    _Obj__.extend || (_Obj__.extend = function (_prototypeExtend) {
        return self.prototypeExtend(_Obj__, _prototypeExtend);
    });

    return _Obj__;
};

/**
 * get local cache
 *
 * @memberOf tool
 * @name hasLocalData
 * @param key{string}
 *            localStorage的key值
 * @return boolean
 */
Util.prototype.hasLocalStorage = function (key) {
    // null -> localStorage.removeItem时
    // '{}' -> collection.models.destroy时
    if (localStorage.getItem(key) == null || localStorage.getItem(key) == '{}') {
        return false;
    }
    return true;
};

Util.prototype.toggleClass = function (node, className) {
    if (node.hasClass(className)) {
        node.removeClass(className);
        return;
    }
    node.addClass(className);
};

/**
 * set cookie
 *
 * @param name{String}
 *
 * @param value{String}
 *
 * @param hour{Number}
 *
 * @return void
 */
Util.prototype.setCookie = function (name, value, hour) {
    var exp = new Date();
    exp.setTime(exp.getTime() + hour * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
};

/**
 * read cookie
 *
 * @param name(String)
 *            cookie key
 * @return cookie value
 * @memberOf Tool
 */
Util.prototype.getCookie = function (name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) {
        return unescape(arr[2]);
    }
    return null;
};

/**
 * query parameter from url
 *
 * @name parseURL
 * @memberof C.Tools
 * @param {string}
 *
 * @return {string}
 * @type function
 * @public
 */
Util.prototype.parseURL = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
};

/**
 * function(index, value){

}
 * @param obj
 */
Util.prototype.forEach = function (obj, func) {
    if (!obj) {
        return;
    }

    if (this.isArray(obj) && obj.length === 0) {
        return;
    }
    if (obj.length !== undefined && obj.length === 0) {
        return;
    }
    if (obj.length) {
        for (var i = 0; i < obj.length; i++) {
            func(i, obj[i]);
        }
        return;
    }

    if (!obj || this.isEmptyObject(obj)) {
        return;
    }

    obj = obj || {};

    var copy = this.extend(false, {}, obj);

    for (var index in copy) {
        func(index, obj[index]);
    }
};

Util.prototype.isInt = function (n) {
    return Number(n) === n && n % 1 === 0;
};

Util.prototype.isFloat = function (n) {
    return Number(n) === n && n % 1 !== 0;
};

Util.prototype.list = function () {
    var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
    return args;
};

Util.prototype.addEvent = function (element, name, func) {
    if (element.attachEvent) return element.attachEvent("on" + name, func);
    if (element.addEventListener) return element.addEventListener(name, func, false);
    throw "Handler could not be attached";
};

Util.prototype.removeEvent = function (element, name, func) {
    if (element.detachEvent) return element.detachEvent("on" + name, func);
    if (element.removeEventListener) return element.removeEventListener(name, func, false);
    throw "Handler could not be removed";
};

Util.prototype.stopEvent = function (event) {
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
};

Util.prototype.getDomPageRect = function (element) {
    var domRect = element.getBoundingClientRect();
    return {
        x: domRect.left + (window.pageXOffset || window.document.documentElement.scrollLeft),
        y: domRect.top + (window.pageYOffset || window.document.documentElement.scrollTop),
        width: domRect.width || element.offsetWidth,
        height: domRect.height || element.offsetHeight
    };
};

Util.prototype.getEventElementXY = function (event, element, scale) {
    event = event || window.event;

    var touch = event.changedTouches ? event.changedTouches[0] : event.touches ? event.touches[0] : event;

    var pageX, pageY;
    if (touch.pageX != undefined && touch.pageY != undefined) {
        pageX = touch.pageX;
        pageY = touch.pageY;
    } else if (touch.clientX != undefined && touch.clientY != undefined) {
        pageX = touch.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        pageY = touch.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    var elementPageXY = this.getDomPageRect(element);

    var relativeX = pageX - elementPageXY.x;
    var relativeY = pageY - elementPageXY.y;

    (scale === 0 || scale == undefined) && (scale = 1);
    return {
        x: Math.round(Math.max(Math.min(relativeX, elementPageXY.width - 1), 0) / scale),
        y: Math.round(Math.max(Math.min(relativeY, elementPageXY.height - 1), 0) / scale),
        width: Math.round(elementPageXY.width / scale),
        height: Math.round(elementPageXY.height / scale),

        realX: relativeX,
        realY: relativeY
    };
};

Util.prototype.layoutEngine = function () {
    var engine = {
        presto: !!window.opera,
        trident: !!window.ActiveXObject && (window.XMLHttpRequest ? document.querySelectorAll ? 6 : 5 : 4),
        webkit: function () {
            try {
                return !navigator.taintEnabled && (i.Features.xpath ? i.Features.query ? 525 : 420 : 419);
            } catch (e) {
                return !1;
            }
        }(),
        gecko: !(!document.getBoxObjectFor && null == window.mozInnerScreenX) && (document.getElementsByClassName ? 19 : 18)
    };

    engine.webkit && (engine.webkit = function (e) {
        var n = (navigator.userAgent.match(/WebKit\/([0-9\.]*) /) || ["", e])[1];
        return parseFloat(n, 10);
    }(engine));

    return engine;
}();

Util.prototype.targetDOM = (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? function (obj) {
    return obj instanceof HTMLElement;
} : function (obj) {
    return obj && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.nodeType === 1 && typeof obj.nodeName === 'string';
};

Util.prototype.cloneCSS = function (srcElement, destElement) {
    /**
     * IE8不支持window.getComputedStyle
     * IE9~11中，window.getComputedStyle().cssText返回的总为空字符串
     * 默认的window.getComputedStyle || dom.currentStyle, 返回的css键值对中，键是驼峰命名的。
     */
    var oStyle = window.getComputedStyle && window.getComputedStyle(srcElement, null) || srcElement.currentStyle;
    for (var key in oStyle) {
        var v = oStyle[key];
        if (/^[a-z]/i.test(key) && [null, '', undefined].indexOf(v) < 0) {
            destElement.style[key] = v;
        }
    }
};

Util.prototype.canYield = function () {
    try {
        return eval("!!Function('yield true;')().next()");
    } catch (e) {
        return false;
    }
}();

module.exports = new Util();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * WebRTC
 *
 *                              A                   |                                       B
 *                                                  |
 *   1.createMedia:got streamA                      | 1.createMedia:got streamB
 *   2.new RTCPeerConnection: APeerConnection       | 2.new RTCPeerConnection: BPeerConnection
 *   3.APeerConnection.createOffer:got offerA       |
 *      APeerConnection.setLocalDescription(offerA) |
 *      send offerA ---> ---> ---> --->        ---> |
 *                                                  | ---> 3.got offerA | offerA = new RTCSessionDescription(offerA);
 *                                                  | BPeerConnection.setRemoteDescription(offerA)
 *                                                  |
 *                                                  |
 *                                                  | 4.BPeerConnection.createAnswer: got answerB
 *                                                  | BPeerConnection.setLocalDescription(answerB)
 *                                                  | <---- send answerB
 *                                                  | 5.got answerB <--- <--- <--- <---
 *                                                  | answerB = new RTCSessionDescription(answerB)
 *                                                  |
 * APeerConnection.setRemoteDescription(answerB)    |
 *                                                  |
 * 6.got candidateA ---> --->  ---> --->            | ---> got candidateA
 *                                                  | BPeerConnection.addIceCandidate(new RTCIceCandidate(candidateA))
 *                                                  |
 *                                                  |
 *                                                  | got candidateB <--- <--- <--- <---
 *                                                  | <--- 6.got candidateB APeerConnection.addIceCandidate(candidateB)
 *                                                  |
 *                                                  |
 *                                                  | 7. APeerConnection.addStream(streamA)
 *                                                  | 7. BPeerConnection.addStream(streamB)
 *                                                  |
 *                              streamA >>>>>>>>>>> |  <<<<< see A
 *                              seeB <<<<<<<<<<<    | <<<<< streamB
 *                                                  |
 *
 */

var _util = __webpack_require__(6);
var _logger = _util.tagLogger("Webrtc");

var SDPUtils = __webpack_require__(8); //希望使用 SDPUtils 取代 SDPSection

var _SDPSection = {
    headerSection: null,

    audioSection: null,
    videoSection: null,

    _parseHeaderSection: function _parseHeaderSection(sdp, audioIndex, videoIndex) {
        var index = audioIndex;

        if (videoIndex === -1) {//保持不变
        } else if (audioIndex === -1) {
            index = videoIndex;
        } else {
            index = Math.min(audioIndex, videoIndex);
        }

        if (index >= 0) {
            return sdp.slice(0, index);
        }
        return sdp;
    },

    _parseAudioSection: function _parseAudioSection(sdp, audioIndex, videoIndex) {
        var index = audioIndex;
        if (index >= 0) {
            return sdp.slice(index, videoIndex < index ? sdp.length : videoIndex);
        }
    },

    _parseVideoSection: function _parseVideoSection(sdp, audioIndex, videoIndex) {
        var index = videoIndex;
        if (index >= 0) {
            return sdp.slice(index, audioIndex < index ? sdp.length : audioIndex);
        }
    },

    spiltSection: function spiltSection(sdp) {
        var self = this;

        self._preSDP = sdp;

        var audioIndex = self._preAudioIndex = sdp.indexOf('m=audio');
        var videoIndex = self._preVideoIndex = sdp.indexOf('m=video');

        self.headerSection = self._parseHeaderSection(sdp, audioIndex, videoIndex);
        self.audioSection = self._parseAudioSection(sdp, audioIndex, videoIndex);
        self.videoSection = self._parseVideoSection(sdp, audioIndex, videoIndex);
    },

    setVideoBitrate: function setVideoBitrate(vbitrate) {
        if (!vbitrate || !this.videoSection) {
            return;
        }

        this.videoSection = this.setBitrate(this.videoSection, vbitrate);
    },

    setAudioBitrate: function setAudioBitrate(abitrate) {
        if (!abitrate || !this.audioSection) {
            return;
        }

        this.audioSection = this.setBitrate(this.audioSection, abitrate);
    },

    setBitrate: function setBitrate(section, bitrate) {
        section = section.replace(/(b=)(?:AS|TIAS)(\:)\d+/g, "$1AS$2" + bitrate);
        if (section.indexOf('b=AS') < 0) {
            section = section.replace(/(m=(?:audio|video)[^\r\n]+)([\r\n]+)/g, "$1$2b=AS:" + bitrate + "$2");
        }
        return section;
    },

    updateVideoSection: function updateVideoSection(regx, oper) {
        var self = this;

        if (!self.videoSection) {
            return;
        }

        self.videoSection = self.videoSection.replace(regx, oper);
    },

    updateAudioSection: function updateAudioSection(regx, oper) {
        var self = this;

        if (!self.audioSection) {
            return;
        }

        self.audioSection = self.audioSection.replace(regx, oper);
    },

    updateVideoSendonly: function updateVideoSendonly() {
        var self = this;

        if (!self.videoSection) {
            return;
        }

        self.videoSection = self.videoSection.replace(/sendrecv/g, "sendonly");
    },

    updateVideoRecvonly: function updateVideoRecvonly() {
        var self = this;

        if (!self.videoSection) {
            return;
        }

        self.videoSection = self.videoSection.replace(/sendrecv/g, "recvonly");
    },

    updateAudioSendonly: function updateAudioSendonly() {
        var self = this;

        if (!self.audioSection) {
            return;
        }

        self.audioSection = self.audioSection.replace(/sendrecv/g, "sendonly");
    },

    updateAudioRecvonly: function updateAudioRecvonly() {
        var self = this;

        if (!self.audioSection) {
            return;
        }

        self.audioSection = self.audioSection.replace(/sendrecv/g, "recvonly");
    },

    updateVCodes: function updateVCodes(vcodes) {
        var self = this;

        if (!vcodes) {
            return;
        }
        if (!self.videoSection) {
            return;
        }

        if (typeof vcodes === "string") {
            var arr = [];
            arr.push(vcodes);
            vcodes = arr;
        }

        var vcodeMap = {};
        var regexp = /a=rtpmap:(\d+) ([A-Za-z0-9]+)\/.*/ig;
        var arr = self._parseLine(self.videoSection, regexp);
        for (var i = 0; i < arr.length; i++) {
            var codeNum = arr[++i];
            var code = arr[++i];
            vcodeMap[code] = codeNum;
        }

        //H264
        //if(/Firefox/.test(navigator.userAgent) || /Chrome/.test(navigator.userAgent)){ //a=fmtp:126 profile-level-id=42e01f;level-asymmetry-allowed=1;packetization-mode=1
        var h264_regexp = /a=fmtp:(\d+) .*profile-level-id=42e01f;?.*/ig;
        var h264_arr = self._parseLine(self.videoSection, h264_regexp);

        if (h264_arr && h264_arr.length >= 2) {
            vcodeMap['H264'] = h264_arr[1];
        }
        //}

        var numCodes = [];
        for (var i = 0; i < vcodes.length; i++) {
            var supportVCode = vcodeMap[vcodes[i]];
            supportVCode && numCodes.push(supportVCode);
        }
        if (numCodes.length == 0) {
            _logger.warn("Not found vcodes map", vcodes);
            if (self._webrtc) {
                _logger.warn("Not found vcodes map", vcodes, self._webrtc._rtcId, self._webrtc.__id);
            }
        }

        var codeLineLastIndex = self.videoSection.indexOf('\r');
        var codeLine = self.videoSection.substring(0, codeLineLastIndex);

        var fields = codeLine.split(' ');

        Array.prototype.push.apply(numCodes, fields.slice(3));

        var newNumCodes = [];
        var _map = {};
        _util.forEach(numCodes, function (index, ele) {
            if (newNumCodes.length == 0) {
                newNumCodes.push(ele);
                _map[ele] = true;
            } else {
                if (!_map[ele]) {
                    newNumCodes.push(ele);
                    _map[ele] = true;
                }
            }
        });
        //alert(numCodes.join(' '));

        //fields.splice(3, 0, numCodes);
        fields.splice(3, fields.length - 3, newNumCodes.join(' '));

        codeLine = fields.join(' ');
        //_logger.info(codeLine);
        if (self._webrtc) {
            _logger.warn(codeLine, self._webrtc._rtcId, self._webrtc.__id);
        }

        self.videoSection = codeLine + self.videoSection.substring(codeLineLastIndex);
    },

    removeSSRC: function removeSSRC(section) {
        var arr = [];

        var _arr = section.split(/a=ssrc:[^\n]+/g);
        for (var i = 0; i < _arr.length; i++) {
            _arr[i] != '\n' && arr.push(_arr[i]);
        }
        // arr.push('');

        return arr.join('\n');
    },

    removeField_msid: function removeField_msid(section) {
        var arr = [];

        var _arr = section.split(/a=msid:[^\n]+/g);
        for (var i = 0; i < _arr.length; i++) {
            _arr[i] != '\n' && arr.push(_arr[i]);
        }
        // arr.push('');

        section = arr.join('\n');
        arr = [];

        _arr = section.split(/[\n]+/g);
        for (var i = 0; i < _arr.length; i++) {
            _arr[i] != '\n' && arr.push(_arr[i]);
        }

        return arr.join('\n');
    },

    updateHeaderMsidSemantic: function updateHeaderMsidSemantic(wms) {

        var self = this;

        var line = "a=msid-semantic: WMS " + wms;

        var _arr = self.headerSection.split(/a=msid\-semantic: WMS.*/g);
        var arr = [];
        switch (_arr.length) {
            case 1:
                arr.push(_arr[0]);
                break;
            case 2:
                arr.push(_arr[0]);
                arr.push(line);
                arr.push('\n');
                break;
            case 3:
                arr.push(_arr[0]);
                arr.push(line);
                arr.push('\n');
                arr.push(_arr[2]);
                arr.push('\n');
                break;
        }

        return self.headerSection = arr.join('');
    },

    updateAudioSSRCSection: function updateAudioSSRCSection(ssrc, cname, msid, label) {
        var self = this;

        self.audioSection && (self.audioSection = self.removeSSRC(self.audioSection));
        self.audioSection && (self.audioSection = self.removeField_msid(self.audioSection));
        self.audioSection && (self.audioSection = self.audioSection + self.ssrcSection(ssrc, cname, msid, label));
    },

    updateVideoSSRCSection: function updateVideoSSRCSection(ssrc, cname, msid, label) {
        var self = this;

        self.videoSection && (self.videoSection = self.removeSSRC(self.videoSection));
        self.videoSection && (self.videoSection = self.removeField_msid(self.videoSection));
        self.videoSection && (self.videoSection = self.videoSection + self.ssrcSection(ssrc, cname, msid, label));
    },

    getUpdatedSDP: function getUpdatedSDP(audioVideo) {
        var self = this;

        if (self._preAudioIndex < 0 || self._preVideoIndex < 0) {
            return this._preSDP;
        }

        audioVideo = audioVideo === true || audioVideo === undefined;
        var sdpAudioVideo = self._preAudioIndex < self._preVideoIndex;

        if (audioVideo == sdpAudioVideo) {
            return this._preSDP;
        }

        var videoMid;
        self.videoSection.replace(/a=mid:([^\r\n]+)/, function (match, p1) {
            videoMid = p1;
            return match;
        });

        var audioMid;
        self.audioSection.replace(/a=mid:([^\r\n]+)/, function (match, p1) {
            audioMid = p1;
            return match;
        });

        var sdp;
        if (audioVideo) {
            sdp = self.headerSection.replace(/a=group:BUNDLE [^\r\n]+/, "a=group:BUNDLE " + audioMid + " " + videoMid);

            self.audioSection && (sdp += self.audioSection);
            self.videoSection && (sdp += self.videoSection);
        } else {
            sdp = self.headerSection.replace(/a=group:BUNDLE [^\r\n]+/, "a=group:BUNDLE " + videoMid + " " + audioMid);

            self.videoSection && (sdp += self.videoSection);
            self.audioSection && (sdp += self.audioSection);
        }

        return sdp;
    },

    parseMsidSemantic: function parseMsidSemantic(header) {
        var self = this;

        var regexp = /a=msid\-semantic:\s*WMS (\S+)/ig;
        var arr = self._parseLine(header, regexp);

        arr && arr.length == 2 && (self.msidSemantic = {
            line: arr[0],
            WMS: arr[1]
        });

        return self.msidSemantic;
    },

    ssrcSection: function ssrcSection(ssrc, cname, msid, label) {
        var lines = ['a=ssrc:' + ssrc + ' cname:' + cname, 'a=ssrc:' + ssrc + ' msid:' + msid + ' ' + label, 'a=ssrc:' + ssrc + ' mslabel:' + msid, 'a=ssrc:' + ssrc + ' label:' + label, ''];

        return lines.join('\n');
    },

    parseSSRC: function parseSSRC(section) {
        var self = this;

        var regexp = new RegExp("a=(ssrc):(\\d+) (\\S+):(\\S+)", "ig");

        var arr = self._parseLine(section, regexp);
        if (arr) {
            var ssrc = {
                lines: [],
                updateSSRCSection: self.ssrcSection
            };

            for (var i = 0; i < arr.length; i++) {
                var e = arr[i];
                if (e.indexOf("a=ssrc") >= 0) {
                    ssrc.lines.push(e);
                } else {
                    switch (e) {
                        case 'ssrc':
                        case 'cname':
                        case 'msid':
                        case 'mslabel':
                        case 'label':
                            ssrc[e] = arr[++i];
                    }
                }
            }

            return ssrc;
        }
    },

    _parseLine: function _parseLine(str, regexp) {
        var arr = [];

        var _arr;
        while ((_arr = regexp.exec(str)) != null) {
            for (var i = 0; i < _arr.length; i++) {
                arr.push(_arr[i]);
            }
        }

        if (arr.length > 0) {
            return arr;
        }
    }
};

var SDPSection = function SDPSection(sdp, webrc) {
    _util.extend(this, _SDPSection);
    this._webrtc = webrc;
    this.spiltSection(sdp);
};

SDPSection.isAudioVideo = function (sdp) {
    var audioIndex = sdp.indexOf('m=audio');
    var videoIndex = sdp.indexOf('m=video');

    return audioIndex < videoIndex;
};

SDPSection.isVideoPreAudio = function (sdp) {
    var audioIndex = sdp.indexOf('m=audio');
    var videoIndex = sdp.indexOf('m=video');

    return audioIndex >= 0 && videoIndex >= 0 && videoIndex < audioIndex;
};

var __rtc_globalCount = emedia.__rtc_globalCount = 0;

/**
 * Abstract
 * {
 *   onIceStateChange:
 *   onIceCandidate:
 *   onGotRemoteStream:
 *
 *   createRtcPeerConnection:
 *   createOffer:
 *   createPRAnswer:
 *   createAnswer:
 *   addIceCandidate:
 *   close:
 *   iceState:
 *
 *   setLocalStream:
 *   getRtcId:
 * }
 *
 */
/**
 * ICE 通道失败：
 * 1.set sdp 失败
 * 2.set cands 失败
 * 但最终都是 ice fail
 *
 *
 * onSetSessionDescriptionError
 * onCreateSessionDescriptionError
 * onAddIceCandidateError
 *
 * onIceStateChange  ice fail
 *
 */
var _WebRTC = _util.prototypeExtend({
    closed: false,
    sdpConstraints: {
        'mandatory': {
            'OfferToReceiveAudio': true,
            'OfferToReceiveVideo': true
        }
    },

    /**
     * offerToReceiveAudio false sendonly, or sendrecv
     * offerToReceiveVideo false sendonly, or sendrecv
     *
     */
    offerOptions: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
        //voiceActivityDetection: false
    },

    optimalVideoCodecs: null,
    optimalAudioCodecs: null,

    __init__: function __init__() {
        var self = this;

        self._rtcId || (self._rtcId = "RTC" + __rtc_globalCount++);
        self.__id = "_i_" + __rtc_globalCount++;

        self.__setRemoteSDP = false;
        self.__tmpRemoteCands = [];
        self.__tmpLocalCands = [];
        self._rtcPeerConnection = null;

        self.cctx = self.__id;

        _logger.info("Webrtc created.", self._rtcId, self.__id);
    },

    getRtcId: function getRtcId() {
        return this._rtcId;
    },

    iceState: function iceState() {
        var self = this;
        return self._rtcPeerConnection.iceConnectionState;
    },

    setSubArgs: function setSubArgs(subArgs) {
        var self = this;
        self.subArgs = subArgs;
    },

    getReceiversOfPeerConnection: function getReceiversOfPeerConnection() {
        var self = this;

        if (!self._rtcPeerConnection) {
            return;
        }

        if (self._rtcPeerConnection.iceConnectionState == 'closed') {
            return;
        }

        return self._rtcPeerConnection.getReceivers();
    },

    updateRemoteBySubArgs: function updateRemoteBySubArgs() {
        var self = this;

        if (!self.subArgs) {
            return;
        }
        if (!self._remoteStream) {
            return;
        }

        emedia.enableVideoTracks(self._remoteStream, !(self.subArgs && self.subArgs.subSVideo === false));
        emedia.enableAudioTracks(self._remoteStream, !(self.subArgs && self.subArgs.subSAudio === false));

        _logger.info("enable tracks remote stream", self._remoteStream, self.subArgs, self._rtcId, self.__id, self.closed);
    },

    createRtcPeerConnection: function createRtcPeerConnection(iceServerConfig) {
        var self = this;
        _logger.debug('begin create peer connection ......', self._rtcId, self.__id, self.closed);

        iceServerConfig || (iceServerConfig = self.iceServerConfig);

        if (iceServerConfig || emedia.isEdge) {
            //reduce icecandidate number:add default value
            iceServerConfig || (iceServerConfig = {});
            !iceServerConfig.iceServers && (iceServerConfig.iceServers = []);

            iceServerConfig.rtcpMuxPolicy = "require";
            iceServerConfig.bundlePolicy = "max-bundle";

            //iceServerConfig.iceTransportPolicy = 'relay';
            if (iceServerConfig.relayOnly) {
                iceServerConfig.iceTransportPolicy = 'relay';
            }
        } else {
            iceServerConfig = null;
        }

        // iceServerConfig = {
        //     capAudio: true,
        //     capVideo: true,
        //     iceServers:[{
        //         credential: "+F34cGoWeMmwa+XtvibM7dr4Ccc=",
        //         url: "turn:101.200.76.93:3478",
        //         username: "easemob-demo#chatdemoui_yss000@easemob.com/webim_device_uuid%179310420104847360:1506431735"
        //     }],
        //     recvAudio: true,
        //     recvVideo: true,
        //     relayOnly: false,
        // };
        _logger.info('create pc, set config:', iceServerConfig, self._rtcId, self.__id, self.closed);

        var rtcPeerConnection = self._rtcPeerConnection = new RTCPeerConnection(iceServerConfig);
        rtcPeerConnection.__peerId = self._rtcId;
        _logger.debug('created local peer connection object', rtcPeerConnection, self._rtcId);

        rtcPeerConnection.onicecandidate = function (event) {
            var candidate = event.candidate;

            //reduce icecandidate number: don't deal with tcp, udp only
            if (event.type == "icecandidate" && (!candidate || typeof candidate.protocol === 'string' && candidate.protocol.toLowerCase() === 'tcp' || / TCP /.test(candidate.candidate))) {
                _logger.debug("On ICE candidate: drop", candidate, self._rtcId, self.__id, self.closed);
                return;
            }

            if (!candidate.candidate) {
                _logger.error("Not found candidate. candidate is error");
                throw "Not found candidate. candidate is error,";
            }

            candidate.cctx = self.cctx;
            if (!self.__setRemoteSDP) {
                (self.__tmpLocalCands || (self.__tmpLocalCands = {})).push(candidate);
                _logger.debug('On ICE candidate ok: but tmp buffer caused by not set remote sdp: ', candidate, self._rtcId, self.__id, self.closed);
                return;
            } else {
                _logger.debug('On ICE candidate ok: ', candidate, self._rtcId, self.__id, self.closed);
            }
            self._onIceCandidate(candidate);
        };

        var lastIceConnectionState;
        function stateChange(event) {
            _logger.info("states: conn", rtcPeerConnection.connectionState || rtcPeerConnection.iceConnectionState, ", ice", rtcPeerConnection.iceConnectionState, "@", self._rtcId, self.__id, self.closed);
            try {
                if (lastIceConnectionState !== rtcPeerConnection.connectionState || rtcPeerConnection.iceConnectionState) {
                    lastIceConnectionState = rtcPeerConnection.connectionState || rtcPeerConnection.iceConnectionState;
                    self.onIceStateChange(rtcPeerConnection.connectionState || rtcPeerConnection.iceConnectionState);
                }
            } finally {}
        }

        rtcPeerConnection.onconnectionstatechange = stateChange.bind(self);
        rtcPeerConnection.onicestatechange = stateChange.bind(self);
        rtcPeerConnection.oniceconnectionstatechange = stateChange.bind(self);
        rtcPeerConnection.onsignalingstatechange = function (event) {
            _logger.info("states: signaling", rtcPeerConnection.signalingState, "@", self._rtcId, self.__id, self.closed);
        };

        if (rtcPeerConnection.ontrack === null) {
            self._onTrack && (rtcPeerConnection.ontrack = function (event) {
                self._onTrack(event);
            });
        }

        rtcPeerConnection.onaddstream = function (event) {
            self._onGotRemoteStream(event);
        };
    },

    addTrack: function addTrack(tracks, stream) {
        var self = this;

        tracks.forEach(function (track) {
            self._rtcPeerConnection.addTrack(track, stream);
        });
    },
    setLocalStream: function setLocalStream(localStream) {
        var self = this;

        self._localStream = localStream;

        if (self._rtcPeerConnection.addTrack) {
            localStream.getTracks().forEach(function (track) {
                self._rtcPeerConnection.addTrack(track, localStream);
            });
        } else {
            self._rtcPeerConnection.addStream(localStream);
        }
        _logger.debug('Added local stream to RtcPeerConnection', localStream.id, self._rtcId, self.__id, this.closed, localStream);
    },

    removeStream: function removeStream(mediaStream) {
        this._rtcPeerConnection.removeStream(mediaStream);
        _logger.debug('Remove stream from RtcPeerConnection', mediaStream, self._rtcId, self.__id, this.closed);
    },

    getLocalStream: function getLocalStream() {
        return this._localStream;
    },
    getRemoteStream: function getRemoteStream() {
        return this._remoteStream;
    },

    createOffer: function createOffer(onCreateOfferSuccess, onCreateOfferError) {
        var self = this;

        _logger.debug('createOffer start...', self.offerOptions);

        var offerOptions = _util.extend({}, self.offerOptions);

        //offerToReceiveAudio = false时，chrome没有video段；safari却这个块。需要将sendrecv改为sendonly
        //由于手机没有视频发布时，sdp中有video字段，而 web以offerToReceiveVideo = false去订阅时，导致订阅流中没有video块，会引发重协商。进而导致 始终无法看到对方视频
        //所以 订阅流时 无论offerToReceiveVideo = false，都生成offer sdp；其中都有video块。即 offerToReceiveVideo = true；但要将sdp修改为recvonly
        if (self.subArgs) {
            offerOptions = {
                offerToReceiveAudio: true,
                offerToReceiveVideo: true
            };
        }

        return self._rtcPeerConnection.createOffer(offerOptions).then(function (desc) {
            self.offerDescription = desc;

            if (emedia.isEdge) {
                desc.sdp = desc.sdp.replace(/profile-level-id=[^;]+/, "profile-level-id=42e01f");
            }
            if (emedia.isFirefox) {
                //需要交换 cand answer
                self.fireFoxOfferVideoPreAudio = self.__offerVideoPreAudio = SDPSection.isVideoPreAudio(desc.sdp);
            } else {
                self.__offerVideoPreAudio = SDPSection.isVideoPreAudio(desc.sdp); // video在audio前时，xswitch的answer是 audio在前。set answer时需要 变换answer
            }

            desc.sdp = desc.sdp.replace(/m=video 0/g, "m=video 9");
            _logger.warn("setLocalDescription. modify offer. if 'm=video 0' -> 'm=video 9'; if H264, 'profile-level-id=42e01f'", self._rtcId, self.__id);

            var updateVCodes;
            if ((updateVCodes = self.optimalVideoCodecs && (typeof self.optimalVideoCodecs === "string" || self.optimalVideoCodecs.length > 0)) || self.offerOptions && (self.offerOptions.offerToReceiveVideo === false || self.offerOptions.offerToReceiveAudio === false)) {
                var sdpSection = new SDPSection(desc.sdp, self);
                updateVCodes && sdpSection.updateVCodes(self.optimalVideoCodecs);

                self.offerOptions && self.offerOptions.offerToReceiveVideo === false && sdpSection.updateVideoSection(/a=sendrecv|a=recvonly/g, "a=sendonly");
                self.offerOptions && self.offerOptions.offerToReceiveAudio === false && sdpSection.updateAudioSection(/a=sendrecv|a=recvonly/g, "a=sendonly");

                desc.sdp = sdpSection.getUpdatedSDP(!self.__offerVideoPreAudio);
            }

            // if(self.__offerVideoPreAudio){
            //     _logger.debug("pre sdp\n", desc.sdp);
            //     var sdpSection = new SDPSection(desc.sdp, self);
            //     desc.sdp = sdpSection.getUpdatedSDP(true);
            //     self.__offerVideoPreAudio = false;
            //     _logger.debug("now sdp\n", desc.sdp);
            // }


            _logger.debug('setLocalDescription start', desc, self._rtcId, self.__id, self.closed, self.optimalVideoCodecs);
            self._rtcPeerConnection.setLocalDescription(desc).then(self._onSetLocalSessionDescriptionSuccess.bind(self), self._onSetSessionDescriptionError.bind(self)).then(function () {
                desc.cctx = self.cctx;
                (onCreateOfferSuccess || self.onCreateOfferSuccess.bind(self))(desc);
            });
        }, onCreateOfferError || self._onCreateSessionDescriptionError.bind(self));
    },

    createPRAnswer: function createPRAnswer(onCreatePRAnswerSuccess, onCreatePRAnswerError) {
        var self = this;

        _logger.info(' createPRAnswer start', self.closed, self.sdpConstraints);
        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
        return self._rtcPeerConnection.createAnswer(self.sdpConstraints).then(function (desc) {
            _logger.debug('_____________PRAnswer ', desc.sdp, self._rtcId, self.__id, self.closed); //_logger.debug('from :\n' + desc.sdp);

            desc.type = "pranswer";
            desc.sdp = desc.sdp.replace(/a=recvonly/g, 'a=inactive');

            self.__prAnswerDescription = desc;

            _logger.debug('inactive PRAnswer ', desc.sdp, self._rtcId, self.__id, self.closed); //_logger.debug('from :\n' + desc.sdp);
            _logger.debug('setLocalDescription start', desc, self._rtcId, self.__id, self.closed);

            self._rtcPeerConnection.setLocalDescription(desc).then(self._onSetLocalSessionDescriptionSuccess.bind(self), self._onSetSessionDescriptionError.bind(self)).then(function () {
                var sdpSection = new SDPSection(desc.sdp);
                sdpSection.updateHeaderMsidSemantic("MS_0000");
                sdpSection.updateAudioSSRCSection(1000, "CHROME0000", "MS_0000", "LABEL_AUDIO_1000");
                sdpSection.updateVideoSSRCSection(2000, "CHROME0000", "MS_0000", "LABEL_VIDEO_2000");

                desc.sdp = sdpSection.getUpdatedSDP();

                _logger.debug('Send PRAnswer ', desc.sdp, self._rtcId, self.__id, self.closed); //_logger.debug('from :\n' + desc.sdp);

                self.cctx && (desc.cctx = self.cctx);
                (onCreatePRAnswerSuccess || self.onCreatePRAnswerSuccess.bind(self))(desc);
            });
        }, onCreatePRAnswerError || self._onCreateSessionDescriptionError.bind(self));
    },

    createAnswer: function createAnswer(onCreateAnswerSuccess, onCreateAnswerError) {
        var self = this;

        _logger.info('createAnswer start', self.closed, self.sdpConstraints);
        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
        return self._rtcPeerConnection.createAnswer(self.sdpConstraints).then(function (desc) {
            _logger.debug('_____________________Answer ', self._rtcId, self.__id, self.closed); //_logger.debug('from :\n' + desc.sdp);

            desc.type = 'answer';

            function updateSDP() {
                var sdpSection = new SDPSection(desc.sdp);
                var ms = sdpSection.parseMsidSemantic(sdpSection.headerSection);
                if (!ms) {
                    return;
                }

                if (ms.WMS == '*') {
                    sdpSection.updateHeaderMsidSemantic(ms.WMS = "MS_0000");
                }
                var audioSSRC = sdpSection.parseSSRC(sdpSection.audioSection);
                var videoSSRC = sdpSection.parseSSRC(sdpSection.videoSection);

                audioSSRC && sdpSection.updateAudioSSRCSection(1000, "CHROME0000", ms.WMS, audioSSRC.label || "LABEL_AUDIO_1000");
                if (videoSSRC) {
                    sdpSection.updateVideoSSRCSection(2000, "CHROME0000", ms.WMS, videoSSRC.label || "LABEL_VIDEO_2000");
                }
                // mslabel cname

                desc.sdp = sdpSection.getUpdatedSDP();
            }

            if (emedia.supportPRAnswer) {
                updateSDP();
            }

            self.__answerDescription = desc;

            _logger.debug('Answer ', self._rtcId, self.__id, self.closed); //_logger.debug('from :\n' + desc.sdp);
            _logger.debug('setLocalDescription start', desc, self._rtcId, self.__id, self.closed);

            self._rtcPeerConnection.setLocalDescription(desc).then(self._onSetLocalSessionDescriptionSuccess.bind(self), self._onSetSessionDescriptionError.bind(self)).then(function () {
                if (emedia.supportPRAnswer) {
                    var sdpSection = new SDPSection(desc.sdp);

                    sdpSection.updateHeaderMsidSemantic("MS_0000");
                    sdpSection.updateAudioSSRCSection(1000, "CHROME0000", "MS_0000", "LABEL_AUDIO_1000");
                    sdpSection.updateVideoSSRCSection(2000, "CHROME0000", "MS_0000", "LABEL_VIDEO_2000");

                    desc.sdp = sdpSection.getUpdatedSDP();
                }

                _logger.debug('Send Answer ', self._rtcId, self.__id, self.closed); //_logger.debug('from :\n' + desc.sdp);

                self.cctx && (desc.cctx = self.cctx);
                (onCreateAnswerSuccess || self.onCreateAnswerSuccess.bind(self))(desc);
            });
        }, onCreateAnswerError || self._onCreateSessionDescriptionError.bind(self));
    },

    close: function close(remainLocalStream, onlyPeerConnectionClosed, retryBuild) {
        var self = this;
        _logger.warn("webrtc closing", self._rtcId, self.__id, self.closed);

        self.__iceWaitIntervalId && clearTimeout(self.__iceWaitIntervalId);

        if (self.closed) {
            return;
        }

        onlyPeerConnectionClosed = onlyPeerConnectionClosed === true;

        self.closed = true;
       

        try {
            //self.getStats();
            self._rtcPeerConnection && self._rtcPeerConnection.close();
        } catch (e) {
            _logger.warn(e);
        } finally {
            // if (self._localStream && remainLocalStream === false) {
            //     //localstream存在，不保留localstream
            //     emedia.stopTracks(self._localStream);
            // }
            // if (self._remoteStream) {
            //     emedia.stopTracks(self._remoteStream);
            // }
            // self._remoteStream = null;
            if (!onlyPeerConnectionClosed) {
                self.onClose && self.onClose();
            }
            if (retryBuild === true) {
                _logger.info("Webrtc close. but retry build. will onIceStateChange(failed). eg. emedia.config iceWaitBuildMillis", self._rtcId, self.__id);
                self.onIceStateChange && self.onIceStateChange('failed');
            }

            _logger.warn("webrtc closed. closed:", self._rtcId, self.__id, self.closed);
        }
    },

    addIceCandidate: function addIceCandidate(candidate) {
        var self = this;

        if (!self._rtcPeerConnection) {
            return;
        }

        _logger.debug('Add ICE candidate: ', candidate, self._rtcId, self.__id, self.closed);

        var _cands = _util.isArray(candidate) ? candidate : [];
        !_util.isArray(candidate) && _cands.push(candidate);

        if (!self.__setRemoteSDP) {
            Array.prototype.push.apply(self.__tmpRemoteCands || (self.__tmpRemoteCands = {}), _cands);

            _logger.debug('Add ICE candidate but tmp buffer caused by not set remote sdp: ', candidate, self._rtcId, self.__id, self.closed);
            return;
        }

        for (var i = 0; i < _cands.length; i++) {
            candidate = _cands[i];

            if (candidate.cctx && candidate.cctx != self.cctx) {
                _logger.warn('addIceCandidate fail drop. cctx not equal. ', candidate, self._rtcId, self.__id, self.closed);
                continue;
            }

            //candidate.candidate = candidate.candidate.replace("172.17.2.130", "10.121.63.1");
            if (self.fireFoxOfferVideoPreAudio === true) {
                //candidate.sdpMid = "sdparta_0";
                var oldLineIndex = candidate.sdpMLineIndex;
                candidate.sdpMLineIndex = parseInt(candidate.sdpMid.replace(/[^0-9]*/, ''));
                _logger.warn("Firefox sdp section video pre audio, sdp mline index update ", oldLineIndex, "->", candidate.sdpMLineIndex);
            }

            if (candidate.candidate && candidate.candidate !== "") {
                self._rtcPeerConnection.addIceCandidate(new RTCIceCandidate(candidate)).then(self.onAddIceCandidateSuccess.bind(self), self._onAddIceCandidateError.bind(self));
            } else {
                _logger.warn("Add ICE candidate fail. drop it ", candidate, self._rtcId, self.__id, self.closed);
            }
        }
    },

    setRemoteDescription: function setRemoteDescription(desc) {
        var self = this;
        //setTimeout(self._setRemoteDescription.bind(this, desc), 1000);
        self._setRemoteDescription(desc);
    },

    _setRemoteDescription: function _setRemoteDescription(desc) {
        var self = this;

        if (self.__iceWaitIntervalId) {
            clearTimeout(self.__iceWaitIntervalId);
            self.__iceWaitIntervalId = null;
            _logger.info("emedia.config iceWaitBuildMillis, clear ice wait interval id", self._rtcId, self.__id);
        }

        _logger.debug('setRemoteDescription start. ', self._rtcId, self.__id, self.closed);

        // 生成offer的
        // 会议模式，也是设置的是 pranswer 和 answer 会有服务器传回。
        // p2p模式下的主叫。此时设置的是 pranswer 和 answer。这个应该有p2p模式下传回。因此，需要如果有的话，需要判断
        if (self.offerDescription) {
            if (desc.cctx && desc.cctx != self.cctx) {
                _logger.warn('setRemoteDescription fail drop. cctx not equal. ', desc, self._rtcId, self.__id, self.closed);
                return;
            }

            if (self.fireFoxOfferVideoPreAudio === true || self.__offerVideoPreAudio === true) {
                //_logger.debug("Remote sdp.1", desc.sdp);

                var sdpSection = new SDPSection(desc.sdp, self);
                desc.sdp = sdpSection.getUpdatedSDP(false);
                _logger.info("Remote sdp.2. switch audio video", desc.sdp);
            }
        } else {
            //被叫 p2p模式，覆盖
            desc.cctx && (self.cctx = desc.cctx);
        }

        desc.sdp = desc.sdp.replace(/UDP\/TLS\/RTP\/SAVPF/g, "RTP/SAVPF");
        _logger.warn('setRemoteDescription. UDP/TLS/RTP/SAVPF -> RTP/SAVPF; if firefox: switch audio video;', self._rtcId, self.__id);
        _logger.debug('setRemoteDescription.', desc, self._rtcId, self.__id);

        // https://webrtchacks.com/limit-webrtc-bandwidth-sdp/
        // bitrate
        if (self.vbitrate || self.abitrate) {
            var sdpSection = new SDPSection(desc.sdp, self);

            self.vbitrate && sdpSection.setVideoBitrate(self.vbitrate);
            self.abitrate && sdpSection.setAudioBitrate(self.abitrate);

            _logger.warn("vbitrate = ", self.vbitrate, ", abitrate = ", self.abitrate, self._rtcId, self.__id);
            desc.sdp = sdpSection.getUpdatedSDP();
        }

        desc = self.__remoteDescription = new RTCSessionDescription(desc);

        return self._rtcPeerConnection.setRemoteDescription(desc).then(function () {
            self.__setRemoteSDP = true;
            self._onSetRemoteSuccess.apply(self, arguments);

            if (self.__tmpLocalCands && self.__tmpLocalCands.length > 0) {
                _logger.debug('After setRemoteDescription. send cands', self._rtcId, self.__id, self.closed);
                self._onIceCandidate(self.__tmpLocalCands);

                self.__tmpLocalCands = [];
            }

            if (self.__tmpRemoteCands && self.__tmpRemoteCands.length > 0) {
                _logger.debug('After setRemoteDescription. add tmp cands', self._rtcId, self.__id, self.closed);
                self.addIceCandidate(self.__tmpRemoteCands);

                self.__tmpRemoteCands = [];
            }
        }, self._onSetSessionDescriptionError.bind(self));
    },

    iceConnectionState: function iceConnectionState() {
        var self = this;

        return self._rtcPeerConnection.iceConnectionState;
    },

    isConnected: function isConnected() {
        var self = this;

        var state = self._rtcPeerConnection.iceConnectionState;

        return "connected" === state || "completed" === state;
    },

    _onGotRemoteStream: function _onGotRemoteStream(event) {
        var self = this;

        this._remoteStream = event.stream || event.streams[0];
        this._remoteStream._rtcId = this._rtcId;
        this._remoteStream.__rtc_c_id = this.__id;
        _logger.debug('On got remote stream', this._remoteStream ? this._remoteStream.id : "null", self._rtcId, self.__id);

        self.updateRemoteBySubArgs();

        this.onGotRemoteStream(this._remoteStream, event);

        _logger.debug('received remote stream, you will see the other.', self._rtcId, self.__id, this.closed);
    },

    _onSetRemoteSuccess: function _onSetRemoteSuccess() {
        _logger.info('onSetRemoteSuccess success', this._rtcId, this.__id);
        this.onSetRemoteSuccess.apply(this, arguments);

        if (this.offerDescription && this.__remoteDescription && this.__remoteDescription.sdp) {
            this._onAnswerCodes(this.__remoteDescription.sdp);
        }
    },

    _onAnswerCodes: function _onAnswerCodes(sdp) {
        var self = this;
        var section = new SDPSection(sdp, this);
        if (section.videoSection) {
            var rtpParams = SDPUtils.parseRtpParameters(section.videoSection);

            if (!rtpParams.codecs || rtpParams.codecs.length === 0) {
                _logger.info("not found any video codes. @ ", self._rtcId, self.__id);
                return;
            }

            var vcodes = [];
            _util.forEach(rtpParams.codecs, function (_i, _param) {
                vcodes.push(_param.name);
            });

            self.finalVCodeChoices = vcodes;

            self.onVCodeChoices && self.onVCodeChoices(vcodes);
        }
    },

    onSetRemoteSuccess: function onSetRemoteSuccess() {},

    onAddIceCandidateSuccess: function onAddIceCandidateSuccess() {
        _logger.debug('addIceCandidate success', this._rtcId, this.__id);
    },

    _onAddIceCandidateError: function _onAddIceCandidateError(error) {
        _logger.error('failed to add ICE Candidate: ' + error.toString(), this._rtcId, this.__id);
        this.onAddIceCandidateError(error);
    },
    onAddIceCandidateError: function onAddIceCandidateError(error) {},

    _onIceCandidate: function _onIceCandidate(candidate) {
        _logger.debug('onIceCandidate:', candidate, this._rtcId, this.__id);
        this.onIceCandidate(candidate);
    },
    onIceCandidate: function onIceCandidate(candidate) {},

    onIceStateChange: function onIceStateChange(state) {
        _logger.debug('onIceStateChange : ICE state ', state);
    },

    _onCreateSessionDescriptionError: function _onCreateSessionDescriptionError(error) {
        _logger.error('Failed to create session description: ' + error.toString(), this._rtcId, this.__id);
        this.onCreateSessionDescriptionError(error);
    },
    onCreateSessionDescriptionError: function onCreateSessionDescriptionError(error) {},

    onCreateOfferSuccess: function onCreateOfferSuccess(desc) {
        _logger.debug('create offer success', this._rtcId, this.__id);
    },

    onCreatePRAnswerSuccess: function onCreatePRAnswerSuccess(desc) {
        _logger.debug('create answer success', this._rtcId, this.__id);
    },

    onCreateAnswerSuccess: function onCreateAnswerSuccess(desc) {
        _logger.debug('create answer success', this._rtcId, this.__id);
    },

    _onSetSessionDescriptionError: function _onSetSessionDescriptionError(error) {
        _logger.error('onSetSessionDescriptionError : Failed to set session description: ' + error.toString(), this._rtcId, this.__id);
        this.onSetSessionDescriptionError(error);
    },
    onSetSessionDescriptionError: function onSetSessionDescriptionError(error) {},
    _onSetLocalSessionDescriptionSuccess: function _onSetLocalSessionDescriptionSuccess() {
        var self = this;
        _logger.debug('onSetLocalSessionDescriptionSuccess : setLocalDescription complete', this._rtcId, this.__id);

        if (emedia.config.iceWaitBuildMillis) {
            this.__iceWaitIntervalId && clearTimeout(this.__iceWaitIntervalId);
            this.__iceWaitIntervalId = setTimeout(function () {
                _logger.info("emedia.config iceWaitBuildMillis, timeout, will close webrtc, will retry build by onIceStateChange(failed)", self._rtcId, self.__id);
                //self.close(true, true, true);
                self.onIceStateChange && self.onIceStateChange('failed');
            }, emedia.config.iceWaitBuildMillis);
            _logger.info("emedia.config iceWaitBuildMillis, start timeout", self._rtcId, self.__id);
        }

        this.onSetLocalSessionDescriptionSuccess();

        if (this.__answerDescription && this.__answerDescription.sdp) {
            this._onAnswerCodes(this.__answerDescription.sdp);
        }
    },
    onSetLocalSessionDescriptionSuccess: function onSetLocalSessionDescriptionSuccess() {},

    onGotRemoteStream: function onGotRemoteStream(remoteStream) {
        _logger.debug("Got remote stream. ", remoteStream, this._rtcId, this.__id);
    },

    getStats: function getStats(onCallback) {
        var self = this;

        if (!self._rtcPeerConnection) {
            _logger.warn("Get stats, but peer connection not exsits, ", this._rtcId, this.__id);
            return;
        }

        if (typeof emedia.config.rtcStatsTypeMath !== 'function') {
            _logger.warn("Get stats, but config rtcStatsTypeMather, ", this._rtcId, this.__id);
            return;
        }

        self._rtcPeerConnection.getStats(null).then(function (stats) {
            stats.forEach(function (_stat, name) {
                if (emedia.config.rtcStatsTypeMath(_stat, name)) {
                    _logger.info("Rtc stats", _stat, self._rtcId, self.__id);
                }
            });
            onCallback && onCallback(stats);
        });
    }
});

module.exports = _WebRTC;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-env node */


// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// returns the session description.
SDPUtils.getDescription = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
}

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  // legacy alias, got renamed back to channels in ORTC.
  parsed.numChannels = parsed.channels;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  var channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (channels !== 1 ? '/' + channels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
          ? '/' + headerExtension.direction
          : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      if (codec.parameters[param]) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
}

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
      'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(function(extension) {
      sdp += SDPUtils.writeExtmap(extension);
    });
  }
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.substr(17).split(' ');
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10),
      };
      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {ssrc: secondarySsrc};
      }
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: secondarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  var cname;
  // Gets the first SSRC. Note that with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=thisisadapterortc ' + sessionId + ' ' + version + ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5],
  };
}

// Expose public methods.
if (true) {
  module.exports = SDPUtils;
}


/***/ })
/******/ ]);
});
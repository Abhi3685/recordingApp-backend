(this["webpackJsonprecording-app"]=this["webpackJsonprecording-app"]||[]).push([[5],{228:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!==a(e)&&"function"!==typeof e)return{default:e};var t=u();if(t&&t.has(e))return t.get(e);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if(Object.prototype.hasOwnProperty.call(e,o)){var i=r?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=e[o]}n.default=e,t&&t.set(e,n);return n}(n(0)),o=n(61);function u(){if("function"!==typeof WeakMap)return null;var e=new WeakMap;return u=function(){return e},e}function a(e){return(a="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function l(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t){return(c=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}function s(e,t){return!t||"object"!==a(t)&&"function"!==typeof t?f(e):t}function f(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function p(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(e){return!1}}function y(e){return(y=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var d="https://connect.facebook.net/en_US/sdk.js",h=function(e){!function(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&c(e,t)}(v,e);var t,n,u,a,h=(t=v,function(){var e,n=y(t);if(p()){var r=y(this).constructor;e=Reflect.construct(n,arguments,r)}else e=n.apply(this,arguments);return s(this,e)});function v(){var e;i(this,v);for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return b(f(e=h.call.apply(h,[this].concat(n))),"callPlayer",o.callPlayer),b(f(e),"playerID",e.props.config.playerId||"".concat("facebook-player-").concat((0,o.randomString)())),b(f(e),"mute",(function(){e.callPlayer("mute")})),b(f(e),"unmute",(function(){e.callPlayer("unmute")})),e}return n=v,(u=[{key:"componentDidMount",value:function(){this.props.onMount&&this.props.onMount(this)}},{key:"load",value:function(e,t){var n=this;t?(0,o.getSDK)(d,"FB","fbAsyncInit").then((function(e){return e.XFBML.parse()})):(0,o.getSDK)(d,"FB","fbAsyncInit").then((function(e){e.init({appId:n.props.config.appId,xfbml:!0,version:n.props.config.version}),e.Event.subscribe("xfbml.render",(function(e){n.props.onLoaded()})),e.Event.subscribe("xfbml.ready",(function(e){"video"===e.type&&e.id===n.playerID&&(n.player=e.instance,n.player.subscribe("startedPlaying",n.props.onPlay),n.player.subscribe("paused",n.props.onPause),n.player.subscribe("finishedPlaying",n.props.onEnded),n.player.subscribe("startedBuffering",n.props.onBuffer),n.player.subscribe("finishedBuffering",n.props.onBufferEnd),n.player.subscribe("error",n.props.onError),n.props.muted||n.callPlayer("unmute"),n.props.onReady(),document.getElementById(n.playerID).querySelector("iframe").style.visibility="visible")}))}))}},{key:"play",value:function(){this.callPlayer("play")}},{key:"pause",value:function(){this.callPlayer("pause")}},{key:"stop",value:function(){}},{key:"seekTo",value:function(e){this.callPlayer("seek",e)}},{key:"setVolume",value:function(e){this.callPlayer("setVolume",e)}},{key:"getDuration",value:function(){return this.callPlayer("getDuration")}},{key:"getCurrentTime",value:function(){return this.callPlayer("getCurrentPosition")}},{key:"getSecondsLoaded",value:function(){return null}},{key:"render",value:function(){return r.default.createElement("div",{style:{width:"100%",height:"100%"},id:this.playerID,className:"fb-video","data-href":this.props.url,"data-autoplay":this.props.playing?"true":"false","data-allowfullscreen":"true","data-controls":this.props.controls?"true":"false"})}}])&&l(n.prototype,u),a&&l(n,a),v}(r.Component);t.default=h,b(h,"displayName","Facebook"),b(h,"loopOnEnded",!0)}}]);
//# sourceMappingURL=5.ddd954fb.chunk.js.map
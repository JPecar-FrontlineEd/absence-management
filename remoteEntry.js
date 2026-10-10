/******/ var __webpack_modules__ = ({

/***/ "./node_modules/.federation/entry.27554b3ac4caf80dc386f87176302425.js"
/*!****************************************************************************!*\
  !*** ./node_modules/.federation/entry.27554b3ac4caf80dc386f87176302425.js ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_runner_work_absence_management_absence_management_node_modules_module_federation_webpack_bundler_runtime_dist_bundler_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@module-federation/webpack-bundler-runtime/dist/bundler.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/bundler.js");


if(!__webpack_require__.federation.runtime || !__webpack_require__.federation.bundlerRuntime){
	var prevFederation = __webpack_require__.federation;
	__webpack_require__.federation = {}
	for(var key in _home_runner_work_absence_management_absence_management_node_modules_module_federation_webpack_bundler_runtime_dist_bundler_js__WEBPACK_IMPORTED_MODULE_0__["default"]){
		__webpack_require__.federation[key] = _home_runner_work_absence_management_absence_management_node_modules_module_federation_webpack_bundler_runtime_dist_bundler_js__WEBPACK_IMPORTED_MODULE_0__["default"][key];
	}
	for(var key in prevFederation){
		__webpack_require__.federation[key] = prevFederation[key];
	}
}
if(!__webpack_require__.federation.instance){

	__webpack_require__.federation.instance = __webpack_require__.federation.bundlerRuntime.init({webpackRequire:__webpack_require__});
	if(__webpack_require__.federation.attachShareScopeMap){
		__webpack_require__.federation.attachShareScopeMap(__webpack_require__)
	}
	if(__webpack_require__.federation.installInitialConsumes){
		__webpack_require__.federation.installInitialConsumes()
	}
}

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/_virtual/_rolldown/runtime.js"
/*!*****************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/_virtual/_rolldown/runtime.js ***!
  \*****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __exportAll: () => (/* binding */ __exportAll)
/* harmony export */ });
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};

//#endregion


/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/constant.js"
/*!***********************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/constant.js ***!
  \***********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_REMOTE_TYPE: () => (/* binding */ DEFAULT_REMOTE_TYPE),
/* harmony export */   DEFAULT_SCOPE: () => (/* binding */ DEFAULT_SCOPE)
/* harmony export */ });
//#region src/constant.ts
const DEFAULT_SCOPE = "default";
const DEFAULT_REMOTE_TYPE = "global";

//#endregion

//# sourceMappingURL=constant.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/core.js"
/*!*******************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/core.js ***!
  \*******************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModuleFederation: () => (/* binding */ ModuleFederation)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant.js */ "./node_modules/@module-federation/runtime-core/dist/constant.js");
/* harmony import */ var _utils_share_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/share.js */ "./node_modules/@module-federation/runtime-core/dist/utils/share.js");
/* harmony import */ var _utils_env_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/env.js */ "./node_modules/@module-federation/runtime-core/dist/utils/env.js");
/* harmony import */ var _utils_plugin_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/plugin.js */ "./node_modules/@module-federation/runtime-core/dist/utils/plugin.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/hooks/syncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js");
/* harmony import */ var _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/hooks/asyncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js");
/* harmony import */ var _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/hooks/syncWaterfallHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js");
/* harmony import */ var _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils/hooks/asyncWaterfallHooks.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js");
/* harmony import */ var _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./utils/hooks/pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");
/* harmony import */ var _utils_hooks_index_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils/hooks/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js");
/* harmony import */ var _remote_disabled_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./remote/disabled.js */ "./node_modules/@module-federation/runtime-core/dist/remote/disabled.js");
/* harmony import */ var _plugins_snapshot_index_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./plugins/snapshot/index.js */ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/index.js");
/* harmony import */ var _plugins_generate_preload_assets_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./plugins/generate-preload-assets.js */ "./node_modules/@module-federation/runtime-core/dist/plugins/generate-preload-assets.js");
/* harmony import */ var _plugins_snapshot_SnapshotHandler_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./plugins/snapshot/SnapshotHandler.js */ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/SnapshotHandler.js");
/* harmony import */ var _plugins_snapshot_disabled_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./plugins/snapshot/disabled.js */ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/disabled.js");
/* harmony import */ var _shared_index_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./shared/index.js */ "./node_modules/@module-federation/runtime-core/dist/shared/index.js");
/* harmony import */ var _shared_disabled_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./shared/disabled.js */ "./node_modules/@module-federation/runtime-core/dist/shared/disabled.js");
/* harmony import */ var _remote_index_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./remote/index.js */ "./node_modules/@module-federation/runtime-core/dist/remote/index.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/getShortErrorMsg.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");























//#region src/core.ts
const USE_SNAPSHOT =  true ? !false : 0;
const USE_REMOTE =  true ? !false : 0;
const USE_SHARED =  true ? !false : 0;
var ModuleFederation = class {
	constructor(userOptions) {
		this.hooks = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_10__.PluginSystem({
			beforeInit: new _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_8__.SyncWaterfallHook("beforeInit"),
			init: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			beforeInitContainer: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_9__.AsyncWaterfallHook("beforeInitContainer"),
			initContainer: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_9__.AsyncWaterfallHook("initContainer")
		});
		this.version = "2.9.2";
		this.moduleCache = /* @__PURE__ */ new Map();
		this.loaderHook = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_10__.PluginSystem({
			getModuleInfo: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			createScript: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			createLink: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			fetch: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook(),
			loadEntryError: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook(),
			afterLoadEntry: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook("afterLoadEntry"),
			beforeInitRemote: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook("beforeInitRemote"),
			afterInitRemote: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook("afterInitRemote"),
			beforeGetExpose: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook("beforeGetExpose"),
			afterGetExpose: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook("afterGetExpose"),
			beforeExecuteFactory: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook("beforeExecuteFactory"),
			afterExecuteFactory: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook("afterExecuteFactory"),
			getModuleFactory: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_7__.AsyncHook()
		});
		this.bridgeHook = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_10__.PluginSystem({
			beforeBridgeRender: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			afterBridgeRender: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			beforeBridgeDestroy: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			afterBridgeDestroy: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook(),
			afterBridgeRouteSync: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_6__.SyncHook()
		});
		const plugins = USE_REMOTE && USE_SNAPSHOT ? [(0,_plugins_snapshot_index_js__WEBPACK_IMPORTED_MODULE_13__.snapshotPlugin)(), (0,_plugins_generate_preload_assets_js__WEBPACK_IMPORTED_MODULE_14__.generatePreloadAssetsPlugin)()] : [];
		const defaultOptions = {
			id: (0,_utils_env_js__WEBPACK_IMPORTED_MODULE_3__.getBuilderId)(),
			name: userOptions.name,
			plugins,
			remotes: [],
			shared: {},
			inBrowser: _module_federation_sdk__WEBPACK_IMPORTED_MODULE_20__.isBrowserEnvValue
		};
		this.name = userOptions.name;
		this.options = defaultOptions;
		this.snapshotHandler = USE_REMOTE ? new _plugins_snapshot_SnapshotHandler_js__WEBPACK_IMPORTED_MODULE_15__.SnapshotHandler(this) : new _plugins_snapshot_disabled_js__WEBPACK_IMPORTED_MODULE_16__.DisabledSnapshotHandler();
		this.sharedHandler = USE_SHARED ? new _shared_index_js__WEBPACK_IMPORTED_MODULE_17__.SharedHandler(this) : new _shared_disabled_js__WEBPACK_IMPORTED_MODULE_18__.DisabledSharedHandler();
		this.remoteHandler = USE_REMOTE ? new _remote_index_js__WEBPACK_IMPORTED_MODULE_19__.RemoteHandler(this) : new _remote_disabled_js__WEBPACK_IMPORTED_MODULE_12__.DisabledRemoteHandler();
		this.shareScopeMap = this.sharedHandler.shareScopeMap;
		this.registerPlugins([...defaultOptions.plugins, ...userOptions.plugins || []]);
		this.options = this.formatOptions(defaultOptions, userOptions);
	}
	initOptions(userOptions) {
		if (userOptions.name && userOptions.name !== this.options.name) (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)((0,_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_22__.getShortErrorMsg)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_21__.RUNTIME_010, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_23__.runtimeDescMap));
		this.registerPlugins(userOptions.plugins);
		const options = this.formatOptions(this.options, userOptions);
		this.options = options;
		return options;
	}
	async loadShare(pkgName, extraOptions) {
		return this.sharedHandler.loadShare(pkgName, extraOptions);
	}
	loadShareSync(pkgName, extraOptions) {
		return this.sharedHandler.loadShareSync(pkgName, extraOptions);
	}
	initializeSharing(shareScopeName = _constant_js__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_SCOPE, extraOptions) {
		return this.sharedHandler.initializeSharing(shareScopeName, extraOptions);
	}
	initRawContainer(name, url, container) {
		return this.remoteHandler.initRawContainer(name, url, container);
	}
	async loadRemote(id, options) {
		return this.remoteHandler.loadRemote(id, options);
	}
	async preloadRemote(preloadOptions) {
		return this.remoteHandler.preloadRemote(preloadOptions);
	}
	initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
		this.sharedHandler.initShareScopeMap(scopeName, shareScope, extraOptions);
	}
	formatOptions(globalOptions, userOptions) {
		const shared = USE_SHARED ? (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.formatShareConfigs)(globalOptions, userOptions).allShareInfos : {};
		const { userOptions: userOptionsRes, options: globalOptionsRes } = this.hooks.lifecycle.beforeInit.emit({
			origin: this,
			userOptions,
			options: globalOptions,
			shareInfo: shared
		});
		const remotes = this.remoteHandler.formatAndRegisterRemote(globalOptionsRes, userOptionsRes);
		const { allShareInfos } = this.sharedHandler.registerShared(globalOptionsRes, userOptionsRes);
		const plugins = [...globalOptionsRes.plugins];
		if (userOptionsRes.plugins) userOptionsRes.plugins.forEach((plugin) => {
			if (!plugins.includes(plugin)) plugins.push(plugin);
		});
		const optionsRes = {
			...globalOptions,
			...userOptions,
			plugins,
			remotes,
			shared: allShareInfos,
			id: userOptionsRes.id || globalOptions.id
		};
		this.hooks.lifecycle.init.emit({
			origin: this,
			options: optionsRes
		});
		return optionsRes;
	}
	registerPlugins(plugins) {
		this.options.plugins = (0,_utils_plugin_js__WEBPACK_IMPORTED_MODULE_4__.registerPlugins)(plugins, this);
	}
	registerRemotes(remotes, options) {
		return this.remoteHandler.registerRemotes(remotes, options);
	}
	registerShared(shared) {
		this.sharedHandler.registerShared(this.options, {
			...this.options,
			shared
		});
	}
};

//#endregion

//# sourceMappingURL=core.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/global.js"
/*!*********************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/global.js ***!
  \*********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CurrentGlobal: () => (/* binding */ CurrentGlobal),
/* harmony export */   Global: () => (/* binding */ Global),
/* harmony export */   addGlobalSnapshot: () => (/* binding */ addGlobalSnapshot),
/* harmony export */   getGlobalFederationConstructor: () => (/* binding */ getGlobalFederationConstructor),
/* harmony export */   getGlobalHostPlugins: () => (/* binding */ getGlobalHostPlugins),
/* harmony export */   getGlobalSnapshot: () => (/* binding */ getGlobalSnapshot),
/* harmony export */   getGlobalSnapshotInfoByModuleInfo: () => (/* binding */ getGlobalSnapshotInfoByModuleInfo),
/* harmony export */   getInfoWithoutType: () => (/* binding */ getInfoWithoutType),
/* harmony export */   getPreloaded: () => (/* binding */ getPreloaded),
/* harmony export */   getPreloadedAsset: () => (/* binding */ getPreloadedAsset),
/* harmony export */   getRemoteEntryExports: () => (/* binding */ getRemoteEntryExports),
/* harmony export */   getTargetSnapshotInfoByModuleInfo: () => (/* binding */ getTargetSnapshotInfoByModuleInfo),
/* harmony export */   globalLoading: () => (/* binding */ globalLoading),
/* harmony export */   nativeGlobal: () => (/* binding */ nativeGlobal),
/* harmony export */   registerGlobalPlugins: () => (/* binding */ registerGlobalPlugins),
/* harmony export */   resetFederationGlobalInfo: () => (/* binding */ resetFederationGlobalInfo),
/* harmony export */   setGlobalFederationConstructor: () => (/* binding */ setGlobalFederationConstructor),
/* harmony export */   setGlobalFederationInstance: () => (/* binding */ setGlobalFederationInstance),
/* harmony export */   setGlobalSnapshotInfoByModuleInfo: () => (/* binding */ setGlobalSnapshotInfoByModuleInfo),
/* harmony export */   setPreloaded: () => (/* binding */ setPreloaded),
/* harmony export */   setPreloadedAsset: () => (/* binding */ setPreloadedAsset)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");




//#region src/global.ts
const MAX_PRELOADED_ASSETS = 2e3;
const CurrentGlobal = typeof globalThis === "object" ? globalThis : window;
const nativeGlobal = (() => {
	try {
		return document.defaultView;
	} catch {
		return CurrentGlobal;
	}
})();
const Global = nativeGlobal;
function definePropertyGlobalVal(target, key, val) {
	Object.defineProperty(target, key, {
		value: val,
		configurable: false,
		writable: true
	});
}
function includeOwnProperty(target, key) {
	return Object.hasOwnProperty.call(target, key);
}
if (!includeOwnProperty(CurrentGlobal, "__GLOBAL_LOADING_REMOTE_ENTRY__")) definePropertyGlobalVal(CurrentGlobal, "__GLOBAL_LOADING_REMOTE_ENTRY__", {});
const globalLoading = CurrentGlobal.__GLOBAL_LOADING_REMOTE_ENTRY__;
function setGlobalDefaultVal(target) {
	if (includeOwnProperty(target, "__VMOK__") && !includeOwnProperty(target, "__FEDERATION__")) definePropertyGlobalVal(target, "__FEDERATION__", target.__VMOK__);
	if (!includeOwnProperty(target, "__FEDERATION__")) {
		definePropertyGlobalVal(target, "__FEDERATION__", {
			__GLOBAL_PLUGIN__: [],
			__INSTANCES__: [],
			moduleInfo: {},
			__SHARE__: {},
			__MANIFEST_LOADING__: {},
			__PRELOADED_MAP__: /* @__PURE__ */ new Map(),
			__PRELOADED_ASSETS__: /* @__PURE__ */ new Set()
		});
		definePropertyGlobalVal(target, "__VMOK__", target.__FEDERATION__);
	}
	target.__FEDERATION__.__GLOBAL_PLUGIN__ ??= [];
	target.__FEDERATION__.__INSTANCES__ ??= [];
	target.__FEDERATION__.moduleInfo ??= {};
	target.__FEDERATION__.__SHARE__ ??= {};
	target.__FEDERATION__.__MANIFEST_LOADING__ ??= {};
	target.__FEDERATION__.__PRELOADED_MAP__ ??= /* @__PURE__ */ new Map();
	target.__FEDERATION__.__PRELOADED_ASSETS__ ??= /* @__PURE__ */ new Set();
}
setGlobalDefaultVal(CurrentGlobal);
setGlobalDefaultVal(nativeGlobal);
function resetFederationGlobalInfo() {
	CurrentGlobal.__FEDERATION__.__GLOBAL_PLUGIN__ = [];
	CurrentGlobal.__FEDERATION__.__INSTANCES__ = [];
	CurrentGlobal.__FEDERATION__.moduleInfo = {};
	CurrentGlobal.__FEDERATION__.__SHARE__ = {};
	CurrentGlobal.__FEDERATION__.__MANIFEST_LOADING__ = {};
	CurrentGlobal.__FEDERATION__.__PRELOADED_ASSETS__.clear();
	Object.keys(globalLoading).forEach((key) => {
		delete globalLoading[key];
	});
}
function setGlobalFederationInstance(FederationInstance) {
	CurrentGlobal.__FEDERATION__.__INSTANCES__.push(FederationInstance);
}
function getGlobalFederationConstructor() {
	return CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR__;
}
function setGlobalFederationConstructor(FederationConstructor, isDebug = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_2__.isDebugMode)()) {
	if (isDebug) {
		CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR__ = FederationConstructor;
		CurrentGlobal.__FEDERATION__.__DEBUG_CONSTRUCTOR_VERSION__ = "2.9.2";
	}
}
function getInfoWithoutType(target, key) {
	if (typeof key === "string") if (target[key]) return {
		value: target[key],
		key
	};
	else {
		const targetKeys = Object.keys(target);
		for (const targetKey of targetKeys) {
			const [targetTypeOrName, _] = targetKey.split(":");
			const nKey = `${targetTypeOrName}:${key}`;
			const typeWithKeyRes = target[nKey];
			if (typeWithKeyRes) return {
				value: typeWithKeyRes,
				key: nKey
			};
		}
		return {
			value: void 0,
			key
		};
	}
	else (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`getInfoWithoutType: "key" must be a string, got ${typeof key} (${JSON.stringify(key)}).`);
}
const getGlobalSnapshot = () => nativeGlobal.__FEDERATION__.moduleInfo;
const getTargetSnapshotInfoByModuleInfo = (moduleInfo, snapshot) => {
	const getModuleInfo = getInfoWithoutType(snapshot, (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.getFMId)(moduleInfo)).value;
	if (getModuleInfo && !getModuleInfo.version && "version" in moduleInfo && moduleInfo["version"]) getModuleInfo.version = moduleInfo["version"];
	if (getModuleInfo) return getModuleInfo;
	if ("version" in moduleInfo && moduleInfo["version"]) {
		const { version, ...resModuleInfo } = moduleInfo;
		const moduleKeyWithoutVersion = (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.getFMId)(resModuleInfo);
		const getModuleInfoWithoutVersion = getInfoWithoutType(nativeGlobal.__FEDERATION__.moduleInfo, moduleKeyWithoutVersion).value;
		if (getModuleInfoWithoutVersion?.version === version) return getModuleInfoWithoutVersion;
	}
};
const getGlobalSnapshotInfoByModuleInfo = (moduleInfo) => getTargetSnapshotInfoByModuleInfo(moduleInfo, nativeGlobal.__FEDERATION__.moduleInfo);
const setGlobalSnapshotInfoByModuleInfo = (remoteInfo, moduleDetailInfo) => {
	const moduleKey = (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.getFMId)(remoteInfo);
	nativeGlobal.__FEDERATION__.moduleInfo[moduleKey] = moduleDetailInfo;
	return nativeGlobal.__FEDERATION__.moduleInfo;
};
const addGlobalSnapshot = (moduleInfos) => {
	nativeGlobal.__FEDERATION__.moduleInfo = {
		...nativeGlobal.__FEDERATION__.moduleInfo,
		...moduleInfos
	};
	return () => {
		const keys = Object.keys(moduleInfos);
		for (const key of keys) delete nativeGlobal.__FEDERATION__.moduleInfo[key];
	};
};
const getRemoteEntryExports = (name, globalName) => {
	const remoteEntryKey = globalName || `__FEDERATION_${name}:custom__`;
	return {
		remoteEntryKey,
		entryExports: CurrentGlobal[remoteEntryKey]
	};
};
const registerGlobalPlugins = (plugins) => {
	const { __GLOBAL_PLUGIN__ } = nativeGlobal.__FEDERATION__;
	plugins.forEach((plugin) => {
		if (__GLOBAL_PLUGIN__.findIndex((p) => p.name === plugin.name) === -1) __GLOBAL_PLUGIN__.push(plugin);
		else (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.warn)(`The plugin ${plugin.name} has been registered.`);
	});
};
const getGlobalHostPlugins = () => nativeGlobal.__FEDERATION__.__GLOBAL_PLUGIN__;
const getPreloaded = (id) => CurrentGlobal.__FEDERATION__.__PRELOADED_MAP__.get(id);
const setPreloaded = (id) => CurrentGlobal.__FEDERATION__.__PRELOADED_MAP__.set(id, true);
const getPreloadedAsset = (url) => CurrentGlobal.__FEDERATION__.__PRELOADED_ASSETS__.has(url);
const setPreloadedAsset = (url) => {
	const preloadedAssets = CurrentGlobal.__FEDERATION__.__PRELOADED_ASSETS__;
	preloadedAssets.add(url);
	if (preloadedAssets.size > MAX_PRELOADED_ASSETS) {
		const oldestUrl = preloadedAssets.values().next().value;
		if (oldestUrl !== void 0) preloadedAssets.delete(oldestUrl);
	}
};

//#endregion

//# sourceMappingURL=global.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/helpers.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/helpers.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ helpers_default)
/* harmony export */ });
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _utils_share_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/share.js */ "./node_modules/@module-federation/runtime-core/dist/utils/share.js");
/* harmony import */ var _utils_manifest_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/manifest.js */ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js");
/* harmony import */ var _utils_load_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/load.js */ "./node_modules/@module-federation/runtime-core/dist/utils/load.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _utils_preload_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/preload.js */ "./node_modules/@module-federation/runtime-core/dist/utils/preload.js");







//#region src/helpers.ts
const ShareUtils = {
	getRegisteredShare: _utils_share_js__WEBPACK_IMPORTED_MODULE_1__.getRegisteredShare,
	getGlobalShareScope: _utils_share_js__WEBPACK_IMPORTED_MODULE_1__.getGlobalShareScope
};
const GlobalUtils = {
	Global: _global_js__WEBPACK_IMPORTED_MODULE_0__.Global,
	nativeGlobal: _global_js__WEBPACK_IMPORTED_MODULE_0__.nativeGlobal,
	resetFederationGlobalInfo: _global_js__WEBPACK_IMPORTED_MODULE_0__.resetFederationGlobalInfo,
	setGlobalFederationInstance: _global_js__WEBPACK_IMPORTED_MODULE_0__.setGlobalFederationInstance,
	getGlobalFederationConstructor: _global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalFederationConstructor,
	setGlobalFederationConstructor: _global_js__WEBPACK_IMPORTED_MODULE_0__.setGlobalFederationConstructor,
	getInfoWithoutType: _global_js__WEBPACK_IMPORTED_MODULE_0__.getInfoWithoutType,
	getGlobalSnapshot: _global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalSnapshot,
	getTargetSnapshotInfoByModuleInfo: _global_js__WEBPACK_IMPORTED_MODULE_0__.getTargetSnapshotInfoByModuleInfo,
	getGlobalSnapshotInfoByModuleInfo: _global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalSnapshotInfoByModuleInfo,
	setGlobalSnapshotInfoByModuleInfo: _global_js__WEBPACK_IMPORTED_MODULE_0__.setGlobalSnapshotInfoByModuleInfo,
	addGlobalSnapshot: _global_js__WEBPACK_IMPORTED_MODULE_0__.addGlobalSnapshot,
	getRemoteEntryExports: _global_js__WEBPACK_IMPORTED_MODULE_0__.getRemoteEntryExports,
	registerGlobalPlugins: _global_js__WEBPACK_IMPORTED_MODULE_0__.registerGlobalPlugins,
	getGlobalHostPlugins: _global_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalHostPlugins,
	getPreloaded: _global_js__WEBPACK_IMPORTED_MODULE_0__.getPreloaded,
	setPreloaded: _global_js__WEBPACK_IMPORTED_MODULE_0__.setPreloaded
};
var helpers_default = {
	global: GlobalUtils,
	share: ShareUtils,
	utils: {
		matchRemoteWithNameAndExpose: _utils_manifest_js__WEBPACK_IMPORTED_MODULE_2__.matchRemoteWithNameAndExpose,
		preloadAssets: _utils_preload_js__WEBPACK_IMPORTED_MODULE_5__.preloadAssets,
		getRemoteInfo: _utils_load_js__WEBPACK_IMPORTED_MODULE_3__.getRemoteInfo
	}
};

//#endregion

//# sourceMappingURL=helpers.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/index.js"
/*!********************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/index.js ***!
  \********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CurrentGlobal: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal),
/* harmony export */   Global: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.Global),
/* harmony export */   Module: () => (/* binding */ Module),
/* harmony export */   ModuleFederation: () => (/* reexport safe */ _core_js__WEBPACK_IMPORTED_MODULE_11__.ModuleFederation),
/* harmony export */   addGlobalSnapshot: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.addGlobalSnapshot),
/* harmony export */   assert: () => (/* reexport safe */ _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert),
/* harmony export */   error: () => (/* reexport safe */ _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error),
/* harmony export */   getGlobalFederationConstructor: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalFederationConstructor),
/* harmony export */   getGlobalSnapshot: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalSnapshot),
/* harmony export */   getInfoWithoutType: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.getInfoWithoutType),
/* harmony export */   getRegisteredShare: () => (/* reexport safe */ _utils_share_js__WEBPACK_IMPORTED_MODULE_4__.getRegisteredShare),
/* harmony export */   getRemoteEntry: () => (/* reexport safe */ _utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteEntry),
/* harmony export */   getRemoteInfo: () => (/* reexport safe */ _utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteInfo),
/* harmony export */   helpers: () => (/* binding */ helpers),
/* harmony export */   isStaticResourcesEqual: () => (/* reexport safe */ _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.isStaticResourcesEqual),
/* harmony export */   loadScript: () => (/* reexport safe */ _module_federation_sdk__WEBPACK_IMPORTED_MODULE_13__.loadScript),
/* harmony export */   loadScriptNode: () => (/* reexport safe */ _module_federation_sdk__WEBPACK_IMPORTED_MODULE_14__.loadScriptNode),
/* harmony export */   matchRemoteWithNameAndExpose: () => (/* reexport safe */ _utils_manifest_js__WEBPACK_IMPORTED_MODULE_5__.matchRemoteWithNameAndExpose),
/* harmony export */   registerGlobalPlugins: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.registerGlobalPlugins),
/* harmony export */   resetFederationGlobalInfo: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.resetFederationGlobalInfo),
/* harmony export */   safeWrapper: () => (/* reexport safe */ _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.safeWrapper),
/* harmony export */   satisfy: () => (/* reexport safe */ _utils_semver_index_js__WEBPACK_IMPORTED_MODULE_3__.satisfy),
/* harmony export */   setGlobalFederationConstructor: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.setGlobalFederationConstructor),
/* harmony export */   setGlobalFederationInstance: () => (/* reexport safe */ _global_js__WEBPACK_IMPORTED_MODULE_2__.setGlobalFederationInstance),
/* harmony export */   types: () => (/* reexport safe */ _type_index_js__WEBPACK_IMPORTED_MODULE_12__.type_exports)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _utils_semver_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/semver/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/index.js");
/* harmony import */ var _utils_share_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/share.js */ "./node_modules/@module-federation/runtime-core/dist/utils/share.js");
/* harmony import */ var _utils_manifest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/manifest.js */ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js");
/* harmony import */ var _utils_load_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/load.js */ "./node_modules/@module-federation/runtime-core/dist/utils/load.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./helpers.js */ "./node_modules/@module-federation/runtime-core/dist/helpers.js");
/* harmony import */ var _module_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./module/index.js */ "./node_modules/@module-federation/runtime-core/dist/module/index.js");
/* harmony import */ var _remote_disabled_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./remote/disabled.js */ "./node_modules/@module-federation/runtime-core/dist/remote/disabled.js");
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./core.js */ "./node_modules/@module-federation/runtime-core/dist/core.js");
/* harmony import */ var _type_index_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./type/index.js */ "./node_modules/@module-federation/runtime-core/dist/type/index.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/dom.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/node.js");















//#region src/index.ts
const helpers = _helpers_js__WEBPACK_IMPORTED_MODULE_8__["default"];
const Module =  false ? 0 : _module_index_js__WEBPACK_IMPORTED_MODULE_9__.Module;

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/module/index.js"
/*!***************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/module/index.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Module: () => (/* binding */ Module$1)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _utils_manifest_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/manifest.js */ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js");
/* harmony import */ var _utils_load_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/load.js */ "./node_modules/@module-federation/runtime-core/dist/utils/load.js");
/* harmony import */ var _utils_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/context.js */ "./node_modules/@module-federation/runtime-core/dist/utils/context.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/utils.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");









//#region src/module/index.ts
function getAvailableExposeNames(remoteSnapshot) {
	if (!remoteSnapshot || !("modules" in remoteSnapshot) || !Array.isArray(remoteSnapshot.modules)) return;
	const exposes = remoteSnapshot.modules.map((module) => module.moduleName).filter(Boolean);
	return exposes.length ? exposes.join(",") : void 0;
}
function createRemoteEntryInitOptions(remoteInfo, hostShareScopeMap, rawInitScope) {
	const localShareScopeMap = hostShareScopeMap;
	const shareScopeKeys = Array.isArray(remoteInfo.shareScope) ? remoteInfo.shareScope : [remoteInfo.shareScope];
	if (!shareScopeKeys.length) shareScopeKeys.push("default");
	shareScopeKeys.forEach((shareScopeKey) => {
		if (!localShareScopeMap[shareScopeKey]) localShareScopeMap[shareScopeKey] = {};
	});
	const remoteEntryInitOptions = {
		version: remoteInfo.version || "",
		shareScopeKeys: Array.isArray(remoteInfo.shareScope) ? shareScopeKeys : remoteInfo.shareScope || "default"
	};
	Object.defineProperty(remoteEntryInitOptions, "shareScopeMap", {
		value: localShareScopeMap,
		enumerable: false
	});
	return {
		remoteEntryInitOptions,
		shareScope: localShareScopeMap[shareScopeKeys[0]],
		initScope: rawInitScope ?? []
	};
}
var Module$1 = class {
	constructor({ remoteInfo, host }) {
		this.inited = false;
		this.initing = false;
		this.lib = void 0;
		this.remoteInfo = remoteInfo;
		this.host = host;
	}
	async getEntry(expose, resourceContext) {
		const effectiveResourceContext = resourceContext || {
			initiator: "loadRemote",
			id: (0,_utils_manifest_js__WEBPACK_IMPORTED_MODULE_2__.composeRemoteRequestId)(this.remoteInfo.name, expose),
			resourceType: "remoteEntry",
			url: this.remoteInfo.entry,
			expose
		};
		const remoteEntryExports = await (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_3__.getRemoteEntry)({
			origin: this.host,
			remoteInfo: this.remoteInfo,
			remoteEntryExports: this.remoteEntryExports,
			resourceContext: effectiveResourceContext
		});
		(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(remoteEntryExports, `remoteEntryExports is undefined \n ${(0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__.safeToString)(this.remoteInfo)}`);
		this.remoteEntryExports = remoteEntryExports;
		return this.remoteEntryExports;
	}
	async init(id, remoteSnapshot, rawInitScope, expose, resourceContext) {
		const remoteEntryExports = await this.getEntry(expose, resourceContext);
		if (this.inited) {
			await this.host.loaderHook.lifecycle.afterInitRemote.emit({
				id,
				remoteInfo: this.remoteInfo,
				remoteSnapshot,
				remoteEntryExports,
				cached: true,
				origin: this.host
			});
			return remoteEntryExports;
		}
		if (this.initPromise) {
			try {
				await this.initPromise;
				await this.host.loaderHook.lifecycle.afterInitRemote.emit({
					id,
					remoteInfo: this.remoteInfo,
					remoteSnapshot,
					remoteEntryExports,
					cached: true,
					origin: this.host
				});
			} catch (initError) {
				await this.host.loaderHook.lifecycle.afterInitRemote.emit({
					id,
					remoteInfo: this.remoteInfo,
					remoteSnapshot,
					remoteEntryExports,
					error: initError,
					cached: true,
					origin: this.host
				});
				throw initError;
			}
			return remoteEntryExports;
		}
		this.initing = true;
		this.initPromise = (async () => {
			await this.host.loaderHook.lifecycle.beforeInitRemote.emit({
				id,
				remoteInfo: this.remoteInfo,
				remoteSnapshot,
				origin: this.host
			});
			const { remoteEntryInitOptions, shareScope, initScope } = createRemoteEntryInitOptions(this.remoteInfo, this.host.shareScopeMap, rawInitScope);
			const initContainerOptions = await this.host.hooks.lifecycle.beforeInitContainer.emit({
				shareScope,
				remoteEntryInitOptions,
				initScope,
				remoteInfo: this.remoteInfo,
				origin: this.host
			});
			if (typeof remoteEntryExports?.init === "undefined") (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_002, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__.runtimeDescMap, {
				hostName: this.host.name,
				remoteName: this.remoteInfo.name,
				remoteEntryUrl: this.remoteInfo.entry,
				remoteEntryKey: this.remoteInfo.entryGlobalName
			}, void 0, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_4__.optionsToMFContext)(this.host.options));
			try {
				await remoteEntryExports.init(initContainerOptions.shareScope, initContainerOptions.initScope, initContainerOptions.remoteEntryInitOptions);
			} catch (initError) {
				;(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_015, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__.runtimeDescMap, {
					hostName: this.host.name,
					remoteName: this.remoteInfo.name,
					remoteEntryUrl: this.remoteInfo.entry,
					remoteEntryKey: this.remoteInfo.entryGlobalName,
					shareScope: this.remoteInfo.shareScope
				}, `${initError}`, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_4__.optionsToMFContext)(this.host.options));
			}
			await this.host.hooks.lifecycle.initContainer.emit({
				...initContainerOptions,
				id,
				remoteSnapshot,
				remoteEntryExports
			});
			this.inited = true;
		})();
		try {
			await this.initPromise;
			await this.host.loaderHook.lifecycle.afterInitRemote.emit({
				id,
				remoteInfo: this.remoteInfo,
				remoteSnapshot,
				remoteEntryExports,
				origin: this.host
			});
		} catch (initError) {
			await this.host.loaderHook.lifecycle.afterInitRemote.emit({
				id,
				remoteInfo: this.remoteInfo,
				remoteSnapshot,
				remoteEntryExports,
				error: initError,
				origin: this.host
			});
			throw initError;
		} finally {
			this.initing = false;
			this.initPromise = void 0;
		}
		return remoteEntryExports;
	}
	async get(id, expose, options, remoteSnapshot) {
		const { loadFactory = true } = options || { loadFactory: true };
		const remoteEntryExports = await this.init(id, remoteSnapshot, void 0, expose);
		this.lib = remoteEntryExports;
		await this.host.loaderHook.lifecycle.beforeGetExpose.emit({
			id,
			expose,
			moduleInfo: this.remoteInfo,
			remoteEntryExports,
			origin: this.host
		});
		let moduleFactory;
		try {
			const hookModuleFactory = await this.host.loaderHook.lifecycle.getModuleFactory.emit({
				remoteEntryExports,
				expose,
				moduleInfo: this.remoteInfo
			});
			moduleFactory = typeof hookModuleFactory === "function" ? hookModuleFactory : void 0;
			if (!moduleFactory) moduleFactory = await remoteEntryExports.get(expose);
			if (!moduleFactory) (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_014, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__.runtimeDescMap, {
				hostName: this.host.name,
				remoteName: this.remoteInfo.name,
				remoteEntryUrl: this.remoteInfo.entry,
				expose,
				requestId: id,
				availableExposes: getAvailableExposeNames(remoteSnapshot)
			}, void 0, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_4__.optionsToMFContext)(this.host.options));
			await this.host.loaderHook.lifecycle.afterGetExpose.emit({
				id,
				expose,
				moduleInfo: this.remoteInfo,
				remoteEntryExports,
				moduleFactory,
				origin: this.host
			});
		} catch (getExposeError) {
			await this.host.loaderHook.lifecycle.afterGetExpose.emit({
				id,
				expose,
				moduleInfo: this.remoteInfo,
				remoteEntryExports,
				error: getExposeError,
				origin: this.host
			});
			throw getExposeError;
		}
		const symbolName = (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.processModuleAlias)(this.remoteInfo.name, expose);
		const wrapModuleFactory = this.wraperFactory(moduleFactory, symbolName);
		if (!loadFactory) return wrapModuleFactory;
		await this.host.loaderHook.lifecycle.beforeExecuteFactory.emit({
			id,
			expose,
			moduleInfo: this.remoteInfo,
			loadFactory,
			origin: this.host
		});
		try {
			const exposeContent = await wrapModuleFactory();
			await this.host.loaderHook.lifecycle.afterExecuteFactory.emit({
				id,
				expose,
				moduleInfo: this.remoteInfo,
				loadFactory,
				exposeModule: exposeContent,
				origin: this.host
			});
			return exposeContent;
		} catch (executeFactoryError) {
			await this.host.loaderHook.lifecycle.afterExecuteFactory.emit({
				id,
				expose,
				moduleInfo: this.remoteInfo,
				loadFactory,
				error: executeFactoryError,
				origin: this.host
			});
			throw executeFactoryError;
		}
	}
	wraperFactory(moduleFactory, id) {
		function defineModuleId(res, id) {
			if (res && typeof res === "object" && Object.isExtensible(res) && !Object.getOwnPropertyDescriptor(res, Symbol.for("mf_module_id"))) Object.defineProperty(res, Symbol.for("mf_module_id"), {
				value: id,
				enumerable: false
			});
		}
		return () => {
			const res = moduleFactory();
			if (res instanceof Promise) return res.then((asyncRes) => {
				defineModuleId(asyncRes, id);
				return asyncRes;
			});
			defineModuleId(res, id);
			return res;
		};
	}
};

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/plugins/generate-preload-assets.js"
/*!**********************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/plugins/generate-preload-assets.js ***!
  \**********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generatePreloadAssetsPlugin: () => (/* binding */ generatePreloadAssetsPlugin)
/* harmony export */ });
/* harmony import */ var _utils_tool_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _utils_share_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/share.js */ "./node_modules/@module-federation/runtime-core/dist/utils/share.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _utils_preload_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/preload.js */ "./node_modules/@module-federation/runtime-core/dist/utils/preload.js");
/* harmony import */ var _snapshot_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./snapshot/index.js */ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/index.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/utils.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/generateSnapshotFromManifest.js");








//#region src/plugins/generate-preload-assets.ts
function splitId(id) {
	const splitInfo = id.split(":");
	if (splitInfo.length === 1) return {
		name: splitInfo[0],
		version: void 0
	};
	else if (splitInfo.length === 2) return {
		name: splitInfo[0],
		version: splitInfo[1]
	};
	else return {
		name: splitInfo[1],
		version: splitInfo[2]
	};
}
function traverseModuleInfo(globalSnapshot, remoteInfo, traverse, isRoot, memo = {}, remoteSnapshot) {
	const { value: snapshotValue } = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getInfoWithoutType)(globalSnapshot, (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_0__.getFMId)(remoteInfo));
	const effectiveRemoteSnapshot = remoteSnapshot || snapshotValue;
	if (effectiveRemoteSnapshot && !(0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_8__.isManifestProvider)(effectiveRemoteSnapshot)) {
		traverse(effectiveRemoteSnapshot, remoteInfo, isRoot);
		if (effectiveRemoteSnapshot.remotesInfo) {
			const remoteKeys = Object.keys(effectiveRemoteSnapshot.remotesInfo);
			for (const key of remoteKeys) {
				if (memo[key]) continue;
				memo[key] = true;
				const subRemoteInfo = splitId(key);
				const remoteValue = effectiveRemoteSnapshot.remotesInfo[key];
				traverseModuleInfo(globalSnapshot, {
					name: subRemoteInfo.name,
					version: remoteValue.matchedVersion
				}, traverse, false, memo, void 0);
			}
		}
	}
}
const isExisted = (type, url) => {
	return document.querySelector(`${type}[${type === "link" ? "href" : "src"}="${url}"]`);
};
function generatePreloadAssets(origin, preloadOptions, remote, globalSnapshot, remoteSnapshot) {
	const cssAssets = [];
	const jsAssets = [];
	const entryAssets = [];
	const loadedSharedJsAssets = /* @__PURE__ */ new Set();
	const loadedSharedCssAssets = /* @__PURE__ */ new Set();
	const { options } = origin;
	const { preloadConfig: rootPreloadConfig } = preloadOptions;
	const { depsRemote } = rootPreloadConfig;
	traverseModuleInfo(globalSnapshot, remote, (moduleInfoSnapshot, remoteInfo, isRoot) => {
		let preloadConfig;
		if (isRoot) preloadConfig = rootPreloadConfig;
		else if (Array.isArray(depsRemote)) {
			const findPreloadConfig = depsRemote.find((remoteConfig) => {
				if (remoteConfig.nameOrAlias === remoteInfo.name || remoteConfig.nameOrAlias === remoteInfo.alias) return true;
				return false;
			});
			if (!findPreloadConfig) return;
			preloadConfig = (0,_utils_preload_js__WEBPACK_IMPORTED_MODULE_4__.defaultPreloadArgs)(findPreloadConfig);
		} else if (depsRemote === true) preloadConfig = rootPreloadConfig;
		else return;
		const remoteEntryUrl = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_7__.getResourceUrl)(moduleInfoSnapshot, (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_0__.getRemoteEntryInfoFromSnapshot)(moduleInfoSnapshot).url);
		if (remoteEntryUrl) entryAssets.push({
			name: remoteInfo.name,
			moduleInfo: {
				name: remoteInfo.name,
				entry: remoteEntryUrl,
				type: "remoteEntryType" in moduleInfoSnapshot ? moduleInfoSnapshot.remoteEntryType : "global",
				entryGlobalName: "globalName" in moduleInfoSnapshot ? moduleInfoSnapshot.globalName : remoteInfo.name,
				shareScope: "",
				version: "version" in moduleInfoSnapshot ? moduleInfoSnapshot.version : void 0
			},
			url: remoteEntryUrl
		});
		let moduleAssetsInfo = "modules" in moduleInfoSnapshot ? moduleInfoSnapshot.modules : [];
		const normalizedPreloadExposes = (0,_utils_preload_js__WEBPACK_IMPORTED_MODULE_4__.normalizePreloadExposes)(preloadConfig.exposes);
		if (normalizedPreloadExposes.length && "modules" in moduleInfoSnapshot) moduleAssetsInfo = moduleInfoSnapshot?.modules?.reduce((assets, moduleAssetInfo) => {
			if (normalizedPreloadExposes?.indexOf(moduleAssetInfo.moduleName) !== -1) assets.push(moduleAssetInfo);
			return assets;
		}, []);
		function handleAssets(assets) {
			const assetsRes = assets.map((asset) => (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_7__.getResourceUrl)(moduleInfoSnapshot, asset));
			if (preloadConfig.filter) return assetsRes.filter(preloadConfig.filter);
			return assetsRes;
		}
		if (moduleAssetsInfo) {
			const assetsLength = moduleAssetsInfo.length;
			for (let index = 0; index < assetsLength; index++) {
				const assetsInfo = moduleAssetsInfo[index];
				const exposeFullPath = `${remoteInfo.name}/${assetsInfo.moduleName}`;
				origin.remoteHandler.hooks.lifecycle.handlePreloadModule.emit({
					id: assetsInfo.moduleName === "." ? remoteInfo.name : exposeFullPath,
					name: remoteInfo.name,
					remoteSnapshot: moduleInfoSnapshot,
					preloadConfig,
					remote: remoteInfo,
					origin
				});
				if ((0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getPreloaded)(exposeFullPath)) continue;
				if (preloadConfig.resourceCategory === "all") {
					cssAssets.push(...handleAssets(assetsInfo.assets.css.async));
					cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.async));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
				} else if (preloadConfig.resourceCategory === "sync") {
					cssAssets.push(...handleAssets(assetsInfo.assets.css.sync));
					jsAssets.push(...handleAssets(assetsInfo.assets.js.sync));
				}
				;(0,_global_js__WEBPACK_IMPORTED_MODULE_1__.setPreloaded)(exposeFullPath);
			}
		}
	}, true, {}, remoteSnapshot);
	if (remoteSnapshot.shared && remoteSnapshot.shared.length > 0) {
		const collectSharedAssets = (shareInfo, snapshotShared) => {
			const { shared: registeredShared } = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.getRegisteredShare)(origin.shareScopeMap, snapshotShared.sharedName, shareInfo, origin.sharedHandler.hooks.lifecycle.resolveShare) || {};
			if (registeredShared && typeof registeredShared.lib === "function") {
				snapshotShared.assets.js.sync.forEach((asset) => {
					loadedSharedJsAssets.add(asset);
				});
				snapshotShared.assets.css.sync.forEach((asset) => {
					loadedSharedCssAssets.add(asset);
				});
			}
		};
		remoteSnapshot.shared.forEach((shared) => {
			const shareInfos = options.shared?.[shared.sharedName];
			if (!shareInfos) return;
			const sharedOptions = shared.version ? shareInfos.find((s) => s.version === shared.version) : shareInfos;
			if (!sharedOptions) return;
			(0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_0__.arrayOptions)(sharedOptions).forEach((s) => {
				collectSharedAssets(s, shared);
			});
		});
	}
	const needPreloadJsAssets = jsAssets.filter((asset) => !loadedSharedJsAssets.has(asset) && !isExisted("script", asset));
	return {
		cssAssets: cssAssets.filter((asset) => !loadedSharedCssAssets.has(asset) && !isExisted("link", asset)),
		jsAssetsWithoutEntry: needPreloadJsAssets,
		entryAssets: entryAssets.filter((entry) => !isExisted("script", entry.url))
	};
}
const generatePreloadAssetsPlugin = function() {
	return {
		name: "generate-preload-assets-plugin",
		async generatePreloadAssets(args) {
			const { origin, preloadOptions, remoteInfo, remote, globalSnapshot, remoteSnapshot } = args;
			if (!_module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__.isBrowserEnvValue) return {
				cssAssets: [],
				jsAssetsWithoutEntry: [],
				entryAssets: []
			};
			if ((0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_0__.isRemoteInfoWithEntry)(remote) && (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_0__.isPureRemoteEntry)(remote)) return {
				cssAssets: [],
				jsAssetsWithoutEntry: [],
				entryAssets: [{
					name: remote.name,
					url: remote.entry,
					moduleInfo: {
						name: remoteInfo.name,
						entry: remote.entry,
						type: remoteInfo.type || "global",
						entryGlobalName: "",
						shareScope: ""
					}
				}]
			};
			(0,_snapshot_index_js__WEBPACK_IMPORTED_MODULE_5__.assignRemoteInfo)(remoteInfo, remoteSnapshot);
			return generatePreloadAssets(origin, preloadOptions, remoteInfo, globalSnapshot, remoteSnapshot);
		}
	};
};

//#endregion

//# sourceMappingURL=generate-preload-assets.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/SnapshotHandler.js"
/*!***********************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/SnapshotHandler.js ***!
  \***********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SnapshotHandler: () => (/* binding */ SnapshotHandler),
/* harmony export */   getGlobalRemoteInfo: () => (/* binding */ getGlobalRemoteInfo)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _utils_load_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/load.js */ "./node_modules/@module-federation/runtime-core/dist/utils/load.js");
/* harmony import */ var _utils_context_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/context.js */ "./node_modules/@module-federation/runtime-core/dist/utils/context.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../utils/hooks/asyncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js");
/* harmony import */ var _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../utils/hooks/asyncWaterfallHooks.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js");
/* harmony import */ var _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils/hooks/pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");
/* harmony import */ var _utils_hooks_index_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../utils/hooks/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/generateSnapshotFromManifest.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");













//#region src/plugins/snapshot/SnapshotHandler.ts
function getGlobalRemoteInfo(moduleInfo, origin) {
	const hostGlobalSnapshot = (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalSnapshotInfoByModuleInfo)({
		name: origin.name,
		version: origin.options.version
	});
	const globalRemoteInfo = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getInfoWithoutType)(hostGlobalSnapshot.remotesInfo, moduleInfo.name).value;
	if (globalRemoteInfo && globalRemoteInfo.matchedVersion) return {
		hostGlobalSnapshot,
		globalSnapshot: (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalSnapshot)(),
		remoteSnapshot: (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalSnapshotInfoByModuleInfo)({
			name: moduleInfo.name,
			version: globalRemoteInfo.matchedVersion
		})
	};
	return {
		hostGlobalSnapshot: void 0,
		globalSnapshot: (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalSnapshot)(),
		remoteSnapshot: (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalSnapshotInfoByModuleInfo)({
			name: moduleInfo.name,
			version: "version" in moduleInfo ? moduleInfo.version : void 0
		})
	};
}
var SnapshotHandler = class {
	constructor(HostInstance) {
		this.loadingHostSnapshot = null;
		this.manifestCache = /* @__PURE__ */ new Map();
		this.hooks = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_8__.PluginSystem({
			beforeLoadRemoteSnapshot: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_6__.AsyncHook("beforeLoadRemoteSnapshot"),
			loadSnapshot: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_7__.AsyncWaterfallHook("loadGlobalSnapshot"),
			loadRemoteSnapshot: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_7__.AsyncWaterfallHook("loadRemoteSnapshot"),
			afterLoadSnapshot: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_7__.AsyncWaterfallHook("afterLoadSnapshot"),
			beforeLoadManifest: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_6__.AsyncHook("beforeLoadManifest"),
			afterLoadManifest: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_6__.AsyncHook("afterLoadManifest")
		});
		this.manifestLoading = _global_js__WEBPACK_IMPORTED_MODULE_2__.Global.__FEDERATION__.__MANIFEST_LOADING__;
		this.HostInstance = HostInstance;
		this.loaderHook = HostInstance.loaderHook;
	}
	async loadRemoteSnapshotInfo({ moduleInfo, id, initiator = "loadRemote" }) {
		const { options } = this.HostInstance;
		await this.hooks.lifecycle.beforeLoadRemoteSnapshot.emit({
			options,
			moduleInfo,
			origin: this.HostInstance
		});
		let hostSnapshot = (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalSnapshotInfoByModuleInfo)({
			name: this.HostInstance.options.name,
			version: this.HostInstance.options.version
		});
		if (!hostSnapshot) {
			hostSnapshot = {
				version: this.HostInstance.options.version || "",
				remoteEntry: "",
				remotesInfo: {}
			};
			(0,_global_js__WEBPACK_IMPORTED_MODULE_2__.addGlobalSnapshot)({ [this.HostInstance.options.name]: hostSnapshot });
		}
		if (hostSnapshot && "remotesInfo" in hostSnapshot && !(0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getInfoWithoutType)(hostSnapshot.remotesInfo, moduleInfo.name).value) {
			if ("version" in moduleInfo || "entry" in moduleInfo) hostSnapshot.remotesInfo = {
				...hostSnapshot?.remotesInfo,
				[moduleInfo.name]: { matchedVersion: "version" in moduleInfo ? moduleInfo.version : moduleInfo.entry }
			};
		}
		const { hostGlobalSnapshot, remoteSnapshot, globalSnapshot } = this.getGlobalRemoteInfo(moduleInfo);
		const { remoteSnapshot: globalRemoteSnapshot, globalSnapshot: globalSnapshotRes } = await this.hooks.lifecycle.loadSnapshot.emit({
			options,
			moduleInfo,
			hostGlobalSnapshot,
			remoteSnapshot,
			globalSnapshot
		});
		let mSnapshot;
		let gSnapshot;
		if (globalRemoteSnapshot) if ((0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_11__.isManifestProvider)(globalRemoteSnapshot)) {
			const remoteEntry = _module_federation_sdk__WEBPACK_IMPORTED_MODULE_10__.isBrowserEnvValue ? globalRemoteSnapshot.remoteEntry : globalRemoteSnapshot.ssrRemoteEntry || globalRemoteSnapshot.remoteEntry || "";
			const moduleSnapshot = await this.loadManifestSnapshot(remoteEntry, moduleInfo, {}, {
				initiator,
				id: id || moduleInfo.name
			});
			const globalSnapshotRes = (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.setGlobalSnapshotInfoByModuleInfo)({
				...moduleInfo,
				entry: remoteEntry
			}, moduleSnapshot);
			mSnapshot = moduleSnapshot;
			gSnapshot = globalSnapshotRes;
		} else {
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				remoteSnapshot: globalRemoteSnapshot,
				from: "global"
			});
			mSnapshot = remoteSnapshotRes;
			gSnapshot = globalSnapshotRes;
		}
		else if ((0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.isRemoteInfoWithEntry)(moduleInfo)) {
			const moduleSnapshot = await this.loadManifestSnapshot(moduleInfo.entry, moduleInfo, {}, {
				initiator,
				id: id || moduleInfo.name
			});
			const globalSnapshotRes = (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.setGlobalSnapshotInfoByModuleInfo)(moduleInfo, moduleSnapshot);
			mSnapshot = moduleSnapshot;
			gSnapshot = globalSnapshotRes;
		} else (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_12__.RUNTIME_007, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_13__.runtimeDescMap, {
			remoteName: moduleInfo.name,
			remoteVersion: moduleInfo.version,
			hostName: this.HostInstance.options.name,
			globalSnapshot: JSON.stringify(globalSnapshotRes)
		}, void 0, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_4__.optionsToMFContext)(this.HostInstance.options));
		await this.hooks.lifecycle.afterLoadSnapshot.emit({
			id,
			host: this.HostInstance,
			options,
			moduleInfo,
			remoteSnapshot: mSnapshot
		});
		return {
			remoteSnapshot: mSnapshot,
			globalSnapshot: gSnapshot
		};
	}
	getGlobalRemoteInfo(moduleInfo) {
		return getGlobalRemoteInfo(moduleInfo, this.HostInstance);
	}
	async getManifestJson(manifestUrl, moduleInfo, extraOptions, resourceOptions) {
		const getManifest = async () => {
			const remoteInfo = (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_3__.getRemoteInfo)(moduleInfo);
			let manifestJson = this.manifestCache.get(manifestUrl);
			if (manifestJson) {
				await this.hooks.lifecycle.afterLoadManifest.emit({
					manifestUrl,
					moduleInfo,
					resourceOptions,
					manifestJson,
					cached: true,
					origin: this.HostInstance
				});
				return manifestJson;
			}
			await this.hooks.lifecycle.beforeLoadManifest.emit({
				manifestUrl,
				moduleInfo,
				resourceOptions,
				origin: this.HostInstance
			});
			let response;
			let loadError;
			let recovered = false;
			try {
				let res = await this.loaderHook.lifecycle.fetch.emit(manifestUrl, {}, remoteInfo, resourceOptions ? {
					...resourceOptions,
					url: manifestUrl,
					resourceType: "manifest"
				} : void 0);
				if (!res || !(res instanceof Response)) res = await fetch(manifestUrl, {});
				response = res;
				manifestJson = await res.json();
			} catch (err) {
				loadError = err;
				manifestJson = await this.HostInstance.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
					id: manifestUrl,
					error: err,
					from: "runtime",
					lifecycle: "afterResolve",
					remote: remoteInfo,
					origin: this.HostInstance
				});
				if (!manifestJson) {
					delete this.manifestLoading[manifestUrl];
					await this.hooks.lifecycle.afterLoadManifest.emit({
						manifestUrl,
						moduleInfo,
						resourceOptions,
						response,
						error: err,
						origin: this.HostInstance
					});
					(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_12__.RUNTIME_003, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_13__.runtimeDescMap, {
						manifestUrl,
						moduleName: moduleInfo.name,
						hostName: this.HostInstance.options.name
					}, `${err}`, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_4__.optionsToMFContext)(this.HostInstance.options));
				}
				recovered = true;
			}
			const missingRequiredFields = [
				!manifestJson.metaData && "metaData",
				!manifestJson.exposes && "exposes",
				!manifestJson.shared && "shared"
			].filter(Boolean);
			const validationError = missingRequiredFields.length > 0 ? /* @__PURE__ */ new Error(`"${manifestUrl}" is not a valid federation manifest for remote "${moduleInfo.name}". Missing required fields: ${missingRequiredFields.join(", ")}.`) : void 0;
			if (validationError) await this.HostInstance.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
				id: manifestUrl,
				error: validationError,
				from: "runtime",
				lifecycle: "afterResolve",
				remote: remoteInfo,
				origin: this.HostInstance
			});
			await this.hooks.lifecycle.afterLoadManifest.emit({
				manifestUrl,
				moduleInfo,
				resourceOptions,
				manifestJson,
				response,
				error: validationError || loadError,
				recovered: validationError ? void 0 : recovered || void 0,
				origin: this.HostInstance
			});
			if (validationError) (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_12__.RUNTIME_013, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_13__.runtimeDescMap, {
				manifestUrl,
				moduleName: moduleInfo.name,
				hostName: this.HostInstance.options.name,
				missingFields: missingRequiredFields.join(",")
			}, void 0, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_4__.optionsToMFContext)(this.HostInstance.options));
			this.manifestCache.set(manifestUrl, manifestJson);
			return manifestJson;
		};
		return getManifest();
	}
	async loadManifestSnapshot(manifestUrl, moduleInfo, extraOptions, resourceOptions) {
		const asyncLoadProcess = async () => {
			const manifestJson = await this.getManifestJson(manifestUrl, moduleInfo, extraOptions, resourceOptions);
			const remoteSnapshot = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_11__.generateSnapshotFromManifest)(manifestJson, { version: manifestUrl });
			const { remoteSnapshot: remoteSnapshotRes } = await this.hooks.lifecycle.loadRemoteSnapshot.emit({
				options: this.HostInstance.options,
				moduleInfo,
				manifestJson,
				remoteSnapshot,
				manifestUrl,
				from: "manifest"
			});
			return remoteSnapshotRes;
		};
		if (!this.manifestLoading[manifestUrl]) this.manifestLoading[manifestUrl] = asyncLoadProcess().then((res) => res);
		return this.manifestLoading[manifestUrl];
	}
};

//#endregion

//# sourceMappingURL=SnapshotHandler.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/disabled.js"
/*!****************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/disabled.js ***!
  \****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DisabledSnapshotHandler: () => (/* binding */ DisabledSnapshotHandler)
/* harmony export */ });
/* harmony import */ var _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/hooks/pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");
/* harmony import */ var _utils_hooks_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/hooks/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js");



//#region src/plugins/snapshot/disabled.ts
var DisabledSnapshotHandler = class {
	constructor() {
		this.hooks = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_0__.PluginSystem({});
	}
};

//#endregion

//# sourceMappingURL=disabled.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/index.js"
/*!*************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/index.js ***!
  \*************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assignRemoteInfo: () => (/* binding */ assignRemoteInfo),
/* harmony export */   snapshotPlugin: () => (/* binding */ snapshotPlugin)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utils/tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _utils_manifest_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils/manifest.js */ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _utils_preload_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../utils/preload.js */ "./node_modules/@module-federation/runtime-core/dist/utils/preload.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/utils.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");








//#region src/plugins/snapshot/index.ts
function assignRemoteInfo(remoteInfo, remoteSnapshot) {
	const remoteEntryInfo = (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.getRemoteEntryInfoFromSnapshot)(remoteSnapshot);
	if (!remoteEntryInfo.url) (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_011, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__.runtimeDescMap, { remoteName: remoteInfo.name });
	let entryUrl = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__.getResourceUrl)(remoteSnapshot, remoteEntryInfo.url);
	if (!_module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__.isBrowserEnvValue && !entryUrl.startsWith("http")) entryUrl = `https:${entryUrl}`;
	remoteInfo.type = remoteEntryInfo.type;
	remoteInfo.entryGlobalName = remoteEntryInfo.globalName;
	remoteInfo.entry = entryUrl;
	remoteInfo.version = remoteSnapshot.version;
	remoteInfo.buildVersion = remoteSnapshot.buildVersion;
}
function snapshotPlugin() {
	return {
		name: "snapshot-plugin",
		async afterResolve(args) {
			const { remote, pkgNameOrAlias, expose, origin, remoteInfo, id } = args;
			if (!(0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.isRemoteInfoWithEntry)(remote) || !(0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.isPureRemoteEntry)(remote)) {
				const { remoteSnapshot, globalSnapshot } = await origin.snapshotHandler.loadRemoteSnapshotInfo({
					moduleInfo: remote,
					id: (0,_utils_manifest_js__WEBPACK_IMPORTED_MODULE_2__.composeRemoteRequestId)(remote.name, expose)
				});
				assignRemoteInfo(remoteInfo, remoteSnapshot);
				const preloadOps = [{
					nameOrAlias: pkgNameOrAlias,
					exposes: [expose],
					resourceCategory: "sync",
					share: false,
					depsRemote: false,
					recordPreloadedAssets: true
				}];
				await origin.remoteHandler.hooks.lifecycle.beforePreloadRemote.emit({
					preloadOps,
					options: origin.options,
					origin
				});
				const [preloadConfig] = preloadOps;
				if (preloadConfig) {
					const preloadOptions = {
						remote,
						preloadConfig
					};
					const assets = await origin.remoteHandler.hooks.lifecycle.generatePreloadAssets.emit({
						origin,
						preloadOptions,
						remoteInfo,
						remote,
						remoteSnapshot,
						globalSnapshot
					});
					if (assets) (0,_utils_preload_js__WEBPACK_IMPORTED_MODULE_4__.preloadAssets)(remoteInfo, origin, assets, false, {
						initiator: "loadRemote",
						id
					}, preloadConfig.recordPreloadedAssets).catch(() => void 0);
				}
				return {
					...args,
					remoteSnapshot
				};
			}
			return args;
		}
	};
}

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/remote/disabled.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/remote/disabled.js ***!
  \******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DisabledRemoteHandler: () => (/* binding */ DisabledRemoteHandler),
/* harmony export */   UnavailableRemoteModule: () => (/* binding */ UnavailableRemoteModule)
/* harmony export */ });
/* harmony import */ var _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/hooks/pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");
/* harmony import */ var _utils_hooks_index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/hooks/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js");



//#region src/remote/disabled.ts
const REMOTE_DISABLED_MESSAGE = "Remote loading is disabled by experiments.optimization.disableRemote.";
var UnavailableRemoteModule = class {
	constructor() {
		throw new Error(REMOTE_DISABLED_MESSAGE);
	}
};
var DisabledRemoteHandler = class {
	constructor() {
		this.hooks = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_0__.PluginSystem({});
	}
	formatAndRegisterRemote() {
		return [];
	}
	loadRemote() {
		throw new Error(REMOTE_DISABLED_MESSAGE);
	}
	preloadRemote() {
		throw new Error(REMOTE_DISABLED_MESSAGE);
	}
	registerRemotes() {
		throw new Error(REMOTE_DISABLED_MESSAGE);
	}
	getRemoteModuleAndOptions() {
		throw new Error(REMOTE_DISABLED_MESSAGE);
	}
	initRawContainer() {
		throw new Error(REMOTE_DISABLED_MESSAGE);
	}
};

//#endregion

//# sourceMappingURL=disabled.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/remote/index.js"
/*!***************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/remote/index.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RemoteHandler: () => (/* binding */ RemoteHandler)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _utils_tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constant.js */ "./node_modules/@module-federation/runtime-core/dist/constant.js");
/* harmony import */ var _utils_share_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/share.js */ "./node_modules/@module-federation/runtime-core/dist/utils/share.js");
/* harmony import */ var _utils_manifest_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/manifest.js */ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js");
/* harmony import */ var _utils_load_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/load.js */ "./node_modules/@module-federation/runtime-core/dist/utils/load.js");
/* harmony import */ var _utils_context_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/context.js */ "./node_modules/@module-federation/runtime-core/dist/utils/context.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _utils_preload_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/preload.js */ "./node_modules/@module-federation/runtime-core/dist/utils/preload.js");
/* harmony import */ var _module_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../module/index.js */ "./node_modules/@module-federation/runtime-core/dist/module/index.js");
/* harmony import */ var _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../utils/hooks/syncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js");
/* harmony import */ var _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../utils/hooks/asyncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js");
/* harmony import */ var _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../utils/hooks/syncWaterfallHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js");
/* harmony import */ var _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../utils/hooks/asyncWaterfallHooks.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js");
/* harmony import */ var _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../utils/hooks/pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");
/* harmony import */ var _utils_hooks_index_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../utils/hooks/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js");
/* harmony import */ var _plugins_snapshot_SnapshotHandler_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ../plugins/snapshot/SnapshotHandler.js */ "./node_modules/@module-federation/runtime-core/dist/plugins/snapshot/SnapshotHandler.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/utils.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");





















//#region src/remote/index.ts
var RemoteHandler = class {
	constructor(host) {
		this.hooks = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_15__.PluginSystem({
			beforeRegisterRemote: new _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_13__.SyncWaterfallHook("beforeRegisterRemote"),
			registerRemote: new _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_13__.SyncWaterfallHook("registerRemote"),
			beforeRequest: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_14__.AsyncWaterfallHook("beforeRequest"),
			afterMatchRemote: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook("afterMatchRemote"),
			onLoad: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook("onLoad"),
			afterLoadRemote: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook("afterLoadRemote"),
			handlePreloadModule: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_11__.SyncHook("handlePreloadModule"),
			errorLoadRemote: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook("errorLoadRemote"),
			beforePreloadRemote: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook("beforePreloadRemote"),
			generatePreloadAssets: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook("generatePreloadAssets"),
			afterPreloadRemote: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook("afterPreloadRemote"),
			loadEntry: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_12__.AsyncHook()
		});
		this.host = host;
		this.idToRemoteMap = {};
	}
	formatAndRegisterRemote(globalOptions, userOptions) {
		return (userOptions.remotes || []).reduce((res, remote) => {
			this.registerRemote(remote, res, { force: false });
			return res;
		}, globalOptions.remotes);
	}
	setIdToRemoteMap(id, remoteMatchInfo) {
		const { remote, expose } = remoteMatchInfo;
		const { name, alias } = remote;
		this.idToRemoteMap[id] = {
			name: remote.name,
			expose
		};
		if (alias && id.startsWith(name)) {
			const idWithAlias = id.replace(name, alias);
			this.idToRemoteMap[idWithAlias] = {
				name: remote.name,
				expose
			};
			return;
		}
		if (alias && id.startsWith(alias)) {
			const idWithName = id.replace(alias, name);
			this.idToRemoteMap[idWithName] = {
				name: remote.name,
				expose
			};
		}
	}
	async loadRemote(id, options) {
		const { host } = this;
		const startMatchInfo = (0,_utils_manifest_js__WEBPACK_IMPORTED_MODULE_5__.matchRemoteWithNameAndExpose)(host.options.remotes, id);
		let completeRequestId = id;
		let completeExpose = startMatchInfo?.expose;
		let completeRemote = startMatchInfo ? (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteInfo)(startMatchInfo.remote) : void 0;
		let afterLoadRemoteArgs;
		try {
			const { loadFactory = true } = options || { loadFactory: true };
			const { module, moduleOptions, remoteMatchInfo } = await this.getRemoteModuleAndOptions({ id });
			const { pkgNameOrAlias, remote, expose, id: idRes, remoteSnapshot } = remoteMatchInfo;
			completeRequestId = idRes;
			completeExpose = expose;
			completeRemote = (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteInfo)(remote);
			const moduleOrFactory = await module.get(idRes, expose, options, remoteSnapshot);
			const moduleWrapper = await this.hooks.lifecycle.onLoad.emit({
				id: idRes,
				pkgNameOrAlias,
				expose,
				exposeModule: loadFactory ? moduleOrFactory : void 0,
				exposeModuleFactory: loadFactory ? void 0 : moduleOrFactory,
				remote,
				options: moduleOptions,
				moduleInstance: module,
				origin: host
			});
			this.setIdToRemoteMap(id, remoteMatchInfo);
			afterLoadRemoteArgs = {
				id: completeRequestId,
				expose: completeExpose,
				remote: completeRemote,
				options,
				origin: host
			};
			if (typeof moduleWrapper === "function") return moduleWrapper;
			return moduleOrFactory;
		} catch (error) {
			const { from = "runtime" } = options || { from: "runtime" };
			let failOver;
			try {
				failOver = await this.hooks.lifecycle.errorLoadRemote.emit({
					id,
					error,
					from,
					lifecycle: "onLoad",
					expose: completeExpose,
					remote: completeRemote,
					origin: host
				});
			} catch (hookError) {
				afterLoadRemoteArgs = {
					id: completeRequestId,
					expose: completeExpose,
					remote: completeRemote,
					options,
					error: hookError,
					origin: host
				};
				throw hookError;
			}
			if (!failOver) {
				afterLoadRemoteArgs = {
					id: completeRequestId,
					expose: completeExpose,
					remote: completeRemote,
					options,
					error,
					origin: host
				};
				throw error;
			}
			afterLoadRemoteArgs = {
				id: completeRequestId,
				expose: completeExpose,
				remote: completeRemote,
				options,
				error,
				origin: host,
				recovered: true
			};
			return failOver;
		} finally {
			if (afterLoadRemoteArgs) await this.hooks.lifecycle.afterLoadRemote.emit(afterLoadRemoteArgs);
		}
	}
	async preloadRemote(preloadOptions) {
		const { host } = this;
		const preloadResults = [];
		await this.hooks.lifecycle.beforePreloadRemote.emit({
			preloadOps: preloadOptions,
			options: host.options,
			origin: host
		});
		const preloadOps = (0,_utils_preload_js__WEBPACK_IMPORTED_MODULE_9__.formatPreloadArgs)(host.options.remotes, preloadOptions);
		const createPreloadAssetOps = (ops) => {
			const { preloadConfig, remote } = ops;
			const exposes = preloadConfig.exposes || [];
			if (!exposes.length) return [{
				ops,
				id: `${remote.name}/*`
			}];
			return exposes.map((expose) => ({
				ops: {
					...ops,
					preloadConfig: {
						...preloadConfig,
						exposes: [expose]
					}
				},
				id: (0,_utils_manifest_js__WEBPACK_IMPORTED_MODULE_5__.composeRemoteRequestId)(remote.name, expose)
			}));
		};
		let preloadError;
		await Promise.all(preloadOps.flatMap(createPreloadAssetOps).map(async (assetOps) => {
			const { ops, id: preloadId } = assetOps;
			const { remote, preloadConfig } = ops;
			const remoteInfo = (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteInfo)(remote);
			try {
				const { globalSnapshot, remoteSnapshot } = await host.snapshotHandler.loadRemoteSnapshotInfo({
					moduleInfo: remote,
					id: preloadId,
					initiator: "preloadRemote"
				});
				const assets = await this.hooks.lifecycle.generatePreloadAssets.emit({
					origin: host,
					preloadOptions: ops,
					remote,
					remoteInfo,
					globalSnapshot,
					remoteSnapshot
				});
				if (!assets) return;
				const results = await (0,_utils_preload_js__WEBPACK_IMPORTED_MODULE_9__.preloadAssets)(remoteInfo, host, assets, true, {
					initiator: "preloadRemote",
					id: preloadId
				}, preloadConfig.recordPreloadedAssets);
				preloadResults.push({
					remote,
					remoteInfo,
					preloadConfig,
					id: preloadId,
					results
				});
			} catch (error) {
				preloadResults.push({
					remote,
					remoteInfo,
					preloadConfig,
					id: preloadId,
					results: [{
						url: remoteInfo.entry,
						status: "error",
						resourceType: /\.json(?:$|[?#])/i.test(remoteInfo.entry) ? "manifest" : "remoteEntry",
						initiator: "preloadRemote",
						id: preloadId,
						error
					}]
				});
			}
		}));
		const failedResults = preloadResults.flatMap((preloadResult) => preloadResult.results.filter((result) => result.status === "error" || result.status === "timeout"));
		if (failedResults.length > 0) {
			preloadError = /* @__PURE__ */ new Error(`preloadRemote failed to load ${failedResults.length} resource(s).`);
			Object.assign(preloadError, {
				results: preloadResults,
				failedResults
			});
		}
		await this.hooks.lifecycle.afterPreloadRemote.emit({
			preloadOps: preloadOptions,
			options: host.options,
			origin: host,
			results: preloadResults,
			error: preloadError
		});
		if (preloadError) throw preloadError;
	}
	registerRemotes(remotes, options) {
		const { host } = this;
		remotes.forEach((remote) => {
			this.registerRemote(remote, host.options.remotes, { force: options?.force });
		});
	}
	initRawContainer(name, url, container) {
		const { host } = this;
		const module = new _module_index_js__WEBPACK_IMPORTED_MODULE_10__.Module({
			host,
			remoteInfo: (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteInfo)({
				name,
				entry: url
			})
		});
		module.remoteEntryExports = container;
		host.moduleCache.set(name, module);
		return module;
	}
	async getRemoteModuleAndOptions(options) {
		const { host } = this;
		const { id } = options;
		let loadRemoteArgs;
		try {
			loadRemoteArgs = await this.hooks.lifecycle.beforeRequest.emit({
				id,
				options: host.options,
				origin: host
			});
		} catch (error) {
			loadRemoteArgs = await this.hooks.lifecycle.errorLoadRemote.emit({
				id,
				options: host.options,
				origin: host,
				from: "runtime",
				error,
				lifecycle: "beforeRequest"
			});
			if (!loadRemoteArgs) throw error;
		}
		const { id: idRes } = loadRemoteArgs;
		const remoteSplitInfo = (0,_utils_manifest_js__WEBPACK_IMPORTED_MODULE_5__.matchRemoteWithNameAndExpose)(host.options.remotes, idRes);
		if (!remoteSplitInfo) try {
			(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_20__.RUNTIME_004, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_21__.runtimeDescMap, {
				hostName: host.options.name,
				requestId: idRes
			}, void 0, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_7__.optionsToMFContext)(host.options));
		} catch (matchError) {
			await this.hooks.lifecycle.afterMatchRemote.emit({
				id: idRes,
				options: host.options,
				error: matchError,
				origin: host
			});
			throw matchError;
		}
		const { remote: rawRemote } = remoteSplitInfo;
		const remoteInfo = (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteInfo)(rawRemote);
		await this.hooks.lifecycle.afterMatchRemote.emit({
			id: idRes,
			...remoteSplitInfo,
			options: host.options,
			remoteInfo,
			origin: host
		});
		const matchInfo = await host.sharedHandler.hooks.lifecycle.afterResolve.emit({
			id: idRes,
			...remoteSplitInfo,
			options: host.options,
			origin: host,
			remoteInfo
		});
		const { remote, expose } = matchInfo;
		(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(remote && expose, `The 'beforeRequest' hook was executed, but it failed to return the correct 'remote' and 'expose' values while loading ${idRes}.`);
		let module = host.moduleCache.get(remote.name);
		const moduleOptions = {
			host,
			remoteInfo
		};
		if (!module) {
			module = new _module_index_js__WEBPACK_IMPORTED_MODULE_10__.Module(moduleOptions);
			host.moduleCache.set(remote.name, module);
		}
		return {
			module,
			moduleOptions,
			remoteMatchInfo: matchInfo
		};
	}
	registerRemote(remote, targetRemotes, options) {
		const { host } = this;
		const normalizeRemote = () => {
			if (remote.alias) {
				const findEqual = targetRemotes.find((item) => remote.alias && (item.name.startsWith(remote.alias) || item.alias?.startsWith(remote.alias)));
				(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(!findEqual, `The alias ${remote.alias} of remote ${remote.name} is not allowed to be the prefix of ${findEqual && findEqual.name} name or alias`);
			}
			if ("entry" in remote) {
				if (_module_federation_sdk__WEBPACK_IMPORTED_MODULE_18__.isBrowserEnvValue && typeof window !== "undefined" && !remote.entry.startsWith("http")) remote.entry = new URL(remote.entry, window.location.origin).href;
			}
			if (!remote.shareScope) remote.shareScope = _constant_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_SCOPE;
			if (!remote.type) remote.type = _constant_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_REMOTE_TYPE;
		};
		this.hooks.lifecycle.beforeRegisterRemote.emit({
			remote,
			origin: host
		});
		const registeredRemote = targetRemotes.find((item) => item.name === remote.name);
		if (!registeredRemote) {
			normalizeRemote();
			targetRemotes.push(remote);
			this.hooks.lifecycle.registerRemote.emit({
				remote,
				origin: host
			});
		} else {
			const messages = [`The remote "${remote.name}" is already registered.`, "Please note that overriding it may cause unexpected errors."];
			if (options?.force) {
				this.removeRemote(registeredRemote);
				normalizeRemote();
				targetRemotes.push(remote);
				this.hooks.lifecycle.registerRemote.emit({
					remote,
					origin: host
				});
				(0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_19__.warn)(messages.join(" "));
			}
		}
	}
	removeRemote(remote) {
		try {
			const { host } = this;
			const { name } = remote;
			const remoteIndex = host.options.remotes.findIndex((item) => item.name === name);
			if (remoteIndex !== -1) host.options.remotes.splice(remoteIndex, 1);
			const globalSnapshotKey = (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getInfoWithoutType)(_global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal.__FEDERATION__.moduleInfo, (0,_utils_tool_js__WEBPACK_IMPORTED_MODULE_1__.getFMId)(remote)).key;
			delete _global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal.__FEDERATION__.moduleInfo[globalSnapshotKey];
			if ("entry" in remote) {
				host.snapshotHandler.manifestCache.delete(remote.entry);
				delete _global_js__WEBPACK_IMPORTED_MODULE_2__.Global.__FEDERATION__.__MANIFEST_LOADING__[remote.entry];
			}
			const { hostGlobalSnapshot } = (0,_plugins_snapshot_SnapshotHandler_js__WEBPACK_IMPORTED_MODULE_17__.getGlobalRemoteInfo)(remote, host);
			if (hostGlobalSnapshot) {
				const remoteKey = hostGlobalSnapshot && "remotesInfo" in hostGlobalSnapshot && hostGlobalSnapshot.remotesInfo && (0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getInfoWithoutType)(hostGlobalSnapshot.remotesInfo, remote.name).key;
				if (remoteKey) delete hostGlobalSnapshot.remotesInfo[remoteKey];
			}
			const loadedModule = host.moduleCache.get(remote.name);
			if (loadedModule) {
				const remoteInfo = loadedModule.remoteInfo;
				const key = remoteInfo.entryGlobalName;
				if (_global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal[key]) if (Object.getOwnPropertyDescriptor(_global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal, key)?.configurable) delete _global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal[key];
				else _global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal[key] = void 0;
				const remoteEntryUniqueKey = (0,_utils_load_js__WEBPACK_IMPORTED_MODULE_6__.getRemoteEntryUniqueKey)(loadedModule.remoteInfo);
				if (_global_js__WEBPACK_IMPORTED_MODULE_2__.globalLoading[remoteEntryUniqueKey]) delete _global_js__WEBPACK_IMPORTED_MODULE_2__.globalLoading[remoteEntryUniqueKey];
				let remoteInsId = remoteInfo.buildVersion ? (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_19__.composeKeyWithSeparator)(remoteInfo.name, remoteInfo.buildVersion) : remoteInfo.name;
				const remoteInsIndex = _global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal.__FEDERATION__.__INSTANCES__.findIndex((ins) => {
					if (remoteInfo.buildVersion) return ins.options.id === remoteInsId;
					else return ins.name === remoteInsId;
				});
				if (remoteInsIndex !== -1) {
					const remoteIns = _global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal.__FEDERATION__.__INSTANCES__[remoteInsIndex];
					remoteInsId = remoteIns.options.id || remoteInsId;
					const globalShareScopeMap = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_4__.getGlobalShareScope)();
					let isAllSharedNotUsed = true;
					const needDeleteKeys = [];
					Object.keys(globalShareScopeMap).forEach((instId) => {
						const shareScopeMap = globalShareScopeMap[instId];
						shareScopeMap && Object.keys(shareScopeMap).forEach((shareScope) => {
							const shareScopeVal = shareScopeMap[shareScope];
							shareScopeVal && Object.keys(shareScopeVal).forEach((shareName) => {
								const sharedPkgs = shareScopeVal[shareName];
								sharedPkgs && Object.keys(sharedPkgs).forEach((shareVersion) => {
									const shared = sharedPkgs[shareVersion];
									if (shared && typeof shared === "object" && shared.from === remoteInfo.name) if (shared.loaded || shared.loading) {
										shared.useIn = shared.useIn.filter((usedHostName) => usedHostName !== remoteInfo.name);
										if (shared.useIn.length) isAllSharedNotUsed = false;
										else needDeleteKeys.push([
											instId,
											shareScope,
											shareName,
											shareVersion
										]);
									} else needDeleteKeys.push([
										instId,
										shareScope,
										shareName,
										shareVersion
									]);
								});
							});
						});
					});
					if (isAllSharedNotUsed) {
						remoteIns.shareScopeMap = {};
						delete globalShareScopeMap[remoteInsId];
					}
					needDeleteKeys.forEach(([insId, shareScope, shareName, shareVersion]) => {
						delete globalShareScopeMap[insId]?.[shareScope]?.[shareName]?.[shareVersion];
					});
					_global_js__WEBPACK_IMPORTED_MODULE_2__.CurrentGlobal.__FEDERATION__.__INSTANCES__.splice(remoteInsIndex, 1);
				}
				host.moduleCache.delete(remote.name);
			}
		} catch (err) {
			_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.logger.error(`removeRemote failed: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
};

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/shared/disabled.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/shared/disabled.js ***!
  \******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DisabledSharedHandler: () => (/* binding */ DisabledSharedHandler)
/* harmony export */ });
/* harmony import */ var _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/hooks/asyncWaterfallHooks.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js");
/* harmony import */ var _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/hooks/pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");
/* harmony import */ var _utils_hooks_index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/hooks/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js");




//#region src/shared/disabled.ts
var DisabledSharedHandler = class {
	constructor() {
		this.shareScopeMap = {};
		this.hooks = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_1__.PluginSystem({ afterResolve: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_0__.AsyncWaterfallHook("afterResolve") });
	}
	registerShared() {
		return {
			newShareInfos: {},
			allShareInfos: {}
		};
	}
	loadShare() {
		throw new Error("Shared dependency loading is disabled by experiments.optimization.disableShared.");
	}
	loadShareSync() {
		throw new Error("Shared dependency loading is disabled by experiments.optimization.disableShared.");
	}
	initializeSharing() {
		return [];
	}
	initShareScopeMap(scopeName, shareScope) {
		this.shareScopeMap[scopeName] = shareScope;
	}
};

//#endregion

//# sourceMappingURL=disabled.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/shared/index.js"
/*!***************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/shared/index.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharedHandler: () => (/* binding */ SharedHandler)
/* harmony export */ });
/* harmony import */ var _utils_logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constant.js */ "./node_modules/@module-federation/runtime-core/dist/constant.js");
/* harmony import */ var _utils_share_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/share.js */ "./node_modules/@module-federation/runtime-core/dist/utils/share.js");
/* harmony import */ var _utils_context_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/context.js */ "./node_modules/@module-federation/runtime-core/dist/utils/context.js");
/* harmony import */ var _utils_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");
/* harmony import */ var _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/hooks/syncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js");
/* harmony import */ var _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../utils/hooks/asyncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js");
/* harmony import */ var _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../utils/hooks/syncWaterfallHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js");
/* harmony import */ var _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../utils/hooks/asyncWaterfallHooks.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js");
/* harmony import */ var _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../utils/hooks/pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");
/* harmony import */ var _utils_hooks_index_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../utils/hooks/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");













//#region src/shared/index.ts
var SharedHandler = class {
	constructor(host) {
		this.hooks = new _utils_hooks_pluginSystem_js__WEBPACK_IMPORTED_MODULE_9__.PluginSystem({
			beforeRegisterShare: new _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_7__.SyncWaterfallHook("beforeRegisterShare"),
			afterRegisterShare: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_5__.SyncHook("afterRegisterShare"),
			afterResolve: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_8__.AsyncWaterfallHook("afterResolve"),
			beforeLoadShare: new _utils_hooks_asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_8__.AsyncWaterfallHook("beforeLoadShare"),
			loadShare: new _utils_hooks_asyncHook_js__WEBPACK_IMPORTED_MODULE_6__.AsyncHook(),
			afterLoadShare: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_5__.SyncHook("afterLoadShare"),
			errorLoadShare: new _utils_hooks_syncHook_js__WEBPACK_IMPORTED_MODULE_5__.SyncHook("errorLoadShare"),
			resolveShare: new _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_7__.SyncWaterfallHook("resolveShare"),
			initContainerShareScopeMap: new _utils_hooks_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_7__.SyncWaterfallHook("initContainerShareScopeMap")
		});
		this.host = host;
		this.shareScopeMap = {};
		this.initTokens = {};
		this._setGlobalShareScopeMap(host.options);
	}
	emitAfterRegisterShare(pkgName, input) {
		this.hooks.lifecycle.afterRegisterShare.emit({
			pkgName,
			...input,
			shareScopeMap: this.shareScopeMap,
			origin: this.host
		});
	}
	emitAfterLoadShare({ lifecycle, pkgName, shareInfo, selectedShared, loadContext }) {
		try {
			this.hooks.lifecycle.afterLoadShare.emit({
				pkgName,
				shareInfo,
				selectedShared,
				shared: this.host.options.shared,
				shareScopeMap: this.shareScopeMap,
				lifecycle,
				loadContext,
				origin: this.host
			});
		} catch (error) {
			;(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.warn)(error);
		}
	}
	emitErrorLoadShare({ lifecycle, pkgName, shareInfo, error, recovered, loadContext }) {
		try {
			this.hooks.lifecycle.errorLoadShare.emit({
				pkgName,
				shareInfo,
				shared: this.host.options.shared,
				shareScopeMap: this.shareScopeMap,
				lifecycle,
				origin: this.host,
				error,
				recovered,
				loadContext
			});
		} catch (hookError) {
			;(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.warn)(hookError);
		}
	}
	registerShared(globalOptions, userOptions) {
		const { newShareInfos, allShareInfos } = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.formatShareConfigs)(globalOptions, userOptions);
		Object.keys(newShareInfos).forEach((sharedKey) => {
			newShareInfos[sharedKey].forEach((sharedVal) => {
				sharedVal.scope.forEach((sc) => {
					this.hooks.lifecycle.beforeRegisterShare.emit({
						origin: this.host,
						pkgName: sharedKey,
						shared: sharedVal
					});
					const registeredShared = this.shareScopeMap[sc]?.[sharedKey];
					const previousAtVersion = registeredShared?.[sharedVal.version];
					if (!registeredShared) this.setShared({
						pkgName: sharedKey,
						lib: sharedVal.lib,
						get: sharedVal.get,
						loaded: sharedVal.loaded || Boolean(sharedVal.lib),
						shared: sharedVal,
						from: userOptions.name
					});
					this.emitAfterRegisterShare(sharedKey, {
						scope: sc,
						shared: sharedVal,
						previousShared: previousAtVersion,
						registeredShared: this.shareScopeMap[sc]?.[sharedKey]?.[sharedVal.version],
						trigger: "runtime"
					});
				});
			});
		});
		return {
			newShareInfos,
			allShareInfos
		};
	}
	async loadShare(pkgName, extraOptions) {
		const { host } = this;
		let loadContext = extraOptions?.context;
		const shareOptions = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.getTargetSharedOptions)({
			pkgName,
			extraOptions,
			shareInfos: host.options.shared
		});
		let shareOptionsRes = shareOptions;
		try {
			if (shareOptions?.scope) await Promise.all(shareOptions.scope.map(async (shareScope) => {
				await Promise.all(this.initializeSharing(shareScope, {
					strategy: shareOptions.strategy,
					context: loadContext
				}));
			}));
			const loadShareRes = await this.hooks.lifecycle.beforeLoadShare.emit({
				pkgName,
				shareInfo: shareOptions,
				shared: host.options.shared,
				origin: host,
				loadContext
			});
			shareOptionsRes = loadShareRes.shareInfo;
			loadContext = loadShareRes.loadContext || loadContext;
			(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(shareOptionsRes, `Cannot find shared "${pkgName}" in host "${host.options.name}". Ensure the shared config for "${pkgName}" is declared in the federation plugin options and the host has been initialized before loading shares.`);
			const resolvedShareOptions = shareOptionsRes;
			const { shared: registeredShared, useTreesShaking } = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.getRegisteredShare)(this.shareScopeMap, pkgName, shareOptionsRes, this.hooks.lifecycle.resolveShare, loadContext) || {};
			if (registeredShared) {
				const targetShared = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.directShare)(registeredShared, useTreesShaking);
				if (targetShared.lib) {
					(0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.addUseIn)(targetShared, host.options.name);
					this.emitAfterLoadShare({
						lifecycle: "loadShare",
						pkgName,
						shareInfo: resolvedShareOptions,
						selectedShared: registeredShared,
						loadContext
					});
					return targetShared.lib;
				} else if (targetShared.loading && !targetShared.loaded) {
					const factory = await targetShared.loading;
					targetShared.loaded = true;
					if (!targetShared.lib) targetShared.lib = factory;
					(0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.addUseIn)(targetShared, host.options.name);
					this.emitAfterLoadShare({
						lifecycle: "loadShare",
						pkgName,
						shareInfo: resolvedShareOptions,
						selectedShared: registeredShared,
						loadContext
					});
					return factory;
				} else {
					const asyncLoadProcess = async () => {
						const factory = await targetShared.get();
						(0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.addUseIn)(targetShared, host.options.name);
						targetShared.loaded = true;
						targetShared.lib = factory;
						return factory;
					};
					const loading = asyncLoadProcess();
					this.setShared({
						pkgName,
						loaded: false,
						shared: registeredShared,
						from: host.options.name,
						lib: null,
						loading,
						treeShaking: useTreesShaking ? targetShared : void 0
					});
					const factory = await loading;
					this.emitAfterLoadShare({
						lifecycle: "loadShare",
						pkgName,
						shareInfo: resolvedShareOptions,
						selectedShared: registeredShared,
						loadContext
					});
					return factory;
				}
			} else {
				if (extraOptions?.customShareInfo) {
					this.emitErrorLoadShare({
						lifecycle: "loadShare",
						pkgName,
						shareInfo: resolvedShareOptions,
						recovered: true,
						loadContext
					});
					return false;
				}
				const _useTreeShaking = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.shouldUseTreeShaking)(resolvedShareOptions.treeShaking);
				const targetShared = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.directShare)(resolvedShareOptions, _useTreeShaking);
				const asyncLoadProcess = async () => {
					const factory = await targetShared.get();
					targetShared.lib = factory;
					targetShared.loaded = true;
					(0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.addUseIn)(targetShared, host.options.name);
					const { shared: gShared, useTreesShaking: gUseTreeShaking } = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.getRegisteredShare)(this.shareScopeMap, pkgName, resolvedShareOptions, this.hooks.lifecycle.resolveShare, loadContext) || {};
					if (gShared) {
						const targetGShared = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.directShare)(gShared, gUseTreeShaking);
						targetGShared.lib = factory;
						targetGShared.loaded = true;
						gShared.from = resolvedShareOptions.from;
					}
					return factory;
				};
				const loading = asyncLoadProcess();
				this.setShared({
					pkgName,
					loaded: false,
					shared: resolvedShareOptions,
					from: host.options.name,
					lib: null,
					loading,
					treeShaking: _useTreeShaking ? targetShared : void 0
				});
				const factory = await loading;
				this.emitAfterLoadShare({
					lifecycle: "loadShare",
					pkgName,
					shareInfo: resolvedShareOptions,
					selectedShared: resolvedShareOptions,
					loadContext
				});
				return factory;
			}
		} catch (shareError) {
			this.emitErrorLoadShare({
				lifecycle: "loadShare",
				pkgName,
				shareInfo: shareOptionsRes,
				error: shareError,
				loadContext
			});
			throw shareError;
		}
	}
	/**
	* This function initializes the sharing sequence (executed only once per share scope).
	* It accepts one argument, the name of the share scope.
	* If the share scope does not exist, it creates one.
	*/
	initializeSharing(shareScopeName = _constant_js__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_SCOPE, extraOptions) {
		const { host } = this;
		const from = extraOptions?.from;
		const strategy = extraOptions?.strategy;
		const trigger = extraOptions?.context?.trigger || from || "runtime";
		let initScope = extraOptions?.initScope;
		const promises = [];
		if (from !== "build") {
			const { initTokens } = this;
			if (!initScope) initScope = [];
			let initToken = initTokens[shareScopeName];
			if (!initToken) initToken = initTokens[shareScopeName] = { from: this.host.name };
			if (initScope.indexOf(initToken) >= 0) return promises;
			initScope.push(initToken);
		}
		const shareScope = this.shareScopeMap;
		const hostName = host.options.name;
		if (!shareScope[shareScopeName]) shareScope[shareScopeName] = {};
		const scope = shareScope[shareScopeName];
		const register = (name, shared) => {
			const { version, eager } = shared;
			scope[name] = scope[name] || {};
			const versions = scope[name];
			const existingShared = versions[version];
			const activeVersion = existingShared && (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.directShare)(existingShared);
			const activeVersionEager = Boolean(activeVersion && ("eager" in activeVersion && activeVersion.eager || "shareConfig" in activeVersion && activeVersion.shareConfig?.eager));
			if (Boolean(!activeVersion || activeVersion.strategy !== "loaded-first" && !activeVersion.loaded && (Boolean(!eager) !== !activeVersionEager ? eager : hostName > versions[version].from))) versions[version] = shared;
			this.emitAfterRegisterShare(name, {
				scope: shareScopeName,
				shared,
				previousShared: existingShared,
				registeredShared: versions[version],
				trigger
			});
		};
		const initRemoteModule = async (key) => {
			const { module } = await host.remoteHandler.getRemoteModuleAndOptions({ id: key });
			let remoteEntryExports = void 0;
			const resourceContext = {
				initiator: "loadShare",
				id: key,
				resourceType: "remoteEntry",
				url: module.remoteInfo.entry
			};
			try {
				remoteEntryExports = await module.getEntry(void 0, resourceContext);
			} catch (error) {
				remoteEntryExports = await host.remoteHandler.hooks.lifecycle.errorLoadRemote.emit({
					id: key,
					error,
					from: "runtime",
					lifecycle: "beforeLoadShare",
					remote: module.remoteInfo,
					origin: host
				});
				if (!remoteEntryExports) return;
			} finally {
				if (remoteEntryExports?.init && !module.initing) {
					module.remoteEntryExports = remoteEntryExports;
					await module.init(void 0, void 0, initScope, void 0, resourceContext);
				}
			}
		};
		Object.keys(host.options.shared).forEach((shareName) => {
			host.options.shared[shareName].forEach((shared) => {
				if (shared.scope.includes(shareScopeName)) register(shareName, shared);
			});
		});
		if (host.options.shareStrategy === "version-first" || strategy === "version-first") host.options.remotes.forEach((remote) => {
			if (remote.shareScope === shareScopeName) promises.push(initRemoteModule(remote.name));
		});
		return promises;
	}
	loadShareSync(pkgName, extraOptions) {
		const { host } = this;
		const loadContext = extraOptions?.context;
		const shareOptions = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.getTargetSharedOptions)({
			pkgName,
			extraOptions,
			shareInfos: host.options.shared
		});
		try {
			if (shareOptions?.scope) shareOptions.scope.forEach((shareScope) => {
				this.initializeSharing(shareScope, {
					strategy: shareOptions.strategy,
					from: extraOptions?.from,
					context: loadContext
				});
			});
			const { shared: registeredShared } = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.getRegisteredShare)(this.shareScopeMap, pkgName, shareOptions, this.hooks.lifecycle.resolveShare, loadContext) || {};
			if (registeredShared) {
				if (typeof registeredShared.lib === "function") {
					(0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.addUseIn)(registeredShared, host.options.name);
					if (!registeredShared.loaded) {
						registeredShared.loaded = true;
						if (registeredShared.from === host.options.name) shareOptions.loaded = true;
					}
					this.emitAfterLoadShare({
						lifecycle: "loadShareSync",
						pkgName,
						shareInfo: shareOptions,
						selectedShared: registeredShared,
						loadContext
					});
					return registeredShared.lib;
				}
				if (typeof registeredShared.get === "function") {
					const module = registeredShared.get();
					if (!(module instanceof Promise)) {
						(0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.addUseIn)(registeredShared, host.options.name);
						this.setShared({
							pkgName,
							loaded: true,
							from: host.options.name,
							lib: module,
							shared: registeredShared
						});
						this.emitAfterLoadShare({
							lifecycle: "loadShareSync",
							pkgName,
							shareInfo: shareOptions,
							selectedShared: registeredShared,
							loadContext
						});
						return module;
					}
				}
			}
			if (shareOptions.lib) {
				if (!shareOptions.loaded) shareOptions.loaded = true;
				this.emitAfterLoadShare({
					lifecycle: "loadShareSync",
					pkgName,
					shareInfo: shareOptions,
					selectedShared: shareOptions,
					loadContext
				});
				return shareOptions.lib;
			}
			if (shareOptions.get) {
				const module = shareOptions.get();
				if (module instanceof Promise) (0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(extraOptions?.from === "build" ? _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_11__.RUNTIME_005 : _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_11__.RUNTIME_006, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_12__.runtimeDescMap, {
					hostName: host.options.name,
					sharedPkgName: pkgName
				}, void 0, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_3__.optionsToMFContext)(host.options));
				shareOptions.lib = module;
				this.setShared({
					pkgName,
					loaded: true,
					from: host.options.name,
					lib: shareOptions.lib,
					shared: shareOptions
				});
				this.emitAfterLoadShare({
					lifecycle: "loadShareSync",
					pkgName,
					shareInfo: shareOptions,
					selectedShared: shareOptions,
					loadContext
				});
				return shareOptions.lib;
			}
			;(0,_utils_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_11__.RUNTIME_006, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_12__.runtimeDescMap, {
				hostName: host.options.name,
				sharedPkgName: pkgName
			}, void 0, (0,_utils_context_js__WEBPACK_IMPORTED_MODULE_3__.optionsToMFContext)(host.options));
		} catch (shareError) {
			this.emitErrorLoadShare({
				lifecycle: "loadShareSync",
				pkgName,
				shareInfo: shareOptions,
				error: shareError,
				loadContext
			});
			throw shareError;
		}
	}
	initShareScopeMap(scopeName, shareScope, extraOptions = {}) {
		const { host } = this;
		this.shareScopeMap[scopeName] = shareScope;
		this.hooks.lifecycle.initContainerShareScopeMap.emit({
			shareScope,
			options: host.options,
			origin: host,
			scopeName,
			hostShareScopeMap: extraOptions.hostShareScopeMap
		});
	}
	setShared({ pkgName, shared, from, lib, loading, loaded, get, treeShaking }) {
		const { version, scope = "default", ...shareInfo } = shared;
		const scopes = Array.isArray(scope) ? scope : [scope];
		const mergeAttrs = (shared) => {
			const merge = (s, key, val) => {
				if (val && !s[key]) s[key] = val;
			};
			const targetShared = treeShaking ? shared.treeShaking : shared;
			merge(targetShared, "loaded", loaded);
			merge(targetShared, "loading", loading);
			merge(targetShared, "get", get);
			merge(targetShared, "lib", lib);
		};
		scopes.forEach((sc) => {
			if (!this.shareScopeMap[sc]) this.shareScopeMap[sc] = {};
			if (!this.shareScopeMap[sc][pkgName]) this.shareScopeMap[sc][pkgName] = {};
			if (!this.shareScopeMap[sc][pkgName][version]) this.shareScopeMap[sc][pkgName][version] = {
				version,
				scope: [sc],
				...shareInfo,
				lib
			};
			const registeredShared = this.shareScopeMap[sc][pkgName][version];
			mergeAttrs(registeredShared);
			if (from && registeredShared.from !== from) registeredShared.from = from;
		});
	}
	_setGlobalShareScopeMap(hostOptions) {
		const globalShareScopeMap = (0,_utils_share_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalShareScope)();
		const identifier = hostOptions.id || hostOptions.name;
		if (identifier && !globalShareScopeMap[identifier]) globalShareScopeMap[identifier] = this.shareScopeMap;
	}
};

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/type/index.js"
/*!*************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/type/index.js ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   type_exports: () => (/* binding */ type_exports)
/* harmony export */ });
/* harmony import */ var _virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_virtual/_rolldown/runtime.js */ "./node_modules/@module-federation/runtime-core/dist/_virtual/_rolldown/runtime.js");


//#region src/type/index.ts
var type_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__.__exportAll)({});

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/context.js"
/*!****************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/context.js ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   optionsToMFContext: () => (/* binding */ optionsToMFContext)
/* harmony export */ });
//#region src/utils/context.ts
function remoteToEntry(r) {
	return {
		name: r.name,
		alias: r.alias,
		entry: "entry" in r ? r.entry : void 0,
		version: "version" in r ? r.version : void 0,
		type: r.type,
		entryGlobalName: r.entryGlobalName,
		shareScope: r.shareScope
	};
}
/**
* Build a partial MFContext from runtime Options.
* Used to enrich diagnostic entries with host context at error sites.
*/
function optionsToMFContext(options) {
	const shared = {};
	for (const [pkgName, versions] of Object.entries(options.shared)) {
		const first = versions[0];
		if (first) shared[pkgName] = {
			version: first.version,
			singleton: first.shareConfig?.singleton,
			requiredVersion: first.shareConfig?.requiredVersion === false ? false : first.shareConfig?.requiredVersion,
			eager: first.eager,
			strictVersion: first.shareConfig?.strictVersion
		};
	}
	return {
		project: {
			name: options.name,
			mfRole: options.remotes?.length > 0 ? "host" : "unknown"
		},
		mfConfig: {
			name: options.name,
			remotes: options.remotes?.map(remoteToEntry) ?? [],
			shared
		}
	};
}

//#endregion

//# sourceMappingURL=context.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/env.js"
/*!************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/env.js ***!
  \************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBuilderId: () => (/* binding */ getBuilderId)
/* harmony export */ });


//#region src/utils/env.ts
function getBuilderId() {
	return  true ? "aesop_frontend:0.0.1" : 0;
}

//#endregion

//# sourceMappingURL=env.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js"
/*!************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js ***!
  \************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsyncHook: () => (/* binding */ AsyncHook)
/* harmony export */ });
/* harmony import */ var _syncHook_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./syncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js");


//#region src/utils/hooks/asyncHook.ts
var AsyncHook = class extends _syncHook_js__WEBPACK_IMPORTED_MODULE_0__.SyncHook {
	emit(...data) {
		let result;
		const ls = Array.from(this.listeners);
		if (ls.length > 0) {
			let i = 0;
			const call = (prev) => {
				if (prev === false) return false;
				else if (i < ls.length) return Promise.resolve(ls[i++].apply(null, data)).then((result) => {
					if (result === void 0 || data.length === 1 && result === data[0]) return call(prev);
					return call(result);
				});
				else return prev;
			};
			result = call();
		}
		return Promise.resolve(result);
	}
};

//#endregion

//# sourceMappingURL=asyncHook.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js"
/*!**********************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js ***!
  \**********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AsyncWaterfallHook: () => (/* binding */ AsyncWaterfallHook)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _syncHook_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./syncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js");
/* harmony import */ var _syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./syncWaterfallHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js");





//#region src/utils/hooks/asyncWaterfallHooks.ts
var AsyncWaterfallHook = class extends _syncHook_js__WEBPACK_IMPORTED_MODULE_2__.SyncHook {
	constructor(type) {
		super();
		this.onerror = _logger_js__WEBPACK_IMPORTED_MODULE_0__.error;
		this.type = type;
	}
	emit(data) {
		if (!(0,_tool_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(data)) (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`The response data for the "${this.type}" hook must be an object.`);
		const ls = Array.from(this.listeners);
		if (ls.length > 0) {
			let i = 0;
			const processError = (e) => {
				(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.warn)(e);
				this.onerror(e);
				return data;
			};
			const call = (prevData) => {
				if (prevData !== void 0 && (0,_syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_3__.checkReturnData)(data, prevData)) data = prevData;
				else if (prevData !== void 0) {
					this.onerror(`A plugin returned an incorrect value for the "${this.type}" type.`);
					return data;
				}
				if (i < ls.length) try {
					return Promise.resolve(ls[i++](data)).then(call, processError);
				} catch (e) {
					return processError(e);
				}
				return data;
			};
			return Promise.resolve(call(data));
		}
		return Promise.resolve(data);
	}
};

//#endregion

//# sourceMappingURL=asyncWaterfallHooks.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js"
/*!********************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/hooks/index.js ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _syncHook_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./syncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js");
/* harmony import */ var _asyncHook_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./asyncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncHook.js");
/* harmony import */ var _syncWaterfallHook_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./syncWaterfallHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js");
/* harmony import */ var _asyncWaterfallHooks_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./asyncWaterfallHooks.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/asyncWaterfallHooks.js");
/* harmony import */ var _pluginSystem_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./pluginSystem.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js");








/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js"
/*!***************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/hooks/pluginSystem.js ***!
  \***************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PluginSystem: () => (/* binding */ PluginSystem)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/index.js");




//#region src/utils/hooks/pluginSystem.ts
var PluginSystem = class {
	constructor(lifecycle) {
		this.registerPlugins = {};
		this.lifecycle = lifecycle;
		this.lifecycleKeys = Object.keys(lifecycle);
	}
	applyPlugin(plugin) {
		;(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)((0,_tool_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(plugin), "Plugin configuration is invalid.");
		const pluginName = plugin.name;
		(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(pluginName, "A name must be provided by the plugin.");
		if (!this.registerPlugins[pluginName]) {
			this.registerPlugins[pluginName] = plugin;
			this.lifecycleKeys.forEach((key) => {
				const pluginLife = plugin[key];
				if (pluginLife) this.lifecycle[key].on(pluginLife);
			});
		}
	}
	removePlugin(pluginName) {
		;(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(pluginName, "A name is required.");
		const plugin = this.registerPlugins[pluginName];
		(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(plugin, `The plugin "${pluginName}" is not registered.`);
		this.lifecycleKeys.forEach((key) => {
			const pluginLife = plugin[key];
			if (pluginLife) this.lifecycle[key].remove(pluginLife);
		});
		delete this.registerPlugins[pluginName];
	}
};

//#endregion

//# sourceMappingURL=pluginSystem.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SyncHook: () => (/* binding */ SyncHook)
/* harmony export */ });
//#region src/utils/hooks/syncHook.ts
var SyncHook = class {
	constructor(type) {
		this.type = "";
		this.listeners = /* @__PURE__ */ new Set();
		if (type) this.type = type;
	}
	on(fn) {
		if (typeof fn === "function") this.listeners.add(fn);
	}
	once(fn) {
		const self = this;
		this.on(function wrapper(...args) {
			self.remove(wrapper);
			return fn.apply(null, args);
		});
	}
	emit(...data) {
		let result;
		if (this.listeners.size > 0) this.listeners.forEach((fn) => {
			const nextResult = fn(...data);
			if (nextResult !== void 0) result = nextResult;
		});
		return result;
	}
	remove(fn) {
		this.listeners.delete(fn);
	}
	removeAll() {
		this.listeners.clear();
	}
};

//#endregion

//# sourceMappingURL=syncHook.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js"
/*!********************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncWaterfallHook.js ***!
  \********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SyncWaterfallHook: () => (/* binding */ SyncWaterfallHook),
/* harmony export */   checkReturnData: () => (/* binding */ checkReturnData)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _syncHook_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./syncHook.js */ "./node_modules/@module-federation/runtime-core/dist/utils/hooks/syncHook.js");




//#region src/utils/hooks/syncWaterfallHook.ts
function checkReturnData(originalData, returnedData) {
	if (!(0,_tool_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(returnedData)) return false;
	if (originalData !== returnedData) {
		for (const key in originalData) if (!(key in returnedData)) return false;
	}
	return true;
}
var SyncWaterfallHook = class extends _syncHook_js__WEBPACK_IMPORTED_MODULE_2__.SyncHook {
	constructor(type) {
		super();
		this.onerror = _logger_js__WEBPACK_IMPORTED_MODULE_0__.error;
		this.type = type;
	}
	emit(data) {
		if (!(0,_tool_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(data)) (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`The data for the "${this.type}" hook should be an object.`);
		for (const fn of this.listeners) try {
			const tempData = fn(data);
			if (tempData === void 0) continue;
			if (checkReturnData(data, tempData)) data = tempData;
			else {
				this.onerror(`A plugin returned an unacceptable value for the "${this.type}" type.`);
				break;
			}
		} catch (e) {
			;(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.warn)(e);
			this.onerror(e);
		}
		return data;
	}
};

//#endregion

//# sourceMappingURL=syncWaterfallHook.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/index.js"
/*!**************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/index.js ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./env.js */ "./node_modules/@module-federation/runtime-core/dist/utils/env.js");
/* harmony import */ var _manifest_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./manifest.js */ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js");
/* harmony import */ var _plugin_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./plugin.js */ "./node_modules/@module-federation/runtime-core/dist/utils/plugin.js");
/* harmony import */ var _load_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./load.js */ "./node_modules/@module-federation/runtime-core/dist/utils/load.js");
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./context.js */ "./node_modules/@module-federation/runtime-core/dist/utils/context.js");










/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/load.js"
/*!*************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/load.js ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRemoteEntry: () => (/* binding */ getRemoteEntry),
/* harmony export */   getRemoteEntryUniqueKey: () => (/* binding */ getRemoteEntryUniqueKey),
/* harmony export */   getRemoteInfo: () => (/* binding */ getRemoteInfo),
/* harmony export */   isEsmRemoteType: () => (/* binding */ isEsmRemoteType)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constant.js */ "./node_modules/@module-federation/runtime-core/dist/constant.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/utils.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/dom.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/node.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");






//#region src/utils/load.ts
const importCallback = ".then(callbacks[0]).catch(callbacks[1])";
const remoteEntryLoadingOrigins = /* @__PURE__ */ new WeakMap();
const esmRemoteEntryLoadErrorMessages = [
	"Failed to fetch dynamically imported module",
	"Importing a module script failed",
	"error loading dynamically imported module"
];
function isEsmRemoteEntryLoadError(err) {
	if (!(err instanceof TypeError)) return false;
	return esmRemoteEntryLoadErrorMessages.some((loadErrorMessage) => err.message.includes(loadErrorMessage));
}
function isEsmRemoteType(type) {
	return type === "esm" || type === "module";
}
async function loadEsmEntry({ entry, remoteEntryExports, name, getEntryUrl }) {
	return new Promise((resolve, reject) => {
		const rejectEntry = (loadError) => {
			if (isEsmRemoteEntryLoadError(loadError)) {
				const originalMsg = loadError instanceof Error ? loadError.message : String(loadError);
				try {
					(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_008, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__.runtimeDescMap, {
						remoteName: name,
						resourceUrl: url
					}, originalMsg);
				} catch (runtimeError) {
					reject(runtimeError);
					return;
				}
			}
			reject(loadError);
		};
		const url = getEntryUrl ? getEntryUrl(entry) : entry;
		try {
			if (!remoteEntryExports) if (typeof FEDERATION_ALLOW_NEW_FUNCTION !== "undefined") new Function("callbacks", `import("${url}")${importCallback}`)([resolve, rejectEntry]);
			else import(
				/* webpackIgnore: true */
				/* @vite-ignore */
				url
).then(resolve).catch(rejectEntry);
			else resolve(remoteEntryExports);
		} catch (e) {
			;(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`Failed to load ESM entry from "${url}". ${e instanceof Error ? e.message : String(e)}`);
		}
	});
}
async function loadSystemJsEntry({ entry, remoteEntryExports }) {
	return new Promise((resolve, reject) => {
		try {
			if (!remoteEntryExports) if (false) // removed by dead control flow
{}
			else new Function("callbacks", `System.import("${entry}")${importCallback}`)([resolve, reject]);
			else resolve(remoteEntryExports);
		} catch (e) {
			;(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`Failed to load SystemJS entry from "${entry}". ${e instanceof Error ? e.message : String(e)}`);
		}
	});
}
function handleRemoteEntryLoaded(name, globalName, entry) {
	const { remoteEntryKey, entryExports } = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getRemoteEntryExports)(name, globalName);
	if (!entryExports) (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_001, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__.runtimeDescMap, {
		remoteName: name,
		remoteEntryUrl: entry,
		remoteEntryKey
	});
	return entryExports;
}
async function loadEntryScript({ name, globalName, entry, remoteInfo, loaderHook, getEntryUrl, resourceContext }) {
	const { entryExports: remoteEntryExports } = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getRemoteEntryExports)(name, globalName);
	if (remoteEntryExports) return remoteEntryExports;
	const url = getEntryUrl ? getEntryUrl(entry) : entry;
	return (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__.loadScript)(url, {
		attrs: {},
		createScriptHook: (url, attrs) => {
			const res = loaderHook.lifecycle.createScript.emit({
				url,
				attrs,
				remoteInfo,
				resourceContext: resourceContext ? {
					...resourceContext,
					url
				} : void 0
			});
			if (!res) return;
			if (res instanceof HTMLScriptElement) return res;
			if ("script" in res || "timeout" in res) return res;
		}
	}).then(() => {
		return handleRemoteEntryLoaded(name, globalName, entry);
	}, (loadError) => {
		const originalMsg = loadError instanceof Error ? loadError.message : String(loadError);
		(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_008, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_8__.runtimeDescMap, {
			remoteName: name,
			resourceUrl: url
		}, originalMsg);
	});
}
async function loadEntryDom({ remoteInfo, remoteEntryExports, loaderHook, getEntryUrl, resourceContext }) {
	const { entry, entryGlobalName: globalName, name, type } = remoteInfo;
	if (isEsmRemoteType(type)) return loadEsmEntry({
		entry,
		remoteEntryExports,
		name,
		getEntryUrl
	});
	if (type === "system") return loadSystemJsEntry({
		entry,
		remoteEntryExports
	});
	return loadEntryScript({
		entry,
		globalName,
		name,
		remoteInfo,
		loaderHook,
		getEntryUrl,
		resourceContext
	});
}
async function loadEntryNode({ remoteInfo, loaderHook, resourceContext }) {
	const { entry, entryGlobalName: globalName, name, type } = remoteInfo;
	const { entryExports: remoteEntryExports } = (0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getRemoteEntryExports)(name, globalName);
	if (remoteEntryExports) return remoteEntryExports;
	return (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_6__.loadScriptNode)(entry, {
		attrs: {
			name,
			globalName,
			type
		},
		loaderHook: { createScriptHook: (url, attrs = {}) => {
			const res = loaderHook.lifecycle.createScript.emit({
				url,
				attrs,
				remoteInfo,
				resourceContext: resourceContext ? {
					...resourceContext,
					url
				} : void 0
			});
			if (!res) return;
			if ("url" in res) return res;
		} }
	}).then(() => {
		return handleRemoteEntryLoaded(name, globalName, entry);
	}).catch((e) => {
		;(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`Failed to load Node.js entry for remote "${name}" from "${entry}". ${e instanceof Error ? e.message : String(e)}`);
	});
}
function getRemoteEntryUniqueKey(remoteInfo) {
	const { entry, name } = remoteInfo;
	return (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_4__.composeKeyWithSeparator)(name, entry);
}
async function getRemoteEntry(params) {
	const { origin, remoteEntryExports, remoteInfo, getEntryUrl, resourceContext, _inErrorHandling = false } = params;
	const uniqueKey = getRemoteEntryUniqueKey(remoteInfo);
	if (remoteEntryExports) {
		await origin.loaderHook.lifecycle.afterLoadEntry.emit({
			origin,
			remoteInfo,
			remoteEntryExports,
			resourceContext,
			cached: true
		});
		return remoteEntryExports;
	}
	if (!_global_js__WEBPACK_IMPORTED_MODULE_1__.globalLoading[uniqueKey]) {
		const loadEntryHook = origin.remoteHandler.hooks.lifecycle.loadEntry;
		const loaderHook = origin.loaderHook;
		const loading = loadEntryHook.emit({
			origin,
			loaderHook,
			remoteInfo,
			remoteEntryExports,
			resourceContext
		}).then((res) => {
			if (res) return res;
			return (typeof ENV_TARGET !== "undefined" ? ENV_TARGET === "web" : _module_federation_sdk__WEBPACK_IMPORTED_MODULE_3__.isBrowserEnvValue) ? loadEntryDom({
				remoteInfo,
				remoteEntryExports,
				loaderHook,
				getEntryUrl,
				resourceContext
			}) : loadEntryNode({
				remoteInfo,
				loaderHook,
				resourceContext
			});
		}).then(async (res) => {
			await origin.loaderHook.lifecycle.afterLoadEntry.emit({
				origin,
				remoteInfo,
				remoteEntryExports: res,
				resourceContext
			});
			return res;
		}).catch(async (loadError) => {
			const isScriptExecutionError = loadError instanceof Error && loadError.message.includes("ScriptExecutionError");
			if (loadError instanceof Error && loadError.message.includes(_module_federation_error_codes__WEBPACK_IMPORTED_MODULE_7__.RUNTIME_008) && !isScriptExecutionError && !_inErrorHandling) {
				const wrappedGetRemoteEntry = (params) => {
					return getRemoteEntry({
						...params,
						_inErrorHandling: true
					});
				};
				const recoveredRemoteEntryExports = await origin.loaderHook.lifecycle.loadEntryError.emit({
					getRemoteEntry: wrappedGetRemoteEntry,
					origin,
					remoteInfo,
					remoteEntryExports,
					globalLoading: _global_js__WEBPACK_IMPORTED_MODULE_1__.globalLoading,
					uniqueKey
				});
				if (recoveredRemoteEntryExports) {
					await origin.loaderHook.lifecycle.afterLoadEntry.emit({
						origin,
						remoteInfo,
						remoteEntryExports: recoveredRemoteEntryExports,
						resourceContext,
						error: loadError,
						recovered: true
					});
					return recoveredRemoteEntryExports;
				}
			}
			await origin.loaderHook.lifecycle.afterLoadEntry.emit({
				origin,
				remoteInfo,
				resourceContext,
				error: loadError
			});
			throw loadError;
		});
		_global_js__WEBPACK_IMPORTED_MODULE_1__.globalLoading[uniqueKey] = loading;
		loading.then(void 0, () => {
			if (_global_js__WEBPACK_IMPORTED_MODULE_1__.globalLoading[uniqueKey] === loading) delete _global_js__WEBPACK_IMPORTED_MODULE_1__.globalLoading[uniqueKey];
		});
		remoteEntryLoadingOrigins.set(loading, origin);
	}
	const remoteEntryLoading = _global_js__WEBPACK_IMPORTED_MODULE_1__.globalLoading[uniqueKey];
	if (remoteEntryLoadingOrigins.get(remoteEntryLoading) !== origin) try {
		const result = await remoteEntryLoading;
		await origin.loaderHook.lifecycle.afterLoadEntry.emit({
			origin,
			remoteInfo,
			remoteEntryExports: result,
			resourceContext
		});
		return result;
	} catch (loadError) {
		await origin.loaderHook.lifecycle.afterLoadEntry.emit({
			origin,
			remoteInfo,
			resourceContext,
			error: loadError
		});
		throw loadError;
	}
	return remoteEntryLoading;
}
function getRemoteInfo(remote) {
	return {
		...remote,
		entry: "entry" in remote ? remote.entry : "",
		type: remote.type || _constant_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_REMOTE_TYPE,
		entryGlobalName: remote.entryGlobalName || remote.name,
		shareScope: remote.shareScope || _constant_js__WEBPACK_IMPORTED_MODULE_2__.DEFAULT_SCOPE
	};
}

//#endregion

//# sourceMappingURL=load.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js"
/*!***************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/logger.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   logger: () => (/* binding */ logger),
/* harmony export */   warn: () => (/* binding */ warn$1)
/* harmony export */ });
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/logger.js");
/* harmony import */ var _module_federation_error_codes_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @module-federation/error-codes/browser */ "./node_modules/@module-federation/error-codes/dist/browser.mjs");



//#region src/utils/logger.ts
const LOG_CATEGORY = "[ Federation Runtime ]";
const logger = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_0__.createLogger)(LOG_CATEGORY);
function assert(condition, msgOrCode, descMap, args, context) {
	if (!condition) if (descMap !== void 0) error(msgOrCode, descMap, args, void 0, context);
	else error(msgOrCode);
}
function error(msgOrCode, descMap, args, originalErrorMsg, context) {
	if (descMap !== void 0) return (0,_module_federation_error_codes_browser__WEBPACK_IMPORTED_MODULE_1__.logAndReport)(msgOrCode, descMap, args ?? {}, (msg) => {
		throw new Error(`${LOG_CATEGORY}: ${msg}`);
	}, originalErrorMsg, context);
	const msg = msgOrCode;
	if (msg instanceof Error) {
		if (!msg.message.startsWith(LOG_CATEGORY)) msg.message = `${LOG_CATEGORY}: ${msg.message}`;
		throw msg;
	}
	throw new Error(`${LOG_CATEGORY}: ${msg}`);
}
function warn$1(msg) {
	if (msg instanceof Error) {
		if (!msg.message.startsWith(LOG_CATEGORY)) msg.message = `${LOG_CATEGORY}: ${msg.message}`;
		logger.warn(msg);
	} else logger.warn(msg);
}

//#endregion

//# sourceMappingURL=logger.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js"
/*!*****************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/manifest.js ***!
  \*****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   composeRemoteRequestId: () => (/* binding */ composeRemoteRequestId),
/* harmony export */   matchRemote: () => (/* binding */ matchRemote),
/* harmony export */   matchRemoteWithNameAndExpose: () => (/* binding */ matchRemoteWithNameAndExpose)
/* harmony export */ });
//#region src/utils/manifest.ts
function composeRemoteRequestId(remoteName, expose) {
	if (!expose || expose === ".") return remoteName;
	return `${remoteName}/${expose.replace(/^\.\//, "")}`;
}
function matchRemoteWithNameAndExpose(remotes, id) {
	for (const remote of remotes) {
		const isNameMatched = id.startsWith(remote.name);
		let expose = id.replace(remote.name, "");
		if (isNameMatched) {
			if (expose.startsWith("/")) {
				const pkgNameOrAlias = remote.name;
				expose = `.${expose}`;
				return {
					pkgNameOrAlias,
					expose,
					remote
				};
			} else if (expose === "") return {
				pkgNameOrAlias: remote.name,
				expose: ".",
				remote
			};
		}
		const isAliasMatched = remote.alias && id.startsWith(remote.alias);
		let exposeWithAlias = remote.alias && id.replace(remote.alias, "");
		if (remote.alias && isAliasMatched) {
			if (exposeWithAlias && exposeWithAlias.startsWith("/")) {
				const pkgNameOrAlias = remote.alias;
				exposeWithAlias = `.${exposeWithAlias}`;
				return {
					pkgNameOrAlias,
					expose: exposeWithAlias,
					remote
				};
			} else if (exposeWithAlias === "") return {
				pkgNameOrAlias: remote.alias,
				expose: ".",
				remote
			};
		}
	}
}
function matchRemote(remotes, nameOrAlias) {
	for (const remote of remotes) {
		if (nameOrAlias === remote.name) return remote;
		if (remote.alias && nameOrAlias === remote.alias) return remote;
	}
}

//#endregion

//# sourceMappingURL=manifest.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/plugin.js"
/*!***************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/plugin.js ***!
  \***************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registerPlugins: () => (/* binding */ registerPlugins)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");




//#region src/utils/plugin.ts
function getPluginsToRegister(plugins) {
	const pluginsByName = /* @__PURE__ */ new Map();
	[...plugins || [], ...(0,_global_js__WEBPACK_IMPORTED_MODULE_2__.getGlobalHostPlugins)()].forEach((plugin) => {
		if (!plugin) return;
		(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)((0,_tool_js__WEBPACK_IMPORTED_MODULE_1__.isPlainObject)(plugin), "Plugin configuration is invalid.");
		(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(plugin.name, "A name must be provided by the plugin.");
		if (!pluginsByName.has(plugin.name)) pluginsByName.set(plugin.name, plugin);
	});
	return Array.from(pluginsByName.values());
}
function getInstancePlugin(plugin, instanceHooks) {
	if (instanceHooks === void 0) return plugin;
	return {
		...instanceHooks,
		name: plugin.name,
		version: plugin.version
	};
}
function registerPlugins(plugins, instance) {
	const registeredPlugins = /* @__PURE__ */ new Map();
	instance.options.plugins.forEach((plugin) => {
		if (plugin) registeredPlugins.set(plugin.name, plugin);
	});
	const hookInstances = [
		instance.hooks,
		instance.remoteHandler.hooks,
		instance.sharedHandler.hooks,
		instance.snapshotHandler.hooks,
		instance.loaderHook,
		instance.bridgeHook
	];
	getPluginsToRegister(plugins).forEach((plugin) => {
		registeredPlugins.set(plugin.name, plugin);
		if (instance.hooks.registerPlugins[plugin.name]) return;
		const instancePlugin = getInstancePlugin(plugin, plugin.apply?.(instance));
		hookInstances.forEach((hookInstance) => {
			hookInstance.applyPlugin(instancePlugin);
		});
	});
	return Array.from(registeredPlugins.values());
}

//#endregion

//# sourceMappingURL=plugin.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/preload.js"
/*!****************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/preload.js ***!
  \****************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   defaultPreloadArgs: () => (/* binding */ defaultPreloadArgs),
/* harmony export */   formatPreloadArgs: () => (/* binding */ formatPreloadArgs),
/* harmony export */   normalizePreloadExposes: () => (/* binding */ normalizePreloadExposes),
/* harmony export */   preloadAssets: () => (/* binding */ preloadAssets)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _manifest_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manifest.js */ "./node_modules/@module-federation/runtime-core/dist/utils/manifest.js");
/* harmony import */ var _load_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./load.js */ "./node_modules/@module-federation/runtime-core/dist/utils/load.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/utils.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/dom.js");






//#region src/utils/preload.ts
function defaultPreloadArgs(preloadConfig) {
	return {
		resourceCategory: "sync",
		share: true,
		depsRemote: true,
		recordPreloadedAssets: true,
		...preloadConfig
	};
}
function formatPreloadArgs(remotes, preloadArgs) {
	return preloadArgs.map((args) => {
		const remoteInfo = (0,_manifest_js__WEBPACK_IMPORTED_MODULE_2__.matchRemote)(remotes, args.nameOrAlias);
		(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.assert)(remoteInfo, `Unable to preload ${args.nameOrAlias} as it is not included in ${!remoteInfo && (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_4__.safeToString)({
			remoteInfo,
			remotes
		})}`);
		return {
			remote: remoteInfo,
			preloadConfig: defaultPreloadArgs(args)
		};
	});
}
function normalizePreloadExposes(exposes) {
	if (!exposes) return [];
	return exposes.map((expose) => {
		if (expose === ".") return expose;
		if (expose.startsWith("./")) return expose.replace("./", "");
		return expose;
	});
}
function isTimeoutError(error) {
	if (!(error instanceof Error)) return false;
	return error.message.includes("timed out") || error.name.includes("Timeout");
}
function createAssetResult(context, url, status, error) {
	return {
		url,
		status,
		resourceType: context.resourceType,
		initiator: context.initiator,
		id: context.id,
		error
	};
}
function preloadAssetOnce(context, url, recordPreloadedAssets, preload) {
	if (!recordPreloadedAssets) return preload();
	if ((0,_global_js__WEBPACK_IMPORTED_MODULE_1__.getPreloadedAsset)(url)) return Promise.resolve(createAssetResult(context, url, "cached"));
	(0,_global_js__WEBPACK_IMPORTED_MODULE_1__.setPreloadedAsset)(url);
	return preload();
}
async function waitForRemoteEntryPreload(host, remoteInfo, entryRemoteInfo, context) {
	const cachedRemote = host.moduleCache.get(entryRemoteInfo.name);
	const url = entryRemoteInfo.entry;
	if (cachedRemote?.remoteEntryExports) return createAssetResult(context, url, "cached");
	try {
		if (!await (0,_load_js__WEBPACK_IMPORTED_MODULE_3__.getRemoteEntry)({
			origin: host,
			remoteInfo: entryRemoteInfo,
			remoteEntryExports: cachedRemote?.remoteEntryExports,
			resourceContext: {
				...context,
				url
			}
		})) throw new Error(`Failed to load remoteEntry "${url}".`);
		return createAssetResult(context, url, "success");
	} catch (error) {
		return createAssetResult(context, url, isTimeoutError(error) ? "timeout" : "error", error);
	}
}
function waitForLinkPreload({ host, remoteInfo, url, attrs, context, needDeleteLink }) {
	return new Promise((resolve) => {
		const { link, needAttach } = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__.createLink)({
			url,
			cb: () => {
				resolve(createAssetResult(context, url, needAttach ? "success" : "cached"));
			},
			onErrorCallback: (error) => {
				resolve(createAssetResult(context, url, isTimeoutError(error) ? "timeout" : "error", error));
			},
			attrs,
			createLinkHook: (hookUrl, hookAttrs) => {
				const res = host.loaderHook.lifecycle.createLink.emit({
					url: hookUrl,
					attrs: hookAttrs,
					remoteInfo,
					resourceContext: {
						...context,
						url: hookUrl
					}
				});
				if (res instanceof HTMLLinkElement) return res;
				return res;
			},
			needDeleteLink
		});
		needAttach && document.head.appendChild(link);
	});
}
function waitForScriptPreload({ host, remoteInfo, url, attrs, context }) {
	return new Promise((resolve) => {
		const { script, needAttach } = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__.createScript)({
			url,
			cb: () => {
				resolve(createAssetResult(context, url, needAttach ? "success" : "cached"));
			},
			onErrorCallback: (error) => {
				resolve(createAssetResult(context, url, isTimeoutError(error) ? "timeout" : "error", error));
			},
			attrs,
			createScriptHook: (hookUrl, hookAttrs) => {
				const res = host.loaderHook.lifecycle.createScript.emit({
					url: hookUrl,
					attrs: hookAttrs,
					remoteInfo,
					resourceContext: {
						...context,
						url: hookUrl
					}
				});
				if (res instanceof HTMLScriptElement) return res;
				return res;
			},
			needDeleteScript: true
		});
		needAttach && document.head.appendChild(script);
	});
}
function createResourceContext(baseContext, resourceType) {
	return {
		...baseContext,
		resourceType
	};
}
function preloadAssets(remoteInfo, host, assets, useLinkPreload = true, baseContext = {
	initiator: "preloadRemote",
	id: remoteInfo.name
}, recordPreloadedAssets = true) {
	const { cssAssets, jsAssetsWithoutEntry, entryAssets } = assets;
	const results = [];
	if (host.options.inBrowser) {
		entryAssets.forEach((asset) => {
			const { moduleInfo: entryRemoteInfo } = asset;
			results.push(waitForRemoteEntryPreload(host, remoteInfo, entryRemoteInfo, createResourceContext(baseContext, "remoteEntry")));
		});
		if (useLinkPreload) {
			const defaultAttrs = {
				rel: "preload",
				as: "style"
			};
			cssAssets.forEach((cssUrl) => {
				const context = createResourceContext(baseContext, "css");
				results.push(preloadAssetOnce(context, cssUrl, recordPreloadedAssets, () => waitForLinkPreload({
					host,
					remoteInfo,
					url: cssUrl,
					attrs: defaultAttrs,
					context
				})));
			});
		} else {
			const defaultAttrs = {
				rel: "stylesheet",
				type: "text/css"
			};
			cssAssets.forEach((cssUrl) => {
				const context = createResourceContext(baseContext, "css");
				results.push(preloadAssetOnce(context, cssUrl, recordPreloadedAssets, () => waitForLinkPreload({
					host,
					remoteInfo,
					url: cssUrl,
					attrs: defaultAttrs,
					needDeleteLink: false,
					context
				})));
			});
		}
		let preloadJsAsset = waitForScriptPreload;
		let defaultAttrs = {
			fetchpriority: "high",
			type: "text/javascript"
		};
		if (useLinkPreload) {
			preloadJsAsset = waitForLinkPreload;
			defaultAttrs = {
				rel: "preload",
				as: "script"
			};
		} else if ((0,_load_js__WEBPACK_IMPORTED_MODULE_3__.isEsmRemoteType)(remoteInfo.type)) {
			preloadJsAsset = waitForLinkPreload;
			defaultAttrs = {
				rel: "modulepreload",
				fetchpriority: "high"
			};
		}
		jsAssetsWithoutEntry.forEach((jsUrl) => {
			const context = createResourceContext(baseContext, "js");
			results.push(preloadAssetOnce(context, jsUrl, recordPreloadedAssets, () => preloadJsAsset({
				host,
				remoteInfo,
				url: jsUrl,
				attrs: defaultAttrs,
				context
			})));
		});
	}
	return Promise.all(results);
}

//#endregion

//# sourceMappingURL=preload.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/semver/compare.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/semver/compare.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compare: () => (/* binding */ compare)
/* harmony export */ });
//#region src/utils/semver/compare.ts
function compareAtom(rangeAtom, versionAtom) {
	rangeAtom = Number(rangeAtom) || rangeAtom;
	versionAtom = Number(versionAtom) || versionAtom;
	if (rangeAtom > versionAtom) return 1;
	if (rangeAtom === versionAtom) return 0;
	return -1;
}
function comparePreRelease(rangeAtom, versionAtom) {
	const { preRelease: rangePreRelease } = rangeAtom;
	const { preRelease: versionPreRelease } = versionAtom;
	if (rangePreRelease === void 0 && Boolean(versionPreRelease)) return 1;
	if (Boolean(rangePreRelease) && versionPreRelease === void 0) return -1;
	if (rangePreRelease === void 0 && versionPreRelease === void 0) return 0;
	for (let i = 0, n = rangePreRelease.length; i <= n; i++) {
		const rangeElement = rangePreRelease[i];
		const versionElement = versionPreRelease[i];
		if (rangeElement === versionElement) continue;
		if (rangeElement === void 0 && versionElement === void 0) return 0;
		if (!rangeElement) return 1;
		if (!versionElement) return -1;
		return compareAtom(rangeElement, versionElement);
	}
	return 0;
}
function compareVersion(rangeAtom, versionAtom) {
	return compareAtom(rangeAtom.major, versionAtom.major) || compareAtom(rangeAtom.minor, versionAtom.minor) || compareAtom(rangeAtom.patch, versionAtom.patch) || comparePreRelease(rangeAtom, versionAtom);
}
function eq(rangeAtom, versionAtom) {
	return rangeAtom.version === versionAtom.version;
}
function compare(rangeAtom, versionAtom) {
	switch (rangeAtom.operator) {
		case "":
		case "=": return eq(rangeAtom, versionAtom);
		case ">": return compareVersion(rangeAtom, versionAtom) < 0;
		case ">=": return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) < 0;
		case "<": return compareVersion(rangeAtom, versionAtom) > 0;
		case "<=": return eq(rangeAtom, versionAtom) || compareVersion(rangeAtom, versionAtom) > 0;
		case void 0: return true;
		default: return false;
	}
}

//#endregion

//# sourceMappingURL=compare.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/semver/constants.js"
/*!*************************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/semver/constants.js ***!
  \*************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   caret: () => (/* binding */ caret),
/* harmony export */   caretTrim: () => (/* binding */ caretTrim),
/* harmony export */   comparator: () => (/* binding */ comparator),
/* harmony export */   comparatorTrim: () => (/* binding */ comparatorTrim),
/* harmony export */   gte0: () => (/* binding */ gte0),
/* harmony export */   hyphenRange: () => (/* binding */ hyphenRange),
/* harmony export */   star: () => (/* binding */ star),
/* harmony export */   tilde: () => (/* binding */ tilde),
/* harmony export */   tildeTrim: () => (/* binding */ tildeTrim),
/* harmony export */   xRange: () => (/* binding */ xRange)
/* harmony export */ });
//#region src/utils/semver/constants.ts
const buildIdentifier = "[0-9A-Za-z-]+";
const build = `(?:\\+(${buildIdentifier}(?:\\.${buildIdentifier})*))`;
const numericIdentifier = "0|[1-9]\\d*";
const numericIdentifierLoose = "[0-9]+";
const nonNumericIdentifier = "\\d*[a-zA-Z-][a-zA-Z0-9-]*";
const preReleaseIdentifierLoose = `(?:${numericIdentifierLoose}|${nonNumericIdentifier})`;
const preReleaseLoose = `(?:-?(${preReleaseIdentifierLoose}(?:\\.${preReleaseIdentifierLoose})*))`;
const preReleaseIdentifier = `(?:${numericIdentifier}|${nonNumericIdentifier})`;
const preRelease = `(?:-(${preReleaseIdentifier}(?:\\.${preReleaseIdentifier})*))`;
const xRangeIdentifier = `${numericIdentifier}|x|X|\\*`;
const xRangePlain = `[v=\\s]*(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:\\.(${xRangeIdentifier})(?:${preRelease})?${build}?)?)?`;
const hyphenRange = `^\\s*(${xRangePlain})\\s+-\\s+(${xRangePlain})\\s*$`;
const loosePlain = `[v=\\s]*${`(${numericIdentifierLoose})\\.(${numericIdentifierLoose})\\.(${numericIdentifierLoose})`}${preReleaseLoose}?${build}?`;
const gtlt = "((?:<|>)?=?)";
const comparatorTrim = `(\\s*)${gtlt}\\s*(${loosePlain}|${xRangePlain})`;
const loneTilde = "(?:~>?)";
const tildeTrim = `(\\s*)${loneTilde}\\s+`;
const loneCaret = "(?:\\^)";
const caretTrim = `(\\s*)${loneCaret}\\s+`;
const star = "(<|>)?=?\\s*\\*";
const caret = `^${loneCaret}${xRangePlain}$`;
const fullPlain = `v?${`(${numericIdentifier})\\.(${numericIdentifier})\\.(${numericIdentifier})`}${preRelease}?${build}?`;
const tilde = `^${loneTilde}${xRangePlain}$`;
const xRange = `^${gtlt}\\s*${xRangePlain}$`;
const comparator = `^${gtlt}\\s*(${fullPlain})$|^$`;
const gte0 = "^\\s*>=\\s*0.0.0\\s*$";

//#endregion

//# sourceMappingURL=constants.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/semver/index.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/semver/index.js ***!
  \*********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   satisfy: () => (/* binding */ satisfy)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/utils.js");
/* harmony import */ var _parser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parser.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/parser.js");
/* harmony import */ var _compare_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./compare.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/compare.js");




//#region src/utils/semver/index.ts
function parseComparatorString(range) {
	return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.pipe)(_parser_js__WEBPACK_IMPORTED_MODULE_1__.parseCarets, _parser_js__WEBPACK_IMPORTED_MODULE_1__.parseTildes, _parser_js__WEBPACK_IMPORTED_MODULE_1__.parseXRanges, _parser_js__WEBPACK_IMPORTED_MODULE_1__.parseStar)(range);
}
function parseRange(range) {
	return (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.pipe)(_parser_js__WEBPACK_IMPORTED_MODULE_1__.parseHyphen, _parser_js__WEBPACK_IMPORTED_MODULE_1__.parseComparatorTrim, _parser_js__WEBPACK_IMPORTED_MODULE_1__.parseTildeTrim, _parser_js__WEBPACK_IMPORTED_MODULE_1__.parseCaretTrim)(range.trim()).split(/\s+/).join(" ");
}
function satisfy(version, range) {
	if (!version) return false;
	const extractedVersion = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.extractComparator)(version);
	if (!extractedVersion) return false;
	const [, versionOperator, , versionMajor, versionMinor, versionPatch, versionPreRelease] = extractedVersion;
	const versionAtom = {
		operator: versionOperator,
		version: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.combineVersion)(versionMajor, versionMinor, versionPatch, versionPreRelease),
		major: versionMajor,
		minor: versionMinor,
		patch: versionPatch,
		preRelease: versionPreRelease?.split(".")
	};
	const orRanges = range.split("||");
	for (const orRange of orRanges) {
		const trimmedOrRange = orRange.trim();
		if (!trimmedOrRange) return true;
		if (trimmedOrRange === "*" || trimmedOrRange === "x") return true;
		try {
			const parsedSubRange = parseRange(trimmedOrRange);
			if (!parsedSubRange.trim()) return true;
			const parsedComparatorString = parsedSubRange.split(" ").map((rangeVersion) => parseComparatorString(rangeVersion)).join(" ");
			if (!parsedComparatorString.trim()) return true;
			const comparators = parsedComparatorString.split(/\s+/).map((comparator) => (0,_parser_js__WEBPACK_IMPORTED_MODULE_1__.parseGTE0)(comparator)).filter(Boolean);
			if (comparators.length === 0) continue;
			let subRangeSatisfied = true;
			for (const comparator of comparators) {
				const extractedComparator = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.extractComparator)(comparator);
				if (!extractedComparator) {
					subRangeSatisfied = false;
					break;
				}
				const [, rangeOperator, , rangeMajor, rangeMinor, rangePatch, rangePreRelease] = extractedComparator;
				if (!(0,_compare_js__WEBPACK_IMPORTED_MODULE_2__.compare)({
					operator: rangeOperator,
					version: (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.combineVersion)(rangeMajor, rangeMinor, rangePatch, rangePreRelease),
					major: rangeMajor,
					minor: rangeMinor,
					patch: rangePatch,
					preRelease: rangePreRelease?.split(".")
				}, versionAtom)) {
					subRangeSatisfied = false;
					break;
				}
			}
			if (subRangeSatisfied) return true;
		} catch (e) {
			console.error(`[semver] Error processing range part "${trimmedOrRange}":`, e);
			continue;
		}
	}
	return false;
}

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/semver/parser.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/semver/parser.js ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseCaretTrim: () => (/* binding */ parseCaretTrim),
/* harmony export */   parseCarets: () => (/* binding */ parseCarets),
/* harmony export */   parseComparatorTrim: () => (/* binding */ parseComparatorTrim),
/* harmony export */   parseGTE0: () => (/* binding */ parseGTE0),
/* harmony export */   parseHyphen: () => (/* binding */ parseHyphen),
/* harmony export */   parseStar: () => (/* binding */ parseStar),
/* harmony export */   parseTildeTrim: () => (/* binding */ parseTildeTrim),
/* harmony export */   parseTildes: () => (/* binding */ parseTildes),
/* harmony export */   parseXRanges: () => (/* binding */ parseXRanges)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/utils.js");



//#region src/utils/semver/parser.ts
function parseHyphen(range) {
	return range.replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.hyphenRange), (_range, from, fromMajor, fromMinor, fromPatch, _fromPreRelease, _fromBuild, to, toMajor, toMinor, toPatch, toPreRelease) => {
		if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(fromMajor)) from = "";
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(fromMinor)) from = `>=${fromMajor}.0.0`;
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(fromPatch)) from = `>=${fromMajor}.${fromMinor}.0`;
		else from = `>=${from}`;
		if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(toMajor)) to = "";
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(toMinor)) to = `<${Number(toMajor) + 1}.0.0-0`;
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(toPatch)) to = `<${toMajor}.${Number(toMinor) + 1}.0-0`;
		else if (toPreRelease) to = `<=${toMajor}.${toMinor}.${toPatch}-${toPreRelease}`;
		else to = `<=${to}`;
		return `${from} ${to}`.trim();
	});
}
function parseComparatorTrim(range) {
	return range.replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.comparatorTrim), "$1$2$3");
}
function parseTildeTrim(range) {
	return range.replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.tildeTrim), "$1~");
}
function parseCaretTrim(range) {
	return range.replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.caretTrim), "$1^");
}
function parseCarets(range) {
	return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.caret), (_, major, minor, patch, preRelease) => {
		if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(major)) return "";
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(patch)) if (major === "0") return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
		else return `>=${major}.${minor}.0 <${Number(major) + 1}.0.0-0`;
		else if (preRelease) if (major === "0") if (minor === "0") return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${minor}.${Number(patch) + 1}-0`;
		else return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		else return `>=${major}.${minor}.${patch}-${preRelease} <${Number(major) + 1}.0.0-0`;
		else {
			if (major === "0") if (minor === "0") return `>=${major}.${minor}.${patch} <${major}.${minor}.${Number(patch) + 1}-0`;
			else return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
			return `>=${major}.${minor}.${patch} <${Number(major) + 1}.0.0-0`;
		}
	})).join(" ");
}
function parseTildes(range) {
	return range.trim().split(/\s+/).map((rangeVersion) => rangeVersion.replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.tilde), (_, major, minor, patch, preRelease) => {
		if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(major)) return "";
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(minor)) return `>=${major}.0.0 <${Number(major) + 1}.0.0-0`;
		else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(patch)) return `>=${major}.${minor}.0 <${major}.${Number(minor) + 1}.0-0`;
		else if (preRelease) return `>=${major}.${minor}.${patch}-${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		return `>=${major}.${minor}.${patch} <${major}.${Number(minor) + 1}.0-0`;
	})).join(" ");
}
function parseXRanges(range) {
	return range.split(/\s+/).map((rangeVersion) => rangeVersion.trim().replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.xRange), (ret, gtlt, major, minor, patch, preRelease) => {
		const isXMajor = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(major);
		const isXMinor = isXMajor || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(minor);
		const isXPatch = isXMinor || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isXVersion)(patch);
		if (gtlt === "=" && isXPatch) gtlt = "";
		preRelease = "";
		if (isXMajor) if (gtlt === ">" || gtlt === "<") return "<0.0.0-0";
		else return "*";
		else if (gtlt && isXPatch) {
			if (isXMinor) minor = 0;
			patch = 0;
			if (gtlt === ">") {
				gtlt = ">=";
				if (isXMinor) {
					major = Number(major) + 1;
					minor = 0;
					patch = 0;
				} else {
					minor = Number(minor) + 1;
					patch = 0;
				}
			} else if (gtlt === "<=") {
				gtlt = "<";
				if (isXMinor) major = Number(major) + 1;
				else minor = Number(minor) + 1;
			}
			if (gtlt === "<") preRelease = "-0";
			return `${gtlt + major}.${minor}.${patch}${preRelease}`;
		} else if (isXMinor) return `>=${major}.0.0${preRelease} <${Number(major) + 1}.0.0-0`;
		else if (isXPatch) return `>=${major}.${minor}.0${preRelease} <${major}.${Number(minor) + 1}.0-0`;
		return ret;
	})).join(" ");
}
function parseStar(range) {
	return range.trim().replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.star), "");
}
function parseGTE0(comparatorString) {
	return comparatorString.trim().replace((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.parseRegex)(_constants_js__WEBPACK_IMPORTED_MODULE_0__.gte0), "");
}

//#endregion

//# sourceMappingURL=parser.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/semver/utils.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/semver/utils.js ***!
  \*********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   combineVersion: () => (/* binding */ combineVersion),
/* harmony export */   extractComparator: () => (/* binding */ extractComparator),
/* harmony export */   isXVersion: () => (/* binding */ isXVersion),
/* harmony export */   parseRegex: () => (/* binding */ parseRegex),
/* harmony export */   pipe: () => (/* binding */ pipe)
/* harmony export */ });
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/constants.js");


//#region src/utils/semver/utils.ts
function parseRegex(source) {
	return new RegExp(source);
}
function isXVersion(version) {
	return !version || version.toLowerCase() === "x" || version === "*";
}
function pipe(...fns) {
	return (x) => fns.reduce((v, f) => f(v), x);
}
function extractComparator(comparatorString) {
	return comparatorString.match(parseRegex(_constants_js__WEBPACK_IMPORTED_MODULE_0__.comparator));
}
function combineVersion(major, minor, patch, preRelease) {
	const mainVersion = `${major}.${minor}.${patch}`;
	if (preRelease) return `${mainVersion}-${preRelease}`;
	return mainVersion;
}

//#endregion

//# sourceMappingURL=utils.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/share.js"
/*!**************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/share.js ***!
  \**************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addUseIn: () => (/* binding */ addUseIn),
/* harmony export */   directShare: () => (/* binding */ directShare),
/* harmony export */   formatShareConfigs: () => (/* binding */ formatShareConfigs),
/* harmony export */   getGlobalShareScope: () => (/* binding */ getGlobalShareScope),
/* harmony export */   getRegisteredShare: () => (/* binding */ getRegisteredShare),
/* harmony export */   getTargetSharedOptions: () => (/* binding */ getTargetSharedOptions),
/* harmony export */   shouldUseTreeShaking: () => (/* binding */ shouldUseTreeShaking)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _tool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tool.js */ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js");
/* harmony import */ var _global_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../global.js */ "./node_modules/@module-federation/runtime-core/dist/global.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constant.js */ "./node_modules/@module-federation/runtime-core/dist/constant.js");
/* harmony import */ var _semver_index_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./semver/index.js */ "./node_modules/@module-federation/runtime-core/dist/utils/semver/index.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/constant.js");







//#region src/utils/share.ts
function formatShare(shareArgs, from, name, shareStrategy) {
	let get;
	if ("get" in shareArgs) get = shareArgs.get;
	else if ("lib" in shareArgs) get = () => Promise.resolve(shareArgs.lib);
	else get = () => Promise.resolve(() => {
		(0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`Cannot get shared "${name}" from "${from}": neither "get" nor "lib" is provided in the share config.`);
	});
	if (shareArgs.shareConfig?.eager && shareArgs.treeShaking?.mode) (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(`Invalid shared config for "${name}" from "${from}": cannot use both "eager: true" and "treeShaking.mode" simultaneously. Choose one strategy.`);
	return {
		deps: [],
		useIn: [],
		from,
		loading: null,
		...shareArgs,
		shareConfig: {
			requiredVersion: `^${shareArgs.version}`,
			singleton: false,
			eager: false,
			strictVersion: false,
			...shareArgs.shareConfig
		},
		get,
		loaded: shareArgs?.loaded || "lib" in shareArgs ? true : void 0,
		version: shareArgs.version ?? "0",
		scope: Array.isArray(shareArgs.scope) ? shareArgs.scope : [shareArgs.scope ?? "default"],
		strategy: (shareArgs.strategy ?? shareStrategy) || "version-first",
		treeShaking: shareArgs.treeShaking ? {
			...shareArgs.treeShaking,
			mode: shareArgs.treeShaking.mode ?? "server-calc",
			status: shareArgs.treeShaking.status ?? _module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__.TreeShakingStatus.UNKNOWN,
			useIn: []
		} : void 0
	};
}
function formatShareConfigs(prevOptions, newOptions) {
	const shareArgs = newOptions.shared || {};
	const from = newOptions.name;
	const newShareInfos = Object.keys(shareArgs).reduce((res, pkgName) => {
		const arrayShareArgs = (0,_tool_js__WEBPACK_IMPORTED_MODULE_1__.arrayOptions)(shareArgs[pkgName]);
		res[pkgName] = res[pkgName] || [];
		arrayShareArgs.forEach((shareConfig) => {
			res[pkgName].push(formatShare(shareConfig, from, pkgName, newOptions.shareStrategy));
		});
		return res;
	}, {});
	const allShareInfos = { ...prevOptions.shared };
	Object.keys(newShareInfos).forEach((shareKey) => {
		if (!allShareInfos[shareKey]) allShareInfos[shareKey] = newShareInfos[shareKey];
		else newShareInfos[shareKey].forEach((newUserSharedOptions) => {
			if (!allShareInfos[shareKey].find((sharedVal) => sharedVal.version === newUserSharedOptions.version)) allShareInfos[shareKey].push(newUserSharedOptions);
		});
	});
	return {
		allShareInfos,
		newShareInfos
	};
}
function shouldUseTreeShaking(treeShaking, usedExports) {
	if (!treeShaking) return false;
	const { status, mode } = treeShaking;
	if (status === _module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__.TreeShakingStatus.NO_USE) return false;
	if (status === _module_federation_sdk__WEBPACK_IMPORTED_MODULE_5__.TreeShakingStatus.CALCULATED) return true;
	if (mode === "runtime-infer") {
		if (!usedExports) return true;
		return isMatchUsedExports(treeShaking, usedExports);
	}
	return false;
}
/**
* compare version a and b, return true if a is less than b
*/
function versionLt(a, b) {
	const transformInvalidVersion = (version) => {
		if (!Number.isNaN(Number(version))) {
			const splitArr = version.split(".");
			let validVersion = version;
			for (let i = 0; i < 3 - splitArr.length; i++) validVersion += ".0";
			return validVersion;
		}
		return version;
	};
	if ((0,_semver_index_js__WEBPACK_IMPORTED_MODULE_4__.satisfy)(transformInvalidVersion(a), `<=${transformInvalidVersion(b)}`)) return true;
	else return false;
}
const findVersion = (shareVersionMap, cb) => {
	const callback = cb || function(prev, cur) {
		return versionLt(prev, cur);
	};
	return Object.keys(shareVersionMap).reduce((prev, cur) => {
		if (!prev) return cur;
		if (callback(prev, cur)) return cur;
		if (prev === "0") return cur;
		return prev;
	}, 0);
};
const isLoaded = (shared) => {
	return Boolean(shared.loaded) || typeof shared.lib === "function";
};
const isLoading = (shared) => {
	return Boolean(shared.loading);
};
const isMatchUsedExports = (treeShaking, usedExports) => {
	if (!treeShaking || !usedExports) return false;
	const { usedExports: treeShakingUsedExports } = treeShaking;
	if (!treeShakingUsedExports) return false;
	if (usedExports.every((e) => treeShakingUsedExports.includes(e))) return true;
	return false;
};
function findSingletonVersionOrderByVersion(shareScopeMap, scope, pkgName, treeShaking) {
	const versions = shareScopeMap[scope][pkgName];
	let version = "";
	let useTreesShaking = shouldUseTreeShaking(treeShaking);
	const callback = function(prev, cur) {
		if (useTreesShaking) {
			if (!versions[prev].treeShaking) return true;
			if (!versions[cur].treeShaking) return false;
			return !isLoaded(versions[prev].treeShaking) && versionLt(prev, cur);
		}
		return !isLoaded(versions[prev]) && versionLt(prev, cur);
	};
	if (useTreesShaking) {
		version = findVersion(shareScopeMap[scope][pkgName], callback);
		if (version) return {
			version,
			useTreesShaking
		};
		useTreesShaking = false;
	}
	return {
		version: findVersion(shareScopeMap[scope][pkgName], callback),
		useTreesShaking
	};
}
const isLoadingOrLoaded = (shared) => {
	return isLoaded(shared) || isLoading(shared);
};
function findSingletonVersionOrderByLoaded(shareScopeMap, scope, pkgName, treeShaking) {
	const versions = shareScopeMap[scope][pkgName];
	let version = "";
	let useTreesShaking = shouldUseTreeShaking(treeShaking);
	const callback = function(prev, cur) {
		if (useTreesShaking) {
			if (!versions[prev].treeShaking) return true;
			if (!versions[cur].treeShaking) return false;
			if (isLoadingOrLoaded(versions[cur].treeShaking)) if (isLoadingOrLoaded(versions[prev].treeShaking)) return Boolean(versionLt(prev, cur));
			else return true;
			if (isLoadingOrLoaded(versions[prev].treeShaking)) return false;
		}
		if (isLoadingOrLoaded(versions[cur])) if (isLoadingOrLoaded(versions[prev])) return Boolean(versionLt(prev, cur));
		else return true;
		if (isLoadingOrLoaded(versions[prev])) return false;
		return versionLt(prev, cur);
	};
	if (useTreesShaking) {
		version = findVersion(shareScopeMap[scope][pkgName], callback);
		if (version) return {
			version,
			useTreesShaking
		};
		useTreesShaking = false;
	}
	return {
		version: findVersion(shareScopeMap[scope][pkgName], callback),
		useTreesShaking
	};
}
function getFindShareFunction(strategy) {
	if (strategy === "loaded-first") return findSingletonVersionOrderByLoaded;
	return findSingletonVersionOrderByVersion;
}
function getRegisteredShare(localShareScopeMap, pkgName, shareInfo, resolveShare, loadContext) {
	if (!localShareScopeMap) return;
	const { shareConfig, scope = _constant_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_SCOPE, strategy, treeShaking } = shareInfo;
	const scopes = Array.isArray(scope) ? scope : [scope];
	for (const sc of scopes) if (shareConfig && localShareScopeMap[sc] && localShareScopeMap[sc][pkgName]) {
		const { requiredVersion } = shareConfig;
		const { version: maxOrSingletonVersion, useTreesShaking } = getFindShareFunction(strategy)(localShareScopeMap, sc, pkgName, treeShaking);
		const defaultResolver = () => {
			const shared = localShareScopeMap[sc][pkgName][maxOrSingletonVersion];
			if (shareConfig.singleton) {
				if (typeof requiredVersion === "string" && !(0,_semver_index_js__WEBPACK_IMPORTED_MODULE_4__.satisfy)(maxOrSingletonVersion, requiredVersion)) {
					const msg = `Version ${maxOrSingletonVersion} from ${maxOrSingletonVersion && shared.from} of shared singleton module ${pkgName} does not satisfy the requirement of ${shareInfo.from} which needs ${requiredVersion})`;
					if (shareConfig.strictVersion) (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.error)(msg);
					else (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.warn)(msg);
				}
				return {
					shared,
					useTreesShaking
				};
			} else {
				if (requiredVersion === false || requiredVersion === "*") return {
					shared,
					useTreesShaking
				};
				if ((0,_semver_index_js__WEBPACK_IMPORTED_MODULE_4__.satisfy)(maxOrSingletonVersion, requiredVersion)) return {
					shared,
					useTreesShaking
				};
				const _usedTreeShaking = shouldUseTreeShaking(treeShaking);
				if (_usedTreeShaking) for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])) {
					if (!shouldUseTreeShaking(versionValue.treeShaking, treeShaking?.usedExports)) continue;
					if ((0,_semver_index_js__WEBPACK_IMPORTED_MODULE_4__.satisfy)(versionKey, requiredVersion)) return {
						shared: versionValue,
						useTreesShaking: _usedTreeShaking
					};
				}
				for (const [versionKey, versionValue] of Object.entries(localShareScopeMap[sc][pkgName])) if ((0,_semver_index_js__WEBPACK_IMPORTED_MODULE_4__.satisfy)(versionKey, requiredVersion)) return {
					shared: versionValue,
					useTreesShaking: false
				};
			}
		};
		const params = {
			shareScopeMap: localShareScopeMap,
			scope: sc,
			pkgName,
			version: maxOrSingletonVersion,
			GlobalFederation: _global_js__WEBPACK_IMPORTED_MODULE_2__.Global.__FEDERATION__,
			shareInfo,
			resolver: defaultResolver,
			loadContext
		};
		return (resolveShare.emit(params) || params).resolver();
	}
}
function getGlobalShareScope() {
	return _global_js__WEBPACK_IMPORTED_MODULE_2__.Global.__FEDERATION__.__SHARE__;
}
function getTargetSharedOptions(options) {
	const { pkgName, extraOptions, shareInfos } = options;
	const defaultResolver = (sharedOptions) => {
		if (!sharedOptions) return;
		const shareVersionMap = {};
		sharedOptions.forEach((shared) => {
			shareVersionMap[shared.version] = shared;
		});
		const callback = function(prev, cur) {
			return !isLoaded(shareVersionMap[prev]) && versionLt(prev, cur);
		};
		return shareVersionMap[findVersion(shareVersionMap, callback)];
	};
	const resolver = extraOptions?.resolver ?? defaultResolver;
	const isPlainObject = (val) => {
		return val !== null && typeof val === "object" && !Array.isArray(val);
	};
	const merge = (...sources) => {
		const out = {};
		for (const src of sources) {
			if (!src) continue;
			for (const [key, value] of Object.entries(src)) {
				const prev = out[key];
				if (isPlainObject(prev) && isPlainObject(value)) out[key] = merge(prev, value);
				else if (value !== void 0) out[key] = value;
			}
		}
		return out;
	};
	return merge(resolver(shareInfos[pkgName]), extraOptions?.customShareInfo);
}
const addUseIn = (shared, from) => {
	if (!shared.useIn) shared.useIn = [];
	(0,_tool_js__WEBPACK_IMPORTED_MODULE_1__.addUniqueItem)(shared.useIn, from);
};
function directShare(shared, useTreesShaking) {
	if (useTreesShaking && shared.treeShaking) return shared.treeShaking;
	return shared;
}

//#endregion

//# sourceMappingURL=share.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime-core/dist/utils/tool.js"
/*!*************************************************************************!*\
  !*** ./node_modules/@module-federation/runtime-core/dist/utils/tool.js ***!
  \*************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addUniqueItem: () => (/* binding */ addUniqueItem),
/* harmony export */   arrayOptions: () => (/* binding */ arrayOptions),
/* harmony export */   getFMId: () => (/* binding */ getFMId),
/* harmony export */   getRemoteEntryInfoFromSnapshot: () => (/* binding */ getRemoteEntryInfoFromSnapshot),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isPlainObject: () => (/* binding */ isPlainObject),
/* harmony export */   isPureRemoteEntry: () => (/* binding */ isPureRemoteEntry),
/* harmony export */   isRemoteInfoWithEntry: () => (/* binding */ isRemoteInfoWithEntry),
/* harmony export */   isStaticResourcesEqual: () => (/* binding */ isStaticResourcesEqual),
/* harmony export */   objectToString: () => (/* binding */ objectToString),
/* harmony export */   processModuleAlias: () => (/* binding */ processModuleAlias),
/* harmony export */   safeWrapper: () => (/* binding */ safeWrapper)
/* harmony export */ });
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ "./node_modules/@module-federation/runtime-core/dist/utils/logger.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/env.js");



//#region src/utils/tool.ts
function addUniqueItem(arr, item) {
	if (arr.findIndex((name) => name === item) === -1) arr.push(item);
	return arr;
}
function getFMId(remoteInfo) {
	if ("version" in remoteInfo && remoteInfo.version) return `${remoteInfo.name}:${remoteInfo.version}`;
	else if ("entry" in remoteInfo && remoteInfo.entry) return `${remoteInfo.name}:${remoteInfo.entry}`;
	else return `${remoteInfo.name}`;
}
function isRemoteInfoWithEntry(remote) {
	return typeof remote.entry !== "undefined";
}
function isPureRemoteEntry(remote) {
	return !remote.entry.includes(".json");
}
async function safeWrapper(callback, disableWarn) {
	try {
		return await callback();
	} catch (e) {
		!disableWarn && (0,_logger_js__WEBPACK_IMPORTED_MODULE_0__.warn)(e);
		return;
	}
}
function isObject(val) {
	return val && typeof val === "object";
}
const objectToString = Object.prototype.toString;
function isPlainObject(val) {
	return objectToString.call(val) === "[object Object]";
}
function isStaticResourcesEqual(url1, url2) {
	const REG_EXP = /^(https?:)?\/\//i;
	return url1.replace(REG_EXP, "").replace(/\/$/, "") === url2.replace(REG_EXP, "").replace(/\/$/, "");
}
function arrayOptions(options) {
	return Array.isArray(options) ? options : [options];
}
function getRemoteEntryInfoFromSnapshot(snapshot) {
	const defaultRemoteEntryInfo = {
		url: "",
		type: "global",
		globalName: ""
	};
	if (_module_federation_sdk__WEBPACK_IMPORTED_MODULE_1__.isBrowserEnvValue || (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_1__.isReactNativeEnv)() || !("ssrRemoteEntry" in snapshot)) return "remoteEntry" in snapshot ? {
		url: snapshot.remoteEntry,
		type: snapshot.remoteEntryType,
		globalName: snapshot.globalName
	} : defaultRemoteEntryInfo;
	if ("ssrRemoteEntry" in snapshot) return {
		url: snapshot.ssrRemoteEntry || defaultRemoteEntryInfo.url,
		type: snapshot.ssrRemoteEntryType || defaultRemoteEntryInfo.type,
		globalName: snapshot.globalName
	};
	return defaultRemoteEntryInfo;
}
const processModuleAlias = (name, subPath) => {
	let moduleName;
	if (name.endsWith("/")) moduleName = name.slice(0, -1);
	else moduleName = name;
	if (subPath.startsWith(".")) subPath = subPath.slice(1);
	moduleName = moduleName + subPath;
	return moduleName;
};

//#endregion

//# sourceMappingURL=tool.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime/dist/bundler.js"
/*!*****************************************************************!*\
  !*** ./node_modules/@module-federation/runtime/dist/bundler.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Module: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.Module),
/* harmony export */   ModuleFederation: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.ModuleFederation),
/* harmony export */   createInstance: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.createInstance),
/* harmony export */   getInstance: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.getInstance),
/* harmony export */   getRemoteEntry: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.getRemoteEntry),
/* harmony export */   getRemoteInfo: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.getRemoteInfo),
/* harmony export */   init: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.init),
/* harmony export */   loadRemote: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.loadRemote),
/* harmony export */   loadScript: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.loadScript),
/* harmony export */   loadScriptNode: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.loadScriptNode),
/* harmony export */   loadShare: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.loadShare),
/* harmony export */   loadShareSync: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.loadShareSync),
/* harmony export */   preloadRemote: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.preloadRemote),
/* harmony export */   registerGlobalPlugins: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.registerGlobalPlugins),
/* harmony export */   registerPlugins: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.registerPlugins),
/* harmony export */   registerRemotes: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.registerRemotes),
/* harmony export */   registerShared: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.registerShared),
/* harmony export */   satisfy: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_0__.satisfy)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index.js */ "./node_modules/@module-federation/runtime/dist/index.js");




/***/ },

/***/ "./node_modules/@module-federation/runtime/dist/helpers.js"
/*!*****************************************************************!*\
  !*** ./node_modules/@module-federation/runtime/dist/helpers.js ***!
  \*****************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ runtimeHelpers),
/* harmony export */   global: () => (/* binding */ global),
/* harmony export */   share: () => (/* binding */ share),
/* harmony export */   utils: () => (/* binding */ utils)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@module-federation/runtime/dist/utils.js");
/* harmony import */ var _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @module-federation/runtime-core */ "./node_modules/@module-federation/runtime-core/dist/index.js");



//#region src/helpers.ts
const global = {
	..._module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.helpers.global,
	getGlobalFederationInstance: _utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalFederationInstance
};
const share = _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.helpers.share;
const utils = _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.helpers.utils;
const runtimeHelpers = {
	global,
	share,
	utils
};

//#endregion

//# sourceMappingURL=helpers.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime/dist/index.js"
/*!***************************************************************!*\
  !*** ./node_modules/@module-federation/runtime/dist/index.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Module: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.Module),
/* harmony export */   ModuleFederation: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.ModuleFederation),
/* harmony export */   createInstance: () => (/* binding */ createInstance),
/* harmony export */   getInstance: () => (/* binding */ getInstance),
/* harmony export */   getRemoteEntry: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.getRemoteEntry),
/* harmony export */   getRemoteInfo: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.getRemoteInfo),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   loadRemote: () => (/* binding */ loadRemote),
/* harmony export */   loadScript: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.loadScript),
/* harmony export */   loadScriptNode: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.loadScriptNode),
/* harmony export */   loadShare: () => (/* binding */ loadShare),
/* harmony export */   loadShareSync: () => (/* binding */ loadShareSync),
/* harmony export */   preloadRemote: () => (/* binding */ preloadRemote),
/* harmony export */   registerGlobalPlugins: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.registerGlobalPlugins),
/* harmony export */   registerPlugins: () => (/* binding */ registerPlugins),
/* harmony export */   registerRemotes: () => (/* binding */ registerRemotes),
/* harmony export */   registerShared: () => (/* binding */ registerShared),
/* harmony export */   satisfy: () => (/* reexport safe */ _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.satisfy)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@module-federation/runtime/dist/utils.js");
/* harmony import */ var _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @module-federation/runtime-core */ "./node_modules/@module-federation/runtime-core/dist/index.js");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @module-federation/error-codes */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");




//#region src/index.ts
function createInstance(options) {
	const instance = new (((0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.getGlobalFederationConstructor)()) || _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.ModuleFederation)({
		id: `${options.name}@${options.version || Date.now()}`,
		...options
	});
	(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.setGlobalFederationInstance)(instance);
	return instance;
}
let FederationInstance = null;
function init(options) {
	const instance = (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalFederationInstance)(options.name, options.version);
	const normalizedOptions = {
		...options,
		id: options.id || ""
	};
	if (!instance) {
		FederationInstance = createInstance(normalizedOptions);
		return FederationInstance;
	} else {
		instance.initOptions(normalizedOptions);
		if (!FederationInstance) FederationInstance = instance;
		return instance;
	}
}
function loadRemote(...args) {
	;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.assert)(FederationInstance, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__.RUNTIME_009, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__.runtimeDescMap);
	return FederationInstance.loadRemote.apply(FederationInstance, args);
}
function loadShare(...args) {
	;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.assert)(FederationInstance, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__.RUNTIME_009, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__.runtimeDescMap);
	return FederationInstance.loadShare.apply(FederationInstance, args);
}
function loadShareSync(...args) {
	;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.assert)(FederationInstance, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__.RUNTIME_009, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__.runtimeDescMap);
	return FederationInstance.loadShareSync.apply(FederationInstance, args);
}
function preloadRemote(...args) {
	;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.assert)(FederationInstance, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__.RUNTIME_009, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__.runtimeDescMap);
	return FederationInstance.preloadRemote.apply(FederationInstance, args);
}
function registerRemotes(...args) {
	;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.assert)(FederationInstance, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__.RUNTIME_009, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__.runtimeDescMap);
	return FederationInstance.registerRemotes.apply(FederationInstance, args);
}
function registerPlugins(...args) {
	;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.assert)(FederationInstance, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__.RUNTIME_009, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__.runtimeDescMap);
	return FederationInstance.registerPlugins.apply(FederationInstance, args);
}
function getInstance(finder) {
	if (!finder) return FederationInstance;
	return _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.CurrentGlobal.__FEDERATION__.__INSTANCES__.find(finder) || null;
}
function registerShared(...args) {
	;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.assert)(FederationInstance, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_2__.RUNTIME_009, _module_federation_error_codes__WEBPACK_IMPORTED_MODULE_3__.runtimeDescMap);
	return FederationInstance.registerShared.apply(FederationInstance, args);
}
;(0,_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.setGlobalFederationConstructor)(_module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_1__.ModuleFederation);

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/runtime/dist/utils.js"
/*!***************************************************************!*\
  !*** ./node_modules/@module-federation/runtime/dist/utils.js ***!
  \***************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobalFederationInstance: () => (/* binding */ getGlobalFederationInstance)
/* harmony export */ });
/* harmony import */ var _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @module-federation/runtime-core */ "./node_modules/@module-federation/runtime-core/dist/index.js");


//#region src/utils.ts
function getBuilderId() {
	return  true ? "aesop_frontend:0.0.1" : 0;
}
function getGlobalFederationInstance(name, version) {
	const buildId = getBuilderId();
	return _module_federation_runtime_core__WEBPACK_IMPORTED_MODULE_0__.CurrentGlobal.__FEDERATION__.__INSTANCES__.find((GMInstance) => {
		if (buildId && GMInstance.options.id === buildId) return true;
		if (GMInstance.options.name === name && !GMInstance.options.version && !version) return true;
		if (GMInstance.options.name === name && version && GMInstance.options.version === version) return true;
		return false;
	});
}

//#endregion

//# sourceMappingURL=utils.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js"
/*!********************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js ***!
  \********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __exportAll: () => (/* binding */ __exportAll)
/* harmony export */ });
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) {
		__defProp(target, name, {
			get: all[name],
			enumerable: true
		});
	}
	if (!no_symbols) {
		__defProp(target, Symbol.toStringTag, { value: "Module" });
	}
	return target;
};

//#endregion


/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/constant.js"
/*!**************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/constant.js ***!
  \**************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BROWSER_LOG_KEY: () => (/* binding */ BROWSER_LOG_KEY),
/* harmony export */   ENCODE_NAME_PREFIX: () => (/* binding */ ENCODE_NAME_PREFIX),
/* harmony export */   EncodedNameTransformMap: () => (/* binding */ EncodedNameTransformMap),
/* harmony export */   FederationModuleManifest: () => (/* binding */ FederationModuleManifest),
/* harmony export */   MANIFEST_EXT: () => (/* binding */ MANIFEST_EXT),
/* harmony export */   MFModuleType: () => (/* binding */ MFModuleType),
/* harmony export */   MODULE_DEVTOOL_IDENTIFIER: () => (/* binding */ MODULE_DEVTOOL_IDENTIFIER),
/* harmony export */   ManifestFileName: () => (/* binding */ ManifestFileName),
/* harmony export */   NameTransformMap: () => (/* binding */ NameTransformMap),
/* harmony export */   NameTransformSymbol: () => (/* binding */ NameTransformSymbol),
/* harmony export */   SEPARATOR: () => (/* binding */ SEPARATOR),
/* harmony export */   StatsFileName: () => (/* binding */ StatsFileName),
/* harmony export */   TEMP_DIR: () => (/* binding */ TEMP_DIR),
/* harmony export */   TreeShakingStatus: () => (/* binding */ TreeShakingStatus)
/* harmony export */ });
//#region src/constant.ts
const FederationModuleManifest = "federation-manifest.json";
const MANIFEST_EXT = ".json";
const BROWSER_LOG_KEY = "FEDERATION_DEBUG";
const NameTransformSymbol = {
	AT: "@",
	HYPHEN: "-",
	SLASH: "/"
};
const NameTransformMap = {
	[NameTransformSymbol.AT]: "scope_",
	[NameTransformSymbol.HYPHEN]: "_",
	[NameTransformSymbol.SLASH]: "__"
};
const EncodedNameTransformMap = {
	[NameTransformMap[NameTransformSymbol.AT]]: NameTransformSymbol.AT,
	[NameTransformMap[NameTransformSymbol.HYPHEN]]: NameTransformSymbol.HYPHEN,
	[NameTransformMap[NameTransformSymbol.SLASH]]: NameTransformSymbol.SLASH
};
const SEPARATOR = ":";
const ManifestFileName = "mf-manifest.json";
const StatsFileName = "mf-stats.json";
const MFModuleType = {
	NPM: "npm",
	APP: "app"
};
const MODULE_DEVTOOL_IDENTIFIER = "__MF_DEVTOOLS_MODULE_INFO__";
const ENCODE_NAME_PREFIX = "ENCODE_NAME_PREFIX";
const TEMP_DIR = ".federation";
let TreeShakingStatus = /* @__PURE__ */ function(TreeShakingStatus) {
	/**
	* Not handled by deploy server, needs to infer by the real runtime period.
	*/
	TreeShakingStatus[TreeShakingStatus["UNKNOWN"] = 1] = "UNKNOWN";
	/**
	* It means the shared has been calculated , runtime should take this shared as first choice.
	*/
	TreeShakingStatus[TreeShakingStatus["CALCULATED"] = 2] = "CALCULATED";
	/**
	* It means the shared has been calculated, and marked as no used
	*/
	TreeShakingStatus[TreeShakingStatus["NO_USE"] = 0] = "NO_USE";
	return TreeShakingStatus;
}({});

//#endregion

//# sourceMappingURL=constant.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/createModuleFederationConfig.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/createModuleFederationConfig.js ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createModuleFederationConfig: () => (/* binding */ createModuleFederationConfig)
/* harmony export */ });
//#region src/createModuleFederationConfig.ts
const createModuleFederationConfig = (options) => {
	return options;
};

//#endregion

//# sourceMappingURL=createModuleFederationConfig.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/dom.js"
/*!*********************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/dom.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createLink: () => (/* binding */ createLink),
/* harmony export */   createScript: () => (/* binding */ createScript),
/* harmony export */   isStaticResourcesEqual: () => (/* binding */ isStaticResourcesEqual),
/* harmony export */   loadScript: () => (/* binding */ loadScript),
/* harmony export */   safeWrapper: () => (/* binding */ safeWrapper)
/* harmony export */ });
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@module-federation/sdk/dist/utils.js");


//#region src/dom.ts
async function safeWrapper(callback, disableWarn) {
	try {
		return await callback();
	} catch (e) {
		!disableWarn && (0,_utils_js__WEBPACK_IMPORTED_MODULE_0__.warn)(e);
		return;
	}
}
function isStaticResourcesEqual(url1, url2) {
	const REG_EXP = /^(https?:)?\/\//i;
	return url1.replace(REG_EXP, "").replace(/\/$/, "") === url2.replace(REG_EXP, "").replace(/\/$/, "");
}
function createScript(info) {
	let script = null;
	let needAttach = true;
	let timeout = 2e4;
	let timeoutId;
	const scripts = document.getElementsByTagName("script");
	for (let i = 0; i < scripts.length; i++) {
		const s = scripts[i];
		const scriptSrc = s.getAttribute("src");
		if (scriptSrc && isStaticResourcesEqual(scriptSrc, info.url)) {
			script = s;
			needAttach = false;
			break;
		}
	}
	if (!script) {
		const attrs = info.attrs;
		script = document.createElement("script");
		script.type = attrs?.["type"] === "module" ? "module" : "text/javascript";
		let createScriptRes = void 0;
		if (info.createScriptHook) {
			createScriptRes = info.createScriptHook(info.url, info.attrs);
			if (createScriptRes instanceof HTMLScriptElement) script = createScriptRes;
			else if (typeof createScriptRes === "object") {
				if ("script" in createScriptRes && createScriptRes.script) script = createScriptRes.script;
				if ("timeout" in createScriptRes && createScriptRes.timeout) timeout = createScriptRes.timeout;
			}
		}
		if (!script.src) script.src = info.url;
		if (attrs && !createScriptRes) Object.keys(attrs).forEach((name) => {
			if (script) {
				if (name === "async" || name === "defer") script[name] = attrs[name];
				else if (!script.getAttribute(name)) script.setAttribute(name, attrs[name]);
			}
		});
	}
	let executionError = null;
	const executionErrorHandler = typeof window !== "undefined" ? (evt) => {
		if (evt.filename && isStaticResourcesEqual(evt.filename, info.url)) {
			const err = /* @__PURE__ */ new Error(`ScriptExecutionError: Script "${info.url}" loaded but threw a runtime error during execution: ${evt.message} (${evt.filename}:${evt.lineno}:${evt.colno})`);
			err.name = "ScriptExecutionError";
			executionError = err;
		}
	} : null;
	if (executionErrorHandler) window.addEventListener("error", executionErrorHandler);
	const onScriptComplete = async (prev, event) => {
		clearTimeout(timeoutId);
		if (executionErrorHandler) window.removeEventListener("error", executionErrorHandler);
		const onScriptCompleteCallback = () => {
			if (event?.type === "error") {
				const networkError = /* @__PURE__ */ new Error(event?.isTimeout ? `ScriptNetworkError: Script "${info.url}" timed out.` : `ScriptNetworkError: Failed to load script "${info.url}" - the script URL is unreachable or the server returned an error (network failure, 404, CORS, etc.)`);
				networkError.name = "ScriptNetworkError";
				info?.onErrorCallback && info?.onErrorCallback(networkError);
			} else if (executionError) info?.onErrorCallback && info?.onErrorCallback(executionError);
			else info?.cb && info?.cb();
		};
		if (script) {
			script.onerror = null;
			script.onload = null;
			safeWrapper(() => {
				const { needDeleteScript = true } = info;
				if (needDeleteScript) script?.parentNode && script.parentNode.removeChild(script);
			});
			if (prev && typeof prev === "function") {
				const result = prev(event);
				if (result instanceof Promise) {
					const res = await result;
					onScriptCompleteCallback();
					return res;
				}
				onScriptCompleteCallback();
				return result;
			}
		}
		onScriptCompleteCallback();
	};
	script.onerror = onScriptComplete.bind(null, script.onerror);
	script.onload = onScriptComplete.bind(null, script.onload);
	timeoutId = setTimeout(() => {
		onScriptComplete(null, {
			type: "error",
			isTimeout: true
		});
	}, timeout);
	return {
		script,
		needAttach
	};
}
function createLink(info) {
	let link = null;
	let needAttach = true;
	let timeout = 2e4;
	let timeoutId;
	const links = document.getElementsByTagName("link");
	for (let i = 0; i < links.length; i++) {
		const l = links[i];
		const linkHref = l.getAttribute("href");
		const linkRel = l.getAttribute("rel");
		if (linkHref && isStaticResourcesEqual(linkHref, info.url) && linkRel === info.attrs["rel"]) {
			link = l;
			needAttach = false;
			break;
		}
	}
	if (!link) {
		link = document.createElement("link");
		link.setAttribute("href", info.url);
		let createLinkRes = void 0;
		let shouldApplyAttrs = true;
		const attrs = info.attrs;
		if (info.createLinkHook) {
			createLinkRes = info.createLinkHook(info.url, attrs);
			if (createLinkRes instanceof HTMLLinkElement) {
				link = createLinkRes;
				shouldApplyAttrs = false;
			} else if (typeof createLinkRes === "object") {
				if ("link" in createLinkRes && createLinkRes.link) {
					link = createLinkRes.link;
					shouldApplyAttrs = false;
				}
				if ("timeout" in createLinkRes && createLinkRes.timeout) timeout = createLinkRes.timeout;
			}
		}
		if (attrs && shouldApplyAttrs) Object.keys(attrs).forEach((name) => {
			if (link && !link.getAttribute(name)) link.setAttribute(name, attrs[name]);
		});
	}
	if (!needAttach) {
		Promise.resolve().then(() => {
			info?.cb && info?.cb();
		});
		return {
			link,
			needAttach
		};
	}
	const onLinkComplete = (prev, event) => {
		if (timeoutId) clearTimeout(timeoutId);
		const onLinkCompleteCallback = () => {
			if (event?.type === "error") {
				const linkError = /* @__PURE__ */ new Error(event?.isTimeout ? `LinkNetworkError: Link "${info.url}" timed out.` : `LinkNetworkError: Failed to load link "${info.url}" - the URL is unreachable or the server returned an error.`);
				linkError.name = "LinkNetworkError";
				info?.onErrorCallback && info?.onErrorCallback(linkError);
			} else info?.cb && info?.cb();
		};
		if (link) {
			link.onerror = null;
			link.onload = null;
			safeWrapper(() => {
				const { needDeleteLink = true } = info;
				if (needDeleteLink) link?.parentNode && link.parentNode.removeChild(link);
			});
			if (prev) {
				const res = prev(event);
				onLinkCompleteCallback();
				return res;
			}
		}
		onLinkCompleteCallback();
	};
	link.onerror = onLinkComplete.bind(null, link.onerror);
	link.onload = onLinkComplete.bind(null, link.onload);
	timeoutId = setTimeout(() => {
		onLinkComplete(null, {
			type: "error",
			isTimeout: true
		});
	}, timeout);
	return {
		link,
		needAttach
	};
}
function loadScript(url, info) {
	const { attrs = {}, createScriptHook } = info;
	return new Promise((resolve, reject) => {
		const { script, needAttach } = createScript({
			url,
			cb: resolve,
			onErrorCallback: reject,
			attrs: {
				fetchpriority: "high",
				...attrs
			},
			createScriptHook,
			needDeleteScript: true
		});
		needAttach && document.head.appendChild(script);
	});
}

//#endregion

//# sourceMappingURL=dom.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/env.js"
/*!*********************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/env.js ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getProcessEnv: () => (/* binding */ getProcessEnv),
/* harmony export */   isBrowserEnv: () => (/* binding */ isBrowserEnv),
/* harmony export */   isBrowserEnvValue: () => (/* binding */ isBrowserEnvValue),
/* harmony export */   isDebugMode: () => (/* binding */ isDebugMode),
/* harmony export */   isReactNativeEnv: () => (/* binding */ isReactNativeEnv)
/* harmony export */ });
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant.js */ "./node_modules/@module-federation/sdk/dist/constant.js");


//#region src/env.ts
const isBrowserEnvValue = typeof ENV_TARGET !== "undefined" ? ENV_TARGET === "web" : typeof window !== "undefined" && typeof window.document !== "undefined";
function isBrowserEnv() {
	return isBrowserEnvValue;
}
function isReactNativeEnv() {
	return typeof navigator !== "undefined" && navigator?.product === "ReactNative";
}
function isBrowserDebug() {
	try {
		if (isBrowserEnv() && window.localStorage) return Boolean(localStorage.getItem(_constant_js__WEBPACK_IMPORTED_MODULE_0__.BROWSER_LOG_KEY));
	} catch (error) {
		return false;
	}
	return false;
}
function isDebugMode() {
	if (typeof process !== "undefined" && process.env && process.env["FEDERATION_DEBUG"]) return Boolean(process.env["FEDERATION_DEBUG"]);
	if (typeof FEDERATION_DEBUG !== "undefined" && Boolean(FEDERATION_DEBUG)) return true;
	return isBrowserDebug();
}
const getProcessEnv = function() {
	return typeof process !== "undefined" && process.env ? process.env : {};
};

//#endregion

//# sourceMappingURL=env.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/generateSnapshotFromManifest.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/generateSnapshotFromManifest.js ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   generateSnapshotFromManifest: () => (/* binding */ generateSnapshotFromManifest),
/* harmony export */   getManifestFileName: () => (/* binding */ getManifestFileName),
/* harmony export */   inferAutoPublicPath: () => (/* binding */ inferAutoPublicPath),
/* harmony export */   isManifestProvider: () => (/* binding */ isManifestProvider),
/* harmony export */   simpleJoinRemoteEntry: () => (/* binding */ simpleJoinRemoteEntry)
/* harmony export */ });
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant.js */ "./node_modules/@module-federation/sdk/dist/constant.js");


//#region src/generateSnapshotFromManifest.ts
const simpleJoinRemoteEntry = (rPath, rName) => {
	if (!rPath) return rName;
	const transformPath = (str) => {
		if (str === ".") return "";
		if (str.startsWith("./")) return str.replace("./", "");
		if (str.startsWith("/")) {
			const strWithoutSlash = str.slice(1);
			if (strWithoutSlash.endsWith("/")) return strWithoutSlash.slice(0, -1);
			return strWithoutSlash;
		}
		return str;
	};
	const transformedPath = transformPath(rPath);
	if (!transformedPath) return rName;
	if (transformedPath.endsWith("/")) return `${transformedPath}${rName}`;
	return `${transformedPath}/${rName}`;
};
function inferAutoPublicPath(url) {
	return url.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
}
function generateSnapshotFromManifest(manifest, options = {}) {
	const { remotes = {}, overrides = {}, version } = options;
	let remoteSnapshot;
	const getPublicPath = () => {
		if ("publicPath" in manifest.metaData) {
			if ((manifest.metaData.publicPath === "auto" || manifest.metaData.publicPath === "") && version) return inferAutoPublicPath(version);
			return manifest.metaData.publicPath;
		} else return manifest.metaData.getPublicPath;
	};
	const overridesKeys = Object.keys(overrides);
	let remotesInfo = {};
	if (!Object.keys(remotes).length) remotesInfo = manifest.remotes?.reduce((res, next) => {
		let matchedVersion;
		const name = next.federationContainerName;
		if (overridesKeys.includes(name)) matchedVersion = overrides[name];
		else if ("version" in next) matchedVersion = next.version;
		else matchedVersion = next.entry;
		res[name] = { matchedVersion };
		return res;
	}, {}) || {};
	Object.keys(remotes).forEach((key) => remotesInfo[key] = { matchedVersion: overridesKeys.includes(key) ? overrides[key] : remotes[key] });
	const { remoteEntry: { path: remoteEntryPath, name: remoteEntryName, type: remoteEntryType }, types: remoteTypes = {
		path: "",
		name: "",
		zip: "",
		api: ""
	}, buildInfo: { buildVersion }, globalName, ssrRemoteEntry } = manifest.metaData;
	const { exposes } = manifest;
	let basicRemoteSnapshot = {
		version: version ? version : "",
		buildVersion,
		globalName,
		remoteEntry: simpleJoinRemoteEntry(remoteEntryPath, remoteEntryName),
		remoteEntryType,
		remoteTypes: simpleJoinRemoteEntry(remoteTypes.path, remoteTypes.name),
		remoteTypesZip: remoteTypes.zip || "",
		remoteTypesAPI: remoteTypes.api || "",
		remotesInfo,
		shared: manifest?.shared.map((item) => ({
			assets: item.assets,
			sharedName: item.name,
			version: item.version,
			usedExports: item.referenceExports || []
		})),
		modules: exposes?.map((expose) => ({
			moduleName: expose.name,
			modulePath: expose.path,
			assets: expose.assets
		}))
	};
	if ("publicPath" in manifest.metaData) {
		remoteSnapshot = {
			...basicRemoteSnapshot,
			publicPath: getPublicPath()
		};
		if (typeof manifest.metaData.ssrPublicPath === "string") remoteSnapshot.ssrPublicPath = manifest.metaData.ssrPublicPath;
	} else remoteSnapshot = {
		...basicRemoteSnapshot,
		getPublicPath: getPublicPath()
	};
	if (ssrRemoteEntry) {
		const fullSSRRemoteEntry = simpleJoinRemoteEntry(ssrRemoteEntry.path, ssrRemoteEntry.name);
		remoteSnapshot.ssrRemoteEntry = fullSSRRemoteEntry;
		remoteSnapshot.ssrRemoteEntryType = ssrRemoteEntry.type || "commonjs-module";
	}
	return remoteSnapshot;
}
function isManifestProvider(moduleInfo) {
	if ("remoteEntry" in moduleInfo && moduleInfo.remoteEntry.includes(_constant_js__WEBPACK_IMPORTED_MODULE_0__.MANIFEST_EXT)) return true;
	else return false;
}
function getManifestFileName(manifestOptions) {
	if (!manifestOptions) return {
		statsFileName: _constant_js__WEBPACK_IMPORTED_MODULE_0__.StatsFileName,
		manifestFileName: _constant_js__WEBPACK_IMPORTED_MODULE_0__.ManifestFileName
	};
	let filePath = typeof manifestOptions === "boolean" ? "" : manifestOptions.filePath || "";
	let fileName = typeof manifestOptions === "boolean" ? "" : manifestOptions.fileName || "";
	const JSON_EXT = ".json";
	const addExt = (name) => {
		if (name.endsWith(JSON_EXT)) return name;
		return `${name}${JSON_EXT}`;
	};
	const insertSuffix = (name, suffix) => {
		return name.replace(JSON_EXT, `${suffix}${JSON_EXT}`);
	};
	const manifestFileName = fileName ? addExt(fileName) : _constant_js__WEBPACK_IMPORTED_MODULE_0__.ManifestFileName;
	return {
		statsFileName: simpleJoinRemoteEntry(filePath, fileName ? insertSuffix(manifestFileName, "-stats") : _constant_js__WEBPACK_IMPORTED_MODULE_0__.StatsFileName),
		manifestFileName: simpleJoinRemoteEntry(filePath, manifestFileName)
	};
}

//#endregion

//# sourceMappingURL=generateSnapshotFromManifest.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/index.js"
/*!***********************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/index.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BROWSER_LOG_KEY: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.BROWSER_LOG_KEY),
/* harmony export */   ENCODE_NAME_PREFIX: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.ENCODE_NAME_PREFIX),
/* harmony export */   EncodedNameTransformMap: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.EncodedNameTransformMap),
/* harmony export */   FederationModuleManifest: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.FederationModuleManifest),
/* harmony export */   MANIFEST_EXT: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.MANIFEST_EXT),
/* harmony export */   MFModuleType: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.MFModuleType),
/* harmony export */   MODULE_DEVTOOL_IDENTIFIER: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.MODULE_DEVTOOL_IDENTIFIER),
/* harmony export */   ManifestFileName: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.ManifestFileName),
/* harmony export */   NameTransformMap: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap),
/* harmony export */   NameTransformSymbol: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol),
/* harmony export */   SEPARATOR: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.SEPARATOR),
/* harmony export */   StatsFileName: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.StatsFileName),
/* harmony export */   TEMP_DIR: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.TEMP_DIR),
/* harmony export */   TreeShakingStatus: () => (/* reexport safe */ _constant_js__WEBPACK_IMPORTED_MODULE_0__.TreeShakingStatus),
/* harmony export */   assert: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.assert),
/* harmony export */   bindLoggerToCompiler: () => (/* reexport safe */ _logger_js__WEBPACK_IMPORTED_MODULE_5__.bindLoggerToCompiler),
/* harmony export */   composeKeyWithSeparator: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.composeKeyWithSeparator),
/* harmony export */   createInfrastructureLogger: () => (/* reexport safe */ _logger_js__WEBPACK_IMPORTED_MODULE_5__.createInfrastructureLogger),
/* harmony export */   createLink: () => (/* reexport safe */ _dom_js__WEBPACK_IMPORTED_MODULE_6__.createLink),
/* harmony export */   createLogger: () => (/* reexport safe */ _logger_js__WEBPACK_IMPORTED_MODULE_5__.createLogger),
/* harmony export */   createScript: () => (/* reexport safe */ _dom_js__WEBPACK_IMPORTED_MODULE_6__.createScript),
/* harmony export */   createScriptNode: () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_7__.createScriptNode),
/* harmony export */   decodeName: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.decodeName),
/* harmony export */   encodeName: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.encodeName),
/* harmony export */   error: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.error),
/* harmony export */   generateExposeFilename: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.generateExposeFilename),
/* harmony export */   generateShareFilename: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.generateShareFilename),
/* harmony export */   generateSnapshotFromManifest: () => (/* reexport safe */ _generateSnapshotFromManifest_js__WEBPACK_IMPORTED_MODULE_4__.generateSnapshotFromManifest),
/* harmony export */   getManifestFileName: () => (/* reexport safe */ _generateSnapshotFromManifest_js__WEBPACK_IMPORTED_MODULE_4__.getManifestFileName),
/* harmony export */   getProcessEnv: () => (/* reexport safe */ _env_js__WEBPACK_IMPORTED_MODULE_2__.getProcessEnv),
/* harmony export */   getResourceUrl: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceUrl),
/* harmony export */   inferAutoPublicPath: () => (/* reexport safe */ _generateSnapshotFromManifest_js__WEBPACK_IMPORTED_MODULE_4__.inferAutoPublicPath),
/* harmony export */   infrastructureLogger: () => (/* reexport safe */ _logger_js__WEBPACK_IMPORTED_MODULE_5__.infrastructureLogger),
/* harmony export */   isBrowserEnv: () => (/* reexport safe */ _env_js__WEBPACK_IMPORTED_MODULE_2__.isBrowserEnv),
/* harmony export */   isBrowserEnvValue: () => (/* reexport safe */ _env_js__WEBPACK_IMPORTED_MODULE_2__.isBrowserEnvValue),
/* harmony export */   isDebugMode: () => (/* reexport safe */ _env_js__WEBPACK_IMPORTED_MODULE_2__.isDebugMode),
/* harmony export */   isManifestProvider: () => (/* reexport safe */ _generateSnapshotFromManifest_js__WEBPACK_IMPORTED_MODULE_4__.isManifestProvider),
/* harmony export */   isReactNativeEnv: () => (/* reexport safe */ _env_js__WEBPACK_IMPORTED_MODULE_2__.isReactNativeEnv),
/* harmony export */   isRequiredVersion: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.isRequiredVersion),
/* harmony export */   isStaticResourcesEqual: () => (/* reexport safe */ _dom_js__WEBPACK_IMPORTED_MODULE_6__.isStaticResourcesEqual),
/* harmony export */   loadScript: () => (/* reexport safe */ _dom_js__WEBPACK_IMPORTED_MODULE_6__.loadScript),
/* harmony export */   loadScriptNode: () => (/* reexport safe */ _node_js__WEBPACK_IMPORTED_MODULE_7__.loadScriptNode),
/* harmony export */   logger: () => (/* reexport safe */ _logger_js__WEBPACK_IMPORTED_MODULE_5__.logger),
/* harmony export */   parseEntry: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.parseEntry),
/* harmony export */   safeToString: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.safeToString),
/* harmony export */   safeWrapper: () => (/* reexport safe */ _dom_js__WEBPACK_IMPORTED_MODULE_6__.safeWrapper),
/* harmony export */   simpleJoinRemoteEntry: () => (/* reexport safe */ _generateSnapshotFromManifest_js__WEBPACK_IMPORTED_MODULE_4__.simpleJoinRemoteEntry),
/* harmony export */   warn: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_3__.warn)
/* harmony export */ });
/* empty/unused harmony star reexport */
/* empty/unused harmony star reexport */
/* empty/unused harmony star reexport */
/* empty/unused harmony star reexport */
/* empty/unused harmony star reexport */
/* empty/unused harmony star reexport */
/* empty/unused harmony star reexport */
/* empty/unused harmony star reexport */
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant.js */ "./node_modules/@module-federation/sdk/dist/constant.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./env.js */ "./node_modules/@module-federation/sdk/dist/env.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "./node_modules/@module-federation/sdk/dist/utils.js");
/* harmony import */ var _generateSnapshotFromManifest_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./generateSnapshotFromManifest.js */ "./node_modules/@module-federation/sdk/dist/generateSnapshotFromManifest.js");
/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./logger.js */ "./node_modules/@module-federation/sdk/dist/logger.js");
/* harmony import */ var _dom_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./dom.js */ "./node_modules/@module-federation/sdk/dist/dom.js");
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./node.js */ "./node_modules/@module-federation/sdk/dist/node.js");


















/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/logger.js"
/*!************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/logger.js ***!
  \************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   bindLoggerToCompiler: () => (/* binding */ bindLoggerToCompiler),
/* harmony export */   createInfrastructureLogger: () => (/* binding */ createInfrastructureLogger),
/* harmony export */   createLogger: () => (/* binding */ createLogger),
/* harmony export */   infrastructureLogger: () => (/* binding */ infrastructureLogger),
/* harmony export */   logger: () => (/* binding */ logger)
/* harmony export */ });
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./env.js */ "./node_modules/@module-federation/sdk/dist/env.js");


//#region src/logger.ts
const PREFIX = "[ Module Federation ]";
const DEFAULT_DELEGATE = console;
const LOGGER_STACK_SKIP_TOKENS = [
	"logger.ts",
	"logger.js",
	"captureStackTrace",
	"Logger.emit",
	"Logger.log",
	"Logger.info",
	"Logger.warn",
	"Logger.error",
	"Logger.debug"
];
function captureStackTrace() {
	try {
		const stack = (/* @__PURE__ */ new Error()).stack;
		if (!stack) return;
		const [, ...rawLines] = stack.split("\n");
		const filtered = rawLines.filter((line) => !LOGGER_STACK_SKIP_TOKENS.some((token) => line.includes(token)));
		if (!filtered.length) return;
		return `Stack trace:\n${filtered.slice(0, 5).join("\n")}`;
	} catch {
		return;
	}
}
var Logger = class {
	constructor(prefix, delegate = DEFAULT_DELEGATE) {
		this.prefix = prefix;
		this.delegate = delegate ?? DEFAULT_DELEGATE;
	}
	setPrefix(prefix) {
		this.prefix = prefix;
	}
	setDelegate(delegate) {
		this.delegate = delegate ?? DEFAULT_DELEGATE;
	}
	emit(method, args) {
		const delegate = this.delegate;
		const stackTrace = (0,_env_js__WEBPACK_IMPORTED_MODULE_0__.isDebugMode)() ? captureStackTrace() : void 0;
		const enrichedArgs = stackTrace ? [...args, stackTrace] : args;
		const order = (() => {
			switch (method) {
				case "log": return ["log", "info"];
				case "info": return ["info", "log"];
				case "warn": return [
					"warn",
					"info",
					"log"
				];
				case "error": return [
					"error",
					"warn",
					"log"
				];
				default: return ["debug", "log"];
			}
		})();
		for (const candidate of order) {
			const handler = delegate[candidate];
			if (typeof handler === "function") {
				handler.call(delegate, this.prefix, ...enrichedArgs);
				return;
			}
		}
		for (const candidate of order) {
			const handler = DEFAULT_DELEGATE[candidate];
			if (typeof handler === "function") {
				handler.call(DEFAULT_DELEGATE, this.prefix, ...enrichedArgs);
				return;
			}
		}
	}
	log(...args) {
		this.emit("log", args);
	}
	warn(...args) {
		this.emit("warn", args);
	}
	error(...args) {
		this.emit("error", args);
	}
	success(...args) {
		this.emit("info", args);
	}
	info(...args) {
		this.emit("info", args);
	}
	ready(...args) {
		this.emit("info", args);
	}
	debug(...args) {
		if ((0,_env_js__WEBPACK_IMPORTED_MODULE_0__.isDebugMode)()) this.emit("debug", args);
	}
};
function createLogger(prefix) {
	return new Logger(prefix);
}
function createInfrastructureLogger(prefix) {
	const infrastructureLogger = new Logger(prefix);
	Object.defineProperty(infrastructureLogger, "__mf_infrastructure_logger__", {
		value: true,
		enumerable: false,
		configurable: false
	});
	return infrastructureLogger;
}
function bindLoggerToCompiler(loggerInstance, compiler, name) {
	if (!loggerInstance.__mf_infrastructure_logger__) return;
	if (!compiler?.getInfrastructureLogger) return;
	try {
		const infrastructureLogger = compiler.getInfrastructureLogger(name);
		if (infrastructureLogger && typeof infrastructureLogger === "object" && (typeof infrastructureLogger.log === "function" || typeof infrastructureLogger.info === "function" || typeof infrastructureLogger.warn === "function" || typeof infrastructureLogger.error === "function")) loggerInstance.setDelegate(infrastructureLogger);
	} catch {
		loggerInstance.setDelegate(void 0);
	}
}
const logger = createLogger(PREFIX);
const infrastructureLogger = createInfrastructureLogger(PREFIX);

//#endregion

//# sourceMappingURL=logger.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/node.js"
/*!**********************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/node.js ***!
  \**********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createScriptNode: () => (/* binding */ createScriptNode),
/* harmony export */   loadScriptNode: () => (/* binding */ loadScriptNode)
/* harmony export */ });
//#region src/node.ts
const sdkImportCache = /* @__PURE__ */ new Map();
function importNodeModule(name) {
	if (!name) throw new Error("import specifier is required");
	if (sdkImportCache.has(name)) return sdkImportCache.get(name);
	const promise = new Function("name", `return import(name)`)(name).then((res) => res).catch((error) => {
		console.error(`Error importing module ${name}:`, error);
		sdkImportCache.delete(name);
		throw error;
	});
	sdkImportCache.set(name, promise);
	return promise;
}
const lazyLoaderHookFetch = async (input, init, loaderHook) => {
	const hook = (url, init) => {
		return loaderHook.lifecycle.fetch.emit(url, init);
	};
	const res = await hook(input, init || {});
	if (!res || !(res instanceof Response)) return fetch(input, init || {});
	return res;
};
const createScriptNode = typeof ENV_TARGET === "undefined" || ENV_TARGET !== "web" ? (url, cb, attrs, loaderHook) => {
	if (loaderHook?.createScriptHook) {
		const hookResult = loaderHook.createScriptHook(url);
		if (hookResult && typeof hookResult === "object" && "url" in hookResult) url = hookResult.url;
	}
	let urlObj;
	try {
		urlObj = new URL(url);
	} catch (e) {
		console.error("Error constructing URL:", e);
		cb(/* @__PURE__ */ new Error(`Invalid URL: ${e}`));
		return;
	}
	const getFetch = async () => {
		if (loaderHook?.fetch) return (input, init) => lazyLoaderHookFetch(input, init, loaderHook);
		return fetch;
	};
	const handleScriptFetch = async (f, urlObj) => {
		try {
			const res = await f(urlObj.href);
			const data = await res.text();
			const [path, vm] = await Promise.all([importNodeModule("path"), importNodeModule("vm")]);
			const scriptContext = {
				exports: {},
				module: { exports: {} }
			};
			const urlDirname = urlObj.pathname.split("/").slice(0, -1).join("/");
			const filename = path.basename(urlObj.pathname);
			const script = new vm.Script(`(function(exports, module, require, __dirname, __filename) {${data}\n})`, {
				filename,
				importModuleDynamically: vm.constants?.USE_MAIN_CONTEXT_DEFAULT_LOADER ?? importNodeModule
			});
			let requireFn;
			requireFn = (await importNodeModule("node:module")).createRequire(urlObj.protocol === "file:" || urlObj.protocol === "node:" ? urlObj.href : path.join(process.cwd(), "__mf_require_base__.js"));
			script.runInThisContext()(scriptContext.exports, scriptContext.module, requireFn, urlDirname, filename);
			const exportedInterface = scriptContext.module.exports || scriptContext.exports;
			if (attrs && exportedInterface && attrs["globalName"]) {
				cb(void 0, exportedInterface[attrs["globalName"]] || exportedInterface);
				return;
			}
			cb(void 0, exportedInterface);
		} catch (e) {
			cb(e instanceof Error ? e : /* @__PURE__ */ new Error(`Script execution error: ${e}`));
		}
	};
	getFetch().then(async (f) => {
		if (attrs?.["type"] === "esm" || attrs?.["type"] === "module") return loadModule(urlObj.href, {
			fetch: f,
			vm: await importNodeModule("vm")
		}).then(async (module) => {
			await module.evaluate();
			cb(void 0, module.namespace);
		}).catch((e) => {
			cb(e instanceof Error ? e : /* @__PURE__ */ new Error(`Script execution error: ${e}`));
		});
		handleScriptFetch(f, urlObj);
	}).catch((err) => {
		cb(err);
	});
} : (url, cb, attrs, loaderHook) => {
	cb(/* @__PURE__ */ new Error("createScriptNode is disabled in non-Node.js environment"));
};
const loadScriptNode = typeof ENV_TARGET === "undefined" || ENV_TARGET !== "web" ? (url, info) => {
	return new Promise((resolve, reject) => {
		createScriptNode(url, (error, scriptContext) => {
			if (error) reject(error);
			else {
				const remoteEntryKey = info?.attrs?.["globalName"] || `__FEDERATION_${info?.attrs?.["name"]}:custom__`;
				resolve(globalThis[remoteEntryKey] = scriptContext);
			}
		}, info.attrs, info.loaderHook);
	});
} : (url, info) => {
	throw new Error("loadScriptNode is disabled in non-Node.js environment");
};
const esmModuleCache = /* @__PURE__ */ new Map();
const isFetchableRemoteModuleUrl = (url) => url.startsWith("http:") || url.startsWith("https:");
const isBareModuleSpecifier = (specifier) => !specifier.startsWith("./") && !specifier.startsWith("../") && !specifier.startsWith("/") && !specifier.includes(":");
function encodeRemoteModulePath(url) {
	const remoteUrl = new URL(url);
	const encodedProtocol = encodeURIComponent(remoteUrl.protocol.slice(0, -1));
	const encodedHost = encodeURIComponent(remoteUrl.host);
	const encodedPathname = remoteUrl.pathname.split("/").map((segment) => encodeURIComponent(segment)).join("/");
	const encodedSearchHash = encodeURIComponent(`${remoteUrl.search}${remoteUrl.hash}`);
	return `/${encodedProtocol}/${encodedHost}${encodedPathname}${encodedSearchHash ? `/${encodedSearchHash}` : ""}`;
}
function createImportMetaUrl(url, baseFileUrl) {
	const baseUrl = baseFileUrl.endsWith("/") ? baseFileUrl : `${baseFileUrl}/`;
	return new URL(`__module_federation_remote__${encodeRemoteModulePath(url)}`, baseUrl).href;
}
async function isNodeBuiltinSpecifier(specifier) {
	if (specifier.startsWith("node:")) return true;
	if (!isBareModuleSpecifier(specifier)) return false;
	return (await importNodeModule("node:module")).builtinModules.includes(specifier);
}
function getSyntheticModuleExports(moduleExports) {
	const namespaceObject = moduleExports && (typeof moduleExports === "object" || typeof moduleExports === "function") ? moduleExports : { default: moduleExports };
	const effectiveExports = { ...namespaceObject };
	if (!Object.prototype.hasOwnProperty.call(effectiveExports, "default")) effectiveExports.default = namespaceObject;
	return effectiveExports;
}
async function createSyntheticModuleFromExports(identifier, moduleExports, vm) {
	if (typeof vm.SyntheticModule !== "function") throw new Error("vm.SyntheticModule is required to load Node.js built-in modules in ESM remote entries.");
	const effectiveExports = getSyntheticModuleExports(moduleExports);
	const exportNames = Object.keys(effectiveExports);
	const syntheticModule = new vm.SyntheticModule(exportNames, function setSyntheticModuleExports() {
		for (const name of exportNames) this.setExport(name, effectiveExports[name]);
	}, { identifier });
	esmModuleCache.set(identifier, syntheticModule);
	await syntheticModule.link(async () => {
		throw new Error(`Node.js built-in module "${identifier}" should not request child modules.`);
	});
	await syntheticModule.evaluate();
	return syntheticModule;
}
async function loadNodeBuiltinModule(specifier, vm) {
	const cacheKey = `node-builtin:${specifier}`;
	if (esmModuleCache.has(cacheKey)) return esmModuleCache.get(cacheKey);
	return createSyntheticModuleFromExports(cacheKey, await importNodeModule(specifier), vm);
}
async function loadResolvedModule(specifier, parentUrl, options) {
	if (await isNodeBuiltinSpecifier(specifier)) return loadNodeBuiltinModule(specifier, options.vm);
	if (isBareModuleSpecifier(specifier)) throw new Error(`Unsupported ESM module specifier "${specifier}". Only relative or absolute http(s) remote modules and Node.js built-in modules are supported.`);
	const resolvedUrl = new URL(specifier, parentUrl).href;
	if (!isFetchableRemoteModuleUrl(resolvedUrl)) throw new Error(`Unsupported ESM module specifier "${specifier}" resolved to "${resolvedUrl}". Only http(s) remote modules and Node.js built-in modules are supported.`);
	return loadModule(resolvedUrl, options);
}
async function evaluateDynamicModule(module) {
	if (module.status === "linked") await module.evaluate();
	if (module.status === "errored") throw module.error;
	return module;
}
async function loadModule(url, options) {
	if (esmModuleCache.has(url)) return esmModuleCache.get(url);
	const { fetch, vm } = options;
	if (!isFetchableRemoteModuleUrl(url)) throw new Error(`Unsupported ESM module URL "${url}". Only http(s) remote modules and Node.js built-in modules are supported.`);
	const code = await (await fetch(url)).text();
	const cwdFileUrl = (await importNodeModule("node:url")).pathToFileURL(process.cwd()).href;
	const sourceTextModule = new vm.SourceTextModule(code, {
		identifier: url,
		initializeImportMeta: (meta) => {
			meta.url = createImportMetaUrl(url, cwdFileUrl);
		},
		importModuleDynamically: async (specifier) => {
			return evaluateDynamicModule(await loadResolvedModule(specifier, url, options));
		}
	});
	esmModuleCache.set(url, sourceTextModule);
	await sourceTextModule.link(async (specifier) => {
		return loadResolvedModule(specifier, url, options);
	});
	return sourceTextModule;
}

//#endregion

//# sourceMappingURL=node.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/normalizeOptions.js"
/*!**********************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/normalizeOptions.js ***!
  \**********************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   normalizeOptions: () => (/* binding */ normalizeOptions)
/* harmony export */ });
//#region src/normalizeOptions.ts
function normalizeOptions(enableDefault, defaultOptions, key) {
	return function(options) {
		if (options === false) return false;
		if (typeof options === "undefined") if (enableDefault) return defaultOptions;
		else return false;
		if (options === true) return defaultOptions;
		if (options && typeof options === "object") return {
			...defaultOptions,
			...options
		};
		throw new Error(`Unexpected type for \`${key}\`, expect boolean/undefined/object, got: ${typeof options}`);
	};
}

//#endregion

//# sourceMappingURL=normalizeOptions.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/types/plugins/ConsumeSharedPlugin.js"
/*!***************************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/types/plugins/ConsumeSharedPlugin.js ***!
  \***************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConsumeSharedPlugin_exports: () => (/* binding */ ConsumeSharedPlugin_exports)
/* harmony export */ });
/* harmony import */ var _virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_virtual/_rolldown/runtime.js */ "./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js");


//#region src/types/plugins/ConsumeSharedPlugin.ts
var ConsumeSharedPlugin_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__.__exportAll)({});

//#endregion

//# sourceMappingURL=ConsumeSharedPlugin.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/types/plugins/ContainerPlugin.js"
/*!***********************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/types/plugins/ContainerPlugin.js ***!
  \***********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContainerPlugin_exports: () => (/* binding */ ContainerPlugin_exports)
/* harmony export */ });
/* harmony import */ var _virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_virtual/_rolldown/runtime.js */ "./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js");


//#region src/types/plugins/ContainerPlugin.ts
var ContainerPlugin_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__.__exportAll)({});

//#endregion

//# sourceMappingURL=ContainerPlugin.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/types/plugins/ContainerReferencePlugin.js"
/*!********************************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/types/plugins/ContainerReferencePlugin.js ***!
  \********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContainerReferencePlugin_exports: () => (/* binding */ ContainerReferencePlugin_exports)
/* harmony export */ });
/* harmony import */ var _virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_virtual/_rolldown/runtime.js */ "./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js");


//#region src/types/plugins/ContainerReferencePlugin.ts
var ContainerReferencePlugin_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__.__exportAll)({});

//#endregion

//# sourceMappingURL=ContainerReferencePlugin.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/types/plugins/ModuleFederationPlugin.js"
/*!******************************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/types/plugins/ModuleFederationPlugin.js ***!
  \******************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModuleFederationPlugin_exports: () => (/* binding */ ModuleFederationPlugin_exports)
/* harmony export */ });
/* harmony import */ var _virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_virtual/_rolldown/runtime.js */ "./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js");


//#region src/types/plugins/ModuleFederationPlugin.ts
var ModuleFederationPlugin_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__.__exportAll)({});

//#endregion

//# sourceMappingURL=ModuleFederationPlugin.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/types/plugins/ProvideSharedPlugin.js"
/*!***************************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/types/plugins/ProvideSharedPlugin.js ***!
  \***************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProvideSharedPlugin_exports: () => (/* binding */ ProvideSharedPlugin_exports)
/* harmony export */ });
/* harmony import */ var _virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_virtual/_rolldown/runtime.js */ "./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js");


//#region src/types/plugins/ProvideSharedPlugin.ts
var ProvideSharedPlugin_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__.__exportAll)({});

//#endregion

//# sourceMappingURL=ProvideSharedPlugin.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/types/plugins/SharePlugin.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/types/plugins/SharePlugin.js ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SharePlugin_exports: () => (/* binding */ SharePlugin_exports)
/* harmony export */ });
/* harmony import */ var _virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../_virtual/_rolldown/runtime.js */ "./node_modules/@module-federation/sdk/dist/_virtual/_rolldown/runtime.js");


//#region src/types/plugins/SharePlugin.ts
var SharePlugin_exports = /* @__PURE__ */ (0,_virtual_rolldown_runtime_js__WEBPACK_IMPORTED_MODULE_0__.__exportAll)({});

//#endregion

//# sourceMappingURL=SharePlugin.js.map

/***/ },

/***/ "./node_modules/@module-federation/sdk/dist/utils.js"
/*!***********************************************************!*\
  !*** ./node_modules/@module-federation/sdk/dist/utils.js ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert),
/* harmony export */   composeKeyWithSeparator: () => (/* binding */ composeKeyWithSeparator),
/* harmony export */   decodeName: () => (/* binding */ decodeName),
/* harmony export */   encodeName: () => (/* binding */ encodeName),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   generateExposeFilename: () => (/* binding */ generateExposeFilename),
/* harmony export */   generateShareFilename: () => (/* binding */ generateShareFilename),
/* harmony export */   getResourceUrl: () => (/* binding */ getResourceUrl),
/* harmony export */   isRequiredVersion: () => (/* binding */ isRequiredVersion),
/* harmony export */   parseEntry: () => (/* binding */ parseEntry),
/* harmony export */   safeToString: () => (/* binding */ safeToString),
/* harmony export */   warn: () => (/* binding */ warn)
/* harmony export */ });
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constant.js */ "./node_modules/@module-federation/sdk/dist/constant.js");
/* harmony import */ var _env_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./env.js */ "./node_modules/@module-federation/sdk/dist/env.js");



//#region src/utils.ts
const LOG_CATEGORY = "[ Federation Runtime ]";
const parseEntry = (str, devVerOrUrl, separator = _constant_js__WEBPACK_IMPORTED_MODULE_0__.SEPARATOR) => {
	const strSplit = str.split(separator);
	const devVersionOrUrl = (0,_env_js__WEBPACK_IMPORTED_MODULE_1__.getProcessEnv)()["NODE_ENV"] === "development" && devVerOrUrl;
	const defaultVersion = "*";
	const isEntry = (s) => s.startsWith("http") || s.includes(_constant_js__WEBPACK_IMPORTED_MODULE_0__.MANIFEST_EXT);
	if (strSplit.length >= 2) {
		let [name, ...versionOrEntryArr] = strSplit;
		if (str.startsWith(separator)) {
			name = strSplit.slice(0, 2).join(separator);
			versionOrEntryArr = [devVersionOrUrl || strSplit.slice(2).join(separator)];
		}
		let versionOrEntry = devVersionOrUrl || versionOrEntryArr.join(separator);
		if (isEntry(versionOrEntry)) return {
			name,
			entry: versionOrEntry
		};
		else return {
			name,
			version: versionOrEntry || defaultVersion
		};
	} else if (strSplit.length === 1) {
		const [name] = strSplit;
		if (devVersionOrUrl && isEntry(devVersionOrUrl)) return {
			name,
			entry: devVersionOrUrl
		};
		return {
			name,
			version: devVersionOrUrl || defaultVersion
		};
	} else throw `Invalid entry value: ${str}`;
};
const composeKeyWithSeparator = function(...args) {
	if (!args.length) return "";
	return args.reduce((sum, cur) => {
		if (!cur) return sum;
		if (!sum) return cur;
		return `${sum}${_constant_js__WEBPACK_IMPORTED_MODULE_0__.SEPARATOR}${cur}`;
	}, "");
};
const encodeName = function(name, prefix = "", withExt = false) {
	try {
		const ext = withExt ? ".js" : "";
		return `${prefix}${name.replace(new RegExp(`${_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.AT}`, "g"), _constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.AT]).replace(new RegExp(`${_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.HYPHEN}`, "g"), _constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.HYPHEN]).replace(new RegExp(`${_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.SLASH}`, "g"), _constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.SLASH])}${ext}`;
	} catch (err) {
		throw err;
	}
};
const decodeName = function(name, prefix, withExt) {
	try {
		let decodedName = name;
		if (prefix) {
			if (!decodedName.startsWith(prefix)) return decodedName;
			decodedName = decodedName.replace(new RegExp(prefix, "g"), "");
		}
		decodedName = decodedName.replace(new RegExp(`${_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.AT]}`, "g"), _constant_js__WEBPACK_IMPORTED_MODULE_0__.EncodedNameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.AT]]).replace(new RegExp(`${_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.SLASH]}`, "g"), _constant_js__WEBPACK_IMPORTED_MODULE_0__.EncodedNameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.SLASH]]).replace(new RegExp(`${_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.HYPHEN]}`, "g"), _constant_js__WEBPACK_IMPORTED_MODULE_0__.EncodedNameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformMap[_constant_js__WEBPACK_IMPORTED_MODULE_0__.NameTransformSymbol.HYPHEN]]);
		if (withExt) decodedName = decodedName.replace(".js", "");
		return decodedName;
	} catch (err) {
		throw err;
	}
};
const generateExposeFilename = (exposeName, withExt) => {
	if (!exposeName) return "";
	let expose = exposeName;
	if (expose === ".") expose = "default_export";
	if (expose.startsWith("./")) expose = expose.replace("./", "");
	return encodeName(expose, "__federation_expose_", withExt);
};
const generateShareFilename = (pkgName, withExt) => {
	if (!pkgName) return "";
	return encodeName(pkgName, "__federation_shared_", withExt);
};
function getResourceUrl(module, sourceUrl) {
	if ("getPublicPath" in module) {
		let publicPath;
		if (!module.getPublicPath.startsWith("function")) publicPath = new Function(module.getPublicPath)();
		else publicPath = new Function("return " + module.getPublicPath)()();
		return `${publicPath}${sourceUrl}`;
	} else if ("publicPath" in module) {
		if (!(0,_env_js__WEBPACK_IMPORTED_MODULE_1__.isBrowserEnv)() && !(0,_env_js__WEBPACK_IMPORTED_MODULE_1__.isReactNativeEnv)() && "ssrPublicPath" in module && typeof module.ssrPublicPath === "string") return `${module.ssrPublicPath}${sourceUrl}`;
		return `${module.publicPath}${sourceUrl}`;
	} else {
		console.warn("Cannot get resource URL. If in debug mode, please ignore.", module, sourceUrl);
		return "";
	}
}
const assert = (condition, msg) => {
	if (!condition) error(msg);
};
const error = (msg) => {
	throw new Error(`${LOG_CATEGORY}: ${msg}`);
};
const warn = (msg) => {
	console.warn(`${LOG_CATEGORY}: ${msg}`);
};
function safeToString(info) {
	try {
		return JSON.stringify(info, null, 2);
	} catch (e) {
		return "";
	}
}
const VERSION_PATTERN_REGEXP = /^([\d^=v<>~]|[*xX]$)/;
function isRequiredVersion(str) {
	return VERSION_PATTERN_REGEXP.test(str);
}

//#endregion

//# sourceMappingURL=utils.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js"
/*!*********************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js ***!
  \*********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachShareScopeMap: () => (/* binding */ attachShareScopeMap)
/* harmony export */ });
//#region src/attachShareScopeMap.ts
function attachShareScopeMap(webpackRequire) {
	if (!webpackRequire.S || webpackRequire.federation.hasAttachShareScopeMap || !webpackRequire.federation.instance || !webpackRequire.federation.instance.shareScopeMap) return;
	webpackRequire.S = webpackRequire.federation.instance.shareScopeMap;
	webpackRequire.federation.hasAttachShareScopeMap = true;
}

//#endregion

//# sourceMappingURL=attachShareScopeMap.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/bundler.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/bundler.js ***!
  \*********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachShareScopeMap: () => (/* reexport safe */ _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__.attachShareScopeMap),
/* harmony export */   bundlerRuntime: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.bundlerRuntime),
/* harmony export */   bundlerRuntimeOptions: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.bundlerRuntimeOptions),
/* harmony export */   "default": () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   initOptions: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.initOptions),
/* harmony export */   instance: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.instance),
/* harmony export */   runtime: () => (/* reexport safe */ _index_js__WEBPACK_IMPORTED_MODULE_1__.runtime)
/* harmony export */ });
/* harmony import */ var _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attachShareScopeMap.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js");
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./index.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/index.js");





/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/constant.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/constant.js ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FEDERATION_SUPPORTED_TYPES: () => (/* binding */ FEDERATION_SUPPORTED_TYPES)
/* harmony export */ });
//#region src/constant.ts
const FEDERATION_SUPPORTED_TYPES = ["script"];

//#endregion

//# sourceMappingURL=constant.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/consumes.js"
/*!**********************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/consumes.js ***!
  \**********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   consumes: () => (/* binding */ consumes)
/* harmony export */ });
/* harmony import */ var _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attachShareScopeMap.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js");
/* harmony import */ var _updateOptions_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./updateOptions.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/updateOptions.js");
/* harmony import */ var _getUsedExports_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getUsedExports.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/getUsedExports.js");
/* harmony import */ var _error_codes_dist_error_codes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./error-codes/dist/error-codes.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/error-codes.js");
/* harmony import */ var _error_codes_dist_getShortErrorMsg_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./error-codes/dist/getShortErrorMsg.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/getShortErrorMsg.js");






//#region src/consumes.ts
function consumes(options) {
	(0,_updateOptions_js__WEBPACK_IMPORTED_MODULE_1__.updateConsumeOptions)(options);
	const { chunkId, promises, installedModules, webpackRequire, chunkMapping, moduleToHandlerMapping } = options;
	(0,_attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__.attachShareScopeMap)(webpackRequire);
	if (webpackRequire.o(chunkMapping, chunkId)) chunkMapping[chunkId].forEach((id) => {
		if (webpackRequire.o(installedModules, id)) return promises.push(installedModules[id]);
		const onFactory = (factory) => {
			installedModules[id] = 0;
			webpackRequire.m[id] = (module) => {
				delete webpackRequire.c[id];
				const result = factory();
				const { shareInfo } = moduleToHandlerMapping[id];
				if (shareInfo?.shareConfig?.layer && result && typeof result === "object") try {
					if (!result.hasOwnProperty("layer") || result.layer === void 0) result.layer = shareInfo.shareConfig.layer;
				} catch (e) {}
				module.exports = result;
			};
		};
		const onError = (error) => {
			delete installedModules[id];
			webpackRequire.m[id] = (module) => {
				delete webpackRequire.c[id];
				throw error;
			};
		};
		try {
			const federationInstance = webpackRequire.federation.instance;
			if (!federationInstance) throw new Error("Federation instance not found!");
			const { shareKey, getter, shareInfo, treeShakingGetter } = moduleToHandlerMapping[id];
			const usedExports = (0,_getUsedExports_js__WEBPACK_IMPORTED_MODULE_2__.getUsedExports)(webpackRequire, shareKey);
			const customShareInfo = { ...shareInfo };
			if (Array.isArray(customShareInfo.scope) && Array.isArray(customShareInfo.scope[0])) customShareInfo.scope = customShareInfo.scope[0];
			if (usedExports) customShareInfo.treeShaking = {
				usedExports,
				useIn: [federationInstance.options.name]
			};
			const promise = federationInstance.loadShare(shareKey, {
				customShareInfo,
				context: {
					trigger: "build",
					moduleId: id,
					chunkId
				}
			}).then((factory) => {
				if (factory === false) {
					if (typeof getter !== "function") throw new Error((0,_error_codes_dist_getShortErrorMsg_js__WEBPACK_IMPORTED_MODULE_4__.getShortErrorMsg)(_error_codes_dist_error_codes_js__WEBPACK_IMPORTED_MODULE_3__.RUNTIME_012, { [_error_codes_dist_error_codes_js__WEBPACK_IMPORTED_MODULE_3__.RUNTIME_012]: "The getter for the shared module is not a function. This may be caused by setting \"shared.import: false\" without the host providing the corresponding lib." }, { shareKey }));
					return treeShakingGetter?.() || getter();
				}
				return factory;
			});
			if (promise.then) promises.push(installedModules[id] = promise.then(onFactory).catch(onError));
			else onFactory(promise);
		} catch (e) {
			onError(e);
		}
	});
}

//#endregion

//# sourceMappingURL=consumes.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/error-codes.js"
/*!******************************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/error-codes.js ***!
  \******************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RUNTIME_012: () => (/* binding */ RUNTIME_012)
/* harmony export */ });
//#region ../error-codes/dist/error-codes.mjs
const RUNTIME_012 = "RUNTIME-012";

//#endregion

//# sourceMappingURL=error-codes.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/getShortErrorMsg.js"
/*!***********************************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/error-codes/dist/getShortErrorMsg.js ***!
  \***********************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getShortErrorMsg: () => (/* binding */ getShortErrorMsg)
/* harmony export */ });
//#region ../error-codes/dist/getShortErrorMsg.mjs
const getDocsUrl = (errorCode) => {
	return `View the docs to see how to solve: https://module-federation.io/guide/troubleshooting/${errorCode.split("-")[0].toLowerCase()}#${errorCode.toLowerCase()}`;
};
const getShortErrorMsg = (errorCode, errorDescMap, args, originalErrorMsg) => {
	const msg = [`${[errorDescMap[errorCode]]} #${errorCode}`];
	args && msg.push(`args: ${JSON.stringify(args)}`);
	msg.push(getDocsUrl(errorCode));
	originalErrorMsg && msg.push(`Original Error Message:\n ${originalErrorMsg}`);
	return msg.join("\n");
};

//#endregion

//# sourceMappingURL=getShortErrorMsg.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/getSharedFallbackGetter.js"
/*!*************************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/getSharedFallbackGetter.js ***!
  \*************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getSharedFallbackGetter: () => (/* binding */ getSharedFallbackGetter)
/* harmony export */ });
//#region src/getSharedFallbackGetter.ts
const getSharedFallbackGetter = ({ shareKey, factory, version, webpackRequire, libraryType = "global" }) => {
	const { runtime, instance, bundlerRuntime, sharedFallback } = webpackRequire.federation;
	if (!sharedFallback) return factory;
	const fallbackItems = sharedFallback[shareKey];
	if (!fallbackItems) return factory;
	const fallbackItem = version ? fallbackItems.find((item) => item[1] === version) : fallbackItems[0];
	if (!fallbackItem) throw new Error(`No fallback item found for shareKey: ${shareKey} and version: ${version}`);
	return () => runtime.getRemoteEntry({
		origin: webpackRequire.federation.instance,
		remoteInfo: {
			name: fallbackItem[2],
			entry: `${webpackRequire.p}${fallbackItem[0]}`,
			type: libraryType,
			entryGlobalName: fallbackItem[2],
			shareScope: "default"
		}
	}).then((shareEntry) => {
		if (!shareEntry) throw new Error(`Failed to load fallback entry for shareKey: ${shareKey} and version: ${version}`);
		return shareEntry.init(webpackRequire.federation.instance, bundlerRuntime).then(() => shareEntry.get());
	});
};

//#endregion

//# sourceMappingURL=getSharedFallbackGetter.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/getUsedExports.js"
/*!****************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/getUsedExports.js ***!
  \****************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getUsedExports: () => (/* binding */ getUsedExports)
/* harmony export */ });
//#region src/getUsedExports.ts
function getUsedExports(webpackRequire, sharedName) {
	const usedExports = webpackRequire.federation.usedExports;
	if (!usedExports) return;
	return usedExports[sharedName];
}

//#endregion

//# sourceMappingURL=getUsedExports.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/index.js"
/*!*******************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/index.js ***!
  \*******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   attachShareScopeMap: () => (/* reexport safe */ _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__.attachShareScopeMap),
/* harmony export */   bundlerRuntime: () => (/* binding */ bundlerRuntime),
/* harmony export */   bundlerRuntimeOptions: () => (/* binding */ bundlerRuntimeOptions),
/* harmony export */   "default": () => (/* binding */ federation),
/* harmony export */   initOptions: () => (/* binding */ initOptions),
/* harmony export */   instance: () => (/* binding */ instance),
/* harmony export */   runtime: () => (/* reexport module object */ _module_federation_runtime__WEBPACK_IMPORTED_MODULE_8__)
/* harmony export */ });
/* harmony import */ var _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attachShareScopeMap.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js");
/* harmony import */ var _remotes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./remotes.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/remotes.js");
/* harmony import */ var _consumes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./consumes.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/consumes.js");
/* harmony import */ var _initializeSharing_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./initializeSharing.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/initializeSharing.js");
/* harmony import */ var _installInitialConsumes_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./installInitialConsumes.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/installInitialConsumes.js");
/* harmony import */ var _initContainerEntry_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./initContainerEntry.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/initContainerEntry.js");
/* harmony import */ var _init_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./init.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/init.js");
/* harmony import */ var _getSharedFallbackGetter_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./getSharedFallbackGetter.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/getSharedFallbackGetter.js");
/* harmony import */ var _module_federation_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @module-federation/runtime */ "./node_modules/@module-federation/runtime/dist/bundler.js");










//#region src/index.ts
const USE_REMOTE =  true ? !false : 0;
const USE_SHARED =  true ? !false : 0;
const bundlerRuntime = {
	remotes: USE_REMOTE ? _remotes_js__WEBPACK_IMPORTED_MODULE_1__.remotes : void 0,
	consumes: USE_SHARED ? _consumes_js__WEBPACK_IMPORTED_MODULE_2__.consumes : void 0,
	I: USE_SHARED ? _initializeSharing_js__WEBPACK_IMPORTED_MODULE_3__.initializeSharing : void 0,
	S: {},
	installInitialConsumes: USE_SHARED ? _installInitialConsumes_js__WEBPACK_IMPORTED_MODULE_4__.installInitialConsumes : void 0,
	initContainerEntry: ( true) ? _initContainerEntry_js__WEBPACK_IMPORTED_MODULE_5__.initContainerEntry : 0,
	init: _init_js__WEBPACK_IMPORTED_MODULE_6__.init,
	getSharedFallbackGetter: USE_SHARED ? _getSharedFallbackGetter_js__WEBPACK_IMPORTED_MODULE_7__.getSharedFallbackGetter : void 0
};
const federation = {
	runtime: _module_federation_runtime__WEBPACK_IMPORTED_MODULE_8__,
	instance: void 0,
	initOptions: void 0,
	bundlerRuntime,
	attachShareScopeMap: _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__.attachShareScopeMap,
	bundlerRuntimeOptions: {}
};
const instance = federation.instance;
const initOptions = federation.initOptions;
const bundlerRuntimeOptions = federation.bundlerRuntimeOptions;

//#endregion

//# sourceMappingURL=index.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/init.js"
/*!******************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/init.js ***!
  \******************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   init: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _module_federation_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @module-federation/runtime */ "./node_modules/@module-federation/runtime/dist/bundler.js");
/* harmony import */ var _module_federation_runtime_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @module-federation/runtime/helpers */ "./node_modules/@module-federation/runtime/dist/helpers.js");



//#region src/init.ts
const USE_SHARED =  true ? !false : 0;
function init({ webpackRequire }) {
	const { initOptions, runtime, sharedFallback, bundlerRuntime, libraryType } = webpackRequire.federation;
	if (!initOptions) throw new Error("initOptions is required!");
	if (USE_SHARED) {
		const treeShakingSharePlugin = function() {
			return {
				name: "tree-shake-plugin",
				beforeInit(args) {
					const { userOptions, origin, options: registeredOptions } = args;
					const version = userOptions.version || registeredOptions.version;
					if (!sharedFallback) return args;
					const currentShared = userOptions.shared || {};
					const shared = [];
					Object.keys(currentShared).forEach((sharedName) => {
						(Array.isArray(currentShared[sharedName]) ? currentShared[sharedName] : [currentShared[sharedName]]).forEach((sharedArg) => {
							shared.push([sharedName, sharedArg]);
							if ("get" in sharedArg) {
								sharedArg.treeShaking ||= {};
								sharedArg.treeShaking.get = sharedArg.get;
								sharedArg.get = bundlerRuntime.getSharedFallbackGetter({
									shareKey: sharedName,
									factory: sharedArg.get,
									webpackRequire,
									libraryType,
									version: sharedArg.version
								});
							}
						});
					});
					const hostGlobalSnapshot = _module_federation_runtime_helpers__WEBPACK_IMPORTED_MODULE_1__["default"].global.getGlobalSnapshotInfoByModuleInfo({
						name: origin.name,
						version
					});
					if (!hostGlobalSnapshot || !("shared" in hostGlobalSnapshot)) return args;
					Object.keys(registeredOptions.shared || {}).forEach((pkgName) => {
						registeredOptions.shared[pkgName].forEach((sharedArg) => {
							shared.push([pkgName, sharedArg]);
						});
					});
					const patchShared = (pkgName, shared) => {
						const shareSnapshot = hostGlobalSnapshot.shared.find((item) => item.sharedName === pkgName);
						if (!shareSnapshot) return;
						const { treeShaking } = shared;
						if (!treeShaking) return;
						const { secondarySharedTreeShakingName, secondarySharedTreeShakingEntry, treeShakingStatus } = shareSnapshot;
						if (treeShaking.status === treeShakingStatus) return;
						treeShaking.status = treeShakingStatus;
						if (secondarySharedTreeShakingEntry && libraryType && secondarySharedTreeShakingName) treeShaking.get = async () => {
							const shareEntry = await (0,_module_federation_runtime__WEBPACK_IMPORTED_MODULE_0__.getRemoteEntry)({
								origin,
								remoteInfo: {
									name: secondarySharedTreeShakingName,
									entry: secondarySharedTreeShakingEntry,
									type: libraryType,
									entryGlobalName: secondarySharedTreeShakingName,
									shareScope: "default"
								}
							});
							await shareEntry.init(origin, __webpack_require__.federation.bundlerRuntime);
							return shareEntry.get();
						};
					};
					shared.forEach(([pkgName, sharedArg]) => {
						patchShared(pkgName, sharedArg);
					});
					return args;
				}
			};
		};
		initOptions.plugins ||= [];
		initOptions.plugins.push(treeShakingSharePlugin());
	}
	return runtime.init(initOptions);
}

//#endregion

//# sourceMappingURL=init.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/initContainerEntry.js"
/*!********************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/initContainerEntry.js ***!
  \********************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initContainerEntry: () => (/* binding */ initContainerEntry)
/* harmony export */ });
//#region src/initContainerEntry.ts
function initContainerEntry(options) {
	const { webpackRequire, shareScope, initScope, shareScopeKey, remoteEntryInitOptions } = options;
	if (!webpackRequire.S) return;
	if (!webpackRequire.federation || !webpackRequire.federation.instance || !webpackRequire.federation.initOptions) return;
	const federationInstance = webpackRequire.federation.instance;
	federationInstance.initOptions({
		name: webpackRequire.federation.initOptions.name,
		remotes: [],
		...remoteEntryInitOptions
	});
	const hostShareScopeKeys = remoteEntryInitOptions?.shareScopeKeys;
	const hostShareScopeMap = remoteEntryInitOptions?.shareScopeMap;
	if (!shareScopeKey || typeof shareScopeKey === "string") {
		const key = shareScopeKey || "default";
		if (Array.isArray(hostShareScopeKeys)) hostShareScopeKeys.forEach((hostKey) => {
			if (!hostShareScopeMap[hostKey]) hostShareScopeMap[hostKey] = {};
			const sc = hostShareScopeMap[hostKey];
			federationInstance.initShareScopeMap(hostKey, sc, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
		});
		else federationInstance.initShareScopeMap(key, shareScope, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
	} else shareScopeKey.forEach((key) => {
		if (!hostShareScopeKeys || !hostShareScopeMap) {
			federationInstance.initShareScopeMap(key, shareScope, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
			return;
		}
		if (!hostShareScopeMap[key]) hostShareScopeMap[key] = {};
		const sc = hostShareScopeMap[key];
		federationInstance.initShareScopeMap(key, sc, { hostShareScopeMap: remoteEntryInitOptions?.shareScopeMap || {} });
	});
	if (webpackRequire.federation.attachShareScopeMap) webpackRequire.federation.attachShareScopeMap(webpackRequire);
	if (!Array.isArray(shareScopeKey)) return webpackRequire.I(shareScopeKey || "default", initScope);
	if (Boolean(webpackRequire.federation.initOptions.shared)) return webpackRequire.I(shareScopeKey, initScope);
	return Promise.all(shareScopeKey.map((key) => {
		return webpackRequire.I(key, initScope);
	})).then(() => true);
}

//#endregion

//# sourceMappingURL=initContainerEntry.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/initializeSharing.js"
/*!*******************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/initializeSharing.js ***!
  \*******************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   initializeSharing: () => (/* binding */ initializeSharing)
/* harmony export */ });
/* harmony import */ var _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attachShareScopeMap.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/constant.js");



//#region src/initializeSharing.ts
function initializeSharing({ shareScopeName, webpackRequire, initPromises, initTokens, initScope }) {
	const shareScopeKeys = Array.isArray(shareScopeName) ? shareScopeName : [shareScopeName];
	var initializeSharingPromises = [];
	var _initializeSharing = function(shareScopeKey) {
		if (!initScope) initScope = [];
		const mfInstance = webpackRequire.federation.instance;
		var initToken = initTokens[shareScopeKey];
		if (!initToken) initToken = initTokens[shareScopeKey] = { from: mfInstance.name };
		if (initScope.indexOf(initToken) >= 0) return;
		initScope.push(initToken);
		const promise = initPromises[shareScopeKey];
		if (promise) return promise;
		var warn = (msg) => typeof console !== "undefined" && console.warn && console.warn(msg);
		var initExternal = (id) => {
			var handleError = (err) => warn("Initialization of sharing external failed: " + err);
			try {
				var module = webpackRequire(id);
				if (!module) return;
				var initFn = (module) => module && module.init && module.init(webpackRequire.S[shareScopeKey], initScope, {
					shareScopeMap: webpackRequire.S || {},
					shareScopeKeys: shareScopeName
				});
				if (module.then) return promises.push(module.then(initFn, handleError));
				var initResult = initFn(module);
				if (initResult && typeof initResult !== "boolean" && initResult.then) return promises.push(initResult["catch"](handleError));
			} catch (err) {
				handleError(err);
			}
		};
		const promises = mfInstance.initializeSharing(shareScopeKey, {
			strategy: mfInstance.options.shareStrategy,
			initScope,
			from: "build"
		});
		(0,_attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__.attachShareScopeMap)(webpackRequire);
		const bundlerRuntimeRemotesOptions = webpackRequire.federation.bundlerRuntimeOptions.remotes;
		if (bundlerRuntimeRemotesOptions) Object.keys(bundlerRuntimeRemotesOptions.idToRemoteMap).forEach((moduleId) => {
			const info = bundlerRuntimeRemotesOptions.idToRemoteMap[moduleId];
			const externalModuleId = bundlerRuntimeRemotesOptions.idToExternalAndNameMapping[moduleId][2];
			if (info.length > 1) initExternal(externalModuleId);
			else if (info.length === 1) {
				const remoteInfo = info[0];
				if (!_constant_js__WEBPACK_IMPORTED_MODULE_1__.FEDERATION_SUPPORTED_TYPES.includes(remoteInfo.externalType)) initExternal(externalModuleId);
			}
		});
		if (!promises.length) return initPromises[shareScopeKey] = true;
		return initPromises[shareScopeKey] = Promise.all(promises).then(() => initPromises[shareScopeKey] = true);
	};
	shareScopeKeys.forEach((key) => {
		initializeSharingPromises.push(_initializeSharing(key));
	});
	return Promise.all(initializeSharingPromises).then(() => true);
}

//#endregion

//# sourceMappingURL=initializeSharing.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/installInitialConsumes.js"
/*!************************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/installInitialConsumes.js ***!
  \************************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   installInitialConsumes: () => (/* binding */ installInitialConsumes)
/* harmony export */ });
/* harmony import */ var _updateOptions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./updateOptions.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/updateOptions.js");
/* harmony import */ var _getUsedExports_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getUsedExports.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/getUsedExports.js");



//#region src/installInitialConsumes.ts
function handleInitialConsumes(options) {
	const { moduleId, moduleToHandlerMapping, webpackRequire, asyncLoad } = options;
	const federationInstance = webpackRequire.federation.instance;
	if (!federationInstance) throw new Error("Federation instance not found!");
	const { shareKey, shareInfo } = moduleToHandlerMapping[moduleId];
	try {
		const usedExports = (0,_getUsedExports_js__WEBPACK_IMPORTED_MODULE_1__.getUsedExports)(webpackRequire, shareKey);
		const customShareInfo = { ...shareInfo };
		if (usedExports) customShareInfo.treeShaking = {
			usedExports,
			useIn: [federationInstance.options.name]
		};
		if (asyncLoad) return federationInstance.loadShare(shareKey, {
			customShareInfo,
			context: {
				trigger: "build",
				moduleId
			}
		});
		return federationInstance.loadShareSync(shareKey, {
			customShareInfo,
			context: {
				trigger: "build",
				moduleId
			}
		});
	} catch (err) {
		console.error("loadShareSync failed! The function should not be called unless you set \"eager:true\". If you do not set it, and encounter this issue, you can check whether an async boundary is implemented.");
		console.error("The original error message is as follows: ");
		throw err;
	}
}
function installInitialConsumes(options) {
	;(0,_updateOptions_js__WEBPACK_IMPORTED_MODULE_0__.updateConsumeOptions)(options);
	const { moduleToHandlerMapping, webpackRequire, installedModules, initialConsumes, asyncLoad } = options;
	const factoryIdSets = [];
	initialConsumes.forEach((id) => {
		const factoryGetter = () => handleInitialConsumes({
			moduleId: id,
			moduleToHandlerMapping,
			webpackRequire,
			asyncLoad
		});
		factoryIdSets.push([id, factoryGetter]);
	});
	const setModule = (id, factoryGetter) => {
		webpackRequire.m[id] = (module) => {
			installedModules[id] = 0;
			delete webpackRequire.c[id];
			const factory = factoryGetter();
			if (typeof factory !== "function") throw new Error(`Shared module is not available for eager consumption: ${id}`);
			const result = factory();
			const { shareInfo } = moduleToHandlerMapping[id];
			if (shareInfo?.shareConfig?.layer && result && typeof result === "object") try {
				if (!result.hasOwnProperty("layer") || result.layer === void 0) result.layer = shareInfo.shareConfig.layer;
			} catch (e) {}
			module.exports = result;
		};
	};
	if (asyncLoad) return Promise.all(factoryIdSets.map(async ([id, factoryGetter]) => {
		const result = await factoryGetter();
		setModule(id, () => result);
	}));
	factoryIdSets.forEach(([id, factoryGetter]) => {
		setModule(id, factoryGetter);
	});
}

//#endregion

//# sourceMappingURL=installInitialConsumes.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/remotes.js"
/*!*********************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/remotes.js ***!
  \*********************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   remotes: () => (/* binding */ remotes)
/* harmony export */ });
/* harmony import */ var _attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./attachShareScopeMap.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/attachShareScopeMap.js");
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constant.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/constant.js");
/* harmony import */ var _updateOptions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./updateOptions.js */ "./node_modules/@module-federation/webpack-bundler-runtime/dist/updateOptions.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/constant.js");
/* harmony import */ var _module_federation_sdk__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @module-federation/sdk */ "./node_modules/@module-federation/sdk/dist/utils.js");





//#region src/remotes.ts
function remotes(options) {
	(0,_updateOptions_js__WEBPACK_IMPORTED_MODULE_2__.updateRemoteOptions)(options);
	const { chunkId, promises, webpackRequire, chunkMapping, idToExternalAndNameMapping, idToRemoteMap } = options;
	(0,_attachShareScopeMap_js__WEBPACK_IMPORTED_MODULE_0__.attachShareScopeMap)(webpackRequire);
	if (webpackRequire.o(chunkMapping, chunkId)) chunkMapping[chunkId].forEach((id) => {
		let getScope = webpackRequire.R;
		if (!getScope) getScope = [];
		const data = idToExternalAndNameMapping[id];
		const remoteInfos = idToRemoteMap[id] || [];
		if (getScope.indexOf(data) >= 0) return;
		getScope.push(data);
		if (data.p) return promises.push(data.p);
		const onError = (error) => {
			if (!error) error = /* @__PURE__ */ new Error("Container missing");
			if (typeof error.message === "string") error.message += `\nwhile loading "${data[1]}" from ${data[2]}`;
			webpackRequire.m[id] = () => {
				throw error;
			};
			data.p = 0;
		};
		const handleFunction = (fn, arg1, arg2, d, next, first) => {
			try {
				const promise = fn(arg1, arg2);
				if (promise && promise.then) {
					const p = promise.then((result) => next(result, d), onError);
					if (first) promises.push(data.p = p);
					else return p;
				} else return next(promise, d, first);
			} catch (error) {
				onError(error);
			}
		};
		const onExternal = (external, _, first) => external ? handleFunction(webpackRequire.I, data[0], 0, external, onInitialized, first) : onError();
		var onInitialized = (_, external, first) => handleFunction(external.get, data[1], getScope, 0, onFactory, first);
		var onFactory = (factory) => {
			data.p = 1;
			webpackRequire.m[id] = (module) => {
				module.exports = factory();
			};
		};
		const onRemoteLoaded = () => {
			try {
				const remoteModuleName = (0,_module_federation_sdk__WEBPACK_IMPORTED_MODULE_4__.decodeName)(remoteInfos[0].name, _module_federation_sdk__WEBPACK_IMPORTED_MODULE_3__.ENCODE_NAME_PREFIX) + data[1].slice(1);
				const instance = webpackRequire.federation.instance;
				const loadRemote = () => webpackRequire.federation.instance.loadRemote(remoteModuleName, {
					loadFactory: false,
					from: "build"
				});
				if (instance.options.shareStrategy === "version-first") {
					const shareScopes = Array.isArray(data[0]) ? data[0] : [data[0]];
					return Promise.all(shareScopes.map((shareScope) => instance.sharedHandler.initializeSharing(shareScope))).then(() => {
						return loadRemote();
					});
				}
				return loadRemote();
			} catch (error) {
				onError(error);
			}
		};
		if (remoteInfos.length === 1 && _constant_js__WEBPACK_IMPORTED_MODULE_1__.FEDERATION_SUPPORTED_TYPES.includes(remoteInfos[0].externalType) && remoteInfos[0].name) handleFunction(onRemoteLoaded, data[2], 0, 0, onFactory, 1);
		else handleFunction(webpackRequire, data[2], 0, 0, onExternal, 1);
	});
}

//#endregion

//# sourceMappingURL=remotes.js.map

/***/ },

/***/ "./node_modules/@module-federation/webpack-bundler-runtime/dist/updateOptions.js"
/*!***************************************************************************************!*\
  !*** ./node_modules/@module-federation/webpack-bundler-runtime/dist/updateOptions.js ***!
  \***************************************************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   updateConsumeOptions: () => (/* binding */ updateConsumeOptions),
/* harmony export */   updateRemoteOptions: () => (/* binding */ updateRemoteOptions)
/* harmony export */ });
//#region src/updateOptions.ts
function updateConsumeOptions(options) {
	const { webpackRequire, moduleToHandlerMapping } = options;
	const { consumesLoadingData, initializeSharingData } = webpackRequire;
	const { sharedFallback, bundlerRuntime, libraryType } = webpackRequire.federation;
	if (consumesLoadingData && !consumesLoadingData._updated) {
		const { moduleIdToConsumeDataMapping: updatedModuleIdToConsumeDataMapping = {}, initialConsumes: updatedInitialConsumes = [], chunkMapping: updatedChunkMapping = {} } = consumesLoadingData;
		Object.entries(updatedModuleIdToConsumeDataMapping).forEach(([id, data]) => {
			if (!moduleToHandlerMapping[id]) moduleToHandlerMapping[id] = {
				getter: sharedFallback ? bundlerRuntime?.getSharedFallbackGetter({
					shareKey: data.shareKey,
					factory: data.fallback,
					webpackRequire,
					libraryType
				}) : data.fallback,
				treeShakingGetter: sharedFallback ? data.fallback : void 0,
				shareInfo: {
					shareConfig: {
						requiredVersion: data.requiredVersion,
						strictVersion: data.strictVersion,
						singleton: data.singleton,
						eager: data.eager,
						layer: data.layer
					},
					scope: Array.isArray(data.shareScope) ? data.shareScope : [data.shareScope || "default"],
					treeShaking: sharedFallback ? {
						get: data.fallback,
						mode: data.treeShakingMode
					} : void 0
				},
				shareKey: data.shareKey
			};
		});
		if ("initialConsumes" in options) {
			const { initialConsumes = [] } = options;
			updatedInitialConsumes.forEach((id) => {
				if (!initialConsumes.includes(id)) initialConsumes.push(id);
			});
		}
		if ("chunkMapping" in options) {
			const { chunkMapping = {} } = options;
			Object.entries(updatedChunkMapping).forEach(([id, chunkModules]) => {
				if (!chunkMapping[id]) chunkMapping[id] = [];
				chunkModules.forEach((moduleId) => {
					if (!chunkMapping[id].includes(moduleId)) chunkMapping[id].push(moduleId);
				});
			});
		}
		consumesLoadingData._updated = 1;
	}
	if (initializeSharingData && !initializeSharingData._updated) {
		const { federation } = webpackRequire;
		if (!federation.instance || !initializeSharingData.scopeToSharingDataMapping) return;
		const shared = {};
		for (let [scope, stages] of Object.entries(initializeSharingData.scopeToSharingDataMapping)) for (let stage of stages) if (typeof stage === "object" && stage !== null) {
			const { name, version, factory, eager, singleton, requiredVersion, strictVersion } = stage;
			const shareConfig = { requiredVersion: `^${version}` };
			const isValidValue = function(val) {
				return typeof val !== "undefined";
			};
			if (isValidValue(singleton)) shareConfig.singleton = singleton;
			if (isValidValue(requiredVersion)) shareConfig.requiredVersion = requiredVersion;
			if (isValidValue(eager)) shareConfig.eager = eager;
			if (isValidValue(strictVersion)) shareConfig.strictVersion = strictVersion;
			const options = {
				version,
				scope: [scope],
				shareConfig,
				get: factory
			};
			if (shared[name]) shared[name].push(options);
			else shared[name] = [options];
		}
		federation.instance.registerShared(shared);
		initializeSharingData._updated = 1;
	}
}
function updateRemoteOptions(options) {
	const { webpackRequire, idToExternalAndNameMapping = {}, idToRemoteMap = {}, chunkMapping = {} } = options;
	const { remotesLoadingData } = webpackRequire;
	const remoteInfos = webpackRequire.federation?.bundlerRuntimeOptions?.remotes?.remoteInfos;
	if (!remotesLoadingData || remotesLoadingData._updated || !remoteInfos) return;
	const { chunkMapping: updatedChunkMapping, moduleIdToRemoteDataMapping } = remotesLoadingData;
	if (!updatedChunkMapping || !moduleIdToRemoteDataMapping) return;
	for (let [moduleId, data] of Object.entries(moduleIdToRemoteDataMapping)) {
		if (!idToExternalAndNameMapping[moduleId]) idToExternalAndNameMapping[moduleId] = [
			data.shareScope,
			data.name,
			data.externalModuleId
		];
		if (!idToRemoteMap[moduleId] && remoteInfos[data.remoteName]) {
			const items = remoteInfos[data.remoteName];
			idToRemoteMap[moduleId] ||= [];
			items.forEach((item) => {
				if (!idToRemoteMap[moduleId].includes(item)) idToRemoteMap[moduleId].push(item);
			});
		}
	}
	if (chunkMapping) Object.entries(updatedChunkMapping).forEach(([id, chunkModules]) => {
		if (!chunkMapping[id]) chunkMapping[id] = [];
		chunkModules.forEach((moduleId) => {
			if (!chunkMapping[id].includes(moduleId)) chunkMapping[id].push(moduleId);
		});
	});
	remotesLoadingData._updated = 1;
}

//#endregion

//# sourceMappingURL=updateOptions.js.map

/***/ },

/***/ "webpack/container/entry/aesop_frontend"
/*!***********************!*\
  !*** container entry ***!
  \***********************/
(__unused_webpack_module, exports, __webpack_require__) {

var moduleMap = {
	"./bootstrap": () => {
		return Promise.all(/*! __federation_expose_bootstrap */[__webpack_require__.e("vendors-node_modules_uirouter_angularjs_release_angular-ui-router_js-node_modules_angular-cha-228553"), __webpack_require__.e("__federation_expose_bootstrap")]).then(() => (() => ((__webpack_require__(/*! ./app/bootstrap.js */ "./app/bootstrap.js")))));
	}
};
var get = (module, getScope) => {
	__webpack_require__.R = getScope;
	getScope = (
		__webpack_require__.o(moduleMap, module)
			? moduleMap[module]()
			: Promise.resolve().then(() => {
				throw new Error('Module "' + module + '" does not exist in container.');
			})
	);
	__webpack_require__.R = undefined;
	return getScope;
};
var init = (shareScope, initScope, remoteEntryInitOptions) => {
	return __webpack_require__.federation.bundlerRuntime.initContainerEntry({	webpackRequire: __webpack_require__,
		shareScope: shareScope,
		initScope: initScope,
		remoteEntryInitOptions: remoteEntryInitOptions,
		shareScopeKey: "default"
	})
};
// This exports getters to disallow modifications
__webpack_require__.d(exports, {
	get: () => (get),
	init: () => (init)
});

/***/ },

/***/ "./node_modules/@module-federation/error-codes/dist/browser.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@module-federation/error-codes/dist/browser.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   logAndReport: () => (/* binding */ logAndReport)
/* harmony export */ });
/* harmony import */ var _getShortErrorMsg_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getShortErrorMsg.mjs */ "./node_modules/@module-federation/error-codes/dist/getShortErrorMsg.mjs");


//#region src/browser.ts
function logAndReport(code, descMap, args, logger, originalErrorMsg, context) {
	return logger((0,_getShortErrorMsg_mjs__WEBPACK_IMPORTED_MODULE_0__.getShortErrorMsg)(code, descMap, args, originalErrorMsg));
}

//#endregion

//# sourceMappingURL=browser.mjs.map

/***/ },

/***/ "./node_modules/@module-federation/error-codes/dist/desc.mjs"
/*!*******************************************************************!*\
  !*** ./node_modules/@module-federation/error-codes/dist/desc.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   buildDescMap: () => (/* binding */ buildDescMap),
/* harmony export */   errorDescMap: () => (/* binding */ errorDescMap),
/* harmony export */   runtimeDescMap: () => (/* binding */ runtimeDescMap),
/* harmony export */   typeDescMap: () => (/* binding */ typeDescMap)
/* harmony export */ });
/* harmony import */ var _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error-codes.mjs */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");


//#region src/desc.ts
const runtimeDescMap = {
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_001]: "Failed to get remoteEntry exports.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_002]: "The remote entry interface does not contain \"init\"",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_003]: "Failed to get manifest.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_004]: "Failed to locate remote.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_005]: "Invalid loadShareSync function call from bundler runtime",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_006]: "Invalid loadShareSync function call from runtime",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_007]: "Failed to get remote snapshot.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_008]: "Failed to load script resources.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_009]: "Please call createInstance first.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_010]: "The name option cannot be changed after initialization. If you want to create a new instance with a different name, please use \"createInstance\" api.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_011]: "The remoteEntry URL is missing from the remote snapshot.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_012]: "The getter for the shared module is not a function. This may be caused by setting \"shared.import: false\" without the host providing the corresponding lib.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_013]: "The manifest is not a valid Module Federation manifest.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_014]: "The remote does not expose the requested module.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_015]: "Remote container initialization failed."
};
const typeDescMap = { [_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.TYPE_001]: "Failed to generate type declaration. Execute the below cmd to reproduce and fix the error." };
const buildDescMap = {
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILD_001]: "Failed to find expose module.",
	[_error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILD_002]: "PublicPath is required in prod mode."
};
const errorDescMap = {
	...runtimeDescMap,
	...typeDescMap,
	...buildDescMap
};

//#endregion

//# sourceMappingURL=desc.mjs.map

/***/ },

/***/ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs"
/*!**************************************************************************!*\
  !*** ./node_modules/@module-federation/error-codes/dist/error-codes.mjs ***!
  \**************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILD_001: () => (/* binding */ BUILD_001),
/* harmony export */   BUILD_002: () => (/* binding */ BUILD_002),
/* harmony export */   RUNTIME_001: () => (/* binding */ RUNTIME_001),
/* harmony export */   RUNTIME_002: () => (/* binding */ RUNTIME_002),
/* harmony export */   RUNTIME_003: () => (/* binding */ RUNTIME_003),
/* harmony export */   RUNTIME_004: () => (/* binding */ RUNTIME_004),
/* harmony export */   RUNTIME_005: () => (/* binding */ RUNTIME_005),
/* harmony export */   RUNTIME_006: () => (/* binding */ RUNTIME_006),
/* harmony export */   RUNTIME_007: () => (/* binding */ RUNTIME_007),
/* harmony export */   RUNTIME_008: () => (/* binding */ RUNTIME_008),
/* harmony export */   RUNTIME_009: () => (/* binding */ RUNTIME_009),
/* harmony export */   RUNTIME_010: () => (/* binding */ RUNTIME_010),
/* harmony export */   RUNTIME_011: () => (/* binding */ RUNTIME_011),
/* harmony export */   RUNTIME_012: () => (/* binding */ RUNTIME_012),
/* harmony export */   RUNTIME_013: () => (/* binding */ RUNTIME_013),
/* harmony export */   RUNTIME_014: () => (/* binding */ RUNTIME_014),
/* harmony export */   RUNTIME_015: () => (/* binding */ RUNTIME_015),
/* harmony export */   TYPE_001: () => (/* binding */ TYPE_001)
/* harmony export */ });
//#region src/error-codes.ts
const RUNTIME_001 = "RUNTIME-001";
const RUNTIME_002 = "RUNTIME-002";
const RUNTIME_003 = "RUNTIME-003";
const RUNTIME_004 = "RUNTIME-004";
const RUNTIME_005 = "RUNTIME-005";
const RUNTIME_006 = "RUNTIME-006";
const RUNTIME_007 = "RUNTIME-007";
const RUNTIME_008 = "RUNTIME-008";
const RUNTIME_009 = "RUNTIME-009";
const RUNTIME_010 = "RUNTIME-010";
const RUNTIME_011 = "RUNTIME-011";
const RUNTIME_012 = "RUNTIME-012";
const RUNTIME_013 = "RUNTIME-013";
const RUNTIME_014 = "RUNTIME-014";
const RUNTIME_015 = "RUNTIME-015";
const TYPE_001 = "TYPE-001";
const BUILD_001 = "BUILD-001";
const BUILD_002 = "BUILD-002";

//#endregion

//# sourceMappingURL=error-codes.mjs.map

/***/ },

/***/ "./node_modules/@module-federation/error-codes/dist/getShortErrorMsg.mjs"
/*!*******************************************************************************!*\
  !*** ./node_modules/@module-federation/error-codes/dist/getShortErrorMsg.mjs ***!
  \*******************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getShortErrorMsg: () => (/* binding */ getShortErrorMsg)
/* harmony export */ });
//#region src/getShortErrorMsg.ts
const getDocsUrl = (errorCode) => {
	return `View the docs to see how to solve: https://module-federation.io/guide/troubleshooting/${errorCode.split("-")[0].toLowerCase()}#${errorCode.toLowerCase()}`;
};
const getShortErrorMsg = (errorCode, errorDescMap, args, originalErrorMsg) => {
	const msg = [`${[errorDescMap[errorCode]]} #${errorCode}`];
	args && msg.push(`args: ${JSON.stringify(args)}`);
	msg.push(getDocsUrl(errorCode));
	originalErrorMsg && msg.push(`Original Error Message:\n ${originalErrorMsg}`);
	return msg.join("\n");
};

//#endregion

//# sourceMappingURL=getShortErrorMsg.mjs.map

/***/ },

/***/ "./node_modules/@module-federation/error-codes/dist/index.mjs"
/*!********************************************************************!*\
  !*** ./node_modules/@module-federation/error-codes/dist/index.mjs ***!
  \********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BUILD_001: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILD_001),
/* harmony export */   BUILD_002: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.BUILD_002),
/* harmony export */   RUNTIME_001: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_001),
/* harmony export */   RUNTIME_002: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_002),
/* harmony export */   RUNTIME_003: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_003),
/* harmony export */   RUNTIME_004: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_004),
/* harmony export */   RUNTIME_005: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_005),
/* harmony export */   RUNTIME_006: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_006),
/* harmony export */   RUNTIME_007: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_007),
/* harmony export */   RUNTIME_008: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_008),
/* harmony export */   RUNTIME_009: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_009),
/* harmony export */   RUNTIME_010: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_010),
/* harmony export */   RUNTIME_011: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_011),
/* harmony export */   RUNTIME_012: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_012),
/* harmony export */   RUNTIME_013: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_013),
/* harmony export */   RUNTIME_014: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_014),
/* harmony export */   RUNTIME_015: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.RUNTIME_015),
/* harmony export */   TYPE_001: () => (/* reexport safe */ _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__.TYPE_001),
/* harmony export */   buildDescMap: () => (/* reexport safe */ _desc_mjs__WEBPACK_IMPORTED_MODULE_2__.buildDescMap),
/* harmony export */   errorDescMap: () => (/* reexport safe */ _desc_mjs__WEBPACK_IMPORTED_MODULE_2__.errorDescMap),
/* harmony export */   getShortErrorMsg: () => (/* reexport safe */ _getShortErrorMsg_mjs__WEBPACK_IMPORTED_MODULE_1__.getShortErrorMsg),
/* harmony export */   runtimeDescMap: () => (/* reexport safe */ _desc_mjs__WEBPACK_IMPORTED_MODULE_2__.runtimeDescMap),
/* harmony export */   typeDescMap: () => (/* reexport safe */ _desc_mjs__WEBPACK_IMPORTED_MODULE_2__.typeDescMap)
/* harmony export */ });
/* harmony import */ var _error_codes_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./error-codes.mjs */ "./node_modules/@module-federation/error-codes/dist/error-codes.mjs");
/* harmony import */ var _getShortErrorMsg_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./getShortErrorMsg.mjs */ "./node_modules/@module-federation/error-codes/dist/getShortErrorMsg.mjs");
/* harmony import */ var _desc_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./desc.mjs */ "./node_modules/@module-federation/error-codes/dist/desc.mjs");






/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	let module = __webpack_module_cache__[moduleId] = {
/******/ 		id: moduleId,
/******/ 		loaded: false,
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	const execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 	__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 	if (!execOptions.factory) {
/******/ 		delete __webpack_module_cache__[moduleId];
/******/ 		const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	module = execOptions.module;
/******/ 	execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 
/******/ 	// Flag the module as loaded
/******/ 	module.loaded = true;
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/******/ // expose the modules object (__webpack_modules__)
/******/ __webpack_require__.m = __webpack_modules__;
/******/ 
/******/ // expose the module cache
/******/ __webpack_require__.c = __webpack_module_cache__;
/******/ 
/******/ // expose the module execution interceptor
/******/ __webpack_require__.i = [];
/******/ 
/******/ // the startup function
/******/ __webpack_require__.x = x => {};
/************************************************************************/
/******/ /* webpack/runtime/federation runtime */
/******/ (() => {
/******/ 	if(!__webpack_require__.federation){
/******/ 		__webpack_require__.federation = {
/******/ 			initOptions: {"name":"aesop_frontend","remotes":[],"shareStrategy":"version-first"},
/******/ 			chunkMatcher: function(chunkId) {return true},
/******/ 			rootOutputDir: "",
/******/ 			bundlerRuntimeOptions: { remotes: { remoteInfos: {}, webpackRequire: __webpack_require__,idToRemoteMap: {}, chunkMapping: {},idToExternalAndNameMapping: {} } }
/******/ 		};
/******/ 	__webpack_require__.consumesLoadingData = {}
/******/ 	__webpack_require__.remotesLoadingData = {}
/******/ 	}
/******/ })();
/******/ 
/******/ /* webpack/runtime/compat get default export */
/******/ // getDefaultExport function for compatibility with non-harmony modules
/******/ __webpack_require__.n = (module) => {
/******/ 	const getter = module && module.__esModule ?
/******/ 		() => (module['default']) :
/******/ 		() => (module);
/******/ 	__webpack_require__.d(getter, { a: getter });
/******/ 	return getter;
/******/ };
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	for(var key in definition) {
/******/ 		if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 			Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/ensure chunk */
/******/ __webpack_require__.f = {};
/******/ // This file contains only the entry chunk.
/******/ // The chunk loading function for additional chunks
/******/ __webpack_require__.e = (chunkId) => {
/******/ 	return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 		__webpack_require__.f[key](chunkId, promises);
/******/ 		return promises;
/******/ 	}, []));
/******/ };
/******/ 
/******/ /* webpack/runtime/global */
/******/ __webpack_require__.g = (function() {
/******/ 	if (typeof globalThis === 'object') return globalThis;
/******/ 	try {
/******/ 		return this || new Function('return this')();
/******/ 	} catch (e) {
/******/ 		if (typeof window === 'object') return window;
/******/ 	}
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ // define __esModule on exports
/******/ __webpack_require__.r = (exports) => {
/******/ 	Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 	Object.defineProperty(exports, '__esModule', { value: true });
/******/ };
/******/ 
/******/ /* webpack/runtime/node module decorator */
/******/ __webpack_require__.nmd = (module) => {
/******/ 	module.paths = [];
/******/ 	if (!module.children) module.children = [];
/******/ 	return module;
/******/ };
/******/ 
/******/ /* webpack/runtime/embed/federation */
/******/ (() => {
/******/ 	var prevStartup = __webpack_require__.x;
/******/ 	var hasRun = false;
/******/ 	__webpack_require__.x = () => {
/******/ 		if (!hasRun) {
/******/ 		  hasRun = true;
/******/ 		  __webpack_require__(/*! ./node_modules/.federation/entry.27554b3ac4caf80dc386f87176302425.js */ "./node_modules/.federation/entry.27554b3ac4caf80dc386f87176302425.js");
/******/ 		}
/******/ 		if (typeof prevStartup === 'function') {
/******/ 		  return prevStartup();
/******/ 		} else {
/******/ 		  console.warn('[Module Federation] prevStartup is not a function, skipping startup execution');
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/import chunk loading */
/******/ (() => {
/******/ 	// no baseURI
/******/ 	
/******/ 	const chunkImports = {
/******/ 		"vendors-node_modules_uirouter_angularjs_release_angular-ui-router_js-node_modules_angular-cha-228553": () => (import("./vendors-node_modules_uirouter_angularjs_release_angular-ui-router_js-node_modules_angular-cha-228553.js")),
/******/ 		"__federation_expose_bootstrap": () => (import("./__federation_expose_bootstrap.js"))
/******/ 	};
/******/ 	
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// [resolve, Promise] = chunk loading, 0 = chunk loaded
/******/ 	const installedChunks = {
/******/ 		"aesop_frontend": 0
/******/ 	};
/******/ 	
/******/ 	const installChunk = (data) => {
/******/ 		let {__webpack_esm_ids__, __webpack_esm_modules__, __webpack_esm_runtime__} = data;
/******/ 		// add "modules" to the modules object,
/******/ 		// then flag all "ids" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0;
/******/ 		for(moduleId in __webpack_esm_modules__) {
/******/ 			if(__webpack_require__.o(__webpack_esm_modules__, moduleId)) {
/******/ 				__webpack_require__.m[moduleId] = __webpack_esm_modules__[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(__webpack_esm_runtime__) __webpack_esm_runtime__(__webpack_require__);
/******/ 		for(;i < __webpack_esm_ids__.length; i++) {
/******/ 			chunkId = __webpack_esm_ids__[i];
/******/ 			if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				installedChunks[chunkId][0]();
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 	
/******/ 	}
/******/ 	
/******/ 	__webpack_require__.f.j = (chunkId, promises) => {
/******/ 			// import() chunk loading for javascript
/******/ 			let installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 			if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 	
/******/ 				// a Promise means "currently loading".
/******/ 				if(installedChunkData) {
/******/ 					promises.push(installedChunkData[1]);
/******/ 				} else {
/******/ 					if(true) { // all chunks have JS
/******/ 						// setup Promise in chunk cache
/******/ 						let promise = chunkImports[chunkId]().then(installChunk, (e) => {
/******/ 							if(installedChunks[chunkId] !== 0) installedChunks[chunkId] = undefined;
/******/ 							throw e;
/******/ 						});
/******/ 						promise = Promise.race([promise, new Promise((resolve) => (installedChunkData = installedChunks[chunkId] = [resolve]))])
/******/ 						promises.push(installedChunkData[1] = promise);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 	};
/******/ 	
/******/ 	// no prefetching
/******/ 	
/******/ 	// no preloaded
/******/ 	
/******/ 	// no external install chunk
/******/ 	
/******/ 	// no on chunks loaded
/******/ 	// no HMR
/******/ 	
/******/ 	// no HMR manifest
/******/ })();
/******/ 
/******/ /* webpack/runtime/nonce */
/******/ __webpack_require__.nc = undefined;
/******/ 
/************************************************************************/
/******/ // run runtime startup
/******/ __webpack_require__.x();
/******/ // module cache are used so entry inlining is disabled
/******/ // startup
/******/ // Load entry module and return exports
/******/ let __webpack_exports__ = __webpack_require__("webpack/container/entry/aesop_frontend");
/******/ const __webpack_exports__get = __webpack_exports__.get;
/******/ const __webpack_exports__init = __webpack_exports__.init;
/******/ export { __webpack_exports__get as get, __webpack_exports__init as init };
/******/ 

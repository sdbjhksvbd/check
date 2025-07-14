/*!************************************************************************
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2024 Adobe  Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Incorporated and its
* suppliers and are protected by all applicable intellectual property laws,
* including trade secret and or copyright laws.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Incorporated.
**************************************************************************/
// This file is used to communicate between the webview and the native side.
// this is not compatible with the version of uglify available in the build system
// manually uglify locally with latest uglify for any changs in this file
// command 'uglifyjs acro_js.js -m -o acro_js_min.js --comments "/^!/"'
function checkIfLoadedURLIsRNAURL(){const e=window.location.hostname;let t=false;if(e==="rna-v2-resource.acrobat.com"||e==="rna-resource.acrobat.com"){t=true}return t}const isRNAURL=checkIfLoadedURLIsRNAURL();
// Function to check if the platform is Windows
function isWindows(){return navigator.userAgent.indexOf("Windows")!==-1}if(!isWindows()&&isRNAURL){Object.defineProperty(navigator,"language",{get:function(){return"en-US"}});Object.defineProperty(navigator,"languages",{get:function(){return["en-US","en"]}})}
/**** START Constants USED IN THIS SCRIPT    ****/
// Any modification in these constants might also require changes in the C++ code
const ODMConstants={PRIMITIVE_PROXY:1,MAP_PROXY:2,VECTOR_PROXY:3,FUNCTION_PROXY:4,ADD_EVENT:"addProperty",REMOVE_EVENT:"removeProperty",REPLACE_EVENT:"replaceProperty",CHANGE_EVENT:"change"};const HAS_PROPERTY_METHOD="_hasProperty";const GET_PROPS_METHOD="_getProps";const ADDEVENTLISTENER_METHOD="_addEventListener";const REMOVEEVENTLISTENER_METHOD="_removeEventListener";const DONE_METHOD="_done";const FAIL_METHOD="_fail";const INVOKE_METHOD="_invoke";const REMOVEALLLISTENERS_METHOD="_removeEventListeners";const SET_VALUE_METHOD="_set";const NULL_OBJ_STR="__NULLOBJ__";const ACRO_JS_ID_STR="acrojs_id";const SPECIAL_OBJ_STR="__SPECIALOBJ__";const FUNCTION_OBJ_STR="__FUNCTION__";const ACRO_JS_MSG_HEADER="isAcroMsg";const ACRO_JS_MSG_HEADER_VAL="YES";const RESPONSE_ID="response_id";const APP_MODEL_VIEW_EVENT_RID="handleViewEvent";const CALL_EVENT_HANDLER_RID="CallAppModelEventHandler";const EVENT_TYPE_STR="eventType";const CUSTOM_EVENT_TYPE="custom";const EVENT_NAME_STR="eventName";const EVENT_PARAMS_STR="eventParams";const JS_EXCEPTION_EVENT="JSException";const MARK_PAGE_AS_NON_BLANK="MarkPageNonBlank";const METHOD_NAME_ARG_NAME="method_name";const FUNC_ARGS_ARG_NAME="funArgs";
/**** End Constants USED IN THIS SCRIPT    ****/
/**** START GLOBALS USED IN THIS SCRIPT    ****/
// this is injected into window object so that can be used to differentiate between modern vs classic views
var g_isClassicView=window.location.href.indexOf("rna-v2")===-1;
// this is injected into window object so that can be used to differentiate between CEF/Native webviews 
var gIsNativeWebview=true;
// this is injected into window object so that can be used to extract out actual value from js proxy object
var gProxyRealValPropName="AcroDynamicTargetProxyTargetName";
// when a function object is passed as an argument to C++, its mapped to a string id and that id is passed instead of actual object
// this global dict stores mapping between id and js function object
var g_functionCallback={};
// when a complex object is passed as an argument to C++, its mapped to a string id and that id is passed instead of actual object
// this global dict stores mapping between id and complex js object
var g_SpecialObject={};
// stores acrojs(RNA model in c++) object to its proxy mapping
var g_acroJSObjMap=new Map;
// stores acrojs(RNA model in c++) object to its listeners
var g_eventListenerMap=new Map;
// stores the pending events on the object to be called once the addEventListener is called
var g_pendingEvents=new Map;
// stores promises for the native call returns
_promises={};
// enable disable logs for this script
var enable_all_logs=0;
/**** End GLOBALS USED IN THIS SCRIPT    ****/
/*
* Convert a JS object to JSON for passing it as a param to C++
* @return JSON representation of object
*/function CustomStringify(e){function n(e){var n=Object.create(null);e.forEach(function(e,t){n[t]=e});return n}function t(e,t){if(t===null)return NULL_OBJ_STR;if(t instanceof Map){
// For Map objects, convert to an array of key-value pairs
return n(t)}return t}return JSON.stringify(e,t)}function nativepostmessage(e){if(enable_all_logs)console.log(e);nativepostmessageImpl(e)}
/* Use this Impl method directly only when you want to send the any console or error messages to native  */function nativepostmessageImpl(e){
// check if it windows use window.chrome.webview.postMessage else window.webkit.messageHandlers.get.postMessage
if(window.chrome&&window.chrome.webview&&window.chrome.webview.postMessage){window.chrome.webview.postMessage(e)}else if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.execute&&window.webkit.messageHandlers.execute.postMessage)window.webkit.messageHandlers.execute.postMessage(e)}
// Listen for messages from the child frame
window.addEventListener("message",function(e){
// Handle the message
const t=JSON.parse(e.data);if(t[METHOD_NAME_ARG_NAME]==="PerfPaintEventForNonRNAURLs"){nativepostmessage(e.data)}});
/**
 * 
 * @returns Unique id used to identify objects during c++/js calls
 */const CreateUniqueID=()=>Math.random().toString(16).slice(2);
// Define the types of RNA models
const RNAMODEL_TYPE=Object.freeze({
// Represents a non-model type
NOT_A_MODEL:0,
// Represents a classic model type
CLASSIC_MODEL:1,
// Represents a modern model type
MODERN_MODEL:2});
/**
 * Determines the type of RNA model an object represents.
 * See RNAModel.js and RNACollection.js in RNA/framework for classic models.
 * See NativeModel.ts in dc-desktop repo for the modern models.
 * We are checking this so that before passing them as a param to C++
 * We can convert to a compact transferable format
 * by storing them in a special object array (g_SpecialObject) and passing the id of that object
 * upon receiving the id from C++ we can get the actual object from the special object
 * @param {Object} obj - The object to check.
 * @return RNAMODEL_TYPE.NOT_A_MODEL    if not RNAModel
 * @return RNAMODEL_TYPE.CLASSIC_MODEL  for RNAModel or RNACollection used for classic views
 * @return RNAMODEL_TYPE.MODERN_MODEL   for NativeModel used in React based views
*/function IsObjectOfRNAModel(e){
// Check if the object has properties indicating a classic model
if(e&&e.hasOwnProperty("_contextId")&&e.hasOwnProperty("_proxy")&&e.hasOwnProperty("shouldCache")){return RNAMODEL_TYPE.CLASSIC_MODEL}
// Check if the object has properties indicating a modern model
if(e&&e.hasOwnProperty("contextId")&&e.hasOwnProperty("proxy")&&e.hasOwnProperty("shouldCache")){return RNAMODEL_TYPE.MODERN_MODEL}
// If neither, return NOT_A_MODEL
return RNAMODEL_TYPE.NOT_A_MODEL}
/**
 * Checks if an object consists only of primitive types.
* We are checking this so that before passing them as a param to C++
 * We can convert non primitives to a compact transferable format
 * by storing them in a object array (g_SpecialObject) and passing the id of that object
 * upon receiving the id from C++ we can get the actual object from the special object
 * @param {Object} obj - The object to check.
 * @return {boolean} - True if the object consists only of primitive types, false otherwise.
*/function IsObjectOfPrimitives(e){
// Iterate over each property in the object
for(const t in e){
// Check if the property is a direct property of the object
if(e.hasOwnProperty(t)){const n=e[t];if(!n)continue;
// If the value is an object (excluding null), recursively check it
if(typeof n==="object"){if(!IsObjectOfPrimitives(n)){return false}}else if(!["string","number","boolean","undefined","symbol"].includes(typeof n)){
// If the value is not a primitive type, return false
return false}}}
// If all properties are primitive types, return true
return true}
/**
 * Class representing reserved properties in js.
 * This is used in proxy object to check if a property is reserved or not.
 * Only non-reserved property get call are passed to C++.
 * In CEF this was handled in C++ code, but in Webview we need to handle it in JS.
 * Refere JSReservedProps.cpp in CEF project for more details.
 */class AcroJSReservedProps{constructor(){}
/**
    * A set to store reserved properties.
    * @type {Set<string>}
    */static props=new Set;
/**
     * Retrieves the reserved properties and populates the set if it's empty.
     * 
     * @return {Set<string>} - The set of reserved properties.
     */static GetReservedProps(){if(AcroJSReservedProps.props.size===0){var e=["varructor","__defineGetter__","__defineSetter__","__lookupGetter__","__lookupSetter__","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","toFixed","toLocaleString","toPrecision","toString","toLocaleString","concat","every","filter","forEach","indexOf","join","lastIndexOf","length","__proto__","slice","splice","map","pop","push","reduce","reduceRight","reverse","shift","some","sort","unshift","anchor","big","blink","bold","charAt","charCodeAt","fixed","fontcolor","fontsize","italics","localeCompare","match","replace","search","small","split","strike","sub","substr","substring","sup","toLocaleLowerCase","toLocaleUpperCase","toLowerCase","toUpperCase","trim","trimLeft","trimRight","bind",
// "name",  // Uncomment if needed
"call","caller","apply","arguments","then","toJSON"];AcroJSReservedProps.props=new Set(e)}return AcroJSReservedProps.props}
/**
     * Checks if a property is reserved.
     * 
     * @param {string} prop - The property to check.
     * @return {boolean} - True if the property is reserved, false otherwise.
     */static isReserved(e){var t=AcroJSReservedProps.GetReservedProps();return t.has(e)}}
/**
 * Determines the type of a built-in method based on its name.
 * RNA AppModel object define some of the built-in methods which are used to interact with the object.
 * This is used in proxy object to check if a method is built-in or not. For method get call in proxy object
 * return output in function() {} style so that it can be called later.
 * @param {string} methodName - The name of the method to check.
 * @return {string} - The type of the method.
 */function IsBuiltInMethod(e){if(e===HAS_PROPERTY_METHOD||e===GET_PROPS_METHOD){return"kUtilityMethod"}else if(e===ADDEVENTLISTENER_METHOD||e===REMOVEEVENTLISTENER_METHOD||e===REMOVEALLLISTENERS_METHOD){return"kEventHandlerMethod"}else if(e===DONE_METHOD||e===FAIL_METHOD){return"kDoneMethod"}else if(e===INVOKE_METHOD){return"kInvokeMethod"}else if(e===SET_VALUE_METHOD){return"kSetValueMethod"}return"kNotAMethod"}
/**
 * Class representing the return value of an invoked function.
 */class InvokeFuncReturn{
/**
     * Creates an instance of InvokeFuncReturn.
     * 
     * @param {Promise} retpromise - The promise returned by the invoked function.
     */
constructor(e){
// in case of invoke method, we need to store the promise returned by the c++ async call
// which is then resolved with the done and fail method
// refer AppModelInvokeMethodHandler class for relevant code in c++ 
this.retpromise=e}
/**
     * Calls the provided callback when the promise resolves.
     * 
     * @param {Function} callback - The callback to call on promise resolution.
     * @param {Object} thiz - The context (`this` value) for the callback.
     * @param {any} data - Additional data to pass to the callback.
     */_done(t,n,r){
// On retpromise resolve, call the callback
this.retpromise.then(function(e){e._done(t,n,r)})}
/**
     * Calls the provided callback when the promise rejects.
     * 
     * @param {Function} callback - The callback to call on promise rejection.
     * @param {Object} thiz - The context (`this` value) for the callback.
     * @param {any} data - Additional data to pass to the callback.
     */_fail(t,n,r){
// On retpromise reject, call the callback
this.retpromise.then(function(e){e._fail(t,n,r)})}}
/**
 * Checks if an object is a valid AppModel object i.e. represents c++ AppModel object.
 * @param {Object} obj - The object to check.
 * @return {boolean} - True if the object is a valid AppModel object, false otherwise.
 */
function IsValidAppModelObject(e){
// it should contains all of the following properties
/*
        _context
        _id
        _type
    */
if(e&&e.hasOwnProperty("_context")&&e.hasOwnProperty("_id")&&e.hasOwnProperty("_type"))return true;return false}function IsPrimitiveAppModelType(e){return!IsValidAppModelObject(e)||e._type===ODMConstants.PRIMITIVE_PROXY}
/**
 * Adds an object to the g_acroJSObjMap.
 * Utility method used to handle event handlers in the proxy object.
 * @param {Object} obj - The object to add.
 * @return {void}
*/function AddToacrosJSObjMapForObj(e){if(!g_acroJSObjMap.has(e.acrojs_id))// if this the first call, create a new array for this object
g_acroJSObjMap.set(e.acrojs_id,new Array);g_acroJSObjMap.get(e.acrojs_id).push(e)}
/**
 * Removes an object to the g_acroJSObjMap.
 * Utility method used to handle event handlers in the proxy object.
 * @param {Object} obj - The object to remove.
 * @return {void}
*/function RemoveFromacrosJSObjMapForObj(e){if(!g_acroJSObjMap.has(e.acrojs_id))// map for this object does not exist
return;const t=g_acroJSObjMap.get(e.acrojs_id);
// Find the index of the object in the array
const n=t.indexOf(e);if(n!==-1){t.splice(n,1);// Remove the object using splice
}
// If the array is empty after removal, delete the id from the map
if(t.length===0){g_acroJSObjMap.delete(e.acrojs_id)}}
/**
 * Utility method used to handle event handlers in the proxy object.
*/function AddToEventListernerMapForObj(e,t){AddToacrosJSObjMapForObj(e);// register the object in g_acroJSObjMap -- it will replace if already present
if(!g_eventListenerMap.has(e.acrojs_id))// if this the first call, create a new map for this object
g_eventListenerMap.set(e.acrojs_id,new Map);if(!g_eventListenerMap.get(e.acrojs_id).has(t[0]))// if this first call for args[0](event name), create a new array for this event
g_eventListenerMap.get(e.acrojs_id).set(t[0],new Array);g_eventListenerMap.get(e.acrojs_id).get(t[0]).push(t)}
/**
 * Utility method used to handle event handlers in the proxy object.
*/function RemoveFromEventListernerMapForObj(e,t){if(!g_eventListenerMap.has(e.acrojs_id))// map for this object does not exist
return;if(!g_eventListenerMap.get(e.acrojs_id).has(t[0]))// array for this event does not exist
return;var n=g_eventListenerMap.get(e.acrojs_id).get(t[0]);for(var r=0;r<n.length;r++){if(n[r][0]===t[0]&&n[r][1]==t[1]){n.splice(r,1);break}}
// if this is the last entry for this event name remove the event name from the map
if(n.length===0)g_eventListenerMap.get(e.acrojs_id).delete(t[0]);
// if this is the last event for this object remove the object from the map
if(g_eventListenerMap.get(e.acrojs_id).size===0){g_eventListenerMap.delete(e.acrojs_id);RemoveFromacrosJSObjMapForObj(e)}}
/**
 * Dispath pending events on the add event listener call
 */function DispatchPendingEvents(e){
// also dispatch any pending events for this object
if(g_pendingEvents.has(e.acrojs_id)){if(enable_all_logs)console.log("Dispatching pending events for object id "+e.acrojs_id,g_pendingEvents.get(e.acrojs_id));var t=g_pendingEvents.get(e.acrojs_id);for(var n=0;n<t.length;n++){var r=t[n];if(enable_all_logs)console.log("Dispatching pending event "+r);AcroJS.HandleEventForObj(e.acrojs_id,r)}g_pendingEvents.delete(e.acrojs_id)}}
/**
 * Utility method used to handle event handlers in the proxy object.
*/function RemoveAllFromEventListernerMapForObj(e){if(!g_eventListenerMap.has(e.acrojs_id))// map for this object does not exist
return;g_eventListenerMap.delete(e.acrojs_id);RemoveFromacrosJSObjMapForObj(e)}
/**
 * Utility method used to handle event handlers in the proxy object.
*/function GetCallbackArrayForObjId(e,t){if(!g_eventListenerMap.has(e))// map for this object does not exist
return null;if(!g_eventListenerMap.get(e).has(t))// array for this event does not exist
return null;return g_eventListenerMap.get(e).get(t)}
/**
 * This is used to determine if object requires converstion to proxy object or not
 * We convert all objects having acrojs_id to proxy object
 * C++ side set that for functions and appmodel objects
*/function isPrimitive(e){if(!e)return true;if(typeof e==="function"||e.hasOwnProperty(ACRO_JS_ID_STR))return false;if(typeof e==="object"){for(var t in e)// check each value in case of object
{if(e.hasOwnProperty(t))// ignore inbuilt properties
{var n=e[t];
// recursively check it
if(!isPrimitive(n)){return false}}}}return true}
/**
 * This is used to determine if object requires converstion to proxy object or not
 * We convert all objects having acrojs_id to proxy object
 * C++ side set that for functions and appmodel objects
*/function RequiresConversionToProxy(e){return!isPrimitive(e)}var AcroDynamicTargetProxyTargetName=gProxyRealValPropName;class AcroDynamicTargetProxy{
/**
     * Creates an instance of AcroDynamicTargetProxy.
     *  @param {Object} init_target - The target object in case its available
     * @param {Object} init_promise - in case target is not available and it is a promise object which is later resolved to target and sets the target of AcroDynamicTargetProxy object
     * @return {Object} - The proxy object.
     */
constructor(e,t){
// Create a Proxy instance with the target object
let n=new Proxy(e,{
// get/set operates on this object which is dymamic target and can be changed later on init_promise resolve
dynamicTarget:t?null:e,targetPromise:t,get:function(o,s,e){
// AcroDynamicTargetProxyTargetName prop can be used to get the actual target object
if(s===AcroDynamicTargetProxyTargetName)return this.dynamicTarget;o=this.dynamicTarget;
// check if its a method using IsBuiltInMethod
var t=IsBuiltInMethod(s);
// if target is null then it means which is yet to be resolved from c++ side
// handle the get/method call on this.targetPromise
if(o===null){if(t==="kNotAMethod")// get call
{var a=this.targetPromise;var n=new Promise((t,n)=>{a.then(function(e){if(!e.hasOwnProperty(ACRO_JS_ID_STR)){n("failed")}else{AcroJS.get(e.acrojs_id,s).then(function(e){t(e)})}})});return new AcroDynamicTargetProxy(this,n)}else{var a=this.targetPromise;return function(...r){var e=new Promise((t,n)=>{a.then(function(e){if(!e.hasOwnProperty(ACRO_JS_ID_STR)){n("failed")}else{if(s===ADDEVENTLISTENER_METHOD){AddToEventListernerMapForObj(e,r);DispatchPendingEvents(o);t(true)}else if(s===REMOVEEVENTLISTENER_METHOD){RemoveFromEventListernerMapForObj(e,r);t(true)}else if(s===REMOVEALLLISTENERS_METHOD){RemoveAllFromEventListernerMapForObj(e);t(true)}else{AcroJS.funcall(e.acrojs_id,s,r).then(function(e){t(e)})}}})});if(s===INVOKE_METHOD){return new InvokeFuncReturn(e)}return e}}}let r=Reflect.get(o,s,e);if(r===null)// convert null to undefined
r=undefined;
// in case property is undefined and it is not a reserved property nor it is a acrojs object
// directly return undefined
if(r===undefined&&(AcroJSReservedProps.isReserved(s)||!o.hasOwnProperty(ACRO_JS_ID_STR))){return r}if(s==="_size"){if(o._type===ODMConstants.MAP_PROXY)return o.childProps.length;else if(o._type===ODMConstants.VECTOR_PROXY)return o.length;else return undefined}if(s==="_getProps"){return function(...e){return o.childProps}}if(s==="_hasProperty"){return function(t){return o.childProps.find(function(e){return e===t})}}if(t!=="kNotAMethod"){return function(...e){
//console.log("called method " + prop + " with args " + arg);
if(s===ADDEVENTLISTENER_METHOD){AddToEventListernerMapForObj(o,e);DispatchPendingEvents(o);return true}else if(s===REMOVEEVENTLISTENER_METHOD){RemoveFromEventListernerMapForObj(o,e);return true}else if(s===REMOVEALLLISTENERS_METHOD){RemoveAllFromEventListernerMapForObj(o)}else{var t=AcroJS.funcall(o.acrojs_id,s,e);
// create a object which has _done and _fail method which takes callback as params
if(s===INVOKE_METHOD){return new InvokeFuncReturn(t)}return t}}}
// in case of non-primitive app model objects, return a proxy object because property can be 
// delay initialized from c++ side, so need to make a c++ call
if(r===undefined&&!IsPrimitiveAppModelType(o)){var n=AcroJS.get(o.acrojs_id,s);var i=new AcroDynamicTargetProxy(this,n);return i}else if(r===undefined)return r;if(RequiresConversionToProxy(r)){let e=Object.getOwnPropertyDescriptor(o,s);if(e&&e.configurable&&e.writable)return new AcroDynamicTargetProxy(r,null);else return r}return r},set:function(e,t,n,r){if(t===AcroDynamicTargetProxyTargetName){
//console.log(`Setting target to a new value`);
this.dynamicTarget=n;return true}e=this.dynamicTarget;return Reflect.set(e,t,n,r)}});
// update the target if promise is there
if(t){t.then(function(e){n.AcroDynamicTargetProxyTargetName=e})}return n}}
/* Intercepting the console as well as error messages to send to native side */
window.console.error=function(e){const t=new Error(e);const n=t.stack||"";const r=n.split("\n");
// Extract the file name and line number from the stack trace
const o=r[2];// Although the first line is the current function call, but that will always point to this script. So using the second line.
const s=o.match(/(http[s]?:\/\/.*?):(\d+):(\d+)/);if(s){const a=s[1];const i=s[2];
// Format of the message (picked from acrocef.exe) we need to send to native - message:filename:line 
const l=`${e}:${a}:${i}`;sendJSErrorToNative(l)}}
/** Sends the console.error or any javascript error to native side */;function sendJSErrorToNative(e){var t={[EVENT_TYPE_STR]:CUSTOM_EVENT_TYPE,[EVENT_PARAMS_STR]:e,[EVENT_NAME_STR]:JS_EXCEPTION_EVENT};var n=CustomStringify(t);nativepostmessageImpl(n);// using nativepostmessageImpl to avoid infinite loop
}
// Listen for js errors and send them to native side
window.addEventListener("error",function(e){const t=e.message;const n=e.filename;const r=e.lineno;const o=`${t}:${n}:${r}`;sendJSErrorToNative(o)},true);window.addEventListener("unhandledrejection",function(e){const t="unhandledrejection- "+e.reason;const n=e.reason.fileName;// will be undefined for few cases
const r=e.reason.lineNumber;// will be undefined for few cases
const o=`${t}:${n}:${r}`;sendJSErrorToNative(o)});window.addEventListener("securitypolicyviolation",function(e){const t="Refused to connect to "+e.blockedURI+" because it violates following CSP directive "+e.violatedDirective;const n=e.sourceFile;const r=e.lineNumber;const o=`${t}:${n}:${r}`;sendJSErrorToNative(o)});class AcroJS{static specialObjLen=SPECIAL_OBJ_STR.length;static ConvertArgumentBeforeNativeCall(e){if(e===null)return NULL_OBJ_STR;else if(typeof e==="function"){var t=CreateUniqueID();g_functionCallback[t]=e;return FUNCTION_OBJ_STR+t}else if(e instanceof Object){var n=IsObjectOfRNAModel(e);if(n===RNAMODEL_TYPE.NOT_A_MODEL){if(!IsObjectOfPrimitives(e)){var r=CreateUniqueID();g_SpecialObject[r]=e;e=SPECIAL_OBJ_STR+r}return e}else if(n===RNAMODEL_TYPE.CLASSIC_MODEL){var r=CreateUniqueID();var o={_contextId:e._contextId,_proxy:{acrojs_id:e._proxy.acrojs_id},shouldCache:e.shouldCache,__jsID__:SPECIAL_OBJ_STR+r};g_SpecialObject[r]=e;return o}else if(n===RNAMODEL_TYPE.MODERN_MODEL){var r=CreateUniqueID();var o={contextId:e.contextId,proxy:{acrojs_id:e.proxy.acrojs_id},shouldCache:e.shouldCache,__jsID__:SPECIAL_OBJ_STR+r};g_SpecialObject[r]=e;return o}}else if(IsObjectOfPrimitives(e)){return e}return e}static get(e,t){
// console.trace();
var n=CreateUniqueID();var r=new Promise((e,t)=>{_promises[n]={resolve:e,reject:t}});var o={};o[ACRO_JS_MSG_HEADER]=ACRO_JS_MSG_HEADER_VAL;o[METHOD_NAME_ARG_NAME]="get";o[FUNC_ARGS_ARG_NAME]=arguments;o[RESPONSE_ID]=n;var s=CustomStringify(o);nativepostmessage(s);
//console.log("get was called ", acrojs_id, attr,id);
return r}static funcall(e,t,n){
//console.log("funcall was called ", acrojs_id, methodName, args);
var r=CreateUniqueID();var o=new Promise((e,t)=>{_promises[r]={resolve:e,reject:t}});var s={};s[ACRO_JS_MSG_HEADER]=ACRO_JS_MSG_HEADER_VAL;s[METHOD_NAME_ARG_NAME]="invoke";s[FUNC_ARGS_ARG_NAME]={0:e,1:t};s[RESPONSE_ID]=r;s[FUNC_ARGS_ARG_NAME]["2"]={};for(var a=0;a<n.length;a++){var i=AcroJS.ConvertArgumentBeforeNativeCall(n[a]);s[FUNC_ARGS_ARG_NAME]["2"][a]=i}var l=CustomStringify(s);nativepostmessage(l);
//console.log("funcall was called ", strparam);
return o}static createContext(e,t,n,r,o,s){var a=CreateUniqueID();var i={};i[ACRO_JS_MSG_HEADER]=ACRO_JS_MSG_HEADER_VAL;i[METHOD_NAME_ARG_NAME]="createContext";i[FUNC_ARGS_ARG_NAME]={};i[RESPONSE_ID]=a;for(var l=0;l<arguments.length;l++){if(arguments[l]==undefined)// no more params after this
break;var c=AcroJS.ConvertArgumentBeforeNativeCall(arguments[l]);i[FUNC_ARGS_ARG_NAME][l]=c}var _=CustomStringify(i);nativepostmessage(_)}static ConvertResponseArgToProxy(e){var t=[];var n=0;while(true){
// check if x exists in response
if(e.hasOwnProperty(n)){t.push(e[n++]);
// special handling for deferred object check if it is a string and starts with __SPECIALOBJ__
if(typeof t[t.length-1]==="string"&&t[t.length-1].startsWith(SPECIAL_OBJ_STR)){var r=t[t.length-1].substring(this.specialObjLen);t[t.length-1]=g_SpecialObject[r];delete g_SpecialObject[r]}if(t[t.length-1]&&RequiresConversionToProxy(t[t.length-1])){
// check if it is a acrojs object
//console.log("myobjg"+ args[args.length - 1]);
t[t.length-1]=new AcroDynamicTargetProxy(t[t.length-1],null)}}else break}return t}static UpdateProxyObject(e,t,n){const r=g_acroJSObjMap.get(n);for(var o=0;o<r.length;o++){var s=r[o];if(enable_all_logs)console.log("Update proxy object for ",e,t,s);switch(e){case ODMConstants.ADD_EVENT:if(s._type===ODMConstants.MAP_PROXY){s.childProps.push(t.key);s._size=s.childProps.length;s[t.key]=t.property}else if(s._type===ODMConstants.VECTOR_PROXY){var a=parseInt(t.key);if(a===s._size)s._size++;s[t.key]=t.property}break;case ODMConstants.REMOVE_EVENT:if(s._type===ODMConstants.MAP_PROXY&&s.childProps.indexOf(t.key)!=-1){s.childProps.splice(s.childProps.indexOf(t.key),1);s._size=s.childProps.length;delete s[t.key]}else if(s._type===ODMConstants.VECTOR_PROXY&&t.key in s){s._size--;delete s[t.key]}break;case ODMConstants.REPLACE_EVENT:if(s._type===ODMConstants.MAP_PROXY){s[t.key]=t.newVal}else if(s._type===ODMConstants.VECTOR_PROXY){s[t.key]=t.newVal}break;case ODMConstants.CHANGE_EVENT:if(s._type===ODMConstants.PRIMITIVE_PROXY){s._value=t.newVal}else if(s._type===ODMConstants.MAP_PROXY){
// from the childprops find the old props and remove them from obj first and then chidprops
// and then set the new props and then finally new size
for(var a in s.childProps){delete s[s.childProps[a]]}delete s.childProps;s.childProps=t.newVal.childProps;for(var a in s.childProps){s[s.childProps[a]]=t.newVal[s.childProps[a]]}s._size=s.childProps.length}else if(s._type===ODMConstants.VECTOR_PROXY){
// from the _size find the old props and remove them from obj first and then set the new size
// and new props from eventData.newVal
for(var a=0;a<s._size;a++){delete s[a]}s._size=t.newVal.length;for(var a=0;a<s._size;a++){s[a]=t.newVal[a]}}break}}}static CallVector(e,t){for(var n in e){var r=e[n];var o=r[2];var s=r[1];t[2]=o;s.apply(r[3],t);delete t[2]}}static notifyXMLRequestFailure(e,t){var n={[EVENT_TYPE_STR]:CUSTOM_EVENT_TYPE,[EVENT_PARAMS_STR]:[],[EVENT_NAME_STR]:"RequestFailed"};n[EVENT_PARAMS_STR][0]=e;n[EVENT_PARAMS_STR][1]=t;var r=CustomStringify(n);nativepostmessage(r)}static performXHRRequest(e){
/* 8 arguments will be sent to JS as part of network request. They are as follows :-
            1) Request ID
            2) URL
            3) Method (GET, POST etc.)
            4) Request Headers
            5) Request Body
            6) Request Flag
            7) Timeout data
            8) Response type
        */
// todo aman : Check if can add validation checks around these parameters
const _=e[0];const t=e[1];const n=e[2];// todo : validate that methodType is valid
const r=e[3];const o=e[4];const s=e[5];const a=e[6];// in milliseconds
const i=e[7];if(enable_all_logs)console.log("Starting network call for url and request id = ",t,e[0]);
// todo aman : handle flags
var E=new XMLHttpRequest;E.open(n,t,true);E.responseType=i===1?"blob":"text";E.timeout=a;for(const l in r){if(r.hasOwnProperty(l)){E.setRequestHeader(l,r[l])}}E.onprogress=function(e){var t={[EVENT_TYPE_STR]:CUSTOM_EVENT_TYPE,[EVENT_PARAMS_STR]:[],[EVENT_NAME_STR]:"DownloadProgress"};t[EVENT_PARAMS_STR][0]=_;t[EVENT_PARAMS_STR][1]=e.loaded;t[EVENT_PARAMS_STR][2]=e.total;var n=CustomStringify(t);nativepostmessage(n)};E.upload.onprogress=function(e){var t={[EVENT_TYPE_STR]:CUSTOM_EVENT_TYPE,[EVENT_PARAMS_STR]:[],[EVENT_NAME_STR]:"UploadProgress"};t[EVENT_PARAMS_STR][0]=_;t[EVENT_PARAMS_STR][1]=e.loaded;t[EVENT_PARAMS_STR][2]=e.total;var n=CustomStringify(t);nativepostmessage(n)};E.ontimeout=function(){AcroJS.notifyXMLRequestFailure(_,-1/* used to denote timeout*/)};E.onload=function(){if(i){var c=new FileReader;c.onload=function(){var e=c.result;var t=e.split(",")[1];var n={[EVENT_TYPE_STR]:CUSTOM_EVENT_TYPE,[EVENT_PARAMS_STR]:[],[EVENT_NAME_STR]:"RequestCompleted"};n["eventParams"][0]=_;n["eventParams"][1]=E.status;n["eventParams"][2]=E.statusText;n["eventParams"][3]="ERR_NONE";// TODO aman : Check if we can get error code from xhr and if we use in anywhere
var r="";try{const l=E.getResponseHeader("Content-Type");r=l?l.split(";")[0].trim():""}catch(e){console.error("Error in getting mimetype")}n["eventParams"][4]=r;const o=E.getAllResponseHeaders();
// Convert the header string into an array
const s=o.trim().split(/[\r\n]+/);
// Create a map of header names to values
const a={};s.forEach(e=>{const t=e.split(": ");const n=t.shift();const r=t.join(": ");a[n]=r});n["eventParams"][5]=a;n["eventParams"][6]=t;var i=CustomStringify(n);nativepostmessage(i)};c.readAsDataURL(E.response)}else{var e={[EVENT_TYPE_STR]:CUSTOM_EVENT_TYPE,[EVENT_PARAMS_STR]:[],[EVENT_NAME_STR]:"RequestCompleted"};e["eventParams"][0]=_;e["eventParams"][1]=E.status;e["eventParams"][2]=E.statusText;e["eventParams"][3]="ERR_NONE";// TODO aman : Check if we can get error code from xhr and if we use in anywhere
var t="";try{const a=E.getResponseHeader("Content-Type");t=a?a.split(";")[0].trim():""}catch(e){console.error("Error in getting mimetype")}e["eventParams"][4]=t;const r=E.getAllResponseHeaders();
// Convert the header string into an array
const o=r.trim().split(/[\r\n]+/);
// Create a map of header names to values
const s={};o.forEach(e=>{const t=e.split(": ");const n=t.shift();const r=t.join(": ");s[n]=r});e["eventParams"][5]=s;e["eventParams"][6]=E.response;var n=CustomStringify(e);nativepostmessage(n)}};E.onerror=function(){console.error("Got error for following call, url = ",t,"status = ",E.status);AcroJS.notifyXMLRequestFailure(_,E.status)};
// Send the request
if(o.length>0){const c=o[0];E.send(c);// todo aman : handle decoding of base64 string for binary data
}else{E.send()}}static HandleEventForObj(e,t){var n=t[0];var r=t[1];if(enable_all_logs)console.log("taking call event handler route - ",n,r);this.UpdateProxyObject(n,r,e);var o=this.ConvertResponseArgToProxy(t);var s=GetCallbackArrayForObjId(e,n);this.CallVector(s,o);var a=GetCallbackArrayForObjId(e,"all");this.CallVector(a,o)}static processResponse(e,t,n){
//console.log("processResponse was called start", reponse_id, response,thiz);
var r=_promises[e];if(r)// this is one of the above get, funcall or createcontext response
{if(t.hasOwnProperty("0"))t=t[0];if(RequiresConversionToProxy(t)){
// check if it is a acrojs object
t=new AcroDynamicTargetProxy(t,null)}r.resolve(t);
// remove from _promises
delete _promises[e]}else if(g_functionCallback[e])// this is callback from c++ which was typically earlier supplied as an argument to funccall 
{var o=this.ConvertResponseArgToProxy(t);var s=n.substring(this.specialObjLen);var a=g_SpecialObject[s];if(enable_all_logs)console.log("taking funcion callback route - ",s,e,a,g_functionCallback[e]);delete g_SpecialObject[s];g_functionCallback[e].apply(a,o);delete g_functionCallback[e]}else if(e===APP_MODEL_VIEW_EVENT_RID){try{var i=t[0];var l=t[1];if(i==="setDocumentTitle"){document.title=l[0]}else if(i=="addMaskOauthDialog"){if(!g_isClassicView){document.getElementById("modal-mask").style.display="block"}else{$("#modal-mask").addClass("shown");$("#modal-mask").addClass("alert");$("#modal-mask").removeClass("transparent")}}else if(i=="removeMaskOauthDialog"){if(!g_isClassicView){document.getElementById("modal-mask").style.display="none"}else{$("#modal-mask").removeClass("shown");$("#modal-mask").removeClass("alert");$("#modal-mask").addClass("transparent")}}}catch(e){console.log("Error in handleViewEvent",e)}}else if(e===CALL_EVENT_HANDLER_RID){if(!g_acroJSObjMap.get(n)){if(enable_all_logs)console.log("Object not found in acrojs map, storing the event for later dispatch",n);
// store the object in the map to be dispatched once add listener is called
if(!g_pendingEvents.has(n))g_pendingEvents.set(n,[]);g_pendingEvents.get(n).push(t)}else{this.HandleEventForObj(n,t)}}else if(e==="handleNetworkRequest"){this.performXHRRequest(t)}}}
/* Inject essential objects required by JS for communication with Acrobat odm (for RNA api access) and logAPI */
var odm;if(!odm){odm={};odm.createContext=function(e,t,n,r,o,s){return AcroJS.createContext(e,t,n,r,o,s)};odm.destroyContext=function(){
// not implemented as not called 
}}window.odm=odm;
/* to be implemented */function log(){}function getSessionInfo(){}function startLogSession(){}function endLogSession(){}var logAPI;if(!logAPI){logAPI={};logAPI.log=log;logAPI.getSessionInfo=getSessionInfo;logAPI.startLogSession=startLogSession;logAPI.endLogSession=endLogSession}window.logAPI=logAPI;
// Register message handler fropm c++. This is alternative to execute script api
// and relies on postmessage to communicate
if(window.chrome&&window.chrome.webview&&window.chrome.webview.postMessage){window.chrome.webview.addEventListener("message",function(e){ProcessNativeMessage(e.data)})}
// We also register a global functions ProcessNativeMessage and ProcessNativeJsonMessage to receive message from native c++
// this would be used on mac as direct message listener are not available for wkwebviews
function ProcessNativeMessage(e){if(enable_all_logs)console.log(e);
// For RNA It would a json message, parse it and call AcroJS Event handler
var t=JSON.parse(e);if(enable_all_logs)console.log(t);AcroJS.processResponse(t[0],t[1],t[2])}function ProcessNativeJsonMessage(e){if(enable_all_logs)console.log(e);
// message is JSON message
var t=e;if(enable_all_logs)console.log(t);AcroJS.processResponse(t[0],t[1],t[2])}if(isRNAURL){
/**
     * Removes the `title` attribute from an element or its ancestors up to a specified maximum depth.
     *
     * @param {Element} element - The starting HTML element where the attribute will be removed.
     * @param {number} [maxDepth=5] - The maximum number of ancestor levels to traverse. Defaults to 5.
     * @returns {string|null} - The original `title` attribute value if removed, otherwise `null`.
     * @throws {TypeError} If `element` is not a valid DOM element, or `maxDepth` is not a non-negative number.
     * @example
     * // Example usage:
     * var element = document.querySelector('.my-element');
     * var originalTitle = removeTitleUpDOMTree(element, 3);
     */
function removeTitleUpDOMTree(e,t){if(typeof t==="undefined")t=5;var n=e;for(var r=0;n&&r<t;r++){if(n.hasAttribute("title")){n.dataset.origTitle=n.getAttribute("title");n.removeAttribute("title");return n.dataset.origTitle}n=n.parentElement}return null}
/**
     * Restores the `title` attribute to an element or one of its ancestors up to a specified maximum depth.
     *
     * @param {Element} element - The starting HTML element where the attribute will be restored.
     * @param {number} [maxDepth=5] - The maximum number of ancestor levels to traverse. Defaults to 5.
     * @throws {TypeError} If `element` is not a valid DOM element, or `maxDepth` is not a non-negative number.
     * @example
     * // Example usage:
     * var element = document.querySelector('.my-element');
     * restoreTitle(element, 3);
     */function restoreTitle(e,t){if(typeof t==="undefined")t=5;var n=e;for(var r=0;n&&r<t;r++){if(n.dataset.origTitle){n.setAttribute("title",n.dataset.origTitle);delete n.dataset.origTitle;break}n=n.parentElement}}
// Add mouseover event to remove the title attribute
window.addEventListener("mouseover",function(e){var t=e.target;var n=removeTitleUpDOMTree(t);if(!n)return;
//Send message to native c++ side to show tooltip
var r={};r[METHOD_NAME_ARG_NAME]="toolTipSet";r[FUNC_ARGS_ARG_NAME]={toolTip:n};
//Use setTimeout to un-block event listeners
setTimeout(function(){var e=CustomStringify(r);nativepostmessage(e)},0);function o(t){var n={};n[METHOD_NAME_ARG_NAME]="toolTipHide";n[FUNC_ARGS_ARG_NAME]={toolTip:"unUsed"};
//Use setTimeout to un-block event listeners
setTimeout(function(){var e=CustomStringify(n);nativepostmessage(e);restoreTitle(t);t.removeEventListener("mouseleave",e=>{o(e.target)});t.removeEventListener("wheel",e=>{o(e.target)});t.removeEventListener("mousewheel",e=>{o(e.target)})},0)}
// Add a one-time mouseleave event to restore the title attribute
t.addEventListener("mouseleave",e=>{o(e.target)});// This makes the mouseout listener run only once
// Add a one-time wheel event to restore the title attribute
t.addEventListener("wheel",e=>{o(e.target)});// This makes the wheel listener run only once
// Add a one-time mousewheel event to restore the title attribute
t.addEventListener("mousewheel",e=>{o(e.target)});// This makes the mousewheel listener run only once
})}else{const CheckForBlankViewEveryMs=4500;// 4.5 secs - because native code waits till 5 secs to check for blank view
const CheckForBlankViewTimeOutMs=6e4;// 60 secs
const EVENT_TIME="eventTime";const SetupPerformanceMonitor=()=>{const t=performance.now();let e;let n;let r;
/**
         * Check for contentful paint on event and notify native side to mark the page non-blank
         * @param oneventName
         * @param time
         * @returns true if the view is not blank
         */const o=(e,t=false)=>{
/**`
             * Current blank CEF logic is based on the hypothesis that all the CEF views at present have some text content
             * so check for text content in the page and if it is present then mark the page as non-blank
             * we are doing this to exclude the spinner case where we get first-contentful-paint but the page is still blank
             */
const n=document.body.innerText?document.body.innerText.length>0:false;
// in future enhance it to check for other elements as well in case page didn't contain any text
const r=t?n:true;if(r){var o={};o[METHOD_NAME_ARG_NAME]="PerfPaintEventForNonRNAURLs";o[FUNC_ARGS_ARG_NAME]={[EVENT_NAME_STR]:e,[EVENT_TIME]:Date.now().toString()};
//Use setTimeout to un-block event listeners
setTimeout(function(){var e=CustomStringify(o);
//If window is main window then window.parent will return main window only 
if(isWindows()){window.parent.postMessage(e,"https://rna-v2-resource.acrobat.com");window.parent.postMessage(e,"https://rna-resource.acrobat.com")}else{window.parent.postMessage(e,"wkweb://rna-v2-resource.acrobat.com");window.parent.postMessage(e,"wkweb://rna-resource.acrobat.com")}},0)}return r};const s=()=>{if(e){clearInterval(e)}if(n){n.disconnect()}if(r){r.disconnect()}};
// Check for blank view every 4.5 sec till not blank
const a=()=>{
// check for view contentful paint after every 4.5 sec
e=setInterval(()=>{const e=o("Paint5SecCheck",true);if(enable_all_logs){console.log("Checking for blank view from timer at ",performance.now()," textPresent ",e)}
// clear the interval if text is present or if we have already checked for 1 min
if(e||performance.now()-t>CheckForBlankViewTimeOutMs){s()}},CheckForBlankViewEveryMs)};setTimeout(()=>{a();
/**
             * Blank CEF detection logic
             * Once view become visible, register for checking non-blank view after 4.5 sec
             * Apart from that also register for checking first-contentful-paint and largest-contentful-paint
             * first-contentful-paint is the first paint event which can be seen by the user but could be spinner
             * as well hence checking for text largest-contentful-paint is the largest contentful paint event
             * which is the largest element on the page which is visible to the user
             * If we get any of these events, we will notify native side to mark the page non-blank
             */n=new PerformanceObserver(e=>{e.getEntries().forEach(e=>{if(e.name==="first-contentful-paint"){if(enable_all_logs){console.log(e)}const t=o("FirstContentfulPaint");if(t){s()}else{if(enable_all_logs){console.log("FirstContentfulPaint was blank, so checking for LargestContentfulPaint")}const n=PerformanceObserver.supportedEntryTypes.includes("largest-contentful-paint");if(n){r=new PerformanceObserver(e=>{e.getEntries().forEach(e=>{if(enable_all_logs){console.log(e)}if(e.entryType==="largest-contentful-paint"){const t=o("LargestContentfulPaint");if(t){s()}}})});r.observe({type:"largest-contentful-paint",buffered:true})}}}})});
// observe the first-contentful-paint event type of which is paint
n.observe({type:"paint",buffered:true})},0)};
// register for setTimeout after dom has loaded so that domcontentloaded listerner returns
document.addEventListener("DOMContentLoaded",function(e){setTimeout(()=>{if(document.visibilityState==="visible"){if(enable_all_logs)console.log("View is visible at start time ",performance.now());SetupPerformanceMonitor()}else// wait for view to be visible    
{const e=()=>{if(document.visibilityState==="visible"){if(enable_all_logs)console.log("visible after some time ",performance.now());SetupPerformanceMonitor();document.removeEventListener("visibilitychange",e)}else{if(enable_all_logs)console.log("View became hidden at ",performance.now())}};document.addEventListener("visibilitychange",e)}})})}
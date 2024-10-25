/******/ (function(modules) { // webpackBootstrap
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/gif.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/gif.js":
/*!*******************!*\
  !*** ./js/gif.js ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("  let camera, scene, renderer, container;\r\n  let pointLight;\r\n  let controls = null;\r\n  let materials = [];\r\n  const WIDTH = 128;\r\n  const HEIGHT = 128;\r\n  const OFFSET = 5;\r\n\r\n  function createImgTags() {\r\n    const previewContainer = document.getElementById('previewContainer');\r\n    //get the gif urls from the url params\r\n    const url = new URL(window.location);\r\n    const convertedParams = atob(url.searchParams.get(\"text\"));\r\n    const urls = JSON.parse(decodeURI(convertedParams)).data || [\"https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif\"];\r\n    for(let i = 0; i < urls.length; i++) {\r\n      if(urls[i] === \"\" || !urls[i]) {\r\n        continue;\r\n      }\r\n      createImgTag(previewContainer, `gif${i+1}`, urls[i]);\r\n    }\r\n    return urls.length;\r\n  }\r\n\r\n  function createImgTag(parent, id, url, className = \"gifClass\") {\r\n    let img = document.createElement('img');\r\n    img.src = url;\r\n    img.id = id;\r\n    img.width = WIDTH;\r\n    img.height = HEIGHT;\r\n    img.className = className;\r\n    parent.appendChild(img);\r\n  }\r\n\r\n  function init() {\r\n    container = document.getElementById( 'container' );\r\n    let gifs = [];\r\n    let gifsCache = {};\r\n    let promises = [];\r\n    const gifItems = document.getElementsByClassName('gifClass');\r\n    //load gifs from the dom\r\n    for(let i = 0; i < gifItems.length ; i++) {\r\n      const url = gifItems[i].src;\r\n      let gif = null;\r\n      if(!gifsCache[url]) {\r\n        gif = new SuperGif({ gif: gifItems[i] } );\r\n        gifsCache[url] = { data: gif, indexes: [i] }\r\n      } else {\r\n        gif = gifsCache[url].data;\r\n        gifsCache[url].indexes.push(i)\r\n      }\r\n      gifs[i] = gif;\r\n    }\r\n\r\n    Object.entries(gifsCache).forEach(([key, values]) => {\r\n      const gifLoadedPromised = new Promise(function(resolve, reject) {\r\n          values.data.load(() => {\r\n            resolve(\"ok\");\r\n          });\r\n        });\r\n        promises.push(gifLoadedPromised);\r\n    });\r\n\r\n    Promise.all(promises).then(function(values) {\r\n      initScene();\r\n      start(gifs, gifsCache);\r\n      initShareButton();\r\n    });\r\n  }\r\n\r\n  function initScene() {\r\n     // WebGl render\r\n    try {\r\n      renderer = new THREE.WebGLRenderer();\r\n      renderer.setSize( window.innerWidth, window.innerHeight );\r\n      renderer.autoClear = false;\r\n      container.appendChild( renderer.domElement );\r\n    }\r\n    catch (e) {\r\n       alert(e);\r\n    }\r\n    scene = new THREE.Scene();\r\n\r\n    const fov = 45;\r\n    const width = renderer.domElement.width;\r\n    const height = renderer.domElement.height;\r\n    const aspect = width / height; // view aspect ratio\r\n    camera = new THREE.PerspectiveCamera( fov, aspect );\r\n    camera.position.z = -600;\r\n    camera.position.y = -800;\r\n    camera.lookAt(scene.position);\r\n    camera.updateMatrix();\r\n    controls = new THREE.OrbitControls(camera, renderer.domElement);\r\n    controls.enableDamping = true;\r\n    controls.dampingFactor =  0.10;\r\n    controls.enableZoom = true;\r\n    controls.enablePan = false;\r\n    controls.enableKeys = false;\r\n    controls.rotateSpeed = 3.0;\r\n    controls.zoomSpeed = 1.2;\r\n    controls.panSpeed = 0.8;\r\n    controls.minPolarAngle = Math.PI/6;\r\n    controls.maxPolarAngle = Math.PI/2;\r\n    //controls.minAzimuthAngle = Math.PI/2;\r\n    controls.minAzimuthAngle = -Math.PI;\r\n    controls.maxAzimuthAngle = Math.PI;\r\n    // --- Lights\r\n    pointLight = new THREE.PointLight( 0xffffff, 1.0 );\r\n    scene.add( pointLight );\r\n    pointLight.position.set(0, 100, -800);\r\n  }\r\n\r\n\r\n  function start(gifs, gifsCache) {\r\n    const positions = setPositions(gifs.length);\r\n    for(let i = 0; i < positions.length; i++) {\r\n      const gifcanvas = gifs[i].get_canvas();\r\n      // MATERIAL\r\n      const texture =  new THREE.Texture(gifcanvas);\r\n      const material = new THREE.MeshStandardMaterial({\r\n        color: 0xffffff,\r\n        map: texture\r\n      });\r\n      material.displacementMap = material.map;\r\n      materials.push(material);\r\n      // GEOMETRY\r\n      const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT);\r\n      const mesh = new THREE.Mesh(geometry, material);\r\n      mesh.rotation.y = Math.PI;\r\n      mesh.position.x = positions[i].x;\r\n      mesh.position.y = positions[i].y;\r\n      scene.add(mesh);\r\n    }\r\n  }\r\n\r\n  function writeRow(positionRef, nbItemsByRow, yOFFSET) {\r\n    let positions = positionRef.slice();\r\n    let middleX = (nbItemsByRow / 2) * (WIDTH + OFFSET) - WIDTH/2;\r\n    for(let column = 0; column < nbItemsByRow; column++) {\r\n      positions.push({x: - middleX + ((WIDTH + OFFSET) * column), y: yOFFSET, z: 0});\r\n    }\r\n    return positions;\r\n  }\r\n\r\n  function setPositions(nbItems) {\r\n    let middle = (nbItems / 2) * (WIDTH + OFFSET);\r\n    let positions = [];\r\n    switch(nbItems) {\r\n      case 3:\r\n        middle = WIDTH - WIDTH/2;\r\n        for(let i = 0; i < 2; i++) {\r\n          positions.push({x: - middle + ((WIDTH + OFFSET) * i), y: 0, z: 0});\r\n        }\r\n        positions.push({x: 0, y: HEIGHT + OFFSET, z:0});\r\n      break;\r\n      case 1:\r\n      case 2:\r\n        for(let i = 0; i < nbItems; i++) {\r\n          positions.push({x: - middle + ((WIDTH + OFFSET) * i), y: 0, z: 0});\r\n        }\r\n      break;\r\n      default:\r\n        const itemsByRow = 5;\r\n        const rows = Math.floor(nbItems / itemsByRow);\r\n        let middleY = (Math.round((rows / 2)) * HEIGHT) - HEIGHT/2;\r\n        for(let row = 0; row < rows; row++) {\r\n          positions = writeRow(positions, itemsByRow, - middleY + row * (HEIGHT + OFFSET));\r\n        }\r\n        positions = writeRow(positions, nbItems % itemsByRow, - middleY + rows * (HEIGHT + OFFSET));\r\n      break\r\n    }\r\n    return positions;\r\n  }\r\n\r\n  function update() {\r\n    // todo check controls and renderer\r\n    for(let i = 0; i < materials.length; i++) {\r\n      materials[i].map.needsUpdate = true;\r\n    }\r\n    render();\r\n    window.requestAnimationFrame(update);\r\n  }\r\n\r\n  function render() {\r\n    if(renderer) {\r\n      renderer.clear();\r\n      renderer.render(scene, camera);\r\n    }\r\n  }\r\n\r\n\r\n  function initShareButton() {\r\n    const button = document.getElementById('copyToClipboardButton');\r\n    button.addEventListener('click', copyToClipboard);\r\n    button.addEventListener('mouseout', outCopyToClipboard);\r\n    button.style.display = \"block\";\r\n  }\r\n\r\n  function copyToClipboard() {\r\n    const url = window.location.href;\r\n    navigator.clipboard.writeText(url);\r\n\r\n    const tooltip = document.getElementById(\"myTooltip\");\r\n    tooltip.innerHTML = \"Link copied !\";\r\n  }\r\n\r\n  function outCopyToClipboard() {\r\n    const tooltip = document.getElementById(\"myTooltip\");\r\n    tooltip.innerHTML = \"Copy to clipboard ?\";\r\n  }\r\n\r\n  window.onload = function() {\r\n    createImgTags();\r\n    init();\r\n    update();\r\n  }\n\n//# sourceURL=webpack:///./js/gif.js?");

/***/ })

/******/ });
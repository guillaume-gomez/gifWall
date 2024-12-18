  let camera, scene, renderer, container;
  let pointLight;
  let controls = null;
  let materials = [];
  const WIDTH = 128;
  const HEIGHT = 128;
  const OFFSET = 5;

  function createImgTags() {
    const previewContainer = document.getElementById('previewContainer');
    //get the gif urls from the url params
    const url = new URL(window.location);
    const convertedParams = atob(url.searchParams.get("text"));
    const urls = JSON.parse(decodeURI(convertedParams)).data || ["https://media.giphy.com/media/nXxOjZrbnbRxS/giphy.gif"];
    for(let i = 0; i < urls.length; i++) {
      if(urls[i] === "" || !urls[i]) {
        continue;
      }
      createImgTag(previewContainer, `gif${i+1}`, urls[i]);
    }
    return urls.length;
  }

  function createImgTag(parent, id, url, className = "gifClass") {
    let img = document.createElement('img');
    img.src = url;
    img.id = id;
    img.width = WIDTH;
    img.height = HEIGHT;
    img.className = className;
    parent.appendChild(img);
  }

  function init() {
    container = document.getElementById( 'container' );
    let gifs = [];
    let gifsCache = {};
    let promises = [];
    const gifItems = document.getElementsByClassName('gifClass');
    //load gifs from the dom
    for(let i = 0; i < gifItems.length ; i++) {
      const url = gifItems[i].src;
      let gif = null;
      if(!gifsCache[url]) {
        gif = new SuperGif({ gif: gifItems[i] } );
        gifsCache[url] = { data: gif, indexes: [i] }
      } else {
        gif = gifsCache[url].data;
        gifsCache[url].indexes.push(i)
      }
      gifs[i] = gif;
    }

    Object.entries(gifsCache).forEach(([key, values]) => {
      const gifLoadedPromised = new Promise(function(resolve, reject) {
          values.data.load(() => {
            resolve("ok");
          });
        });
        promises.push(gifLoadedPromised);
    });

    Promise.all(promises).then(function(values) {
      initScene();
      start(gifs, gifsCache);
      initShareButton();
    });
  }

  function initScene() {
     // WebGl render
    try {
      renderer = new THREE.WebGLRenderer();
      renderer.setSize( window.innerWidth, window.innerHeight );
      renderer.autoClear = false;
      container.appendChild( renderer.domElement );
    }
    catch (e) {
       alert(e);
    }
    scene = new THREE.Scene();

    const fov = 45;
    const width = renderer.domElement.width;
    const height = renderer.domElement.height;
    const aspect = width / height; // view aspect ratio
    camera = new THREE.PerspectiveCamera( fov, aspect );
    camera.position.z = -600;
    camera.position.y = -800;
    camera.lookAt(scene.position);
    camera.updateMatrix();
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor =  0.10;
    controls.enableZoom = true;
    controls.enablePan = false;
    controls.enableKeys = false;
    controls.rotateSpeed = 3.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.minPolarAngle = Math.PI/6;
    controls.maxPolarAngle = Math.PI/2;
    //controls.minAzimuthAngle = Math.PI/2;
    controls.minAzimuthAngle = -Math.PI;
    controls.maxAzimuthAngle = Math.PI;
    // --- Lights
    pointLight = new THREE.PointLight( 0xffffff, 1.0 );
    scene.add( pointLight );
    pointLight.position.set(0, 100, -800);
  }


  function start(gifs, gifsCache) {
    const positions = setPositions(gifs.length);
    for(let i = 0; i < positions.length; i++) {
      const gifcanvas = gifs[i].get_canvas();
      // MATERIAL
      const texture =  new THREE.Texture(gifcanvas);
      const material = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        map: texture
      });
      material.displacementMap = material.map;
      materials.push(material);
      // GEOMETRY
      const geometry = new THREE.PlaneGeometry(WIDTH, HEIGHT);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.y = Math.PI;
      mesh.position.x = positions[i].x;
      mesh.position.y = positions[i].y;
      scene.add(mesh);
    }
  }

  function writeRow(positionRef, nbItemsByRow, yOFFSET) {
    let positions = positionRef.slice();
    let middleX = (nbItemsByRow / 2) * (WIDTH + OFFSET) - WIDTH/2;
    for(let column = 0; column < nbItemsByRow; column++) {
      positions.push({x: - middleX + ((WIDTH + OFFSET) * column), y: yOFFSET, z: 0});
    }
    return positions;
  }

  function setPositions(nbItems) {
    let middle = (nbItems / 2) * (WIDTH + OFFSET);
    let positions = [];
    switch(nbItems) {
      case 3:
        middle = WIDTH - WIDTH/2;
        for(let i = 0; i < 2; i++) {
          positions.push({x: - middle + ((WIDTH + OFFSET) * i), y: 0, z: 0});
        }
        positions.push({x: 0, y: HEIGHT + OFFSET, z:0});
      break;
      case 1:
      case 2:
        for(let i = 0; i < nbItems; i++) {
          positions.push({x: - middle + ((WIDTH + OFFSET) * i), y: 0, z: 0});
        }
      break;
      default:
        const itemsByRow = 5;
        const rows = Math.floor(nbItems / itemsByRow);
        let middleY = (Math.round((rows / 2)) * HEIGHT) - HEIGHT/2;
        for(let row = 0; row < rows; row++) {
          positions = writeRow(positions, itemsByRow, - middleY + row * (HEIGHT + OFFSET));
        }
        positions = writeRow(positions, nbItems % itemsByRow, - middleY + rows * (HEIGHT + OFFSET));
      break
    }
    return positions;
  }

  function update() {
    // todo check controls and renderer
    for(let i = 0; i < materials.length; i++) {
      materials[i].map.needsUpdate = true;
    }
    render();
    window.requestAnimationFrame(update);
  }

  function render() {
    if(renderer) {
      renderer.clear();
      renderer.render(scene, camera);
    }
  }


  function initShareButton() {
    const button = document.getElementById('copyToClipboardButton');
    button.addEventListener('click', copyToClipboard);
    button.addEventListener('mouseout', outCopyToClipboard);
    button.style.display = "block";
  }

  function copyToClipboard() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);

    const tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Link copied !";
  }

  function outCopyToClipboard() {
    const tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copy to clipboard ?";
  }

  window.onload = function() {
    createImgTags();
    init();
    update();
  }
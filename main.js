import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

function Curves() {
  this.canvas = document.querySelector("canvas");
  this.scene = null;
  this.camera = null;
  this.geometry = null;
  this.material = null;
  this.renderer = null;
  this.mesh = null;
  this.light = null;
  this.controls = null;
  this.size = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  this.curve = null;
  this.fov = 75;
}

Curves.prototype.createScene = function () {
  this.scene = new THREE.Scene();
  this.scene.add(new THREE.GridHelper(20, 20));
};

Curves.prototype.createCamera = function () {
  this.camera = new THREE.PerspectiveCamera(
    this.fov,
    this.size.width / this.size.height
  );
  this.camera.position.z = 17;
};

Curves.prototype.createModel = function () {
  const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -10, 0, 10 ),
	new THREE.Vector3( -5, 5, 5 ),
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 5, -5, 5 ),
	new THREE.Vector3( 10, 0, 10 )
] );
  this.geometry = new THREE.TubeGeometry(curve, 100, 0.02, 2, false);
  this.material = new THREE.ShaderMaterial({ 
    uniforms:{
      uTime: {value: 0},
      uTexture: {value: new THREE.TextureLoader().load("./img/grad-2.jpg")}
    },
    vertexShader: this.vertex(),
    fragmentShader: this.fragment(),
   });
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.scene.add(this.mesh);
};

Curves.prototype.vertex = function() {
  return `
  uniform float uTime;

  varying float vMovementY;
  varying vec2 vUv;
  
  void main() {
    vec3 newPosition = position;
    float PI = 3.141592653589793238462643383279502884197;
    float movementY = cos((newPosition.y + uTime/1.) * 0.3 * PI);
    newPosition.z += sin((newPosition.x + uTime/1.) * 0.1 * PI);
    newPosition.x += sin((newPosition.x + uTime/1.) * 0.1 * PI);
    newPosition.y += movementY;

    vMovementY = movementY;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.); 
  }
  `;
}

Curves.prototype.fragment = function() {
  return `
  uniform sampler2D uTexture;

  varying float vMovementY;
  varying vec2 vUv;
  
  void main() {
    // Variant 1
    // vec3 color1 = vec3(0.165,1.,0.471);
    // vec3 color2 = vec3(0.145,0.541,0.906);
    // vec3 finalColor = mix(color1, color2, 0.5 * (vMovementY + 1.));

    // Variant2 - Working one with small dots
    vec4 texture = texture2D(uTexture, vUv);
    texture.b *= 0.05 / (1. * vMovementY * 1. + 1.);
    // texture.rgb *= 0.05 / (1. * vMovementY * 1. + 1.);

    // Variant3 - (Only Picture)
    // vec4 texture = texture2D(uTexture, vUv);
    
    gl_FragColor = texture;

  }
  `;
}

Curves.prototype.createModel2 = function () {
  const curve = new THREE.CatmullRomCurve3( [
	new THREE.Vector3( -10, 0, 10 ),
	new THREE.Vector3( -5, 5, 5 ),
	new THREE.Vector3( 0, 0, 0 ),
	new THREE.Vector3( 5, -5, 5 ),
	new THREE.Vector3( 10, 0, 10 )
] );
  this.geometry2 = new THREE.TubeGeometry(curve, 100, 0.02, 2, false);
  this.material2 = new THREE.ShaderMaterial({ 
    uniforms:{
      uTime: {value: 0},
      uTexture: {value: new THREE.TextureLoader().load("./img/grad-2.jpg")}
    },
    vertexShader: this.vertex2(),
    fragmentShader: this.fragment2(),
    blending: THREE.AdditiveBlending,
   });
  this.mesh2 = new THREE.Mesh(this.geometry2, this.material2);
  this.scene.add(this.mesh2);
};

Curves.prototype.vertex2 = function() {
  return `
  uniform float uTime;

  varying float vMovementY;
  varying vec2 vUv;
  
  void main() {
    vec3 newPosition = position;
    float PI = 3.141592653589793238462643383279502884197;
    float movementY = cos((newPosition.y + uTime/1.) * 0.3 * PI);
    newPosition.z += sin((newPosition.x + uTime/1.) * 0.1 * PI);
    newPosition.x += sin((newPosition.x + uTime/1.) * 0.1 * PI);
    newPosition.y += movementY;

    vMovementY = movementY;
    vUv = uv;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.); 
  }
  `;
}

Curves.prototype.fragment2 = function() {
  return `
  uniform sampler2D uTexture;

  varying float vMovementY;
  varying vec2 vUv;
  
  void main() {
    // Variant 1
    // vec3 color1 = vec3(0.165,1.,0.471);
    // vec3 color2 = vec3(0.145,0.541,0.906);
    // vec3 finalColor = mix(color1, color2, 0.5 * (vMovementY + 1.));

    // Variant2 - Working one with small dots
    // texture.rgb *= 0.05 / (1. * vMovementY * 1. + 1.);

    // Variant3 (Only Picture) - !IMPORTANT Add second material and using variant2
    vec4 texture = texture2D(uTexture, vUv);
    
    gl_FragColor = texture;

  }
  `;
}

Curves.prototype.createRenderer = function () {
  this.renderer = new THREE.WebGLRenderer({
    canvas: this.canvas,
    antialias: true,
    alpha: false,
  });
  this.renderer.setSize(this.size.width, this.size.height);
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  this.renderer.render(this.scene, this.camera);
};

Curves.prototype.resize = function () {
  let ww = window.innerWidth;

  window.addEventListener("resize", () => {
    if (ww !== window.innerWidth) {
      ww = window.innerWidth;

      this.size.width = window.innerWidth;
      this.size.height = window.innerHeight;
      this.renderer.setSize(this.size.width, this.size.height);
      this.camera.aspect = this.size.width / this.size.height;
      this.camera.updateProjectionMatrix();
    }
  });
};

Curves.prototype.createControls = function () {
  this.controls = new OrbitControls(this.camera, this.canvas);
};

Curves.prototype.animate = function () {
  gsap.ticker.add((time) => {
    this.material.uniforms.uTime.value = time;
    this.material2.uniforms.uTime.value = time;

    this.renderer.render(this.scene, this.camera);
    this.controls.update();
  });
};

Curves.prototype.init = function () {
  this.createScene();
  this.createCamera();
  this.createModel();
  this.createModel2();
  this.createRenderer();
  this.createControls();
  this.resize();
  this.animate();
};

new Curves().init();

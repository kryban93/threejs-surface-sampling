import * as THREE from 'https://threejs.org/build/three.module.js';

window.addEventListener('DOMContentLoaded', init);

let renderer, camera, scene;

let windowSizes = {
	HEIGHT: window.innerHeight,
	WIDTH: window.innerWidth,
};

function init() {
	const container = document.getElementById('container');

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(windowSizes.WIDTH, windowSizes.HEIGHT);
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);
}

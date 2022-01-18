import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', handleWindowResize);

let renderer,
	camera,
	scene,
	dog,
	sampler,
	path,
	pathsArray = [];

let windowSizes = {
	HEIGHT: window.innerHeight,
	WIDTH: window.innerWidth,
};

const cameraOptions = {
	aspectRatio: windowSizes.WIDTH / windowSizes.HEIGHT,
	fieldOfView: 75,
	nearPlane: 0.1,
	farPlane: 1000,
	position: {
		x: 0,
		y: 100,
		z: 200,
	},
};

const lineMaterials = [
	new THREE.LineBasicMaterial({ color: 0xfaad80, transparent: true, opacity: 0.5 }),
	new THREE.LineBasicMaterial({ color: '#e35214', transparent: true, opacity: 0.5 }),
	new THREE.LineBasicMaterial({ color: '#fcede6', transparent: true, opacity: 0.5 }),
	new THREE.LineBasicMaterial({ color: '#4f2315', transparent: true, opacity: 0.5 }),
];

const tempPosition = new THREE.Vector3();

function init() {
	const container = document.getElementById('container');

	renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(windowSizes.WIDTH, windowSizes.HEIGHT);
	renderer.setPixelRatio(window.devicePixelRatio);
	container.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		cameraOptions.fieldOfView,
		cameraOptions.aspectRatio,
		cameraOptions.nearPlane,
		cameraOptions.farPlane
	);
	camera.position.set(10, 15, 15);

	const controls = new OrbitControls(camera, renderer.domElement);

	scene.add(new THREE.AmbientLight(0x555555));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(20, 20, 0);
	scene.add(light);

	const loader = new OBJLoader();

	loader.load('../assets/dog.obj', (object) => {
		dog = object.children[0];
		dog.material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			transparent: true,
			opacity: 0.001,
		});
		dog.scale.set(10, 10, 10);
		scene.add(dog);

		sampler = new MeshSurfaceSampler(dog).build();

		const paths = new THREE.Group();

		for (let i = 0; i < 4; i++) {
			const path = new Path(i);
			pathsArray.push(path);
			paths.add(path.line);
		}

		scene.add(paths);

		animate();
	});
}

function handleWindowResize() {
	windowSizes.HEIGHT = window.innerHeight;
	windowSizes.WIDTH = window.innerWidth;
	renderer.setSize(windowSizes.WIDTH, windowSizes.HEIGHT);
	camera.aspectRatio = windowSizes.WIDTH / windowSizes.HEIGHT;
	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame(animate);

	pathsArray.forEach((path) => {
		if (path.vertices.length < 10000) {
			path.update();
		}
	});
	renderer.render(scene, camera);
}

class Path {
	constructor(index) {
		this.vertices = [];
		this.geometry = new THREE.BufferGeometry();
		this.material = lineMaterials[index % 4];
		this.line = new THREE.Line(this.geometry, this.material);

		sampler.sample(tempPosition);
		this.previousPoint = tempPosition.clone();
	}

	update() {
		let pointFound = false;

		while (!pointFound) {
			sampler.sample(tempPosition);

			if (tempPosition.distanceTo(this.previousPoint) < 0.5) {
				this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
				this.previousPoint = tempPosition.clone();
				pointFound = true;
			}
		}
		this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.vertices, 3));
	}
}

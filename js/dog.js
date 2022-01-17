import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';
import { OBJLoader } from 'https://threejs.org/examples/jsm/loaders/OBJLoader.js';

window.addEventListener('DOMContentLoaded', init);

let renderer,
	camera,
	scene,
	dog,
	sampler,
	vertices = [],
	colors = [],
	sparklesGeometry,
	points;

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

const palette = [
	new THREE.Color('#FAAD80'),
	new THREE.Color('#e35214'),
	new THREE.Color('#fcede6'),
	new THREE.Color('#4f2315'),
];

const tempPosition = new THREE.Vector3();

function init() {
	const container = document.getElementById('container');

	renderer = new THREE.WebGLRenderer({ antialias: true });
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
		scene.add(dog);

		sampler = new MeshSurfaceSampler(dog).build();

		sparklesGeometry = new THREE.BufferGeometry();
		const sparklesMaterial = new THREE.PointsMaterial({
			size: 0.1,
			alphaTest: 0.2,
			vertexColors: true,
		});

		points = new THREE.Points(sparklesGeometry, sparklesMaterial);

		scene.add(points);

		animate();
	});
}

function addPoint() {
	sampler.sample(tempPosition);
	vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);
	sparklesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

	const color = palette[Math.floor(Math.random() * palette.length)];
	colors.push(color.r, color.g, color.b);
	sparklesGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}

function animate() {
	requestAnimationFrame(animate);

	addPoint();
	dog.rotation.y += 0.001;
	points.rotation.y += 0.001;

	renderer.render(scene, camera);
}

import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { MeshSurfaceSampler } from 'https://threejs.org/examples/jsm/math/MeshSurfaceSampler.js';

window.addEventListener('DOMContentLoaded', init);
window.addEventListener('resize', handleWindowResize);

let renderer, camera, scene, box, spheres;

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
	camera.position.set(2, 2, 4);

	const controls = new OrbitControls(camera, renderer.domElement);

	scene.add(new THREE.AmbientLight(0x555555));

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(20, 20, 0);
	scene.add(light);

	const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
	const boxMaterial = new THREE.MeshBasicMaterial({
		wireframe: true,
		color: 0x666ccf,
	});
	box = new THREE.Mesh(boxGeometry, boxMaterial);
	scene.add(box);

	const sampler = new MeshSurfaceSampler(box).build();

	const sphereGeometry = new THREE.SphereGeometry(0.05, 6, 6);
	const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffdddd });
	spheres = new THREE.InstancedMesh(sphereGeometry, sphereMaterial, 300);

	const tempPosition = new THREE.Vector3();
	const tempObject = new THREE.Object3D();
	for (let i = 0; i < 300; i++) {
		sampler.sample(tempPosition);
		tempObject.position.set(tempPosition.x, tempPosition.y, tempPosition.z);
		tempObject.scale.setScalar(Math.random() * 0.2 + 0.1);
		tempObject.updateMatrix();
		spheres.setMatrixAt(i, tempObject.matrix);
	}
	scene.add(spheres);

	animate();
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
	box.rotation.y += 0.01;
	spheres.rotation.y += 0.01;

	renderer.render(scene, camera);
}

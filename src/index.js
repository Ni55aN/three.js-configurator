import './public-path';
import './assets/styles/style.css';
import 'normalize.css';

import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import GUI from './gui';
import bin from './assets/models/model.bin';
import model from './assets/models/model.gltf';
import { getEnvMap } from './envmap';
import { initLights } from './lights';
import Car from './car';
import { VIEW_ANGLE } from './consts';

const OrbitControls = require('three-orbit-controls')(THREE)

class Configurator {

    constructor(container, width, height) {
        this.clock = new THREE.Clock();
        this.car = new Car();
        this.container = container;
        this.width = width;
        this.height = height;
    }

    async loadGLTF() {
        let loader = new GLTFLoader();

        loader.load(model, async (data) => {
            data.scene.traverse(this.traverseMeshes.bind(this));
            this.setupAnimations(data);

            this.scene.add(data.scene);
        }, undefined, console.error);
    }

    traverseMeshes(node) {
        let { car } = this;

        node.receiveShadow = true;
        node.castShadow = true;

        if (node.name.match(/wheel_f(r|l)/)) {
            node.rotation.order = 'YXZ';
            car.wheels.front.push(node);
        }
        else if (node.name.match(/wheel_r(r|l)/))
            car.wheels.rear.push(node);
        else if (node.name.match(/front_lights/))
            car.lights.front.push(node);
        else if (node.name.match(/rear_lights/))
            car.lights.rear.push(node);
        
        if (node.material && (node.material.isMeshStandardMaterial ||
                (node.material.isShaderMaterial && node.material.envMap !== undefined))) {

            node.material.envMap = this.environmentMap;
            node.material.needsUpdate = true;
            if (node.material.name == 'main_material')
                car.mainMaterial = node.material;
            else if (node.material.name == 'wheel_material')
                car.wheelMaterial = node.material;
        }
    }

    setupAnimations(data) {
        if (!data.animations || !data.animations.length) return;
        this.mixer = new THREE.AnimationMixer(data.scene);

        this.car.doors.action = this.mixer.clipAction(data.animations.find(a => a.name === 'animation_0'));

        this.car.doors.action.play();
        this.car.doors.action.timeScale = 0;
    }

    async init() {
        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, this.width() / this.height(), 0.01, 100);
        this.camera.position.z = -9;
        this.camera.position.x = 8;
        this.camera.position.y = 6;
        
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setClearColor(0x0c0c82);
        this.renderer.physicallyBasedShading = true;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.width(), this.height()) ;
    
        this.container.appendChild(this.renderer.domElement);
    
        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    
        this.scene = new THREE.Scene();
        this.environmentMap = getEnvMap();

        window.addEventListener('resize', () => {
            this.camera.aspect = this.width() / this.height();
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width(), this.height());
        });

        await this.loadGLTF();
        initLights(this.scene);
        GUI.init(this.car);
    }  

    animate() {
        requestAnimationFrame(this.animate.bind(this));
    
        if (this.mixer) this.mixer.update(this.clock.getDelta());
        this.orbitControls.update();

        this.car.update();

        this.renderer.render(this.scene, this.camera);
    }
}

export {
    Configurator
}
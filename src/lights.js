import * as THREE from 'three';
import { VIEW_ANGLE } from './consts';

function createSpotLight(intens, dist) {
    var l = new THREE.SpotLight(0xffffff, intens, dist, 90, 50, 2);
        
    l.castShadow = true;
    l.shadow.camera.fov = VIEW_ANGLE;
    l.shadow.camera.near = 0.5;
    l.shadow.camera.far = 100;   
    l.shadow.bias = -0.0001;
    l.shadow.mapSize.width = 2048;
    l.shadow.mapSize.height = 2048;
    return l;
}

export function initLights(scene) {
    
    var sun = createSpotLight(2, 80);

    sun.position.x = 50;
    sun.position.y = 50;

    var l = createSpotLight(2, 90);

    l.position.y = 60;

    var light2 = new THREE.HemisphereLight(0xffffff, 0x999999, 0.5);

    [sun, l, light2].map(l => scene.add(l));
}
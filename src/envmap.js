import * as THREE from 'three';
import posx from './assets/images/env/1/posx.jpg';
import negx from './assets/images/env/1/negx.jpg';
import posy from './assets/images/env/1/posy.jpg';
import negy from './assets/images/env/1/negy.jpg';
import posz from './assets/images/env/1/posz.jpg';
import negz from './assets/images/env/1/negz.jpg';

export function getEnvMap() {
    const urls = [posx, negx, posy, negy, posz, negz];
    const map = new THREE.CubeTextureLoader().load(urls);

    map.format = THREE.RGBFormat;

    return map;
}
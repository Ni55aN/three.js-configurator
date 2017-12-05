
var VIEW_ANGLE = 45;
var camera, scene, renderer;
var environmentMap;
var orbitControls, loader;

var car = {
    speed: 0.2,
    steer: 0,
    wheels: {
        front: [],
        rear: [],
        rotation: 0,
        update() {
            var self = this;

            this.front.forEach(w => w.rotation.y = car.steer);
            [...this.front, ...this.rear].forEach(w => w.rotation.x = self.rotation-=car.speed);
        }
    },
    lights: {
        turnedOn: false,
        reaction: 0.1,
        maxBrightness: 0.8,
        brightness: 0,
        front: [],
        rear: [],
        turn(on = true) {
            this.turnedOn = on;
        },
        update() {
            this.brightness += this.turnedOn ? this.reaction : -this.reaction;
            this.brightness = Math.max(0, Math.min(this.maxBrightness, this.brightness));

            var self = this;
            
            this.front.forEach(l => l.material.emissive.setRGB(self.brightness, self.brightness, self.brightness));
            this.rear.forEach(l =>
                l.material.emissive.r = self.brightness);
        
        }
    }
};

init();
animation();

function getEnvMap() {

    if (environmentMap) {

        return environmentMap;

    }

    var path = window.assetsPath+'env/1/';
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];

    environmentMap = new THREE.CubeTextureLoader().load(urls);
    environmentMap.format = THREE.RGBFormat;
    return environmentMap;

}

function loadGLTF() {
    loader = new THREE.GLTFLoader();
  
    loader.load(window.assetsPath+'model.gltf', function (data) {

        let envMap = getEnvMap();
      
        data.scene.traverse(function (node) {
      
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

                node.material.envMap = envMap;
                node.material.needsUpdate = true;
                castShadow = true;
      
            }
      
        });
      
        //  scene.background = envMap;
      
        scene.add(data.scene);

    }, undefined, function (error) {
        
        console.error(error);
  
    });
}

function init() {
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, window.innerWidth / window.innerHeight, 0.01, 100);
    camera.position.z = -9;
    camera.position.x = 8;
    camera.position.y = 6;
    
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x0c0c82);
    renderer.physicallyBasedShading = true;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight) ;
  
    document.body.appendChild(renderer.domElement);
  
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
  
    scene = new THREE.Scene();
    
    loadGLTF();
    initLights();
    initGUI();
}  

function initGUI() {
    var lightToggler = document.querySelector('.controls .light');
    var speedControl = document.querySelector('.controls .speed');
    var steerControl = document.querySelector('.controls .steer');

    lightToggler.onclick = () => {
        car.lights.turn(!car.lights.turnedOn);
    }

    speedControl.oninput = () => {
        car.speed = Math.pow(speedControl.value, 1/4)/100;
    }
    steerControl.oninput = () => {
        car.steer = steerControl.value / 100;
    }
}

function createStopLight(intens, dist) {
    var l = new THREE.SpotLight(0xffffff, intens, dist, 90, 50, 2);
        
    l.castShadow = true;
    l.shadow.camera.fov = VIEW_ANGLE;
    l.shadow.camera.near = 0.5;
    l.shadow.camera.far = 100;   
    l.shadow.bias = -0.0001;
    l.shadow.mapSize.width = 2048;
    l.shadow.mapSize.width.height = 2048;
    return l;
}

function initLights() {
    
    var sun = createStopLight(2, 80);

    sun.position.x = 50;
    sun.position.y = 50;
    scene.add(sun);

    var l = createStopLight(2, 90);

    l.position.y = 60;
    scene.add(l);

    var light2 = new THREE.HemisphereLight(0xffffff, 0x999999, 0.5);

    scene.add(light2);
}

function animation() {
    requestAnimationFrame(animation);
  
    orbitControls.update();

    car.wheels.update();
    car.lights.update();

    renderer.render(scene, camera);
  
}
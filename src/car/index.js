export default class Car {

    constructor() {
        this.speed = 0.2;
        this.steer = 0;
        this.mainMaterial = null;
        this.wheelMaterial = null;

        this.doors = {
            openSpeed: 0.02,
            state: 0,
            action: null,
            needOpen: false
        }

        this.wheels = {
            front: [],
            rear: [],
            rotation: 0
        }

        this.lights = {
            turnedOn: false,
            reaction: 0.1,
            maxBrightness: 0.8,
            brightness: 0,
            front: [],
            rear: []
        }
    }

    openDoors() {
        this.doors.needOpen = true;
    }

    closeDoors() {
        this.doors.needOpen = false;
    }

    updateDoors() {
        const { doors } = this;

        if (doors.needOpen)
            doors.state += doors.openSpeed;
        else
            doors.state -= doors.openSpeed;

        doors.state = Math.max(0, Math.min(1, doors.state));

        if (doors.action)
            doors.action.time = doors.state;
    }

    updateWheels() {
        const { wheels } = this;

        wheels.front.forEach(w => w.rotation.y = -this.steer);
        [...wheels.front, ...wheels.rear].forEach(w => w.rotation.x = wheels.rotation -= this.speed);
    }

    turnLights(on = true) {
        this.lights.turnedOn = on;
    }

    updateLights() {
        const { lights } = this;

        lights.brightness += lights.turnedOn ? lights.reaction : -lights.reaction;
        lights.brightness = Math.max(0, Math.min(lights.maxBrightness, lights.brightness));

        lights.front.forEach(l => l.material.emissive.setRGB(lights.brightness, lights.brightness, lights.brightness));
        lights.rear.forEach(l => l.material.emissive.r = lights.brightness);
    }

    update() {
        this.updateWheels();
        this.updateLights();
        this.updateDoors();
    }
}
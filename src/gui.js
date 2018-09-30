const qs = selector => document.querySelector(selector)

function init(car) {
    qs('.controls .light').onclick = () => {
        car.turnLights(!car.lights.turnedOn);
    }

    qs('.controls .doors').onclick = () => {
        if (car.doors.needOpen)
            car.closeDoors();
        else
            car.openDoors();
    }

    qs('.controls .mainColor').oninput = e => {
        car.mainMaterial.color.setStyle(e.srcElement.value);
    }

    qs('.controls .wheelColor').oninput = e => {
        car.wheelMaterial.color.setStyle(e.srcElement.value);
    }

    qs('.controls .speed').oninput = e => {
        car.speed = Math.pow(e.srcElement.value, 1/4)/100;
    }

    qs('.controls .steer').oninput = e => {
        car.steer = e.srcElement.value / 100;
    }
}

export default {
    init
}
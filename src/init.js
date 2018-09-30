import { Configurator } from './index';

(async () => {
    const configurator = new Configurator(
        document.querySelector('#configurator-view'), 
        () => window.innerWidth,
        () => window.innerHeight
    );

    await configurator.init();
    configurator.animate();
})();
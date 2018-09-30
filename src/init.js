import { Configurator } from './index';

(async () => {
    const configurator = new Configurator();

    await configurator.init();
    configurator.animate();
})();
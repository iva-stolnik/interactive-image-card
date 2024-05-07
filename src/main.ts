import type { Config, Hass, CustomHAElement } from '@/types';
import { defineCustomElement } from 'vue';
import MyApp from './App.vue';

if (!customElements.get('interactive-image-card-ce')) {
    const VueCustomElement = defineCustomElement(MyApp);
    customElements.define('interactive-image-card-ce', VueCustomElement);
}

class VueCustomCard extends HTMLElement {
    private vueElement: CustomHAElement | null = null;
    private config: Config;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.config = {} as Config;
    }

    set hass(hass: Hass) {
        if (this.vueElement) {
            this.vueElement.hass = hass;
        }
    }

    setConfig(config: Config) {
        if (!config) {
            return;
        }

        this.config = config;
        if (this.vueElement) {
            this.vueElement.config = this.config;
        }
    }

    createVueApp() {
        this.vueElement = document.createElement('interactive-image-card-ce');
        this.shadowRoot!.appendChild(this.vueElement);
        this.vueElement.config = this.config;
    }

    connectedCallback() {
        if (!this.vueElement) {
            this.createVueApp();
        }
    }

    disconnectedCallback() {
        if (this.vueElement) {
            this.shadowRoot!.removeChild(this.vueElement);
            this.vueElement = null;
        }
    }
}

if (!customElements.get('interactive-image-card')) {
    customElements.define('interactive-image-card', VueCustomCard);
}

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


(window as any).customCards = (window as any).customCards || [];

if((window as any).customCards.length)
{
    let found = false;
    for (const item of (window as any).customCards)
    {
        if(item.type === 'interactive-image-card')
        {
            found = true;
            break;
        }
    }
    if(!found)
    {
        (window as any).customCards.push({
            type: 'interactive-image-card',
            name: 'Interactive Image Card',
            preview: true,
            description: 'Interactive image card for Home Assistant made by Iva Stolnik',
        });
    }
}



if (!customElements.get('interactive-image-card')) {
    
    customElements.define('interactive-image-card', VueCustomCard);
}

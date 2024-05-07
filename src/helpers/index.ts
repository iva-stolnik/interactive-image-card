import type { Hass } from '@/types';

export function calculateImageHeight(e: Event) {
    const event = e as Event & { target: HTMLInputElement };

    if (event.target.height) {
        return event.target.height;
    }

    return event.target.clientHeight;
}

export function callService(data: any, hass: Hass) {
    let domain;

    if (data.service && data.service === 'show_more') {
        const event = new CustomEvent('hass-more-info', {
            detail: { entityId: data.entity_id },
            bubbles: true,
            composed: true
        });

        window.document.querySelector('home-assistant')?.dispatchEvent(event);
        return;
    }

    if (data.domain) {
        domain = data.domain;
    } else if (data.service) {
        // camera specific
        let entity = data.entity_id
        if(typeof data.entity_id !== 'string')
        {
            entity = entity[0]
        }
        domain = data.service === 'ptz' ? 'onvif' : entity.split('.')[0];
    }

    if(!domain || !data.service || !data.entity_id) return; // todo return error, new component with ha-alert?

    hass.callService(domain, data.service, data.service_data, {
        entity_id: data.entity_id
    });
}

export function generateYAML(obj: any, indent: string = '') {
    let yaml = '';

    for (const key in obj) {
        if (Array.isArray(obj[key])) {
            yaml += `${indent}${key}:\n`;
            obj[key].forEach((item) => {
                // Handle special case for entity_id to ensure proper YAML array formatting
                if (key === 'entity_id' && typeof item === 'string') {
                    yaml += `${indent}  - ${item}\n`;
                } else {
                    let firstProp = true;
                    for (const prop in item) {
                        if (firstProp) {
                            yaml += `${indent}  - `;
                            firstProp = false;
                        } else {
                            yaml += `${indent}    `;
                        }

                        // Recursive call to handle nested objects
                        if (typeof item[prop] === 'object' && !Array.isArray(item[prop]) && item[prop] !== null) {
                            yaml += `${prop}:\n${generateYAML(item[prop], indent + '      ')}`;
                        } else {
                            // Ensure array elements are formatted correctly
                            if (Array.isArray(item[prop])) {
                                yaml += `${prop}:`;
                                item[prop].forEach((el) => {
                                    yaml += `\n${indent}      - ${el}`;
                                });
                            } else {
                                yaml += `${prop}: ${item[prop]}`;
                            }
                        }
                        yaml += `\n`;
                    }
                }
            });
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            yaml += `${indent}${key}:\n${generateYAML(obj[key], indent + '  ')}\n`;
        } else {
            yaml += `${indent}${key}: ${obj[key]}\n`;
        }
    }

    return yaml;
}


export function copyYAMLToClipboard(YAMLconfig: string, openConfig: boolean) {
    // copy YAML to clipboard
    const url = `${window.location.pathname}?edit=1`;

    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(YAMLconfig)
            .then(() => {
                if (openConfig) {
                    history.pushState(null, '', url);
                    window.location.reload();
                }
            })
            .catch(() => {
                //
            });
    } else {
        // fallback to http served HA
        const textarea = document.createElement('textarea');
        textarea.textContent = YAMLconfig;
        textarea.style.position = 'fixed';

        document.body.appendChild(textarea);
        textarea.select();
        const successful = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (successful && openConfig) {
            history.pushState(null, '', url);
            window.location.reload();
        }
    }
}


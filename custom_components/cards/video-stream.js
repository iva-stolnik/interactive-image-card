const LitElement =
    window.LitElement ||
    Object.getPrototypeOf(
        customElements.get("ha-panel-lovelace") || customElements.get("hc-lovelace")
    );
const { html } = LitElement.prototype;
class InteractiveVideo extends LitElement {
    constructor() {
        super()
        this.hass = null;
        this.entity = null;
        this.width = '300';
    }
render() {
    return html`
            <hui-image style="width:${this.width}px"
                .hass=${this.hass}
                .entity=${this.entity}
                .cameraImage=${this.entity}
                cameraView="live"
                aspectRatio="16:9"
            ></hui-image>
    `;
}
}

customElements.define('interactive-video-component', InteractiveVideo);

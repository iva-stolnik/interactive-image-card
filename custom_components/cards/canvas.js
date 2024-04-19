const LitElement =
    window.LitElement ||
    Object.getPrototypeOf(
        customElements.get("ha-panel-lovelace") || customElements.get("hc-lovelace")
    );
const { html } = LitElement.prototype;

class InteractiveComponent extends LitElement {
    static get properties() {

        return {
            deleteDravingPoints: { type: Boolean },
            deleteLastPoint: { type: Boolean },
            height: { type: String }
        }
    }
    constructor() {
        super()
        this.height = 0;
        this.style = null;
        this.canvas = null;
        this.ctx = null;
        this.drawingPoints = [];
        this.drawingPointsForSVG = [];
        this.pressIsOn = false;
        this.deleteDravingPoints = null;
        this.deleteLastPoint = null;
    }
    updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('deleteDravingPoints') && changedProperties.get('deleteDravingPoints') !== undefined) {
            this.deleteDrawing()
        }
        else if (changedProperties.has('deleteLastPoint') && changedProperties.get('deleteLastPoint') !== undefined) {
            this.undoLastDraw()
        }
    }

    dispatchCanvasEvent() {
        this.dispatchEvent(new CustomEvent('touch-canvas-event', { detail: {
            drawingPoints: this.drawingPoints,
            drawingPointsForSVG: this.drawingPointsForSVG,
        } }))
    }

    handleAction(e) {
        const evt = e
        if (!this.canvas) return;

        const touch = evt.changedTouches ? evt.changedTouches[0] : evt;
        const rect = this.canvas.getBoundingClientRect();

        const x = (touch.clientX - rect.left).toFixed();
        const y = (touch.clientY - rect.top).toFixed()

        // Store the start point
        if (this.drawingPoints.length === 0) {
            // If no points, add first point
            this.drawingPointsForSVG = [];
            this.drawingPoints.push({x, y});

            this.drawingPointsForSVG.push(x)
            this.drawingPointsForSVG.push(y)
            this.dispatchCanvasEvent();

        } else {
            // If already started, add line to the next point (handled in handleMove)
            if(this.drawingPointsForSVG[this.drawingPointsForSVG.length - 1] !== y
                && this.drawingPointsForSVG[this.drawingPointsForSVG.length - 2] !== x)
            {
                this.drawingPoints.push({x, y});
                this.drawingPointsForSVG.push(x)
                this.drawingPointsForSVG.push(y)

                this.dispatchCanvasEvent();

                this.drawLines();

                this.pressIsOn = true;
                setTimeout(()=>{
                    this.pressIsOn = false;
                },100);
            }
        }
    };

    drawLines() {
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if(this.drawingPoints.length)
        {
            this.ctx.beginPath();

            this.drawingPoints.forEach((point, index) => {
                if (index === 0) {
                    this.ctx.moveTo(point.x, point.y);
                } else {
                    this.ctx.lineTo(point.x, point.y);
                }
            });
            this.ctx.stroke();
        }
    };

    deleteDrawing() {
        if (!this.canvas) return;
        this.drawingPoints = [];
        this.drawingPointsForSVG = [];
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dispatchCanvasEvent()
    }

    undoLastDraw() {
        this.drawingPoints.pop();
        if(this.drawingPoints.length === 1)
        {
            this.drawingPoints = [];
            this.drawingPointsForSVG = [];
        }
        else {
            this.drawingPointsForSVG.splice(-2)
        }
        this.drawLines();
        this.dispatchCanvasEvent()
        this.requestUpdate();
    }

    connectedCallback() {
        super.connectedCallback()
        setTimeout(() => {
            this.canvas = this.shadowRoot.querySelector('canvas')
        }, 0);
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.deleteDrawing()

        this.height = 0;
        this.style = null;
        this.canvas = null;
        this.ctx = null;
        this.drawingPoints = [];
        this.drawingPointsForSVG = [];
        this.pressIsOn = false;
        this.deleteDravingPoints = null;
        this.deleteLastPoint = null;
    }

    render() {
        return html`
        <canvas 
            .height="${this.height}" 
            width="300px" 
            @touchstart=${this.handleAction}
            @touchmove=${this.handleAction}
            @click=${this.handleAction}
            .style="${this.style}"
        ></canvas>  
        `;
    }
}

customElements.define('interactive-canvas-component', InteractiveComponent);

import './cards/video-stream.js'; 
import './cards/canvas.js'; 

const LitElement =
    window.LitElement ||
    Object.getPrototypeOf(
        customElements.get("ha-panel-lovelace") || customElements.get("hc-lovelace")
    );
const { html, css } = LitElement.prototype;

class InteractiveImage extends LitElement {
    constructor() {
        super();
        this.hass = null;
        this.config = {};        
        this.file = null;
        this.lovelaceConfig = null;
        this.width = '';
        this.height = '';
        this.interactiveMakerHeight = 300 / (16/9);
        this.interactiveImageMaker = false;
        this.imageUrl = '';
        this.errorMessage = '';
        this.showUpload = false;
        this.filteredEntities = [];
        this.filteredActions = [];
        this.selectedEntity = '';
        this.selectedAction = '';
        this.actionName = '';
        this.tab = '';
        this.drawingPoints = [];
        this.drawingPointsForSVG = [];
        this.showInteractiveAreas = false;
        this.clickedInteractiveArea = '';
        this.canvasActive = false;
        this.existingPointsToShow = [];
        this.canSave = false;
        this.saving = false;
        this.confirmAction = null;
        this.createConfirmAction = false;
        this.videoReady = false;
        this.deleteDravingPoints = false;
        this.deleteLastPoint = false;
    }

    static get properties() {
        return {
            imageUrl: { type: String },
            errorMessage: { type: String },
            canSave: { type: Boolean },
            canvasActive: { type: Boolean },
            showUpload: { type: Boolean },
            showInteractiveAreas: { type: Boolean },
            selectedEntity: { type: String },
            selectedAction: { type: String },
            actionName: { type: String },
            width: { type: String },
            height: { type: String },
            interactiveImageMaker: { type: Boolean },
            saving: { type: Boolean },
            filteredEntities: { type: Array },
            filteredActions: { type: Array },
            existingPointsToShow: { type: Array },
            tab: { type: String },
            drawingPoints: { type: Array },
            drawingPointsForSVG: { type: Array },
            clickedInteractiveArea: { type: String },
            unsubscribeEntity: {type: Object},
            unsubscribe: {type: Object},
            file: { type: Object },
            filePreview: { type: Object },            
            confirmAction: { type: Object },
            createConfirmAction: { type: Boolean },
            videoReady: { type: Boolean },
            deleteDravingPoints: { type: Boolean },
            deleteLastPoint: { type: Boolean },
        };
    }

    setConfig(config) {
        this.resetState()
        if(!config.label) {
            this.errorMessage = 'Property "label" is required. "e.g. label: Living room"';
            return;
        }

        this.showUpload = !config.url;
        this.imageUrl = config.url || '';
        this.width = config.size || '300';

        this.config = { ...config, scale: Number(this.width) / 300 };

        this.tab = this.config.interactive_areas ? 'existing' : 'addNew';
        
        if(this.config.stream)
        {
            this.height = this.width/(16/9)
        }
    }

    resetState() {
        this.imageUrl = ''; 
        this.file = null;
        this.width = '';
        this.errorMessage = null;
    }
    
    resetInteractiveMakerState() {
        this.interactiveImageMaker = false; 
        this.filteredEntities = [];
        this.filteredActions = [];
        this.selectedEntity = '';
        this.selectedAction = '';
        this.actionName = '';
        this.drawingPoints = [];
        this.drawingPointsForSVG = [];
        this.canSave = false;
    }
    
    previewImage(event) {
        this.errorMessage = null;
        window.URL.revokeObjectURL(this.imageUrl);

        if (!["image/png", "image/jpeg", "image/gif"].includes(event.target.files[0].type)) {
        
            this.errorMessage = `Image format ${event.target.files[0].type} is unsupported. Supported formats are "png", "jpeg" or "gif".`;
            return;
        }

        this.file = event.target.files[0];

        if (this.file) {
            this.imageUrl = window.URL.createObjectURL(this.file);
        }
    }

    uploadImage() {
        // todo maybe?
        /* if(!this.hass?.user?.is-admin)
        {
            this.errorMessage('Only admin can upload image')
            return;
        } */
        const file = this.file;
        const safeFileName =  file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();

        const formData = new FormData();
        formData.append('file', file, safeFileName); 

        this.hass.fetchWithAuth('/api/image/upload', {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (response.status === 413) {
                throw new Error(`Uploaded image is too large (${file.name})`);
            } else if (response.status !== 200) {
                throw new Error('Unknown error occurred during image upload');
            }
            
            return response.json();
        })
        .then(data => {            
            window.URL.revokeObjectURL(this.imageUrl);

            this.file = null;
            this.imageUrl = `/api/image/serve/${data.id}/512x512`;
            const configData = { ...this.lovelaceConfig };
            let found = false;

            this.clearFile()

            if(!configData.views)
            {
                return;
            }

            for (let view of configData.views)
            {
                if(view.cards)
                {
                    for (const card of view.cards)
                    {
                        if(card.type === 'custom:interactive-image-card'
                            && this.config.label === card.label)
                        {
                            card.url = this.imageUrl;
                            // this.config.url = this.imageUrl;
                            found = true;
                        }
                    }
                }
                
            }
            if(found)
            {
                this.saving = true;
                this.saveNewLovelaceCongif(configData)
            }
        })
        .catch(error => {
            this.errorMessage = error.message;
        });        
    }

    saveNewLovelaceCongif(configData) {
        if(this.saving)
        {
            this.hass.callWS({
                type: "lovelace/config/save",
                url_path: this.hass.panelUrl === 'lovelace' ? null : this.hass.panelUrl,
                config:configData,
                id:1111
            })
            .then(()=>{
                this.showUpload = false;
                const event = new CustomEvent('rebuild-view');
                window.dispatchEvent(event);
            })
            .catch(error => {
                // fall silently
            })

            this.saving = false;
        }
    }

    async subscribeToLovelaceUpdates() {
        try {
            this.unsubscribe = await this.hass.connection.subscribeEvents((event) => {
                this.hass.callWS({
                    type: "lovelace/config",
                    url_path: this.hass.panelUrl === 'lovelace' ? null : this.hass.panelUrl,
                    //url_path: null, // this.hass.panelUrl,
                    force:false,
                })
                .then((dataIn) => {
                    const newConfig = {...dataIn};
                    const oldConfig = {...this.lovelaceConfig};
                    
                    const cardsToCheck = [];

                    if(oldConfig.views)
                    {
                        for (const view of oldConfig.views)
                        {
                            if(view.cards)
                            {
                                for (const card of view.cards)
                                {
                                    if (card.type === 'custom:interactive-image-card' && card.url !== undefined)
                                    {
                                        cardsToCheck.push(card.url);
                                    }
                                }
                            }
                        }
                    }

            
                    const checkString = JSON.stringify(newConfig);
                    if (!cardsToCheck.length)
                    {
                        return;
                    }

                    for (const item of cardsToCheck)
                    {
                        if(checkString.indexOf(item) === -1)
                        {
                            let id = item.split('/')
                            id = id[id.length - 2]

                            this.hass.callWS({
                                type: "image/delete",
                                image_id: id,
                            })
                            .catch(error => {
                                // todo maybe create some entity that holds image url
                            });        

                            break;
                        }
                    }

                    this.lovelaceConfig = {...dataIn}
                });

            }, 'lovelace_updated');
        } catch (error) {
            //console.error('Error subscribing to lovelace_updated:', error);
        }
    };
    
    toggleSettings(data) {
        // cleanup
        if(this.interactiveImageMaker)
        {
            let el;

            if(!this.config.stream)
            {
                el = this.shadowRoot.querySelector('img');
            }
            else
            {
                el = this.shadowRoot.querySelector('hui-image');
            }

            if(el && el.clientHeight)
            {
                this.height = el.clientHeight
            }


            this.deleteDrawing();
            this.toggleCanvas(false)
        }


        this.interactiveImageMaker = data;

        if(this.interactiveImageMaker && this.tab === 'addNew')
        {
            this.toggleCanvas(true)
        }

    }

    updated(changedProperties) {
        super.updated(changedProperties);

        if (changedProperties.has('config')) {
            this.style.setProperty('--padding-bottom', this.config && !this.config.editable ? '1em' : '0em');
        }
        else if (changedProperties.has('width')) {
            let el;
            if(!this.config.stream)
            {
                el = this.shadowRoot.querySelector('img');
            }
            else
            {
                el = this.shadowRoot.querySelector('hui-image');
            }
            if(el && el.clientHeight)
            {
                this.height = el.clientHeight
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.subscribeToLovelaceUpdates();

        /**
         * Initializes image based on the provided configuration.
         */
        if(!this.showUpload && this.imageUrl === '' && this.config.url)
        {
            this.imageUrl = this.config.url;
        }

        else if(this.imageUrl === '')
        {
            if(this.config.entity_picture && this.hass.states[this.config.entity_picture]?.attributes?.entity_picture)
            {
                this.setImage({source: 'entity_picture'}) 
            }
            else if(this.config.entity_state && this.hass.states[this.config.entity_state]?.state)
            {
                this.setImage({source: 'entity_state'}) 
            }
            else if(this.config.still_image_url  && this.hass.states[this.config.still_image_url ]?.attributes?.still_image_url)
            {
                this.setImage({source: 'still_image_url'}) 
            }
            else if(this.config.stream_source && this.hass.states[this.config.stream_source]?.attributes?.stream_source)
            {
                this.setImage({source: 'stream_source'}) 
            }
        }

        this.hass.callWS({
            type: "lovelace/config",
            //url_path: null,// this.hass.panelUrl,
            url_path: this.hass.panelUrl === 'lovelace' ? null : this.hass.panelUrl,
            force:false,
        })
        .then((dataIn) => {
            this.lovelaceConfig = dataIn;
        })
        .catch(error => {
            // fall silently
        });   
        
        if(this.config.interactive_areas)
        {
            this.existingPointsToShow = Object.values(this.config.interactive_areas);
        }
        
        if(this.config.stream)
        {
            this.videoReady = true;
        }
    };

    firstUpdated() {
        super.firstUpdated();
        // this logic is very weird but it allows to render camera stream on initial load
        if(this.config.stream)
        {
            // TODO - for some reason hui-image wont stram on first load, check it
            // hacky hack that works for now

            this.videoReady = true;
            setTimeout(() => {
                this.videoReady = false;
                    setTimeout(() => {
                        this.videoReady = true;
                            this.height = this.width/(16/9)
                        }, 10)
            }, 10);
        }
    }

    setImage(data) {
        const entity = this.config[data.source]

        this.imageUrl = this.hass.states[entity].attributes[data.source];
        this.showUpload = false;
        this.subscribeToEntityChanges(entity, data.source)
    }
    
    async subscribeToEntityChanges(entity, attr) {
        this.unsubscribeEntity = await this.hass.connection.subscribeEvents((event) => {
            if (event.data.entity_id === entity) {
                this.hass.states[entity] = {...event.data.new_state};
                if (attr === 'entity_state')
                {
                    this.imageUrl = this.hass.states[entity].state
                }
                else
                {
                    // need to chek if other entities follow same logic?
                    this.imageUrl = `${this.hass.states[entity].attributes[attr]}&state=${this.hass.states[entity].state}`
                }
            }
        }, 'state_changed');
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }

        if(this.unsubscribeEntity)
        {
            this.unsubscribeEntity();
            this.unsubscribeEntity = null;
        }
        
        this.clearFile();        
        window.URL.revokeObjectURL(this.imageUrl);        

        this.imageUrl = ''; 
        this.file = null;
        this.resetInteractiveMakerState()
        if(this.config.stream)
        {
            this.videoReady = false;
        }
    };

    clearFile() {
        if(this.shadowRoot.getElementById('custom-image-preview'))
        {
            this.shadowRoot.getElementById('custom-image-preview').value = '';
        }
    }

    getImageHeight(e) {
        const el = this.shadowRoot.querySelector('ha-card');

        if (this.width > el.offsetWidth)
        {
            this.width = el.offsetWidth - 20;
            this.config.scale = Number(this.width) / 300;
        }
        this.height = this.config.stream ? this.width/(16/9) : e.originalTarget.clientHeight   
    }

    callActions(dataIn) {
        // todo add support for multiple entities??
        
        let data = dataIn;
        if(this.config.use_vibration)
        {
            navigator.vibrate(100);
        }
        if(!this.interactiveImageMaker)
        {
            this.clickedInteractiveArea = dataIn.points;

            setTimeout(() => {
                this.clickedInteractiveArea = '';
            }, 300);
        }
        
        if(dataIn && dataIn.confirm_action)
        {
            this.confirmAction = {...data}
            delete this.confirmAction.confirm_action
            return;
        }

        this.confirmAction = null;
        
        // use data from inputs
        if (!data)
        {
            const domain = this.selectedEntity.split('.')[0];
            if(!this.hass.services[domain]) return;
            const services = Object.keys(this.hass.services[domain])

            if(!this.selectedEntity 
                || Object.keys(this.hass.states).indexOf(this.selectedEntity) === -1
                || !this.selectedAction
                || !this.hass.services[domain]
                || Object.keys(this.hass.services[domain]).indexOf(this.selectedAction) === -1)
            {
                return;
            }

            data = {
                action: this.selectedAction,
                entity_id: this.selectedEntity,
            }
        }

        if(data.service === 'show_more')
        {
            const entityId = data.entity_id;
            const event = new Event('hass-more-info', {
                bubbles: true,
                composed: true,
            });
            
            event.detail = { entityId: entityId };
            window.document.querySelector('home-assistant')?.dispatchEvent(event);
            return;
        }
        const dataOut = {
            type: "call_service",
            domain: data.entity_id.split('.')[0],
            service: data.service,
            target: {
                entity_id: data.entity_id
            }
        }

        if(data.service_data)
        {
            dataOut.service_data = data.service_data
        }

        if (data.service === 'ptz')
        {
            /* 
            this.hass.callService(
                domain,
                service,
                actionConfig.data ?? actionConfig.service_data,
                actionConfig.target
            ); */
            this.hass.callService(
                'onvif',
                data.service,
                data.service_data,
                {
                    entity_id: data.entity_id
                }
            );
        }
        else
        {
            this.hass.callWS(dataOut)
        }
      
    }

    handleSearchEntityChange(e) {
        this.selectedEntity = e.target.value;
        this.selectedAction = '';
        this.canSave = false;
        if(e.target.value)
        {
            const filterText = e.target.value;
            const valueToCheck = filterText.toLowerCase();

            const arrOut = []

            for (const item of Object.keys(this.hass.states))
            {
                if (item.includes(valueToCheck))
                {
                    if(item === valueToCheck)
                    {
                        this.selectEntity(item);
                        return;
                    }
                    arrOut.push(item)
                }
            }

            this.filteredEntities = arrOut;
        }
    }

    showSearchEntities() {
        if(!this.selectedEntity)
        {
            this.filteredEntities = Object.keys(this.hass.states);
        }
        else
        {
            const valueToCheck = this.selectedEntity.toLowerCase();

            const arrOut = []

            for (const item of Object.keys(this.hass.states))
            {
                if (item.includes(valueToCheck))
                {
                    if(item === valueToCheck)
                    {
                        this.selectEntity(item);
                        return;
                    }
                    arrOut.push(item)
                }
            }
            this.filteredEntities = arrOut;
        }
    }

    focusOutSelectEntity() {
        setTimeout(() => {
            this.filteredEntities = [];
        }, 500);
    }

    selectEntity(entity) {
        this.selectedEntity = entity;
        this.filteredEntities = [];
        this.canSave = false;
    }

    handleSearchActionChange(e) {
        this.canSave = false;
        this.selectedAction = e.target.value;

        if(e.target.value && this.selectedEntity && this.hass.states[this.selectedEntity])
        {
            const filterText = e.target.value.toLowerCase();

            const domain = this.selectedEntity.split('.')[0];
            if(!this.hass.services[domain]) return;
            const services = Object.keys(this.hass.services[domain])
            services.push('show_more')

            const arrOut = []
            for (const item of services)
            {
                if (item.includes(filterText))
                {
                    if(item === filterText)
                    {
                        this.selectAction(item);
                        return;
                    }
                    arrOut.push(item)
                }
            }
            
            this.filteredActions = arrOut;
        }
        else if(this.selectedEntity && this.hass.states[this.selectedEntity])
        {
            const domain = this.selectedEntity.split('.')[0];
            if(!domain || !this.hass.services[domain]) return;
            const services = Object.keys(this.hass.services[domain])
            services.push('show_more')

            this.filteredActions = services;
        }
    }

    showSearchActions() {
        if(this.selectedEntity && this.hass.states[this.selectedEntity] && this.selectedAction === '')
        {
            const domain = this.selectedEntity.split('.')[0];
            if(!domain || !this.hass.services[domain]) return;
            const services = Object.keys(this.hass.services[domain])
            services.push('show_more')

            this.filteredActions = services;
        }
        else if (this.selectedEntity && this.hass.states[this.selectedEntity] && this.selectedAction !== '')
        {
            const filterText = this.selectedAction.toLowerCase();

            const domain = this.selectedEntity.split('.')[0];
            if(!this.hass.services[domain]) return;
            const services = Object.keys(this.hass.services[domain])
            services.push('show_more')

            const arrOut = []
            for (const item of services)
            {
                if (item.includes(filterText))
                {
                    if(item === filterText)
                    {
                        this.selectAction(item);
                        return;
                    }
                    arrOut.push(item)
                }
            }
            
            this.filteredActions = arrOut;
        }
    }

    focusOutSelectActions(e) {
        setTimeout(() => {
            this.filteredActions = [];
        }, 500);
    }

    selectAction(action) {
        this.selectedAction = action;
        this.filteredActions = [];

        if(this.actionName !== '')
        {
            this.canSave = true;
        }
    }

    handleNameChange(e) {
        if(e.target.value)
        {
            this.actionName = e.target.value;
            if(this.selectedEntity 
                && this.selectedAction
                && Object.keys(this.hass.states).indexOf(this.selectedEntity) !== -1)
            {

                const domain = this.selectedEntity.split('.')[0];
                if(!this.hass.services[domain]) return;
                const services = Object.keys(this.hass.services[domain])
                services.push('show_more')

                if(services.indexOf(this.selectedAction) !== -1)
                {
                    this.canSave = true;
                    return;
                }
            }
        } 
        
        this.canSave = false;
    }

    selectTab(tab) {
        if(tab===this.tab) return;
        this.tab = tab;

        if(this.tab === 'addNew')
        {
            this.toggleCanvas(true);
        }
        else {
            this.deleteDrawing();
            this.toggleCanvas(false);
        }

    }

    toggleInteractiveAreas() {
        this.showInteractiveAreas = !this.showInteractiveAreas;
    }

    toggleCanvas(data) {
        if (data === this.canvasActive) return;
        
        this.canvasActive = data || !this.canvasActive;
    }

    collectPoints(e) {
        this.drawingPoints = [...e.detail.drawingPoints];
        this.drawingPointsForSVG = [...e.detail.drawingPointsForSVG];
    }


    deleteDrawing() {
        this.deleteDravingPoints = !this.deleteDravingPoints;
    }

    undoLastDraw() {
        this.deleteLastPoint = !this.deleteLastPoint;
    }

    saveDrawing() {
        const configData = { ...this.lovelaceConfig };
            let found = false;
            this.saving = true;
            let added = false;
            
            for (let item of configData.views)
            {
                if(item.cards)
                {
                    for (const card in item.cards)
                    {
                        if(item.cards[card].type === 'custom:interactive-image-card'
                            && this.config.label === item.cards[card].label)
                        {
                            const data = {
                                name : this.actionName,
                                entity_id : this.selectedEntity,
                                service : this.selectedAction,
                                points : this.drawingPointsForSVG.join(','),
                            }

                            if(this.createConfirmAction)
                            {
                                data.confirm_action = true;
                            }

                            if(item.cards[card].interactive_areas?.length)
                            {
                                item.cards[card].interactive_areas.push(data)
                            }
                            else
                            {
                                item.cards[card].interactive_areas = [data]
                            }


                            if(this.config.interactive_areas?.length && !added)
                            {
                                this.config.interactive_areas = [...this.config.interactive_areas, data]
                                added = true;
                            }
                            else if(!added)
                            {
                                this.config.interactive_areas = [data]
                                added = true;
                            }

                            
                            found = true;
                        }
                    }
                }
                
            }
            if(found)
            {
                this.saveNewLovelaceCongif(configData)
                this.resetInteractiveMakerState();
                this.tab = 'existing';
            }
    }

    toggleExistingArea(item) {
        for (const i in this.existingPointsToShow)
        {
            if (this.existingPointsToShow[i].points === item.points)
            {
                this.existingPointsToShow.splice(i, 1)
                this.requestUpdate();
                return;
            }
        }
        this.existingPointsToShow.push({...item, selected:true})
        this.requestUpdate();
    }

    resetConfirmAction() {
        this.confirmAction = null;
    }

    toggleConfirAction() {
        this.createConfirmAction = !this.createConfirmAction
    }

    render() { 
        return html`
    <ha-card>
        <section id="custom-interactive-image-card" class="flex-center">
            ${this.hass !== undefined ? html`
                ${this.showUpload && !this.errorMessage ? html`
                    <div class="upload-image-container">
                        <div class="flex-center">
                            <input type="file" @change=${this.previewImage} id="custom-image-preview" class="info-container" />
                        </div>
                        ${this.imageUrl !== '' ? html`
                            <div class="flex-center">
                                
                                ${!this.config.stream ? html`
                                <img alt='your-image' src=${this.imageUrl} width="${this.width}">
                                ` : html`
                                ${this.config.stream ? html`
                                    <interactive-video-component
                                    .width=${this.width}
                                    .hass=${this.hass}
                                    .entity=${this.config.entity_picture} />
                                    ` : html``}

                                `}
                                
                            </div>
                            <div class="flex-center">
                                <button @click=${this.uploadImage}>Upload</button>
                            </div>
                        ` : html``}
                    </div>
                ` : html`
                        ${this.interactiveImageMaker && !this.errorMessage ? html`
                                <ha-dialog open class='interactive-image-maker-container' @closed=${()=>this.toggleSettings(false)}> 
                                    <div style="height:max-content;width:max-content;position: relative;margin: auto;">
                                    
                                    ${!this.config.stream ? html`
                                        <img alt="your-image" @load=${this.getImageHeight}
                                        src=${this.imageUrl} width="300px">
                                    ` :html`
                                        <interactive-video-component
                                            .hass=${this.hass}
                                            .entity=${this.config.entity_picture}
                                            />
                                    `} 
                                        ${this.config.stream || this.height ? html`
                                            ${this.tab === 'addNew' ? html`
                                            <interactive-canvas-component
                                                class="image-layer" 
                                                .deleteDravingPoints="${this.deleteDravingPoints}"
                                                .deleteLastPoint="${this.deleteLastPoint}"
                                                .height="${this.config.stream ? this.interactiveMakerHeight : this.height}"
                                                .style="${this.canvasActive ? 'z-index:1':'z-index:0;'}"
                                                @touch-canvas-event=${this.collectPoints}
                                            ></interactive-canvas-component>
                                            ` : html``}
                                            
                                            <svg width="300px" height="${this.config.stream ? this.interactiveMakerHeight : this.height}" class="image-layer" style="pointer-events:all;">
                                                ${this.tab !== 'addNew' && [...this.existingPointsToShow]?.map(item => html`
                                                    <svg>
                                                        <polygon points="${item.points}" style="fill: #ff4c4c2e;" @click="${() => this.callActions(item)}"/>
                                                    </svg>
                                                `)}
                                                ${this.tab === 'addNew' && this.drawingPointsForSVG.length  ? html`
                                                    <svg>
                                                        <polygon points="${this.drawingPointsForSVG}" style="fill: #ff4c4c2e;" @click="${() => this.callActions(null)}"/>
                                                    </svg>
                                                ` : html``}
                                            </svg> 
                                            ${this.confirmAction != null ? html`
                                                <ha-dialog open @closed=${this.resetConfirmAction} .footer="null">
                                                    <div class='confirmation-modal' >
                                                        <p>Call action <b>${this.confirmAction.name}?</b></p>
                                                        <div>
                                                            <button @click=${this.resetConfirmAction}>Close</button>
                                                            <button @click="${() => this.callActions(this.confirmAction)}">Confirm</button> 
                                                        </div>
                                                    </div>         
                                                </ha-dialog>
                                            ` : html``}
                                        ` : html``}
                                    </div>
                                    <div class="tab-container">
                                        ${this.config.interactive_areas?.length ? html`
                                        <h3 class="${this.tab === 'existing' ? 'selected-tab' : ''}" @click=${()=>this.selectTab('existing')}>Existing</h3>
                                        ` :  html``}
                                        <h3 class="${this.tab === 'addNew' ? 'selected-tab' : ''}" @click=${()=>this.selectTab('addNew')}>Add new</h3>
                                    </div>
                                    ${this.tab === 'addNew' ? html`
                                        <div style=max-width:300px;>
                                            <div @change=${this.toggleConfirAction}>
                                                <label>Confirm action:</label>
                                                <input type="checkbox">
                                            </div>
                                            <div class="filter-entity">
                                                <label>Name:</label>
                                                <input type="text" placeholder="Enter name" @input=${this.handleNameChange} 
                                                    .value="${this.actionName}">
                                            </div>

                                            <div class="filter-entity">
                                                <label>Entity:</label>
                                                <input type="text" placeholder="Enter entity" @input=${this.handleSearchEntityChange} 
                                                    .value="${this.selectedEntity}" 
                                                    @focus=${this.showSearchEntities} 
                                                    @blur=${this.focusOutSelectEntity}>
                                                
                                            </div>

                                            ${this.selectedEntity && this.hass.states[this.selectedEntity] ? html`
                                            <div class="filter-entity">
                                                <label>Service:</label>
                                                <input type="text" placeholder="Enter service" @input=${this.handleSearchActionChange} 
                                                    .value="${this.selectedAction}" 
                                                    @focus=${this.showSearchActions}
                                                    @blur=${this.focusOutSelectActions}>
                                            ` : html``}

                                            ${this.filteredEntities.length ? html`
                                                    <ul class="search-result-list">
                                                        ${[...this.filteredEntities].sort().map(item => html`
                                                            <li @click=${()=>this.selectEntity(item)}>
                                                            ${item}
                                                            </li>
                                                        `)}
                                                    </ul>
                                                ` : html``}
                                            ${this.selectedEntity && this.filteredActions.length ? html`
                                                <ul class="search-result-list">
                                                    ${[...this.filteredActions].sort().map(item => html`
                                                        <li @click=${()=>this.selectAction(item)}>
                                                        ${item}
                                                        </li>
                                                    `)}
                                                </ul>
                                            ` : html`
                                                <div class="filter-entity">
                                                    <p>
                                                        <span @click=${()=>this.toggleCanvas(false)}>Tryout mode</span>
                                                        <ha-icon 
                                                            icon="${this.canvasActive ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}" 
                                                            @click=${()=>this.toggleCanvas(null)} >
                                                        </ha-icon>
                                                        <span @click=${()=>this.toggleCanvas(true)}>Draw mode</span>
                                                    </p>
                                                </div>

                                                <div class="filter-entity">
                                                    <button @click=${this.deleteDrawing} .disabled=${!this.drawingPoints.length}>Delete</button>
                                                    <button @click=${this.undoLastDraw} .disabled=${!this.drawingPoints.length} >Undo</button>
                                                    <button @click=${this.saveDrawing} 
                                                    .disabled=${!this.canSave || !this.drawingPoints.length} >Save</button>
                                                </div>
                                            `}
                                        </div>
                                    ` : html`
                                        <div class="existing-actions-container">
                                            ${this.config.interactive_areas?.map(item => {
                                                const itemOut = {...item}
                                                let classOut = '';
                                                for (const data of this.existingPointsToShow)
                                                {
                                                    if (data.label === item.label && data.points === item.points)
                                                    {
                                                        classOut = 'existing-point-selected';
                                                        break;
                                                    }
                                                }

                                                return html`
                                                <div class="existing-actions flex-center ${classOut}" @click=${()=>this.toggleExistingArea(itemOut)}>
                                                    <p>${itemOut.name}</p>
                                                    <!-- <p><small>${itemOut.entity_id.split('.')[1]}-${itemOut.service}</small></p> -->
                                                </div>
                                            `
                                            })}
                                        </div>
                                    `}

                                </div>
                                </ha-dialog>
                        ` : html``}
                            ${this.errorMessage ? html`
                                <div class="error-container"><p>${this.errorMessage}</p></div>
                            ` : 
                            html`
                                ${this.width && this.imageUrl ? html`
                                <div>
                                    <div style="height:max-content;width:max-content;position: relative;">
                                        
                                        
                                        ${!this.config.stream ? html`
                                        <img alt='your-image' src=${this.imageUrl} width="${this.width}" @load=${this.getImageHeight} > 
                                        ` : html`
                                            ${this.config.stream && this.videoReady ? html`
                                                <interactive-video-component
                                                @load=${this.getImageHeight}
                                                .width=${this.width}
                                                .hass=${this.hass}
                                                .entity=${this.config.entity_picture} />

                                            ` : html``}
                                            `}

                                        ${this.height ? html`
                                            <svg width="${this.width}" height="${this.height}" class="image-layer" style="pointer-events:all;">
                                                ${this.config.interactive_areas?.map(item => {
                                                    const scaledPoints = item.points.split(',').map(point => {
                                                        const pointOut = point.split(',').map(Number);
                                                        return `${pointOut * this.config.scale}`;
                                                    }).join(',');
                                                    return html`
                                                    <svg>
                                                        <polygon points="${scaledPoints}" 
                                                            class="${this.clickedInteractiveArea === item.points ? 'show-interactive-area' : this.showInteractiveAreas ? 'show-interactive-area' : 'hide-interactive-area'}" 
                                                            @click="${() => this.callActions(item)}"/>
                                                    </svg>
                                                    `
                                                })}
                                            </svg>    
                                            ${this.confirmAction != null ? html`
                                                <ha-dialog open @closed=${this.resetConfirmAction}>
                                                    <div class='confirmation-modal' >
                                                        <p>Call action <b>${this.confirmAction.name}?</b></p>
                                                        <div>
                                                            <button @click=${this.resetConfirmAction}>Close</button>
                                                            <button @click="${() => this.callActions(this.confirmAction)}">Confirm</button> 
                                                        </div>
                                                    </div>                                                                           
                                                </ha-dialog>
                                            ` : html``}
                                        ` : html``} 
                                    </div>
                                    ${this.config.editable ? html`                            
                                        <div class="flex-center">
                                            <ha-icon icon="${this.showInteractiveAreas ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'}" style="color:darkgrey;margin-right:1em;" @click=${this.toggleInteractiveAreas} ></ha-icon>
                                            <ha-icon icon="mdi:pencil" style="color:darkgrey;" @click=${()=>this.toggleSettings(true)} ></ha-icon>
                                        </div>
                                    ` : html``}

                                </div>
                            ` : html``}
                        `}
                    `}            
            ` : html``}
        </section>
    </ha-card>

        `
    };

    static styles = css`
    #custom-interactive-image-card {
        background: inherit;
        width: max-content;
        max-width: 100%;
        margin: auto;
        padding-top: 1em;
        padding-bottom: var(--padding-bottom, 0em);
    }

    .upload-image-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .upload-image-container > * {
        flex-basis:100%;
    }
    button:not([disabled]) {
        background: var(--primary-color);
        color: var(--text-primary-color),
    }

    .info-container {
        padding: 2em;
        padding-left: 0;
    }

    .error-container {
        padding: 2em;
        color: var(--error-color);
    }

    .error-container > p {
        text-align: center;
    }
    
    .flex-center {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .image-layer {
        position: absolute;
        inset: 0;
    }

    .search-result-list {
        overflow: hidden auto;
        padding: 0px;
        width: 300px;
        background: var(--card-background-color);
        height: 10em;
    }

    .search-result-list > li {
        list-style: none;
    }

    .tab-container {
        display: flex;
        justify-content: space-evenly;
    }

    .tab-container  > h3 {
        padding: 0.5em;    
    }

    .filter-entity {
        position: relative;
        width: 100%;
        display: flex;
        padding: 0.5em 0;
        justify-content: space-between;
        z-index: 5;
    }

    .filter-entity > p {
        display: flex;
        width: 100%;
        justify-content: center;
    }

    .filter-entity > p > *{
        margin: 0 0.5em;
    }

    .filter-entity > input {
        flex-basis:80%;
        padding: 0.25em;
        border-radius: 5px;
    }

    .selected-tab {
        border-bottom: 2px solid var(--primary-text-color);
    }

    .existing-actions-container {
        display:flex;
        width: 300px;
        flex-wrap: wrap;
    }

    .existing-actions {
        width: 100px;
        margin: 1em;
        border-radius: 15px;
        box-shadow: rgb(91, 91, 91) 1px 1px 1px;
        padding: 0.5em;
        background: var(--secondary-background-color);
    }

    .existing-actions > p {
        margin: 0.5em;
        word-break: break-word;
    }

    button {
        padding: 1em;
        margin: 1em;
        border: 1px solid #575757;
        border-radius: 15px;
    }
    
    .show-interactive-area {
        fill: #ff4c4c2e;
    }

    .hide-interactive-area {
        fill: transparent;
    }

    .existing-point-selected {
        background: var(--primary-color);
        color: var(--text-primary-color);
    }

    .confirmation-modal{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .confirmation-modal > div > button {
        min-width: 100px;
    }
    `;
};

window.customCards = window.customCards || [];

window.customCards.push({
    type: 'interactive-image-card',
    name: 'Custom interactive image card',
    preview: true,
    description: 'An interactive image card for Home Assistant',
});

customElements.define("interactive-image-card", InteractiveImage);

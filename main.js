(()=>{var t={452:()=>{const t=window.LitElement||Object.getPrototypeOf(customElements.get("ha-panel-lovelace")||customElements.get("hc-lovelace")),{html:e}=t.prototype;customElements.define("interactive-canvas-component",class extends t{static get properties(){return{deleteDravingPoints:{type:Boolean},deleteLastPoint:{type:Boolean},height:{type:String}}}constructor(){super(),this.height=0,this.style=null,this.canvas=null,this.ctx=null,this.drawingPoints=[],this.drawingPointsForSVG=[],this.pressIsOn=!1,this.deleteDravingPoints=null,this.deleteLastPoint=null}updated(t){super.updated(t),t.has("deleteDravingPoints")&&void 0!==t.get("deleteDravingPoints")?this.deleteDrawing():t.has("deleteLastPoint")&&void 0!==t.get("deleteLastPoint")&&this.undoLastDraw()}dispatchCanvasEvent(){this.dispatchEvent(new CustomEvent("touch-canvas-event",{detail:{drawingPoints:this.drawingPoints,drawingPointsForSVG:this.drawingPointsForSVG}}))}handleAction(t){const e=t;if(!this.canvas)return;const i=e.changedTouches?e.changedTouches[0]:e,s=this.canvas.getBoundingClientRect(),a=(i.clientX-s.left).toFixed(),n=(i.clientY-s.top).toFixed();0===this.drawingPoints.length?(this.drawingPointsForSVG=[],this.drawingPoints.push({x:a,y:n}),this.drawingPointsForSVG.push(a),this.drawingPointsForSVG.push(n),this.dispatchCanvasEvent()):this.drawingPointsForSVG[this.drawingPointsForSVG.length-1]!==n&&this.drawingPointsForSVG[this.drawingPointsForSVG.length-2]!==a&&(this.drawingPoints.push({x:a,y:n}),this.drawingPointsForSVG.push(a),this.drawingPointsForSVG.push(n),this.dispatchCanvasEvent(),this.drawLines(),this.pressIsOn=!0,setTimeout((()=>{this.pressIsOn=!1}),100))}drawLines(){this.canvas&&(this.ctx=this.canvas.getContext("2d"),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.drawingPoints.length&&(this.ctx.beginPath(),this.drawingPoints.forEach(((t,e)=>{0===e?this.ctx.moveTo(t.x,t.y):this.ctx.lineTo(t.x,t.y)})),this.ctx.stroke()))}deleteDrawing(){this.canvas&&(this.drawingPoints=[],this.drawingPointsForSVG=[],this.ctx=this.canvas.getContext("2d"),this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.dispatchCanvasEvent())}undoLastDraw(){this.drawingPoints.pop(),1===this.drawingPoints.length?(this.drawingPoints=[],this.drawingPointsForSVG=[]):this.drawingPointsForSVG.splice(-2),this.drawLines(),this.dispatchCanvasEvent(),this.requestUpdate()}connectedCallback(){super.connectedCallback(),setTimeout((()=>{this.canvas=this.shadowRoot.querySelector("canvas")}),0)}disconnectedCallback(){super.disconnectedCallback(),this.deleteDrawing(),this.height=0,this.style=null,this.canvas=null,this.ctx=null,this.drawingPoints=[],this.drawingPointsForSVG=[],this.pressIsOn=!1,this.deleteDravingPoints=null,this.deleteLastPoint=null}render(){return e`
        <canvas 
            .height="${this.height}" 
            width="300px" 
            @touchstart=${this.handleAction}
            @touchmove=${this.handleAction}
            @click=${this.handleAction}
            .style="${this.style}"
        ></canvas>  
        `}})},722:()=>{const t=window.LitElement||Object.getPrototypeOf(customElements.get("ha-panel-lovelace")||customElements.get("hc-lovelace")),{html:e}=t.prototype;customElements.define("interactive-video-component",class extends t{constructor(){super(),this.hass=null,this.entity=null,this.width="300"}render(){return e`
            <hui-image style="width:${this.width}px"
                .hass=${this.hass}
                .entity=${this.entity}
                .cameraImage=${this.entity}
                cameraView="live"
                aspectRatio="16:9"
            ></hui-image>
    `}})}},e={};function i(s){var a=e[s];if(void 0!==a)return a.exports;var n=e[s]={exports:{}};return t[s](n,n.exports,i),n.exports}i.n=t=>{var e=t&&t.__esModule?()=>t.default:()=>t;return i.d(e,{a:e}),e},i.d=(t,e)=>{for(var s in e)i.o(e,s)&&!i.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:e[s]})},i.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{"use strict";i(722),i(452);const t=window.LitElement||Object.getPrototypeOf(customElements.get("ha-panel-lovelace")||customElements.get("hc-lovelace")),{html:e,css:s}=t.prototype;class a extends t{constructor(){super(),this.hass=null,this.config={},this.file=null,this.lovelaceConfig=null,this.width="",this.height="",this.interactiveMakerHeight=168.75,this.interactiveImageMaker=!1,this.imageUrl="",this.errorMessage="",this.showUpload=!1,this.filteredEntities=[],this.filteredActions=[],this.selectedEntity="",this.selectedAction="",this.actionName="",this.tab="",this.drawingPoints=[],this.drawingPointsForSVG=[],this.showInteractiveAreas=!1,this.clickedInteractiveArea="",this.canvasActive=!1,this.existingPointsToShow=[],this.canSave=!1,this.saving=!1,this.confirmAction=null,this.createConfirmAction=!1,this.videoReady=!1,this.deleteDravingPoints=!1,this.deleteLastPoint=!1}static get properties(){return{imageUrl:{type:String},errorMessage:{type:String},canSave:{type:Boolean},canvasActive:{type:Boolean},showUpload:{type:Boolean},showInteractiveAreas:{type:Boolean},selectedEntity:{type:String},selectedAction:{type:String},actionName:{type:String},width:{type:String},height:{type:String},interactiveImageMaker:{type:Boolean},saving:{type:Boolean},filteredEntities:{type:Array},filteredActions:{type:Array},existingPointsToShow:{type:Array},tab:{type:String},drawingPoints:{type:Array},drawingPointsForSVG:{type:Array},clickedInteractiveArea:{type:String},unsubscribeEntity:{type:Object},unsubscribe:{type:Object},file:{type:Object},filePreview:{type:Object},confirmAction:{type:Object},createConfirmAction:{type:Boolean},videoReady:{type:Boolean},deleteDravingPoints:{type:Boolean},deleteLastPoint:{type:Boolean}}}setConfig(t){this.resetState(),t.label?(this.showUpload=!t.url,this.imageUrl=t.url||"",this.width=t.size||"300",this.config={...t,scale:Number(this.width)/300},this.tab=this.config.interactive_areas?"existing":"addNew",this.config.stream&&(this.height=this.width/(16/9))):this.errorMessage='Property "label" is required. "e.g. label: Living room"'}resetState(){this.imageUrl="",this.file=null,this.width="",this.errorMessage=null}resetInteractiveMakerState(){this.interactiveImageMaker=!1,this.filteredEntities=[],this.filteredActions=[],this.selectedEntity="",this.selectedAction="",this.actionName="",this.drawingPoints=[],this.drawingPointsForSVG=[],this.canSave=!1}previewImage(t){this.errorMessage=null,window.URL.revokeObjectURL(this.imageUrl),["image/png","image/jpeg","image/gif"].includes(t.target.files[0].type)?(this.file=t.target.files[0],this.file&&(this.imageUrl=window.URL.createObjectURL(this.file))):this.errorMessage=`Image format ${t.target.files[0].type} is unsupported. Supported formats are "png", "jpeg" or "gif".`}uploadImage(){const t=this.file,e=t.name.replace(/[^a-z0-9.]/gi,"_").toLowerCase(),i=new FormData;i.append("file",t,e),this.hass.fetchWithAuth("/api/image/upload",{method:"POST",body:i}).then((e=>{if(413===e.status)throw new Error(`Uploaded image is too large (${t.name})`);if(200!==e.status)throw new Error("Unknown error occurred during image upload");return e.json()})).then((t=>{window.URL.revokeObjectURL(this.imageUrl),this.file=null,this.imageUrl=`/api/image/serve/${t.id}/512x512`;const e={...this.lovelaceConfig};let i=!1;if(this.clearFile(),e.views){for(let t of e.views)if(t.cards)for(const e of t.cards)"custom:interactive-image-card"===e.type&&this.config.label===e.label&&(e.url=this.imageUrl,i=!0);i&&(this.saving=!0,this.saveNewLovelaceCongif(e))}})).catch((t=>{this.errorMessage=t.message}))}saveNewLovelaceCongif(t){this.saving&&(this.hass.callWS({type:"lovelace/config/save",url_path:"lovelace"===this.hass.panelUrl?null:this.hass.panelUrl,config:t,id:1111}).then((()=>{this.showUpload=!1;const t=new CustomEvent("rebuild-view");window.dispatchEvent(t)})).catch((t=>{})),this.saving=!1)}async subscribeToLovelaceUpdates(){try{this.unsubscribe=await this.hass.connection.subscribeEvents((t=>{this.hass.callWS({type:"lovelace/config",url_path:"lovelace"===this.hass.panelUrl?null:this.hass.panelUrl,force:!1}).then((t=>{const e={...t},i={...this.lovelaceConfig},s=[];if(i.views)for(const t of i.views)if(t.cards)for(const e of t.cards)"custom:interactive-image-card"===e.type&&void 0!==e.url&&s.push(e.url);const a=JSON.stringify(e);if(s.length){for(const t of s)if(-1===a.indexOf(t)){let e=t.split("/");e=e[e.length-2],this.hass.callWS({type:"image/delete",image_id:e}).catch((t=>{}));break}this.lovelaceConfig={...t}}}))}),"lovelace_updated")}catch(t){}}toggleSettings(t){if(this.interactiveImageMaker){let t;t=this.config.stream?this.shadowRoot.querySelector("hui-image"):this.shadowRoot.querySelector("img"),t&&t.clientHeight?this.height=t.clientHeight:t&&t.height&&(this.height=t.height),this.deleteDrawing(),this.toggleCanvas(!1)}this.interactiveImageMaker=t,this.interactiveImageMaker&&"addNew"===this.tab&&this.toggleCanvas(!0)}updated(t){if(super.updated(t),t.has("config"))this.style.setProperty("--padding-bottom",this.config&&!this.config.editable?"1em":"0em");else if(t.has("width")){let t;t=this.config.stream?this.shadowRoot.querySelector("hui-image"):this.shadowRoot.querySelector("img"),t&&t.clientHeight?this.height=t.clientHeight:t&&t.height&&(this.height=t.height)}}connectedCallback(){super.connectedCallback(),this.subscribeToLovelaceUpdates(),!this.showUpload&&""===this.imageUrl&&this.config.url?this.imageUrl=this.config.url:""===this.imageUrl&&(this.config.entity_picture&&this.hass.states[this.config.entity_picture]?.attributes?.entity_picture?this.setImage({source:"entity_picture"}):this.config.entity_state&&this.hass.states[this.config.entity_state]?.state?this.setImage({source:"entity_state"}):this.config.still_image_url&&this.hass.states[this.config.still_image_url]?.attributes?.still_image_url?this.setImage({source:"still_image_url"}):this.config.stream_source&&this.hass.states[this.config.stream_source]?.attributes?.stream_source&&this.setImage({source:"stream_source"})),this.hass.callWS({type:"lovelace/config",url_path:"lovelace"===this.hass.panelUrl?null:this.hass.panelUrl,force:!1}).then((t=>{this.lovelaceConfig=t})).catch((t=>{})),this.config.interactive_areas&&(this.existingPointsToShow=Object.values(this.config.interactive_areas)),this.config.stream&&(this.videoReady=!0)}firstUpdated(){super.firstUpdated(),this.config.stream&&(this.videoReady=!0,setTimeout((()=>{this.videoReady=!1,setTimeout((()=>{this.videoReady=!0,this.height=this.width/(16/9)}),10)}),10))}setImage(t){const e=this.config[t.source];this.imageUrl=this.hass.states[e].attributes[t.source],this.showUpload=!1,this.subscribeToEntityChanges(e,t.source)}async subscribeToEntityChanges(t,e){this.unsubscribeEntity=await this.hass.connection.subscribeEvents((i=>{i.data.entity_id===t&&(this.hass.states[t]={...i.data.new_state},this.imageUrl="entity_state"===e?this.hass.states[t].state:`${this.hass.states[t].attributes[e]}&state=${this.hass.states[t].state}`)}),"state_changed")}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe&&(this.unsubscribe(),this.unsubscribe=null),this.unsubscribeEntity&&(this.unsubscribeEntity(),this.unsubscribeEntity=null),this.clearFile(),window.URL.revokeObjectURL(this.imageUrl),this.imageUrl="",this.file=null,this.resetInteractiveMakerState(),this.config.stream&&(this.videoReady=!1)}clearFile(){this.shadowRoot.getElementById("custom-image-preview")&&(this.shadowRoot.getElementById("custom-image-preview").value="")}getImageHeight(t){const e=this.shadowRoot.querySelector("ha-card");e.offsetWidth&&this.width>e.offsetWidth&&(this.width=e.offsetWidth-20,this.config.scale=Number(this.width)/300),this.config.stream?this.height=this.width/(16/9):t.originalTarget&&t.originalTarget.clientHeight?this.height=t.originalTarget.clientHeight:this.height=t.target.clientHeight}callActions(t){let e=t;if(this.config.use_vibration&&navigator.vibrate(100),this.interactiveImageMaker||(this.clickedInteractiveArea=t.points,setTimeout((()=>{this.clickedInteractiveArea=""}),300)),t&&t.confirm_action)return this.confirmAction={...e},void delete this.confirmAction.confirm_action;if(this.confirmAction=null,!e){const t=this.selectedEntity.split(".")[0];if(!this.hass.services[t])return;if(!this.selectedEntity||-1===Object.keys(this.hass.states).indexOf(this.selectedEntity)||!this.selectedAction||!this.hass.services[t]||-1===Object.keys(this.hass.services[t]).indexOf(this.selectedAction))return;e={service:this.selectedAction,entity_id:this.selectedEntity}}if("show_more"===e.service){const t=e.entity_id,i=new Event("hass-more-info",{bubbles:!0,composed:!0});return i.detail={entityId:t},void window.document.querySelector("home-assistant")?.dispatchEvent(i)}const i={type:"call_service",domain:e.entity_id.split(".")[0],service:e.service,target:{entity_id:e.entity_id}};e.service_data&&(i.service_data=e.service_data),"ptz"===e.service?this.hass.callService("onvif",e.service,e.service_data,{entity_id:e.entity_id}):this.hass.callWS(i)}handleSearchEntityChange(t){if(this.selectedEntity=t.target.value,this.selectedAction="",this.canSave=!1,t.target.value){const e=t.target.value.toLowerCase(),i=[];for(const t of Object.keys(this.hass.states))if(t.includes(e)){if(t===e)return void this.selectEntity(t);i.push(t)}this.filteredEntities=i}}showSearchEntities(){if(this.selectedEntity){const t=this.selectedEntity.toLowerCase(),e=[];for(const i of Object.keys(this.hass.states))if(i.includes(t)){if(i===t)return void this.selectEntity(i);e.push(i)}this.filteredEntities=e}else this.filteredEntities=Object.keys(this.hass.states)}focusOutSelectEntity(){setTimeout((()=>{this.filteredEntities=[]}),500)}selectEntity(t){this.selectedEntity=t,this.filteredEntities=[],this.canSave=!1}handleSearchActionChange(t){if(this.canSave=!1,this.selectedAction=t.target.value,t.target.value&&this.selectedEntity&&this.hass.states[this.selectedEntity]){const e=t.target.value.toLowerCase(),i=this.selectedEntity.split(".")[0];if(!this.hass.services[i])return;const s=Object.keys(this.hass.services[i]);s.push("show_more");const a=[];for(const t of s)if(t.includes(e)){if(t===e)return void this.selectAction(t);a.push(t)}this.filteredActions=a}else if(this.selectedEntity&&this.hass.states[this.selectedEntity]){const t=this.selectedEntity.split(".")[0];if(!t||!this.hass.services[t])return;const e=Object.keys(this.hass.services[t]);e.push("show_more"),this.filteredActions=e}}showSearchActions(){if(this.selectedEntity&&this.hass.states[this.selectedEntity]&&""===this.selectedAction){const t=this.selectedEntity.split(".")[0];if(!t||!this.hass.services[t])return;const e=Object.keys(this.hass.services[t]);e.push("show_more"),this.filteredActions=e}else if(this.selectedEntity&&this.hass.states[this.selectedEntity]&&""!==this.selectedAction){const t=this.selectedAction.toLowerCase(),e=this.selectedEntity.split(".")[0];if(!this.hass.services[e])return;const i=Object.keys(this.hass.services[e]);i.push("show_more");const s=[];for(const e of i)if(e.includes(t)){if(e===t)return void this.selectAction(e);s.push(e)}this.filteredActions=s}}focusOutSelectActions(t){setTimeout((()=>{this.filteredActions=[]}),500)}selectAction(t){this.selectedAction=t,this.filteredActions=[],""!==this.actionName&&(this.canSave=!0)}handleNameChange(t){if(t.target.value&&(this.actionName=t.target.value,this.selectedEntity&&this.selectedAction&&-1!==Object.keys(this.hass.states).indexOf(this.selectedEntity))){const t=this.selectedEntity.split(".")[0];if(!this.hass.services[t])return;const e=Object.keys(this.hass.services[t]);if(e.push("show_more"),-1!==e.indexOf(this.selectedAction))return void(this.canSave=!0)}this.canSave=!1}selectTab(t){t!==this.tab&&(this.tab=t,"addNew"===this.tab?this.toggleCanvas(!0):(this.deleteDrawing(),this.toggleCanvas(!1)))}toggleInteractiveAreas(){this.showInteractiveAreas=!this.showInteractiveAreas}toggleCanvas(t){t!==this.canvasActive&&(this.canvasActive=t||!this.canvasActive)}collectPoints(t){this.drawingPoints=[...t.detail.drawingPoints],this.drawingPointsForSVG=[...t.detail.drawingPointsForSVG]}deleteDrawing(){this.deleteDravingPoints=!this.deleteDravingPoints}undoLastDraw(){this.deleteLastPoint=!this.deleteLastPoint}saveDrawing(){const t={...this.lovelaceConfig};let e=!1;this.saving=!0;let i=!1;for(let s of t.views)if(s.cards)for(const t in s.cards)if("custom:interactive-image-card"===s.cards[t].type&&this.config.label===s.cards[t].label){const a={name:this.actionName,entity_id:this.selectedEntity,service:this.selectedAction,points:this.drawingPointsForSVG.join(",")};this.createConfirmAction&&(a.confirm_action=!0),s.cards[t].interactive_areas?.length?s.cards[t].interactive_areas.push(a):s.cards[t].interactive_areas=[a],this.config.interactive_areas?.length&&!i?(this.config.interactive_areas=[...this.config.interactive_areas,a],i=!0):i||(this.config.interactive_areas=[a],i=!0),e=!0}e&&(this.saveNewLovelaceCongif(t),this.resetInteractiveMakerState(),this.tab="existing")}toggleExistingArea(t){for(const e in this.existingPointsToShow)if(this.existingPointsToShow[e].points===t.points)return this.existingPointsToShow.splice(e,1),void this.requestUpdate();this.existingPointsToShow.push({...t,selected:!0}),this.requestUpdate()}resetConfirmAction(){this.confirmAction=null}toggleConfirAction(){this.createConfirmAction=!this.createConfirmAction}render(){return e`
    <ha-card>
        <section id="custom-interactive-image-card" class="flex-center">
            ${void 0!==this.hass?e`
                ${this.showUpload&&!this.errorMessage?e`
                    <div class="upload-image-container">
                        <div class="flex-center">
                            <input type="file" @change=${this.previewImage} id="custom-image-preview" class="info-container" />
                        </div>
                        ${""!==this.imageUrl?e`
                            <div class="flex-center">
                                
                                ${this.config.stream?e`
                                ${this.config.stream?e`
                                    <interactive-video-component
                                    .width=${this.width}
                                    .hass=${this.hass}
                                    .entity=${this.config.entity_picture} />
                                    `:e``}

                                `:e`
                                <img alt='your-image' src=${this.imageUrl} width="${this.width}">
                                `}
                                
                            </div>
                            <div class="flex-center">
                                <button @click=${this.uploadImage}>Upload</button>
                            </div>
                        `:e``}
                    </div>
                `:e`
                        ${this.interactiveImageMaker&&!this.errorMessage?e`
                                <ha-dialog open class='interactive-image-maker-container' @closed=${()=>this.toggleSettings(!1)}> 
                                    <div style="height:max-content;width:max-content;position: relative;margin: auto;">
                                    
                                    ${this.config.stream?e`
                                        <interactive-video-component
                                            .hass=${this.hass}
                                            .entity=${this.config.entity_picture}
                                            />
                                    `:e`
                                        <img alt="your-image" @load=${this.getImageHeight}
                                        src=${this.imageUrl} width="300px">
                                    `} 
                                        ${this.config.stream||this.height?e`
                                            ${"addNew"===this.tab?e`
                                            <interactive-canvas-component
                                                class="image-layer" 
                                                .deleteDravingPoints="${this.deleteDravingPoints}"
                                                .deleteLastPoint="${this.deleteLastPoint}"
                                                .height="${this.config.stream?this.interactiveMakerHeight:this.height}"
                                                .style="${this.canvasActive?"z-index:1":"z-index:0;"}"
                                                @touch-canvas-event=${this.collectPoints}
                                            ></interactive-canvas-component>
                                            `:e``}
                                            
                                            <svg width="300px" height="${this.config.stream?this.interactiveMakerHeight:this.height}" class="image-layer" style="pointer-events:all;">
                                                ${"addNew"!==this.tab&&[...this.existingPointsToShow]?.map((t=>e`
                                                    <svg>
                                                        <polygon points="${t.points}" style="fill: #ff4c4c2e;" @click="${()=>this.callActions(t)}"/>
                                                    </svg>
                                                `))}
                                                ${"addNew"===this.tab&&this.drawingPointsForSVG.length?e`
                                                    <svg>
                                                        <polygon points="${this.drawingPointsForSVG}" style="fill: #ff4c4c2e;" @click="${()=>this.callActions(null)}"/>
                                                    </svg>
                                                `:e``}
                                            </svg> 
                                            ${null!=this.confirmAction?e`
                                                <ha-dialog open @closed=${this.resetConfirmAction} .footer="null">
                                                    <div class='confirmation-modal' >
                                                        <p>Call action <b>${this.confirmAction.name}?</b></p>
                                                        <div>
                                                            <button @click=${this.resetConfirmAction}>Close</button>
                                                            <button @click="${()=>this.callActions(this.confirmAction)}">Confirm</button> 
                                                        </div>
                                                    </div>         
                                                </ha-dialog>
                                            `:e``}
                                        `:e``}
                                    </div>
                                    <div class="tab-container">
                                        ${this.config.interactive_areas?.length?e`
                                        <h3 class="${"existing"===this.tab?"selected-tab":""}" @click=${()=>this.selectTab("existing")}>Existing</h3>
                                        `:e``}
                                        <h3 class="${"addNew"===this.tab?"selected-tab":""}" @click=${()=>this.selectTab("addNew")}>Add new</h3>
                                    </div>
                                    ${"addNew"===this.tab?e`
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

                                            ${this.selectedEntity&&this.hass.states[this.selectedEntity]?e`
                                            <div class="filter-entity">
                                                <label>Service:</label>
                                                <input type="text" placeholder="Enter service" @input=${this.handleSearchActionChange} 
                                                    .value="${this.selectedAction}" 
                                                    @focus=${this.showSearchActions}
                                                    @blur=${this.focusOutSelectActions}>
                                            `:e``}

                                            ${this.filteredEntities.length?e`
                                                    <ul class="search-result-list">
                                                        ${[...this.filteredEntities].sort().map((t=>e`
                                                            <li @click=${()=>this.selectEntity(t)}>
                                                            ${t}
                                                            </li>
                                                        `))}
                                                    </ul>
                                                `:e``}
                                            ${this.selectedEntity&&this.filteredActions.length?e`
                                                <ul class="search-result-list">
                                                    ${[...this.filteredActions].sort().map((t=>e`
                                                        <li @click=${()=>this.selectAction(t)}>
                                                        ${t}
                                                        </li>
                                                    `))}
                                                </ul>
                                            `:e`
                                                <div class="filter-entity">
                                                    <p>
                                                        <span @click=${()=>this.toggleCanvas(!1)}>Tryout mode</span>
                                                        <ha-icon 
                                                            icon="${this.canvasActive?"mdi:toggle-switch":"mdi:toggle-switch-off"}" 
                                                            @click=${()=>this.toggleCanvas(null)} >
                                                        </ha-icon>
                                                        <span @click=${()=>this.toggleCanvas(!0)}>Draw mode</span>
                                                    </p>
                                                </div>

                                                <div class="filter-entity">
                                                    <button @click=${this.deleteDrawing} .disabled=${!this.drawingPoints.length}>Delete</button>
                                                    <button @click=${this.undoLastDraw} .disabled=${!this.drawingPoints.length} >Undo</button>
                                                    <button @click=${this.saveDrawing} 
                                                    .disabled=${!this.canSave||!this.drawingPoints.length} >Save</button>
                                                </div>
                                            `}
                                        </div>
                                    `:e`
                                        <div class="existing-actions-container">
                                            ${this.config.interactive_areas?.map((t=>{const i={...t};let s="";for(const e of this.existingPointsToShow)if(e.label===t.label&&e.points===t.points){s="existing-point-selected";break}return e`
                                                <div class="existing-actions flex-center ${s}" @click=${()=>this.toggleExistingArea(i)}>
                                                    <p>${i.name}</p>
                                                    <!-- <p><small>${i.entity_id.split(".")[1]}-${i.service}</small></p> -->
                                                </div>
                                            `}))}
                                        </div>
                                    `}

                                </div>
                                </ha-dialog>
                        `:e``}
                            ${this.errorMessage?e`
                                <div class="error-container"><p>${this.errorMessage}</p></div>
                            `:e`
                                ${this.width&&this.imageUrl?e`
                                <div>
                                    <div style="height:max-content;width:max-content;position: relative;">
                                        
                                        
                                        ${this.config.stream?e`
                                            ${this.config.stream&&this.videoReady?e`
                                                <interactive-video-component
                                                @load=${this.getImageHeight}
                                                .width=${this.width}
                                                .hass=${this.hass}
                                                .entity=${this.config.entity_picture} />

                                            `:e``}
                                            `:e`
                                        <img alt='your-image' src=${this.imageUrl} width="${this.width}" @load=${this.getImageHeight} > 
                                        `}

                                        ${this.height?e`
                                            <svg width="${this.width}" height="${this.height}" class="image-layer" style="pointer-events:all;">
                                                ${this.config.interactive_areas?.map((t=>{const i=t.points.split(",").map((t=>""+t.split(",").map(Number)*this.config.scale)).join(",");return e`
                                                    <svg>
                                                        <polygon points="${i}" 
                                                            class="${this.clickedInteractiveArea===t.points||this.showInteractiveAreas?"show-interactive-area":"hide-interactive-area"}" 
                                                            @click="${()=>this.callActions(t)}"/>
                                                    </svg>
                                                    `}))}
                                            </svg>    
                                            ${null!=this.confirmAction?e`
                                                <ha-dialog open @closed=${this.resetConfirmAction}>
                                                    <div class='confirmation-modal' >
                                                        <p>Call action <b>${this.confirmAction.name}?</b></p>
                                                        <div>
                                                            <button @click=${this.resetConfirmAction}>Close</button>
                                                            <button @click="${()=>this.callActions(this.confirmAction)}">Confirm</button> 
                                                        </div>
                                                    </div>                                                                           
                                                </ha-dialog>
                                            `:e``}
                                        `:e``} 
                                    </div>
                                    ${this.config.editable?e`                            
                                        <div class="flex-center">
                                            <ha-icon icon="${this.showInteractiveAreas?"mdi:toggle-switch":"mdi:toggle-switch-off"}" style="color:darkgrey;margin-right:1em;" @click=${this.toggleInteractiveAreas} ></ha-icon>
                                            <ha-icon icon="mdi:pencil" style="color:darkgrey;" @click=${()=>this.toggleSettings(!0)} ></ha-icon>
                                        </div>
                                    `:e``}

                                </div>
                            `:e``}
                        `}
                    `}            
            `:e``}
        </section>
    </ha-card>

        `}static styles=s`
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
        margin: auto;
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
    `}window.customCards=window.customCards||[],window.customCards.push({type:"interactive-image-card",name:"Custom interactive image card",preview:!0,description:"An interactive image card for Home Assistant"}),customElements.define("interactive-image-card",a)})()})();
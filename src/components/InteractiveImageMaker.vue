<template>
    <ha-dialog open hideActions @closed="$emit('closeInteractiveImageMaker')">
        <ha-icon
            :style="styles.close_icon"
            @click="$emit('closeInteractiveImageMaker')"
            icon="mdi:close"
        ></ha-icon>

        <div
            :style="`${styles.interactive_container} height: ${config.stream ? 300 / (16 / 9) : height}px;`"
        >
            <InteractiveImageComponent
                :imageUrl="imageUrl"
                :width="width"
                :config="config"
                :height="config.stream ? 300 / (16 / 9) : height"
                :hass="hass"
                @setupHeight="getImageHeight"
            />

            <template v-if="height">
                <InteractiveCanvasComponent
                    v-if="tab === 'addNew'"
                    :deleteDrawingPoints="deleteDrawingPoints"
                    :deleteLastPoint="deleteLastPoint"
                    :height="config.stream ? 300 / (16 / 9) : height"
                    style="position: absolute; top: 0; left: 0"
                    :style="canvasActive ? 'z-index:1;' : 'z-index:0;'"
                    @customCanvasEvent="collectPoints"
                ></InteractiveCanvasComponent>

                <InteractiveSVGComponent
                    v-if="height && (config.interactive_areas || tab === 'addNew')"
                    :width="width"
                    :height="height"
                    :config="config"
                    :hass="hass"
                    :interactiveImageMaker="true"
                    :showInteractiveAreas="false"
                    :tab="tab"
                    :selectedAreas="selectedAreas"
                    :drawingPointsForSVG="drawingPointsForSVG"
                    :selectedEntityAndAction="selectedEntityAndAction"
                />
            </template>
        </div>

        <div :style="styles.flex">
            <div
                v-if="config.interactive_areas?.length"
                @click="selectTab('existing')"
                :style="styles.button_wrapper"
            >
                <mwc-button :style="tab === 'existing' ? styles.selected_border :''">
                    <h3 :style="styles.tab_name">Existing</h3>
                </mwc-button>
            </div>

            <div @click="selectTab('addNew')" :style="styles.button_wrapper">
                <mwc-button :style="tab === 'addNew' ? styles.selected_border : ''">
                    <h3 :style="styles.tab_name">Add new</h3>
                </mwc-button>
            </div>
        </div>

        <AddNewAreaTab
            v-if="tab === 'addNew'"
            :canvasActive="canvasActive"
            :config="config"
            :states="hass.states"
            :services="hass.services"
            :points="drawingPointsForSVG.length ? drawingPointsForSVG.join(',') : ''"
            @toggleCanvas="toggleCanvas"
            @toggleDeleteAllPoints="deleteDrawingPoints = !deleteDrawingPoints"
            @toggleDeleteLastPoint="deleteLastPoint = !deleteLastPoint"
            @selectEntityAndAction="selectEntityAndAction"
        />

        <ExistingAreasTab
            v-else-if="tab === 'existing'"
            :config="config"
            :selectedAreas="selectedAreas"
            @setSelectedAreas="setSelectedAreas"
        />
    </ha-dialog>
</template>

<script lang="ts">
import { defineComponent, type PropType, onMounted, ref } from 'vue';
import type { Config, Hass, EntityAction } from '@/types';
import { styles } from '@/style';
import { calculateImageHeight } from '@/helpers';
import InteractiveCanvasComponent from './InteractiveCanvasComponent.vue';
import ExistingAreasTab from './ExistingAreasTab.vue';
import AddNewAreaTab from './AddNewAreaTab.vue';
import InteractiveImageComponent from './InteractiveImageComponent.vue';
import InteractiveSVGComponent from './InteractiveSVGComponent.vue';


export default defineComponent({
    name: 'InteractiveImageMaker',
    components: {
        InteractiveCanvasComponent,
        AddNewAreaTab,
        ExistingAreasTab,
        InteractiveImageComponent,
        InteractiveSVGComponent
    },
    props: {
        imageUrl: String,
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        hass: {
            type: Object as PropType<Hass>,
            required: true
        }
    },
    emits: ['closeInteractiveImageMaker'],
    setup(props) {
        const height = ref(0);
        const width = ref(300);
        const tab = ref('');
        const deleteDrawingPoints = ref(false);
        const deleteLastPoint = ref(false);
        const canvasActive = ref(false);
        const drawingPoints = ref<{ x: string; y: string }[]>([]);
        const drawingPointsForSVG = ref<string[]>([]);
        const selectedAreas = ref<string[]>([]);
        const selectedEntityAndAction = ref<EntityAction | null>(null);
        const selectedAction = ref('');

        const selectEntityAndAction = (data: EntityAction | null) => {
            selectedEntityAndAction.value = { ...data };
        };

        const setSelectedAreas = (data: string[]) => {
            selectedAreas.value = data;
        };

        const getImageHeight = (e: Event) => {
            height.value = calculateImageHeight(e);
        };

        const collectPoints = (e: CustomEvent) => {
            const { drawingPoints: newDrawingPoints, drawingPointsForSVG: newDrawingPointsForSVG } =
                e.detail;

            drawingPoints.value = [...newDrawingPoints];
            drawingPointsForSVG.value = [...newDrawingPointsForSVG];
        };

        const toggleCanvas = (data: boolean) => {
            canvasActive.value = data;
        };

        const selectTab = (val:string) => {
            if (tab.value === val) return;

            tab.value = val;

            if (tab.value === 'existing') {
                deleteDrawingPoints.value = !deleteDrawingPoints.value;
                toggleCanvas(false);
            } else {
                toggleCanvas(true);
            }
        }

        onMounted(() => {           
            if(props.config.interactive_areas)
            {
                selectTab('existing');
            } else {
                selectTab('addNew');
            }
        });

        return {
            selectedAreas,
            height,
            tab,
            deleteDrawingPoints,
            deleteLastPoint,
            canvasActive,
            drawingPoints,
            drawingPointsForSVG,
            styles,
            selectedAction,
            width,
            selectedEntityAndAction,
            selectTab,
            selectEntityAndAction,
            getImageHeight,
            collectPoints,
            toggleCanvas,
            setSelectedAreas,
        };
    }
});
</script>

<template>
    <template v-if="config">
        <div :style="styles.main_container">
            <InteractiveImageComponent
                :imageUrl="imageUrl"
                :width="internalConfig.width"
                :config="config"
                :hass="hass"
                :useVideoKey="true"
                @setupHeight="getImageHeight"
            />
            <InteractiveSVGComponent
                v-if="height && config.interactive_areas"
                :scale="internalConfig.scale"
                :width="internalConfig.width"
                :height="height"
                :config="config"
                :hass="hass"
                :interactiveImageMaker="interactiveImageMaker"
                :showInteractiveAreas="showInteractiveAreas"
            />
        </div>
        <div v-if="config.editable" :style="styles.flex">
            <ha-icon
                :icon="showInteractiveAreas ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'"
                :style="styles.toggle_switch"
                @click="showInteractiveAreas = !showInteractiveAreas"
            ></ha-icon>
            <ha-icon
                icon="mdi:pencil"
                :style="styles.open_interactive_maker"
                @click="$emit('openInteractiveImageMaker')"
            >
            </ha-icon>
        </div>
    </template>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import type { Config, Hass } from '@/types';
import { calculateImageHeight } from '@/helpers';
import InteractiveImageComponent from '../components/InteractiveImageComponent.vue';
import InteractiveSVGComponent from '../components/InteractiveSVGComponent.vue';
import { styles } from '@/style';

export default defineComponent({
    name: 'MainView',
    components: {
        InteractiveImageComponent,
        InteractiveSVGComponent
    },
    props: {
        interactiveImageMaker: Boolean,
        tab: String,
        imageUrl: String,
        internalConfig: {
            type: Object,
            required: true
        },
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        hass: {
            type: Object as PropType<Hass>,
            required: true
        }
    },
    emits: ['openInteractiveImageMaker'],
    setup() {
        const showInteractiveAreas = ref(false);
        const height = ref(0);

        const getImageHeight = (e: Event) => {
            height.value = calculateImageHeight(e);
        };

        return {
            getImageHeight,
            height,
            showInteractiveAreas,
            styles
        };
    }
});
</script>

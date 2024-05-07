<template>
    <ha-card :style="styles.ha_card">
        <h1 :style="styles.toggle_areas">
            <span @click="toggleAllExistingArea(false)" :style="styles.toggle_all_areas">
                Toggle areas
            </span>
        </h1>
        <div
            @click="toggleExistingArea(item)"
            :style="styles.toggle_one_area"
            v-for="item in config.interactive_areas"
            :key="item.points"
        >
            <mwc-button :disabled="selectedAreas.indexOf(item.points) === -1">
                {{ item.name ? item.name : 'unknown' }}
            </mwc-button>
        </div>
        
    </ha-card>
</template>

<script lang="ts">
import type { Config, InteractiveAreas } from '@/types';
import { defineComponent, onMounted, type PropType } from 'vue';
import { styles } from '@/style'

export default defineComponent({
    name: 'ExistingAreasTab',
    props: {
        selectedAreas: {
            type: Array,
            required: true
        },
        config: {
            type: Object as PropType<Config>,
            required: true
        }
    },
    emits: ['setSelectedAreas', 'editExistingAreaButton'],
    setup(props, context) {
        const toggleAllExistingArea = (toggleAnyway: boolean) => {
            const areas = [];

            if (!props.config.interactive_areas) {
                return;
            }

            if ((props.config.interactive_areas 
            && props.selectedAreas.length !== props.config.interactive_areas.length)
            || toggleAnyway) {
                for (const area of props.config.interactive_areas) {
                    areas.push(area.points);
                }
            }

            context.emit('setSelectedAreas', areas);
        };

        const toggleExistingArea = (item: InteractiveAreas) => {
            const index = props.selectedAreas.indexOf(item.points);
            const areas = [...props.selectedAreas];

            if (index === -1) {
                areas.push(item.points);
            } else {
                areas.splice(index, 1);
            }

            context.emit('setSelectedAreas', areas);
        };

        onMounted(() => {
            toggleAllExistingArea(true);
        });

        return {
            toggleAllExistingArea,
            toggleExistingArea,
            styles
        };
    }
});
</script>

<template>
    <svg
        :width="width"
        :height="height"
        :style="styles.svg_style"
    >
        <polygon
            v-if="drawingPointsForSVG?.length && tab === 'addNew'"
            :points="drawingPointsForSVG.join(',')"
            style="fill: #ff4c4c2e"
            @click.stop="callActions(null)"
        />
        <template v-else-if="interactiveAreasOut">
            <polygon
                v-for="item in interactiveAreasOut"
                :key="item.points"
                :points="scaledPoints(item)"
                :style="calculateStyle(item)"
                @click.stop="callActions(item)"
            />
        </template>
        
    </svg>
    <ha-dialog v-if="confirmAction" open hideActions @closed="confirmAction = null">
        <div>
            <p :style="styles.flex">
                Call action &nbsp; <b>{{ confirmAction.name }}?</b>
            </p>
            <div :style="styles.flex">
                <mwc-button @click="confirmAction = null">Close</mwc-button>
                <mwc-button @click="callActions(confirmAction)">Confirm</mwc-button>
            </div>
        </div>
    </ha-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref, type PropType } from 'vue';
import type { Config, Hass, InteractiveAreas, EntityAction } from '@/types';
import { callService } from '@/helpers';
import { styles } from '@/style';


export default defineComponent({
    name: 'InteractiveSVGComponent',
    props: {
        tab: String,
        interactiveImageMaker: Boolean,
        showInteractiveAreas: Boolean,
        scale: {
            type:Number,
            default:1
        },
        width: Number,
        height: Number,
        selectedAreas: Array,
        drawingPointsForSVG: Array,
        selectedEntityAndAction: Object as PropType<EntityAction | null>,
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        hass: {
            type: Object as PropType<Hass>,
            required: true
        }
    },
    emits: ['setupHeight'],
    setup(props) {
        const confirmAction = ref<InteractiveAreas | null>(null);
        const clickedInteractiveArea = ref('');

        const interactiveAreasOut = computed(()=>{
            if (!props.config?.interactive_areas) return null;

            let items:InteractiveAreas[] = [];

            for (const item of props.config.interactive_areas)
            {
                if(!item.points)
                {
                    continue;
                }
                items.push(item)
            }

            return items;
        })

        const scaledPoints = (item: InteractiveAreas) => {
            const points = item.points || ''
         
            if (!props.scale || props.scale === 1) {
                return points;
            }

            const scaledPointsOut = points
                .split(',')
                .map((point) => {
                    const pointOut = point.split(',').map(Number);
                    return `${Number(pointOut) * props.scale}`;
                })
                .join(',');
            return scaledPointsOut;
        };

        const calculateStyle = (item: InteractiveAreas) => {
            if (
                (props.tab === 'existing' && props.selectedAreas?.indexOf(item.points) !== -1) ||
                clickedInteractiveArea.value === item.points ||
                props.showInteractiveAreas ||
                (props.tab === 'addNew' && props.drawingPointsForSVG?.length)
                || item.always_visible && !props.interactiveImageMaker
            ) {
                return `fill: #ff4c4c2e`;
            }

            return `fill: transparent;`;
        };

        const callActions = (dataIn: InteractiveAreas | null) => {
            // todo add support for multiple entities??

            let data = dataIn;
            if (!data) {
                data = {
                    entity_id: props.selectedEntityAndAction?.selectedEntity || '',
                    service: props.selectedEntityAndAction?.selectedAction || '',
                    confirm_action: props.selectedEntityAndAction?.createConfirmAction || false
                };
            }

            if (props.config.use_vibration) {
                navigator.vibrate(100);
            }

            if (data && data.confirm_action) {
                confirmAction.value = { ...data };
                delete confirmAction.value!.confirm_action;
                return;
            }

            if (!props.interactiveImageMaker && data.points) {
                clickedInteractiveArea.value = data.points;

                setTimeout(() => {
                    clickedInteractiveArea.value = '';
                }, 300);
            }

            confirmAction.value = null;

            callService(data, props.hass);
        };
        
        return {
            confirmAction,
            clickedInteractiveArea,
            styles,
            interactiveAreasOut,
            callActions,
            scaledPoints,
            calculateStyle
        };
    }
});
</script>

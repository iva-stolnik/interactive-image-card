<template>
    <img
        v-if="!config.stream"
        alt="your-image"
        :src="imageUrlOut"
        :width="width"
        style="border: 1px solid #515151;"
        @load="getImageHeight"
    />
    <hui-image
        v-else
        alt="your-image"
        :key="videoReady"
        :style="`width:${width}px; position:relative;border: 1px solid #515151;`"
        :hass="hass"
        :entity="config.entity_picture"
        :cameraImage="config.entity_picture"
        :cameraView="config.entity_picture ? 'live' : ''"
        :aspectRatio="config.entity_picture ? '16:9' : ''"
        @load="getImageHeight"
    ></hui-image>
</template>

<script lang="ts">
import { defineComponent, ref, watch, type PropType, onMounted, computed, onBeforeUnmount } from 'vue';
import type { Config, Hass, HassEntity } from '@/types';

export default defineComponent({
    name: 'InteractiveImageComponent',
    props: {
        imageUrl: {
            type: String,
            default: '',
        },
        width: {
            type: Number,
            default: 300,
        },
        height: Number,
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        hass: {
            type: Object as PropType<Hass>,
            required: true
        },
        useVideoKey: Boolean
    },
    emits: ['setupHeight'],
    setup(props, context) {
        const imageUrlOut = ref('');
        const videoReady = ref(false);
        const videoTimeout = ref<number | null>(null);

        const entity_picture = computed(() => props.config.entity_picture || '');

        const getImageHeight = (e: Event) => {
            context.emit('setupHeight', e);
        };

        const buildImageUrl = (entity:HassEntity) => {
            if (!entity || !entity.attributes['entity_picture'] || !entity.state) {
                return ''; // todo, add error
            }
            const base = entity.attributes['entity_picture'];
            const stateParam = `state=${entity.state}`;
            return `${base}&${stateParam}`;
        };
                
        onMounted(() => {
            if (props.useVideoKey) {
                videoTimeout.value = setTimeout(() => {
                    videoReady.value = true;
                }, 1000);
            }
            if (entity_picture.value && props?.hass?.states[entity_picture.value] && !props.config.stream) {
                const entity = props.hass.states[entity_picture.value];
                imageUrlOut.value = buildImageUrl(entity);
            }
            else if(props.imageUrl)
            {
                imageUrlOut.value = props.imageUrl;
            }
        });

        onBeforeUnmount(() => {
            if (videoTimeout.value !== null) {
                clearTimeout(videoTimeout.value);
            }
        })

        watch(
            () => props?.hass?.states[entity_picture.value],
            (val) => {
                if (val) {
                    imageUrlOut.value = buildImageUrl(val);
                }
            }
        );

        return {
            getImageHeight,
            imageUrlOut,
            videoReady
        };
    }
});
</script>

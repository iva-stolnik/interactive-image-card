<template>
    <ha-card ref="haCardRef">
        <section style="padding: 0.5em">
            <template v-if="config?.editable">
                <UploadImage
                    v-if="config && !config.url && !config.entity_picture"
                    :config="config"
                    :hass="hass"
                    :internalConfig="internalConfig"
                    @setErrorMessage="setErrorMessage"
                />

                <MainView
                    v-if="!errorMessage && (config?.url || config?.entity_picture)"
                    :interactiveImageMaker="interactiveImageMaker"
                    :imageUrl="imageUrl"
                    :config="config"
                    :internalConfig="internalConfig"
                    :hass="hass"
                    @openInteractiveImageMaker="interactiveImageMaker = true"
                />

                <InteractiveImageMaker
                    v-if="!errorMessage && config && interactiveImageMaker"
                    :imageUrl="imageUrl"
                    :config="config"
                    :internalConfig="internalConfig"
                    :hass="hass"
                    @closeInteractiveImageMaker="interactiveImageMaker = false"
                />
            </template>

            <ErrorMessage v-if="errorMessage" :errorMessage="errorMessage" />
        </section>
    </ha-card>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref, watch } from 'vue';
import MainView from './views/MainView.vue';
import UploadImage from './components/UploadImage.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import InteractiveImageMaker from './components/InteractiveImageMaker.vue';
import type { Config, Hass, InternalConfig } from '@/types';

export default defineComponent({
    components: {
        MainView,
        UploadImage,
        InteractiveImageMaker,
        ErrorMessage
    },
    props: {
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        hass: {
            type: Object as PropType<Hass>,
            required: true
        }
    },
    setup(props) {
        const errorMessage = ref('');
        const imageUrl = ref('');
        const interactiveImageMaker = ref(false);
        const internalConfig = ref<InternalConfig>({
            width: 300,
            scale: 1
        });
        const haCardRef = ref<HTMLElement | null>(null);

        const setErrorMessage = (error: string) => {
            errorMessage.value = error;
        };

        watch(
            () => haCardRef.value,
            (val) => {
                if (val && val.offsetWidth) {
                    let width = val.offsetWidth - 20;
                    const preferedImageWidth = props.config?.size
                        ? Number(props.config.size)
                        : width;

                    if (width > preferedImageWidth) {
                        width = preferedImageWidth;
                    }

                    internalConfig.value = {
                        width,
                        scale: width / 300
                    };
                }
            }
        );

        watch(
            () => props?.config,
            (val) => {
                errorMessage.value = '';

                if (val) {
                    if (!val.editable) {
                        errorMessage.value =
                            'Property "editable" is required. "e.g. editable: true"';
                    } else if (val.url) {
                        imageUrl.value = val.url;
                    }
                }
            },
            {
                immediate: true
            }
        );

        return {
            setErrorMessage,
            errorMessage,
            interactiveImageMaker,
            imageUrl,
            haCardRef,
            internalConfig
        };
    }
});
</script>

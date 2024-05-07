<template>
    <div :style="styles.flex_column" style="min-height: 150px; position: relative" >
        <ha-dialog open hideActions v-if="openDialog" @closed="openDialog = false">
            <div :style="styles.flex_column" style="margin: 1em">
                <p :style="styles.delete_image_paragraph">Delete image <b>{{imageUrl}}</b></p>
                

                <div :style="styles.flex">
                    <div @click="deleteImage" style="cursor: pointer">
                        <mwc-button>Delete</mwc-button>
                    </div>
                    <div @click="openDialog = false" style="cursor: pointer">
                        <mwc-button>Close</mwc-button>
                    </div>
                </div>
            </div>
        </ha-dialog>
        <div :style="styles.flex" style="margin: 1em">
            <div @click="changeTab('uploadTab')" style="cursor: pointer">
                <mwc-button :style="tab === 'uploadTab' ? styles.selected_tab : ''">
                    <h3 style="padding: 0.5em">Upload image</h3>
                </mwc-button>
            </div>
            <div v-if="HAimages.length" @click="changeTab('browseHA')" style="cursor: pointer">
                <mwc-button :style="tab === 'browseHA' ? styles.selected_tab : ''">
                    <h3 style="padding: 0.5em">Browse HA</h3>
                </mwc-button>
            </div>
        </div>
        <div v-if="tab === 'uploadTab'" :style="styles.upload_container">
            <input type="file" @change="previewImage" />
        </div>
        <div v-if="imageUrl" :style="styles.flex_column" style="width: 300px">
            <!-- left button -->
            <mwc-button
                v-if="tab === 'browseHA' && HAimages.length"
                @click="selectPrevious"
                :style="styles.select_previous"
            >
                <ha-icon icon="mdi:chevron-down"></ha-icon>
            </mwc-button>
            <!-- right -->
            <mwc-button
                v-if="tab === 'browseHA' && HAimages.length"
                @click="selectNext"
                :style="styles.select_next"
            >
                <ha-icon icon="mdi:chevron-down"></ha-icon>
            </mwc-button>

            <div style="position: relative; width: 300px" >
                <img v-if="!config!.stream" alt="your-image" :src="imageUrl" :width="300" ref="imageToUploadRef"/>
                <hui-image
                    v-else
                    :style="`width:300px`"
                    :hass="hass"
                    :entity="config!.entity_picture"
                    :cameraImage="config!.entity_picture"
                    cameraView="live"
                    aspectRatio="16:9"
                ></hui-image>

                <div
                    v-if="tab === 'browseHA' && HAimages.length"
                    :style="styles.flex"
                    style="flex-wrap: wrap"
                >
                    <mwc-button
                        v-if="tab === 'browseHA'"
                        :style="styles.delete_image"
                        @click="openDialog = true"
                    >
                        <ha-icon icon="mdi:trash-can"></ha-icon>
                    </mwc-button>
                    <mwc-button @click="shouldGenerateYaml = true"> YAML </mwc-button>
                    <YamlDialog
                        v-if="YAMLconfig"
                        :config="YAMLconfig"
                        @closeDialog="shouldGenerateYaml = false"
                    />
                </div>
            </div>

            <div v-if="tab === 'uploadTab'" class="flex-center">
                <mwc-button @click="uploadImage">Upload</mwc-button>
            </div>
        </div>
        <ha-alert
            v-if="success || error"
            :alert-type="success ? 'success' : 'error'"
            :title="success ? 'Success' : 'Error'"
            :style="styles.alert_style"
        >
            {{ success ? success : error }}
        </ha-alert>
    </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, type PropType, watch, nextTick } from 'vue';
import type { Config, Hass, UploadedImage } from '@/types';
import { callService } from '@/helpers';
import { styles } from '@/style';
import YamlDialog from './YamlDialog.vue';

export default defineComponent({
    name: 'UploadImage',
    components: {
        YamlDialog
    },
    props: {
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        internalConfig: {
            type: Object,
            required: true
        },
        hass: {
            type: Object as PropType<Hass>,
            required: true
        }
    },
    emits: ['setErrorMessage'],
    setup(props, context) {
        const shouldGenerateYaml = ref(false);
        const YAMLconfig = ref<Config | null>(null);
        const imageToUploadRef= ref<HTMLInputElement | null>(null);
        const imageUrl = ref('');
        const file = ref<File | null>(null);
        const HAimages = ref<string[]>([]);
        const tab = ref('uploadTab');
        const openDialog = ref(false);
        const imageIndex = ref(0);
        const success = ref('');
        const error = ref('');

        const createYAMLconfig = () => {
            const propsOut = { ...props.config };

            propsOut.url = imageUrl.value;
            YAMLconfig.value = { ...propsOut };
        };

        const changeTab = (newTab: string) => {
            if (tab.value === newTab) return;

            tab.value = newTab;
            if (tab.value === 'browseHA') {
                imageUrl.value = HAimages.value[0];
            } else {
                imageUrl.value = '';
            }
        };

        const updateImagesEntity = () => {
            const data = {
                domain: 'homeassistant',
                service: 'update_entity',
                entity_id: 'sensor.image'
            };

            callService(data, props.hass);
        };

        const deleteImage = () => {
            let id: string | string[] = imageUrl.value.split('/');
            id = id[id.length - 2];

            props.hass
                .callWS({
                    type: 'image/delete',
                    image_id: id
                })
                .then(() => {
                    openDialog.value = false;

                    selectPrevious();
                    success.value = 'Image deleted';
                    clearMsg({ successMsg: true });
                    updateImagesEntity();
                })
                .catch(() => {
                    error.value = 'Error with deleting image';
                    clearMsg({ errorMsg: true });
                });
        };

        const selectPrevious = () => {
            let currentIndex = imageIndex.value;
            imageIndex.value = currentIndex === 0 ? HAimages.value.length - 1 : currentIndex - 1;
            imageUrl.value = HAimages.value[imageIndex.value];
        };

        const selectNext = () => {
            let currentIndex = imageIndex.value;
            imageIndex.value = currentIndex === HAimages.value.length - 1 ? 0 : currentIndex + 1;
            imageUrl.value = HAimages.value[imageIndex.value];
        };

        const uploadImage = () => {
            const fileIn = file.value;
            const safeFileName = fileIn!.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
            const formData = new FormData();
            formData.append('file', fileIn!, safeFileName);

            props.hass
                .fetchWithAuth('/api/image/upload', {
                    method: 'POST',
                    body: formData
                })
                .then((response: any) => {
                    if (response.status === 413) {
                        throw new Error(`Uploaded image is too large (${fileIn!.name})`);
                    } else if (response.status !== 200) {
                        throw new Error('Unknown error occurred during image upload');
                    }

                    return response.json();
                })
                .then((data: UploadedImage) => {
                    success.value = 'Image uploaded';
                    clearMsg({ successMsg: true });

                    window.URL.revokeObjectURL(imageUrl.value);

                    file.value = null;
                    const url = `/api/image/serve/${data.id}/512x512`;

                    clearFile();

                    imageUrl.value = url;
                    tab.value = 'browseHA';

                    updateImagesEntity();
                })
                .catch(() => {
                    error.value = 'Error with uploading image';
                    clearMsg({ errorMsg: true });
                });
        };

        const clearMsg = (data: { errorMsg?: boolean; successMsg?: boolean  }) => {
            setTimeout(() => {
                if (data.errorMsg) {
                    error.value = '';
                } else {
                    success.value = '';
                }
            }, 2000);
        };

        const previewImage = (e: Event) => {
            const event = e as Event & { target: HTMLInputElement };

            context.emit('setErrorMessage', '');
            clearFile();

            if (imageUrl.value) {
                window.URL.revokeObjectURL(imageUrl.value);
            }

            if (!event.target.files || !event.target.files[0]) {
                return;
            }

            if (!['image/png', 'image/jpeg', 'image/gif'].includes(event.target.files[0].type)) {
                const msg = `Image format ${event.target.files[0].type} is unsupported. Supported formats are "png", "jpeg" or "gif".`;

                clearFile()
                context.emit('setErrorMessage', msg);
                return;
            }

            file.value = event.target.files[0];
            const url = window.URL.createObjectURL(file.value!);
            imageUrl.value = url;
            //here
        };

        const clearFile = () => {
            if (imageUrl.value) {
                window.URL.revokeObjectURL(imageUrl.value);
                imageUrl.value = '';
            }
            file.value = null;
        };

        /* 
        // config.yaml requrements
        homeassistant:
            allowlist_external_dirs:
                - "/config/image"

        sensor:
            - platform: folder
                folder: /config/image
                filter: "*"
        */
        // todo add this to config so it can be dynamic if there are other folders
        watch(
            () => props.hass?.states['sensor.image'],
            (val) => {
                if (val) {
                    const images = val.attributes?.file_list;

                    HAimages.value = images.map((item: string) => {
                        let itemOut = item.split('/')[3];
                        itemOut = `/api/image/serve/${itemOut}/512x512`;
                        return itemOut;
                    });

                    if (imageUrl.value) {
                        imageIndex.value = HAimages.value.indexOf(imageUrl.value);
                    }
                }
            }
        );

        watch(
            () => shouldGenerateYaml.value,
            (val) => {
                if (val === true) {
                    createYAMLconfig();
                } else {
                    YAMLconfig.value = null;
                }
            }
        );

        watch(
            () => imageToUploadRef.value,
            (val) => {
                nextTick(()=>{
                    val?.scrollIntoView()
                })
            },
            {
                deep:true
            }
        );

        onBeforeUnmount(() => {
            clearFile();
        });

        return {
            previewImage,
            uploadImage,
            changeTab,
            selectPrevious,
            selectNext,
            deleteImage,
            shouldGenerateYaml,
            YAMLconfig,
            openDialog,
            tab,
            HAimages,
            imageUrl,
            styles,
            success,
            error,
            imageToUploadRef
        };
    }
});
</script>

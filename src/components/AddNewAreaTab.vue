<template>
    <ha-card :style="styles.ha_card_new_area" ref="haCardRef">
        <YamlDialog
            v-if="YAMLconfig"
            :config="YAMLconfig"
            :points="points"
            :createConfirmAction="createConfirmAction"
            @closeDialog="shouldGenerateYaml = false"
        />

        <div :style="`${styles.flex_space_evenly} ${styles.tryout_mode}`">
            <div @click="$emit('toggleCanvas', false)" :style="styles.cursor">
                <mwc-button :disabled="canvasActive">Tryout mode</mwc-button>
            </div>
            <ha-icon
                :icon="canvasActive ? 'mdi:toggle-switch' : 'mdi:toggle-switch-off'"
                @click="$emit('toggleCanvas', !canvasActive)"
            >
            </ha-icon>
            <div @click="$emit('toggleCanvas', true)" :style="styles.cursor">
                <mwc-button :disabled="!canvasActive">Draw mode</mwc-button>
            </div>
        </div>

        <div :style="`${styles.flex_wrap} ${styles.inputs_container}`">
            <div :style="styles.flex_child">
                <label for="confirmAction" >Confirm action: &nbsp;</label>
                <input type="checkbox" id="confirmAction" @change="toggleConfirmAction" :checked="createConfirmAction" />
            </div>

            <div :style="`${styles.flex_child} ${styles.flex_inputs}`">
                <label for="areaName">Name:</label>
                <input
                    id="areaName"
                    type="text"
                    placeholder="Enter name"
                    ref="areaNameRef"
                    @focus="scrollIntoView"
                    :style="styles.input"
                />
            </div>

            <div :style="`${styles.flex_child} ${styles.flex_inputs}`" ref="entityContainerRef">
                <label for="entityId">Entity:</label>
                <input
                    id="entityId"
                    type="text"
                    placeholder="Enter entity"
                    @input="handleSearchEntityChange"
                    :value="selectedEntity"
                    @focus="showSearchEntities"
                    :style="styles.input"
                />
                <mwc-list
                    v-if="filteredEntities.length && !filteredServices.length"
                    :style="styles.list_container"
                    ref="entitiesListRef"
                >
                    <ha-list-item
                        style="list-style: none"
                        v-for="item in filteredEntities"
                        :key="item"
                        @click="selectEntity(item)"
                    >
                        {{ item }}
                    </ha-list-item>
                </mwc-list>
            </div>

            <div :style="`${styles.flex_child} ${styles.flex_inputs}`" ref="serviceContainerRef">
                <label for="serviceName">Service:</label>
                <input
                    id="serviceName"
                    type="text"
                    placeholder="Enter service"
                    @input="handleSearchActionChange"
                    :value="selectedAction"
                    @focus="showSearchActions"
                    :style="styles.input"
                />
                <mwc-list
                    v-if="!filteredEntities.length && selectedEntity && filteredServices.length"
                    :style="styles.list_container"
                    ref="servicesListRef"
                >
                    <ha-list-item
                        v-for="item in filteredServices"
                        :key="item"
                        @click="selectAction(item)"
                    >
                        {{ item }}
                    </ha-list-item>
                </mwc-list>
            </div>

            <div :style="styles.flex_space_evenly" style="margin-top: 1em">
                <mwc-button @click="$emit('toggleDeleteAllPoints')" :disabled="!points.length">
                    Delete
                </mwc-button>
                <mwc-button @click="$emit('toggleDeleteLastPoint')" :disabled="!points.length">
                    Undo
                </mwc-button>
                <mwc-button @click="clearAllInputs">
                    Clear
                </mwc-button>
                
                <mwc-button @click="shouldGenerateYaml = true"> YAML </mwc-button>
            </div>
        </div>
    </ha-card>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onBeforeUnmount, type PropType, nextTick, onMounted } from 'vue';
import type { Config, InteractiveAreas } from '@/types';
import YamlDialog from './YamlDialog.vue';
import { styles } from '@/style';

export default defineComponent({
    name: 'AddNewAreaTab',
    components: {
        YamlDialog
    },
    props: {
        points: {
            type: String,
            required: true
        },
        canvasActive: {
            type: Boolean,
            required: true
        },
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        states: {
            type: Object,
            required: true
        },
        services: {
            type: Object,
            required: true
        }
    },
    emits: [
        'toggleDeleteAllPoints',
        'toggleDeleteLastPoint',
        'toggleCanvas',
        'selectEntityAndAction',
    ],
    setup(props, context) {
        const previousWindowHeight = ref(0);
        const isKeyboardVisible  = ref(false);

        const selectedAreas = ref<string[]>([]);
        const selectedEntity = ref('');
        const createConfirmAction = ref(false);
        const entitiesListRef = ref<HTMLElement | null>(null);
        const servicesListRef = ref<HTMLElement | null>(null);

        
        const selectedAction = ref('');
        const areaNameRef = ref<HTMLInputElement | null>(null);
        const filteredEntities = ref<string[]>([]);
        const filteredServices = ref<string[]>([]);

        const entityContainerRef = ref<HTMLElement | null>(null);
        const serviceContainerRef = ref<HTMLElement | null>(null);
        const haCardRef = ref<HTMLElement | null>(null);
        const shouldGenerateYaml = ref(false);
        const YAMLconfig = ref<Config | null>(null);

    
        const selectItem = () => {
            const data = {
                selectedEntity: selectedEntity.value,
                selectedAction: selectedAction.value,
                createConfirmAction: createConfirmAction.value
            }

            context.emit('selectEntityAndAction', {...data});
        }

        const toggleConfirmAction = () => {
            createConfirmAction.value = !createConfirmAction.value;
            selectItem()
        };


        const handleSearchEntityChange = (e: Event) => {
            const event = e as Event & { target: HTMLInputElement };
            selectedAction.value = '';
            selectedEntity.value = event.target.value;

            selectItem()
            
            if (event.target.value) {
                const valueToCheck = selectedEntity.value.toLowerCase();

                const arrOut = [];

                for (const item of Object.keys(props.states)) {
                    if (item.includes(valueToCheck)) {
                        if (item === valueToCheck) {
                            selectEntity(item);
                            return;
                        }
                        arrOut.push(item);
                    }
                }

                filteredEntities.value = arrOut;
            } else {
                filteredEntities.value = Object.keys(props.states);
            }

            if(filteredEntities.value)
            {
                nextTick(()=>{
                    entitiesListRef.value?.scrollIntoView()
                })
            }
        };

        const handleSearchActionChange = (e: Event) => {
            const event = e as Event & { target: HTMLInputElement };
            selectedAction.value = event.target.value;

            selectItem()

            if (
                selectedAction.value &&
                selectedEntity.value &&
                props.states[selectedEntity.value]
            ) {
                const filterText = selectedAction.value.toLowerCase();

                const domain = selectedEntity.value.split('.')[0];
                if (!props.services[domain]) return;
                const services = Object.keys(props.services[domain]);
                services.push('show_more');

                const arrOut = [];
                for (const item of services) {
                    if (item.includes(filterText)) {
                        if (item === filterText) {
                            selectAction(item);
                            return;
                        }
                        arrOut.push(item);
                    }
                }

                filteredServices.value = arrOut;
            } else if (selectedEntity.value && props.states[selectedEntity.value]) {
                const domain = selectedEntity.value.split('.')[0];
                if (!domain || !props.services[domain]) return;
                const services = Object.keys(props.services[domain]);
                services.push('show_more');

                filteredServices.value = services;
            }

            if(filteredServices.value)
            {
                nextTick(()=>{
                    servicesListRef.value?.scrollIntoView()
                })
            }
        };

        const showSearchActions = () => {
            if (
                selectedEntity.value &&
                props.states[selectedEntity.value] &&
                selectedAction.value === ''
            ) {
                const domain = selectedEntity.value.split('.')[0];
                if (!domain || !props.services[domain]) return;
                const services = Object.keys(props.services[domain]);
                services.push('show_more');

                filteredServices.value = services;
            } else if (
                selectedEntity.value &&
                props.states[selectedEntity.value] &&
                selectedAction.value !== ''
            ) {
                const filterText = selectedAction.value.toLowerCase();

                const domain = selectedEntity.value.split('.')[0];
                if (!props.services[domain]) return;
                const services = Object.keys(props.services[domain]);
                services.push('show_more');

                const arrOut = [];
                for (const item of services) {
                    if (item.includes(filterText)) {
                        if (item === filterText) {
                            selectAction(item);
                            return;
                        }
                        arrOut.push(item);
                    }
                }

                filteredServices.value = arrOut;
            }
            
            nextTick(()=>{
                servicesListRef.value?.scrollIntoView()
            })
        };

        const showSearchEntities = () => {
            if (!selectedEntity.value) {
                filteredEntities.value = Object.keys(props.states);
            } else {
                const valueToCheck = selectedEntity.value.toLowerCase();

                const arrOut = [];

                for (const item of Object.keys(props.states)) {
                    if (valueToCheck && item.includes(valueToCheck)) {
                        if (item === valueToCheck) {
                            selectEntity(item);
                            return;
                        }
                        arrOut.push(item);
                    }
                }
                filteredEntities.value = arrOut;
            }

            nextTick(()=>{
                entitiesListRef.value?.scrollIntoView()
            })
        };

        const selectEntity = (entity: string) => {
            selectedEntity.value = entity;
            filteredEntities.value = [];

            selectItem()
        };

        const selectAction = (action: string) => {
            selectedAction.value = action;
            filteredServices.value = [];

            selectItem()
        };

        const handleOutsideClick = (event: Event) => {
            const target = event.target as HTMLElement;
            if (
                filteredEntities.value.length &&
                entityContainerRef.value &&
                entityContainerRef.value !== target &&
                entityContainerRef.value !== target?.parentElement
            ) {
                filteredEntities.value = [];
            }

            if (
                filteredServices.value.length &&
                serviceContainerRef.value &&
                serviceContainerRef.value !== target &&
                serviceContainerRef.value !== target?.parentElement
            ) {
                filteredServices.value = [];
            }
        };

        const createYAMLconfig = () => {
            const propsOut = { ...props.config };
            const points = props.points || '';

            const newEntry: InteractiveAreas = {
                name: areaNameRef.value?.value || selectedEntity.value,
                entity_id: selectedEntity.value,
                service: selectedAction.value,
                points
            };

            if (createConfirmAction.value) {
                newEntry.confirm_action = true;
            }

            if (propsOut.interactive_areas) {
                propsOut.interactive_areas = [...propsOut.interactive_areas];
                propsOut.interactive_areas.unshift(newEntry);
            } else {
                propsOut.interactive_areas = [newEntry];
            }

            YAMLconfig.value = { ...propsOut };
        };

        const handleResize = () => {
            const currentWindowHeight = window.innerHeight;
            const heightDifference = Math.abs(currentWindowHeight - previousWindowHeight.value);

            if (heightDifference > 100) {
                // If window height changes significantly, assume keyboard shown or hidden
                if (currentWindowHeight < previousWindowHeight.value) {
                    // Window height decreased, likely keyboard shown
                    isKeyboardVisible.value = true;
                    if(filteredServices.value.length)
                    {
                        nextTick(()=>{
                            servicesListRef.value?.scrollIntoView()
                        })
                    }
                    else if(filteredEntities.value.length)
                    {
                        nextTick(()=>{
                            entitiesListRef.value?.scrollIntoView()
                        })
                    }
                    else {
                        areaNameRef.value?.scrollIntoView()
                    }
                } else {
                    // Window height increased, likely keyboard hidden
                    isKeyboardVisible.value = false;
                }
            }
        }

        const scrollIntoView = () => {
            areaNameRef.value?.scrollIntoView()
        }

        const isMobileDevice = () => {
            // used to determine if keyboard is on screen, has some flaws but generally works
            // Check if the user agent contains the word "Mobile"
            const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
            return regex.test(navigator.userAgent);
        }

        onMounted(() => {
            if(isMobileDevice())
            {
                window.addEventListener('resize', handleResize);            
                previousWindowHeight.value = window.innerHeight;
            }
        })

        const clearAllInputs = () => {
            selectedEntity.value = ''
            selectedAction.value = ''
            createConfirmAction.value = false;
            if(areaNameRef.value)
            {
                areaNameRef.value.value = '';
            }
            selectItem()
            
            context.emit('toggleDeleteAllPoints')
        }
        
        onBeforeUnmount(() => {
            haCardRef.value!.removeEventListener('click', handleOutsideClick);
            if(isMobileDevice())
            {
                window.removeEventListener('resize', handleResize);
            }

        });

        watch(
            () => haCardRef.value,
            (val) => {
                if (val) {
                    val.addEventListener('click', handleOutsideClick);
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

        return {
            selectedAreas,
            styles,
            selectedEntity,
            filteredServices,
            selectedAction,
            filteredEntities,
            areaNameRef,
            entityContainerRef,
            serviceContainerRef,
            haCardRef,
            shouldGenerateYaml,
            createConfirmAction,
            YAMLconfig,
            entitiesListRef,
            servicesListRef,
            clearAllInputs,
            scrollIntoView,
            toggleConfirmAction,
            selectAction,
            selectEntity,
            showSearchActions,
            handleSearchActionChange,
            showSearchEntities,
            handleSearchEntityChange
        };
    }
});
</script>

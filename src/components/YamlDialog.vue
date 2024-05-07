<template>
    <ha-dialog open hideActions @closed="$emit('closeDialog')">
        <h1 :style="styles.header">YAML CONFIG</h1>
        <ha-icon
            :style="styles.close"
            @click="$emit('closeDialog')"
            icon="mdi:close"
        ></ha-icon>
        <ha-icon
            icon="mdi:content-copy"
            @click="copyYAMLToClipboard(YAMLconfig, false)"
            :style="styles.copy"
        ></ha-icon>
        <ha-icon
            icon="mdi:pencil"
            @click="copyYAMLToClipboard(YAMLconfig, true)"
            :style="styles.copy_and_open_config"
        ></ha-icon>

        <pre :style="styles.pre_style">{{ YAMLconfig }}</pre>
    </ha-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, type PropType, ref } from 'vue';
import { generateYAML, copyYAMLToClipboard } from '@/helpers';
import type { Config } from '@/types';
import { styles } from '@/style';

export default defineComponent({
    name: 'YamlDialog',
    props: {
        config: {
            type: Object as PropType<Config>,
            required: true
        },
        points: String,
        createConfirmAction: Boolean
    },
    emits: ['closeDialog'],
    setup(props) {
        const YAMLconfig = ref('');

        onMounted(() => {
            const propsOut = { ...props.config };
            const yamlString = generateYAML(propsOut);

            YAMLconfig.value = yamlString;
        });

        return {
            copyYAMLToClipboard,
            YAMLconfig,
            styles
        };
    }
});
</script>

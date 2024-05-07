<template>
    <div :style="styles.error_message">
        <p>{{ errorMessage }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { styles } from '@/style'
export default defineComponent({
    name: 'ErrorMessage',
    props: {
        errorMessage: {
            type: String,
            required: true
        }
    },
    setup() {
        return {
            styles
        }
    }
});
</script>

<template>
    <canvas
        :height="height"
        width="300px"
        @touchstart="handleAction"
        @touchmove="handleAction"
        @click="handleAction"
        ref="canvasRef"
    ></canvas>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, watch } from 'vue';

interface Point {
    x: string;
    y: string;
}

export default defineComponent({
    name: 'InteractiveCanvasComponent',
    props: {
        deleteLastPoint: Boolean,
        deleteDrawingPoints: Boolean,
        height: Number
    },
    emits: ['customCanvasEvent'],
    setup(props, context) {
        const canvasRef = ref<HTMLCanvasElement | null>(null);
        const ctx = ref<CanvasRenderingContext2D | null>(null);
        const drawingPoints = ref<Point[]>([]);
        const drawingPointsForSVG = ref<string[]>([]);
        const pressIsOn = ref(false);

        const dispatchCanvasEvent = () => {
            const data = {
                detail: {
                    drawingPoints: drawingPoints.value,
                    drawingPointsForSVG: drawingPointsForSVG.value
                }
            };
            context.emit('customCanvasEvent', data);
        };

        const handleAction = (e: MouseEvent | TouchEvent) => {
            e.preventDefault()
            if (!canvasRef.value) return;
            const rect = canvasRef.value.getBoundingClientRect();
            let evt, x, y;

            if (typeof TouchEvent !== 'undefined' && e instanceof TouchEvent) {
                evt = e.changedTouches[0];
            } else {
                evt = e as MouseEvent & { target: HTMLInputElement };
            }

            x = (evt.clientX - rect.left).toFixed();
            y = (evt.clientY - rect.top).toFixed();

            // Store the start point
            if (drawingPoints.value.length === 0) {
                // If no points, add first point
                drawingPointsForSVG.value = [];
                drawingPoints.value.push({ x, y });

                drawingPointsForSVG.value.push(x, y);
                dispatchCanvasEvent();
            } else if (!pressIsOn.value) {
                // If already started, add line to the next point
                if (
                    drawingPointsForSVG.value[drawingPointsForSVG.value.length - 1] !== y &&
                    drawingPointsForSVG.value[drawingPointsForSVG.value.length - 2] !== x
                ) {
                    drawingPoints.value.push({ x, y });
                    drawingPointsForSVG.value.push(x, y);

                    dispatchCanvasEvent();
                    drawLines();

                    // reduce number of input points, slower input on the other hand gives more precision
                    pressIsOn.value = true;
                    setTimeout(() => {
                        pressIsOn.value = false;
                    }, 100);
                }
            }
        };

        const drawLines = () => {
            if (!canvasRef.value) return;
            if (!ctx.value) {
                ctx.value = canvasRef.value.getContext('2d');
            } else {
                ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
            }

            if (ctx.value && drawingPoints.value.length) {
                ctx.value.beginPath();

                drawingPoints.value.forEach((point, index) => {
                    const x = Number(point.x);
                    const y = Number(point.y);
                    if (index === 0) {
                        ctx.value!.moveTo(x, y);
                    } else {
                        ctx.value!.lineTo(x, y);
                    }
                });
                ctx.value.stroke();
            }
        };

        const deleteDrawing = () => {
            if (!canvasRef.value) return;
            drawingPoints.value = [];
            drawingPointsForSVG.value = [];

            if (ctx.value) {
                ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
            }

            dispatchCanvasEvent();
        };

        const undoLastDraw = () => {
            drawingPoints.value.pop();
            if (drawingPoints.value.length === 1) {
                drawingPoints.value = [];
                drawingPointsForSVG.value = [];
            } else {
                drawingPointsForSVG.value.splice(-2);
            }
            drawLines();
            dispatchCanvasEvent();
        };

        onBeforeUnmount(() => {
            deleteDrawing();
        });

        watch(
            () => props.deleteDrawingPoints,
            () => {
                deleteDrawing();
            }
        );

        watch(
            () => props.deleteLastPoint,
            () => {
                undoLastDraw();
            }
        );

        return {
            handleAction,
            canvasRef
        };
    }
});
</script>

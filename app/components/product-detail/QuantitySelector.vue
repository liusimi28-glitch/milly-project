<script setup lang="ts">
import { MinusIcon, PlusIcon } from '@lucide/vue'
import { Button } from '@/components/ui/button'

const props = defineProps<{
  modelValue: number
  min?: number
  max: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const minValue = computed(() => props.min ?? 1)

function decrement() {
  if (props.disabled) return
  emit('update:modelValue', Math.max(minValue.value, props.modelValue - 1))
}

function increment() {
  if (props.disabled) return
  emit('update:modelValue', Math.min(props.max, props.modelValue + 1))
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const parsed = Number.parseInt(target.value, 10)
  if (Number.isNaN(parsed)) return
  emit('update:modelValue', Math.min(props.max, Math.max(minValue.value, parsed)))
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-sm text-g2a-muted">数量</span>
    <div class="inline-flex items-center rounded-lg border border-g2a-border bg-white">
      <Button
        variant="ghost"
        size="icon-sm"
        :disabled="disabled || modelValue <= minValue"
        aria-label="减少数量"
        class="rounded-r-none text-g2a-text hover:bg-g2a-gray"
        @click="decrement"
      >
        <MinusIcon class="size-4" />
      </Button>
      <input
        :value="modelValue"
        type="number"
        :min="minValue"
        :max="max"
        :disabled="disabled"
        class="h-8 w-12 border-x border-g2a-border bg-transparent text-center text-sm font-medium text-g2a-text outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        @change="onInput"
      >
      <Button
        variant="ghost"
        size="icon-sm"
        :disabled="disabled || modelValue >= max"
        aria-label="增加数量"
        class="rounded-l-none text-g2a-text hover:bg-g2a-gray"
        @click="increment"
      >
        <PlusIcon class="size-4" />
      </Button>
    </div>
  </div>
</template>

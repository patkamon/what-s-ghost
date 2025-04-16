<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  isLast: {
    type: Boolean,
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const currentPage = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const goPrev = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goNext = () => {
  if (!props.isLast) {
    currentPage.value++
  }
}
</script>

<template>
  <!-- <div class="flex items-center gap-2"> -->
    <button 
      @click="goPrev" 
      :disabled="currentPage === 1"
      class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Previous
    </button>

    <span class="font-bold text-lg text-white">
      Page {{ currentPage }}
    </span>

    <button 
      @click="goNext" 
      :disabled="isLast"
      class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
    >
      Next
    </button>
  <!-- </div> -->
</template>

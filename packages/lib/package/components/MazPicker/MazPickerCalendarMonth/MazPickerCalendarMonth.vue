<template>
  <div class="maz-picker-calendar-month">
    <MazPickerCalendarDays
      :locale="locale"
      :first-day-of-week="firstDayOfWeek"
      class="maz-picker-calendar-month__days"
    />
    <MazPickerCalendarGrid
      v-model="modelValue"
      :locale="locale"
      :color="color"
      :time="time"
      :current-date="currentDate"
      :first-day-of-week="firstDayOfWeek"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-weekly="disabledWeekly"
      :disabled-dates="disabledDates"
    />
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType } from 'vue'
  import { Color } from '@package/components/types'
  import { cloneDate } from '../utils'
  import MazPickerCalendarDays from './MazPickerCalendarDays.vue'
  import MazPickerCalendarGrid from './MazPickerCalendarGrid.vue'
  import { PickerValue } from '../types'

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    color: { type: String as PropType<Color>, required: true },
    locale: { type: String, required: true },
    time: { type: Boolean, required: true },
    firstDayOfWeek: { type: Number, required: true },
    currentDate: { type: Date, required: true },
    offsetMonth: { type: Number, default: 0 },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabledWeekly: { type: Array as PropType<number[]>, required: true },
    disabledDates: { type: Array as PropType<string[]>, required: true },
  })

  const emits = defineEmits(['update:model-value', 'update:current-date'])

  const clonedCurrentDate = computed(() =>
    cloneDate(
      cloneDate(props.currentDate).setMonth(
        props.currentDate.getMonth() + props.offsetMonth,
      ),
    ),
  )

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const currentDate = computed({
    get: () => clonedCurrentDate.value,
    set: (currentDate) => emits('update:current-date', currentDate),
  })
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-month {
    @apply maz-w-full maz-p-2;

    &__days {
      @apply maz-pb-2;
    }
  }
</style>

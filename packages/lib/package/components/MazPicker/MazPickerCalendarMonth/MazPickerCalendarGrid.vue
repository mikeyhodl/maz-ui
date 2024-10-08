<template>
  <div ref="MazPickerGrid" class="maz-picker-calendar-grid">
    <TransitionGroup :name="transitionName">
      <div
        v-for="(dateArray, dateIndex) in [currentDateArray]"
        :key="`${dateArray[dateIndex]}`"
        class="maz-picker-calendar-grid__container"
        :class="{ '--is-range': isRangeMode }"
      >
        <div v-for="first in emptyDaysCount" :key="first" />
        <MazBtn
          v-for="(day, i) in dayCount"
          :key="i"
          size="mini"
          :color="getDayButtonColor(day)"
          type="button"
          :disabled="
            isSmallerMinDate(day) ||
            isBiggerMaxDate(day) ||
            isDisabledWeekly(day) ||
            isDisabledDate(day)
          "
          :class="{
            '--is-today': checkIsToday(day),
            '--is-first': isFirstDay(day),
            '--is-last': isLastDay(day),
            '--is-selected': isSelectedOrBetween(day) === DaySelected.SELECTED,
            '--is-between': isSelectedOrBetween(day) === DaySelected.BETWEEN,
          }"
          @click="selectDay(day)"
        >
          <span>
            {{ day }}
          </span>
        </MazBtn>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts" setup>
  import { computed, PropType, ref, watch } from 'vue'
  import {
    cloneDate,
    getDaysInMonth,
    getFirstAndLastDayOfMonth,
    isSameDate,
    isToday,
    isBigger,
    isSmaller,
    isSameDay,
    getWeekDays,
    isSameMonth,
  } from '../utils'
  import MazBtn from '@package/components/MazBtn.vue'
  import { Color } from '@package/components/types'
  import { debounce } from '@package/helpers'
  import { PartialRangeValue, PickerValue } from '../types'

  enum DaySelected {
    UNSELECTED,
    SELECTED,
    BETWEEN,
  }

  const props = defineProps({
    modelValue: {
      type: [String, Object] as PropType<PickerValue>,
      default: undefined,
    },
    currentDate: { type: Date, required: true },
    time: { type: Boolean, required: true },
    locale: { type: String, required: true },
    firstDayOfWeek: { type: Number, required: true },
    color: { type: String as PropType<Color>, required: true },
    minDate: { type: String, default: undefined },
    maxDate: { type: String, default: undefined },
    disabledWeekly: { type: Array as PropType<number[]>, required: true },
    disabledDates: { type: Array as PropType<string[]>, required: true },
  })

  const emits = defineEmits(['update:model-value'])

  const MazPickerGrid = ref<HTMLDivElement>()
  const transitionName = ref<'maz-slidenext' | 'maz-slideprev'>('maz-slidenext')
  const currentDateTmp = ref<Date>(cloneDate(props.currentDate))
  const currentDateArray = ref<Date[]>([cloneDate(props.currentDate)])

  const isRangeMode = computed(() => typeof props.modelValue === 'object')

  const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:model-value', value),
  })

  const dayCount = computed(() =>
    getDaysInMonth(
      props.currentDate.getFullYear(),
      props.currentDate.getMonth(),
    ),
  )

  const clonedCurrentDate = computed(() => cloneDate(props.currentDate))

  const emptyDaysCount = computed(() => {
    const { firstDay } = getFirstAndLastDayOfMonth(props.currentDate)

    const weekDays = getWeekDays(props.locale, props.firstDayOfWeek)
    const indexCurrentWeekDay = weekDays.findIndex(
      ({ dayNumber }) => dayNumber === firstDay,
    )

    return indexCurrentWeekDay
  })

  const isFirstDay = (day: number): boolean => {
    if (!props.modelValue) {
      return false
    }

    if (typeof props.modelValue === 'object' && props.modelValue?.start) {
      const itemDay = clonedCurrentDate.value.setDate(day)
      return isSameDate(itemDay, props.modelValue.start)
    }
    return false
  }

  const isLastDay = (day: number): boolean => {
    if (!props.modelValue) {
      return false
    }

    if (typeof props.modelValue === 'object' && props.modelValue?.end) {
      const itemDay = clonedCurrentDate.value.setDate(day)
      return isSameDate(itemDay, props.modelValue.end)
    }
    return false
  }

  const getDayButtonColor = (day: number): Color => {
    const itemDay = clonedCurrentDate.value.setDate(day)
    const value = props.modelValue

    if (typeof value === 'object') {
      return (value.start ? isSameDate(itemDay, value.start) : false) ||
        (value.end ? isSameDate(itemDay, value.end) : false)
        ? props.color
        : checkIsBetween(day)
        ? props.color
        : 'transparent'
    } else {
      return checkIsSameDate(day) ? props.color : 'transparent'
    }
  }

  const isSelectedOrBetween = (day: number): DaySelected => {
    if (typeof props.modelValue === 'object') {
      if (props.modelValue.start) {
        const itemDay = clonedCurrentDate.value.setDate(day)

        if (isSameDate(itemDay, props.modelValue.start)) {
          return DaySelected.SELECTED
        }
      }
      if (props.modelValue.end) {
        const itemDay = clonedCurrentDate.value.setDate(day)

        if (isSameDate(itemDay, props.modelValue.end)) {
          return DaySelected.SELECTED
        }

        if (checkIsBetween(day)) {
          return DaySelected.BETWEEN
        }
      }
    } else if (checkIsSameDate(day)) {
      return DaySelected.SELECTED
    }

    return DaySelected.UNSELECTED
  }

  const selectDay = (value: number) => {
    if (typeof modelValue.value === 'object') {
      let values = modelValue.value

      if (values.start && values.end) {
        values = {
          start: undefined,
          end: undefined,
        }
      }

      const newValue = new Date(
        clonedCurrentDate.value.setDate(value),
      ).toDateString()

      if (!values.start || isBigger(values.start, newValue)) {
        modelValue.value = {
          start: newValue,
          end: undefined,
        }
      } else {
        modelValue.value = {
          start: values.start,
          end: newValue,
        }
      }
    } else {
      const baseDate = new Date(clonedCurrentDate.value.setDate(value))
      modelValue.value = props.time
        ? baseDate.toISOString()
        : baseDate.toDateString()
    }
  }

  const checkIsToday = (day: number): boolean => {
    return isToday(clonedCurrentDate.value.setDate(day))
  }

  const checkIsSameDate = (day: number): boolean => {
    if (!props.modelValue) {
      return false
    }

    const value = props.modelValue as string

    const itemDay = clonedCurrentDate.value.setDate(day)

    return isSameDate(itemDay, value)
  }

  const checkIsBetween = (day: number): boolean => {
    const value = props.modelValue as PartialRangeValue

    if (!value.start || !value.end) {
      return false
    }

    const itemDay = clonedCurrentDate.value.setDate(day)

    return !isSmaller(itemDay, value.start) && !isBigger(itemDay, value.end)
  }

  const isSmallerMinDate = (day: number): boolean => {
    if (!props.minDate) {
      return false
    }
    const dateWithDay = clonedCurrentDate.value.setDate(day)
    return (
      isSmaller(dateWithDay, props.minDate) &&
      !isSameDate(dateWithDay, props.minDate)
    )
  }

  const isDisabledWeekly = (day: number): boolean => {
    if (!props.disabledWeekly?.length) {
      return false
    }

    return props.disabledWeekly.some((disabledDay) =>
      isSameDay(clonedCurrentDate.value.setDate(day), disabledDay),
    )
  }

  const isDisabledDate = (day: number): boolean => {
    if (!props.disabledDates?.length) {
      return false
    }

    return props.disabledDates.some((disabledDay) =>
      isSameDate(clonedCurrentDate.value.setDate(day), disabledDay),
    )
  }

  const isBiggerMaxDate = (day: number): boolean => {
    if (!props.maxDate) {
      return false
    }
    const dateWithDay = clonedCurrentDate.value.setDate(day)

    return (
      isBigger(dateWithDay, props.maxDate) &&
      !isSameDate(dateWithDay, props.maxDate)
    )
  }

  const removeContainerHeight = debounce(() => {
    if (MazPickerGrid.value) {
      MazPickerGrid.value.style.minHeight = ''
    }
  }, 400)

  const setContainerHeight = () => {
    if (MazPickerGrid.value) {
      MazPickerGrid.value.style.minHeight = `${
        MazPickerGrid.value?.clientHeight || 176
      }px`

      removeContainerHeight()
    }
  }

  watch(
    () => props.currentDate,
    (currentDate) => {
      transitionName.value = isBigger(currentDateTmp.value, currentDate)
        ? 'maz-slideprev'
        : 'maz-slidenext'

      if (!isSameMonth(currentDateTmp.value, currentDate)) {
        currentDateArray.value = [currentDate]
      }
      currentDateTmp.value = currentDate
      setContainerHeight()
    },
  )
</script>

<style lang="postcss" scoped>
  .maz-picker-calendar-grid {
    @apply maz-relative maz-overflow-hidden;

    transition: all 300ms ease-in-out;

    &__container {
      @apply maz-relative maz-grid maz-grid-cols-7 maz-items-start maz-gap-1;

      &.--is-range {
        @apply maz-gap-0 maz-gap-y-1;
      }

      & button {
        @apply maz-h-8 maz-cursor-pointer;
        @apply maz-p-1 !important;

        &.--is-today:not(.--is-selected):not(.--is-between) {
          @apply maz-bg-color-light !important;
        }

        &.--is-selected.--is-first {
          @apply maz-rounded-r-none !important;
        }

        &.--is-selected.--is-last {
          @apply maz-rounded-l-none !important;
        }

        &.--is-between {
          @apply maz-rounded-none !important;

          &.--primary {
            @apply maz-bg-primary-alpha !important;
          }

          &.--secondary {
            @apply maz-bg-secondary-alpha !important;
          }

          &.--info {
            @apply maz-bg-info-alpha !important;
          }

          &.--danger {
            @apply maz-bg-danger-alpha !important;
          }

          &.--warning {
            @apply maz-bg-warning-alpha !important;
          }

          &.--success {
            @apply maz-bg-success-alpha !important;
          }

          &.--white {
            @apply maz-bg-gray-400 !important;
          }

          &.--black {
            @apply maz-bg-gray-800 !important;
          }

          &.--transparent {
            @apply maz-bg-gray-400 !important;
          }
        }

        & span {
          @apply maz-text-sm;
        }

        &:disabled {
          @apply maz-cursor-not-allowed;
        }
      }
    }
  }

  html.dark {
    .maz-picker-calendar-grid
      button.--is-today:not(.--is-selected):not(.--is-between) {
      @apply maz-bg-color-lighter !important;
    }
  }

  /** Slide next/prev animation  **/
  .maz-slidenext-leave-active,
  .maz-slidenext-enter-active,
  .maz-slideprev-leave-active,
  .maz-slideprev-enter-active {
    position: absolute;
    transition: all 300ms ease-in-out;
    @apply maz-top-0 maz-left-0 maz-right-0;
  }

  /* .maz-slidenext-enter-to, */
  .maz-slideprev-leave-to,
  .maz-slidenext-enter-from {
    transform: translateX(100%);
  }

  .maz-slidenext-leave-to,
  .maz-slideprev-enter-from {
    transform: translateX(-100%);
  }
</style>

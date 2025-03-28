<script setup lang="ts">
import { computed, ref } from "vue";
import { today, date_from_string } from "../../calendar";
import ObsidianButton from "../obsidian/ObsidianButton.vue";
import ObsidianIconButton from "../obsidian/ObsidianIconButton.vue";
import CalendarMonthView from "../calendar/CalendarMonthView.vue";
import CalendarQuarterView from "../calendar/CalendarQuarterView.vue";
import CalendarYearView from "../calendar/CalendarYearView.vue";
import CalendarDecadeView from "../calendar/CalendarDecadeView.vue";
import FormattedDate from "../calendar/FormattedDate.vue";

const props = defineProps<{
  selectedDate?: string;
  picking: "day" | "week" | "month" | "quarter" | "year";
  min?: string;
  max?: string;
}>();
const emit = defineEmits<{
  (error: "select", date: string): void;
  (error: "close"): void;
}>();

const mode = ref<"month" | "quarter" | "year" | "decade">("month");
switch (props.picking) {
  case "day": {
    mode.value = "month";
    break;
  }
  case "week": {
    mode.value = "month";
    break;
  }
  case "month": {
    mode.value = "month";
    break;
  }
  case "quarter": {
    mode.value = "quarter";
    break;
  }
  case "year": {
    mode.value = "decade";
    break;
  }
}

const currentDate = ref(props.selectedDate ?? today().format("YYYY-MM-DD"));
const currentDateMoment = computed(() => date_from_string(currentDate.value).startOf("month"));

function previous(step: "month" | "quarter" | "year" | "decade" = "month") {
  currentDate.value =
    step === "decade"
      ? currentDateMoment.value.subtract(10, "year").format("YYYY-MM-DD")
      : currentDateMoment.value.subtract(1, step).format("YYYY-MM-DD");
}
function canPrevious(step: "month" | "quarter" | "year" | "decade" = "month") {
  if (!props.min) return true;

  const min = date_from_string(props.min);
  return step === "decade"
    ? currentDateMoment.value.clone().subtract(10, "year").isAfter(min, "year")
    : currentDateMoment.value.clone().subtract(1, step).endOf(step).isAfter(min);
}
function next(step: "month" | "quarter" | "year" | "decade" = "month") {
  currentDate.value =
    step === "decade"
      ? currentDateMoment.value.add(10, "year").format("YYYY-MM-DD")
      : currentDateMoment.value.add(1, step).format("YYYY-MM-DD");
}
function canNext(step: "month" | "quarter" | "year" | "decade" = "month") {
  if (!props.max) return true;

  const max = date_from_string(props.max);
  return step === "decade"
    ? currentDateMoment.value.clone().add(10, "year").isBefore(max, "year")
    : currentDateMoment.value.clone().add(1, step).startOf(step).isBefore(max);
}

function selectDate(date: string) {
  if (props.picking === "week") {
    emit("select", date_from_string(currentDate.value).startOf("week").format("YYYY-MM-DD"));
  } else {
    emit("select", date);
  }
  emit("close");
}

function selectMonth(date: string) {
  if (props.picking === "month") {
    emit("select", date);
    emit("close");
  } else {
    currentDate.value = date;
    mode.value = "month";
  }
}
function selectQuarter(date: string) {
  if (props.picking === "quarter") {
    emit("select", date);
    emit("close");
  } else {
    currentDate.value = date;
    mode.value = "month";
  }
}
function selectYear(date: string) {
  if (props.picking === "year") {
    emit("select", date);
    emit("close");
  } else {
    currentDate.value = date;
    mode.value = props.picking === "quarter" ? "quarter" : "year";
  }
}
</script>

<template>
  <CalendarDecadeView v-if="mode === 'decade'" :ref-date="currentDate" :min :max @select="selectYear">
    <template #header="{ startYear, endYear }">
      <ObsidianIconButton icon="arrow-left" tooltip="Previous decade" @click="previous('decade')" />
      {{ startYear }} - {{ endYear }}
      <ObsidianIconButton icon="arrow-right" tooltip="Next decade" @click="next('decade')" />
    </template>
  </CalendarDecadeView>

  <CalendarYearView v-else-if="mode === 'year'" :ref-date="currentDate" :min :max @select="selectMonth">
    <template #header>
      <ObsidianIconButton
        v-if="canPrevious('year')"
        icon="arrow-left"
        tooltip="Previous year"
        @click="previous('year')"
      />
      <ObsidianButton @click="mode = 'decade'">{{ currentDateMoment.format("YYYY") }}</ObsidianButton>
      <ObsidianIconButton v-if="canNext('year')" icon="arrow-right" tooltip="Next year" @click="next('year')" />
    </template>
  </CalendarYearView>

  <CalendarQuarterView v-else-if="mode === 'quarter'" :ref-date="currentDate" :min :max @select="selectQuarter">
    <template #header>
      <ObsidianIconButton
        v-if="canPrevious('quarter')"
        icon="arrow-left"
        tooltip="Previous quarter"
        @click="previous('quarter')"
      />
      <ObsidianButton @click="mode = 'year'">
        <FormattedDate :date="currentDate" format="YYYY" />
      </ObsidianButton>
      <ObsidianIconButton
        v-if="canNext('quarter')"
        icon="arrow-right"
        tooltip="Next quarter"
        @click="next('quarter')"
      />
    </template>
  </CalendarQuarterView>

  <CalendarMonthView v-else :ref-date="currentDate" :selected-date="selectedDate" :min :max @select="selectDate">
    <template #header>
      <ObsidianIconButton
        v-if="canPrevious('month')"
        icon="arrow-left"
        tooltip="Previous month"
        @click="previous('month')"
      />
      <ObsidianButton @click="mode = 'year'">
        <FormattedDate :date="currentDate" format="MMMM YYYY" />
      </ObsidianButton>
      <ObsidianIconButton v-if="canNext('month')" icon="arrow-right" tooltip="Next month" @click="next('month')" />
    </template>
  </CalendarMonthView>
</template>

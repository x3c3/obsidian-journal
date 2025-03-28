<script setup lang="ts">
import JournalSettingsList from "./JournalSettingsList.vue";
import ObsidianIconButton from "@/components/obsidian/ObsidianIconButton.vue";
import { VueModal } from "@/components/modals/vue-modal";
import CreateJournal from "@/components/modals/CreateJournal.modal.vue";
import type { JournalSettings } from "@/types/settings.types";
import { usePlugin } from "@/composables/use-plugin";
import CollapsibleBlock from "@/components/CollapsibleBlock.vue";
import { computed } from "vue";
import IconedRow from "@/components/IconedRow.vue";

const emit = defineEmits<(event: "edit" | "bulk-add", name: string) => void>();

const plugin = usePlugin();
const journals = computed(() => plugin.journals);

function create(): void {
  new VueModal(plugin, "Add Journal", CreateJournal, {
    onCreate(name: string, writing: JournalSettings["write"]) {
      plugin.createJournal(name, writing);
      emit("edit", name);
    },
  }).open();
}
</script>

<template>
  <CollapsibleBlock :default-expanded="journals.length > 0">
    <template #trigger>
      <IconedRow icon="book-open">
        Journals <span class="flair">{{ journals.length }}</span>
      </IconedRow>
    </template>
    <template #controls>
      <ObsidianIconButton icon="plus" cta tooltip="Create new journal" @click="create" />
    </template>
    <JournalSettingsList :journals="journals" @edit="$emit('edit', $event)" @bulk-add="$emit('bulk-add', $event)" />
  </CollapsibleBlock>
</template>

<style scoped></style>

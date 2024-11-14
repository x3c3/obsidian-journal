import { type App, Modal } from "obsidian";
import { type Component, createApp, type App as VueApp } from "vue";
import type { JournalPlugin } from "@/types/plugin.types";
import { APP_KEY, PLUGIN_KEY } from "@/constants";

export class VueModal extends Modal {
  private _vueApp: VueApp | undefined;
  constructor(
    app: App,
    private plugin: JournalPlugin,
    private title: string,
    private component: Component,
    private componentProps: Record<string, unknown> = {},
    private customWidth?: number,
  ) {
    super(app);
    plugin.register(() => {
      this.close();
    });
  }

  onOpen(): void {
    this.titleEl.setText(this.title);
    if (this.customWidth) {
      this.modalEl.setCssProps({
        "--dialog-width": `${this.customWidth}px`,
      });
    }
    this._vueApp = createApp(this.component, {
      onClose: () => {
        this.close();
      },
      ...this.componentProps,
    });
    this._vueApp.provide(APP_KEY, this.app);
    this._vueApp.provide(PLUGIN_KEY, this.plugin);
    this._vueApp.mount(this.contentEl);
  }

  onClose(): void {
    this._vueApp?.unmount();
    this.contentEl.empty();
  }
}

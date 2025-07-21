import { writable } from 'svelte/store';

export const avisExpanded = writable<Record<string, boolean>>({}); 
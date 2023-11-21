import { writable } from 'svelte/store';

export const visitorMapStore = writable(null);
export const mapStoreList = writable({});
export const weightMaxStore = writable(0); // Initialize the store with an initial value of 0

import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume';

/* =================== locale: zh-CN ======================= */

const zhDemoNote = defineNoteConfig({
  dir: 'ios',
  link: '/ios',
  sidebar: ['', 'Swift', 'SwiftUI'],
});

export const zhNotes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [zhDemoNote],
});

/* =================== locale: en-US ======================= */

const enDemoNote = defineNoteConfig({
  dir: 'ios',
  link: '/ios',
  sidebar: ['', 'Swift', 'SwiftUI'],
});

export const enNotes = defineNotesConfig({
  dir: 'en/notes',
  link: '/en/',
  notes: [enDemoNote],
});

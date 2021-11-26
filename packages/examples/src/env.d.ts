/* eslint-disable */

/// <reference types="vite/client" />

import { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-form-validation' {
  export interface CustomValidationBehaviorFunctions {}
}

import { StyleSheet } from "./Headwind"

export type StringStyleSheet = {
  getStyles: () => string
  insertRule: (cssRule: string) => void
}

export const isStringStyleSheet = (sheet: StyleSheet): sheet is StringStyleSheet => {
  return (sheet as StringStyleSheet).getStyles !== undefined
}

export const createStringStyleSheet = () => {
  let styles = "";
  return {
    getStyles: () => styles,
    insertRule: (cssRule: string) => {
      styles += cssRule + "\n"
    }
  }
}
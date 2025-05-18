// backend/src/types/validation.d.ts

// Types pour les validations
export type ValidationTypeString = "string";
export type ValidationTypeNumber = "number";
export type ValidationTypeBoolean = "boolean";
export type ValidationTypeObject = "object";
export type ValidationTypeArray = "array";
export type ValidationTypeDate = "date";

export type ValidationType =
  | ValidationTypeString
  | ValidationTypeNumber
  | ValidationTypeBoolean
  | ValidationTypeObject
  | ValidationTypeArray
  | ValidationTypeDate;

export interface ValidationRule<T = any> {
  required?: boolean;
  type?: ValidationType;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  custom?: (value: T) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

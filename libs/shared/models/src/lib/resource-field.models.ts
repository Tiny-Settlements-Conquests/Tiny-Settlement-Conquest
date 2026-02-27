// Re-export from original source to avoid duplicate type definitions
export type { ResourceField } from '../../../../../src/app/domain/resources/domain/models/resource-field.model';
export type { ActionCardMode } from '../../../../../src/app/domain/cards/domain/models/action-card.model';
export type { ResourceCard } from '../../../../../src/app/domain/resources/domain/models/resource-card.model';

// Field is a class in the game engine — re-export as type
export { Field } from '../../../../../src/app/domain/playground/domain/classes/field';

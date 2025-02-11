import { InjectionToken, Provider } from "@angular/core"
import { Edition, ENVIRONMENT } from "../../../env/environment"

export const EDITION_TOKEN = new InjectionToken<Edition>('EDITION_TOKEN')

export const provideEditionToken = ((): Provider => ({
  provide: EDITION_TOKEN,
  useValue: ENVIRONMENT.edition
}))
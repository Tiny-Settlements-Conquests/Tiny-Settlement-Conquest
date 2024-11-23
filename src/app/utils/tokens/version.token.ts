import { InjectionToken, Provider } from "@angular/core"
import { ENVIRONMENT } from "../../../env/environment"

export const VERSION_TOKEN = new InjectionToken('VERSION_TOKEN')

export const provideVersionToken = ((): Provider => ({
  provide: VERSION_TOKEN,
  useValue: ENVIRONMENT.version
}))
import { InjectionToken, Provider } from "@angular/core"
import { ENVIRONMENT } from "../../../env/environment"

export const DEV_TOKEN = new InjectionToken<boolean>('DEV_TOKEN')

export const provideDevToken = ((): Provider => ({
  provide: DEV_TOKEN,
  useValue: !ENVIRONMENT.prod
}))
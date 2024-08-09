import { InjectionToken } from "@angular/core";
import { LocalGateway } from "../local/local.gateway";

export const GATEWAY_TOKEN = new InjectionToken<LocalGateway>('GATEWAY_TOKEN')
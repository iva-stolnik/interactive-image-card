type entityCategory = 'config' | 'diagnostic';

export type InternalConfig = {
    width: number;
    scale: number;
}


export type HassEntities = { [entity_id: string]: HassEntity };

export interface Config {
    type: string;
    url?: string;
    size?: string;
    editable: Boolean;
    use_vibration?: Boolean;
    interactive_areas?: InteractiveAreas[];
    scale?: number;
    entity_picture?: string;
    stream?: boolean;
}

export interface InteractiveAreas {
    name?: string;
    entity_id: string;
    show_message?: string; // todo "Hi this is {entity_id} and ..."
    service?: string;
    points?: string;
    confirm_action?: boolean;
    always_visible?: boolean; // should always show this area except on new area creation
}

export interface EntityAction {
    selectedEntity?: string;
    selectedAction?: string;
    createConfirmAction?: boolean;
}

export interface Hass {
    states: HassEntities;
    services: HassServices;
    entities: { [id: string]: EntityRegistryDisplayEntry };
    panelUrl: string;
    callService(
        domain: ServiceCallRequest['domain'],
        service: ServiceCallRequest['service'],
        serviceData?: ServiceCallRequest['serviceData'],
        target?: ServiceCallRequest['target'],
        notifyOnError?: boolean
    ): Promise<ServiceCallResponse>;
    callWS<T>(msg: MessageBase): Promise<T>;
    fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;
}

export type HassEntityBase = {
    entity_id: string;
    state: string;
    last_changed: string;
    last_updated: string;
    attributes: HassEntityAttributeBase;
    context: Context;
};

export type HassEntityAttributeBase = {
    friendly_name?: string;
    unit_of_measurement?: string;
    icon?: string;
    entity_picture?: string;
    supported_features?: number;
    hidden?: boolean;
    assumed_state?: boolean;
    device_class?: string;
    state_class?: string;
    restored?: boolean;
};

export type HassEntity = HassEntityBase & {
    attributes: { [key: string]: any };
    state: string | number;
};

export interface ServiceCallResponse {
    context: Context;
}

export type HassDomainServices = {
    [service_name: string]: HassService;
};

export type HassServiceTarget = {
    entity_id?: string | string[];
    device_id?: string | string[];
    area_id?: string | string[];
    floor_id?: string | string[];
    label_id?: string | string[];
};

export type HassServices = {
    [domain: string]: HassDomainServices;
};

export type HassService = {
    name?: string;
    description: string;
    target?: {} | null;
    fields: {
        [field_name: string]: {
            example?: string | boolean | number;
            default?: unknown;
            required?: boolean;
            advanced?: boolean;
            selector?: {};
            filter?: {
                supported_features?: number[];
                attribute?: Record<string, any[]>;
            };
            // Custom integrations don't use translations and still have name/description
            name?: string;
            description: string;
        };
    };
    response?: { optional: boolean };
};

export type MessageBase = {
    id?: number;
    type: string;
    [key: string]: any;
};

export interface Context {
    id: string;
    parent_id?: string;
    user_id?: string | null;
}

export interface ServiceCallRequest {
    domain: string;
    service: string;
    serviceData?: Record<string, any>;
    target?: HassServiceTarget;
}

export interface EntityRegistryDisplayEntry {
    entity_id: string;
    name?: string;
    icon?: string;
    device_id?: string;
    area_id?: string;
    hidden?: boolean;
    entity_category?: entityCategory;
    translation_key?: string;
    platform?: string;
    display_precision?: number;
}

/* export interface HomeAssistant {
    auth: Auth & { external?: ExternalMessaging };
    connection: Connection;
    connected: boolean;
    states: HassEntities;
    entities: { [id: string]: EntityRegistryDisplayEntry };
    devices: { [id: string]: DeviceRegistryEntry };
    areas: { [id: string]: AreaRegistryEntry };
    services: HassServices;
    config: HassConfig;
    themes: Themes;
    selectedTheme: ThemeSettings | null;
    panels: Panels;
    panelUrl: string;
    // i18n
    // current effective language in that order:
    //   - backend saved user selected language
    //   - language in local app storage
    //   - browser language
    //   - english (en)
    language: string;
    // local stored language, keep that name for backward compatibility
    selectedLanguage: string | null;
    locale: FrontendLocaleData;
    resources: Resources;
    localize: LocalizeFunc;
    translationMetadata: TranslationMetadata;
    suspendWhenHidden: boolean;
    enableShortcuts: boolean;
    vibrate: boolean;
    debugConnection: boolean;
    dockedSidebar: "docked" | "always_hidden" | "auto";
    defaultPanel: string;
    moreInfoEntityId: string | null;
    user?: CurrentUser;
    userData?: CoreFrontendUserData | null;
    hassUrl(path?): string;
    callService(
      domain: ServiceCallRequest["domain"],
      service: ServiceCallRequest["service"],
      serviceData?: ServiceCallRequest["serviceData"],
      target?: ServiceCallRequest["target"],
      notifyOnError?: boolean
    ): Promise<ServiceCallResponse>;
    callApi<T>(
      method: "GET" | "POST" | "PUT" | "DELETE",
      path: string,
      parameters?: Record<string, any>,
      headers?: Record<string, string>
    ): Promise<T>;
    fetchWithAuth(path: string, init?: Record<string, any>): Promise<Response>;
    sendWS(msg: MessageBase): void;
    callWS<T>(msg: MessageBase): Promise<T>;
    loadBackendTranslation(
      category: Parameters<typeof getHassTranslations>[2],
      integrations?: Parameters<typeof getHassTranslations>[3],
      configFlow?: Parameters<typeof getHassTranslations>[4]
    ): Promise<LocalizeFunc>;
    loadFragmentTranslation(fragment: string): Promise<LocalizeFunc | undefined>;
    formatEntityState(stateObj: HassEntity, state?: string): string;
    formatEntityAttributeValue(
      stateObj: HassEntity,
      attribute: string,
      value?: any
    ): string;
    formatEntityAttributeName(stateObj: HassEntity, attribute: string): string;
  } */

export interface socketData {
    type: string;
    domain?: string;
    service?: string;
    target?: any;
    service_data?: any;
    url_path?: any;
    config?: any;
    id?: any;
    force?: boolean;
}

export interface UploadedImage {
    id: string;
}

export interface CustomHAElement extends HTMLElement {
    config?: Config;
    hass?: Hass;
}

import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ActionResult, Activation, ActivationInput, AppState, Ban, BanInput, HealthStatus, PlayerActionInput, PlayerPriorityInput, PriorityEntry, PriorityEntryInput, ReportMessageInput, StateResult, UserInfo, WebhookInput } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetStateUrl: () => string;
/**
 * @summary Get full application state
 */
export declare const getState: (options?: RequestInit) => Promise<AppState>;
export declare const getGetStateQueryKey: () => readonly ["/api/state"];
export declare const getGetStateQueryOptions: <TData = Awaited<ReturnType<typeof getState>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getState>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getState>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStateQueryResult = NonNullable<Awaited<ReturnType<typeof getState>>>;
export type GetStateQueryError = ErrorType<unknown>;
/**
 * @summary Get full application state
 */
export declare function useGetState<TData = Awaited<ReturnType<typeof getState>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getState>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetMeUrl: () => string;
/**
 * @summary Get current user
 */
export declare const getMe: (options?: RequestInit) => Promise<UserInfo>;
export declare const getGetMeQueryKey: () => readonly ["/api/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<unknown>;
/**
 * @summary Get current user
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getDoPlayerActionUrl: () => string;
/**
 * @summary Perform a player action
 */
export declare const doPlayerAction: (playerActionInput: PlayerActionInput, options?: RequestInit) => Promise<ActionResult>;
export declare const getDoPlayerActionMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof doPlayerAction>>, TError, {
        data: BodyType<PlayerActionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof doPlayerAction>>, TError, {
    data: BodyType<PlayerActionInput>;
}, TContext>;
export type DoPlayerActionMutationResult = NonNullable<Awaited<ReturnType<typeof doPlayerAction>>>;
export type DoPlayerActionMutationBody = BodyType<PlayerActionInput>;
export type DoPlayerActionMutationError = ErrorType<void>;
/**
* @summary Perform a player action
*/
export declare const useDoPlayerAction: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof doPlayerAction>>, TError, {
        data: BodyType<PlayerActionInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof doPlayerAction>>, TError, {
    data: BodyType<PlayerActionInput>;
}, TContext>;
export declare const getSetPlayerPriorityUrl: () => string;
/**
 * @summary Set player priority
 */
export declare const setPlayerPriority: (playerPriorityInput: PlayerPriorityInput, options?: RequestInit) => Promise<StateResult>;
export declare const getSetPlayerPriorityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof setPlayerPriority>>, TError, {
        data: BodyType<PlayerPriorityInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof setPlayerPriority>>, TError, {
    data: BodyType<PlayerPriorityInput>;
}, TContext>;
export type SetPlayerPriorityMutationResult = NonNullable<Awaited<ReturnType<typeof setPlayerPriority>>>;
export type SetPlayerPriorityMutationBody = BodyType<PlayerPriorityInput>;
export type SetPlayerPriorityMutationError = ErrorType<unknown>;
/**
* @summary Set player priority
*/
export declare const useSetPlayerPriority: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof setPlayerPriority>>, TError, {
        data: BodyType<PlayerPriorityInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof setPlayerPriority>>, TError, {
    data: BodyType<PlayerPriorityInput>;
}, TContext>;
export declare const getGetBansUrl: () => string;
/**
 * @summary Get all bans
 */
export declare const getBans: (options?: RequestInit) => Promise<Ban[]>;
export declare const getGetBansQueryKey: () => readonly ["/api/bans"];
export declare const getGetBansQueryOptions: <TData = Awaited<ReturnType<typeof getBans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getBans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetBansQueryResult = NonNullable<Awaited<ReturnType<typeof getBans>>>;
export type GetBansQueryError = ErrorType<unknown>;
/**
 * @summary Get all bans
 */
export declare function useGetBans<TData = Awaited<ReturnType<typeof getBans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getBans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddBanUrl: () => string;
/**
 * @summary Add a new ban
 */
export declare const addBan: (banInput: BanInput, options?: RequestInit) => Promise<StateResult>;
export declare const getAddBanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addBan>>, TError, {
        data: BodyType<BanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addBan>>, TError, {
    data: BodyType<BanInput>;
}, TContext>;
export type AddBanMutationResult = NonNullable<Awaited<ReturnType<typeof addBan>>>;
export type AddBanMutationBody = BodyType<BanInput>;
export type AddBanMutationError = ErrorType<unknown>;
/**
* @summary Add a new ban
*/
export declare const useAddBan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addBan>>, TError, {
        data: BodyType<BanInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addBan>>, TError, {
    data: BodyType<BanInput>;
}, TContext>;
export declare const getDeleteBanUrl: (id: string) => string;
/**
 * @summary Delete a ban
 */
export declare const deleteBan: (id: string, options?: RequestInit) => Promise<StateResult>;
export declare const getDeleteBanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBan>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteBan>>, TError, {
    id: string;
}, TContext>;
export type DeleteBanMutationResult = NonNullable<Awaited<ReturnType<typeof deleteBan>>>;
export type DeleteBanMutationError = ErrorType<unknown>;
/**
* @summary Delete a ban
*/
export declare const useDeleteBan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteBan>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteBan>>, TError, {
    id: string;
}, TContext>;
export declare const getSendReportMessageUrl: () => string;
/**
 * @summary Send a message to a report
 */
export declare const sendReportMessage: (reportMessageInput: ReportMessageInput, options?: RequestInit) => Promise<StateResult>;
export declare const getSendReportMessageMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendReportMessage>>, TError, {
        data: BodyType<ReportMessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendReportMessage>>, TError, {
    data: BodyType<ReportMessageInput>;
}, TContext>;
export type SendReportMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendReportMessage>>>;
export type SendReportMessageMutationBody = BodyType<ReportMessageInput>;
export type SendReportMessageMutationError = ErrorType<void>;
/**
* @summary Send a message to a report
*/
export declare const useSendReportMessage: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendReportMessage>>, TError, {
        data: BodyType<ReportMessageInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendReportMessage>>, TError, {
    data: BodyType<ReportMessageInput>;
}, TContext>;
export declare const getGetPriorityListUrl: () => string;
/**
 * @summary Get priority list
 */
export declare const getPriorityList: (options?: RequestInit) => Promise<PriorityEntry[]>;
export declare const getGetPriorityListQueryKey: () => readonly ["/api/priority-list"];
export declare const getGetPriorityListQueryOptions: <TData = Awaited<ReturnType<typeof getPriorityList>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPriorityList>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPriorityList>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPriorityListQueryResult = NonNullable<Awaited<ReturnType<typeof getPriorityList>>>;
export type GetPriorityListQueryError = ErrorType<unknown>;
/**
 * @summary Get priority list
 */
export declare function useGetPriorityList<TData = Awaited<ReturnType<typeof getPriorityList>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPriorityList>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddPriorityEntryUrl: () => string;
/**
 * @summary Add priority entry
 */
export declare const addPriorityEntry: (priorityEntryInput: PriorityEntryInput, options?: RequestInit) => Promise<StateResult>;
export declare const getAddPriorityEntryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addPriorityEntry>>, TError, {
        data: BodyType<PriorityEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addPriorityEntry>>, TError, {
    data: BodyType<PriorityEntryInput>;
}, TContext>;
export type AddPriorityEntryMutationResult = NonNullable<Awaited<ReturnType<typeof addPriorityEntry>>>;
export type AddPriorityEntryMutationBody = BodyType<PriorityEntryInput>;
export type AddPriorityEntryMutationError = ErrorType<unknown>;
/**
* @summary Add priority entry
*/
export declare const useAddPriorityEntry: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addPriorityEntry>>, TError, {
        data: BodyType<PriorityEntryInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addPriorityEntry>>, TError, {
    data: BodyType<PriorityEntryInput>;
}, TContext>;
export declare const getDeletePriorityEntryUrl: (id: string) => string;
/**
 * @summary Delete a priority entry
 */
export declare const deletePriorityEntry: (id: string, options?: RequestInit) => Promise<StateResult>;
export declare const getDeletePriorityEntryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePriorityEntry>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePriorityEntry>>, TError, {
    id: string;
}, TContext>;
export type DeletePriorityEntryMutationResult = NonNullable<Awaited<ReturnType<typeof deletePriorityEntry>>>;
export type DeletePriorityEntryMutationError = ErrorType<unknown>;
/**
* @summary Delete a priority entry
*/
export declare const useDeletePriorityEntry: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePriorityEntry>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePriorityEntry>>, TError, {
    id: string;
}, TContext>;
export declare const getGetActivationsUrl: () => string;
/**
 * @summary Get all activations
 */
export declare const getActivations: (options?: RequestInit) => Promise<Activation[]>;
export declare const getGetActivationsQueryKey: () => readonly ["/api/activations"];
export declare const getGetActivationsQueryOptions: <TData = Awaited<ReturnType<typeof getActivations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getActivations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetActivationsQueryResult = NonNullable<Awaited<ReturnType<typeof getActivations>>>;
export type GetActivationsQueryError = ErrorType<unknown>;
/**
 * @summary Get all activations
 */
export declare function useGetActivations<TData = Awaited<ReturnType<typeof getActivations>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getActivations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAddActivationUrl: () => string;
/**
 * @summary Add an activation code
 */
export declare const addActivation: (activationInput: ActivationInput, options?: RequestInit) => Promise<StateResult>;
export declare const getAddActivationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addActivation>>, TError, {
        data: BodyType<ActivationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addActivation>>, TError, {
    data: BodyType<ActivationInput>;
}, TContext>;
export type AddActivationMutationResult = NonNullable<Awaited<ReturnType<typeof addActivation>>>;
export type AddActivationMutationBody = BodyType<ActivationInput>;
export type AddActivationMutationError = ErrorType<unknown>;
/**
* @summary Add an activation code
*/
export declare const useAddActivation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addActivation>>, TError, {
        data: BodyType<ActivationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addActivation>>, TError, {
    data: BodyType<ActivationInput>;
}, TContext>;
export declare const getDeleteActivationUrl: (id: string) => string;
/**
 * @summary Delete an activation
 */
export declare const deleteActivation: (id: string, options?: RequestInit) => Promise<StateResult>;
export declare const getDeleteActivationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteActivation>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteActivation>>, TError, {
    id: string;
}, TContext>;
export type DeleteActivationMutationResult = NonNullable<Awaited<ReturnType<typeof deleteActivation>>>;
export type DeleteActivationMutationError = ErrorType<unknown>;
/**
* @summary Delete an activation
*/
export declare const useDeleteActivation: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteActivation>>, TError, {
        id: string;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteActivation>>, TError, {
    id: string;
}, TContext>;
export declare const getGameWebhookUrl: () => string;
/**
 * @summary Receive game events
 */
export declare const gameWebhook: (webhookInput: WebhookInput, options?: RequestInit) => Promise<void>;
export declare const getGameWebhookMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof gameWebhook>>, TError, {
        data: BodyType<WebhookInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof gameWebhook>>, TError, {
    data: BodyType<WebhookInput>;
}, TContext>;
export type GameWebhookMutationResult = NonNullable<Awaited<ReturnType<typeof gameWebhook>>>;
export type GameWebhookMutationBody = BodyType<WebhookInput>;
export type GameWebhookMutationError = ErrorType<unknown>;
/**
* @summary Receive game events
*/
export declare const useGameWebhook: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof gameWebhook>>, TError, {
        data: BodyType<WebhookInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof gameWebhook>>, TError, {
    data: BodyType<WebhookInput>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map
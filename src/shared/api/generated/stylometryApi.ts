/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlerSwaggerCreatedDraftResponse {
  draft?: SerializerSampleResponseDTO;
}

export interface HandlerSwaggerDeletedResponse {
  deleted?: boolean;
}

export interface HandlerSwaggerDraftResponse {
  draft?: SerializerSampleResponseDTO;
  has_draft?: boolean;
}

export interface HandlerSwaggerErrorResponse {
  error?: string;
}

export interface HandlerSwaggerLikeRequest {
  like?: 0 | 1;
  stylometry_like?: 0 | 1;
}

export interface HandlerSwaggerLikeResponse {
  liked?: boolean;
  sample?: SerializerSampleResponseDTO;
}

export interface HandlerSwaggerLoginRequest {
  stylometry_sample_name?: string;
  stylometry_sample_password?: string;
}

export interface HandlerSwaggerLoginResponse {
  access_token?: string;
  /** @example 3600 */
  expires_in?: number;
  /** @example "Bearer" */
  token_type?: string;
}

export interface HandlerSwaggerLogoutResponse {
  deauthenticated?: boolean;
  stylometry_auth_comment?: string;
}

export interface HandlerSwaggerPublishedResponse {
  published?: boolean;
  sample?: SerializerSampleResponseDTO;
}

export interface HandlerSwaggerRegisterRequest {
  stylometry_sample_name?: string;
  stylometry_sample_password?: string;
}

export interface HandlerSwaggerRegisteredResponse {
  user?: SerializerUserResponseDTO;
}

export interface HandlerSwaggerSampleListResponse {
  items?: SerializerSampleResponseDTO[];
}

export interface SerializerSampleResponseDTO {
  is_liked?: number;
  stylometry_sample_average_sentence_length?: number;
  stylometry_sample_conjunction_frequency?: number;
  stylometry_sample_created_at?: string;
  stylometry_sample_descr?: string;
  stylometry_sample_id?: number;
  stylometry_sample_image_url?: string;
  stylometry_sample_is_current_user_creator?: number;
  stylometry_sample_likes_count?: number;
  stylometry_sample_text_creator?: string;
  stylometry_sample_updated_at?: string;
  stylometry_sample_video_url?: string;
}

export interface SerializerUserResponseDTO {
  stylometry_sample_id?: number;
  stylometry_sample_name?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "/",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Stylometry API
 * @version 1.0
 * @baseUrl /
 * @contact
 *
 * REST API текстовых образцов: список, лента, черновики, публикация, лайки и пользователи. Вход выдаёт JWT; операции создателя требуют Bearer JWT. HTML-маршруты доступны только при ENABLE_FRONTEND=true.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Проверяет пароль по bcrypt-хешу и выдаёт подписанный access token на 1 час.
     *
     * @tags API: вход
     * @name AuthLoginCreate
     * @summary Войти и получить JWT
     * @request POST:/api/auth/login
     */
    authLoginCreate: (
      request: HandlerSwaggerLoginRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSwaggerLoginResponse, HandlerSwaggerErrorResponse>({
        path: `/api/auth/login`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Сохраняет jti текущего JWT в Redis blacklist до окончания его срока действия. Повторный выход с тем же токеном возвращает 401.
     *
     * @tags API: вход
     * @name AuthLogoutCreate
     * @summary Выйти и отозвать JWT
     * @request POST:/api/auth/logout
     * @secure
     */
    authLogoutCreate: (params: RequestParams = {}) =>
      this.request<HandlerSwaggerLogoutResponse, HandlerSwaggerErrorResponse>({
        path: `/api/auth/logout`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Без фильтра возвращает все опубликованные образцы. Без JWT признаки владельца и лайка равны 0; с действительным JWT вычисляются для вошедшего пользователя.
     *
     * @tags API: образцы
     * @name SamplesList
     * @summary Список опубликованных образцов
     * @request GET:/api/samples
     */
    samplesList: (
      query?: {
        /** Максимальная средняя длина предложения, от 0 до 30 */
        stylometry_avg_len?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSwaggerSampleListResponse,
        HandlerSwaggerErrorResponse
      >({
        path: `/api/samples`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Первая строка поля text — автор; остальные строки — текст. Файлы загружаются в MinIO. CreatorID определяется по JWT.
     *
     * @tags API: образцы
     * @name SamplesCreate
     * @summary Создать или обновить черновик с изображением и видео
     * @request POST:/api/samples
     * @secure
     */
    samplesCreate: (
      data: {
        /** Автор в первой строке и текстовый отрывок ниже */
        text: string;
        /**
         * Файл изображения
         * @format binary
         */
        image: File;
        /**
         * Файл видео
         * @format binary
         */
        video: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSwaggerCreatedDraftResponse,
        HandlerSwaggerErrorResponse
      >({
        path: `/api/samples`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает черновик пользователя из JWT. Если черновика нет, draft равен null.
     *
     * @tags API: образцы
     * @name SamplesDraftList
     * @summary Черновик текущего пользователя
     * @request GET:/api/samples/draft
     * @secure
     */
    samplesDraftList: (params: RequestParams = {}) =>
      this.request<HandlerSwaggerDraftResponse, HandlerSwaggerErrorResponse>({
        path: `/api/samples/draft`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Тело не требуется. Показатели текста пересчитываются при публикации своего черновика.
     *
     * @tags API: образцы
     * @name SamplesDraftPublishUpdate
     * @summary Опубликовать черновик текущего пользователя
     * @request PUT:/api/samples/draft/publish
     * @secure
     */
    samplesDraftPublishUpdate: (params: RequestParams = {}) =>
      this.request<
        HandlerSwaggerPublishedResponse,
        HandlerSwaggerErrorResponse
      >({
        path: `/api/samples/draft/publish`,
        method: "PUT",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Без ID возвращает первый образец; с ID возвращает его, а при next=true следующий опубликованный образец.
     *
     * @tags API: образцы
     * @name SamplesFeedList
     * @summary Опубликованный образец из ленты
     * @request GET:/api/samples/feed
     */
    samplesFeedList: (
      query?: {
        /** ID образца */
        stylometry_id?: number;
        /** Строка true для следующего образца; другое значение означает false */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<SerializerSampleResponseDTO, HandlerSwaggerErrorResponse>({
        path: `/api/samples/feed`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * @description Удаляет только собственный образец. Для чужого образца возвращает 403, для отсутствующего — 404.
     *
     * @tags API: образцы
     * @name SamplesDelete
     * @summary Логически удалить образец
     * @request DELETE:/api/samples/{id}
     * @secure
     */
    samplesDelete: (id: number, params: RequestParams = {}) =>
      this.request<HandlerSwaggerDeletedResponse, HandlerSwaggerErrorResponse>({
        path: `/api/samples/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description JSON с stylometry_like или like: 1 ставит лайк, 0 снимает. Также принимается form-data. Лайк принадлежит пользователю из JWT.
     *
     * @tags API: образцы
     * @name SamplesLikeCreate
     * @summary Поставить или снять лайк
     * @request POST:/api/samples/{id}/like
     * @secure
     */
    samplesLikeCreate: (
      id: number,
      request: HandlerSwaggerLikeRequest,
      params: RequestParams = {},
    ) =>
      this.request<HandlerSwaggerLikeResponse, HandlerSwaggerErrorResponse>({
        path: `/api/samples/${id}/like`,
        method: "POST",
        body: request,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Принимает JSON или form-data с именем и паролем. Пароль сохраняется как bcrypt-хеш и не возвращается.
     *
     * @tags API: пользователи
     * @name UsersCreate
     * @summary Зарегистрировать пользователя
     * @request POST:/api/users
     */
    usersCreate: (
      request: HandlerSwaggerRegisterRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSwaggerRegisteredResponse,
        HandlerSwaggerErrorResponse
      >({
        path: `/api/users`,
        method: "POST",
        body: request,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  samples = {
    /**
     * @description Доступен только при ENABLE_FRONTEND=true; по умолчанию маршрут не зарегистрирован.
     *
     * @tags HTML: отключено по умолчанию
     * @name SamplesList
     * @summary Перейти к HTML-ленте
     * @request GET:/samples
     */
    samplesList: (params: RequestParams = {}) =>
      this.request<any, string>({
        path: `/samples`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Доступен только при ENABLE_FRONTEND=true; по умолчанию маршрут не зарегистрирован. После успеха перенаправляет на плитку.
     *
     * @tags HTML: отключено по умолчанию
     * @name DeleteCreate
     * @summary Логически удалить образец из HTML-формы
     * @request POST:/samples/delete
     */
    deleteCreate: (
      data: {
        /** ID образца */
        stylometry_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, string>({
        path: `/samples/delete`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        ...params,
      }),

    /**
     * @description Доступна только при ENABLE_FRONTEND=true; по умолчанию маршрут не зарегистрирован.
     *
     * @tags HTML: отключено по умолчанию
     * @name DraftList
     * @summary HTML-страница черновика
     * @request GET:/samples/draft
     */
    draftList: (params: RequestParams = {}) =>
      this.request<string, string>({
        path: `/samples/draft`,
        method: "GET",
        ...params,
      }),

    /**
     * @description Доступен только при ENABLE_FRONTEND=true; по умолчанию маршрут не зарегистрирован. После успеха перенаправляет на страницу черновика.
     *
     * @tags HTML: отключено по умолчанию
     * @name DraftCreate
     * @summary Создать черновик из HTML-формы
     * @request POST:/samples/draft
     */
    draftCreate: (
      data: {
        /** Автор текста; также принимается stylometry_title */
        stylometry_text_creator?: string;
        /** Резервное поле автора */
        stylometry_title?: string;
        /** Текстовый отрывок; также принимается stylometry_sample_descr */
        stylometry_descr?: string;
        /** Резервное поле текста */
        stylometry_sample_descr?: string;
        /** URL изображения */
        stylometry_image_url?: string;
        /** URL видео */
        stylometry_video_url?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, string>({
        path: `/samples/draft`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        ...params,
      }),

    /**
     * @description Доступен только при ENABLE_FRONTEND=true; по умолчанию маршрут не зарегистрирован. После успеха перенаправляет на плитку.
     *
     * @tags HTML: отключено по умолчанию
     * @name DraftPublishCreate
     * @summary Опубликовать черновик из HTML-формы
     * @request POST:/samples/draft/publish
     */
    draftPublishCreate: (
      data: {
        /** Текстовый отрывок для публикации */
        stylometry_descr?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<any, string>({
        path: `/samples/draft/publish`,
        method: "POST",
        body: data,
        type: ContentType.UrlEncoded,
        ...params,
      }),

    /**
     * @description Доступна только при ENABLE_FRONTEND=true; по умолчанию маршрут не зарегистрирован.
     *
     * @tags HTML: отключено по умолчанию
     * @name FeedList
     * @summary HTML-страница ленты
     * @request GET:/samples/feed
     */
    feedList: (
      query?: {
        /** ID образца */
        stylometry_id?: number;
        /** Строка true для следующего образца */
        next?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, string>({
        path: `/samples/feed`,
        method: "GET",
        query: query,
        ...params,
      }),

    /**
     * @description Доступна только при ENABLE_FRONTEND=true; по умолчанию маршрут не зарегистрирован.
     *
     * @tags HTML: отключено по умолчанию
     * @name GridList
     * @summary HTML-страница плитки образцов
     * @request GET:/samples/grid
     */
    gridList: (
      query?: {
        /** Максимальная средняя длина предложения, от 0 до 30 */
        stylometry_avg_len?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<string, string>({
        path: `/samples/grid`,
        method: "GET",
        query: query,
        ...params,
      }),
  };
}

import {
  REQUEST_UPDATE_BODY,
  REQUEST_UPDATE_METHOD,
  REQUEST_UPDATE_URL,
  REQUEST_SEND_SUCCESS,
  REQUEST_SEND_FAILURE,
  REQUEST_SEND,
  UpdateUrlPayload,
  REQUEST_UPDATE_URLS,
  UpdateUrlsPayload,
  REQUEST_UPDATE_EXAMPLE,
  UpdateExamplePayload,
  UpdateBodyPayload,
  UpdateMethodPayload,
  SendRequestPayload,
  RequestTypes,
  SendRequestSuccessPayload,
  SendRequestFailurePayload,
} from '../actions/request';
import GrpCurlResponse from '../../models/GrpCurlResponse';
import { PROGRESS_UPDATE, ProgressUpdatePayload } from '../actions/progress';
import persistenceRegistry from '../persistency/PersistenceRegistry';

export type RequestState = {
  urls: string[];
  url: string;
  method: string;
  body: string;
  example: string;
  response: GrpCurlResponse;
  isLoading: boolean;
  progressLoading: number;
};

const defaultState: RequestState = {
  urls: persistenceRegistry.getUrlsAsStringList(),
  url: '',
  method: '',
  body: '',
  example: '',
  response: new GrpCurlResponse('', '', ''),
  isLoading: false,
  progressLoading: 0,
};

export default function request(state = defaultState, action: RequestTypes): RequestState {
  switch (action.type) {
    case REQUEST_UPDATE_BODY: {
      const payload = action as UpdateBodyPayload;
      const { body } = payload;
      return {
        ...state,
        body,
      };
    }
    case REQUEST_UPDATE_EXAMPLE: {
      const payload = action as UpdateExamplePayload;
      const { example } = payload;
      return {
        ...state,
        example,
      };
    }
    case REQUEST_UPDATE_METHOD: {
      const payload = action as UpdateMethodPayload;
      const { method } = payload;
      return {
        ...state,
        method,
      };
    }
    case REQUEST_UPDATE_URL: {
      const payload = action as UpdateUrlPayload;
      const { url } = payload;
      return {
        ...state,
        url,
      };
    }
    case REQUEST_UPDATE_URLS: {
      const payload = action as UpdateUrlsPayload;
      const { urls } = payload;
      return {
        ...state,
        urls,
      };
    }
    case REQUEST_SEND: {
      const { url, method, body } = action as SendRequestPayload;
      return {
        ...state,
        url,
        method,
        body,
        isLoading: true,
        progressLoading: 0,
      };
    }
    case REQUEST_SEND_SUCCESS: {
      const { response } = action as SendRequestSuccessPayload;
      return {
        ...state,
        response,
        isLoading: false,
        progressLoading: 0,
      };
    }
    case REQUEST_SEND_FAILURE: {
      const { response } = action as SendRequestFailurePayload;
      return {
        ...state,
        response,
        isLoading: false,
        progressLoading: 0,
      };
    }
    case PROGRESS_UPDATE: {
      const { value: progressLoading } = action as ProgressUpdatePayload;
      return {
        ...state,
        isLoading: false,
        progressLoading,
      };
    }
    default:
      return state;
  }
}

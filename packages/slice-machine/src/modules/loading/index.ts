import { Reducer } from "redux";
import mapValues from "lodash/mapValues";
import { SliceMachineStoreType } from "src/redux/type";
import { LoadingStoreType, LoadingKeysEnum } from "./types";
import { ActionType, createAction, getType } from "typesafe-actions";
import { call, put } from "redux-saga/effects";

export const initialState: LoadingStoreType = {
  ...(mapValues(LoadingKeysEnum, () => false) as Record<
    LoadingKeysEnum,
    boolean
  >),
};

// Action Creators
export const startLoadingActionCreator = createAction("LOADING/START")<{
  loadingKey: LoadingKeysEnum;
}>();

export const stopLoadingActionCreator = createAction("LOADING/STOP")<{
  loadingKey: LoadingKeysEnum;
}>();

type LoadingActions = ActionType<
  typeof startLoadingActionCreator | typeof stopLoadingActionCreator
>;

// Selectors
export const isLoading = (
  store: SliceMachineStoreType,
  key: LoadingKeysEnum
): boolean => store.loading[key];

// Reducer
export const loadingReducer: Reducer<LoadingStoreType, LoadingActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case getType(startLoadingActionCreator):
      return {
        ...state,
        [action.payload.loadingKey]: true,
      };
    case getType(stopLoadingActionCreator):
      return {
        ...state,
        [action.payload.loadingKey]: false,
      };
    default:
      return state;
  }
};

// Saga decorator
export const withLoader = (saga: any, loadingKey: LoadingKeysEnum) =>
  function* (...args: any[]) {
    yield put(startLoadingActionCreator({ loadingKey }));
    yield call(
      saga,
      args[0],
      args[1],
      args[2],
      args[3],
      args[4],
      args[5],
      args[6]
    );
    yield put(stopLoadingActionCreator({ loadingKey }));
  };

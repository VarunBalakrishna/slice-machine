import { useDispatch } from "react-redux";
import { LoadingKeysEnum } from "@src/modules/loading/types";
import { ModalKeysEnum } from "@src/modules/modal/types";
import { modalCloseCreator, modalOpenCreator } from "@src/modules/modal";
import {
  startLoadingActionCreator,
  stopLoadingActionCreator,
} from "@src/modules/loading";
import {
  finishOnboardingCreator,
  sendAReviewCreator,
  skipReviewCreator,
  updatesViewedCreator,
} from "@src/modules/userContext";
import { getStateCreator } from "@src/modules/environment";
import {
  openSetupDrawerCreator,
  closeSetupDrawerCreator,
  toggleSetupDrawerStepCreator,
  checkSimulatorSetupCreator,
  connectToSimulatorIframeCreator,
} from "@src/modules/simulator";
import ServerState from "@models/server/ServerState";
import {
  createCustomTypesCreator,
  saveCustomTypesCreator,
} from "@src/modules/customTypes";
import { CustomTypeState } from "@models/ui/CustomTypeState";
import { UserContextStoreType } from "./userContext/types";

const useSliceMachineActions = () => {
  const dispatch = useDispatch();

  // Simulator store
  const checkSimulatorSetup = (
    withFirstVisitCheck: boolean,
    callback?: () => void
  ) =>
    dispatch(
      checkSimulatorSetupCreator.request({ withFirstVisitCheck, callback })
    );
  const openSetupDrawer = () => dispatch(openSetupDrawerCreator({}));
  const closeSetupDrawer = () => dispatch(closeSetupDrawerCreator());
  const connectToSimulatorFailure = () =>
    dispatch(connectToSimulatorIframeCreator.failure());
  const connectToSimulatorSuccess = () =>
    dispatch(connectToSimulatorIframeCreator.success());
  const toggleSetupDrawerStep = (stepNumber: number) =>
    dispatch(toggleSetupDrawerStepCreator({ stepNumber }));

  // Modal store
  const closeLoginModal = () =>
    dispatch(modalCloseCreator({ modalKey: ModalKeysEnum.LOGIN }));
  const openLoginModal = () =>
    dispatch(modalOpenCreator({ modalKey: ModalKeysEnum.LOGIN }));
  const closeCreateCustomTypeModal = () =>
    dispatch(modalCloseCreator({ modalKey: ModalKeysEnum.CREATE_CUSTOM_TYPE }));
  const openCreateCustomTypeModal = () =>
    dispatch(modalOpenCreator({ modalKey: ModalKeysEnum.CREATE_CUSTOM_TYPE }));

  // Loading store
  const startLoadingReview = () =>
    dispatch(startLoadingActionCreator({ loadingKey: LoadingKeysEnum.REVIEW }));
  const stopLoadingReview = () =>
    dispatch(stopLoadingActionCreator({ loadingKey: LoadingKeysEnum.REVIEW }));
  const startLoadingLogin = () =>
    dispatch(startLoadingActionCreator({ loadingKey: LoadingKeysEnum.LOGIN }));
  const stopLoadingLogin = () =>
    dispatch(stopLoadingActionCreator({ loadingKey: LoadingKeysEnum.LOGIN }));

  // UserContext Store
  const skipReview = () => dispatch(skipReviewCreator());
  const sendAReview = () => dispatch(sendAReviewCreator());
  const finishOnboarding = () => dispatch(finishOnboardingCreator());
  const setUpdatesViewed = (versions: UserContextStoreType["updatesViewed"]) =>
    dispatch(updatesViewedCreator(versions));

  // Custom types Store
  const createCustomTypes = (id: string, label: string, repeatable: boolean) =>
    dispatch(createCustomTypesCreator.request({ id, label, repeatable }));
  const saveCustomTypes = (modelPayload: CustomTypeState) =>
    dispatch(saveCustomTypesCreator({ modelPayload }));

  // State Action (used by multiple stores)
  const getState = (serverState: ServerState | undefined) => {
    if (!serverState) return;

    dispatch(
      getStateCreator({
        env: serverState.env,
        warnings: serverState.warnings,
        configErrors: serverState.configErrors,
        remoteCustomTypes: serverState.remoteCustomTypes,
        localCustomTypes: serverState.customTypes,
      })
    );
  };

  return {
    checkSimulatorSetup,
    connectToSimulatorFailure,
    connectToSimulatorSuccess,
    toggleSetupDrawerStep,
    closeSetupDrawer,
    openSetupDrawer,
    getState,
    finishOnboarding,
    openLoginModal,
    closeLoginModal,
    startLoadingLogin,
    stopLoadingLogin,
    stopLoadingReview,
    startLoadingReview,
    createCustomTypes,
    saveCustomTypes,
    sendAReview,
    skipReview,
    setUpdatesViewed,
    closeCreateCustomTypeModal,
    openCreateCustomTypeModal,
  };
};

export default useSliceMachineActions;

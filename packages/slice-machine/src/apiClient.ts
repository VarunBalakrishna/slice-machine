import axios, { AxiosResponse } from "axios";
import { CheckAuthStatusResponse } from "@models/common/Auth";
import { SimulatorCheckResponse } from "@models/common/Simulator";
import {
  CustomType,
  ObjectTabs,
  SaveCustomTypeBody,
} from "@models/common/CustomType";
import { CustomTypeMockConfig } from "@models/common/MockConfig";
import { SliceBody } from "@models/common/Slice";

const defaultAxiosConfig = {
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

/** Custom Type Routes **/

export const saveCustomType = (
  customType: CustomType<ObjectTabs>,
  mockConfig: CustomTypeMockConfig
): Promise<AxiosResponse> => {
  const requestBody: SaveCustomTypeBody = {
    model: customType,
    mockConfig: mockConfig,
  };

  return axios.post("/api/custom-types/save", requestBody, defaultAxiosConfig);
};

/** Slice Routes **/

export const createSlice = (
  sliceName: string,
  libName: string
): Promise<{ variationId: string }> => {
  const requestBody: SliceBody = {
    sliceName,
    from: libName,
  };

  return axios
    .post(`/api/slices/create`, requestBody, defaultAxiosConfig)
    .then((response: AxiosResponse<{ variationId: string }>) => response.data);
};

/** Auth Routes **/

export const startAuth = (): Promise<AxiosResponse<Record<string, never>>> =>
  axios.post("/api/auth/start", {}, defaultAxiosConfig);

export const checkAuthStatus = (): Promise<CheckAuthStatusResponse> =>
  axios
    .post("/api/auth/status", {}, defaultAxiosConfig)
    .then((r: AxiosResponse<CheckAuthStatusResponse>) => r.data);

/** Simulator Routes **/

export const checkSimulatorSetup = (): Promise<
  AxiosResponse<SimulatorCheckResponse>
> => axios.get(`/api/simulator/check`);

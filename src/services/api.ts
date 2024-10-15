import axios from 'axios';
import { Protocol } from '../types';

const API_URL = 'http://localhost:3000/api';

export const getAllProtocols = async (): Promise<Protocol[]> => {
  const response = await axios.get(`${API_URL}/protocols`);
  return response.data;
};

export const addProtocol = async (protocol: Protocol): Promise<Protocol> => {
  const response = await axios.post(`${API_URL}/protocols`, protocol);
  return response.data;
};

export const updateProtocol = async (protocol: Protocol): Promise<Protocol> => {
  const response = await axios.put(`${API_URL}/protocols/${protocol.id}`, protocol);
  return response.data;
};

export const deleteProtocol = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/protocols/${id}`);
};

export const getAllRegions = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/regions`);
  return response.data;
};

export const addRegion = async (region: string): Promise<void> => {
  await axios.post(`${API_URL}/regions`, { name: region });
};

export const deleteRegion = async (region: string): Promise<void> => {
  await axios.delete(`${API_URL}/regions/${region}`);
};

export const getAllExecutors = async (): Promise<string[]> => {
  const response = await axios.get(`${API_URL}/executors`);
  return response.data;
};

export const addExecutor = async (executor: string): Promise<void> => {
  await axios.post(`${API_URL}/executors`, { name: executor });
};

export const deleteExecutor = async (executor: string): Promise<void> => {
  await axios.delete(`${API_URL}/executors/${executor}`);
};
import axios from './api';
import { useQuery } from '@tanstack/react-query';

// WARNING! - Any changes here MUST be the same between app/src/api & server/src/db/
import { Services } from '../../../server/src/db/servicesSchema.ts';
import { DeepPartial } from 'ts-essentials';
export * from '../../../server/src/db/servicesSchema.ts';


export const useServices = () => {
  return useQuery<Services>({
    queryKey: ['useServices'],
    queryFn: async () => {
      const response = await axios.get<Services>('/services');
      return response.data;
    },
  });
};

export const postServices = (services: DeepPartial<Services>) => {
  return axios.post('/services', services);
};


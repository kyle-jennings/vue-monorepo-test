/* eslint-disable camelcase */

import { Role } from '@/lib/UserRoleUtility';
import { CompanyResponse } from './CompanyResponse';

interface UserCustomField {
  field_id: number,
  name: string,
  type: string,
  value: string,
}

interface User {
  username: string,
  first_name: string,
  last_name: string,
  full_name: string,
  title: string,
  email: string,
  id_number: string,
  phone: string,
  location: string,
  country: string,
  state: string,
  role: Role,
  site_admin?: boolean,
  hire_date: string | null,
  id?: number,
  department_id?: number,
  new_password?: string,
  company: CompanyResponse,
  custom_profile_fields: UserCustomField[] | null,
  impersonator?: {
    id: string,
    username: string
  },
}

interface UserResponse extends User {
  id: number,
  suspended: boolean | null,
  last_access_date: Date | null,
  create_date: Date,
  company: {
    id: number,
    name: string,
  },
  department: string | null,
  modified_date: Date | null,
  episode_stats?: any | null,
}

export { UserResponse, User };

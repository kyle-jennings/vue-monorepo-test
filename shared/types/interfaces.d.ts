/* eslint-disable camelcase */

declare module '^/shared/lib/tree-utils';
declare module '^@@/*';

declare interface DataWrap<T> {
  data: T,
}

/**
 * User object stuff
 */
declare interface UserCustomField {
  field_id: number,
  name: string,
  type: string,
  value: string,
}

declare interface Company {
  id: number,
  name: string,
  short_name: string,
  password_change_enabled: boolean,
  complex_passwords: boolean,
  course_access_notification: boolean,
  course_certificates: boolean,
  course_completion: boolean,
  course_configuration: boolean,
  department_label: string,
  industry: string | null,
  logout_url: string | null,
  auto_completion_interval: number,
  max_password_age_days: number,
  password_bypass: boolean,
  provision_partner: boolean,
  sms_notifications: boolean,
  suspended: boolean,
  address: string | null,
  address2: string | null,
  city: string | null,
  country: string | null,
  state: string | null,
  zip: string | null,
  contact_email: string | null,
  contact_fax: string | null,
  contact_first_name: string | null,
  contact_last_name: string | null,
  contact_mobile_phone: string | null,
  contact_phone: string | null,
  salesforce_id: number | null,
}


declare interface User {
  id: number,
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
  role: string,
  hire_date: number,
  suspended: boolean,
  last_access: number,
  created: string,
  custom_profile_fields: Array<UserCustomField>,
  company: Company
}

// user link for user icon dropdown
declare interface UserLink {
  to: {
    path?: string,
    name?: string,
  },
  title: string|number,
}

// dropdowns, used for things like: variant dropdowns, sorting, filtering, ect
declare interface DropdownItems {
  id: string | number,
  title: string,
  sortBy?: {
    field: string,
    order?: string,
    subField?: string,
  },
}

// pagination
declare interface PaginationObj {
  perPage: number, // items per page
  pages: number, // total number of pages
  total: number // total number of items
}

// transmission things
declare interface APIResponse {
  status: number,
  statusText: string,
  data?: {
    error?: string | {
      message?: string,
      details: any,
    },
    data?: any,
    token?: string,
  },
}

declare interface AxiosError {
  code: string,
  message: string,
  name: string,
  response: APIResponse,
}


declare interface NotificationArgs {
  template: number,
  sender: number,
  type: 1 | 2,
  date: string,
}


type SnackbarType = 'is-white' | 'is-black' | 'is-light' | 'is-dark' | 'is-primary' |
  'is-info' | 'is-success' | 'is-warning' | 'is-danger';

/**
 * Buefy notification icons
 */
declare interface SnackbarOptions {
  message: string,
  type?: string,
  position?: string,
  duration?: number,
  queue?: boolean,
  indefinite?: boolean,
  'pause-on-hover'?: boolean,
  container?: string,
  actionText?: string,
  onAction?: function,
  cancelText?: string,
}

declare interface DialogOptions {
  type?: string,
  title?: string,
  message?: string,
  hasIcon?: boolean,
  icon?: string,
  iconPack?: string,
  size?: string,
  animation?: string,
  confirmText?: string,
  cancelText?: string,
  canCancel?: boolean,
  cancelCallback?: function,
  inputAttrs?: { any?: string },
  onConfirm?: function,
  confirmCallback?: function,
  closeOnConfirm?: boolean,
  onCancel?: function,
  scroll?: string,
  container?: string,
  focusOn?: string,
  'trap-focus'?: boolean,
  'aria-role'?: string,
  'aria-modal'?: boolean,
}

declare interface ModalOptions {
  active: boolean,
  component: {any: unknown},
  props: {any: unknown},
  events: {any: unknown},
  content: string,
  width: number, string,
  'full-screen': boolean,
  'has-modal-card': boolean,
  animation: string,
  'can-cancel': boolean,
  'on-cancel': function,
  scroll: string,
  'trap-focus': boolean,
  'auto-focus': boolean,
  'custom-class': string,
  'destroy-on-hide': boolean,
  'aria-role': string,
  'aria-label': string,
  'aria-modal': boolean
  'close-button-aria-label': string,
}

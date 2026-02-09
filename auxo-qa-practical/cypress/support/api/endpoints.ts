export const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const

export const webApiEndpoints = {
  job: {
    sortList: 'api/job-mgmt/odata/jobindex',
    base: 'api/job-mgmt/jobs',
    customers: 'api/job-mgmt/customers',
  },
  parts: {
    base: 'api/inventory/parts',
    merge: 'api/inventory/parts/merge',
    stock: 'api/inventory/parts/*/stock',
  },
} as const

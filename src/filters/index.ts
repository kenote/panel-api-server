import { unset } from 'lodash'

export function cleanNaNByPayload (payload: Record<string, any>) {
  for (let [key, val] of Object.entries(payload)) {
    if (Number.isNaN(val) || val == undefined || (val == '' && ['password'].includes(key))) {
      unset(payload, key)
    }
  }
  return payload
}
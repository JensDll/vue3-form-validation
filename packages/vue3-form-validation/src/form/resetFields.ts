import * as n_domain from '../domain'

export function resetFields(formData: any, transformedFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key]

    if (n_domain.isTransformedField(transformedValue)) {
      if (n_domain.isArray(transformedValue.$value)) {
        transformedValue.$value = n_domain.deepCopy(value)
      } else if (n_domain.isRecord(transformedValue.$value)) {
        const copy = n_domain.deepCopy(value)
        Object.assign(transformedValue.$value, copy)
      } else {
        transformedValue.$value = value
      }

      return
    }

    if (n_domain.isObject(value)) {
      resetFields(value, transformedFormData[key])
    }
  })
}

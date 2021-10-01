import * as _ from '../../common'

export function resetFields(formData: any, transformedFormData: any) {
  Object.entries(formData).forEach(([key, value]) => {
    const transformedValue = transformedFormData[key]

    if (_.isTransformedField(transformedValue)) {
      if (_.isArray(transformedValue.$value)) {
        transformedValue.$value = _.deepCopy(value)
      } else if (_.isRecord(transformedValue.$value)) {
        const copy = _.deepCopy(value)
        Object.assign(transformedValue.$value, copy)
      } else {
        transformedValue.$value = value
      }

      return
    }

    if (typeof value === 'object') {
      resetFields(value, transformedFormData[key])
    }
  })
}

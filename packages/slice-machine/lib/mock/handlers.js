const handleFieldMock = (widget, maybeFieldMock = {}, config) => {
  if (maybeFieldMock.content) {
    const { handleMockContent } = widget
    if (handleMockContent) {
      const res = handleMockContent(maybeFieldMock.content, config)
      if (res) {
        return res
      }
      console.warn(`[mock] contenv value is unsupported for field "${widget.TYPE_NAME || `dev log ${config}`}"`)
    }
  }
  const { handleMockConfig } = widget
  if (handleMockConfig) {
    console.log('handle maybeFieldMock.config', maybeFieldMock.config)
    return handleMockConfig(maybeFieldMock ? maybeFieldMock.config  || {} : {}, config)
  }
  console.warn(`[slice-machine] "config" property for field type "${widget.TYPE_NAME}" is not yet supported.`)
  if (!widget.TYPE_NAME) {
    console.warn('[dev log] type name undef: ', config)
  }
  return widget.createMock ? widget.createMock(config || {}) : null
}

export const handleFields = (Widgets) => (fields = [], mocks = {}) => {
  return fields.reduce((acc, [key, value]) => {
    const widget = Widgets[value.type]
    const maybeFieldMock = mocks[key]

    console.log({ widget, maybeFieldMock })

    if (widget) {
      const mock = handleFieldMock(widget, maybeFieldMock, value.config)
      return {
        ...acc,
        [key]: mock
      }
    }
    console.warn(`[slice-machine] Could not create mock for type "${value.type}": not supported.`)
    return acc
  }, {})
}
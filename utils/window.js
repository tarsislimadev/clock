// 

export const getWidth = () => window.innerWidth

export const getHeight = () => window.innerHeight

export const getAspect = () => getWidth() > getHeight() ? getWidth() / getHeight() : getHeight() / getWidth()

export const dispatchWindowEvent = (name, value = null) => {
  const ev = new CustomEvent(name)
  ev.value = value
  window.dispatchEvent(ev)
}

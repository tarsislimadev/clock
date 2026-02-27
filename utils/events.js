export const createEvent = (name, value = null) => {
  const ev = new Event(name)
  if (value !== null) ev.value = value
  return ev
}

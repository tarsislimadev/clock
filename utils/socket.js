export class ApplicationWebSocket extends WebSocket {
  constructor(url, { onopen = (() => { }), onmessage = (() => { }), onerror = (() => { }), onclose = (() => { }) }) {
    super(url)
    this.addEventListener('open', (data) => onopen(data))
    this.addEventListener('message', (data) => onmessage(data))
    this.addEventListener('error', (data) => onerror(data))
    this.addEventListener('close', (data) => onclose(data))
  }
}

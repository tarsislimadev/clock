import * as LOCAL from './local.js'

export const getPageStyle = () => LOCAL.get(['pageStyle'], 'light')

export const setPageStyle = (style) => LOCAL.set(['pageStyle'], style)

export const togglePageStyle = () => setPageStyle(getPageStyle() === 'dark' ? 'light' : 'dark')

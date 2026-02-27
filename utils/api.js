import { request, simple_request } from './ajax.js'

import { arr2str } from './str.js'

import * as LOCAL from '../../../utils/local.js'

const url = (url, query = {}) => {
  const nUrl = new URL(url)
  Object.keys(query).map((q) => nUrl.searchParams.set(q, query[q]))
  return nUrl.toString()
}

export const urls = {
  youtube: (pathname, params = {}) => url('https://www.googleapis.com/youtube/v3/' + pathname, params)
}

const getGmailHeader = () => ({ 'Authorization': `Bearer ${LOCAL.get(['google.access_token'])}` })

const getFacebookHeaders = (headers = {}) => ({ ...headers, 'Authorization': `Bearer ${LOCAL.get(['facebook.access_token'])}` })

export const rest = {
  binance: {
    v3: {
      ticker: {
        getPricesBySymbols: (symbols = []) => request('GET', `https://api4.binance.com/api/v3/ticker/price?symbols=[${arr2str(symbols)}]`).then(res => res.getData())
      }
    }
  },
  musixmatch: {
    v1: {
      call: (method, path, params = {}) => request(method, url('https://api.musixmatch.com/ws/1.1/' + path, params), {}, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Request-Headers': '*' })
    }
  },
  newsapi: {
    v2: {
      call: (path, params = {}) => request('GET', url('https://newsapi.org/v2/' + path, params)),
    }
  },
  youtube: {
    v3: {
      videos: {
        mostPopular: () => rest.youtube.v3.videos.list({ chart: 'mostPopular' }),
        chartUnspecified: () => rest.youtube.v3.videos.list({ chart: 'chartUnspecified' })
      },
    }
  },
  gmail: {
    v1: {
      users: {
        getProfile: (userId = 'me') => request('GET', `https://gmail.googleapis.com/gmail/v1/users/${userId}/labels`, null, getGmailHeader())
      }
    }
  },
  graph_facebook: {
    v22_0: {
      call: (method, path, search = {}, body = null, headers = {}) => simple_request({ headers: getFacebookHeaders(headers), method, protocol: 'https:', hostname: 'graph.facebook.com', pathname: `/v22.0/${path}`, search, body })
    }
  }
}

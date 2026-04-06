export async function httpRequest(method, url, body = null, headers = {}) {
  try {
    const options = {
      method: method.toUpperCase(),
      headers: { 'Content-Type': 'application/json', ...headers }
    }

    if (body && ['POST', 'PATCH', 'PUT', 'DELETE'].includes(options.method)) {
      options.body = typeof body === 'string' ? body : JSON.stringify(body)
    }

    const response = await fetch(url, options)

    let data
    const contentType = response.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        data = await response.json()
      } catch {
        data = await response.text()
      }
    } else {
      data = await response.text()
    }

    return {
      success: response.ok,
      status: response.status,
      data
    }
  } catch (error) {
    return {
      success: false,
      status: 0,
      data: null,
      error: error.message
    }
  }
}

export const schemas = [
  {
    name: 'http_request',
    description: 'Makes an HTTP request (GET/POST/PATCH/DELETE) and returns status + body',
    input_schema: {
      type: 'object',
      properties: {
        method: { type: 'string', enum: ['GET', 'POST', 'PATCH', 'DELETE'], description: 'HTTP method' },
        url: { type: 'string', description: 'Full URL to request' },
        body: { type: 'object', description: 'Request body (for POST/PATCH/DELETE)' },
        headers: { type: 'object', description: 'Additional headers' }
      },
      required: ['method', 'url']
    }
  }
]

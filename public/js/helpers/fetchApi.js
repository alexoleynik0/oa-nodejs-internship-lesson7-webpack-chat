/* global appLocalStorage appNotification appVariables socket */

{
  const errorCodeToTitle = (errorCode) => (({
    E_MISSING_OR_INVALID_PARAMS: 'Validation Error',
    E_AUTH_ERROR: 'Authentication Error',
    E_RESOURCE_NOT_FOUND: 'Not Found',
    E_ROUTE_NOT_FOUND: 'Not Found',
    E_TOO_MANY_REQUESTS: 'Too Many Requests',
  })[errorCode] || errorCode);

  const processSimpleError = (resJSON) => {
    const title = errorCodeToTitle(resJSON.message);
    const html = resJSON.details || 'Check the data you tried to submit and try again.';

    appNotification.error(title, html);
  };
  const processValidationError = (resJSON) => {
    const title = errorCodeToTitle(resJSON.message);
    const liArr = resJSON.details.map((errObj) => `<li>${errObj.message}</li>`);
    const html = `<ul>${liArr.join('')}</ul>`;

    appNotification.error(title, html);
  };

  const processResponseLogin = (resJSON) => {
    appLocalStorage.setItem('userId', resJSON.userId);
    appLocalStorage.setItem('accessToken', resJSON.accessToken);
    appLocalStorage.setItem('refreshToken', resJSON.refreshToken);
  };
  const processResponseLogout = () => {
    appLocalStorage.removeItem('userId');
    appLocalStorage.removeItem('accessToken');
    appLocalStorage.removeItem('refreshToken');
  };

  const retryFetchAfterTokenRefresh = async (url, method, data, retryLimit) => {
    const refreshData = {
      userId: appLocalStorage.getItem('userId'),
      oldRefreshToken: appLocalStorage.getItem('refreshToken'),
    };
    try {
      // eslint-disable-next-line no-use-before-define
      await fetchApi(`${appVariables.apiBaseUrl}/auth/token`, 'POST', refreshData);
      // eslint-disable-next-line no-use-before-define
      return fetchApi(url, method, data, retryLimit);
    } catch {
      window.location = '/login';
      return Promise.reject(new Error('Token refresh failed.'));
    }
  };

  const fetchApi = async (url, method = 'GET', data = null, retryLimit = 3) => {
    if (retryLimit === 0) {
      throw new Error('Retry limit reached.');
    }

    const dataToSend = data instanceof FormData
      ? Object.fromEntries(data.entries())
      : data;

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
    };
    if (appLocalStorage.getItem('userId')) {
      headers.Authorization = `Bearer ${appLocalStorage.getItem('accessToken')}`;
    }

    // Default options are marked with *
    const options = {
      method, // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers,
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      // body data type must match "Content-Type" header
      body: method !== 'GET' && dataToSend !== null ? JSON.stringify(dataToSend) : undefined,
    };

    // query params to url
    let urlToSend = url;
    if (method === 'GET' && dataToSend !== null) {
      urlToSend += `?${(new URLSearchParams(dataToSend)).toString()}`;
    }

    const response = await fetch(urlToSend, options);

    const resContentLength = parseInt(response.headers.get('Content-Length'), 10)
      || (response.status === 204 ? 0 : 1);

    // IDEA: add Content-Type check
    // parses JSON response into native JavaScript objects
    const resJSON = resContentLength > 0 ? await response.json() : {};

    if (!response.ok) {
      // if status not 'ok' (not in 200-299 range)
      // default error interceptor (kind of)

      if (response.status === 401) {
        if (url.indexOf(`${appVariables.apiBaseUrl}/auth/token`) > -1) {
          return processResponseLogout();
        }
        if (url.indexOf(`${appVariables.apiBaseUrl}/auth/login`) === -1) {
          return retryFetchAfterTokenRefresh(url, method, data, retryLimit - 1);
        }
      }

      if (typeof resJSON.details === 'string') {
        processSimpleError(resJSON);
      } else if (typeof resJSON.details === 'object' && resJSON.details.length !== undefined) {
        processValidationError(resJSON);
      }

      // throw custom error
      const error = new Error();
      error.response = response;
      error.resJSON = resJSON;
      throw error;
    }

    // add accessToken on success login
    if (resJSON.accessToken !== undefined) {
      processResponseLogin(resJSON);

      if (window.socket !== undefined) {
        const authData = { accessToken: resJSON.accessToken };
        socket.emit('auth:reconnect', authData);
      }
    }

    // remove accessToken on logout
    if (url === `${appVariables.apiBaseUrl}/auth/logout`) {
      processResponseLogout();
    }

    return resJSON;
  };

  const fetchSocket = (eventName, ...args) => new Promise((resolve, reject) => {
    socket.emit(eventName, ...args, async (error, resJSON) => {
      if (error !== null) {
        if (error.statusCode === 401) { // TODO: test it
          // HACK: to refetch user's Access Token and retry current request
          await fetchApi(`${appVariables.apiBaseUrl}/users/me`);

          return fetchSocket(eventName, ...args)
            .then(resolve)
            .catch(reject);
        }

        const errorResJSON = {
          message: error.name,
          details: error.message,
        };
        if (typeof errorResJSON.details === 'string') {
          processSimpleError(errorResJSON);
        } else if (typeof errorResJSON.details === 'object' && errorResJSON.details.length !== undefined) {
          processValidationError(errorResJSON);
        }

        // IDEA: add resJSON to error?
        return reject(error);
      }
      return resolve(resJSON);
    });
  });

  window.fetchApi = fetchApi;
  window.fetchSocket = fetchSocket;
}

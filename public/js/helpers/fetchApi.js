{
  const errorCodeToTitle = (errorCode) => (({
    E_MISSING_OR_INVALID_PARAMS: 'Validation Error',
    E_AUTH_ERROR: 'Authentication Error',
    E_RESOURCE_NOT_FOUND: 'Not Found',
    E_ROUTE_NOT_FOUND: 'Not Found',
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

  const retryFetchAfterTokenRefresh = async (url, method, data, retryLimit) => {
    const refreshData = {
      userId: appLocalStorage.getItem('userId'),
      oldRefreshToken: appLocalStorage.getItem('refreshToken'),
    };
    try {
      await fetchApi(`${appVariables.apiBaseUrl}/auth/token`, 'POST', refreshData);
      return fetchApi(url, method, data, retryLimit);
    } catch {
      location = '/login';
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
      body: dataToSend !== null ? JSON.stringify(dataToSend) : undefined,
    };

    const response = await fetch(url, options);

    const resContentLength = response.headers.get('Content-Length') || 0;

    // parses JSON response into native JavaScript objects
    const resJSON = resContentLength > 0 ? await response.json() : {};

    if (!response.ok) {
      // if status not 'ok' (not in 200-299 range)
      // default error interceptor (kind of)

      if (response.status === 401 && url.indexOf('/login') === -1) {
        return retryFetchAfterTokenRefresh(url, method, data, retryLimit - 1);
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
      appLocalStorage.setItem('userId', resJSON.userId);
      appLocalStorage.setItem('accessToken', resJSON.accessToken);
      appLocalStorage.setItem('refreshToken', resJSON.refreshToken);
    }

    // remove accessToken on logout
    if (resContentLength === 0 && url.indexOf('/logout') > -1) {
      appLocalStorage.removeItem('userId');
      appLocalStorage.removeItem('accessToken');
      appLocalStorage.removeItem('refreshToken');
    }

    return resJSON;
  };

  window.fetchApi = fetchApi;
}

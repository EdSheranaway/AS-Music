import axios from 'axios';

export const logout = () => {
  // Clear all localStorage items
  window.localStorage.clear();
  // Navigate to homepage
  window.location.href = window.location.origin;
};

const refreshToken = async () => {
  try {
    // Logout if there's no refresh token stored or we've managed to get into a reload infinite loop
    if (
      !LOCALSTORAGE_VALUES.refreshToken ||
      LOCALSTORAGE_VALUES.refreshToken === 'undefined' ||
      Date.now() - Number(LOCALSTORAGE_VALUES.timestamp) / 1000 < 1000
    ) {
      console.error('No refresh token available');
      logout();
    }

    if (!LOCALSTORAGE_VALUES.refreshToken) return;
    // Use `/refresh_token` endpoint from our Node app
    const { data } = await axios.get<{
      access_token: string;
      data: unknown;
    }>(`/refresh_token?refresh_token=${LOCALSTORAGE_VALUES.refreshToken}`);

    // Update localStorage values
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.accessToken,
      data.access_token
    );
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.timestamp,
      Date.now().toString()
    );

    // Reload the page for localStorage updates to be reflected
    window.location.reload();
  } catch (e) {
    console.error(e);
  }
};

const hasTokenExpired = () => {
  const { accessToken, timestamp, expireTime } = LOCALSTORAGE_VALUES;
  if (!accessToken || !timestamp) {
    return false;
  }
  const millisecondsElapsed = Date.now() - Number(timestamp);
  return millisecondsElapsed / 1000 > Number(expireTime);
};

// Map for localStorage keys
const LOCALSTORAGE_KEYS: {
  accessToken: string;
  refreshToken: string;
  expireTime: string;
  timestamp: string;
} = {
  accessToken: 'spotify_access_token',
  refreshToken: 'spotify_refresh_token',
  expireTime: 'spotify_token_expire_time',
  timestamp: 'spotify_token_timestamp',
};

// Map to retrieve localStorage values
const LOCALSTORAGE_VALUES: Record<string, string | null> = {
  accessToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.accessToken),
  refreshToken: window.localStorage.getItem(LOCALSTORAGE_KEYS.refreshToken),
  expireTime: window.localStorage.getItem(LOCALSTORAGE_KEYS.expireTime),
  timestamp: window.localStorage.getItem(LOCALSTORAGE_KEYS.timestamp),
};

const getAccessToken = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const queryParams = {
    [LOCALSTORAGE_KEYS.accessToken]: urlParams.get('access_token'),
    [LOCALSTORAGE_KEYS.refreshToken]: urlParams.get('refresh_token'),
    [LOCALSTORAGE_KEYS.expireTime]: urlParams.get('expires_in'),
  };
  const hasError = urlParams.get('error');
  if (
    hasError ||
    hasTokenExpired() ||
    LOCALSTORAGE_VALUES.accessToken === 'undefined'
  ) {
    refreshToken()
      .then()
      .catch((e) => console.log(e));
  }

  // If there is a valid access token in localStorage, use that
  if (
    LOCALSTORAGE_VALUES.accessToken &&
    LOCALSTORAGE_VALUES.accessToken !== 'undefined'
  ) {
    return LOCALSTORAGE_VALUES.accessToken;
  }

  // If there is a token in the URL query params, user is logging in for the first time
  if (queryParams[LOCALSTORAGE_KEYS.accessToken]) {
    // Store the query params in localStorage
    for (const property in queryParams) {
      if (typeof queryParams === 'string') {
        window.localStorage.setItem(property, queryParams[property]);
      }
    }
    // Set timestamp
    window.localStorage.setItem(
      LOCALSTORAGE_KEYS.timestamp,
      Date.now().toString()
    );
    // Return access token from query params
    return queryParams[LOCALSTORAGE_KEYS.accessToken];
  }
};

export const accessToken = getAccessToken();

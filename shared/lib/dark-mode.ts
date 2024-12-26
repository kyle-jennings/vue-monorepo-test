const STORAGE_FILE_NAME = 'test-app';

export function saveDarkModeUserPreference(darkmode: boolean): void {
  const storageObj = JSON.parse(localStorage.getItem(STORAGE_FILE_NAME) || '{}');
  storageObj.darkmode = darkmode;

  localStorage.setItem(STORAGE_FILE_NAME, JSON.stringify(storageObj));
}

export function userDarkModePreference(): boolean {
  const storageObj = JSON.parse(localStorage.getItem(STORAGE_FILE_NAME) || '{}');

  if (storageObj) {
    return storageObj.darkmode || false;
  }

  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }

  return false;
}

export default {
  userDarkModePreference,
  saveDarkModeUserPreference,
};

export const IS_PROD = process.env.NODE_ENV === 'production';
export const REPO_NAME = 'Leetcode-clone-design-fronted';
export const BASE_PATH = IS_PROD ? `/${REPO_NAME}` : '';

export const getAssetPath = (path: string) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_PATH}${cleanPath}`;
};

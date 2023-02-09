const code = {
  BACKEND: { code: 500, type: 'BACKEND' },
  NOT_FOUND: { code: 404, type: 'NOT_FOUND' },
  UNAUTHORIZED: { code: 401, type: 'UNAUTHORIZED' },
  FORBIDDEN: { code: 403, type: 'FORBIDDEN' },
  BAD_REQUEST: { code: 400, type: 'BAD_REQUEST' },
  LOGIN_ERROR: { code: 402, type: 'LOGIN_ERROR' },
  VALIDATION_ERROR: { code: 422, type: 'VALIDATION_ERROR' },
  EXTENSION_NOT_ALLOW: { code: 423, type: 'EXTENSION_NOT_ALLOW' },
  PICTURE_ERROR: { code: 424, type: 'PICTURE_ERROR' },
  FILE_ERROR: { code: 425, type: 'FILE_ERROR' },
  // Custom
  USER_NOT_FOUND: { code: 1001, type: 'USER_NOT_FOUND' },
  WRONG_PASSWORD: { code: 1002, type: 'WRONG_PASSWORD' },
  USER_UNACTIVED: { code: 1003, type: 'USER_UNACTIVED' },
  TOKEN_ERROR: { code: 1004, type: 'TOKEN_ERROR' },
  USER_EXISTED: { code: 1005, type: 'USER_EXISTED' },
  TOKEN_EXPIRED: { code: 1007, type: 'TOKEN_EXPIRED' },
  PERMISSION_NOT_FOUND: { code: 1008, type: 'PERMISSION_NOT_FOUND' },
  PASSWORD_ERROR: { code: 1014, type: 'PASSWORD_ERROR' },
  RECOVERY_EXPIRED: { code: 1016, type: 'RECOVERY_EXPIRED' },
  PERMISSION_EXISTED: { code: 1020, type: 'PERMISSION_EXISTED' },
  ROLE_EXISTED: { code: 1021, type: 'ROLE_EXISTED' },
  EMAIL_NOT_EXIST: { code: 1041, type: 'EMAIL_NOT_EXIST' },
  ROLE_NOT_FOUND: { code: 1042, type: 'ROLE_NOT_FOUND' },
  ROLE_ORIGIN: { code: 1045, type: 'ROLE_ORIGIN' },
  DATE_TZ: { code: 1046, type: 'DATE_TZ' },
  BLOCKING: { code: 1057, type: 'BLOCKING' },
  EMPTY: { code: 1058, type: 'EMPTY' },
  USER_NOT_ALLOW: { code: 1070, type: 'USER_NOT_ALLOW' },
  PORTFOLIO_NOT_FOUND: { code: 1071, type: 'PORTFOLIO_NOT_FOUND' },
  PORTFOLIO_EXISTED: { code: 1072, type: 'PORTFOLIO_EXISTED' },
  ORDER_NOT_FOUND: { code: 1071, type: 'ORDER_NOT_FOUND' },
  ORDER_EXISTED: { code: 1072, type: 'ORDER_EXISTED' },
};
export default code;

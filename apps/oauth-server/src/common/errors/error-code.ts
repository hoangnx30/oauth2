export enum ErrorCode {
  Unknown = 'ERROR_0',
  InvalidOAuthClient = 'ERROR_1',
  UserNameOrEmailExists = 'ERROR_2',
  EmptyAccessToken = 'ERROR_3',
  InvalidJwt = 'ERROR_4',
  InvalidCredentials = 'ERROR_5',
  InvalidOrExpiredCode = 'ERROR_6',
  InvalidRedirectURI = 'ERROR_7',
  NotSupportedCodeChallengeMethod = 'ERROR_8',
  InvalidCodeVerifier = 'ERROR_9',
  InvalidOAuthRequest = 'ERROR_10',
  OAuthRequestExpired = 'ERROR_11'
}

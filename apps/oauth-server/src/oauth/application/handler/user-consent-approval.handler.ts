import {Inject} from '@nestjs/common'
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'

import {UnitOfWorkService} from '@/common/drizzle'
import {ErrorCode, HttpException} from '@/common/errors'
import DateTimeUtils from '@/common/utils/datetime'

import {OAuthAuthorizationApprovalDomain} from '@/oauth/domain/oauth-authorization-approval'
import {OAuthCodeDomain} from '@/oauth/domain/oauth-code'
import {
  OAUTH_AUTHORIZATION_APPROVAL_REPOSITORY_TOKEN,
  OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN,
  OAUTH_CODE_REPOSITORY_TOKEN
} from '@/oauth/inject-token'

import {UserConsentApprovalCommand, UserConsentApprovalResult} from '../commands'
import {
  IOAuthAuthorizationApprovalRepository,
  IOAuthAuthorizationRequestRepository,
  IOAuthCodeRepository
} from '../interfaces'

@CommandHandler(UserConsentApprovalCommand)
export class UserConsentHandler implements ICommandHandler<UserConsentApprovalCommand> {
  constructor(
    @Inject(OAUTH_AUTHORIZATION_REQUEST_REPOSITORY_TOKEN)
    private readonly oauthAuthorizationRequestRepository: IOAuthAuthorizationRequestRepository,
    @Inject(OAUTH_CODE_REPOSITORY_TOKEN)
    private readonly oauthCodeRepo: IOAuthCodeRepository,
    @Inject(OAUTH_AUTHORIZATION_APPROVAL_REPOSITORY_TOKEN)
    private readonly oauthAuthorizationApprovalRepository: IOAuthAuthorizationApprovalRepository,

    private readonly unitOfWorkService: UnitOfWorkService
  ) {}

  async execute(command: UserConsentApprovalCommand): Promise<UserConsentApprovalResult> {
    const {oauthRequestId} = command

    const oauthRequest = await this.oauthAuthorizationRequestRepository.findById(oauthRequestId)
    console.log(oauthRequest)
    if (!oauthRequest || oauthRequest?.status !== 'authenticated') {
      throw new HttpException(ErrorCode.InvalidOAuthRequest)
    }

    if (!DateTimeUtils.utc(oauthRequest.expiresAt).isAfter(DateTimeUtils.utc().toDate())) {
      throw new HttpException(ErrorCode.OAuthRequestExpired)
    }

    oauthRequest.status = 'approved'

    const oauthCode = new OAuthCodeDomain({
      oauthRequestId: oauthRequest.id,
      clientId: oauthRequest.clientId,
      userId: oauthRequest.userId
    })
    oauthCode.generateCode()
    oauthCode.initExpiresAt()

    const oauthApproval = new OAuthAuthorizationApprovalDomain({
      oauthRequestId: oauthRequest.id,
      approvedScopes: oauthRequest.scope,
      userId: oauthRequest.userId
    })

    await this.unitOfWorkService.execute(async () => {
      await this.oauthAuthorizationRequestRepository.save(oauthRequest)
      await this.oauthCodeRepo.save(oauthCode)
      await this.oauthAuthorizationApprovalRepository.save(oauthApproval)
    })

    return {
      redirectUrl: `${oauthRequest.redirectUri}?code=${oauthCode.code}&state=${oauthRequest.state}`
    }
  }
}

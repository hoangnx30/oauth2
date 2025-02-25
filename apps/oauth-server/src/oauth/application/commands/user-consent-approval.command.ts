import {Command} from '@nestjs/cqrs'

export type UserConsentApprovalResult = {
  redirectUrl: string
}
export class UserConsentApprovalCommand extends Command<UserConsentApprovalResult> {
  constructor(public readonly oauthRequestId: number) {
    super()
  }
}

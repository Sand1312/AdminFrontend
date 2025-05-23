declare namespace API {
  type CurrentUser = {
    name?: string;
    userid?: string;
    email?: string;
    // notifyCount?: number;
    // unreadCount?: number;
    access?: string;
    avatar?: string;
    // phone?: string;
  };
  type LoginResult = {
    status?: string;
    result?: {
      userId?: number;
      token?: string;
      refreshToken?: string;
    };
  };

  type LoginParams = {
    email?: string;
    password?: string;
    autoLogin?: boolean;
  };

  type UserCreateParams = {
    email?: string;
    username?: string;
    password?: string;
  };

  type UserCreateResult = {
    status?: string;
  };

  type SendOtpParams = {
    email?: string;
  };

  type SendOtpResult = {
    status?: string;
  };

  type ChangePasswordParams = {
    email?: string;
    currentPassword?: string;
    newPassword?: string;
    otp?: string;
  };

  type ChangePasswordResult = {
    status?: string;
  };
}

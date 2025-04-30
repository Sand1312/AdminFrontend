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
}

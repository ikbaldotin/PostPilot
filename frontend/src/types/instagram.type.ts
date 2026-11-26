export interface InstagramAccount {
  id: string;
  instagramUserId: string;
  username: string;
  tokenExpiresAt: string;
  createdAt: string;
}

export interface InstagramConnectResponse {
  success: boolean;
  message: string;
  account: InstagramAccount;
}

export interface InstagramStatusResponse {
  success: boolean;
  connected: boolean;
  account: InstagramAccount | null;
}

export interface InstagramDisconnectResponse {
  success: boolean;
  message: string;
}

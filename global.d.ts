type NumberAuthCallback = (result: {
  code?: number | string;
  msg?: string;
  spToken?: string;
}) => void;

type PhoneNumberServerInstance = {
  checkEnvAvailable: () => {
    isPc?: boolean;
    isWifi?: boolean;
  };
  checkLoginAvailable: (options: {
    accessToken: string;
    jwtToken: string;
    success: NumberAuthCallback;
    error: NumberAuthCallback;
    timeout?: number;
  }) => void;
  getLoginToken: (options: {
    success: NumberAuthCallback;
    error: NumberAuthCallback;
    watch?: (status: unknown, data: unknown) => void;
    authPageOption?: Record<string, unknown>;
  }) => void;
};

type PhoneNumberServerCtor = new () => PhoneNumberServerInstance;

declare global {
  interface Window {
    PhoneNumberServer?: PhoneNumberServerCtor;
  }
}

export {};

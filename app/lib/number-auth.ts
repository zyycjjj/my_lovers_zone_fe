"use client";

const SDK_SRC = "/vendor/numberAuth-web-sdk.js";

type NumberAuthTokenInfo = {
  accessToken: string;
  jwtToken: string;
};

type NumberAuthSdkResult = {
  code?: number | string;
  msg?: string;
  spToken?: string;
};

let sdkPromise: Promise<PhoneNumberServerInstance> | null = null;

function ensureSdkScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("当前环境不支持号码认证"));
  }

  if (window.PhoneNumberServer) {
    return Promise.resolve(window.PhoneNumberServer);
  }

  if (!sdkPromise) {
    sdkPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector(
        `script[data-memory-sdk="number-auth"]`,
      ) as HTMLScriptElement | null;

      if (existing) {
        existing.addEventListener("load", () => {
          if (window.PhoneNumberServer) {
            resolve(window.PhoneNumberServer);
          } else {
            reject(new Error("号码认证 SDK 加载完成，但实例未找到"));
          }
        });
        existing.addEventListener("error", () => {
          reject(new Error("号码认证 SDK 加载失败"));
        });
        return;
      }

      const script = document.createElement("script");
      script.src = SDK_SRC;
      script.async = true;
      script.dataset.memorySdk = "number-auth";
      script.onload = () => {
        if (window.PhoneNumberServer) {
          resolve(window.PhoneNumberServer);
          return;
        }
        reject(new Error("号码认证 SDK 已加载，但全局对象不存在"));
      };
      script.onerror = () => {
        reject(new Error("号码认证 SDK 加载失败"));
      };
      document.body.appendChild(script);
    });
  }

  return sdkPromise;
}

function asErrorMessage(result: unknown) {
  if (result && typeof result === "object" && "msg" in result) {
    return String(result.msg || "号码认证失败");
  }
  return "号码认证失败";
}

export async function getNumberAuthEnvironment() {
  const Sdk = await ensureSdkScript();
  const server = new Sdk();
  return server.checkEnvAvailable();
}

export async function getSpToken(tokenInfo: NumberAuthTokenInfo) {
  const Sdk = await ensureSdkScript();
  const server = new Sdk();

  await new Promise<void>((resolve, reject) => {
    server.checkLoginAvailable({
      accessToken: tokenInfo.accessToken,
      jwtToken: tokenInfo.jwtToken,
      success: () => resolve(),
      error: (result) => reject(new Error(asErrorMessage(result))),
    });
  });

  return new Promise<NumberAuthSdkResult>((resolve, reject) => {
    server.getLoginToken({
      success: (result) => {
        if (result?.spToken) {
          resolve(result);
          return;
        }
        reject(new Error(asErrorMessage(result)));
      },
      error: (result) => reject(new Error(asErrorMessage(result))),
      watch: () => {},
      authPageOption: {
        navText: "手机号快捷登录",
        subtitle: "先把登录接稳，再开始第一轮内容生成",
        btnText: "确认并继续",
        agreeSymbol: "、",
        privacyBefore: "我已阅读并同意",
        isDialog: true,
        manualClose: true,
      },
    });
  });
}

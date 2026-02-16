export type InstallAvailability =
  | "prompt"
  | "ios-manual"
  | "chromium-manual"
  | "installed"
  | "unsupported";

export interface InstallContext {
  hasDeferredPrompt: boolean;
  isIos: boolean;
  isStandalone: boolean;
  isChromium?: boolean;
}

export function getInstallAvailability(context: InstallContext): InstallAvailability {
  if (context.isStandalone) {
    return "installed";
  }

  if (context.hasDeferredPrompt) {
    return "prompt";
  }

  if (context.isIos) {
    return "ios-manual";
  }

  if (context.isChromium) {
    return "chromium-manual";
  }

  return "unsupported";
}

export function isIosDevice(userAgent: string): boolean {
  return /iPad|iPhone|iPod/i.test(userAgent);
}

export function isChromiumDevice(userAgent: string): boolean {
  return /(Chrome|CriOS|Edg|OPR)/i.test(userAgent);
}

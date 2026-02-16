export type InstallAvailability = "prompt" | "ios-manual" | "installed" | "unsupported";

export interface InstallContext {
  hasDeferredPrompt: boolean;
  isIos: boolean;
  isStandalone: boolean;
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

  return "unsupported";
}

export function isIosDevice(userAgent: string): boolean {
  return /iPad|iPhone|iPod/i.test(userAgent);
}

/**
 * @file build-info.ts
 * @description Auto-generated build & version information for App Settings.
 */

export interface BuildInfo {
  appVersion: string;
  gitBranch: string;
  commitHash: string;
  lastBuildDate: string;
}

export const BUILD_INFO: BuildInfo = {
  appVersion: 'v0.2.0',
  gitBranch: 'main',
  commitHash: 'bab4951',
  lastBuildDate: new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
};

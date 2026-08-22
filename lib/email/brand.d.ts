// Types for the plain-.mjs brand templates, which are shared with the CLI
// scripts and therefore stay untyped JavaScript.
export declare const SITE_URL: string;
export declare function welcomeTemplateHtml(): string;
export declare function weeklyTemplateHtml(): string;
export declare function renderIssueBody(issue: unknown): string;
export declare function renderIssueText(
  issue: unknown,
  opts?: { unsubUrl?: string; browserUrl?: string }
): string;

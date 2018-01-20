'use strict';

import * as querystring from 'querystring';
import * as gitUrlParse from 'git-url-parse';
import { workspace } from 'vscode';

class BaseProvider {
  gitUrl: gitUrlParse.GitUrl;

  constructor(gitUrl) {
    this.gitUrl = gitUrl;
  }

  get baseUrl() {
    return this.gitUrl.toString().replace(/(\.git)$/, '');
  }

  /**
   * Get the Web URL.
   *
   * @param {string} branch
   * @param {string} filePath The file path relative to repository root, beginning with '/'.
   * @param {number} line
   * @param {number} endLine The last line in a multi-line selection
   * @return {string} The URL to be opened with the browser.
   */
  webUrl(branch, filePath, line, endLine) {
    return '';
  }
  prUrl(branch, filePath, line) {
    return '';
  }
  prAPI(branch) {
    return null;
  }
  prCommentsAPI(branch, filePath) {
    return null;
  }
}

class GitHub extends BaseProvider {
  webUrl(branch, filePath, line, endLine) {
    if (filePath) {
      return (
        `${this.baseUrl}/blob/${branch}/${filePath}` +
        (line ? '#L' + line : '') +
        (endLine ? '-L' + endLine : '')
      );
    }
    return `${this.baseUrl}/tree/${branch}`;
  }
  prAPI(branch) {
    return `${this.baseUrl}/pull/new/${branch}`;
  }
}

class Bitbucket extends BaseProvider {
  webUrl(branch, filePath, line, endLine) {
    return (
      `${this.baseUrl}/src/${branch}/` +
      (filePath ? `${filePath}` : '') +
      (line ? `#cl-${line}` : '')
    );
  }

  prAPI(branch) {
    return `${this.baseUrl}/pull-requests/new?source=${branch}`;
  }
}

class BitbucketServer extends BaseProvider {
  /**
   * projectKey is specific to bitbucket server.
   */
  get projectKey() {
    return this.gitUrl.full_name.split('/')[0];
  }

  webUrl(branch, filePath, line, endLine) {
    return (
      `${this.baseUrl}/browse/${filePath}` +
      (branch ? `?at=refs%2Fheads%2F${branch}` : '') +
      (line ? `#${line}` : '')
    );
  }
  prUrl(branch, filePath, line) {
    return `${pullRequestUrl}/diff#${filePath}?T${line}`;
  }
  prAPI(branch) {
    return `${domainUrl}/rest/api/1.0/projects/${this.projectKey}/repos/${
      this.gitUrl.name
      }/pull-requests/195`;
  }
  prCommentsAPI(branch, filePath) {
    return this.prAPI(branch) + `/comments?path=${filePath}`;
  }
}

class GitLab extends BaseProvider {
  webUrl(branch, filePath, line, endLine) {
    if (filePath) {
      return (
        `${this.baseUrl}/blob/${branch}/` +
        (filePath ? `${filePath}` : '') +
        (line ? `#L${line}` : '')
      );
    }
    return `${this.baseUrl}/tree/${branch}`;
  }
  prAPI(branch) {
    //https://docs.gitlab.com/ee/api/merge_requests.html#create-mr
    //`${this.baseUrl}/merge-requests/new?source_branch=${branch}&target_branch=${????}&title=${????}`
    throw new Error(`Doesn't support Merge Request from URL in GitLab yet`);
  }
}

class VisualStudio extends BaseProvider {
  get baseUrl() {
    return `https://${this.gitUrl.resource}${this.gitUrl.pathname}`.replace(
      /\.git/,
      ''
    );
  }

  webUrl(branch, filePath, line, endLine) {
    let query = {
      version: `GB${branch}`
    };
    if (filePath) {
      query['path'] = filePath;
    }
    if (line) {
      query['line'] = line;
    }
    return `${this.baseUrl}?${querystring.stringify(query)}`;
  }

  prAPI(branch) {
    throw new Error(
      `Doesn't support Merge Request from URL in VisualStudio.com yet`
    );
  }
}

const providerType: string = workspace
  .getConfiguration('codeReviewForGit')
  .get('providerType', 'unknown');
const domainUrl = workspace
  .getConfiguration('codeReviewForGit')
  .get('domainUrl', null);
const pullRequestUrl = workspace
  .getConfiguration('codeReviewForGit')
  .get('pullRequestUrl', null);

/**
 * Get the Git provider of the remote URL.
 *
 * @param {string} remoteUrl
 * @return {BaseProvider|null}
 */
export function gitProvider(remoteUrl) {

  const gitUrl = gitUrlParse(remoteUrl);

  switch (providerType) {
    case 'bitbucketserver':
      return new BitbucketServer(gitUrl);

    case 'bitbucket':
      return new Bitbucket(gitUrl);

    case 'gitlab':
      return new GitLab(gitUrl);

    case 'visualstudio':
      return new VisualStudio(gitUrl);

    default:
      throw new Error('unknown Provider');
  }
}

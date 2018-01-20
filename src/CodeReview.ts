'use strict';

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { copy } from 'copy-paste';
import * as findParentDir from 'find-parent-dir';
import * as ini from 'ini';
import * as gitRev from 'git-rev-2';
import * as open from 'open';
import { gitProvider } from './gitProvider';
import * as request from 'request-promise';

export class CodeReview {
  window;
  commands;
  workspace;
  position;
  configPath: string;
  config: Object;

  constructor() {
    this.window = vscode.window;
    this.commands = vscode.commands;
    this.workspace = vscode.workspace;
    this.position = vscode.Position;
  }

  private getGitProvider(filePath, line) {

    let repoDir = findParentDir.sync(filePath, '.git');
    if (!repoDir) {
      throw 'Cant locate .git repository for this file';
    }

    this._findGitConfig(repoDir)
      .then(path => this._readConfigFile(path))
      .then(config => {
        this._getBranch(repoDir)
          .then(branch => {
            var provider;
            var remoteUri = this.getRemoteUri(branch, config);
            if (!remoteUri) {
              this.window.showWarningMessage(`No remote found on branch.`);
              return;
            }
            try {
              provider = gitProvider(remoteUri);
            }
            catch (e) {
              let errmsg = e.toString();
              this.window.showWarningMessage(`Unknown Git provider. ${errmsg}`);
              return;
            }

            let subdir = repoDir !== filePath ? path.relative(repoDir, filePath) : '';
            if (provider) {
              open(provider.prUrl(branch, subdir, line));
            }
          });
      });
  }

  private getRemoteUri(branch, config) {
    var remoteUri, configuredBranch, remoteName;
    // Check to see if the branch has a configured remote
    configuredBranch = config[`branch "${branch}"`];
    if (configuredBranch) {
      // Use the current branch's configured remote
      remoteName = configuredBranch.remote;
      remoteUri = config[`remote "${remoteName}"`].url;
    }
    else {
      const remotes = Object.keys(config).filter(k => k.startsWith('remote '));
      if (remotes.length > 0) {
        remoteUri = config[remotes[0]].url;
      }
    }
    return remoteUri;
  }

  private _getBranch(repoDir) {
    return new Promise((resolve, reject) => {
      gitRev.branch(repoDir, (branchErr, branch) => {
        if (branchErr || !branch)
          branch = 'master';
        resolve(branch);
      });
    })
  }

  addComment() {
    var editor = this.window.activeTextEditor;
    let filePath = editor.document.uri.fsPath;
    var line = editor.selection.anchor.line + 1;

    this.getGitProvider(filePath, line);
  }

  _findGitConfig(repoDir) {
    return new Promise((resolve, reject) => {
      if (this.configPath) {
        resolve(this.configPath);
        return;
      }

      fs.lstat(path.join(repoDir, '.git'), (err, stat) => {
        if (err) {
          reject(err);
        }
        if (stat.isFile()) {
          // .git may be a file, similar to symbolic link, containing "gitdir: <relative path to git dir>""
          // this happens in gitsubmodules
          fs.readFile(path.join(repoDir, '.git'), 'utf-8', (err, data) => {
            if (err) {
              reject(err);
            }
            var match = data.match(/gitdir: (.*)/)[1];
            if (!match) {
              reject('Unable to find gitdir in .git file');
            }
            this.configPath = path.join(repoDir, match, 'config');
            resolve(this.configPath);
          });
        } else {
          this.configPath = path.join(repoDir, '.git', 'config');
          resolve(this.configPath);
        }
      });
    });
  }

  _readConfigFile(path) {
    return new Promise((resolve, reject) => {
      if (this.config) {
        resolve(this.config);
        return;
      }

      fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        }
        this.config = ini.parse(data);
        resolve(this.config);
      });
    });
  }

  _loadPRComments(api) {
    console.log('path', api);
    return request({
      simple: false,
      method: 'GET',
      uri: api,
      json: true,
      headers: {
        authorization: '',
        'cache-control': 'no-cache'
      }
    });
  }
}

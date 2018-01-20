# code-review-for-git README

"code-review-for-git" is a VSCode extension for doing code reviews. The extension let you navigate from the current active file and line number in VSCode to its respective location on a configured pull request in browser. 

This is currently supported for BitBucket Server ONLY. Other git service providers will be added.

## Requirements

You should have an open pull request with a web url where you want to capture review comments.

## Extension Settings

This extension has the following settings:

* `codeReviewForGit.pullRequestUrl`: provide the complete bitbucket server url to the pull-request you want to use for code review.

## Install

**Tested with VsCode 1.19.2  

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.

![installation](screenshots/install.png?raw=true "installation")

Simply pick the `Code Review for Git` extension from the list

## Install Manual

### Mac & Linux

```sh
cd $HOME/.vscode/extensions
git clone https://github.com/jaichandra/vscode-code-review-for-git.git
cd vscode-code-review-for-git
npm install
```

### Windows

```sh
cd %USERPROFILE%\.vscode\extensions
git clone https://github.com/jaichandra/vscode-code-review-for-git.git
cd vscode-code-review-for-git
npm install
```

## Usage

### Command

Press <kbd>F1</kbd> and type `Add Code Comment`.

### Keybord Shortcut

 Press <kbd>Ctrl+L G</kbd> to activate.

### Context menu

Right click on a line and choose `Add Code Comment`.

![context](screenshots/context-menu.png?raw=true "Context menu options")

### Configure custom github domain

Add following line into workspace settings;

```js
{
  "codeReviewForGit.pullRequestUrl":"your pull-request url",
}
```

## Credits

A lot is inspired and picked from below extension.
### [vscode-open-in-github](https://github.com/ziyasal/vscode-open-in-github)

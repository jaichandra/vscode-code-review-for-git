# code-review-for-git README

`code-review-for-git` is a VS Code extension for doing code reviews. The extension let you navigate from the current active file and line number in VS Code to its respective location on a configured pull request in browser. 

This is currently supported for BitBucket Server ONLY. Other git service providers will be added.

## Requirements

You should have an open pull request with a web url where you want to capture review comments.

## Extension Settings

This extension has the following settings:

* `codeReviewForGit.pullRequestUrl`: provide the complete bitbucket server url to the pull-request you want to use for code review.

## Install

**Tested with VS Code 1.19.2  

Press <kbd>F1</kbd> and narrow down the list commands by typing `extension`. Pick `Extensions: Install Extension`.

![install](https://user-images.githubusercontent.com/302617/35185001-f426afba-fdca-11e7-9f5d-807ffe17e20a.png)

Simply pick the `Code Review for Git` extension from the list.

## Install from VSIX

Download the `.vsix` file from the [Releases](https://github.com/jaichandra/vscode-code-review-for-git/releases) section.

```sh
code --install-extension /path/to/code-review-for-git-<version>.vsix
```
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

<img width="1280" alt="screenshot 2018-01-20 10 03 36" src="https://user-images.githubusercontent.com/302617/35184886-45dd0b9e-fdc9-11e7-9c4a-597d818be9a0.png">

### Keybord Shortcut

 Press <kbd>Ctrl+L G</kbd> to activate.

### Context menu

Right click on a line and choose `Add Code Comment`.

<img width="281" alt="screenshot 2018-01-20 10 13 00" src="https://user-images.githubusercontent.com/302617/35184978-881e0db8-fdca-11e7-971f-594a2ce1013e.png">


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

## commitk

![](https://github.com/polarove/commitk/images/demo.gif)

## A tool to help you write commit messages exclusively for Chinese 'baby'

-   Follows [Conventional commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83) by default

-   default language: Chinese

-   es module supported

-   zero abstracted

## Get started

```sh
npm i commitk -g
```

## How to use

Type this in your shell👇

```sh
ck
```

And then follow the instructions. (need translations?)

Don't forget to stage changes before your commits using `git add file-name`

## Customization

Modify `src/steps.js` > `types`

It's heavily suggested **NOT** to modify code in `src/index.js`

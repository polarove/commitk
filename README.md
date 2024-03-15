# commitk

[English](https://github.com/polarove/commitk/blob/master/README_en-US.md)

![](https://github.com/polarove/commitk/blob/master/demo.gif)

# 专为中国宝宝体制打造的命令行提交消息规范工具

默认遵循[约定式提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83)，当然你也可以直接改源代码

全中文

es module

0 抽象，过程流代码

## 安装

```sh
npm i commitk -g
```

## 使用

运行这个命令

```sh
ck
```

然后根据提示即可

每次提交前记得运行 `git add 文件名` 保存更改

## 自定义

修改 `src/steps.js`  > `types`数组即可

建议不要修改`src/index.js`

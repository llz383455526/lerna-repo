# 常用命令

## lerna init

1. 执行: npm i lerna -g，全局安装lerna
1. 执行：lerna init -i ，使用independent模式初始化项目

## lerna create

使用lerna create package-name快速创建module

```shell
# 该命令会调用npm init，在packages目录下快速初始化一个名称为module-4的工作目录
lerna create module-4
```

## lerna add

1. 在packages目录下新增module-1、module-2、module-3，一共3个package。
  此时目录结构如下：

    ```shell
    + packages
      + module-1
          - package.json  # name: @llz/module-1
      + module-2
          - package.json  # name: @llz/module-2
      + module-3
          - package.json  # name: @llz/module-3

    + lerna.json
    + package.json
    ```

1. 我们的需求如下： moudle-3依赖module-2和module-1, module-2依赖module-1, 所有module都依赖webpack
    > 有以下几种方式实现我们的需求

    ```shell
    #方法1, 进入项目根目录(必须)，执行以下命令：
    lerna add webpack --dev
    lerna add @llz/module-1
    lerna add @llz/module-2 packages/module-3

    # 方法2，在任意目录都可执行
    lerna add webpack --dev
    lerna add @llz/module-1 --scope=@llz/module-2
    lerna add @llz/module-1 --scope=@llz/module-3
    lerna add @llz/module-2 --scope=@llz/module-3

    ```

lerna add不只是会添加依赖关系到package.json，还会执行npm install来安装依赖,此时在每个module里都会有自己的node_modules目录

## lerna ls

在上一步操作中我们通过lerna add为每个module都添加了依赖关系，我们可以通过lerna ls --graph来查看最终的依赖关系是否符合我们的需求

## lerna bootstrap

基于上一步的代码，如果别人clone了我的代码进行开发，他该如何安装依赖呢。答案是执行lerna bootstrap

执行命令后的提示如下：

```shell
apple$ lerna bootstrap
lerna notice cli v4.0.0
lerna info versioning independent
lerna info Bootstrapping 3 packages
lerna info Installing external dependencies # 先安装了外部依赖
lerna info Symlinking packages and binaries # 为项目内部依赖和可执行文件添加软连接
lerna success Bootstrapped 3 packages
```

有人可能会问了，我直接去packages下每个module里执行npm install不也可以吗？
答案是不可以。
因为对于外部依赖，npm install是可以安装的，但是对于module之间的依赖它也认为是外部依赖从而去网上下载安装。导致在开发过程中，如果修改了module-1,module-2并不会引用到最新的代码。

## lerna clean

与lerna bootstrap 是安装依赖相反，lerna clean会将packages下所有module的node_modules清除掉。

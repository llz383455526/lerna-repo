# lerna init

1. 执行: npm i lerna -g，全局安装lerna
1. 执行：lerna init -i ，使用independent模式初始化项目

# lerna add

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

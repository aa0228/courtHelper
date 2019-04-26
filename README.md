# courtHelper
  electron技术做的一个小Demo。主要功能是用户在访问后台服务器访问失败时（登录时会首先访问后台服务器，服务器访问失败时会读取本地文件，本案例为json文件，进行登录），修改用户信息（修改本地的json文件内容）。
1.主要就是主进程与渲染进程的交互，以及创建系统托盘，设置图标，具体的功能带丰富。
2.系统托盘图标闪烁 (设置了定时)，之后计划做成新通知来时的，图标闪烁。(此此部分暂时注释了)
3.修改注册表，用于桌面程序的开机自启(此部分暂时注释掉了，有待测试)
4.写了一个进程崩溃，需要测试一下。


环境要求：
1.安装node.js(新版本的自带npm，也可以使用淘宝NPM镜像。
你可以使用淘宝定制的 cnpm (gzip 压缩支持) 命令行工具代替默认的 npm:
$ npm install -g cnpm --registry=https://registry.npm.taobao.org
(或)也可以安装yarn，使用yarn管理模块。
 npm install -g yarn
 yarn install
 2.安装electron和electron-forge(electron-forge是快速构建的手脚架）
 3.切换到courtHelper的文件夹下(在命令行下），也可以导入到vscode中，利用vscode调试和运行。
 cd courtHelper
 yarn (或者npm install)
 electron-forge start
 
 
附上：
先安装node.js  , 网址  https://nodejs.org/en/download/
安装教程参考 ：https://www.cnblogs.com/zhouyu2017/p/6485265.html
注意：环境配置
说明：这里的环境配置主要配置的是npm安装的全局模块所在的路径，以及缓存cache的路径，之所以要配置，是因为以后在执行类似：npm install express [-g] （后面的可选参数-g，g代表global全局安装的意思）的安装语句时，会将安装的模块安装到【C:\Users\用户名\AppData\Roaming\npm】路径中，占C盘空间。
例如：我希望将全模块所在路径和缓存路径放在我node.js安装的文件夹中，则在我安装的文件夹【D:\Develop\nodejs】下创建两个文件夹【node_global】及【node_cache】如下图：
创建完两个空文件夹之后，打开cmd命令窗口，输入

npm config set prefix "D:\Develop\nodejs\node_global"
npm config set cache "D:\Develop\nodejs\node_cache"
2.npm install -g cnpm --registry=https://registry.npm.taobao.org
3.cnpm install -g electron
4.cnpm install -g electron-forge
5.安装git,才能使用electron-forge快速构建项目
或者利用electron可以打开
D:\UsefulSoftwares\NodeJS\node_global\node_modules\electron\dist\electron.exe  项目名(前面的路径取决于自己electron.exe的安装路径)




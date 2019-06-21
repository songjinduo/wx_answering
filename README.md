# wx_answering
微信的答题小程序（包含答题，收集错题，收藏夹，题库刷题以及个人答题情况可视化展示）

##### 代码目录
* app.js——主文件的后台代码
* app.json——控制文件主窗口的格式、名称以及各个文件的路径调用
* pages——存放界面文件（初始主界面）
  >* image——存放背景文件
  >* index——初始主界面
  >* logs——日志界面（已隐藏，不显示）
* packageA——存放答题界面文件
  >* image——存放背景文件
  >* utils——配置文件，包括数据存放，界面数据的处理代码
  >* pages——各个答题界面文件
    >>* collection——收藏夹功能
    >>* common——公共界面代码
    >>* logs——日志界面（已隐藏，不显示）
    >>* prc_all——题目刷题功能
    >>* python(2、3、4、5）——随机选择题目并提供答题界面与功能
    >>* wrong_set——错题搜集功能
* packageB——存放有关Echarts可视化功能的界面
  >* ec-canvas——Echarts图表的库文件
  >* image——存放背景图片
  >* pages——存放使用Echarts库的界面文件
    >>* echarts——可视化用户答题正确率与错误率的Echarts饼图界面
 
##### 运行环境
* 微信web开发者工具

##### 运行截图展示

* 主界面

![image](https://github.com/songjinduo/wx_answering/blob/master/images/1.jpg)

* 随机答题界面

![image](https://github.com/songjinduo/wx_answering/blob/master/images/2.jpg)

* 题库刷题界面

![image](https://github.com/songjinduo/wx_answering/blob/master/images/3.jpg)

* 错题集界面

![image](https://github.com/songjinduo/wx_answering/blob/master/images/4.jpg)

* 收藏夹界面

![image](https://github.com/songjinduo/wx_answering/blob/master/images/5.jpg)

* 个人答题情况可视化界面

![image](https://github.com/songjinduo/wx_answering/blob/master/images/6.jpg)

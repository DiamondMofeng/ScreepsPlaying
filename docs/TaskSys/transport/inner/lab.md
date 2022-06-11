lab的矿物上限为3000     

lab的种类：     
- boost - 存放boost原理，暂定1个
- raw - 存放原材料，一般为2个
- reaction - 存放反应产物，剩下的全是
  
发布任务：  

room memory中发布总命令：   

```json
"type" : "reaction"/"reverse",
"target" : "产品类型(如GH)"
```

然后根据此指令生成任务：  


- reaction ：
  ```json
  "type" : "reaction",
  "target" : "OH"
  ```
  则对不同种类lab进行检测并发布任务：

  若raw内原料不足1000，则进行填充。   
  若reaction内产物>2000，则进行收取。

- reverse

  分解任务  
  若raw内原料大于2000，则进行收取。   
  若reaction内产物<1000，则进行补充。
  

为了方便，还应有一个任务为清空所有lab(包括/不包括boost类型的)

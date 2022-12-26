# Task Publisher

!!! 期待重构。现在的格式感觉比较臃肿      
后期希望分离到各自建筑的控制代码中


TODO: 为任务加一项参数，控制是否允许填装超过targetCapacity

# 需要的搬运任务

## 基础部分

主要与能量有关

### 基础填充能量

- [x] 填充spawn, extension
- [x] 填充tower


### Container

- [x] 将能量从source container转移至controller container
- [x] 将能量从source container转移至storage

- [ ] 将能量从storage转移到controller container

## 其他

### Lab

- [x] 维持Lab最少有1200单位能量

  #### 合成相关

- [ ] 根据房间任务，清空资源不符合条件的Lab中的化合物
- [ ] 根据房间任务，提供原料
- [ ] 根据房间任务，收获产物

  #### Boost相关

- [ ] 根据房间任务，提供原料

### PowerSpawn

- [ ] 维持PowerSpawn最少有2000单位能量
  
- [ ] 根据房间任务，决定是否提供power

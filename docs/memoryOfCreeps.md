# Memory of creeps

注：建议所有的creep都加入以下3项：  

spawnName,  **已加入spawnByMinNumber**  
spawnRoom,  **已加入spawnByMinNumber**  
workRoom,  **已加入spawnByMinNumber，默认为spawnRoom**  
此外，应该所有的creep都有role吧。。


## Remote_harvester

改为仅提供workRoom，creep自己从房间memory里找source,container位置

~remote_harvester_containerID~  
~remote_harvester_sourceID~

## Remote_carrier

remote_carrier_fromContainerID  
remote_carrier_toContainerID  

## Remote_reserver

只要workRoom就行了

TODO: 加上remote_reserver_workPos
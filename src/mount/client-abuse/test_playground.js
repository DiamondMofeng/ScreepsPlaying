/* Posted April 4th, 2018 by @semperrabbit */
/*
 * require('util.inject.RoomTracker');
 *
 * Allows for the retrieval of rooms currently being viewed in the client from in-game code.
 *
 * injectRoomTracker() will be called on each global reload. To manually inject into a client after a global reset, or upon opening an additional tab,
 *   call forceInjectRoomTracker().
 *     
 * Use `getViewedRooms()` each tick to retrieve any viewed rooms. It returns an array or rooms.
 */

import { evalBody_harvester } from "./spawn_evalBody";
import { body } from "@/utils/util_helper";

const playground = {
  injectRoomTracker: function () {
    global.injectRoomTracker = function () {//*
      if (!global.RoomTrackerInjected) {
        global.RoomTrackerInjected = true;
        var output = `<SPAN>Trying to inject RoomTracker code!</SPAN> 
<SCRIPT>
(function(){
  if(window.RoomTrackerHook)return;
  let Api = angular.element($('section.game')).injector().get('Api');  
  let Connection = angular.element($('body')).injector().get('Connection');
  let roomScope = angular.element(document.getElementsByClassName("room ng-scope")).scope();
  Connection.onRoomUpdate(roomScope, function()
  {
  let roomName = roomScope.Room.roomName;
  let tick = roomScope.Room.gameTime;
      Api.post('user/console',{
          /*global.roomsViewed = global.roomsViewed || {}; global.roomsViewed.push({tick: 12345, roomName: 'E1S1'; roomsViewed = _.filter(roomsViewed, (v)=>v.tick>=12345);''*/
            expression: "global.roomsViewed = global.roomsViewed || []; global.roomsViewed.push({tick: "+tick+", roomName: '"+roomName+"'}); global.roomsViewed = _.filter(global.roomsViewed, (v)=>v.tick>="+tick+");''",
            shard: roomScope.Room.shardName,
            hidden: true
      });
  });
  window.RoomTrackerHook = true;
})()
</SCRIPT>`
        console.log(output.replace(/(\r\n|\n|\r)\t+|(\r\n|\n|\r) +|(\r\n|\n|\r)/gm, ''));
      }
      //*/
    }

    global.forceInjectRoomTracker = () => { global.RoomTrackerInjected = false; injectRoomTracker(); }

    injectRoomTracker();

    global.getViewedRooms = function getViewedRooms() {
      global.roomsViewed = global.roomsViewed ? _.filter(global.roomsViewed, (v) => v.tick >= Game.time - 1) : [];
      return roomsViewed = global.roomsViewed.map(v => v.roomName);
    }
  },


  test: function () {

    global.injectTest = function () {//*
      if (global.NAMEInjected) {
        return;
      }
      global.NAMEInjected = true;
      var output = `<SPAN>Trying to inject NAME code!</SPAN>
      <SCRIPT>
      (function(){
        if(window.RoomTrackerHook)return;
        let Api = angular.element($('section.game')).injector().get('Api');  
        let Connection = angular.element($('body')).injector().get('Connection');
        let roomScope = angular.element(document.getElementsByClassName("room ng-scope")).scope();
        Connection.onRoomUpdate(roomScope, function()
        {
        let roomName = roomScope.Room.roomName;
        let tick = roomScope.Room.gameTime;
            Api.post('user/console',{
                /*global.roomsViewed = global.roomsViewed || {}; global.roomsViewed.push({tick: 12345, roomName: 'E1S1'; roomsViewed = _.filter(roomsViewed, (v)=>v.tick>=12345);''*/
                  expression: "global.roomsViewed = global.roomsViewed || []; global.roomsViewed.push({tick: "+tick+", roomName: '"+roomName+"'}); global.roomsViewed = _.filter(global.roomsViewed, (v)=>v.tick>="+tick+");''",
                  shard: roomScope.Room.shardName,
                  hidden: true
            });
        });
        window.RoomTrackerHook = true;
      })()
      </SCRIPT>`
      console.log(output.replace(/(\r\n|\n|\r)\t+|(\r\n|\n|\r) +|(\r\n|\n|\r)/gm, ''));
    }
    //*/

    /*
    `<iframe
        src="http://grafana.mofengfeng.com/dashboard/snapshot/4M6WcC1hnAzwn4kgGxD3Mg2ZeRgCuEYd?orgId=16&refresh=5m"
        ></iframe>`
    */

  

    global.forceInjectTest = () => {
    global.NAMEInjected = false;
    injectTest();
  }

    injectTest();
},

 


  temple: function () {
    /* Posted February 11th, 2017 by @semperrabbit */

    global.injectNAME = function () {//*
      if (!global.NAMEInjected) {
        global.NAMEInjected = true;
        var output = `<SPAN>Trying to inject NAME code!</SPAN>
<SCRIPT>

</SCRIPT>`
        console.log(output.replace(/(\r\n|\n|\r)\t+|(\r\n|\n|\r) +|(\r\n|\n|\r)/gm, ''));
      }
      //*/
    }

    global.forceInjectNAME = () => { global.NAMEInjected = false; injectNAME(); }

    injectNAME();
  },


temp: function () {
  console.log(body(evalBody_harvester('Spawn1')))

}

}



export default playground
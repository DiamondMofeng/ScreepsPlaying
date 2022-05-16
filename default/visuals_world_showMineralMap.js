const worldVisual_showMineralMap = () => {


  let mineralMap = { 'U': ['E18N9', 'E21N12', 'E21N3', 'W14N19', 'W16N1', 'W21N26', 'W9N12', 'W9N8'], 'O': ['E19N12', 'W12N21', 'W19N16', 'W8N1', 'W9N23', 'W9N26', 'W9N9'], 'Z': ['E21N5', 'W17S1'], 'L': ['W11N18', 'W11N7', 'W17N21', 'W19N13', 'W19N15'], 'K': ['W11N2', 'W14N11', 'W1N6', 'W4N9', 'W5N1'], 'H': ['W11N4', 'W12N19', 'W13N11', 'W13N19', 'W1N7', 'W23N19', 'W8N11', 'W9N6'] }

  for (let mineral in mineralMap) {
    for (let roomName of mineralMap[mineral]) {
      Game.map.visual.text(mineral, new RoomPosition(25, 25, roomName), { color: '#FF0000', fontSize: 20 })
      Game.map.visual.circle(new RoomPosition(25, 25, roomName), { color: '#FF0000', radius: 25 })

      // Game.map.visual.text("Target💥", new RoomPosition(11, 14, 'E2S7'), { color: '#FF0000', fontSize: 10 });


    }
  }
}
module.exports = worldVisual_showMineralMap
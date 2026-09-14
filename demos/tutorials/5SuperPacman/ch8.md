# Superpowers Game Development Series #5
## **SUPER PACMAN**  
### **Chapter 8 : Scripting level and start**

In the previous chapters we called differents functions which wasn't written yet, the Global.startNewGame() when we click on a level button from the menu and 
the Level.set() called once a new game start.

We can now create all of the to finish the logic behing the launch of the game.

#### New level settings

In the global script we add a namespace Level where we will add our datas and function related to the game level. The function serve mostly to explore the tile map and return the datas
we need to start a new game.

##### Level datas

Datas we access from other part of the program.

```ts
[...]
namespace Level {
  // All the different level names  
  export const levels = {
               1:"Level1",
               2:"Level2",
               3:"Level3",
               4:"Level4",
               5:"Level5",
               6:"Level6"
              }
  
  // The differents layers of the tile map for each level
  export enum layers {
        positions = 0,
        backgroung = 1,
        walls = 2
       }
  
  // Size of level per unit of 16 pixels
  export enum size {
        width = 26,
        height = 32 
       }
  
  // Tile set references of the game objects
  export enum tiles {
        smallcoin = 63,
        bigcoin = 64,
        fruits = 65,
        ghost = 66,
        pacman = 67
       }
  
  // End statistics of the game
  export const endStats = ["Score", "Time", "Ghosts", "Coins", "Fruits", "Lifes"];
[...]
```

##### Set level

This function is a hub function, serve to redirect to all the local function and call them once.

```ts
[...]
  export function set(){
    // Call all the Level functions once 
    setPacman();
    setGhosts();
    setCoins();
    getFruitsRandomPositions();
  }
[...]
```

##### Set pacman

This functions serve to find out where is the starting position of the pacman on the tile map and return it's position to the game actor.

```ts
[...]
  // function that check all the tile from the tile map and return the position of the searched tile
  function checkMap(layer:number, tile:number){
    // Loop the number of unit there is on width size
    for(let x = 0; x < size.width; x++){
      // Loop the number of unit there is on height size
      for(let y = 0; y < size.height; y++){
        // Check if the tile in x and y is the tiled looked for
        if(Global.game.tileMap.getTileAt(layer, x, y) === tile){
          // if yes, return the position as a new Vector2
          return new Sup.Math.Vector2(x, y);
        }
      }
    }
  }
  
  // function that get the start position of pacman on the map
  function setPacman(){
    // Call the checkMap function and set the returned position to the variable
    let spawnPosition = checkMap(layers.positions, tiles.pacman);
    // Give to the pacman actor the spawnposition of this level (constant)
    Global.pacman.spawnPosition = spawnPosition;
    // Copy this position for the current position (variable)
    Global.pacman.position = spawnPosition.clone();
  }
[...]
```

##### Set ghosts
```ts
[...]  
  // function that get the start ghost positions on the map
  function setGhosts(){
    // Index of ghosts, start with the first
    let ghostIndex: number = 0;
    // Loop through all the tile set
    for(let x = 0; x < size.width; x++){
      for(let y = 0; y < size.height; y++){
        // If the current tile x, y is a ghost start position tile
        if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.ghost){
            // If yes, create a new Vector 2 with the position of the tile
            let spawnPosition = new Sup.Math.Vector2(x, y)
            // Give the position to the current ghost Actor as the spawnPosition and the current position
            Global.ghosts[ghostIndex].spawnPosition = spawnPosition;
            Global.ghosts[ghostIndex].position = spawnPosition.clone();
            // Change ghost index to prepare the next one
            ghostIndex++
        }
      }
    }
  }
[...]
```

##### Set coins

This function check the Tile Map in the beginning to find all the position of small and big coins to set them as actors in a list.

```ts
[...]
  function setCoins(){
    // Loop to check all the tile positions from the Tile Map
    for(let x = 0; x < size.width; x++){
      for(let y = 0; y < size.height; y++){
        // If the tile is a fruit or a small coin, add a small coin actor
        if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.smallcoin ||
        Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.fruits){
          // Add a coin to the total count
          Global.coins.small++
          // Create a new actor
          let coin = new Sup.Actor("smallCoin");
          // Set X and Y position to the actor and a Z position to 10
          coin.setPosition(x, y, 10);
          // Set a new component Sprite renderer to the actor with the smallCoin sprite
          new Sup.SpriteRenderer(coin, "Items/Coins/Small");
          // Add the actor to the list of small coins
          Global.coinsList.small.push(coin);
        }
        // If the tile is a big coin, add a big coin actor
        else if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.bigcoin){
          // Add a coin to the total count
          Global.coins.big++
          // Create a new actor
          let coin = new Sup.Actor("bigCoin");
          // Set X and Y position to the actor and a Z position to 10
          coin.setPosition(x, y, 10);
          // Set a new component Sprite renderer to the actor with the bigCoin sprite
          new Sup.SpriteRenderer(coin, "Items/Coins/Big");
          // Add the actor to the list of big coins
          Global.coinsList.big.push(coin);
        }
      }
    }
  }
[...]
```

##### Set fruits

This function get the position of the fruit starting position and add them to a list.

```ts
[...]  
  function getFruitsRandomPositions(){
    // Check all the tile positions from the tile map
    for(let x = 0; x < size.width; x++){
      for(let y = 0; y < size.height; y++){
       // if the tile checked is a fruit tile, add it to the fruitsRandomPositions list
       if(Global.game.tileMap.getTileAt(layers.positions, x, y) === tiles.fruits){
         Global.fruitsRandomPositions.push(new Sup.Math.Vector2(x, y));
       }
      }
    }
  }
}
```


##### Pacman and Ghosts positions

To be able to make it work, we need to initialize variables in the pacman and ghost scripts. We will see in the next chapters how to complete them.

Pacman script

```ts
[...]
class PacmanBehavior extends Sup.Behavior {
  public spawnPosition: Sup.Math.Vector2;
  public position: Sup.Math.Vector2;
  
  awake() {
    // Set this actor a global access 
    Global.pacman = this;
  }
[...]
```

Ghost script

```ts
[...]
class GhostBehavior extends Sup.Behavior {
  public spawnPosition: Sup.Math.Vector2;
  public position: Sup.Math.Vector2;
  
  awake() {
    Global.ghosts.push(this);
  }
[...]
```


#### Start new game

In the global module of the global script we add an exported function. This function serve as a starter when we start a new level from the menu.

```ts
namespace Global {
[...]
  export function startNewGame(){
    // Set datas to default    
    won = undefined;
    ghosts = [];
    coins.small = 0;
    coins.big = 0;
    coinsList.small = [];
    coinsList.big = [];
    fruits = [];
    fruitsRandomPositions = [];
    fruitsAvailablePositions = [];
    fruitsEatenByIndex = [false, false, false, false, false];
    score = 0;
    fruitsEaten = 0;
    ghostsEaten = 0;
    coinsEatens = 0;
    // Start life
    pacmanLifes = lifesMax;
    
    // Freeze the game for 300 frames before to start
    freeze = 300;
    
    // Load the game scene (leave the menu scene)
    Sup.loadScene("Game/Scene");
    // Get the HUD actor for global access
    HUD = Sup.getActor("HUD");
    // Set the current level Tile Map
    Sup.getActor("Level").tileMapRenderer.setTileMap("Levels/"+currentLevel+"/Tile Map");
  }
[...]
```

We now have a complete menu, start a new game and set the level logic complete. We can now focus on the player control of the pacman.

We can download the superpowers project **v8** from this chapter [here](https://github.com/mseyne/super-pacman-project).

[<-- go to chapter 7](ch7.md) -- [go to chapter 9 -->](ch9.md)
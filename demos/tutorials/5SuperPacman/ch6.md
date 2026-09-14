# Superpowers Game Development Series #5
## **SUPER PACMAN**  
### **Chapter 6 : Scripting global game behavior**

#### Global datas

The first thing we can add in our scripts is the datas we will use in our game, like the points, the game keys and others datas we will need to keep track of what happen in the game.

```ts
// This variable will be used to open a web url in a new window, it is not directly related to the game logic
declare var window;

// A global module
namespace Global {
  
  // points for each objects the pacman can eat
  export enum points {
        coin = 10,
        bigcoin = 50,
        fruit = 100,
        ghost = 200
       }
  
  // keyboard's keys the player will use in the game
  export const keys = {
        left: "LEFT",
        right: "RIGHT",
        up: "UP",
        down: "DOWN",
        space: "SPACE",
        exit: "ESCAPE"
       }
  
  // name of the menu screens
  export const menuScreens = {
    start: "Start",
    levels: "Levels",
    end: "End"
  }
  
  // number of coins small and big
  export let coins = {
        small: 0,
        big: 0
       }
  
  // list of all the coins in game, small and big
  export let coinsList = {
        small: [],
        big: []
       }
  
  // starting life
  export const lifesMax:number = 3;
  // life order indicator for HUD
  export const lifesOrder:boolean[][] = [[false, false, false], [true, false, false], [true, true, false]]
  
  // the game behavior
  export let game:GameBehavior;
  // the game HUD (game information displayed)
  export let HUD:Sup.Actor;
  // the pacman behavior
  export let pacman:PacmanBehavior;
  // the ghosts behavior in a list
  export let ghosts:GhostBehavior[];
  // the fruits behavior in a list
  export let fruits:FruitsBehavior[];
  // the game time
  export let time:string;
  // the game score
  export let score: number;
  // level chosen to play
  export let currentLevel:string;
  // boolean flag if the game is won or not
  export let won:boolean;
  // number of frame the game stay blocked before continue
  export let freeze: number;
  
  // the current pacman lifes
  export let pacmanLifes: number;
  // number of coins eaten
  export let coinsEatens: number;
  // number of ghosts eaten
  export let ghostsEaten:number;
  // number of fruits eaten
  export let fruitsEaten:number;
  // fruits status, each position in list is a fruit, if false the fruit is not eaten
  export let fruitsEatenByIndex: boolean[] = [false, false, false, false, false];
  
  
  // fruits positions in the level
  export let fruitsRandomPositions:Sup.Math.Vector2[];
  // current available fruits positions in the level
  export let fruitsAvailablePositions:Sup.Math.Vector2[];
```

#### Game behavior

The game behavior is the script which monitoring what is happening in the game behind the gameplay logic of movement and collision, like keeping track of the timer.

##### Initialize behavior

First we start the class (here we prefer the start method above the awake method because it give time to the other behavior to load).

```ts
class GameBehavior extends Sup.Behavior {
  // We initialize the tile map
  public tileMap: Sup.TileMap;
  // We initialize locally the timer variable
  private time: number; private second: number; private minute: number;

  start() {
    // We set the game behavior globally
    Global.game = this;
    //  We reset the game timer globally and locally
    Global.time = "0"; this.time = 0; this.second = 0; this.minute = 0;
    // We set the tilemap to the current game level
    this.tileMap = Sup.getActor("Level").tileMapRenderer.getTileMap();
    // We prepare the level with the function Level.set()
    Level.set();
  }
[...]
```

*Note : the Level.set() function will be writen in the chapter 8, for now we can comment it to avoid errors.*

And then we add different methods we will use to update and display game informations.

##### update score

A method who receive points to update the score when needed.

```ts
[...]
  updateScore(points:number){
        // Add the points to the game score
        Global.score += points;
        // Update the HUD score display
        Global.HUD.getChild("Score").textRenderer.setText("SCORE:"+Global.score.toString());
  }
[...]
```
##### display new score

A method who display the new score won in the current position when a ghost or a fruit is eaten by the player. 
It take as parameters a position and points.

```ts
[...]
  displayNewScore(position:Sup.Math.Vector3, points:number){
      // Create a new actor score
      let score = new Sup.Actor("score");
      // Add a new component text renderer to the actor with the points as text
      new Sup.TextRenderer(score, points.toString());
      // Add the font Font to the component text renderer
      score.textRenderer.setFont("Font");
      // Give the current position to the score (+0.5 to adapt to the centered origin)
      score.setPosition(position.x+0.5, position.y+0.5, position.z);
      // Destroy the actor score after 1 second
      Sup.setTimeout(1000, function(){score.destroy();});
    }
[...]
```
##### update life

A method that update and display the Pacman lifes. How it works is than when the pacman loose one life, the method is called, it compare the life sprite from the HUD 
with the pattern of boolean flag lifesOrder related to the current life of the Pacman. If the life is true, then the sprite is full, else, the sprite is empty.

```ts
[...]
  updateLife(){
      // Loop the number of maximum lifes the pacman got (3 times) and give the current value to index
      for (let index = 0; index < Global.lifesMax; index++){
        // Get the sprite Renderer component from HUD/Lifes/index actor
        let sprite = Global.HUD.getChild("Lifes").getChild(index.toString()).spriteRenderer;
        // Check the boolean flag from the lifesOrder pattern of the pacman current lifes and current index
        if(Global.lifesOrder[Global.pacmanLifes][index] === true){
          // If the flag is true, set the sprite animation to full
          sprite.setAnimation("full", false);
        }
        else{
          // If the flag is false, set the sprite animation to empty
          sprite.setAnimation("empty", false);
        }
      }
    }
[...]
```
##### update timer

A method that store the local time globally and display it to the HUD.

```ts
[...]
  updateTimer(){
    // convert minute and second to string and set them to variables
    let minute = this.minute.toString(); let second = this.second.toString();
    // If the minutes or seconds are inferior to 10, then add a 0 to the string to keep display consistency 
    if (this.minute < 10){
      minute = "0"+minute;
    }
    if (this.second < 10){
      second = "0"+second;
    }
    // Build the complete string for the current time
    Global.time = minute+':'+second;
    // Display it with the HUD/Timer text renderer
    Global.HUD.getChild('Timer').textRenderer.setText("TIME:"+Global.time);
  }  
[...]
```
##### update() game loop

The update loop go 60 frames per second and check the differents flag of the game to see if something happen globally.

```ts
[...]
  update() {
    // If the freeze counter is on, decrease it from 1 and return to pass the block and repeat 
    if(Global.freeze > 0){
      Global.freeze--
      return;
    }
    
    // Check if the game is won or not (when the Global.won is not undefined anymore)
    if(Global.won === false || Global.won === true){
      // Load the menu scene and destroy the game scene
      Sup.loadScene("Menu/Scene");
      // Call the function that will load the victory or gameover end screen
      Sup.getActor("Menu").getBehavior(MenuBehavior).setEndscreen();
    }
    
    // Increase the game timer by one
    this.time++;
    // When the time got 60 frames add 1 second (the game is default set as 60 frames = 1 second)
    if(this.time%60 === 0){
      this.second++;
      // When the second is 60, add 1 minute and reset second to 0 
      if(this.second%60 === 0){
        this.minute++; this.second = 0;
      }
      // Call the updateTimer method every second
      this.updateTimer();
    }
    
    // Check if the exit key is pressed
    if(Sup.Input.wasKeyJustPressed(Global.keys.exit)){
      // If yes, load the menu scene and destroy the game scene
      Sup.loadScene("Menu/Scene");
    }
    
    // Check if there is still coins left, if not, the game is won
    if(Global.coins.small === 0 && Global.coins.big === 0){
      // Set the won flag to true
      Global.won = true;
      // Set frames number freeze counter
      Global.freeze = 100;
    }
    
    // Check if there is still lifes for pacman, if not, the game is lost
    if (Global.pacmanLifes === 0){
      // Set the won flag to false
      Global.won = false;
    }
  }
}
Sup.registerBehavior(GameBehavior);
```
*Note : the .setEndscreen() method will be writen in the chapter 7 with the menu, for now we can comment it to avoid errors.*

We can now start to script the menu logic.

We can download the superpowers project **v6** from this chapter [here](https://github.com/mseyne/super-pacman-project).

[<-- go to chapter 5](ch5.md) -- [go to chapter 7 -->](ch7.md)
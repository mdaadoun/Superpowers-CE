# Superpowers Game Development Series #5
## **SUPER PACMAN**  
### **Chapter 7 : Scripting menu behavior**

##### Menu behavior

###### Initializing

The menu awake first when we start the menu scene (which is the startup scene).

```ts
class MenuBehavior extends Sup.Behavior {
  // Create a ray caster used to check collision between the mouse and objects of the screen
  private ray = new Sup.Math.Ray;
  // The current screen displayed
  private screen:string;
  // Init The button actor
  private button:Sup.Actor;
  // Init The level buttons actors in a list
  private levelsList:Sup.Actor[];

  awake() {
    // Set the current screen with the start screen
    this.updateScreen(Global.menuScreens.start);
    // Set the button actor to local button variable
    this.button = Sup.getActor("Button");
    // Set the level button actors to an empty list
    this.levelsList = [];
    // Call the function that add all levels buttons actors to the list
    this.getLevelsList();
    // Set the opacity of the levels buttons to default
    this.setLevelOpacityDefault();
  }
[...]
```

###### Update the screen method

This method display the current screen.

```ts
[...]
  updateScreen(screenName:string){
    // Set the screenName parameter as the current screen
    this.screen = screenName;
    // Get the Screens actor in a variable
    let menuScreens = Sup.getActor("Screens");
    // Loop through all the menu Screen
    for ( let screen in Global.menuScreens){
      // Check if the screen from loop is the same than the current screen
      if (Global.menuScreens[screen] === this.screen){
        // if yes, set the screen visibility to true
        Sup.getActor("Screens").getChild(Global.menuScreens[screen]).setVisible(true);
      }
      else{
        // else, set the screen visibility to false
        Sup.getActor("Screens").getChild(Global.menuScreens[screen]).setVisible(false);
      }
    }
  }
[...]
```
###### Level buttons methods

Differents methods are used for the levels buttons behavior.
* getLevelsList() will add the the levelsList all the level button actors
* setLevelOpacityDefault() will set down the sprite opacity of all the level buttons
* setLevelOpacityBright() will set up the sprite opacity of the level button currently hovered by the mouse

```ts
[...]
  getLevelsList(){
    // Loop through all the levels name
    for(let level in Level.levels){
      // Get the actor of the level from the loop and add it to the levelsList 
      this.levelsList.push(Sup.getActor("Screens").getChild("Levels").getChild(Level.levels[level]));
    }
  }

  setLevelOpacityDefault(){
    // Loop through all the levels actors from the list
    for (let level of this.levelsList){
      // Set the opacity of the sprite to half
      level.spriteRenderer.setOpacity(0.5);
    }
  }

  setLevelOpacityBright(actor:Sup.Actor){
    // Loop through all the levels actors from the list
    for (let level of this.levelsList){
      // if the actor name is the same than the level name from the loop
      if(actor.getName() === level.getName()){
        // Set the opacity of this level button to full
        level.spriteRenderer.setOpacity(1);
      }
      else{
        // Else, set the opacity of this level button to half
        level.spriteRenderer.setOpacity(0.5);
      }
    }
  }
[...]
```
###### End screen method

This method set the end screen related to the result of won (victory or game over)

```ts
[...]
  setEndscreen(){
    // Update the screen display with the end screen
    this.updateScreen(Global.menuScreens.end);
    // Get the actor of the end screen
    let endScreen: Sup.Actor = Sup.getActor('Screens').getChild("End");
    // If the game won flag is true
    if(Global.won){
      // Set the animation victory of the sprite (without looping the animation)
      endScreen.spriteRenderer.setAnimation("victory", false);
    }
    else{
      // Set the animation game over of the sprite (without looping the animation)
      endScreen.spriteRenderer.setAnimation("gameover", false);
    }
    
    // Set the statistic datas to update the text display in the end screen
    endScreen.getChild("Score").textRenderer.setText("Score:"+Global.score);
    endScreen.getChild("Time").textRenderer.setText("Time:"+Global.time);
    endScreen.getChild("Ghosts").textRenderer.setText("Ghosts eaten:"+Global.ghostsEaten);
    endScreen.getChild("Coins").textRenderer.setText("Coins eaten:"+Global.coinsEatens);
    endScreen.getChild("Fruits").textRenderer.setText("Fruits eaten:"+Global.fruitsEaten);
    endScreen.getChild("Lifes").textRenderer.setText("Lifes left:"+Global.pacmanLifes);
  }
[...]
```

###### Update loop
```ts
[...]
  update() {
    // Update the position of the raycaster of the mouse inside the camera zone
    this.ray.setFromCamera(Sup.getActor("Camera").camera, Sup.Input.getMousePosition());
    // Give data related to the collision between the mouse and the button to a variable
    let hitButton = this.ray.intersectActor(Sup.getActor("Button"));
    
    // if the hitButton variable got datas, it is hovered
    if(hitButton.length > 0){
      // If the current screen is the start screen
      if(this.screen === Global.menuScreens.start){
        // Change the animation of the button to hoverPlay
        this.button.spriteRenderer.setAnimation("hoverPlay", false);
        // Change the animation of the start screen
        Sup.getActor("Screens").getChild("Start").spriteRenderer.setAnimation("hover", false);
      }
      // If the current screen is the level selection or the end screen
      else {
        // Change the animation of the button to hoverReturn
        this.button.spriteRenderer.setAnimation("hoverReturn", false);
      }
      // If the button is pressed while hovering it
      if(Sup.Input.wasMouseButtonJustPressed(0)){
        // call the updateScreen() function with a parameter depending of the current screen
        switch(this.screen){
          case "Start":
            // If the current screen was start screen, go to levels screen
            this.updateScreen(Global.menuScreens.levels);
            break;
          case "Levels":
            // If the current screen was levels screen, go to start screen
            this.updateScreen(Global.menuScreens.start);
            break;
          case "End":
            // If the current screen was end screen, go to start screen
            this.updateScreen(Global.menuScreens.start);
            break;
        }
      }
    }
    else{
      // If the button is not hovered, reset animation to unhoverPlay is the current screen is Start
      if(this.screen === "Start"){
        this.button.spriteRenderer.setAnimation("unhoverPlay");
        // Change the animation of the start screen
        Sup.getActor("Screens").getChild("Start").spriteRenderer.setAnimation("unhover", false);
      }
      // Else reset animation to unhoverReturn for the others screens
      else {
        this.button.spriteRenderer.setAnimation("unhoverReturn");
      }
    }
    
    // If the current screen is levels screen
    if (this.screen === "Levels"){
    // Give data related to the collision between the mouse and all the levels buttons to a variable
      let hitLevel = this.ray.intersectActors(this.levelsList);
      if (hitLevel.length > 0){
        // if there is hitLevel data, a button level is hovered, call funtion to set a light opacity
        this.setLevelOpacityBright(hitLevel[0].actor);
        // if the current button is clicked
        if(Sup.Input.wasMouseButtonJustPressed(0)){
          // If the level clicked is the level 6 (which is a tutorial link than we will change later)
          if (hitLevel[0].actor.getName() === "Level6"){
            // Open a new window with the url
            window.open("http://mseyne.github.io/");
          }
          // Else, for all others levels
          else{
            // Set the current level to the level which have been clicked
            Global.currentLevel =  hitLevel[0].actor.getName();
            // Start a new game
            Global.startNewGame();
          }
        }
      }
      // if no one is hovered set opacity false to all levels buttons
      else{
        this.setLevelOpacityDefault();
      }
    }
  }
}
Sup.registerBehavior(MenuBehavior);
```

To make all this work without error, we can add in the Global script the Level namespace with this datas, we will complete this module in the next chapter.

```ts
[...]
namespace Level {
  export const levels = {
               1:"Level1",
               2:"Level2",
               3:"Level3",
               4:"Level4",
               5:"Level5",
               6:"Level6"
              }
  
  export function set(){}
  
  export const endStats = ["Score", "Time", "Ghosts", "Coins", "Fruits", "Lifes"];
}
```

We can download the superpowers project **v7** from this chapter [here](https://github.com/mseyne/super-pacman-project).

[<-- go to chapter 6](ch6.md) -- [go to chapter 8 -->](ch8.md)
# Superpowers Game Development Series #5
## **SUPER PACMAN**  
### **Chapter 9 : Scripting pacman behavior**

We write the pacman script.

#### Pacman behavior

We need to define all the methods our pacman will need to interact with the world objects, moving inside the walls and eating ghosts, coins and fruits. It define also the behavior when
the pacman is eaten and respawn.

##### Datas

We initialize the variables with their types. 

```ts
class PacmanBehavior extends Sup.Behavior {
  // Spawn position in the current level
  public spawnPosition: Sup.Math.Vector2;
  // Current position in the maze
  public position: Sup.Math.Vector2;
  // Next direction the pacman will follow
  private nextDirection: string;
  // Current direction of the pacman
  private currentDirection: string;
  // Time in frame before respawn
  private respawnCooldown: number;
[...]
```


##### Awakening and starting

We set the datas of the pacman when the game start for the first time.

```ts
[...]
  awake() {
    // Give global access to this actor behavior
    Global.pacman = this;
  }

  start(){
    // Set the current position to the actor in the scene
    this.actor.setPosition(this.position);
    // Multiply the position by ten to work only with integer numbers
    this.position.multiplyScalar(10);
  }
[...]
```

##### Get small coin

This method check if there is a coin when the pacman reach the center a tile. We also need a method that check if this position is one of the random position
for the fruit to appear, if it is the case, we give the information as now the position is available for a fruit.

```ts
[...]
  getCoinAt(column:number, row:number){
    // Loop through all the small coins of the level
    for(let coin of Global.coinsList.small){
      // If the position in x and the position in y of the small coin is the same than the position of the pacman
      if(coin.getX() === column && coin.getY() === row){
        // Get the index of this actor from the coin list
        let coinIndex = Global.coinsList.small.indexOf(coin);
        // Remove this index from the coin list
        Global.coinsList.small.splice(coinIndex, 1);
        // Remove one coin from the total coin counter
        Global.coins.small--;
        // Call the function getFruitAvailablePosition to check if it is also a fruit position
        this.getFruitAvailablePosition(column, row);
        // Then destroy the coin actor (and sprite renderer)
        coin.destroy();
        // Add score for this coin
        Global.game.updateScore(Global.points.coin);
        // Add a coin to the statistic of coin eaten
        Global.coinsEatens++;
      }
    }
  }
  
  getFruitAvailablePosition(column:number, row:number){
      // Loop through all the random positions for the fruits to appear
      for(let position of Global.fruitsRandomPositions){
        // If the current pacman position is one of them
        if(position.x === column && position.y === row){
          // Then add this position as a new vector in the available position list
          Global.fruitsAvailablePositions.push(new Sup.Math.Vector2(column, row));
        }
      }
    }
[...]
```

##### Get big coin

This method is mostly the same than the previous one, except than when a big coin is taken, the vulnerability of the ghosts switch.

```ts
[...]
  getBigcoinAt(column:number, row:number){
    // Loop through all the big coins of the level
    for (let bigcoin of Global.coinsList.big) {
      // If the position in x and the position in y of the big coin is the same than the position of the pacman
      if (bigcoin.getX() === column && bigcoin.getY() === row) {
        // Get the index of this big coin from the list
        let bigcoinIndex = Global.coinsList.big.indexOf(bigcoin);
        // Remove the big coin from the list of big coins
        Global.coinsList.big.splice(bigcoinIndex, 1);
        // Decrease by one the number of total coin counter in the level
        Global.coins.big--;
        // Destroy the bigcoin actor (and sprite renderer)
        bigcoin.destroy();
        // Add score for this big coin
        Global.game.updateScore(Global.points.bigcoin);
        // Add a coin to the statistic of coin eaten
        Global.coinsEatens++;
        // Loop through all the ghosts from the list
        for(let ghost of Global.ghosts){
          // Call a method from the ghost behavior to set their vulnerability
          ghost.setVulnerabilityOn();
        }
      }
    }
  }
[...]
```

To avoid an error we can set an empty function in the ghost script, we will complete it in the next chapter.

```ts
class GhostBehavior extends Sup.Behavior {
[...]
  setVulnerabilityOn(){}
[...]
```

##### Get fruit

This method check if there is a fruit to take in the pacman current position.

```ts
[...]
  getFruitAt(column:number, row:number){
    // Loop through all the fruits from the list
    for (let fruit of Global.fruits){
      // If the fruit position are the same than the current pacman position
      if(fruit.position.x === column && fruit.position.y === row){
        // Remove the fruit from the list
        Global.fruits.splice(Global.fruits.indexOf(fruit), 1);
        // Call a local function of the fruit script
        fruit.eaten();
      }
    }
  }
[...]
```

To avoid error we will need to initialize the fruit script and the die function.

```ts
class FruitsBehavior extends Sup.Behavior {
  public position: Sup.Math.Vector2;
[...]
```

##### Movement check

This method check a tile and return true only if the pacman is aligned on the grid and can 

```ts
[...]
  canMove(moveX:number, moveY:number){
    // If the pacman position is not centered on the grid, don't check the tile, return false
    if (moveX !== 0 && this.position.y%10 !== 0 || moveY !== 0 && this.position.x%10 !==0) return false;
    
    // Initialize cursor coordinates on tile to check   
    let tileX:number; let tileY:number;
    // The cursor origin we check on a tile is left, down of a tile, we change the cursor position :
    if(moveX === -1){
      // When going to left move the origin cursor to right position and move it to the next tile on the left
      tileX = Math.floor((this.position.x+9)/10)+moveX;
    }
    else {
      // Move the cursor to the next tile on the right
      tileX = Math.floor(this.position.x/10)+moveX;
    }
    if(moveY === -1){
      // When going to left move the origin cursor to up position and move it to the next tile up
      tileY = Math.floor((this.position.y+9)/10)+moveY;
    }
    else {
      // Move the cursor to the next tile up
      tileY = Math.floor(this.position.y/10)+moveY;
    }
    // If the tile checked is empty in tileMap, then return true, else return false
    if (Global.game.tileMap.getTileAt(Level.layers.walls, tileX, tileY) === -1) return true;
    else return false;
  }
[...]
```

##### Set direction animation

This method update the current direction and the moving sprite of the pacman.

```ts
[...]
  setDirection(){
    // Next direction become current direction
    this.currentDirection = this.nextDirection;
    // Change the animation with the current direction
    this.actor.getChild("Move").spriteRenderer.setAnimation("go"+this.currentDirection);
  }
[...]
```

##### death

This method update the life of the pacman, hide the actor and create a new actor which play the death animation.

```ts
[...]
  die(){
    // Decrease by one the pacman lifes
    Global.pacmanLifes--
    // Update life from HUD
    Global.game.updateLife();
    // Set the pacman actor invisible
    this.actor.setVisible(false);
    // Create a new actor called Death
    let death = new Sup.Actor("Death");
    // Set the current position to the death actor
    death.setPosition(this.actor.getPosition());
    // Add a sprite renderer component and play once the death animation
    new Sup.SpriteRenderer(death).setSprite("Pacman/Death").setAnimation("death", false);
    // Set the timer before respawn
    this.respawnCooldown = 10;
  }
[...]
```

##### respawn

This method reset the pacman to the spawn position.

```ts
[...]
  respawn(){
    // Reset current position to the spawn position
    this.position = this.spawnPosition.clone();
    // Set the current position to the actor in the scene
    this.actor.setPosition(this.position);
    // Multiply the position to work with integer
    this.position.multiplyScalar(10);
    // Reset the movement current and next direction
    this.nextDirection = "";
    this.currentDirection = "";
    // Stop the movement animation
    this.actor.getChild("Move").spriteRenderer.stopAnimation();
    // Set the pacman actor visible
    this.actor.setVisible(true);
  }
[...]
```

##### Update loop

The loop check the input of the player, check the tilemap by calling methods for collisions/eating and possibility of movements.

```ts
[...]
  update() {
    // If the game is freezed, return to the beginning of the loop
    if(Global.freeze > 0){
      return;
    }
    
    // If the respawnCooldown is on, decrease it by one each frame
    if(this.respawnCooldown > 0){
      this.respawnCooldown--;
      // When the timer reach 1, call the respawn function
      if(this.respawnCooldown === 1){
        this.respawn();
      }
      return;
    }
    
    // When the player press a directional key, store it as the next direction.
    if(Sup.Input.wasKeyJustPressed(Global.keys.left)){
      this.nextDirection = "LEFT";
    }
    
    if(Sup.Input.wasKeyJustPressed(Global.keys.right)){
      this.nextDirection = "RIGHT";
    }
    
    if(Sup.Input.wasKeyJustPressed(Global.keys.up)){
      this.nextDirection = "UP";
    }
    
    if(Sup.Input.wasKeyJustPressed(Global.keys.down)){
      this.nextDirection = "DOWN";
    }
    
    // Check if it is possible to go in the next direction and if yes, set it as the current direction
    if( this.nextDirection === "LEFT" && this.canMove(-1, 0)){    
      this.setDirection();
    }
    else if( this.nextDirection === "RIGHT" && this.canMove(1, 0)){       
      this.setDirection();
    }
    else if( this.nextDirection === "UP" && this.canMove(0, 1)){    
      this.setDirection();
    }
    else if( this.nextDirection === "DOWN" && this.canMove(0, -1)){    
      this.setDirection();
    }
    
    // Check if it is possible to go in the current direction and if yes keep moving
    if( this.currentDirection === "LEFT" && this.canMove(-1, 0)){    
      this.position.add(-1, 0);
    }
    else if( this.currentDirection === "RIGHT" && this.canMove(1, 0)){    
      this.position.add(1, 0);
    }
    else if( this.currentDirection === "UP" && this.canMove(0, 1)){    
      this.position.add(0, 1);
    }
    else if( this.currentDirection === "DOWN" && this.canMove(0, -1)){    
      this.position.add(0, -1);
    }
    else{
      // Stop the animation movement if the pacman is blocked
      this.actor.spriteRenderer.stopAnimation();
    }
    
    // Update the position actor with the new position, (divide by ten to get the real unit)
    this.actor.setPosition(this.position.x/10, this.position.y/10);
    
    // Keep pacman in the game screen on the x axis (tunnel)
    if (this.position.x < 0){
      this.position.x = (Level.size.width * 10)-10;
    }
    if (this.position.x > (Level.size.width * 10)-10){
      this.position.x = 0;
    }
    
    // If the pacman is centered in the unit gride, check if there is something to eat
    if (this.position.x%10 === 0 && this.position.y%10 === 0){
      // Get the current x and y position, divise by ten, to work with the real unit
      let posX: number = this.position.x/10; 
      let posY: number = this.position.y/10;
       // Check if there is a coin in current position and take it if yes
      this.getCoinAt(posX, posY);
      // Check if there is a bigCoin in current position and take it if yes
      this.getBigcoinAt(posX, posY);
      // Check if there is a fruit in current position and take it if yes
      this.getFruitAt(posX, posY);
    }
  }
}
Sup.registerBehavior(PacmanBehavior);
```


We can download the superpowers project **v9** from this chapter [here](https://github.com/mseyne/super-pacman-project).

[<-- go to chapter 8](ch8.md) -- [go to chapter 10 -->](ch10.md)
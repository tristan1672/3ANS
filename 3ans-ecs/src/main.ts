async function main() {
 
  function gameLoop() {
     // calls all systems
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
}

main();

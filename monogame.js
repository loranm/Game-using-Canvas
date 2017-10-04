(function () {
  "use strict";
  window.document.addEventListener('DOMContentLoaded', function () {
    /*****************************************************************************
    Définition des images utilisées
    *****************************************************************************/
    var mySpriteSheet = new Image();
    mySpriteSheet.src = "img/mySpriteSheet.png";
    /***************************************************************************
    Définition du canvas
    ***************************************************************************/

    var requestId; //stocke l'id généré par requestAnimationFrame, on s'en sert pour gérer la pause.
    var maxTime = 7260; //temps maximum de jeu (2 minutes * 3600 ms)


    var canvas = document.querySelector('canvas');
    canvas.height = 720;
    canvas.width = 1000;


    /***************************************************************************
     Définition du fond du jeu + compteur de temps
     ***************************************************************************/
    function background() {
      var ctx = canvas.getContext("2d");
      //Decompte du temps basé sur requestAnimationFrame
      ctx.font = 'bold 30px sans-serif';
      var countDownTextSize = ctx.measureText(displayCountDown);
      var displayCountDown = parseInt((maxTime - requestId) / 60) + ' sec.  avant la fin du jeu';
      ctx.fillStyle = "white";
      ctx.fillText(displayCountDown, 20, canvas.height - 20);
    };




    /***************************************************************************
    Définition des interactions avec le jeu : demarrer, gameover et pause
    ***************************************************************************/

    //Gestion de la pause
    var gameStarted = false;
    var paused = false;
    //Détection des boutons sur la page html
    var startButton = document.getElementById('startButton');
    var pauseButton = document.getElementById('pauseButton');
    var resetButton = document.getElementById('resetButton');
    var message = {
      life: "lostLife",
      skill: "gainSkill",
      lost: "lost",
      win: "win"

    }
    var gameOver = false;


    function showMessage(message) {
      putOnPause()
      var message = document.getElementById(message);
      message.classList.toggle('hidden');
      setTimeout(function () {
        message.classList.toggle('hidden');
        putOnPause();
      }, 2000)
    }

    startButton.addEventListener('click', function () {
      if (gameStarted === false) {
        gameStarted = true;
        document.addEventListener('keydown', keyControl);
        document.addEventListener('keyup', function () {
          tim.canGoLeft = false;
          tim.canGoRight = false;
          tim.canJump = false;
        });
        gameLoop();
      }
    })

    pauseButton.addEventListener('click', function () {
      putOnPause();
    });

    resetButton.addEventListener('click', function () {
      tim = {};
      tim = getHeros(heroesOptions);

      for (var i = 0; i < stageElements.length; i++) {
        if (stageElements[i].bonus) {
          var skill = stageElements[i].nom;
          var toReset = document.getElementById(skill);
          toReset.classList.toggle('hidden');
        };
      }
      pauseButton.classList.toggle('hidden');
      maxTime = 7260 + requestId;
      if (paused) {
        putOnPause()
      };
    })

    //Met le jeu en pause
    var putOnPause = function () {
      if (paused) {
        paused = false;
        pauseButton.setAttribute('value', 'Pause');
        gameLoop();
      } else {
        paused = true;
        pauseButton.setAttribute('value', 'Reprendre');
      };

    };



    /***************************************************************************
    Définition des sprites
    ***************************************************************************/
    var elements = [{
        nom: 'plateforme',
        sx: 1500,
        sy: 1100,
        dx: 10,
        dy: 600,
        dw: 250,
        dh: 30,
        ratio: 1,
        scenery: true,
        pf: true
      }, {
        nom: 'plateforme2',
        sx: 1500,
        sy: 1100,
        dx: 750,
        dy: 580,
        dw: 250,
        dh: 30,
        ratio: 1,
        scenery: true,
        pf: true
      }, {
        nom: 'plateforme3',
        sx: 1500,
        sy: 1100,
        dx: 450,
        dy: 580,
        dw: 100,
        dh: 100,
        ratio: 1,
        scenery: true,
        pf: true
      }, {
        nom: 'html',
        sx: 2100,
        sy: 500,
        dx: 10,
        dy: 500,
        moving: false,
        bonus: true
      }, {
        nom: 'css',
        sx: 2100,
        sy: 600,
        moving: true,
        bonus: true
      }, {
        nom: 'javascript',
        sx: 2100,
        sy: 700,
        dx: 900,
        dy: 500,
        bonus: true
      }, {
        nom: 'angular',
        sx: 2100,
        sy: 800,
        moving: true,
        bonus: true
      }, {
        nom: 'mongo',
        sx: 2100,
        sy: 900,
        moving: true,
        bonus: true
      }, {
        nom: 'node',
        sx: 2100,
        sy: 1000,
        moving: true,
        bonus: true
      }, {
        nom: 'meteor',
        sx: 2100,
        sy: 1100,
        moving: true,
        bonus: true
      }, {
        nom: 'flora',
        sx: 1300,
        sy: 1100,
        dx: 0,
        dy: 575,
        dw: 100,
        dh: 100,
        scenery: true
      }, {
        nom: 'flora2',
        sx: 1100,
        sy: 1100,
        dx: 350,
        dy: 575,
        dw: 100,
        dh: 100,
        scenery: true,
      }, {
        nom: 'flora3',
        sx: 900,
        sy: 1100,
        dx: 670,
        dy: 575,
        dw: 100,
        dh: 100,
        scenery: true,
      },
      {
        nom: 'monster',
        sx: 0,
        sy: 600,
        dx: 10,
        dy: 530,
        moving: true,
        moveFrom: 10,
        moveTo: 200,
        numberOfFrames: 16,
        ticksPerFrame: 5,
        danger: true
      }, {
        nom: 'monster2',
        sx: 0,
        sy: 600,
        dx: 0,
        dy: 600,
        danger: true,
        numberOfFrames: 16,
        ticksPerFrame: 5,
        moving: true,
        moveFrom: 0,
        moveTo: 1000,
      }, {
        nom: 'lapin',
        sx: 0,
        sy: 1000,
        dx: 100,
        dy: 610,
        vx: 2,
        numberOfFrames: 7,
        ticksPerFrame: 3,
        moving: true,
        moveFrom: 0,
        moveTo: 1000,
        danger: true
      }, {
        nom: 'dino',
        sx: 0,
        sy: 800,
        dx: 750,
        dy: 510,
        vx: 1,
        numberOfFrames: 7,
        ticksPerFrame: 3,
        moving: true,
        moveFrom: 750,
        moveTo: 950,
        danger: true
      }
    ];

    /***************************************************************************
    Fonctions Constructeurs
    ***************************************************************************/
    var Sprite = function (options) {
      this.nom = options.nom || 'item';
      this.context = options.context || canvas.getContext('2d');
      this.image = options.img || mySpriteSheet;
      this.sx = options.sx;
      this.sy = options.sy;
      this.sw = options.sw || 100;
      this.sh = options.sh || 100;
      this.dx = options.dx;
      this.dy = options.dy;
      this.dw = options.dw || 100;
      this.dh = options.dh || 100;
      this.ratio = options.ratio || 1;
      this.frameIndex = 0;
      this.scenery = options.scenery;
      this.danger = options.danger || false;
      this.bonus = options.bonus || false;
      this.pf = options.pf || false;


      this.render = function () { //affiche l'image dans le canvas
        this.context.drawImage(
          this.image, //insert l'image
          this.sx + this.sw * this.frameIndex,
          this.sy,
          this.sw,
          this.sh,
          this.dx,
          this.dy,
          this.dw * this.ratio,
          this.dh * this.ratio);
      };


    };

    //Fonction constructeur qui anime le sprite
    var AnimatedSprite = function (options) {
      //propriétés liées à l'animation
      this.tickCount = 0,
        this.ticksPerFrame = options.ticksPerFrame || 0;
      this.numberOfFrames = options.numberOfFrames || 1;
      this.animation = options.animation;


      this.update = function () {
        this.render() // anime l'image
        this.tickCount += 1;
        if (this.tickCount > this.ticksPerFrame) {
          this.tickCount = 0;
          if (this.frameIndex < this.numberOfFrames - 1) {
            this.frameIndex += 1;
          } else {
            this.frameIndex = 0;
          };
        };
      };
    };

    //Fonction constructeur qui déplace le sprite sur le canvas
    var MovingSprite = function (options) {

      this.moveTo = options.moveTo;
      this.moveFrom = options.moveFrom;
      this.moving = options.moving;
      this.vx = options.vx || 1;
      this.vy = options.vy || 0;
      this.mass = 1.02;
      this.startingSY = this.sy;
      this.floor = {
        x1: -100,
        x2: canvas.width,
        bottom: 700
      };


      this.translate = function (start, end, sy) {
        this.update() //Effectue une translation de l'image du parametre start jusqu'à end. sy précise la ligne de sprite à utiliser pour l'animation du sens gauche -> droite
        if (start != end) {
          if (this.dx > end) {
            this.dir = 1;
            this.sy = sy + 100;
          }
          if (this.dx < start) {
            this.dir = 0;
            this.sy = this.startingSY;
          }

          if (this.dir) {
            this.dx -= this.vx;
          } else {
            this.dx += this.vx;
          };
        };
      };

    };

    // Retourne un entier tiré au hasard
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    //fonction constructeur pour afficher les icones de compétences.
    var Bonus = function (options) {
      this.dy = options.dy || 0;
      this.dx = options.dx || getRandomInt(0, canvas.width);
      this.numberOfFrames = options.numberOfFrames || 6;
      this.ratio = options.ratio || 0.5;
      this.tickCount = 0;
      this.ticksPerFrame = 10;
      this.bonus = true;
      this.mass = 1.001;
      // this.random = function(min, max) {
      //   return Math.random() * (max - min + 1);
      // };


      this.fall = function () {
        this.update();
        if (this.moving) {
          this.tickCount += 1;
          if (this.tickCount > this.ticksPerFrame) {
            if (this.dy + this.dh >= this.floor.bottom) {
              this.dy = 0;
              this.dx += Math.random() * canvas.width;
            };
            if (this.dx <= 1 || this.dx + this.dw >= canvas.width) {
              this.dx = Math.random() * canvas.width;
              this.dy = 0;
            };

            this.dx += getRandomInt(-5, 5)
            this.dy += 5;
            this.tickCount = 0;
          };
        };
      };

    };


    /**************************************************************************/
    var Heros = function (options) {
      this.heros = options.heros;
      this.canGoRight = false;
      this.canGoLeft = false;
      this.canJump = false;
      this.mass = 1.02;
      this.vy = 0; //vitesse actuelle du sprite
      this.vx = 0; //vitesse actuelle du sprite
      this.vMax = 2; //vitesse maximale du sprite
      this.vAccel = 0.5; //acceleration du sprite
      this.hitBoxAdj = 31; //permet d'ajuster la taille des hitbox des objets, correctif apporté par rapport à la taille dessin dans le Frame
      this.currentPlatform = {}; //objet : platform en contact avec le héros
      this.currentEnnemy = {}; //objet : ennemi en contact avec le héros
      this.currentBonus = {}; //objet : competence en contact avec le héros
      this.onPlatform = false;
      this.dying = false;
      this.lifes = 3;
      this.skills = 0;
      //fonction qui attire le héros vers le sol en ajoutant la masse
      this.gravity = function () {
        if (this.dx >= this.floor.x1 && this.dx <= this.floor.x2) {
          this.maxJump = this.floor.bottom - 130;
          this.dy *= this.mass;
          if (this.dy + this.dh >= this.floor.bottom) {
            this.dy = this.floor.bottom - this.dh;
          }

          if (this.dy + this.dh <= this.maxJump) {
            this.dir = 1
          }

          if (this.dy + this.dh >= this.floor.bottom) {
            this.dir = 0;
          }

          if (this.dir) {
            this.vy = 10;
          }
          if (this.dir == false) {
            this.vy = -10;
          }
        } else {
          this.dy *= this.mass;
        };

      };

      //fonction qui test si le personnage touche un élément du décor.
      this.testCollision = function () {
        for (var i = 0; i < stageElements.length; i++) {
          if (stageElements[i]) {
            if (this.dx + this.hitBoxAdj < stageElements[i].dx + stageElements[i].dw - this.hitBoxAdj &&
              this.dx + this.dw - this.hitBoxAdj > stageElements[i].dx + this.hitBoxAdj &&
              this.dy + this.hitBoxAdj < stageElements[i].dy + stageElements[i].dh - this.hitBoxAdj &&
              this.dh + this.dy - this.hitBoxAdj > stageElements[i].dy + this.hitBoxAdj) {
              //Une collision est en cours
              this.collision = true;

              //Collision avec un ennemi
              if (stageElements[i].danger) {
                this.currentEnnemy = stageElements[i];
                this.vsEnnemy(this.currentEnnemy)
              };

              //Collision avec une platforme
              if (stageElements[i].pf) {
                this.currentPlatform = stageElements[i];
                this.onPlatform = true;
                this.vsPlatform(this.currentPlatform)
              };

              //Collisions avec une competence
              if (stageElements[i].bonus) {
                this.currentBonus = stageElements[i];
                this.vsBonus(this.currentBonus);
              };

            };


            if (this.dx + this.dw - this.hitBoxAdj > stageElements[i].dx + stageElements[i].dw - this.hitBoxAdj ||
              this.dx + this.hitBoxAdj < stageElements[i].dx + this.hitBoxAdj ||
              this.dy + this.hitBoxAdj > stageElements[i].dy + stageElements[i].dh - this.hitBoxAdj ||
              this.dh + this.dy - this.hitBoxAdj < stageElements[i].dy + this.hitBoxAdj) {
              if (this.onPlatform) {
                if (this.dx + this.hitBoxAdj < this.currentPlatform.dx || this.dx - this.hitBoxAdj + this.dw / 2 > this.currentPlatform.dx + this.currentPlatform.dw - this.hitBoxAdj) {
                  // if (this.dir == false) {
                  //   this.floor.bottom = 700;
                  // }
                  if (this.dy + this.dh - this.hitBoxAdj) {
                    this.floor.bottom = 700;
                  }
                  this.onPlatform = false;
                }
              }
              if (this.dying) {
                this.dying = false;
                this.sy = 200;
                this.numberOfFrames = 22;
                this.ticksPerFrame = 5;
                this.dx = 450;
                this.dy = 400;
                this.floor.bottom = 700;
                // window.setTimeout(function() {
                // launchlistener();
                // }, 1000);
              }
            }
          }
        };
      };

      this.vsEnnemy = function (ennemy) {
        //repositionne l'ennemi à sa position originale
        ennemy.dx = ennemy.moveFrom;
        this.lifes -= 1;
        if (this.lifes > 0) {
          showMessage(message.life)
        } else {
          this.dying = true;
        }
      }

      this.vsBonus = function (bonus) {
        bonus.dx = 0;
        bonus.dy = 0;
        bonus.sx = 1800;
        bonus.sy = 400;
        bonus.moving = false;
        bonus.numberOfFrames = 1;
        this.skills += 1;
        if (this.skills < 7) {
          showMessage(message.skill);
        }
      };

      /**************************************************************************¨
      GESTION COLLISION AVEC platform
      *************************************************************************/
      this.vsPlatform = function (currentPlatform) {
        if (this.dy + this.hitBoxAdj < currentPlatform.dy + this.hitBoxAdj) {
          this.floor.bottom = currentPlatform.dy + this.hitBoxAdj;
          this.maxJump = this.floor.bottom - 200;
        } else if (this.dy + this.hitBoxAdj >= currentPlatform.dy + this.hitBoxAdj) {
          if (this.dx + this.hitBoxAdj <= currentPlatform.dx + this.hitBoxAdj) {
            this.dx = currentPlatform.dx - this.dw;
          };
          if (this.dx + this.hitBoxAdj >= currentPlatform.dx + this.hitBoxAdj) {
            this.dx = currentPlatform.dx + currentPlatform.dw
          }
        } else {
          this.maxJump = currentPlatform.dy + currentPlatform.dh
        }
      };


      /**************************************************************************¨
      GESTION des DEPLACEMENTS DU HEROS
      *************************************************************************/

      this.goRight = function () {
        if (this.dx <= canvas.width - this.dw) {
          if (this.canGoRight == true) {
            if (this.vx < this.vMax) {
              this.sy = 0;
              this.numberOfFrames = 27;
              this.vx += this.vAccel;
            };
            this.dx += this.vx;
          };
        } else {
          this.dx = canvas.width - this.dw;
        };
      };

      this.goLeft = function () {
        if (this.dx > 0) {
          if (this.canGoLeft == true) {
            if (this.vx > -this.vMax) {
              this.sy = 100;
              this.numberOfFrames = 27;
              this.vx -= this.vAccel;
            }
            this.dx += this.vx;
          };
        } else {
          this.dx = 0;
        }
      }

      this.isWaiting = function () {
        if (this.waiting == true) {
          this.sy = 300;
          this.sx = 0;
          this.numberOfFrames = 22;
        }
      }

      this.stopRunning = function () {
        if (this.canGoRight == false) {
          if (this.vx > 0) {
            this.sy = 200;
            this.numberOfFrames = 22;
            this.vx -= this.vAccel;
          }
          this.dx += this.vx;
        }

        if (this.canGoLeft == false) {
          if (this.vx < 0) {
            this.sy = 200;
            this.numberOfFrames = 22;
            this.vx += this.vAccel;
          }
          this.dx += this.vx;
        }
      }

      this.goUp = function () {
        if (this.canJump == true) {
          this.vy += 1;

          if (this.vx == 0) {
            this.vx = 0;
          } else if (this.vx < this.vMax) {
            this.vx += this.vAccel;
            if (this.vx > 0) {
              this.sx = 0;
              // this.sy = 400;
              this.numberOfFrames = 9;
            };
            if (this.vx < 0) {
              this.sx = 0;
              // this.sy = 500;
              this.numberOfFrames = 9;
            };
          };

          this.mass = 1;
          this.dy += this.vy;
          this.dx += this.vx;
        };
      };

      this.stopJumping = function () {
        if (this.canJump == false) {
          this.mass = 1.02;
          if (this.vy >= 0) {
            this.vy -= 0.5;
          };
        };
      };

      this.animation = function () {
        this.update();
        this.gravity();
        this.goRight();
        this.goLeft();
        this.stopRunning();
        this.goUp();
        this.stopJumping();
        this.isWaiting();
        this.testCollision();
      }

    };

    /**************************************************************************
    GESTION DU CLAVIER

    Lorsqu'on appuie sur une touche, on passe une condition à true.
    La boucle gameLoop parcourt 60 fois par secondes les fonctions de déplacement du héros.

    Lorsqu'on relâche la touche, la condition passe à faux.
    ***************************************************************************/
    function keyControl(e) {
      var event = e.keyCode;
      // if (event === 39 || event === 39 || event === 39)

      switch (event) {
        case 39:
          e.preventDefault();
          tim.canGoRight = true;
          break;

        case 37:
          e.preventDefault();
          tim.canGoLeft = true;
          break;

        case 38:
          e.preventDefault();
          tim.canJump = true;
          break;

        case 32:
          e.preventDefault();
          tim.canJump = true;
          break;

        case 27:
          e.preventDefault();
          putOnPause();
          break;
      };
    };




    /***************************************************************************
     CHAINE DE PROTOTYPAGE
     ***************************************************************************/
    var getSprite = function (options) {
      return new Sprite(options);
    };

    var getAnimatedSprite = function (options) {
      AnimatedSprite.prototype = getSprite(options);
      return new AnimatedSprite(options);
    };

    var getMovingSprite = function (options) {
      MovingSprite.prototype = getAnimatedSprite(options);
      return new MovingSprite(options);
    };

    var getBonusSprite = function (options) {
      Bonus.prototype = getMovingSprite(options);
      return new Bonus(options);
    };

    var getHeros = function (options) {
      Heros.prototype = getMovingSprite(options);
      return new Heros(options);
    }

    /***************************************************************************
     Constitution du décor (scenery)
     ***************************************************************************/
    var stageElements = []; //tous les élements qui s'affichent sont dans ce tableau
    //fonction autoexecutante qui parcourt le tableau elements et les créer en utilisant les fonctions constructeurs correspondant à leurs options.
    (function createStage() {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i].scenery) {
          stageElements[i] = getSprite(elements[i]);
        };
        if (elements[i].animation) {
          stageElements[i] = getAnimatedSprite(elements[i]);
        };
        if (elements[i].moving) {
          stageElements[i] = getMovingSprite(elements[i]);
        };
        if (elements[i].bonus) {
          stageElements[i] = getBonusSprite(elements[i]);
        };
        if (elements[i].heros) {
          stageElements[i] = getHeros(elements[i]);
        };
      };
    })();

    // createStage();

    //displayStage parcourt le tableau stage pour afficher les éléments qui s'y trouvent.
    var displayStage = function () {
      for (var i = 0; i < stageElements.length; i++) {
        if (stageElements[i].scenery) {
          stageElements[i].render();
        };
        if (stageElements[i].animation) {
          // options[i].render();
          stageElements[i].update();
        };
        if (stageElements[i].bonus) {
          // stageElements[i].render();
          // stageElements[i].update();
          stageElements[i].fall();
        };
        if (stageElements[i].moving) {
          // stageElements[i].render();
          // stageElements[i].update();
          stageElements[i].translate(stageElements[i].moveFrom, stageElements[i].moveTo, stageElements[i].sy);
        };
      };

      tim.animation();
    };

    /**************************************************************************
     DECLARATION DU HEROS
     ***************************************************************************/
    var heroesOptions = {
      sx: 0,
      sy: 200,
      dx: 470,
      dy: 400,
      dw: 100,
      dh: 100,
      numberOfFrames: 22,
      ticksPerFrame: 4,
    }
    var tim = getHeros(heroesOptions);
    console.warn('tim', tim)


    /***************************************************************************
     GAME LOOP
     Cette fonction
     ***************************************************************************/

    function gameLoop() {
      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      background();
      displayStage();

      requestId = window.requestAnimationFrame(gameLoop);

      if (paused == true) {
        var ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,0,0.5)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        cancelAnimationFrame(requestId);
      }


      if (tim.skills == 7) {
        gameOver = true;
        showMessage(message.win);
        pauseButton.classList.toggle('hidden')
        cancelAnimationFrame(requestId);
      };

      if (tim.lifes == 0 || requestId == maxTime) {
        gameOver = true;
        showMessage(message.lost);
        pauseButton.classList.toggle('hidden')
        cancelAnimationFrame(requestId);
      };

    };

  });

})()
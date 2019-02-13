function gamePlay() {
    let gameStartElement = document.querySelector('.game-start');
    let gameAreaElement = document.querySelector('.game-area');
    let gameOverElement = document.querySelector('.game-over');
    let playerPoints = document.getElementById('points');
    let playerHealth = document.getElementById('health');
    let playerMana = document.getElementById('mana');
    let topScoreElement = document.getElementById('top-score');
    let underHundred = true;

    gameStartElement.addEventListener('click', onGameStart);
    gameOverElement.addEventListener('click', restartGame);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    let keys = {};

    let player = {
        isActive : true,
        x: 0,
        y: 0,
        points: 0,
        mana: 20,
        health : 100,
        lastTimeFired : 0
    };

    let game = {
        speed: 2,
        level : 1,
        topScore : 0,
        wizardSpeedIndex: 4,
        fireBallSpeedIndex: 5,
        rateOfFire: 800,
        cloudSpawnInterval: 3800,
        bugSpawnInterval : 2800,
        bugSpeedIndex : 4.5,
        healthKitInterval : 50000,
        manaKitInterval : 40000,
        kitsSpeedIndex : 3,
        killBugPoints : 10,
        treeSpawnInterval : 8000,
        treeSpeedIndex : 2
    };

    let scene = {
        lastCloudSpawn: 0,
        cloudHeight: 250,
        cloudWidthSize : 150,
        lastBugSpawn : 0,
        bugHeight : gameAreaElement.offsetHeight - 90,
        bugWidthSize : 60,
        lastHealthKitSpawn : 0,
        lastManaKitSpawn : 0,
        kitsSize : 50,
        lastTreeSpawn : 0,
        treeWidth : 156
    };

    function onGameStart() {
        gameStartElement.classList.add('hide');

        let wizard = document.createElement('div');
        wizard.classList.add('wizard');
        wizard.style.top = player.y + 'px';
        wizard.style.left = player.x + 'px';
        gameAreaElement.appendChild(wizard);
        playerHealth.textContent = player.health + ' hlt.';
        playerMana.textContent = player.mana + ' mana';
        gameOverElement.classList.add('hide');

        window.requestAnimationFrame(gameAction);
    }

    function gameAction(timestamp) {

        let wizard = document.querySelector('.wizard');

        if (timestamp - scene.lastCloudSpawn > game.cloudSpawnInterval + (30000 * Math.random())) {
            let cloud = document.createElement('div');
            cloud.classList.add('cloud');
            cloud.x = gameAreaElement.offsetWidth - scene.cloudWidthSize;
            cloud.style.left = cloud.x + 'px';
            cloud.style.top = (Math.random() * scene.cloudHeight) + 'px';

            gameAreaElement.appendChild(cloud);

            scene.lastCloudSpawn = timestamp;
        }

        if (timestamp - scene.lastTreeSpawn > game.treeSpawnInterval + (8000 * Math.random())) {
            let tree = document.createElement('div');
            tree.classList.add('tree');
            tree.x = gameAreaElement.offsetWidth - scene.treeWidth;
            tree.style.left = tree.x + 'px';
            tree.style.bottom = '0px';

            gameAreaElement.appendChild(tree);

            scene.lastTreeSpawn = timestamp;
        }

        if (timestamp - scene.lastBugSpawn > game.bugSpawnInterval + (3000 * Math.random())) {
            let bug = document.createElement('div');
            bug.classList.add('bug');
            bug.x = gameAreaElement.offsetWidth - scene.bugWidthSize;
            bug.style.left = bug.x + 'px';
            bug.style.top = (Math.random() * scene.bugHeight) + 'px';

            gameAreaElement.appendChild(bug);

            scene.lastBugSpawn = timestamp;
        }

        if (timestamp - scene.lastManaKitSpawn >= game.manaKitInterval){
            let manaKit = document.createElement('div');
            manaKit.classList.add('mana-kit');
            manaKit.x = gameAreaElement.offsetWidth - scene.kitsSize;
            manaKit.style.left = manaKit.x + 'px';
            manaKit.style.top = (Math.random() * (gameAreaElement.offsetHeight - scene.kitsSize)) + 'px';

            gameAreaElement.appendChild(manaKit);

            scene.lastManaKitSpawn = timestamp;
        }

        if (timestamp - scene.lastHealthKitSpawn >= game.healthKitInterval){
            let healthKit = document.createElement('div');
            healthKit.classList.add('health-kit');
            healthKit.x = gameAreaElement.offsetWidth - scene.kitsSize;
            healthKit.style.left = healthKit.x + 'px';
            healthKit.style.top = (Math.random() * (gameAreaElement.offsetHeight - scene.kitsSize)) + 'px';

            gameAreaElement.appendChild(healthKit);

            scene.lastHealthKitSpawn = timestamp;
        }

        let clouds = document.querySelectorAll('.cloud');
        clouds.forEach(cloud => {
            cloud.x -= game.speed;
            cloud.style.left = cloud.x + 'px';

            if (cloud.x + cloud.offsetWidth === 0){
                cloud.parentElement.removeChild(cloud);
            }
        });

        let trees = document.querySelectorAll('.tree');
        trees.forEach(tree => {
            tree.x -= game.speed * game.treeSpeedIndex;
            tree.style.left = tree.x + 'px';

            if (tree.x + tree.offsetWidth === 0){
                tree.parentElement.removeChild(tree);
            }
        });

        let bugs = document.querySelectorAll('.bug');
        bugs.forEach(bug => {
            bug.x -= game.speed * game.bugSpeedIndex;
            bug.style.left = bug.x + 'px';

            if (bug.x + bug.offsetWidth === 0){
                bug.parentElement.removeChild(bug);
            }
        });

        let manaKit = document.querySelector('.mana-kit');
        if (manaKit){
            manaKit.x -= game.speed * game.kitsSpeedIndex;
            manaKit.style.left = manaKit.x + 'px';
            if (manaKit.x + manaKit.offsetWidth === 0){
                manaKit.parentElement.removeChild(manaKit);
            }

            if (isCollision(manaKit, wizard)){
                manaKit.parentElement.removeChild(manaKit);
                player.mana += 10;
                playerMana.textContent = player.mana + ' mana'
            }
        }

        let healthKit = document.querySelector('.health-kit');
        if (healthKit){
            healthKit.x -= game.speed * game.kitsSpeedIndex;
            healthKit.style.left = healthKit.x + 'px';

            if (healthKit.x + healthKit.offsetWidth === 0){
                healthKit.parentElement.removeChild(healthKit);
            }


            if (isCollision(healthKit, wizard)){
                healthKit.parentElement.removeChild(healthKit);
                player.health += 10;
                playerHealth.textContent = player.health + ' hlt.';
            }
        }


        let isAtBottom = (player.y + 10) + wizard.offsetHeight < gameAreaElement.offsetHeight;

        if (isAtBottom) {
            player.y += game.speed * game.speed;
            wizard.style.top = player.y + 'px';
        }

        if ((keys.ArrowUp || keys.KeyW) && player.y > 0) {
            player.y -= game.speed * game.wizardSpeedIndex;
            wizard.style.top = player.y + 'px';
        }
        if ((keys.ArrowDown || keys.KeyS) && isAtBottom) {
            player.y += game.speed * game.wizardSpeedIndex;
            wizard.style.top = player.y + 'px';
        }
        if ((keys.ArrowLeft || keys.KeyA) && player.x > 0) {
            player.x -= game.speed * game.wizardSpeedIndex;
            wizard.style.left = player.x + 'px';
        }
        if ((keys.ArrowRight || keys.KeyD) && ((player.x + 4) + wizard.offsetWidth) < gameAreaElement.offsetWidth) {
            player.x += game.speed * game.wizardSpeedIndex;
            wizard.style.left = player.x + 'px';
        }
        if (keys.Space && (timestamp - player.lastTimeFired) > game.rateOfFire) {
            wizard.classList.add('wizard-fire');
            if (player.mana > 0) {
                addFireBall(player.y, player.x, wizard);
                player.mana--;
                playerMana.textContent = player.mana + ' mana';
            }
            player.lastTimeFired = timestamp;
        } else {
            wizard.classList.remove('wizard-fire');
        }

        let fireBalls = document.querySelectorAll('.fire-ball');

        fireBalls.forEach(fireBall => {
            fireBall.x += game.speed * game.fireBallSpeedIndex;
            fireBall.style.left = fireBall.x + 'px';

            if (fireBall.x + fireBall.offsetWidth > gameAreaElement.offsetWidth) {
                fireBall.parentElement.removeChild(fireBall);
            }
        });

        bugs.forEach(bug => {

            fireBalls.forEach(fireBall => {
                if (isCollision(fireBall, bug)){
                    bug.parentElement.removeChild(bug);
                    fireBall.parentElement.removeChild(fireBall);
                    player.points += game.killBugPoints;
                }
            });

            if (isCollision(bug, wizard)){

                player.health -= 1;
                playerHealth.textContent = player.health + ' hlt.';

                if (player.health === 0){
                   gameOver();
                }
            }
        });




        if (timestamp % 500 < 100 && underHundred) {
            player.points++;
            playerPoints.textContent = player.points + ' pts.';
            underHundred = false;
        } else if (timestamp % 500 > 100 && !underHundred) {
            underHundred = true;
        }

        if (timestamp / game.level > 10000 && game.level < 28){
            game.level++;
            game.bugSpeedIndex += 0.1;
            game.bugSpawnInterval -= 100;
        }


        if (player.isActive){
            window.requestAnimationFrame(gameAction);
        }
    }

    function gameOver() {
        player.isActive = false;
        if (player.points > game.topScore){
            game.topScore = player.points;
            topScoreElement.textContent = `Top Score: ${game.topScore} pts.`
        }
        gameOverElement.classList.remove('hide');
        gameOverElement.textContent = 'Game Over ;( Your score is: ' + player.points;
        gameAreaElement.appendChild(gameOverElement);
    }
    
    function isCollision(firstElement, secondElement) {
        let firstRect = firstElement.getBoundingClientRect();
        let secondRect = secondElement.getBoundingClientRect();
        
        return !(firstRect.top > secondRect.bottom ||
                firstRect.bottom < secondRect.top ||
                firstRect.right < secondRect.left ||
                firstRect.left > secondRect.right)
    }

    function addFireBall(y, x, wizard) {
        let fireBall = document.createElement('div');


        fireBall.classList.add('fire-ball');
        fireBall.style.top = (y + 28) + 'px';
        fireBall.x = x + wizard.offsetWidth;
        fireBall.style.left = fireBall.x + 'px';

        gameAreaElement.appendChild(fireBall);
    }

    function onKeyDown(e) {
        keys[e.code] = true;
    }

    function onKeyUp(e) {
        keys[e.code] = false;
    }

    function restartGame() {
        let bugs = document.querySelectorAll('.bug');
        bugs.forEach(bug => bug.parentElement.removeChild(bug));
        let clouds = document.querySelectorAll('.cloud');
        clouds.forEach(cloud => cloud.parentElement.removeChild(cloud));
        let fireBalls = document.querySelectorAll('.fireBall');
        fireBalls.forEach(fireBall => fireBall.parentElement.removeChild(fireBall));
        let wizard = document.querySelector('.wizard');
        wizard.parentElement.removeChild(wizard);
        player.x = 0;
        player.y = 0;
        player.points = 0;
        player.health = 100;
        player.mana = 20;
        player.lastTimeFired = 0;
        scene.lastBugSpawn = 0;
        scene.lastCloudSpawn = 0;
        scene.lastManaKitSpawn = 0;
        scene.lastHealthKitSpawn = 0;
        scene.lastTreeSpawn = 0;
        game.bugSpeedIndex = 4.5;
        game.bugSpawnInterval = 3000;
        game.level = 0;
        player.isActive = true;

        onGameStart();
    }
}
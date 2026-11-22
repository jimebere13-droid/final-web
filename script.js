    // JAVASCRIPT makes the website interactive: it changes screens, adds flowers, and runs the games.

    // Keeps the total number of flowers planted and their feeling information.
    let total = 0;
    let gardenData = [];

    // Stores the flower type and short text used for each feeling throughout the website.
    const emotions = {
      Happy: { type: "sunflower", flower: "Sunflower", text: "Happy moments can feel warm and bright. Your sunflower belongs here.", guide: "A bright sunflower for happy moments." },
      Sad: { type: "bluebell", flower: "Bluebell", text: "It is okay to feel sad. Your blue flower has a place here.", guide: "A bluebell for quiet or sad days." },
      Calm: { type: "daisy", flower: "Daisy", text: "Calm can feel soft and quiet. Take a slow breath.", guide: "A small daisy for calm moments." },
      Anxious: { type: "lavender", flower: "Lavender", text: "Feeling anxious is okay. Take one small step at a time.", guide: "Lavender for busy thoughts and gentle moments." },
      Loved: { type: "tulip", flower: "Tulip", text: "Feeling loved can come from people, memories, or kind moments.", guide: "A pink tulip for love, care, or a warm memory." },
      Excited: { type: "poppy", flower: "Poppy", text: "Excitement can bring energy and new ideas. Enjoy it.", guide: "An orange poppy for something you cannot wait for." }
    };

    // Hides the current page and shows the page with the id passed to the function.
    function showScreen(id) {
      const nextScreen = document.getElementById(id);
      const currentScreen = document.querySelector('.screen.active');
      if (!nextScreen || currentScreen === nextScreen) return;

      if (currentScreen) {
        currentScreen.classList.remove('active');
        currentScreen.classList.add('leaving');
        window.setTimeout(() => currentScreen.classList.remove('leaving'), 310);
      }
      nextScreen.classList.remove('leaving');
      nextScreen.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Returns the HTML pieces that draw one flower type with CSS.
    function flowerInside(type, label = '') {
      const base = '<div class="stem"></div><div class="leaf"></div><div class="leaf two"></div>';
      const labelText = label ? `<span class="flower-label">${label}</span>` : '';

      if (type === 'sunflower' || type === 'daisy') {
        const petals = '<span class="petal"></span>'.repeat(8);
        return `<div class="round-head">${petals}<span class="centre"></span></div>${base}${labelText}`;
      }
      if (type === 'bluebell') {
        return `<div class="bell"><span class="bell-dot"></span></div>${base}${labelText}`;
      }
      if (type === 'lavender') {
        return `<div class="lavender-top">${'<span class="bud"></span>'.repeat(8)}</div>${base}${labelText}`;
      }
      if (type === 'tulip') {
        return `<div class="tulip-head"><span class="tulip-petal one"></span><span class="tulip-petal two"></span><span class="tulip-petal three"></span></div>${base}${labelText}`;
      }
      return `<div class="poppy-head"><span class="poppy-petal one"></span><span class="poppy-petal two"></span><span class="poppy-petal three"></span><span class="poppy-petal four"></span><span class="poppy-centre"></span></div>${base}${labelText}`;
    }

    // Creates a butterfly decoration after the player reaches garden goals.
    function addButterfly(left, bottom, colour, delay) {
      const butterfly = document.createElement('div');
      butterfly.className = 'butterfly';
      butterfly.style.left = left;
      butterfly.style.bottom = bottom;
      butterfly.style.setProperty('--wing', colour);
      butterfly.style.animationDelay = delay;
      butterfly.innerHTML = '<i></i>';
      document.getElementById('reward-area').appendChild(butterfly);
    }

    // Updates points, level, mission bar, and reward butterflies in the garden.
    function updateGame() {
      const uniqueFeelings = new Set(gardenData.map(item => item.emotion)).size;
      const score = total * 10 + uniqueFeelings * 20;
      const level = total >= 10 ? 3 : total >= 5 ? 2 : 1;
      const levelNames = { 1: 'Little seed', 2: 'Growing flower', 3: 'Garden star' };
      let missionValue = total;
      let missionGoal = 3;
      let mission = 'Plant 3 flowers to welcome your first butterfly.';

      if (total >= 3 && uniqueFeelings < 3) {
        missionValue = uniqueFeelings;
        missionGoal = 3;
        mission = 'Choose 3 feelings to welcome a second butterfly.';
      } else if (uniqueFeelings >= 3 && total < 10) {
        missionValue = total;
        missionGoal = 10;
        mission = 'Plant 10 flowers to become a garden star.';
      } else if (total >= 10) {
        missionValue = 1;
        missionGoal = 1;
        mission = 'You did it! Your garden is shining.';
      }

      document.getElementById('points').textContent = score;
      document.getElementById('levelNumber').textContent = level;
      document.getElementById('levelName').textContent = levelNames[level];
      document.getElementById('missionText').textContent = mission;
      document.getElementById('missionProgress').style.width = `${Math.min(100, (missionValue / missionGoal) * 100)}%`;

      const rewards = document.getElementById('reward-area');
      rewards.innerHTML = '';
      if (total >= 3) addButterfly('72%', '202px', '#f2b6c7', '.1s');
      if (uniqueFeelings >= 3) addButterfly('27%', '236px', '#c8b5e0', '.8s');
      if (total >= 10) addButterfly('49%', '184px', '#f5cf88', '1.4s');
    }

    // Builds the six clickable flower cards in the guide automatically from the emotions data.
    function buildGuide() {
      const guide = document.getElementById('guideCards');
      guide.innerHTML = Object.entries(emotions).map(([name, item]) => `
        <button class="card" type="button" data-emotion="${name}" onclick="playGuideBloom('${name}')" aria-label="See the ${name} flower bloom">
          <div class="flower preview ${item.type}">${flowerInside(item.type)}</div>
          <h3>${name}</h3>
          <p>${item.guide}</p>
          <span class="card-hint">Tap to see it bloom</span>
        </button>
      `).join('');
    }

    // Opens the large flower card for the feeling selected in the guide.
    function playGuideBloom(feeling) {
      const item = emotions[feeling];

      document.getElementById('bigFlower').innerHTML = `<div class="flower big-flower ${item.type}">${flowerInside(item.type)}</div>`;
      document.getElementById('flowerCardTitle').textContent = feeling;
      document.getElementById('flowerCardText').textContent = item.guide;
      document.getElementById('flowerCardButton').textContent = 'Enter your garden →';
      document.getElementById('flowerCardWrap').classList.add('show');
      document.getElementById('guideTapMessage').textContent = `${feeling} has its own flower in your garden.`;
    }

    // Closes the flower card and takes the visitor to the game menu.
    function openGardenFromGuide() {
      closeFlowerCard();
      showScreen('game-menu');
    }

    // Hides the flower information card.
    function closeFlowerCard() {
      document.getElementById('flowerCardWrap').classList.remove('show');
    }

    // Plants a matching flower in its soil row and saves that choice in the garden data.
    function addFlower(feeling) {
      const item = emotions[feeling];
      const now = new Date();
      const flower = document.createElement('div');
      flower.className = `flower bed-flower ${item.type}`;
      flower.innerHTML = flowerInside(item.type);
      flower.addEventListener('click', () => {
        flower.classList.remove('wiggle');
        void flower.offsetWidth;
        flower.classList.add('wiggle');
        document.getElementById('message').textContent = `This ${item.flower.toLowerCase()} shows your ${feeling.toLowerCase()} feeling. It belongs in your garden.`;
      });
      document.querySelector(`#bed-${feeling} .bed-flowers`).appendChild(flower);

      total++;
      gardenData.push({
        date: now.toLocaleDateString('en-GB'),
        time: now.toLocaleTimeString('en-GB'),
        emotion: feeling,
        flower: item.flower
      });

      document.getElementById('counter').textContent = `${total} ${total === 1 ? 'feeling planted' : 'feelings planted'}`;
      document.getElementById('message').textContent = item.text;
    }

    // Clears every planted flower and resets the garden counter.
    function resetGarden() {
      document.querySelectorAll('.bed-flowers').forEach(bed => bed.innerHTML = '');
      total = 0;
      gardenData = [];
      document.getElementById('counter').textContent = '0 feelings planted';
      document.getElementById('message').textContent = 'Your garden is ready for a new day.';
    }

    // Counts the chosen feelings and opens the final garden summary card.
    function finishGarden() {
      if (gardenData.length === 0) {
        document.getElementById('message').textContent = 'Choose at least one feeling before you finish.';
        return;
      }

      const counts = gardenData.reduce((all, item) => {
        all[item.emotion] = (all[item.emotion] || 0) + 1;
        return all;
      }, {});
      const leadingEmotion = Object.keys(counts).reduce((first, emotion) => counts[emotion] > counts[first] ? emotion : first);
      const winningFlower = emotions[leadingEmotion];
      const amount = counts[leadingEmotion];
      const extra = amount === 1 ? 'once' : `${amount} times`;

      document.getElementById('summaryFlower').innerHTML = `<div class="flower summary-flower ${winningFlower.type}">${flowerInside(winningFlower.type)}</div>`;
      document.getElementById('summaryText').textContent = `You planted ${total} ${total === 1 ? 'flower' : 'flowers'} today. You chose ${leadingEmotion} the most, so your ${winningFlower.flower.toLowerCase()} appeared ${extra}. Your garden is your own.`;
      const action = document.getElementById('summaryAction');
      action.textContent = 'Keep growing';
      action.onclick = closeSummary;
      document.getElementById('summaryWrap').classList.add('show');
    }

    // Closes the reusable summary card.
    function closeSummary() {
      document.getElementById('summaryWrap').classList.remove('show');
    }

    // WATER & BLOOM DATA: records all pours and which pot is selected.
    let waterDrops = 0;
    let selectedWaterPlant = null;
    const waterPlants = Object.entries(emotions).map(([name, item]) => ({ name, type: item.type, water: 0 }));

    // Creates three flowers for one pot; their size depends on its water count.
    function waterFlowerCluster(plant) {
      const bloomScale = Math.min(.98, .18 + plant.water * .13);
      const blooms = [
        { x: '-30px', tilt: '-10deg', scale: bloomScale * .78 },
        { x: '0px', tilt: '0deg', scale: bloomScale },
        { x: '30px', tilt: '10deg', scale: bloomScale * .8 }
      ];
      return `<span class="pot-cluster">${blooms.map(bloom => `<span class="flower pot-flower ${plant.type}" style="--pot-x:${bloom.x};--pot-tilt:${bloom.tilt};--pot-scale:${bloom.scale}">${flowerInside(plant.type)}</span>`).join('')}</span>`;
    }

    // Draws all watering pots using the current plant data.
    function buildWaterFlower() {
      const shelf = document.getElementById('waterShelf');
      shelf.innerHTML = waterPlants.map((plant, index) => `
        <button class="water-pot-card ${index === selectedWaterPlant ? 'selected' : ''}" data-water-index="${index}" onclick="selectWaterPlant(${index})">
          ${waterFlowerCluster(plant)}
          <span class="water-pot"></span>
        </button>`).join('');
    }

    // Highlights the pot chosen by the player.
    function selectWaterPlant(index) {
      selectedWaterPlant = index;
      document.querySelectorAll('.water-pot-card').forEach(card => card.classList.toggle('selected', Number(card.dataset.waterIndex) === index));
    }

    // Makes the flowers in one pot larger after it receives water.
    function updateWaterPlant(index) {
      const plant = waterPlants[index];
      const bloomScale = Math.min(.98, .18 + plant.water * .13);
      const sizes = [bloomScale * .78, bloomScale, bloomScale * .8];
      document.querySelectorAll(`.water-pot-card[data-water-index="${index}"] .pot-flower`).forEach((flower, flowerIndex) => {
        flower.style.setProperty('--pot-scale', sizes[flowerIndex]);
      });
    }

    // Adds one pour to a pot and creates small water-drop animations.
    function waterPlant(index) {
      selectedWaterPlant = index;
      const plant = waterPlants[index];
      plant.water++;
      waterDrops++;
      document.getElementById('waterCount').textContent = waterDrops;
      selectWaterPlant(index);
      updateWaterPlant(index);

      const stage = document.getElementById('waterStage').getBoundingClientRect();
      const can = document.querySelector('.watering-can').getBoundingClientRect();
      const pot = document.querySelectorAll('.water-pot-card')[index].getBoundingClientRect();
      const startX = can.left - stage.left + 12;
      const startY = can.top - stage.top + 45;
      const endX = pot.left - stage.left + pot.width / 2;
      const endY = pot.top - stage.top + pot.height / 2;
      const stageEl = document.getElementById('waterStage');
      for (let dropNumber = 1; dropNumber <= 7; dropNumber++) {
        const progress = dropNumber / 8;
        const drop = document.createElement('span');
        drop.className = 'water-droplet';
        drop.style.left = `${startX + (endX - startX) * progress + (dropNumber % 2 ? 5 : -5)}px`;
        drop.style.top = `${startY + (endY - startY) * progress}px`;
        drop.style.animationDelay = `${dropNumber * 35}ms`;
        stageEl.appendChild(drop);
        setTimeout(() => drop.remove(), 800);
      }
    }

    // Waters the currently selected pot (kept as a helper for the game controls).
    function waterSelectedPlant() {
      waterPlant(selectedWaterPlant);
    }

    // Returns every pot and the watering counter to the beginning state.
    function resetWaterGame() {
      waterDrops = 0;
      selectedWaterPlant = null;
      waterPlants.forEach(plant => plant.water = 0);
      document.getElementById('waterCount').textContent = '0';
      document.querySelectorAll('.water-droplet').forEach(drop => drop.remove());
      buildWaterFlower();
    }

    // Adds the drag-and-drop behaviour to the watering can.
    function setupWaterCan() {
      const stage = document.getElementById('waterStage');
      const can = document.getElementById('wateringCan');
      let dragging = false;

      const moveCan = event => {
        if (!dragging) return;
        const stageBox = stage.getBoundingClientRect();
        const left = Math.max(14, Math.min(stageBox.width - can.offsetWidth + 35, event.clientX - stageBox.left - 52));
        const top = Math.max(22, Math.min(stageBox.height - can.offsetHeight - 18, event.clientY - stageBox.top - 45));
        can.style.right = 'auto';
        can.style.bottom = 'auto';
        can.style.left = `${left}px`;
        can.style.top = `${top}px`;
      };

      const releaseCan = event => {
        if (!dragging) return;
        dragging = false;
        can.classList.remove('dragging');
        const nozzle = can.getBoundingClientRect();
        const nozzleX = nozzle.left - 18;
        const nozzleY = nozzle.top + nozzle.height * .55;
        const target = document.elementFromPoint(event.clientX, event.clientY)?.closest('.water-pot-card') || [...document.querySelectorAll('.water-pot-card')].find(card => {
          const pot = card.getBoundingClientRect();
          return Math.abs(nozzleX - (pot.left + pot.width / 2)) < 92 && Math.abs(nozzleY - (pot.top + pot.height / 2)) < 118;
        });
        if (target) waterPlant(Number(target.dataset.waterIndex));
        can.style.left = '';
        can.style.top = '';
        can.style.right = '32px';
        can.style.bottom = '24px';
      };

      can.addEventListener('pointerdown', event => {
        dragging = true;
        can.classList.add('dragging');
        can.setPointerCapture(event.pointerId);
        moveCan(event);
      });
      can.addEventListener('pointermove', moveCan);
      can.addEventListener('pointerup', releaseCan);
      can.addEventListener('pointercancel', releaseCan);
    }

    // FLOWER MATCH DATA: available flower types, board tiles, selected tile, and score.
    const matchFlowers = ['sunflower', 'bluebell', 'daisy', 'lavender', 'tulip', 'poppy'];
    let matchTiles = [];
    let selectedTile = null;
    let matchScore = 0;

    // Returns one random flower type from the list above.
    function randomFlowerType() {
      return matchFlowers[Math.floor(Math.random() * matchFlowers.length)];
    }

    // Creates, duplicates, and shuffles the tiles for a new matching game.
    function buildMatchGame() {
      const pairs = ['sunflower', 'bluebell', 'daisy', 'lavender', 'tulip', 'poppy', 'sunflower', 'tulip'];
      matchTiles = [...pairs, ...pairs].sort(() => Math.random() - .5);
      selectedTile = null;
      matchScore = 0;
      document.getElementById('matchScore').textContent = matchScore;
      document.getElementById('matchMessage').textContent = 'Tap a flower, then find its match.';
      renderMatchBoard();
    }

    // Draws the current matching-board state on the screen.
    function renderMatchBoard() {
      const board = document.getElementById('matchBoard');
      board.innerHTML = matchTiles.map((type, index) => type
        ? `<button class="match-tile ${selectedTile === index ? 'selected' : ''}" onclick="tapMatchTile(${index})"><span class="flower ${type}">${flowerInside(type)}</span></button>`
        : `<button class="match-tile empty" aria-label="An empty flower space"></button>`).join('');
    }

    // Checks the two tiles selected by the player and removes a correct pair.
    function tapMatchTile(index) {
      if (!matchTiles[index]) return;
      if (selectedTile === null) {
        selectedTile = index;
        document.getElementById('matchMessage').textContent = 'Now tap the matching flower.';
        renderMatchBoard();
        return;
      }
      if (selectedTile === index) {
        selectedTile = null;
        renderMatchBoard();
        return;
      }
      const first = selectedTile;
      if (matchTiles[first] === matchTiles[index]) {
        matchScore++;
        document.getElementById('matchScore').textContent = matchScore;
        selectedTile = null;
        matchTiles[first] = null;
        matchTiles[index] = null;
        document.getElementById('matchMessage').textContent = 'Match! The two flowers disappeared.';
        renderMatchBoard();
        if (matchTiles.every(tile => tile === null)) {
          setTimeout(() => document.getElementById('matchComplete').classList.add('show'), 450);
        }
      } else {
        selectedTile = null;
        renderMatchBoard();
        document.getElementById('matchMessage').textContent = 'Those flowers do not match. Try again.';
      }
    }

    // Closes the success card and starts a new round of Flower Match.
    function restartMatchGame() {
      document.getElementById('matchComplete').classList.remove('show');
      buildMatchGame();
    }

    // BOUQUET DATA: stores the feeling chosen for every flower in the bouquet.
    let bouquetFlowers = [];
    // Creates the flower-choice buttons in the bouquet shelf.
    function buildBouquetChoices() {
      document.getElementById('bouquetChoices').innerHTML = Object.entries(emotions).map(([name, item]) => `<button class="bouquet-choice" onclick="addBouquetFlower('${name}')"><span class="flower ${item.type}">${flowerInside(item.type)}</span><span>${name}</span></button>`).join('');
    }

    // Adds one selected flower to the bouquet area and gives it a starting position.
    function addBouquetFlower(feeling) {
      bouquetFlowers.push(feeling);
      const startingPlaces = [
        { left: '50%', bottom: '0px', tilt: '0deg', size: '.84' },
        { left: '35%', bottom: '0px', tilt: '-8deg', size: '.74' },
        { left: '65%', bottom: '0px', tilt: '8deg', size: '.74' },
        { left: '22%', bottom: '0px', tilt: '-14deg', size: '.66' },
        { left: '78%', bottom: '0px', tilt: '14deg', size: '.66' },
        { left: '12%', bottom: '0px', tilt: '-20deg', size: '.6' },
        { left: '88%', bottom: '0px', tilt: '20deg', size: '.6' }
      ];
      const item = emotions[feeling];
      const flower = document.createElement('div');
      flower.className = `flower bouquet-flower ${item.type}`;
      const index = bouquetFlowers.length - 1;
      const placement = startingPlaces[index] || {
        left: `${14 + (index * 17) % 72}%`,
        bottom: '0px',
        tilt: `${((index % 5) - 2) * 6}deg`,
        size: '.62'
      };
      flower.style.setProperty('--bouquet-left', placement.left);
      flower.style.setProperty('--bouquet-bottom', placement.bottom);
      flower.style.setProperty('--bouquet-tilt', placement.tilt);
      flower.style.setProperty('--bouquet-size', placement.size);
      flower.innerHTML = flowerInside(item.type);
      document.getElementById('bouquetArea').appendChild(flower);
      makeBouquetFlowerDraggable(flower);
      document.getElementById('bouquetMessage').textContent = `${bouquetFlowers.length} flowers in your bouquet. Drag a flower to place it where you want.`;
    }

    // Lets the player drag a bouquet flower while preventing flowers from overlapping too much.
    function makeBouquetFlowerDraggable(flower) {
      flower.addEventListener('pointerdown', event => {
        event.preventDefault();
        const area = document.getElementById('bouquetArea');
        const canvas = document.getElementById('bouquetCanvas');
        const startLeft = flower.style.getPropertyValue('--bouquet-left');
        const startBottom = flower.style.getPropertyValue('--bouquet-bottom');
        flower.classList.add('dragging');
        canvas.classList.add('dragging-bouquet');
        document.getElementById('bouquetMessage').textContent = 'Move the flower, then let go.';
        flower.setPointerCapture(event.pointerId);

        const moveFlower = moveEvent => {
          const box = area.getBoundingClientRect();
          const left = Math.max(12, Math.min(88, ((moveEvent.clientX - box.left) / box.width) * 100));
          const bottom = Math.max(0, Math.min(145, box.bottom - moveEvent.clientY - 16));
          flower.style.setProperty('--bouquet-left', `${left}%`);
          flower.style.setProperty('--bouquet-bottom', `${bottom}px`);
        };
        const finishMove = finishEvent => {
          flower.classList.remove('dragging');
          canvas.classList.remove('dragging-bouquet');
          flower.removeEventListener('pointermove', moveFlower);
          flower.removeEventListener('pointerup', finishMove);
          flower.removeEventListener('pointercancel', finishMove);
          const tooClose = [...area.querySelectorAll('.bouquet-flower')].some(other => {
            if (other === flower) return false;
            const one = flower.getBoundingClientRect();
            const two = other.getBoundingClientRect();
            return Math.hypot((one.left + one.width / 2) - (two.left + two.width / 2), (one.top + one.height / 2) - (two.top + two.height / 2)) < 62;
          });
          if (tooClose) {
            flower.style.setProperty('--bouquet-left', startLeft);
            flower.style.setProperty('--bouquet-bottom', startBottom);
            document.getElementById('bouquetMessage').textContent = 'Give each flower a little more space.';
          } else {
            document.getElementById('bouquetMessage').textContent = 'Perfect! Keep arranging your bouquet.';
          }
        };
        flower.addEventListener('pointermove', moveFlower);
        flower.addEventListener('pointerup', finishMove);
        flower.addEventListener('pointercancel', finishMove);
      });
    }

    // Removes all flowers from the bouquet and starts again.
    function resetBouquet() {
      bouquetFlowers = [];
      document.getElementById('bouquetArea').innerHTML = '';
      document.getElementById('bouquetMessage').textContent = 'Pick a flower, then drag it into your bouquet.';
    }

    // Creates a neat finished-bouquet preview for the final summary card.
    function finishBouquet() {
      if (!bouquetFlowers.length) {
        document.getElementById('bouquetMessage').textContent = 'Pick at least one flower before you finish.';
        return;
      }
      const slots = [
        { left: '50%', bottom: '122px', tilt: '0deg', size: '.68' },
        { left: '44%', bottom: '111px', tilt: '-5deg', size: '.58' },
        { left: '56%', bottom: '111px', tilt: '5deg', size: '.58' },
        { left: '38%', bottom: '99px', tilt: '-9deg', size: '.5' },
        { left: '62%', bottom: '99px', tilt: '9deg', size: '.5' },
        { left: '33%', bottom: '87px', tilt: '-12deg', size: '.44' },
        { left: '67%', bottom: '87px', tilt: '12deg', size: '.44' }
      ];
      const previewCount = Math.min(7, bouquetFlowers.length);
      const previewFlowers = Array.from({ length: previewCount }, (_, index) => {
        const feeling = bouquetFlowers[Math.round(index * (bouquetFlowers.length - 1) / Math.max(1, previewCount - 1))];
        const item = emotions[feeling];
        const slot = slots[index];
        return `<div class="flower bouquet-preview-flower ${item.type}" style="--preview-left:${slot.left};--preview-bottom:${slot.bottom};--preview-tilt:${slot.tilt};--preview-size:${slot.size}">${flowerInside(item.type)}</div>`;
      }).join('');
      document.getElementById('summaryFlower').innerHTML = `<div class="bouquet-preview"><div class="preview-paper-back"></div>${previewFlowers}<div class="preview-wrap-left"></div><div class="preview-wrap-right"></div><div class="preview-bow"></div></div>`;
      document.getElementById('summaryTitle').textContent = 'Your bouquet is ready!';
      document.getElementById('summaryText').textContent = `You chose ${bouquetFlowers.length} ${bouquetFlowers.length === 1 ? 'flower' : 'flowers'} and made this bouquet your own.`;
      const action = document.getElementById('summaryAction');
      action.textContent = 'Start again ↻';
      action.onclick = () => {
        closeSummary();
        resetBouquet();
      };
      document.getElementById('summaryWrap').classList.add('show');
    }

    // Lets the player drag the large garden area to explore different soil rows.
    function setupGardenMovement() {
      const board = document.getElementById('gardenBoard');
      const beds = document.getElementById('beds');
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let startPanX = -58;
      let startPanY = -12;
      let panX = startPanX;
      let panY = startPanY;
      const placeGarden = () => {
        beds.style.setProperty('--garden-x', `${panX}px`);
        beds.style.setProperty('--garden-y', `${panY}px`);
      };
      placeGarden();
      board.addEventListener('pointerdown', event => {
        if (event.target.closest('.bed-flower')) return;
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startPanX = panX;
        startPanY = panY;
        beds.classList.add('dragging');
        board.setPointerCapture(event.pointerId);
      });
      board.addEventListener('pointermove', event => {
        if (!dragging) return;
        panX = Math.max(-190, Math.min(-4, startPanX + event.clientX - startX));
        panY = Math.max(-82, Math.min(-4, startPanY + event.clientY - startY));
        placeGarden();
      });
      const stopDragging = () => {
        dragging = false;
        beds.classList.remove('dragging');
      };
      board.addEventListener('pointerup', stopDragging);
      board.addEventListener('pointercancel', stopDragging);
    }

    // Creates a small burst of petals at the position of a click.
    function addPetalBurst(x, y) {
      const colors = ['#f3a8bf', '#ffd583', '#b9a6df', '#a8ddd0', '#f6b287'];
      for (let index = 0; index < 9; index++) {
        const petal = document.createElement('span');
        const angle = (Math.PI * 2 * index / 9) + (Math.random() * .35);
        const distance = 36 + Math.random() * 48;
        petal.className = 'petal-burst';
        petal.style.left = `${x}px`;
        petal.style.top = `${y}px`;
        petal.style.setProperty('--petal', colors[index % colors.length]);
        petal.style.setProperty('--petal-x', `${Math.cos(angle) * distance}px`);
        petal.style.setProperty('--petal-y', `${Math.sin(angle) * distance - 18}px`);
        petal.style.setProperty('--petal-rotate', `${120 + Math.random() * 240}deg`);
        document.body.appendChild(petal);
        window.setTimeout(() => petal.remove(), 980);
      }
    }

    // Adds small decorative reactions: petal bursts on buttons and sparkles on the home garden.
    function setupLittleGardenDetails() {
      document.addEventListener('pointerdown', event => {
        if (event.target.closest('.main-button, .game-choice, .card, .mood, .bouquet-choice, .water-pot-card')) {
          addPetalBurst(event.clientX, event.clientY);
        }
      });

      const homeGarden = document.querySelector('.hero-garden');
      let lastSparkle = 0;
      homeGarden.addEventListener('pointermove', event => {
        if (event.pointerType === 'touch' || Date.now() - lastSparkle < 110) return;
        lastSparkle = Date.now();
        const box = homeGarden.getBoundingClientRect();
        const sparkle = document.createElement('span');
        sparkle.className = 'garden-cursor-sparkle';
        sparkle.style.left = `${event.clientX - box.left}px`;
        sparkle.style.top = `${event.clientY - box.top}px`;
        homeGarden.appendChild(sparkle);
        window.setTimeout(() => sparkle.remove(), 840);
      });
    }

    // START-UP: builds each interactive activity once when the page first opens.
    buildGuide();
    buildWaterFlower();
    setupWaterCan();
    buildMatchGame();
    buildBouquetChoices();
    setupGardenMovement();
    setupLittleGardenDetails();

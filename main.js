new Vue({
    name: 'game',
    el: '#app',
    template: `
    <div id='#app' :class='cssClass'>
        <top-bar 
            :turn="turn" :current-player-index="currentPlayerIndex" :players="players" 
        />

        <div class="world">
            <castle v-for="(player, index) in players" :player="player" :index="index" />
            <div class="land" />
            <div class="clouds">
                <cloud v-for="index in 10" :type="(index - 1) % 5 + 1" />
            </div>
        </div>

        <transition name="hand">
            <hand v-if="!activeOverlay" :cards="currentHand" @card-play="handlePlayCard" @card-leave-end="handleCardLeaveEnd" />
        </transition>

        <transition name='fade'>
            <div class='overlay-background' v-if='activeOverlay'></div>
        </transition>
        
        <transition name='zoom'>
            <overlay v-if='activeOverlay' :key='activeOverlay' @close='handleOverlayClose'>
                <component :is="'overlay-content-' + activeOverlay" :player='currentPlayer' :opponent='currentOpponent' :players='players' />   
            </overlay>
        </transition>
        </div>`,
    data: state,
    computed: {
        cssClass () {
            return {
                'can-play': this.canPlay,
            }
        }
    },
    methods: {
        handlePlayCard(card) {
            playCard(card)
        },
        handleCardLeaveEnd() {
            applyCard()
        },
        handleOverlayClose () {
            console.log(state.activeOverlay);
            overlayCloseHandlers[this.activeOverlay]()
        },
    },
    mounted () {
        beginGame()
    }
})

state.activeOverlay = 'player-name';

var overlayCloseHandlers = {
    'player-name' () {
        if(state.players[0].name && state.players[1].name && state.visible) {
            state.activeOverlay = 'player-turn';
            state.visible = false;
        }
    },
    'player-turn' () {
        if(startTurn > 1) {
            state.activeOverlay = 'last-play';
        } else {
            newTurn()
        }
    },
    'last-play' () {
        newTurn()
    },
    'game-over' () {
        document.location.reload()
    }
}

// Window resize handling

window.addEventListener('resize', () => {
    state.worldRatio = getWorldRatio()
});

// Tween.js
requestAnimationFrame(animate);

function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
}

state.activeOverlay = 'player-name';

function beginGame() {
    state.players.forEach(drawInitialHand)
}

function playCard(card) {
    if(state.canPlay) {
        state.canPlay = false,
        currentPlayingCard = card

        // Remove the card from player hand
        const index = state.currentPlayer.hand.indexOf(card);
        state.currentPlayer.hand.splice(index, 1);

        // Add the card to the discard pile
        addCardToPile(state.discardPile, card.id);
    }
}
function applyCard() {
    const card = currentPlayingCard;

    applyCardEffect(card)

    setTimeout(() => {
        state.players.forEach(checkPlayerLost)

        if(isOnePlayerDead()) {
            endGame()
        } else {
            nextTurn()
        }
    }, 700)
}

function nextTurn() {
    state.turn++;
    state.currentPlayerIndex = state.currentOpponentId;
    state.activeOverlay = 'player-turn';
}

function newTurn() {
    state.activeOverlay = null;
    if(state.currentPlayer.skipTurn) {
        skipTurn()
    } else {
        startTurn()
    }
}

function skipTurn() {
    state.currentPlayer.skippedTurn = true;
    state.currentPlayer.skipTurn = false;
    nextTurn()
}

function startTurn() {
    state.currentPlayer.skippedTurn = false
    if(state.turn > 2) {
        setTimeout(() => {
            state.currentPlayer.hand.push(drawCard())
            state.canPlay = true
        }, 800)
    } else {
        state.canPlay = true
    }
}

function endGame() {
    state.activeOverlay = 'game-over';
}
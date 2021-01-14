class Card {
    constructor(suit, value, intValue) {
        this.suit = suit;
        this.value = value;
        this.intValue = intValue;
    }

    getCardString() {
        return this.suit + this.value + "(" + this.intValue + ")";
    }
}

class Deck {
    constructor() {
        this.deck = Deck.generateDeck();
    }

    static generateDeck() {
        let newDeck = [];
        const suits = ["♣", "♦", "♥", "♠"];
        const values = [
            "A",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "J",
            "Q",
            "K",
        ];

        for (let i = 0; i < suits.length; i++) {
            for (let j = 0; j < values.length; j++) {
                newDeck.push(new Card(suits[i], values[j], j + 1));
            }
        }
        return newDeck;
    }

    draw() {
        return this.deck.pop();
    }

    printDeck() {
        console.log("Displaying cards...");
        for (let i = 0; i < this.deck.length; i++) {
            console.log(this.deck[i].getCardString());
        }
    }

    shuffleDeck() {
        let deckSize = this.deck.length;
        for (let i = deckSize - 1; i >= 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }
}

class Dealer {
    static startGame() {
        let amountOfPlayers = 2;
        let table = {
            players: [],
            deck: new Deck(),
        };
        // デッキをシャッフル
        table["deck"].shuffleDeck();

        // カードを5枚引く
        for (let i = 0; i < amountOfPlayers; i++) {
            let playerCard = [];
            for (let j = 0; j < 5; j++) {
                playerCard.push(table["deck"].draw());
            }
            table["players"].push(playerCard);
        }
        return table;
    }

    static searchCards(cache, cards, switchFlg) {
        let intArr = [];

        for (let i = 0; i < cards.length; i++) {
            if (cache[cards[i]] >= 2 && switchFlg == "pairs") {
                intArr.push(cards[i]);
            }
            if (cache[cards[i]] === 1 && switchFlg == "noPairs") {
                intArr.push(cards[i]);
            }
        }
        if (intArr.length == 0) return -1;
        // 配列内の重複を削除して返す
        let resultCards = Array.from(new Set(intArr));

        return resultCards;
    }

    static winnerPlayer(table) {
        let player1 = [];
        let player2 = [];
        let cache1 = {};
        let cache2 = {};

        // 扱いにくいので１次元配列に変換する
        for (let i = 0; i < table["players"].length - 1; i++) {
            for (let j = 0; j < table["players"][i].length; j++) {
                player1.push(table["players"][i][j].intValue);
                player2.push(table["players"][i + 1][j].intValue);
            }
        }

        // プレイヤーの手札にある同じ数のカードをcacheにカウントしていく
        for (let i = 0; i < player1.length; i++) {
            if (cache1[player1[i]] === undefined) cache1[player1[i]] = 1;
            else cache1[player1[i]] += 1;

            if (cache2[player2[i]] === undefined) cache2[player2[i]] = 1;
            else cache2[player2[i]] += 1;
        }

        // ２枚以上あるカードを抽出する
        // １枚のみだと-1が戻り値となる
        let cards1 = Dealer.searchCards(cache1, player1, "pairs");
        let cards2 = Dealer.searchCards(cache2, player2, "pairs");

        // ランク数が異なる場合
        if (cards1 != -1 && cards2 == -1) {
            return "player1";
        } else if (cards1 == -1 && cards2 != -1) {
            return "player2";
        }

        // ランク数が同じで１枚のみしかないカードを数える
        if (cards1 == -1 && cards2 == -1) {
            cards1 = Dealer.searchCards(cache1, player1, "noPairs");
            cards2 = Dealer.searchCards(cache2, player2, "noPairs");
        }

        // ランク数が同じで2枚以上ある場合
        // 最大値を決める
        let maxValue1 = HelperFunction.getMaxValue(cards1);
        let maxValue2 = HelperFunction.getMaxValue(cards2);

        // カードの強さを比較する
        let result = HelperFunction.getStrongCards(maxValue1, maxValue2);

        return result;
    }
}

class HelperFunction {
    static getStrongCards(maxValue1, maxValue2) {
        let rank = {
            2: 0,
            3: 1,
            4: 2,
            5: 3,
            6: 4,
            7: 5,
            8: 6,
            9: 7,
            10: 8,
            11: 9,
            12: 10,
            13: 11,
            1: 12,
        };
        if (rank[maxValue1] > rank[maxValue2]) {
            return "player1";
        } else if (rank[maxValue1] < rank[maxValue2]) {
            return "player2";
        } else {
            return "draw";
        }
    }

    static getMaxValue(cards) {
        let maxValue = cards[0];
        for (let i = 1; i < cards.length; i++) {
            if (cards[i] > maxValue) {
                maxValue = cards[i];
            }
        }
        return maxValue;
    }
}

let table1 = Dealer.startGame();
console.log(table1["players"]);
console.log(Dealer.winnerPlayer(table1));

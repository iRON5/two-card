
<div style="background: #308b5a; padding: 10px; color: #fef72d">

# Game flow

```
                         ________________ filter round winners ________________
                        |                                                     |
                        v                                                     |
Prepare -> Start -> Deal cards -> Wait for open -> Open –> Compare -> Wait for next round
            |                                                 |
            v                                                 v
      create players                                  show winner and stop
            +
        reset temp
```

# Test Project

<p>
Create a mini game where clicking the button generate several hand cards. Please be sure to fork this repo, update this readme with any notes on your code.
</p>

- a hand has seven cards
- the winner of the game will be by the amount of pairs a hand has
- each "deal" will create a brand new "game" with new hands
- display those hands
- mark each hand "pairs" with proper border. Be sure to that diff pairs has diff borders
- game has two hands by default
- organized code

### Extra

- option to add or remove hands 2-4
- tests

### Helpers

#### example card
<img src="http://h3h.net/images/cards/diamond_9.svg" />

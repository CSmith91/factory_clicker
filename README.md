# Factory Clicker
Based on the automation game Factorio

Play 'Factory Clicker' [here.](https://applewell.xyz/factory_clicker/)




## Current state of game
The game is coded up to belts and inserters. The tech for boilers and electric drills is available, but nothing will happen on unlocking this tech.

### New Features 1.1.0 - Smart Crafting & UI update
- 'Smart crafting' is now coded into the game. When a craft request is sent, if the exact items required for the craft aren't available, the game will go down the tree of intermediary products to see if it's possible to craft those missing items using their components, all the way down to raw ore and base ingredients.
  - Another feature of this is how it handles bulk crafting (see below)
- Single-crafted items can be cancelled if users right-click the item on the craft queue.
- Bulk crafting. A batch of 5 of one item is sent to the craft queue on right-click. This combines with the smart crafting to consider:
  - Running out of core items mid-way and swapping to base ingredients
  - Factoring in the hammer cost, including if extra items are needed to be crafted in the process
  - Crafting as many of the desired item as possible and stopping if either ingredients run out or if the hammer breaks
  - Grouping components and smart rounding: when items with an odd number of multi-components is bulk crafted, the craft logic will craft the minimum amount of an ingredient.
  - - E.g. green chips use 3 wire, 2 wire is made by 1 copper plate. Bulk crafting 5 green chips with no smart logic and no wire (but enough copper plate) will send a request of 10 copper plates to 20 wire, using 15 wire (and so 5 wire leftover). Smart craft sees this and rounds it down to only requesting 8 copper plate, making 16 wire. 15 wire will then be spent and 1 wire will be added to the inventory as a surplus
  - UI reflects this smart rounding and also smart stacking
    - E.g. A - A - A becomes A3
    - A - B - A - B doesn't change
    - A - B - B - B - A - A becomes A - B3 - A2

## Game Start
![image](https://github.com/user-attachments/assets/8d5dc6bb-bf09-4632-a778-472511a7ee70)

## Late Game in Present State
![image](https://github.com/user-attachments/assets/4b99961d-d9b0-4ecd-93a5-695df8031886)


## Limitations
This is NOT formatted for mobile devices (yet)!
Foundations for furnaces, drills, belts, inserters is done. Electricity mechanics are also being implemented.

## Todos / Nice-to-haves
### Cancelling bulk craft
A major struggle has been implementing cancelling crafting from bulk crafts. Bulk crafts occur when the user right-clicks, which sends 5 of the item to the craft queue. The main issue encountered is how to handle the refundz and the best means to test it to bulk crafting green chips and red chips, which are intermediary items in the live version of the game (but red chips haven't been given unlock conditions yet). Using both of these is a good test because both use wire (which is made 1 to 2) and red uses an even number of wire and green uses an odd number. When combined with the smart crafting logic, reversing all the steps correctly has proved challenging. Another part of this difficulty lies in the different scenarios covered. There are four possible cancellation scenarios:
- single cancellation request to a single craft (easy, done)
- bulk cancellation request to a single craft that's stacked
- single cancellation request to a bulk craft
- bulk cancellation request to a bulk craft
The frameworks for the fix are built with the code commented out, as bugs have led to a bottleneck in development and so this has been shelved for the meantime. This is feasible as we can still expand the game without this core code changing

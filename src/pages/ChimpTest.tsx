import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import Result from '../components/Result';
import GameLayout from '../layout/GameLayout';

type Props = {
  num?: number,
  spot: {row: number, col: number},
}

type ListProps = {
  items: Props[];
}

// Generate random spot  
function randomSpot(){  
  const row = Math.trunc(Math.random() * 8) + 1;
  const col = Math.trunc(Math.random() * 10) + 1;
  
  return { row, col };
}

// Check if spot is occupied
// Avoids multiple squares going on the same spot
function checkOccupiedSpot(items: Props[], spot: { row: number, col: number }){
  let checkSpot = items.find((item) => JSON.stringify(item.spot) === JSON.stringify(spot));

  while (checkSpot !== undefined) {

    // Generate new random spot
    const row = randomSpot().row;
    const col = randomSpot().col;
    spot = { row, col };

    // Check if the new spot is occupied
    checkSpot = items.find((item) => JSON.stringify(item.spot) === JSON.stringify(spot));
  }

  return spot;
}

const ChimpTest = () => {

  // Could be improved with useReduce, but use useState for now
  // Array of the squares
  const [items, setItems] = useState<Props[]>([]);

  // Game states
  const [hidden, setHidden] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [round, setRound] = useState(1);

  function handleClick(e: React.MouseEvent<HTMLElement>){
    let index = 0;
    const currentItemValue = items[index].num;
    const clickedItemValue = parseInt((e.currentTarget.getAttribute("data-num")) as string);

    if(currentItemValue !== clickedItemValue){
      setGameOver(true);
    }

    setHidden(true);
    setItems(items.slice(1));
    index++;

    // If array is empty == you didn't fail, then move to next round
    // Check if length === 1 instead of 0 since useState gives the state before items.slice(1) takes effect
    if(items.length === 1){
      setRound(round + 1);
      setHidden(false);
    }
  }

  // Initialize squares
  // If gameOver state changes, run this function (reinitializes squares after restart)
  // If round # changes, run this function (increments the number of squares after each round)
  // Responsible for making the game keep going after every round
  useEffect(() => {
    const newInitialItems: Props[] = [];

    for (let i = 0; i < round + 3; i++) {
      const row = randomSpot().row;
      const col = randomSpot().col;
      const spot = { row, col };
      const index = i + 1;
      
      const newInitialItem = {
        num: index,
        spot: checkOccupiedSpot(newInitialItems, spot),
      };
      newInitialItems.push(newInitialItem);
    }
    setItems([...items, ...newInitialItems]);
  }, [gameOver || round]);

  // Add squares
  // const handleAddItem = useCallback(() => {
  //   const row = randomSpot().row;
  //   const col = randomSpot().col;
  //   const spot = { row, col };
  //   const index = items.length + 1;
    
  //   const newItem = {
  //     num: index,
  //     spot: checkOccupiedSpot([...items], spot),
  //   };

  //   setItems([...items, newItem]);
  // }, [items]);

  // Reset everything
  function restart(){
    setHidden(false);
    setGameOver(false);
    setRound(1);
    setItems([]);
  }

  // The square element you click on
  const Square: React.FC<Props> = React.memo((props) => {
    return (
      <div className={hidden ? 'bg-white chimp-square' : 'bg-black chimp-square'}
        onClick={handleClick}
        style={{ gridRow: props.spot.row, gridColumn: props.spot.col }}
        data-num={props.num}
      >
        {hidden ? null : props.num}
      </div>
    )
  });

  // Memoized list of squares
  const MyList: React.FC<ListProps> = ({ items }) => {
    const update = useRef(true);

    // Allows the memoizedList to be computed only when the items array changes
    // Without this useEffect, memoizedList would be recomputed on every render
    useEffect(() => {
      update.current = true;
    
      return () => {
        update.current = false;
      }
    }, [items]);

    const memoizedList = useMemo(
      () =>
        items.map((item, index) => (
          <Square key={index} {...item} />
        )),
      [items]
    );

    return (
      <>
        {memoizedList}
      </>
    )
  }

  return (
    <GameLayout>
      {gameOver ?
        <Result restart={restart}>
          <h2 className='pointer-events-none'>Numbers: {round + 3}</h2>
        </Result>
        :
        <div className='grid gap-2 grid-cols-10-90px grid-rows-8-90px'>
          <MyList items={items} />
        </div>}
    </GameLayout>
  )
}

export default ChimpTest
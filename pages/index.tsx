'use client'
import { useEffect, useRef, useState } from 'react'
import checkWinner from '../utils/checkWinner'
export type Players = '✕' | '○'
export type Options = 'empty' | '✕' | '○'
export type Selected = {
  selected: Array<Options>
  player: Players
  currLength: number
}
export default function TicTacToe() {
  const [{ selected, player, currLength }, setSelected] = useState<Selected>({
    selected: ['empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty', 'empty'],
    player: '○',
    currLength: 3,
  })
  const inputRef = useRef<HTMLInputElement>(null)
  function generateGrid() {
    if (!inputRef.current) return
    if (!inputRef.current.value || isNaN(parseInt(inputRef.current.value))) return
    const val = parseInt(inputRef.current.value)
    const curr = val > 12 ? 12 : val
    const newStateAray = new Array(curr * curr).fill('empty')
    setSelected({
      selected: newStateAray,
      player: '○',
      currLength: curr,
    })
  }
  //This looks like a mistake but canClick has nothing to do with state or page rendering,
  // just if you can click on an element or no and should be reset everytime something gets rendered
  let canClick = true
  console.log('The things:', { selected, player, currLength })

  function handleClick(index: number) {
    if (selected[index] === 'empty') {
      setSelected(({ selected: currentSelected, player: currentPlayer, currLength }) => {
        return {
          selected: currentSelected.map((el: Options, i: number) => {
            if (index === i) return player
            return el
          }),
          player: currentPlayer === '✕' ? '○' : '✕',
          currLength,
        }
      })
    }
  }
  const gridLength = `grid-cols-${currLength}`

  function restart(isTie = false) {
    alert(isTie ? 'You tied :(' : `Congrats ${player === '✕' ? '○' : '✕'}`)
    setSelected((prev) => {
      return {
        selected: new Array(prev.selected.length).fill('empty'),
        player: '○',
        currLength: prev.currLength,
      }
    })
  }
  useEffect(() => {
    let timeOut: NodeJS.Timeout | number
    console.log({ player, selected, currLength })
    const didWin = checkWinner(player, selected, currLength)
    if (didWin) {
      canClick = false
      console.log({ didWin })
      timeOut = setTimeout(restart, 500)
    }
    const isFilled = selected.every((value) => value !== 'empty')
    if (isFilled && !didWin) {
      console.log({ falseDidWin: didWin })
      canClick = false
      timeOut = setTimeout(() => restart(true), 500)
    }
    return () => {
      if (timeOut) clearTimeout(timeOut)
    }
  }, [player, selected])

  return (
    <main className='my-auto h-screen flex-col content-center justify-center '>
      <form
        action='#'
        className='mx-auto mt-2 flex flex-col'
        onSubmit={(e) => {
          e.preventDefault()
          generateGrid()
        }}
      >
        <input
          ref={inputRef}
          className='mx-auto w-40 rounded-sm bg-gray-500 p-1 '
          type='number'
          max={12}
          min={2}
          placeholder='Input number (≤12)'
        />
        <button className='mx-auto my-2 w-max rounded-full border border-black p-2'>
          Generate alternate grid
        </button>
      </form>

      <div className='grid place-content-center'>
        <div className={`grid ${gridLength} content-center text-center text-9xl`}>
          {selected.map((element, i) => {
            return (
              <div
                key={i}
                onClick={() => canClick && handleClick(i)}
                className='m-2 h-32 w-32 bg-gray-500'
              >
                {selected[i] !== 'empty' ? (selected[i] === '✕' ? '✕' : '○') : ''}{' '}
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

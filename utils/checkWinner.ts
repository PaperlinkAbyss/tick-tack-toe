import { Options, Players } from '../pages'

export default function checkWinner(checkNextPlayer: Players, state: Options[], length: number) {
  //State is behind so I check the other player
  const currentPlayer = checkNextPlayer === '○' ? '✕' : '○'
  //Winning conditions: 0 1 2, 3 4 5,  6 7 8 (l*i+j) (horizontal lines)
  //0 3 6, 1 4 7, 2 5 8 (i+l*j) (vertical lines)
  //0 5 8, 2 4 6 (diagonals)
  //(main diagonal: j+length+j)
  //(secondary diagonal: (l-1)(j+1))
  for (let i = 0; i < length; i++) {
    let counterH = 0,
      counterV = 0,
      counterD = 0,
      counterD2 = 0
    for (let j = 0; j < length; j++) {
      if (state[j + length * i] === currentPlayer) counterH++
      if (state[i + length * j] === currentPlayer) counterV++
      if (i === 0) {
        if (state[j + length * j] === currentPlayer) counterD++
        if (state[(length - 1) * (j + 1)] === currentPlayer) counterD2++
      }
    }
    if (counterH === length) return true
    if (counterV === length) return true
    if (i === 0) {
      if (counterD === length) return true
      if (counterD2 === length) return true
    }
  }
  //The loop has finished checking if the player won, so
  return false
}

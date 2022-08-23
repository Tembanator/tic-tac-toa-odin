const gameBoard = () => {
    const cells = document.querySelectorAll('.box')
    let board = ['', '', '', '', '', '', '', '', '']

    //tie screen board to code board
    cells.forEach((cell, index) => {
        if (cell.classList.contains('cross')) {
            board[index] = 'cross'
        }
        if (cell.classList.contains('round')) {
            board[index] = 'round'
        }

    })

    const populatePageBoard = () => {
        cells.forEach((cell, index) => {
            cell.classList.remove('cross')
            cell.classList.remove('round')
            cell.classList.remove('marked')
            if (board[index] !== '') {
                cell.classList.add(board[index])
                cell.classList.add('marked')
            }
        });
    }

    const addMarker = (marker, cellPosition) => {
        if (board[cellPosition] === '') {
            board[cellPosition] = marker
            populatePageBoard()
        }
    }

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', '']
        populatePageBoard()
    }

    return { populatePageBoard, addMarker, resetBoard }
}

const playerGenerator = (name, marker, current) => {
    return { name, marker, current }
}

const gameController = () => {
    const playgroundContainer = document.querySelector('.playground-container')
    const board = document.querySelector('.board')
    const result = document.querySelector('.result')
    const player1Element = document.querySelector('.player-1')
    const player2Element = document.querySelector('.player-2')

    let currentPlayer = ''
    let player1 = ''
    let player2 = ''

    const resetPlayers = () => {

        //generate players
        player1 = playerGenerator('Player 1', 'cross', true)
        player2 = playerGenerator('Player 2', 'round', false)

        currentPlayer = player1
        player1Element.classList.remove('active')
        player2Element.classList.remove('active')

        player1Element.classList.add('active')
        board.classList.add(`${player1.marker}`)
    }

    resetPlayers()

    const switchPlayers = () => {
        player1.current = !player1.current
        player2.current = !player2.current

        player1Element.classList.remove('active')
        player2Element.classList.remove('active')
        board.classList.remove(`${player1.marker}`)
        board.classList.remove(`${player2.marker}`)

        if (player1.current) {
            player1Element.classList.add('active')
            board.classList.add(`${player1.marker}`)
            currentPlayer = player1
        }
        if (player2.current) {
            player2Element.classList.add('active')
            board.classList.add(`${player2.marker}`)
            currentPlayer = player2
        }
    }

    //handle cell click
    const clickOnCell = (() => {
        const cells = document.querySelectorAll('.box')
        cells.forEach((cell, index) => {
            cell.addEventListener('click', () => {
                const board = gameBoard()
                board.addMarker(currentPlayer.marker, index)

                if (win().winner) {
                    toggleDisplay(win().message)
                } else if (draw()) {
                    toggleDisplay('Draw')
                } else {
                    switchPlayers()
                }
            })
        })
    })()

    const draw = () => {
        let draw = false
        const cells = document.querySelectorAll('.box')

        draw = Array.from(cells).every(cell => cell.classList.contains('marked'))
        return draw
    }

    const win = () => {
        let winner = false
        let message = 'Draw'

        const winningCombo = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        winningCombo.forEach((combo, index) => {
            const winning = combo.every(elem => playerMarkedCells().includes(elem))
            if (winning) {
                winner = winning
                message = currentPlayer.name + ' has won!'
            }
        })
        return { winner, message }
    }

    const playerMarkedCells = () => {
        const cells = document.querySelectorAll('.box')
        const marked = []
        cells.forEach((cell, index) => {
            if (cell.classList.contains(currentPlayer.marker)) {
                marked.push(index)
            }
        })

        return marked
    }

    const restartGame = (() => {
        const restartBtnInvert = document.querySelector('.inveted-btn')
        const restartBtnIngame = document.querySelector('.in-game')

        restartBtnIngame.addEventListener('click', () => {
            resetPlayers()
            gameBoard().resetBoard()
            // gameBoard().populatePageBoard()
        })
        restartBtnInvert.addEventListener('click', () => {
            resetPlayers()
            gameBoard().resetBoard()
            toggleDisplay('Draw')
        })
    })()

    const toggleDisplay = (message) => {
        const resultMessage = document.querySelector('.message')
        if (playgroundContainer.classList == 'playground-container show') {
            playgroundContainer.classList = 'playground-container hide'

        } else if (playgroundContainer.classList == 'playground-container hide') {
            playgroundContainer.classList = 'playground-container show'
        }

        if (result.classList == 'result show') {
            result.classList = 'result hide'
        } else if (result.classList == 'result hide') {
            result.classList = 'result show'
        }
        resultMessage.innerHTML = message
    }

    return { toggleDisplay, switchPlayers }
}

const controller = gameController()
const board = gameBoard()
board.populatePageBoard()
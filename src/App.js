import React, { Component } from 'react';
import './App.css';
import bg_music from './assets/battle.wav';

class App extends Component {

  constructor(){

    super();
    this.SQUARE_W   = 150;
    this.SQUARE_H   = 150;
    this.SIZE       = 3;
    this.BOARD_W    = this.SQUARE_W*this.SIZE;
    this.BOARD_H    = this.SQUARE_H*this.SIZE;
    this.players    = ["X","O"];
    //
    this.bg_m = new Audio(bg_music); 
    if (typeof this.bg_m.loop == 'boolean')
    {
      this.bg_m.loop = true;
    }
    else
    {
      this.bg_m.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
      }, false);
    }
    this.bg_m.play();
    //
    this.state = {
      board:[],
      currentPlayer:'',
      isEmptySquare:true,
      gameOver:false,
      theWinner:''
    }
    this.createBoard = ()=>{
      const board = [];
      for (let index = 0; index < this.SIZE*this.SIZE; index++) {
        board.push({id:index,player:""})
      }
      return board;
    }
    this.randomPlayer = ()=>{ 
      const index = Math.floor(Math.random()*this.players.length);
      return this.players[index];
    }

    this.state.board = this.createBoard();
    this.state.currentPlayer = this.randomPlayer();
  }

  handlePlayer = (id)=>{
    
    const board = [...this.state.board];
    let currentPlayer = this.state.currentPlayer;
    const index = board.findIndex((square)=>{return square.id===id});
    let isEmptySquare = this.state.isEmptySquare;

    if(isEmptySquare){

      board[index].player = currentPlayer;
  
      this.setState(()=>{
        // console.log("updater from setState")
        if(currentPlayer==='X')currentPlayer='O'
        else currentPlayer='X'
        return {
          board,
          currentPlayer,
        };
      },()=>{
        // console.log("callback from setState")
        const {board,currentPlayer} = this.state;
        let theWinner='';
        if(this.isAllSquaresAreTaken(board) && this.check(board)===false){
          this.bg_m.pause();
          // console.log("draw");
          theWinner="😃 draw 😃";

          this.setState(()=>{
            return {
              gameOver:true,
              theWinner
            }
          })

        }else if(this.isAllSquaresAreTaken(board) && this.check(board)===true){
          this.bg_m.pause();
          // console.log("Hard victory")
          if(currentPlayer==='O'){theWinner='The winner is X';console.log("The winner is",theWinner);}
          else {theWinner='The winner is O';console.log("The winner is",theWinner);}

          this.setState(()=>{
            return {
              gameOver:true,
              theWinner
            }
          })

        }else if(!this.isAllSquaresAreTaken(board) && this.check(board)===true){
          // console.log("Easy vicory");
          this.bg_m.pause();
          if(currentPlayer==='O'){theWinner='The winner is X';console.log("The winner is",theWinner);}
          else {theWinner='The winner is O';console.log("The winner is",theWinner);}

          this.setState(()=>{
            return {
              gameOver:true,
              theWinner
            }
          })
        };
      });
    }
  }

  //
  handleError = (id) => {
    // console.log(id);
    const board = [...this.state.board];
    const index = board.findIndex((square)=>{return square.id===id});
    const isEmptySquare = this.isEmptySquare(board,index);

    this.setState({
      isEmptySquare
    })
  }
  
  //
  isEmptySquare = (board,index) => {
    return board[index].player==="";
  }
  //
  isAllSquaresAreTaken = (board) =>{
      for (let index = 0; index < board.length; index++) {
        if(this.isEmptySquare(board,index)) return false;
      }
      return true;//There is no free place
  }
  //
  check = (board)=>{
    if(   (board[0].player===board[1].player && board[1].player===board[2].player && board[0].player!=='')
      ||  (board[3].player===board[4].player && board[4].player===board[5].player && board[3].player!=='')
      ||  (board[6].player===board[7].player && board[7].player===board[8].player && board[6].player!=='')
      ||  (board[0].player===board[3].player && board[3].player===board[6].player && board[0].player!=='')
      ||  (board[1].player===board[4].player && board[4].player===board[7].player && board[1].player!=='')
      ||  (board[2].player===board[5].player && board[5].player===board[8].player && board[2].player!=='')
      ||  (board[0].player===board[4].player && board[4].player===board[8].player && board[0].player!=='')
      ||  (board[2].player===board[4].player && board[4].player===board[6].player && board[2].player!=='')
    )
    {
      return true;
    }
    return false;
  }
  //
  handleStart = () =>{
    // console.log("START NEW GAME");
    this.resetGame();
  }
  //
  resetGame = () => {
    // console.log("RESET GAME!");
    const state = {...this.state};
    state.board = this.createBoard();
    state.currentPlayer = this.randomPlayer();
    this.bg_m.play();
    
    this.setState(()=>{
      return {
        ...state,
        isEmptySquare:true,
        gameOver:false,
        theWinner:''
      }
    })
  } 
  render() {
    const {board,currentPlayer,isEmptySquare,gameOver,theWinner} = this.state;

    let boardContext = board.map((square)=>{
      return (
        <div 
        key={square.id} 
        className="square" 
        onClick={()=>{this.handlePlayer(square.id)}}
        onMouseOver={()=>this.handleError(square.id)}
        >
        {square.player}
        </div>
      )
    });
    if(gameOver){
      boardContext=(
        <div className="result-board">
          <p className="game-over">GAME OVER</p>
          <span className="game-pad" role="img" aria-label="game-pad">🎮</span>
          {theWinner !== '' ? <p className="the-winner">{theWinner}</p> : null}
          <button className="try-again" onClick={()=>{this.handleStart()}}>Try again</button>
        </div>
        )
    }
    

    return (
     <div className="App">
        <div className="dashboard">
            <h2>Controls</h2>
            <p>Player's turn</p>
            <div className="active-player-wrapper">
              <div className="square active-player">{currentPlayer}</div>
            </div>
            <button className="reset-game" onClick={()=>this.resetGame()}>Reset Game</button>
        </div>
        <div className="game-board">
          <h1>Tic Tac Toe <span role="img" aria-label="game image"> 😄 </span> </h1>
          <div className="board">
            {
              boardContext
            }
          </div>
          <div className="tips">
            {isEmptySquare ? null : <p>That place is taken <span role="img" aria-label="error image">😢</span></p>}
          </div>
        </div>
     </div>
    );
  }
}

export default App;

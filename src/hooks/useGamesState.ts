import { useState, useCallback } from 'react';
import { supabase } from '../integrations/client';
import { GameState, Player, SNAKES, LADDERS } from '../lib/gameData';
import { playDiceRollSound, playMoveSound, playSnakeSound, playLadderSound, playWinSound } from '@/lib/sounds';

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [diceValue, setDiceValue] = useState(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [message, setMessage] = useState<string>('');

  const createGame = async (playerNames: string[]): Promise<string | null> => {
    const players: Player[] = playerNames.map((name, index) => ({
      name,
      position: 0,
      colorIndex: index,
    }));

    const { data, error } = await supabase
      .from('game_sessions')
      .insert({
        players: players as any,
        current_turn: 0,
        winner_index: null,
        is_active: true,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error creating game:', error);
      return null;
    }

    // Update games_played count for all players
    for (const name of playerNames) {
      await updateLeaderboard(name, false);
    }

    setGameState({
      id: data.id,
      players,
      currentTurn: 0,
      winnerIndex: null,
      isActive: true,
    });

    return data.id;
  };

  const updateLeaderboard = async (playerName: string, isWinner: boolean) => {
    const normalizedName = playerName.trim();
    if (!normalizedName) return;

    // Check if player exists
    const { data: existing } = await supabase
      .from('leaderboard')
      .select('*')
      .ilike('player_name', normalizedName)
      .single();

    if (existing) {
      // Update existing player
      await supabase
        .from('leaderboard')
        .update({
          wins: isWinner ? existing.wins + 1 : existing.wins,
          games_played: existing.games_played + 1,
          last_played_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Insert new player
      await supabase
        .from('leaderboard')
        .insert({
          player_name: normalizedName,
          wins: isWinner ? 1 : 0,
          games_played: 1,
        });
    }
  };

  const loadGame = async (gameId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('id', gameId)
      .single();

    if (error || !data) {
      console.error('Error loading game:', error);
      return false;
    }

    const players = Array.isArray(data.players) ? data.players as unknown as Player[] : [];

    setGameState({
      id: data.id,
      players,
      currentTurn: data.current_turn,
      winnerIndex: data.winner_index,
      isActive: data.is_active,
    });

    return true;
  };

  const saveGame = async (state: GameState) => {
    if (!state.id) return;

    await supabase
      .from('game_sessions')
      .update({
        players: state.players as any,
        current_turn: state.currentTurn,
        winner_index: state.winnerIndex,
        is_active: state.isActive,
      })
      .eq('id', state.id);
  };

  const rollDice = useCallback(async () => {
    if (!gameState || isRolling || isMoving || gameState.winnerIndex !== null) return;

    setIsRolling(true);
    playDiceRollSound();

    // Animate dice for 800ms
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
    }, 100);

    await new Promise(resolve => setTimeout(resolve, 800));
    clearInterval(rollInterval);

    const finalValue = Math.floor(Math.random() * 6) + 1;
    setDiceValue(finalValue);
    setIsRolling(false);

    // Process move
    await processMove(finalValue);
  }, [gameState, isRolling, isMoving]);

  const processMove = async (diceValue: number) => {
    if (!gameState) return;

    setIsMoving(true);
    const currentPlayer = gameState.players[gameState.currentTurn];
    const newPosition = currentPlayer.position + diceValue;

    // Check if move is valid
    if (newPosition > 100) {
      setMessage(`${currentPlayer.name} needs exactly ${100 - currentPlayer.position} to win!`);
      setTimeout(() => setMessage(''), 2000);
      
      // Move to next player
      const nextTurn = (gameState.currentTurn + 1) % gameState.players.length;
      const newState = { ...gameState, currentTurn: nextTurn };
      setGameState(newState);
      await saveGame(newState);
      setIsMoving(false);
      return;
    }

    // Animate step-by-step movement
    let currentPos = currentPlayer.position;
    for (let i = 0; i < diceValue && currentPos < 100; i++) {
      currentPos++;
      playMoveSound();
      
      const updatedPlayers = [...gameState.players];
      updatedPlayers[gameState.currentTurn] = { ...currentPlayer, position: currentPos };
      setGameState(prev => prev ? { ...prev, players: updatedPlayers } : null);
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    let finalPosition = currentPos;

    // Check for snake
    if (SNAKES[finalPosition]) {
      setMessage(`🐍 Oh no! ${currentPlayer.name} got bitten by a snake!`);
      await new Promise(resolve => setTimeout(resolve, 500));
      playSnakeSound();
      finalPosition = SNAKES[finalPosition];
    }
    // Check for ladder
    else if (LADDERS[finalPosition]) {
      setMessage(`🪜 Yay! ${currentPlayer.name} climbed a ladder!`);
      await new Promise(resolve => setTimeout(resolve, 500));
      playLadderSound();
      finalPosition = LADDERS[finalPosition];
    }

    // Update final position
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentTurn] = { ...currentPlayer, position: finalPosition };

    // Check for winner
    let winnerIndex: number | null = null;
    if (finalPosition === 100) {
      winnerIndex = gameState.currentTurn;
      setMessage(`🎉 ${currentPlayer.name} wins the game!`);
      playWinSound();
      
      // Update leaderboard with win
      await updateLeaderboard(currentPlayer.name, true);
    }

    const nextTurn = winnerIndex !== null ? gameState.currentTurn : (gameState.currentTurn + 1) % gameState.players.length;
    
    const newState: GameState = {
      ...gameState,
      players: updatedPlayers,
      currentTurn: nextTurn,
      winnerIndex,
      isActive: winnerIndex === null,
    };

    setGameState(newState);
    await saveGame(newState);
    
    setTimeout(() => setMessage(''), 3000);
    setIsMoving(false);
  };

  const resetGame = async () => {
    if (!gameState) return;

    const resetPlayers = gameState.players.map(p => ({ ...p, position: 0 }));
    const newState: GameState = {
      ...gameState,
      players: resetPlayers,
      currentTurn: 0,
      winnerIndex: null,
      isActive: true,
    };

    setGameState(newState);
    setDiceValue(1);
    setMessage('');
    await saveGame(newState);
  };

  return {
    gameState,
    diceValue,
    isRolling,
    isMoving,
    message,
    createGame,
    loadGame,
    rollDice,
    resetGame,
  };
};

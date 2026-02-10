import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GameBoard from '../components/GameBoard';
import GameSidebar from '../components/GameSidebar';
import WinnerModal from '../components/WinnerModal';
import Leaderboard from '../components/Leaderboard';
import { useGameState } from '../hooks/useGamesState';
import { playButtonSound } from '../lib/sounds';
import { Home, RotateCcw, Volume2, VolumeX, Menu, X } from 'lucide-react';

const Game: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { 
    gameState, 
    diceValue, 
    isRolling, 
    isMoving, 
    message, 
    diceHistory,
    loadGame, 
    rollDice, 
    resetGame,
    forceResetSession 
  } = useGameState();
  
  const [isLoading, setIsLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'game' | 'players' | 'stats'>('game');

  useEffect(() => {
    const init = async () => {
      if (gameId) {
        const success = await loadGame(gameId);
        if (!success) {
          navigate('/');
        }
      }
      setIsLoading(false);
    };
    init();
  }, [gameId]);

  const handleGoHome = () => {
    if (soundEnabled) playButtonSound();
    navigate('/');
  };

  const handlePlayAgain = async () => {
    if (soundEnabled) playButtonSound();
    await resetGame();
  };

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleResetSession = () => {
    forceResetSession();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-950">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-white animate-pulse">Loading Game...</p>
            <p className="text-sm text-gray-400">Preparing your game experience</p>
          </div>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="relative z-10 text-center bg-gray-800 p-8 rounded-2xl max-w-md mx-4 border border-gray-700">
          <div className="relative mb-8">
            <div className="text-8xl mb-6">🎲</div>
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">Game Not Found</h2>
          <p className="text-gray-400 mb-8">
            This game seems to have vanished into the void.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const winner = gameState.winnerIndex !== null ? gameState.players[gameState.winnerIndex] : null;

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between h-16 bg-gray-800/90 border-b border-gray-700 px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {showMobileMenu ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
          </button>
          <div>
            <h1 className="text-lg font-bold text-white">Snake & Ladder</h1>
            <p className="text-xs text-gray-400">Game #{gameId?.slice(-6) || 'Local'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-blue-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={handleGoHome}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            aria-label="Go home"
          >
            <Home className="w-5 h-5 text-blue-400" />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden flex border-b border-gray-700 bg-gray-800/50">
        <button
          onClick={() => setActiveTab('game')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'game' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Game
        </button>
        <button
          onClick={() => setActiveTab('players')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'players' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Players
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'stats' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
        >
          Stats
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Game Board - Always visible on mobile */}
        <div className={`lg:flex-1 lg:w-[70%] ${activeTab !== 'game' ? 'hidden lg:flex' : 'flex'} flex-col min-h-0`}>
          <div className="flex-1 relative min-h-0 p-2 lg:p-6">
            <div className="absolute inset-2 lg:inset-6 rounded-xl bg-gray-800/30 border border-gray-700/30" />
            <div className="relative z-10 w-full h-full">
              <GameBoard 
                players={gameState.players} 
                currentTurn={gameState.currentTurn} 
              />
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:w-[30%] border-l border-gray-700 bg-gray-800/80 flex-col">
         
          
          <div className="flex-1 overflow-y-auto">
            <GameSidebar
              players={gameState.players}
              currentTurn={gameState.currentTurn}
              winnerIndex={gameState.winnerIndex}
              diceValue={diceValue}
              isRolling={isRolling}
              isMoving={isMoving}
              message={message}
              diceHistory={diceHistory}
              onRollDice={rollDice}
              onGoHome={handleGoHome}
              onResetGame={handlePlayAgain}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
            />
          </div>
        </div>

        {/* Mobile Sidebar Content - Tab based */}
        <div className={`lg:hidden ${activeTab !== 'players' ? 'hidden' : 'block'} flex-1 overflow-y-auto`}>
          <div className="p-4 space-y-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/30">
              <h3 className="text-lg font-bold text-white mb-4">Players ({gameState.players.length})</h3>
              <div className="space-y-3">
                {gameState.players.map((player, index) => {
                  const isCurrentTurn = index === gameState.currentTurn && gameState.winnerIndex === null;
                  const isWinner = index === gameState.winnerIndex;
                  
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        isCurrentTurn ? 'bg-blue-900/30' : 
                        isWinner ? 'bg-amber-900/30' : 
                        'bg-gray-700/30'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full ${
                        index === 0 ? 'bg-red-500' :
                        index === 1 ? 'bg-blue-500' :
                        index === 2 ? 'bg-green-500' :
                        'bg-yellow-500'
                      }`} />
                      <div className="flex-1">
                        <p className={`font-medium ${isWinner ? 'text-amber-400' : 'text-white'}`}>
                          {player.name}
                          {isWinner && <span className="ml-2">🏆</span>}
                        </p>
                        <p className="text-sm text-gray-400">
                          Position: {player.position === 0 ? 'Start' : player.position}
                        </p>
                      </div>
                      <div className="text-lg font-bold text-white">
                        {player.position === 0 ? '🚀' : player.position}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats Tab */}
        <div className={`lg:hidden ${activeTab !== 'stats' ? 'hidden' : 'block'} flex-1 overflow-y-auto`}>
          <div className="p-4">
            <Leaderboard 
              compact={true} 
              currentSessionOnly={true}
              onReset={handleResetSession}
            />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Action Bar */}
      <div className="lg:hidden flex items-center justify-center h-16 bg-gray-800/90 border-t border-gray-700 px-4">
        <div className="flex items-center gap-4 w-full max-w-md">
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-400">Current Turn</p>
            <p className="text-sm font-bold text-white">
              {gameState.players[gameState.currentTurn]?.name || 'None'}
            </p>
          </div>
          
          <button
            onClick={rollDice}
            disabled={isRolling || isMoving || gameState.winnerIndex !== null}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRolling ? '🎲 Rolling...' : '🎲 Dice'}
          </button>
          
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-400">Last Roll</p>
            <p className="text-sm font-bold text-white">{diceValue}</p>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gray-900/95 backdrop-blur-sm">
          <div className="absolute top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Game Menu</h2>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg hover:bg-gray-700"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
            
            <div className="space-y-2">
              <button
                onClick={() => {
                  playButtonSound();
                  handlePlayAgain();
                  setShowMobileMenu(false);
                }}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-700 transition-colors text-white"
              >
                Reset Game
              </button>
              
              <button
                onClick={() => {
                  forceResetSession();
                  setShowMobileMenu(false);
                }}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-700 transition-colors text-white"
              >
                Clear Session Stats
              </button>
              
              <button
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-700 transition-colors text-white"
              >
                Refresh Game
              </button>
              
              <button
                onClick={() => {
                  handleGoHome();
                  setShowMobileMenu(false);
                }}
                className="w-full p-3 text-left rounded-lg hover:bg-gray-700 transition-colors text-red-400"
              >
                Exit to Home
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Winner Modal */}
      {winner && (
        <WinnerModal
          winner={winner}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  );
};

export default Game;
function App() {
    const size = 5;
    const [board, setBoard] = React.useState(() => {
        const newBoard = Array(size).fill().map(() =>
          Array(size).fill().map(() => Math.random() < 0.5)
        );
        return newBoard;
      });
      
    const toggle = (r, c) => {
      setBoard(prev => {
        const newBoard = prev.map(row => [...row]);
  
        const flip = (x, y) => {
          if (x >= 0 && x < size && y >= 0 && y < size) {
            newBoard[x][y] = !newBoard[x][y];
          }
        };
  
        flip(r, c);
        flip(r - 1, c);
        flip(r + 1, c);
        flip(r, c - 1);
        flip(r, c + 1);
  
        return newBoard;
      });
    };
  
    const isWon = board.every(row => row.every(cell => !cell));
  
    return (
      <div>
        {isWon ? <h2 style={{color: "white"}}>🎉 Nyertél!</h2> : null}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${size}, 1fr)`,
          gap: "5px"
        }}>
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => toggle(rIdx, cIdx)}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: cell ? "#ffd700" : "#222",
                  border: "1px solid #444",
                  cursor: "pointer"
                }}
              />
            ))
          )}
        </div>
      </div>
    );
  }
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
  
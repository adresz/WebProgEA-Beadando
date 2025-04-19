      // A React kód itt lesz
      const { useState } = React;

      const App = () => {
        const choices = ['Kő', 'Papír', 'Olló'];
        const [player, setPlayer] = useState('');
        const [computer, setComputer] = useState('');
        const [result, setResult] = useState('');

        const play = (choice) => {
          setPlayer(choice);
          const compChoice = choices[Math.floor(Math.random() * 3)];
          setComputer(compChoice);

          if (choice === compChoice) {
            setResult('Döntetlen!');
          } else if (
            (choice === 'Kő' && compChoice === 'Olló') ||
            (choice === 'Papír' && compChoice === 'Kő') ||
            (choice === 'Olló' && compChoice === 'Papír')
          ) {
            setResult('Nyertél!');
          } else {
            setResult('Vesztettél!');
          }
        };

        return (
          <div className="container">
            <h1>Kő-Papír-Olló</h1>
            <div className="buttons">
              {choices.map(choice => (
                <button key={choice} onClick={() => play(choice)}>{choice}</button>
              ))}
            </div>
            <div className="result">
              <p>Te: {player}</p>
              <p>Gép: {computer}</p>
              <p>{result}</p>
            </div>
          </div>
        );
      };

      // A React alkalmazás renderelése
      ReactDOM.render(<App />, document.getElementById('root'));
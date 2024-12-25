import { useState, useEffect } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [conins, setCoins] = useState([]);
  useEffect(()=>{
    fetch("https://api.coinpaprika.com/v1/tickers")
      .then((response) => response.json())
      .then((json) => {
        setCoins(json);
        setLoading(false);
      });

  }, [])
  return(
  <div>
    <h1>The Coins! {loading ? "" : `(${conins.length})`}</h1>
    {loading ? <strong>Loading...</strong>:(<select>
      
      {conins.map((coin) => (
        <option key={coin.id}>{coin.name} ({coin.symbol}) : {coin.quotes.USD.price} USD</option>
      ))};   
    </select>)}

  </div>
);
}

export default App;

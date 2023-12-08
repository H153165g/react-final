import { useState , useEffect } from "react";
import React from "react";

async function fetchCategory(category,searchTerm){
    const request = await fetch("products.json");
    let data = await request.json();//dataの値が変化するため、const -> let
    console.log(category);

    if(searchTerm !== ""){
        data = data.filter(products => products.character.includes(searchTerm));
    }
    if(category === "All"){
        return data;
    } else {
        return data.filter(products => products.gameSeries === category); 
    }

}

export default function App(){
    const [product,setProduct] = useState([]);
    const [start,setStart]=useState(true);
    const [Qz,setQz]=useState({});
    const [Sty,setSty]=useState(Array(8).fill([0, 0]))
    const [count,setCount]=useState(0);
    const [select,setSelect]=useState(0);
    const [category,setCategory]=useState("");
    const [searchTerm,setSearchTerm]=useState("");

    const gameseries=[
        "The Legend of Zelda",
        "Splatoon",
        "Mario Sports Superstars",
        "Monster Hunter",
        "Kirby",
        "Animal Crossing",
        "Pokemon",
        "Final Fantasy"
    ];

    
    useEffect(() => {
        (async () => {
            const newProduct = await fetchCategory("All","");

            setProduct(newProduct);
    
          })();
      }, []);
    
    function getRandomPosition() {
        const top = Math.floor(Math.random() * (window.innerHeight-100));
        const left = Math.floor(Math.random() * (window.innerWidth-170));

        return [
             top,
             left 
        ];
    }

    function stylesetting(){
        const data=[getRandomPosition(),getRandomPosition(),getRandomPosition(),getRandomPosition(),getRandomPosition(),getRandomPosition(),getRandomPosition(),getRandomPosition()];
        setSty(data);
    }
      
    async function randomValueFromArray() {
        
        const result =  Math.floor(Math.random() * product.length);
        setQz(
              {
                 url: product[result].image,
                 name: product[result].character,
                 game:product[result].gameSeries
              }
            )
            
    }


    function page1(){
        return(
            <>
            {start &&
            <button onClick={
                    async()=>{
                        if(count===0){
                              await randomValueFromArray();
                              stylesetting();

                        }
                        setCount(count+1);
                        setStart(false);
                }} className="first">Start!!</button>
            }
            <button onClick={
                async()=>{
                    setStart(true);
                    await randomValueFromArray();
                    stylesetting();
                    console.log(Sty);
                }
            } className="pass">Pass</button>
        
               <div className="relative">
                  <img src={Qz.url} alt={Qz.name} className="Qz"/>
                </div>
                
                {gameseries.map((game,index)=>{
                    return(
                    <button 
                    key={index} 
                    className="game"
                    onClick={
                        async(e)=>{
                            if(game===Qz.game){
                                setStart(true);
                                await randomValueFromArray();
                                stylesetting();
                            } else {
                                
                                e.preventDefault();
                                setCategory(Qz.game);
                                setSearchTerm(Qz.name);
                                const newProduct = await fetchCategory(Qz.game,Qz.name);     
                                setProduct(newProduct);
                                setSelect(1);
                            }
        
                        }
                    }  style={{position:'absolute',top:Sty[index][0],left:Sty[index][1]} }>{game}</button>
                    )
                })}
                </>
                    );
    }


    function page2(){
        return (
            <>
      
        <h1>Nintendo's Game</h1>
      
      <div>
        <aside>
          <form>
            <div>
              <label htmlFor="gameseries">Choose a gameseries:</label>
              <select 
                id="category" 
                onChange={async (event) => setCategory(event.target.value)
                }
              >
                <option  value="All">All</option>
                {gameseries.map((game,index)=>{
                    return(
                        
                        <option key={index} value={game}>
                            {game}
                        </option>
                        
                    );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="searchTerm">Enter search term:</label>
              <input 
                type="text" 
                id="searchTerm" 
                placeholder="e.g. beans" 
                value={searchTerm}
                onChange={async (event) => setSearchTerm(event.target.value) 
              }         
              >
              </input>
            </div>
            <div>
              <button onClick={async(e)=>{
                e.preventDefault();
                const newProduct = await fetchCategory(category,searchTerm);     
                setProduct(newProduct);
              }}>Filter results</button>
            </div>
          </form>
        </aside>
        <main>
          {product.map((product, index) => (
            <section key={index} className="Qz">
              <h2>{product.name}</h2>
              <p>{product.gameSeries}</p>
              <img src={product.image} alt={product.character} />
            </section>
          ))}
        </main>
      </div>
      <button onClick={async(e)=>{
        e.preventDefault();
        const newProduct = await fetchCategory("All","");     
        setProduct(newProduct);
        setSelect(0);
      }
    } 
      className="pass">Game</button>
    </>
            
        )
    }
    
      
    return(
        <>
        {select===0 ? page1():page2()}
        
        </>
    );
    
}
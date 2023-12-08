import { useState , useEffect } from "react";
import React from "react";

async function fetchCategory(category,searchTerm){
    if(category===""){
        
        const request2 = await fetch("https://www.amiiboapi.com/api/gameseries/");
        let data2=await request2.json();
        
        console.log(data2.amiibo)
        return data2.amiibo||[];
    }

    const request = await fetch("https://www.amiiboapi.com/api/amiibo/");
    let data = await request.json();//dataの値が変化するため、const -> let
    


    if(searchTerm !== ""){
        data.amiibo = data.amiibo.filter(products => products.character.includes(searchTerm));
    }
    if(category === "All"){
        return data.amiibo;
    } else {
        return data.amiibo.filter(products => products.gameSeries === category); 
    }
}

export default function App(){
    const [product,setProduct] = useState([]);
    const [start,setStart]=useState(true);
    const [Qz,setQz]=useState({});
    const [count,setCount]=useState(0);
    const [select,setSelect]=useState(0);
    const [category,setCategory]=useState("");
    const [searchTerm,setSearchTerm]=useState("");
    const [gameseries,setgameserise]=useState([]);
    const [Styx,setStyx]=useState([]);
    const [Styy,setStyy]=useState([]);
    const [load,setLoad]=useState(true);
    const [selgame,setselgame]=useState([]);
            
    useEffect(() => {
        const fetchData = async () => {
            const productData = await fetchCategory("All", "");
            const gameseriesData = await fetchCategory("", "");
            console.log(productData)
            console.log(gameseriesData)
            const newGame = await gameseriesData.filter((item, index, self) =>index === self.findIndex((t) => t.name === item.name));  
            console.log(newGame) 
            setProduct(productData);
            setgameserise(newGame);
            setStyx(Array(gameseries.length));
            setStyy(Array(gameseries.length));
            setLoad(false);
        }
        fetchData();
    }, []);


    
    function getRandomPosition() {
        const top = Math.floor(Math.random() * (window.innerHeight)/100);
        

        return top;
    }
    function getRandomPosition2(){
        const left = Math.floor(Math.random() * (window.innerWidth)/170);
        return left;
    }
    function stylesetting(){
        console.log("Move")
        const newdata1=gameseries.map(()=>getRandomPosition());
        const newdata2=gameseries.map(()=>getRandomPosition2());
        for(let i=0;i<gameseries.length;i++){
            for(let j=i+1;j<gameseries.length;j++){
                if(newdata1[i]===newdata1[j] && newdata2[i]===newdata2[j]){
                    newdata1[j]=getRandomPosition();
                    newdata2[j]=getRandomPosition2();
                    i=0;
                    j=gameseries.length;
                }
            }
        }
        console.log(newdata1)
        setStyx(newdata1);
        setStyy(newdata2);
    }

    
      
    async function randomValueFromArray() {
        const name=Math.floor(Math.random()*gameseries.length);
        const a=product.filter(products => products.gameSeries === gameseries[name].name);
        const b=Math.floor(Math.random()*a.length);
        setQz(
              {
                 url: a[b].image,
                 name: a[b].character,
                 game:a[b].gameSeries
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
                              setCount(count+1);

                        }
                       
                        setStart(false);
                }} className="first">Start!!</button>
            }
            
        
               <div className="relative">
                  <img src={Qz.url} alt={Qz.name} className="Qz"/>
                </div>
                
                {gameseries.map((game,index)=>{
                    return(
                    <button 
                    key={game.key} 
                    className="game"
                    onClick={
                        async(e)=>{
                            if(game.name===Qz.game){
                                setStart(true);
                                await randomValueFromArray();
                                stylesetting();
                            } else {
                                
                                e.preventDefault();
                                
                                setSearchTerm(Qz.name);
                                const newProduct = await fetchCategory(Qz.game,Qz.name);     
                                setProduct(newProduct);
                                setSelect(1);
                            }
        
                        }
                    }  style={{position:'absolute',top:Styx[index]*100,left:Styy[index]*160} }>{game.name}</button>
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
                            {game.name}
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
                console.log(category)
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
            
        );
    }
    
    function startLoad(){
        if(select===0){
            return (page1());
        } else {
            return (page2());
        }
    }
 
      
    return(
        <>
        {load===false&& startLoad()}
        
        </>
    );
    
}
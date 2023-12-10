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
        console.log()
        return data.amiibo.filter(products => products.gameSeries.includes(category)); 
    }
}

export default function App(){
    const [product,setProduct] = useState([]);
    const [start,setStart]=useState(true);
    const [Qz,setQz]=useState({});
    const [count,setCount]=useState(0);
    const [select,setSelect]=useState(0);
    const [category,setCategory]=useState("All");
    const [searchTerm,setSearchTerm]=useState("");
    const [gameseries,setgameserise]=useState([]);
    const [Styx,setStyx]=useState([]);
    const [Styy,setStyy]=useState([]);
    const [load,setLoad]=useState(true);
    const [Karuta,setKaruta]=useState([]);
    const [Fuda,setFuda]=useState([]);
    const [KarutaTF,setKarutaTF]=useState(new Array(52).fill(true));
    const [Fcount,setFcount]=useState(0);
    const [Misscount,setMisscount]=useState(0);
            
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

    useEffect(()=>{
    
        const shuffledTtems=shuffleArray(product);
        setKaruta(shuffledTtems.slice(0, 52));
    },[product]);

    useEffect(()=>{
        const shuffledTtems=shuffleArray(Karuta);
        setFuda(shuffledTtems);
    },[Karuta]);

    function shuffleArray(array) {
        // 配列のコピーを作成
        const shuffledArray = array.slice();
      
        // Fisher-Yatesアルゴリズムを使ったシャッフル
        for (let i = shuffledArray.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
      
        return shuffledArray;
      }
    
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
                                const newProduct = await fetchCategory("All",Qz.name);     
                                setProduct(newProduct);
                                setSelect(0);
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
      
        
      
      <div className="inputter">
      <h1>Nintendo's Game</h1>
        <aside>
          <form>
            <div>
              <label htmlFor="category">Choose a gameseries:</label>
              <select 
                id="category" 
                onChange={async (event) => {setCategory(event.target.value);console.log(event.target.value)}
                }
                
              >
                <option  value="All">All</option>
                {gameseries.map((game,index)=>{
                    return(
                        
                        <option key={index} value={game.name}>
                            {game.name}
                        </option>
                        
                    );
                })}
              </select>
            
              <label htmlFor="searchTerm">Enter search term:</label>
              <input 
                type="text" 
                id="searchTerm" 
                placeholder="charactor" 
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
        </div>
        <div>
        <main>
          {product.map((product, index) => (
            <section key={index}>
              <h2>{product.name}</h2>
              <p>{product.gameSeries}</p>
              <img src={product.image} alt={product.character}/>
            </section>
          ))}
        </main>
      </div>
      <button onClick={async(e)=>{
        e.preventDefault();
        const newProduct = await fetchCategory("All","");     
        setProduct(newProduct);
        setSelect(1);
      }
    } 
      className="pass">Game2</button>

<button onClick={async(e)=>{
        e.preventDefault();
        const newProduct = await fetchCategory("All","");     
        setProduct(newProduct);
        setSelect(3);
      }
    } 
      className="pass2">Game1</button>
    </>
            
        );
    }
    function page3(){
        
        const array = [];
        
        const makeStage = () => {
            let count = 0;
            let dataset=[...KarutaTF];
            for (let i = 0; i < 13; i++) {
                for (let j = 0; j < 4; j++) {
                    const abcount=count;
                    if (count < Karuta.length ) {
                        array.push(
                            <img
                                key={count}
                                src={Karuta[count].image}
                                alt={Karuta[count].character}
                                style={{
                                    position:"absolute",
                                    top: j * 200 + 100 + 'px',
                                    left: i * 110  + 'px',
                                    width: '100px',
                                    height: '200px'
                                }}
                                onClick={async(e) => { 
    
                                    if (Fuda[Fcount].character === Karuta[abcount].character) {
                                        dataset[abcount]=false;                                        
                                        setKarutaTF(dataset);
                                        setFcount(Fcount + 1);
                                    }  else {
                                        setMisscount(Misscount+1);
                                    }
                                }}
                            />
                        );
                    }
                    count++;
                }
            }
        };
        
        makeStage(); 
    
        return (
            <>

            
            {Fcount<52  ?  <h1>{Fuda[Fcount].character}</h1>:<h1>Complete!!</h1>}
                {
                    array.map((element, index) => {

                    if (KarutaTF[index]) {
                        return <React.Fragment key={index}>{element}</React.Fragment>;
                    } else {
                        return null;
                    }
                })
                }
                <div className="miss">
                   <h2>Miss  {Misscount}</h2>
                </div>
            </>
        );
    }
    
    
    function startLoad(){
        if(select===1){
            return (page1());
        } else if(select==0){
            return (page2());
        } else {
            return (page3());
        }
    }
 
      
    return(
        <>
        {load===false&& startLoad()}
        
        </>
    );
    
}
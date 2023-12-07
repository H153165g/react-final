
import { useState , useEffect } from "react";
import React from "react";

async function fetchCategory(category,searchTerm){
    const request = await fetch("products.json");
    let data = await request.json();//dataの値が変化するため、const -> let

    if(searchTerm !== ""){
        data = data.filter(products => products.name.includes(searchTerm));
    }
    if(category === "All"){
        return data;
    } else {
        return data.filter(products => products.type === category); 
    }

}

export default function App(){
    const [product,setProduct] = useState([]);
    const [start,setStart]=useState(true);
    const [Qz,setQz]=useState({});
    const [Sty,setSty]=useState(Array(8).fill([0, 0]))

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
            console.log("非同期な処理終了！");
    
          })();
      }, []);
    
    function getRandomPosition() {
        const top = Math.floor(Math.random() * window.innerHeight);
        const left = Math.floor(Math.random() * window.innerWidth);

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
        
        if (!product || product.length === 0) {
          // productが空の場合、エラーを避けるために何らかの処理を行う（例: エラーメッセージの設定）
          return { url: '', name: '' }; // 空のオブジェクトやデフォルトの値を返す
        } else {
            const result =  Math.floor(Math.random() * product.length);
            setQz(
                {
                    url: product[result].image,
                    name: product[result].character,
                    game:product[result].gameSeries
                }
            )
            
        }
    }
      
    return(
        <>
        
    {start &&
    <button onClick={
            async()=>{
                await randomValueFromArray();
                stylesetting();
                console.log(Qz);
                setStart(false);
        }} className="first">Start!!</button>
    }
    <button onClick={
        async()=>{
            await randomValueFromArray();
            stylesetting();
            console.log(Sty);
        }
    } className="pass">Pass</button>

       <div className="relative">
          <img src={Qz.url} alt={Qz.name} className="Qz"/>
        </div>
        
        {gameseries.map((game,index)=>{
            console.log(game);
            console.log(Qz.game);
            return(
            <button 
            key={index} 
            onClick={
                async()=>{
                    if(game===Qz.game){
                        await randomValueFromArray();
                        stylesetting();
                    }

                }
            }  style={{position:'absolute',top:Sty[index][0],left:Sty[index][1]}}>{game}</button>
            )
        })}
        </>
    );
    
}
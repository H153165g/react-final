
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
    const [boxes,setBoxes]=useState([{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}])
    const [imgdiv,setImgdiv]=useState([{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}])
    const syokidiv={
        width: '100%',
        display: 'block',
        position: 'absolute',
        bottom: '0px',
    }
    
    useEffect(() => {
        (async () => {
            const newProduct = await fetchCategory("All","");
            setProduct(newProduct);
            console.log(product)
          })();
      }, []);

      

    
      
      function resetdiv(i) {
        if (i === null) {
          setImgdiv(
            Array(20).fill(syokidiv) // もしくは適切な初期値を持つ配列に置き換える
          );
        } else {
          setImgdiv(
            imgdiv.map((item, index) => (index === i ? syokidiv : item)) // imgdiv内の特定の要素を置き換える
          );
        }
      }



      async function randomValueFromArray() {
        if (!product || product.length === 0) {
          // productが空の場合、エラーを避けるために何らかの処理を行う（例: エラーメッセージの設定）
          return { url: '', name: '' }; // 空のオブジェクトやデフォルトの値を返す
        } else {
          const result =  Math.floor(Math.random() * product.length);
          const box = {
            url: product[result].image,
            name: product[result].character
          };
          return box;
        }
      }
      


      async function box(i) {
        if (!product || product.length === 0) {
            console.log("Fuck you")
          // productが空の場合、エラーを避けるために何らかの処理を行う（例: エラーメッセージの設定）
          return; // 何もしないか、エラーメッセージを設定するなど
        }
        
        if (i === null) {
          setBoxes(
            boxes.map(() => randomValueFromArray())
          );
        } else {
          setBoxes(
            boxes.map((box, index) => (index === i ? randomValueFromArray() : box))
          );
        }
      }
      
    useEffect(()=>{
        (async () => {
            box(null);
            resetdiv(null);
          })();
      }, [product]);


    return(
        <>
        
        <section>
        {boxes.map((box,index)=>(
            
            
            <div key={index} className="vegetables">
            <img src={box.url} alt={box.name} />
            </div>
        ))}
        
        </section>
        <header>
        <h1>死ね</h1>
        </header>
        </>
    );
}
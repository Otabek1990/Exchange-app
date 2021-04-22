import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import DeleteIcon from "@material-ui/icons/Delete";
import { nanoid } from "nanoid";
import axios from "axios";

const Exchange = () => {
  const [index, setIndex] = useState([
    {
        main: {
          id: nanoid(),
          cur: "EUR",
          val: 100,
          inp:0
        },
        cols: [
          {
            id: nanoid(),
            cur: "USD",
            val: 100,
          },
        ],
    }
  ]);
  const [currencys, setCurrencys] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [addColumn, setAddColumn] = useState(false);
  const [fromCurrency, setFromCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(1);
  const [cur, setCur] = useState();
  const [allCurNum, setAllCurNum] = useState();
  const [number, setNumber] = useState(1)
  
  const API_KEY = "5d30bb4d05de6c032bb43e9af104296c";

  const getInfos = () => {
    axios
      .get(`http://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`)
      .then((res) => {
        const datas = res.data;
        const currencyName = Object.keys(datas.rates);
        // console.log(datas.cur)

        // console.log(datas.rates.fromCurrency && datas.rates.fromCurrency);
        setAllCurNum(datas.rates)

        setCurrencyOptions([datas.base, ...Object.keys(datas.rates)]);
      });
  };

  useEffect(() => {
    getInfos();
    setIndex(JSON.parse(localStorage.getItem('data')))
  }, []);


  const setLocal = () => {
    localStorage.setItem('data',JSON.stringify(index))
  } 

  const addCurrency = (i,i2) => {
    const currencyInfos = {
        id: nanoid(),
        cur: "eur",
        val: 100
    };
    let arr = [...index]
    if (arr[i]){arr[i].cols.push(currencyInfos)}
    setIndex(arr)
    setLocal()
  };
  const deleteCurrency = (id) => {
    let oldArray = [...index]

    oldArray.forEach((item,i) => 
        item.cols ? item.cols.forEach((item2,i2) => 
          item2.id === id ? oldArray[i].cols.splice(i2,1) : ''
        ) : ''
    )

    setIndex(oldArray)    
    setLocal()
    // const filtered = currencys.filter((item) => item.id !== id);
    // setCurrencys(filtered);
  };
  const addNewRows = () => {
    const currencyInfos = {
      main: {
        id: nanoid(),
        cur: "eur",
        val: 100,
        inp:0
      },
      cols: [
        {
          id: nanoid(),
          cur: "eur",
          val: 100,
        },
      ],
    };
      let arr = [...index]
      if (arr){arr.push(currencyInfos)}
      setIndex(arr)
      setLocal()
  };

  const setCurFun = (e,i) => {
    for (const [key, value] of Object.entries(allCurNum)) {
      if(e.target.value == key){
        let arr = [...index]
        arr[i].main.val = value
        setNumber(value)
console.log(value)
        setIndex(arr) 
      }
    }
  }
const qiymat=Math.floor(fromAmount*number*100);
console.log(number)
  return (
    <Form>
      <Columns>
        <FromTo>
          <p>From</p>
          <p>
            <span>To</span>
          </p>
        </FromTo>
        <Rows>
          <Main>
            <Button>
              <form onSubmit={(e) => e.preventDefault()}>
                <select
                  value={fromCurrency}
                  onChange={(e) => {
                    setFromCurrency(e.target.value);
                  }}
                >
                  <option>{fromCurrency}</option>
                  {currencyOptions &&
                    currencyOptions.map((item) => <option>{item}</option>)}
                </select>
                <input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                />
              </form>
            </Button>
            <DragHandleIcon className="equal_icon" />
          </Main>
          <Main>
            <Button>
              
              <select>
                {currencyOptions.map((item)=>
                <option>{item}</option>
                )}
              </select>
              <p>{qiymat}</p>
            </Button>
            <AddCircleOutlineIcon className="add_icon" onClick={addCurrency} />
          </Main>
        </Rows>
        {index
          ? index.map((item, i) => (
              <Rows>
                <Button>
                  <select onChange={(e) => setCurFun(e,i)}>
                  {currencyOptions &&
                    currencyOptions.map((item) => 
                    <option value={item}>{item}</option>
                    )}
                  </select>
                  <p>1</p>
                </Button>
                {item.cols ? item.cols.map((item2,i2) =>
                    <Button>
                    <select>
                      <option>{item2.cur}</option>
                    </select>
                    <p>{item2.val}</p>
                    <DeleteIcon
                      className="delete_icon"
                      onClick={() => deleteCurrency(item2.id)}
                    />
                  </Button>

                ) : ''}
                <AddCircleOutlineIcon
                  className="add_icon"
                  onClick={() => addCurrency(i)}
                />
              </Rows>
            ))
          : ""}
        {/* {currencys.map((item, index) => (
            <Main>
              <Button>
               
                <select>
                  <option>{item.name}</option>
                </select>
                <p>{item.name}</p>
                <DeleteIcon
                  className="delete_icon"
                  onClick={() => deleteCurrency(item.id)}
                />
              </Button>
              <AddCircleOutlineIcon
                className="add_icon"
                onClick={addCurrency}
              /> <hr/>
            </Main>
          ))} */}
        {/* </Rows> */}

        <AddCircleOutlineIcon className="add_icon" onClick={addNewRows} />
      </Columns>
    </Form>
  );
};
export default Exchange;

const Form = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  padding-bottom: 20px;

  .add_icon,
  .equal_icon {
    margin-left: 5px;
    color: gray;
    font-size: 30px;
    cursor: pointer;
  }
`;
const Columns = styled.div``;

const FromTo = styled.div`
  font-size: 25px;
  color: gray;
  font-weight: bolder;
  display: flex;
  align-items: center;
  margin-left: 6px;
  span {
    margin-left: 122px;
  }
`;
const Rows = styled.div`
  display: flex;
`;
const Main = styled.div`
  margin: 5px;
  margin-bottom: 10px;
  display: flex;
  text-align: center;
  align-items: center;
`;
const Button = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  border: 2px solid royalblue;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.2);
  width: 140px;
  height: 40px;
  padding: 5px 10px;
  border-radius: 4px;

  select {
    border: none;
    outline: none;
    height: 30px;
    cursor: pointer;
    background-color: transparent;
    font-size: 12px;
    font-weight: bolder;
    color: rgba(0, 0, 0, 0.7);
  }
  option {
    font-size: 12px;
    font-weight: bolder;
    color: rgba(0, 0, 0, 0.7);
  }

  p {
    margin-top: 13px;
    font-size: 12px;
  }
  input {
    width: 50px;
    font-size: 12px;
    color: black;
    margin-left: 10px;
    outline: none;
    border: none;
  }
  .delete_icon {
    color: blue;
    margin-left: 5px;
    cursor: pointer;
  }
`;


import { useReducer } from 'react';
import './style.css'
import DigitButton from './DigitButton';
import OperationButton from './OperationButton'  

export const ACTIONS={
  ADD_DIGIT:"add-digit",
  CHOOSE_OPERATION:"choose-operation",
  DELETE_DIGIT:"delete-degit",
  EVALUATE:"evaluate"
}
const initialstate ={
  currentOperand:"",
  previousOperand:"",
  operation:""
}

const INTEGER_FORMATTER= new Intl.NumberFormat('en-us',{
  minimumFractionDigits:0
})

function formatOperand(operand){
  if(operand=='')return 
  const [int,dec]=operand.split('.')

  if(dec==null)return INTEGER_FORMATTER.format(int)

  return `${INTEGER_FORMATTER.format(int)}.${dec}`
}

function reducer(state,{type,payload}){
  switch(type){
    case ACTIONS.ADD_DIGIT:
      if(payload.digit==='0' && state.currentOperand==='0') return state
      if(payload.digit=='.' && state.currentOperand.includes('.')) return state
      if(state.overwrite) {
        return{
          ...state,
          currentOperand:payload.digit,
          overwrite:false
        }
      }
      return {
        ...state,
        currentOperand:`${state.currentOperand || ''}${payload.digit}`
      }
    break;
    case ACTIONS.CHOOSE_OPERATION:
        console.log(state)
        if(state.currentOperand=="" && state.previousOperand==""){ return state}
        if(state.previousOperand=="") {
          console.log("state")
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: ""
          }
        }
        return {
          ...state,
          previousOperand:evaluate(state),
          operation:payload.operation,
          currentOperand:""
        }
      break;
      case ACTIONS.CLEAR:
        console.log(state)
        return {
          state:"",
          previousOperand: "",
          currentOperand: "",
          operation: ""
        }
      break;
      case ACTIONS.EVALUATE:
        console.log(state)
        if(
          state.operation=="" ||
          state.currentOperand=="" ||
          state.previousOperand==""
        ){return state}
        return{
          ...state,
          overwrite:true,
          previousOperand:"",
          operation:"",
          currentOperand:evaluate(state)
        }
        case ACTIONS.DELETE_DIGIT:
          if(state.overwrite){
            return{
              ...state,
              overwrite:false,
              currentOperand:''
            }
          }
          if(state.currentOperand=="") return state
          if(state.currentOperand.length===1){
            return{
              ...state, currentOperand:""
            }
          }
          return {
            ...state,
            currentOperand:state.currentOperand.slice(0,-1)
          }
  }
}

function evaluate({currentOperand,previousOperand,operation}){
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if(isNaN(prev || isNaN(current))) return ""
  let computation =''
  switch (operation) {
    case "+":
        computation = prev + current
      break;
    case "-":
        computation = prev - current
      break;
    case "/":
        computation = prev / current
      break;
    case "*":
        computation = prev * current
      break;
  }
  return computation.toString();
}

function App() {
  const [{currentOperand,previousOperand,operation},dispatch] = useReducer(reducer,initialstate);
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousOperand)}</div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
      <button  onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButton dispatch={dispatch} operation="/"/>
      <DigitButton digit='1' dispatch={dispatch}/>
      <DigitButton digit='2' dispatch={dispatch}/>
      <DigitButton digit='3' dispatch={dispatch}/>
      <OperationButton dispatch={dispatch} operation="*"/>
      <DigitButton digit='4' dispatch={dispatch}/>
      <DigitButton digit='5' dispatch={dispatch}/>
      <DigitButton digit='6' dispatch={dispatch}/>
      <OperationButton dispatch={dispatch} operation="+"/>
      <DigitButton digit='7' dispatch={dispatch}/>
      <DigitButton digit='8' dispatch={dispatch}/>
      <DigitButton digit='9' dispatch={dispatch}/>
      <OperationButton dispatch={dispatch} operation="-"/>
      <DigitButton digit='.' dispatch={dispatch}/>
      <DigitButton digit='0' dispatch={dispatch}/>
      <button className="span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE    
    })}>=</button>
      

    </div>
  );
}

export default App;

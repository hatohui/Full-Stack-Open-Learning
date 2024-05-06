import { useState } from "react";

const Statistic = (props) => {

  if (props.count == 0) {
    return <div>No feedback given</div>
  }

  return <table>
    <tbody>
      <StatisticLine text='good' value={props.good}/>
      <StatisticLine text='neutral' value={props.neutral}/>
      <StatisticLine text='bad' value={props.bad}/>
      <StatisticLine text='all' value={props.count}/>
      <StatisticLine text='average' value={Average(props)}/>
      <StatisticLine text='positive' value={PositiveFeedBack(props)}/>
    </tbody>
  </table>
}

const StatisticLine = (props) => {
  if (props.text === 'positive') 
    return <tr>
        <td>{props.text}</td>
        <td>{props.value} %</td>
      </tr>
    
  return <tr>
    <td>{props.text}</td>
    <td>{props.value}</td>
  </tr>
}

const Button = ({ handleClick, text}) => {
  return <button onClick={handleClick}> {text} </button>
}

const PositiveFeedBack = (props) => {
  return props.good/(props.count)*100
}

const Average = (props) => {
  return (props.good - props.bad)/props.count
}

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [count, setCount] = useState(0);

  const goodCLick = () => {
    setGood(good + 1);
    setCount(count + 1);
  }

  const neutralClick = () => {
    setNeutral(neutral + 1);
    setCount(count + 1);
  }

  const badClick = () => {
    setBad(bad + 1);
    setCount(count + 1);
  }

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={goodCLick} text='good'/>
      <Button handleClick={neutralClick} text='neutral'/>
      <Button handleClick={badClick} text='bad'/>
      <h1>statistics</h1>
      <Statistic good={good} neutral={neutral} bad={bad} count={count} />
    </div>
  )
}

export default App;
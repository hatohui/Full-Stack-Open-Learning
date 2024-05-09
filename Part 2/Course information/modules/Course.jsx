const Header = ({ course }) => <h1>{course}</h1>

const Total = ({parts}) => {
  const sum = parts.reduce((acc, cur) => acc + cur.exercises, 0)
  return <p><b>total of {sum} exercises</b></p>
}

const Part = ({content, exercise}) => <p>{content} {exercise}</p>

const Content = ({ parts }) =>
  <>
    {parts.map(part => 
      <Part key={part.id} content={part.name} exercise={part.exercises} />
    )}
  </>

const Course = ({course}) => {
  return <>
    <Header course={course.name}/>
    <Content parts={course.parts}/>
    <Total parts={course.parts}/>
    </>
}

export default Course;
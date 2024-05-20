const Person = ({person, toDelete}) => (<p>{person.name} {person.number} <button value={person.id} onClick={toDelete}>delete</button></p>)

const Persons = ({toShow, toDelete}) => {
	return <div>{toShow.map(person => <Person key={person.id} person={person} toDelete={toDelete}/>)}</div>
}

export default Persons
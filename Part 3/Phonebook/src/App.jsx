import { useState, useEffect } from 'react'
import server from './service/NumberServices';
import PersonForm from './components/PersonForm';
import Notification from './components/Notification';
import Persons from './components/Persons';
import Filter from './components/Filter';

function checkExistence(persons, newName) {
	for (const person of persons) {
		if (person.name === newName.name) return person.id;
	}
	return -1;
}

const App = () => {
	const [persons, setPersons] = useState([])
	const [newName, setNewName] = useState('');
	const [newNumber, setNewNumber] = useState('');
	const [filterer, setFilterer] = useState('');
	const [errorMessage, setErrorMessage] = useState("Hello");
	const [errorStatus, setErrorStatus] = useState(true);
	useEffect(() => {
		server
			.getAll()
			.then(person => setPersons(person))
	}, [])

	const handleFilterer = (event) => setFilterer(event.target.value);
	const handleNameChange = (event) => setNewName(event.target.value);
	const handleNumberChange = (event) => setNewNumber(event.target.value);

	const toShow = filterer === ''
		? persons
		: persons.filter(person => person.name.toLowerCase().includes(filterer.toLowerCase()))

	const addPerson = (event) => {
		event.preventDefault();
		const newPerson = {
			name: newName,
			number: newNumber,
			id: `${persons.length + 1}`
		};

		const oldId = checkExistence(persons, newPerson);

		if (oldId !== -1) {
			if (window.confirm(`${newName} is already added to phonebook, replace the old number with the new one?`)) {
				newPerson.id = oldId;
				server
					.update(oldId, newPerson)
					.then(returnedOne => {
						setPersons(persons.map(person => person.id !== oldId ? person : returnedOne))
					})
					.catch(_error => {
						setErrorStatus(false);
						setErrorMessage(`${newName} has already been removed from server`)
						setTimeout(() => {
							setErrorMessage(null)
						}, 5000)
					})
				
				setErrorStatus(true);
				setErrorMessage(`Replaced ${newPerson.name}'s phone number to ${newPerson.number}`)
			}
		} else {
			server
				.create(newPerson)
				.then(setPersons(person => person.concat(newPerson)))
			setErrorStatus(true);
			setErrorMessage(`Added ${newPerson.name}`)
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}


		setNewName('');
		setNewNumber('');
	}

	const deletePerson = event => {
		const id = event.target.value;
		const currentPerson = persons.filter(person => person.id === id)[0]
		if (window.confirm(`confirm deleting ${currentPerson.name}?`)) {
			server
				.remove(id)
				.catch(_error => {
					setErrorStatus(false);
					setErrorMessage(`${newName} has already been removed from server`)
					setTimeout(() => {
						setErrorMessage(null);
						setErrorStatus(true);
					}, 5000)
				})
			const newState = [...persons];
			newState.pop(currentPerson)
			setPersons(newState)
			setErrorStatus(true);
			setErrorMessage(`Successfully removed ${currentPerson.name}`)
			setTimeout(() => {
				setErrorMessage(null)
			}, 5000)
		}
	}

	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={errorMessage} status={errorStatus} />
			<Filter onChange={handleFilterer} />
			<h2>add a new</h2>
			<PersonForm newName={newName} handleNameChange={handleNameChange}
				newNumber={newNumber} handleNumberChange={handleNumberChange}
				addPerson={addPerson} />
			<h2>Numbers</h2>
			<Persons toShow={toShow} toDelete={deletePerson}/>
		</div>
	)
}


export default App;
const PersonForm = ({newName, handleNameChange, newNumber, handleNumberChange, addPerson}) => 
	<form>
		<div id="name">
			name: <input value={newName} onChange={handleNameChange} />
		</div>
		<div id="number">
			number: <input value={newNumber} onChange={handleNumberChange} />
		</div>
		<div id="button">
			<button type="submit" onClick={addPerson}>add</button>
		</div>
	</form>
	
export default PersonForm
const Notification = ({message, status}) => {
    const messagea = message;
	if (message = null) {
		return null
	}
    const color = status ? {color: 'green'} : {color: 'red'};
	return <div style={color} className="error">{messagea}</div>
}

export default Notification
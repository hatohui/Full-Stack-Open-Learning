/* eslint-disable react/prop-types */
const Notification = ({ notification }) => (
  <>{notification !== "" ? <p>{notification}</p> : null}</>
);

export default Notification;

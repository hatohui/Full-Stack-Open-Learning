import { useNotification } from "../reducers/NotificationContext";

// eslint-disable-next-line react/prop-types
const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  return <div style={style}>{useNotification()}</div>;
};

export default Notification;

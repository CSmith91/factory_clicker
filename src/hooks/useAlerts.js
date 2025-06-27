import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeAlert, stopAudio } from '../features/notifications/notificationsSlice';

export const useAlerts = () => {
  const messages = useSelector(state => state.notifications.messages);
  const playAudio = useSelector(state => state.notifications.playAudio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const id = lastMessage.id;
      const timer = setTimeout(() => {
        dispatch(removeAlert(id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [messages, dispatch]);

  useEffect(() => {
    if (playAudio) {
      const timer = setTimeout(() => {
        dispatch(stopAudio());
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [playAudio, dispatch]);
};

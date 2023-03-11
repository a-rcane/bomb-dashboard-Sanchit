import {useEffect, useState} from 'react';
import useBombFinance from './useBombFinance';
import useRefresh from './useRefresh';

const useBoardroomTVL = () => {
  const [boardroomTVL, setBoardroomTVL] = useState<Number>(0);
  const {slowRefresh} = useRefresh();
  const bombFinance = useBombFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setBoardroomTVL(await bombFinance.getBoardRoomTVL());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setBoardroomTVL, bombFinance, slowRefresh]);

  return boardroomTVL;
};

export default useBoardroomTVL;
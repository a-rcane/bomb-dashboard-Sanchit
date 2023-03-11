import {useEffect, useState} from 'react';
import useBombFinance from './useBombFinance';
import useRefresh from './useRefresh';

const useBombTVL = () => {
  const [bombTVL, setBombTVL] = useState<Number>(0);
  const {slowRefresh} = useRefresh();
  const bombFinance = useBombFinance();

  useEffect(() => {
    async function fetchTVL() {
      try {
        setBombTVL(await bombFinance.getBombTVL());
      } catch (err) {
        console.error(err);
      }
    }
    fetchTVL();
  }, [setBombTVL, bombFinance, slowRefresh]);

  return bombTVL;
};

export default useBombTVL;
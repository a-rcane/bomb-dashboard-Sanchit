import React, { useMemo, useState} from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import Page from '../../components/Page';
import HomeImage from '../../assets/img/background.jpg';
import { Box, Card, CardContent, CardActions, Button, Typography, Grid } from '@material-ui/core';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import moment from 'moment';
import Divider from '@material-ui/core/Divider/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import bshares from '../../assets/img/bshares.png';
import bomb from '../../assets/img/bomb.png';

import iconArrowDownCir from '../../assets/img/iconArrowDownCir.svg';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useBondStats from '../../hooks/useBondStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import useBoardroomTVL from '../../hooks/useBoardroomTVL';

import CountUp from 'react-countup';
import { getDisplayBalance } from '../../utils/formatBalance';
import useTotalStakedOnBoardroom from '../../hooks/useTotalStakedOnBoardroom';
import useTokenBalance from '../../hooks/useTokenBalance';
import useBombFinance from '../../hooks/useBombFinance';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useStakedBalanceOnBoardroom from '../../hooks/useStakedBalanceOnBoardroom';
import useShareStats from '../../hooks/usebShareStats';
import DepositModal from '../Stake/components/DepositModal';
import WithdrawModal from '../Stake/components/WithdrawModal';
import useStakeToBoardroom from '../../hooks/useStakeToBoardroom';
import useWithdrawFromBoardroom from '../../hooks/useWithdrawFromBoardroom';
import useModal from '../../hooks/useModal';
import useHarvestFromBoardroom from '../../hooks/useHarvestFromBoardroom';
import useEarningsOnBoardroom from '../../hooks/useEarningsOnBoardroom';
import useBombStats from '../../hooks/useBombStats';
import useClaimRewardCheck from '../../hooks/boardroom/useClaimRewardCheck';
import { useWallet } from 'use-wallet';
import metamask from '../../assets/img/metamask-fox.svg';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
} 


const Dashboard = () => {
  const BackgroundImage = createGlobalStyle`
  body {
    background: url(${HomeImage});
    background-size: cover !important;
    background-color: #171923;
  }`;

  const { account } = useWallet();
  const currentEpoch = useCurrentEpoch();
  const TITLE = 'bomb.money | Bomb Finance Summary';
  const { to } = useTreasuryAllocationTimes();
  const TVL = useTotalValueLocked();
  const boardroomTVL = useBoardroomTVL();
  const totalStaked = useTotalStakedOnBoardroom();
  const bombFinance = useBombFinance();
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 
  const stakedBalance = useStakedBalanceOnBoardroom();
  const bShareStats = useShareStats();
  const tBondStats = useBondStats();
  const bombStats = useBombStats();

  // For Table 1 

  const bombPriceInBNB = useMemo(() => (bombStats ? Number(bombStats.tokenInFtm).toFixed(4) : null), [bombStats]);
  const bombCirculatingSupply = useMemo(() => (bombStats ? String(bombStats.circulatingSupply) : null), [bombStats]);
  const bombTotalSupply = useMemo(() => (bombStats ? String(bombStats.totalSupply) : null), [bombStats]);

  const bSharePriceInDollars = useMemo(() => (bShareStats ? Number(bShareStats.priceInDollars).toFixed(2) : null),[bShareStats],);
  const bShareCirculatingSupply = useMemo(() => (bShareStats ? String(bShareStats.circulatingSupply) : null),[bShareStats],);
  const bShareTotalSupply = useMemo(() => (bShareStats ? String(bShareStats.totalSupply) : null), [bShareStats]);

  const tBondPriceInDollars = useMemo(() => (tBondStats ? Number(tBondStats.priceInDollars).toFixed(2) : null),[tBondStats],);
  const tBondCirculatingSupply = useMemo(() => (tBondStats ? String(tBondStats.circulatingSupply) : null),[tBondStats],);
  const tBondTotalSupply = useMemo(() => (tBondStats ? String(tBondStats.totalSupply) : null), [tBondStats]);

  const { onStake } = useStakeToBoardroom();
  const { onWithdraw } = useWithdrawFromBoardroom();

  const rows = [
    createData({ name: '$BOMB', icon: '' }, bombCirculatingSupply, bombTotalSupply, bombPriceInBNB, 4.0),
    createData({ name: '$BSHARE', icon: '' }, bShareCirculatingSupply, bShareTotalSupply, bSharePriceInDollars, 4.3),
    createData({ name: '$BBOND', icon: '' }, tBondCirculatingSupply, tBondTotalSupply, tBondPriceInDollars, 6.0),
  ];

  const {onReward} = useHarvestFromBoardroom();
  const earnings = useEarningsOnBoardroom();
  const canClaimReward = useClaimRewardCheck();
  const tokenBalance = useTokenBalance(bombFinance.BOMB);

  const tokenPriceInDollars = useMemo(
    () => (bombStats ? Number(bombStats.priceInDollars).toFixed(2) : null),
    [bombStats],
  );

  const earnedInDollars = (Number(tokenPriceInDollars) * Number(getDisplayBalance(earnings))).toFixed(2);

  const [onPresentDeposit, onDismissDeposit] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentWithdraw, onDismissWithdraw] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'BShare'}
    />,
  );

  const [onPresentDepositBomb, onDismissDepositBomb] = useModal(
    <DepositModal
      max={tokenBalance}
      onConfirm={(value) => {
        onStake(value);
        onDismissDeposit();
      }}
      tokenName={'LP Tokens'}
    />,
  );

  const [onPresentWithdrawBomb, onDismissWithdrawBomb] = useModal(
    <WithdrawModal
      max={stakedBalance}
      onConfirm={(value) => {
        onWithdraw(value);
        onDismissWithdraw();
      }}
      tokenName={'LP Tokens'}
    />,
  );

  
  return (
    <div className="page-container">
    <Page>
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />

      <Box mt={5} style={{ minHeight: '100vh' }}>
        <Grid container justifyContent="center" direction="column" alignItems="center">

          {/* CARD 1 */}

          {/* CARD 1 LEFT*/}

          <Card style={{ width: '80%', marginBottom: '20px', backgroundColor: '#20254380' }} >
            <CardContent style={{ textAlign: 'center' }}>
              <Typography style={{ textTransform: 'capitalize', color: '#fff', marginBottom: '10px', fontSize: '22px' }} >
                Bomb Finance Summary
              </Typography>
              <Divider light={true} style={{ backgroundColor: '#C3C5CBBF' }} />
            </CardContent>
            <CardContent style={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <TableContainer component={Paper} style={{ backgroundColor: 'transparent' }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell></TableCell>
                        <TableCell align="center">Current supply</TableCell>
                        <TableCell align="center">Total supply</TableCell>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center"></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => (
                        <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <div>
                              <img src="" alt=""/>
                              <Typography>{row.name.name}</Typography>
                            </div>
                          </TableCell>
                          <TableCell align="center">{row.calories}</TableCell>
                          <TableCell align="center">{row.fat}</TableCell>
                          <TableCell align="center">{row.carbs}</TableCell>
                          <TableCell align="center">
                            <img 
                              src={metamask} 
                              alt=""
                              style={{
                                height: '40px',
                                width: '40px',
                              }}/>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* TOP CARD 1 RIGHT*/}
                              
              <Box style={{ marginRight: '5%' }}>
                <Typography style={{ fontSize: '18px' }}>Current Epoch</Typography>
                <Typography style={{ fontSize: '34px' }}>{Number(currentEpoch)}</Typography>
                <hr></hr>
                <div style={{fontSize: '34px'}}>
                <ProgressCountdown style={{marginTop: '0px', fontSize: '34px'}} base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                </div>
                <Typography style={{ fontSize: '18px' }}>Next Epoch in</Typography>
                <hr></hr>
                <Typography style={{ fontSize: '14px' }}>
                  Live TWAP: <span style={{ color: '#00E8A2' }}>{'-'}</span>{' '}
                </Typography>
                <Typography style={{ fontSize: '14px' }}>
                  <span style={{ fontSize: '14px' }}>TVL: </span>
                  <CountUp style={{ color: '#00E8A2' }} end={TVL} separator="," prefix="$" />
                </Typography>
                <Typography style={{ fontSize: '14px' }}>
                  Last Epoch TWAP: <span style={{ color: '#00E8A2' }}>{bondScale || '-'}</span>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* CARD 2 */}
          
          <Card style={{ width: '80%', marginBottom: '20px', backgroundColor: 'transparent', height: '450px' }}>
            <CardContent align="center" style={{ display: 'flex' }}>

              {/* BOX LEFT */}
            
              <Box style={{ width: `calc(75% - 20px)`, backgroundColor: 'transparent' }}>
                <div>

                  {/* INVEST + DISCORD + DOCS BUTTON */}

                  <Box
                    style={{
                      width: '100%',
                      height: '40px',
                      backgroundColor: '#13989c',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <p style={{ verticalAlign: 'center', fontSize: '24px', fontWeight: '800' }}>Invest Now</p>
                  </Box>

                  <Box style={{ display: 'flex' }}>
                    <p
                      style={{
                        width: '50%',
                        height: '40px',
                        backgroundColor: '#E5E5E5',
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px',
                      }}
                    >
                      Chat on discord
                    </p>
                    <p
                      style={{
                        width: '45%',
                        height: '40px',
                        marginLeft: 'auto',
                        backgroundColor: '#E5E5E5',
                        color: 'black',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '18px',
                      }}
                    >
                      Read on docs
                    </p>
                  </Box>
                </div>
              </Box>
            </CardContent>
          </Card>

        </Grid>
      </Box>
    </Page>  
    </div>
  );
};

export default Dashboard;
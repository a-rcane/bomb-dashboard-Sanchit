import React, {useMemo} from 'react';
import { Helmet } from 'react-helmet';
import { createGlobalStyle } from 'styled-components';
import { Box, Card, CardContent, Typography, Grid } from '@material-ui/core';
import ProgressCountdown from '../Boardroom/components/ProgressCountdown';
import metamask from '../../assets/img/metamask-fox.svg';
import moment from 'moment';
import Divider from '@material-ui/core/Divider/Divider';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Paper from '@material-ui/core/Paper';
import useCurrentEpoch from '../../hooks/useCurrentEpoch';
import useTreasuryAllocationTimes from '../../hooks/useTreasuryAllocationTimes';
import useBondStats from '../../hooks/useBondStats';
import useTotalValueLocked from '../../hooks/useTotalValueLocked';
import CountUp from 'react-countup';
import useCashPriceInLastTWAP from '../../hooks/useCashPriceInLastTWAP';
import useShareStats from '../../hooks/usebShareStats';
import useBombStats from '../../hooks/useBombStats';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
} 


const Dashboard = () => {
  const BackgroundImage = createGlobalStyle`
  body {
    background-size: cover !important;
    background-color: #171923;
  }`;

  const currentEpoch = useCurrentEpoch();
  const TITLE = 'bomb.money';
  const { to } = useTreasuryAllocationTimes();
  const TVL = useTotalValueLocked();
  const cashPrice = useCashPriceInLastTWAP();
  const bondScale = (Number(cashPrice) / 100000000000000).toFixed(4); 
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

  const rows = [
    createData({ name: '$BOMB', icon: '' }, bombCirculatingSupply, bombTotalSupply, bombPriceInBNB, 4.0),
    createData({ name: '$BSHARE', icon: '' }, bShareCirculatingSupply, bShareTotalSupply, bSharePriceInDollars, 4.3),
    createData({ name: '$BBOND', icon: '' }, tBondCirculatingSupply, tBondTotalSupply, tBondPriceInDollars, 6.0),
  ];
  
  return (
    <div className="page-container">
      <Helmet>
        <title>{TITLE}</title>
      </Helmet>
      <BackgroundImage />

      <Box mt={5} style={{ minHeight: '100vh' }}>
        <Grid container justifyContent="center" direction="column" alignItems="center">

          {/* TOP CARD 1 */}

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

              <Box style={{ marginRight: '5%' }}>
                <Typography style={{ fontSize: '18px' }}>Current Epoch</Typography>
                <Typography style={{ fontSize: '34px' }}>{Number(currentEpoch)}</Typography>
                <hr></hr>
                {/* <Typography style={{ fontSize: '35px' }}>03:38:36</Typography> */}
                <div style={{fontSize: '34px'}}>
                <ProgressCountdown style={{marginTop: '0px', fontSize: '34px'}} base={moment().toDate()} hideBar={true} deadline={to} description="Next Epoch" />
                </div>
                <Typography style={{ fontSize: '18px' }}>Next Epoch in</Typography>
                <hr></hr>
                <Typography style={{ fontSize: '14px' }}>
                  Live TWAP: <span style={{ color: '#00E8A2' }}>1.17</span>{' '}
                </Typography>
                <Typography style={{ fontSize: '14px' }}>
                  <span style={{ color: '#00E8A2' }}>TVL:</span>
                  <CountUp style={{ fontSize: '14px' }} end={TVL} separator="," prefix="$" />
                </Typography>
                <Typography style={{ fontSize: '14px' }}>
                  Last Epoch TWAP: <span style={{ color: '#00E8A2' }}>{bondScale || '-'}</span>
                </Typography>
              </Box>
            </CardContent>
          </Card>
          
        </Grid>
      </Box>
    </div>
  );
};

export default Dashboard;
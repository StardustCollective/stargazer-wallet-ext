/////////////////////////
// Module Imports
/////////////////////////

import { makeStyles } from '@material-ui/core/styles'

/////////////////////////
// Components Imports
/////////////////////////

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import {LedgerAccount} from '@stardust-collective/dag4-ledger';

/////////////////////////
// Styles
/////////////////////////

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

/////////////////////////
// Interfaces
/////////////////////////
interface IAccountsProps {
  onTxClick: (index: number) => void;
  accountData: LedgerAccount[];
}

/////////////////////////
// Constants
/////////////////////////

// Strings
const TABLE_HEADER_STRINGS = {
  ACCOUNT: 'Account',
  ADDRESS: 'Address',
  BALANCE: 'Balance',
};
const GENERATE_TRANSACTION_LINK_STRING = 'Generate Transaction'

/////////////////////////
// View
/////////////////////////

let Accounts = (props: IAccountsProps) => {

  let {
    accountData
  } = props;

  const onGenerateClick = (index: number) => {

    if(props.onTxClick){
      props.onTxClick(index);
    }

  };

  /////////////////////////
  // Hooks
  /////////////////////////

  const classes = useStyles();

  /////////////////////////
  // Render
  /////////////////////////

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>{TABLE_HEADER_STRINGS.ACCOUNT}</TableCell>
            <TableCell align='left'>{TABLE_HEADER_STRINGS.ADDRESS}</TableCell>
            <TableCell align="left">{TABLE_HEADER_STRINGS.BALANCE}</TableCell>
            <TableCell align="left"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {accountData.map((item, itemKey) => (
            <TableRow key={itemKey}>
              <TableCell component="th" scope="row">
                {itemKey + 1}
              </TableCell>
              <TableCell align="left">{item.address}</TableCell>
              <TableCell align="left">{item.balance}</TableCell>
              <TableCell align="left"><button onClick={() => onGenerateClick(itemKey)} >{GENERATE_TRANSACTION_LINK_STRING}</button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Accounts;

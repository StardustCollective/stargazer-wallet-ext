/////////////////////////
// Module Imports
/////////////////////////

import { makeStyles, withStyles } from '@material-ui/core/styles'

/////////////////////////
// Components Imports
/////////////////////////

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Checkbox } from '@material-ui/core';
import React from 'react';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';

/////////////////////////
// Styles
/////////////////////////

import styles from './styles.module.scss';

const useStyles = makeStyles({
  table: {
    backgroundColor: '#fffff',
    width: 350,
    fontWeight: 'bold',
    // minWidth: 150,
  },
});

const TableCell = withStyles({
  root: {
    borderBottom: "none"
  }
})(MUITableCell);

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

    if (props.onTxClick) {
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

  // const renderAccounts = (accountItem, index: number) => {
  //   return (
  //     <tr key={`wallet-${index}`}>
  //       <td>
  //         <Checkbox color="primary" />
  //       </td>
  //       <td>{index + 1}</td>
  //       <td>{accountItem.address}</td>
  //       <td>{accountItem.balance} DAG</td>
  //       {/* <td className={styles.expand}>
  //         <CallMadeIcon />
  //       </td> */}
  //     </tr>
  //   );
  // };

  // return (
  //   <div className="accounts">
  //     <span>Please select an account:</span>
  //     <div className={styles.wallet}>
  //       <table>
  //         <tbody>
  //           {accountData.map(
  //             (accountItem , index: number) =>
  //             renderAccounts(accountItem, index)
  //           )}
  //         </tbody>
  //       </table>
  //     </div>
  //     <div className={styles.pagination}>
  //       <span className={styles.previous}>Previous</span>
  //       <span>Next</span>
  //     </div>
  //   </div>
  // );

  function ellipsesString(str) {
    return str.substr(0, 4) + '...' + str.substr(str.length - 4, str.length);

  }

  return (
    <div className={styles.tableContainer}>
      <TableContainer elevation={0} className={classes.table}  component={Paper}>
        <Table aria-label="simple table">
          <TableBody>
            {accountData.map((item, itemKey) => (
              <TableRow key={itemKey}>
                <TableCell padding='none' size='small' align="center">
                  <Checkbox padding='none' color="primary" />
                </TableCell>
                <TableCell padding='none' size='small' align="center">
                  {itemKey + 1}
                </TableCell>
                <TableCell padding='none' size='small' align="center">{ellipsesString(item.address)}</TableCell>
                <TableCell padding='none' size='small' align="center">{item.balance} DAG</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Accounts;

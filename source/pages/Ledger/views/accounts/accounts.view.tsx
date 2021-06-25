/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles'
import clsx from 'clsx';

/////////////////////////
// Helpers
/////////////////////////

import { ellipsis } from '../../../../containers/auth/helpers';

/////////////////////////
// Components Imports
/////////////////////////

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Checkbox, Link } from '@material-ui/core';
import Button from 'components/Button';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';

/////////////////////////
// Styles
/////////////////////////

import styles from './styles.module.scss';

const useStyles = makeStyles({
  table: {
    backgroundColor: '#fffff',
    width: "100%",
  },
});

const TableCell = withStyles({
  root: {
    borderBottom: "none",
    fontWeight: 600,
    fontFamily: 'Inter',
  }
})(MUITableCell);

/////////////////////////
// Interfaces
/////////////////////////
interface IAccountsProps {
  accountData: LedgerAccount[];
  onCancelClick: () => {};
  onImportClick: () => {};
  onCheckboxChange: () => {};
  onNextClick: () => {};
  onPreviousClick: () => {};
}
interface IUiTableCell {
  children: React.ReactNode;
};

/////////////////////////
// Constants
/////////////////////////

// Strings
const DAG_STRING: string = 'DAG';
const PREV_BUTTON_LABEL_STRING: string = 'Previous';
const NEXT_BUTTON_LABEL_STRING: string = 'Next';
const CANCEL_BUTTON_LABEL_STRING: string = 'Cancel';
const IMPORT_BUTTON_LABEL_STRING: string = 'Import';
// Numbers
const PREVIEW_CHARACTERS_NUMBER: number = 4;
// Props
const TABLE_ELEVATION_PROP = 0;
const CHECKBOX_COLOR_PROP = 'primary';
const CANCEL_BUTTON_TYPE_PROP = 'button';
const CANCEL_BUTTON_THEME_PROP = 'secondary';
const IMPORT_BUTTON_TYPE_PROP = 'submit';
const TABLE_ARIA_LABEL_PROP = 'simple table'
const TABLE_CELL_PADDING_PROP = 'none';
const TABLE_CELL_SIZE_PROP = 'small';
const TABLE_CELL_ALIGN_PROP = 'center';

/////////////////////////
// View
/////////////////////////

let Accounts = ({ 
  accountData, 
  onCancelClick,
  onImportClick,
  onNextClick,
  onPreviousClick,
  onCheckboxChange,
}: IAccountsProps) => {

  /////////////////////////
  // Hooks
  /////////////////////////

  const classes = useStyles();

  /////////////////////////
  // Render
  /////////////////////////

  const UITableCell = ({ children }: IUiTableCell): JSX.Element =>
    <>
      <TableCell 
        padding={TABLE_CELL_PADDING_PROP} 
        size={TABLE_CELL_SIZE_PROP} 
        align={TABLE_CELL_ALIGN_PROP}>
        {children}
      </TableCell>
    </>
    ;

  return (
    <div className={styles.tableContainer}>
      <span className={styles.selectAccount}>Please select an account:</span>
      <TableContainer elevation={TABLE_ELEVATION_PROP} className={classes.table} component={Paper}>
        <Table aria-label={TABLE_ARIA_LABEL_PROP}>
          <TableBody>
            {accountData.map((item, itemKey) => (
              <TableRow key={itemKey}>
                <UITableCell>
                  <Checkbox onChange={onCheckboxChange} color={CHECKBOX_COLOR_PROP} />
                </UITableCell>
                <UITableCell>
                  {itemKey + 1}
                </UITableCell>
                <UITableCell>{ellipsis(item.address, PREVIEW_CHARACTERS_NUMBER, PREVIEW_CHARACTERS_NUMBER)}</UITableCell>
                <UITableCell>{item.balance} {DAG_STRING}</UITableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className={styles.pagination}>
        <Link onClick={onPreviousClick}>
          <span className={styles.previous}>
            {PREV_BUTTON_LABEL_STRING}
          </span>
        </Link>
        <Link onClick={onNextClick}>
          <span>{NEXT_BUTTON_LABEL_STRING}</span>
        </Link>
      </div>
      <section className={styles.actions}>
        <div className={styles.buttonWrapper}>
          <Button
            type={CANCEL_BUTTON_TYPE_PROP}
            theme={CANCEL_BUTTON_THEME_PROP}
            variant={clsx(styles.button, styles.cancel)}
            onClick={onCancelClick}
          >
            {CANCEL_BUTTON_LABEL_STRING}
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button 
            type={IMPORT_BUTTON_TYPE_PROP} 
            variant={styles.button}
            onClick={onImportClick}
          >
            {IMPORT_BUTTON_LABEL_STRING}
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Accounts;

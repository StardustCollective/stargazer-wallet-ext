/////////////////////////
// Module Imports
/////////////////////////

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { LedgerAccount } from '@stardust-collective/dag4-ledger';

/////////////////////////
// Helpers
/////////////////////////

import { ellipsis } from 'scenes/home/helpers';

/////////////////////////
// Components Imports
/////////////////////////

import MUITable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Checkbox /*Link*/ } from '@material-ui/core';
import Button from 'components/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

/////////////////////////
// Styles
/////////////////////////

import styles from './styles.module.scss';

const TableCell = withStyles({
  root: {
    borderBottom: 'none',
    fontWeight: 600,
    fontFamily: 'Inter',
  },
})(MUITableCell);

const Table = withStyles({
  root: {
    backgroundColor: '#F5F5F5',
  },
})(MUITable);

/////////////////////////
// Interfaces
/////////////////////////
interface IAccountsProps {
  accountData: LedgerAccount[];
  onCancelClick: () => void;
  onImportClick: () => void;
  onCheckboxChange: (account: LedgerAccount, checked: boolean, key: number) => void;
  // onNextClick: () => void;
  // onPreviousClick: () => void;
  checkBoxesState: boolean[];
  fetchingPage: boolean;
  startIndex: number;
}
interface IUiTableCell {
  children: React.ReactNode;
}

/////////////////////////
// Constants
/////////////////////////

// Strings
const DAG_STRING: string = 'DAG';
// const PREV_BUTTON_LABEL_STRING: string = 'PREVIOUS';
// const NEXT_BUTTON_LABEL_STRING: string = 'NEXT';
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
const TABLE_ARIA_LABEL_PROP = 'simple table';
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
  // onNextClick,
  // onPreviousClick,
  onCheckboxChange,
  checkBoxesState,
  fetchingPage,
  startIndex,
}: IAccountsProps) => {
  /////////////////////////
  // Callback
  /////////////////////////

  const _onCheckboxChange = (account: LedgerAccount, checked: boolean, key: number) => {
    if (onCheckboxChange) {
      onCheckboxChange(account, checked, key);
    }
  };

  /////////////////////////
  // Render
  /////////////////////////

  const UITableCell = ({ children }: IUiTableCell): JSX.Element => (
    <>
      <TableCell
        padding={TABLE_CELL_PADDING_PROP}
        size={TABLE_CELL_SIZE_PROP}
        align={TABLE_CELL_ALIGN_PROP}
      >
        {children as any}
      </TableCell>
    </>
  );
  return (
    <div className={styles.tableContainer}>
      <span className={styles.selectAccount}>Please select an account:</span>
      <TableContainer
        elevation={TABLE_ELEVATION_PROP}
        className={styles.table}
        component={Paper}
      >
        {fetchingPage && (
          <div className={styles.progressWrapper}>
            <div className={styles.progress}>
              <CircularProgress />
            </div>
          </div>
        )}
        <Table aria-label={TABLE_ARIA_LABEL_PROP}>
          <TableBody>
            {accountData.map((item, itemKey) => {
              let key = itemKey + startIndex + 1;
              return (
                <TableRow key={itemKey}>
                  <UITableCell>
                    <Checkbox
                      checked={checkBoxesState[key]}
                      onChange={(_, checked) => {
                        _onCheckboxChange(item, checked, key);
                      }}
                      color={CHECKBOX_COLOR_PROP}
                    />
                  </UITableCell>
                  <UITableCell>
                    <span>{key}</span>
                  </UITableCell>
                  <UITableCell>
                    <span>
                      {ellipsis(
                        item.address,
                        PREVIEW_CHARACTERS_NUMBER,
                        PREVIEW_CHARACTERS_NUMBER
                      )}
                    </span>
                  </UITableCell>
                  <UITableCell>
                    <span>
                      {item.balance} {DAG_STRING}
                    </span>
                  </UITableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <div className={styles.pagination}>
        {!fetchingPage ? (
          <>
            {startIndex !== 0 && (
              <Link onClick={onPreviousClick}>
                <span className={styles.previous}>
                  {PREV_BUTTON_LABEL_STRING}
                </span>
              </Link>
            )
            }
            <Link onClick={onNextClick}>
              <span>{NEXT_BUTTON_LABEL_STRING}</span>
            </Link>
          </>
        ) : (
          <>
            <span className={styles.previous}>
              {PREV_BUTTON_LABEL_STRING}
            </span>
            <span>{NEXT_BUTTON_LABEL_STRING}</span>
          </>
        )}
      </div> */}
      <section className={styles.actions}>
        <div className={styles.buttonWrapper}>
          <Button
            type={CANCEL_BUTTON_TYPE_PROP}
            theme={CANCEL_BUTTON_THEME_PROP}
            variant={clsx(styles.button, styles.cancel)}
            onClick={onCancelClick}
            disabled={fetchingPage}
          >
            {CANCEL_BUTTON_LABEL_STRING}
          </Button>
        </div>
        <div className={styles.buttonWrapper}>
          <Button
            type={IMPORT_BUTTON_TYPE_PROP}
            variant={styles.button}
            onClick={onImportClick}
            disabled={fetchingPage}
          >
            {IMPORT_BUTTON_LABEL_STRING}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Accounts;

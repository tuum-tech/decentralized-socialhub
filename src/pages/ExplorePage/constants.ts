/**
 * Shared constants
 */
import baseConst from '../../shared-base/xconstants';

/**
 * Base Namespace for the page
 * Use it wisely, as it affects your pagename
 */
export const NameSpace = 'ExplorePage';

/***
 * Action Definitions - START
 * Action names should be declarative that can be understood.
 * So we would encourage you to use AJAX or STATE names to signify the action done
 * Names to choose - { STATE / FETCH }_{ WORK DONE ? }_{ TARGET }
 * ***/
export const Actions = {
  STATE_COUNT_INCREMENT: `[Page] -> ${NameSpace}/STATE_COUNT_INCREMENT`,
  STATE_PUT_AJAX: `[Page] -> ${NameSpace}/STATE_PUT_AJAX`,
  FETCH_GET_AJAX: `[Page] -> ${NameSpace}/FETCH_GET_AJAX`
};
/*** Action Definitions - END ***/

/** Component Constants - START */
export const Api = {
  sample: `${baseConst.base}v2/5e88d29a3100007700d39adc`
};
/** Component Constants - END */

/** Pagination Dropdown Select - START */
export const ITEMS_PER_PAGE_DEFAULT = [
  { value: 0, label: 10 },
  { value: 1, label: 20 },
  { value: 2, label: 50 },
  { value: 3, label: 100 }
];
export const ITEMS_PER_PAGE_SPACES = [
  { value: 0, label: 9 },
  { value: 1, label: 18 },
  { value: 2, label: 45 },
  { value: 3, label: 90 }
];
/** Pagination Dropdown Select - END */

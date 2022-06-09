import { IonSearchbar } from '@ionic/react';
import styled from 'styled-components';

const SearchInput = styled(IonSearchbar)`
  padding-left: 0;
  padding-right: 0;
  margin-bottom: 8px;
  max-width: 568px;

  input.searchbar-input {
    background: #edf2f7;
    box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
      0px 0px 1px rgba(50, 50, 71, 0.2);
    border-radius: 6px;
  }
`;

export default SearchInput;

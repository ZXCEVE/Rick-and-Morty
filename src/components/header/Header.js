import styled from 'styled-components';
import { Logo } from './Logo';
import { CharacterFilter } from '../filter/Filter';

export function Header() {
  return (
    <HeaderContainer>
      <Logo />
      <FilterWrapper>
        <CharacterFilter />
      </FilterWrapper>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;

  @media (max-width: 930px) {
    flex-direction: column;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const FilterWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

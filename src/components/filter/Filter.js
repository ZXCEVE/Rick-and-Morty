import styled from 'styled-components';
import { useState, useCallback } from 'react';
import Select, { components } from 'react-select';
import { useData } from '../providers';

const Icon = (props) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#8a9aba"
    strokeWidth="2"
    {...props}
  />
);

const ChevronIcon = ({ isOpen }) => (
  <Icon
    isOpen={isOpen}
    style={{
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.2s ease'
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </Icon>
);

const CloseIcon = () => {
  const handleMouseEnter = useCallback(
    (e) => (e.currentTarget.style.stroke = '#ff5152'),
    []
  );
  const handleMouseLeave = useCallback(
    (e) => (e.currentTarget.style.stroke = '#8a9aba'),
    []
  );

  return (
    <Icon
      width="14"
      height="14"
      style={{ cursor: 'pointer' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </Icon>
  );
};

const DropdownIndicator = (props) => (
  <components.DropdownIndicator {...props}>
    <ChevronIcon isOpen={props.selectProps.menuIsOpen} />
  </components.DropdownIndicator>
);

const ClearIndicator = (props) => (
  <components.ClearIndicator {...props}>
    <CloseIcon />
  </components.ClearIndicator>
);

const OPTIONS = {
  status: ['alive', 'dead', 'unknown'],
  gender: ['female', 'male', 'genderless', 'unknown'],
  species: [
    'human',
    'alien',
    'humanoid',
    'robot',
    'animal',
    'mythological',
    'unknown'
  ]
};

const createOptions = (arr) =>
  arr.map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) }));

const STATUS_OPTIONS = createOptions(OPTIONS.status);
const GENDER_OPTIONS = createOptions(OPTIONS.gender);
const SPECIES_OPTIONS = createOptions(OPTIONS.species);

const selectStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#1a263900',
    border: '1px solid #83bf46',
    borderRadius: '6px',
    color: '#fff',
    minHeight: '38px',
    cursor: 'pointer',
    '&:hover': { borderColor: '#83bf46' }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#fff',
    border: '1px solid #3a4a6a',
    borderRadius: '6px',
    maxHeight: '170px',
    overflowY: 'auto'
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: '#fff',
    color: '#000',
    cursor: 'pointer',
    fontWeight: state.isSelected ? 'bold' : 'normal',
    '&:hover': { backgroundColor: '#82bf469a' }
  }),
  singleValue: (base) => ({ ...base, color: '#fff' }),
  input: (base) => ({ ...base, color: '#fff' }),
  placeholder: (base) => ({ ...base, color: '#8a9aba' }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: '#8a9aba',
    padding: '0 8px',
    display: state.hasValue ? 'none' : 'flex'
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#8a9aba',
    padding: '0 8px',
    cursor: 'pointer',
    '&:hover': { color: '#ff5152' }
  }),
  indicatorSeparator: () => ({ display: 'none' }),
  valueContainer: (base) => ({ ...base, padding: '0 12px', gap: '0' })
};

export function CharacterFilter() {
  const { filters, setFilters } = useData();
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = useCallback(
    (key, value) => setLocalFilters((prev) => ({ ...prev, [key]: value })),
    []
  );
  const applyFilters = useCallback(() => setFilters(localFilters), [
    localFilters,
    setFilters
  ]);
  const resetFilters = useCallback(() => {
    const empty = { name: '', type: '', status: '', gender: '', species: '' };
    setLocalFilters(empty);
    setFilters(empty);
  }, [setFilters]);

  const selectProps = (type, options) => ({
    isClearable: true,
    value: options.find((o) => o.value === localFilters[type]) || null,
    onChange: (opt) => handleFilterChange(type, opt?.value || ''),
    options,
    styles: selectStyles,
    placeholder: type.charAt(0).toUpperCase() + type.slice(1)
  });

  const handleNameChange = useCallback(
    (e) => handleFilterChange('name', e.target.value),
    [handleFilterChange]
  );
  const handleTypeChange = useCallback(
    (e) => handleFilterChange('type', e.target.value),
    [handleFilterChange]
  );

  return (
    <FilterContainer>
      <StyledSelect {...selectProps('status', STATUS_OPTIONS)} />
      <StyledSelect {...selectProps('gender', GENDER_OPTIONS)} />
      <StyledSelect {...selectProps('species', SPECIES_OPTIONS)} />
      <Input
        placeholder="Name"
        value={localFilters.name}
        onChange={handleNameChange}
      />
      <Input
        placeholder="Type"
        value={localFilters.type}
        onChange={handleTypeChange}
      />
      <ButtonGroup>
        <Button $variant="primary" onClick={applyFilters}>
          Apply
        </Button>
        <Button $variant="secondary" onClick={resetFilters}>
          Reset
        </Button>
      </ButtonGroup>
    </FilterContainer>
  );
}

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
const StyledSelect = styled(Select).attrs({
  components: {
    DropdownIndicator,
    ClearIndicator,
    SingleValue: components.SingleValue,
    IndicatorSeparator: () => null
  }
})`
  flex: 1;
  background: #1a2639a9;
  color: #fff;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  text-transform: capitalize;
  &:hover,
  &:focus {
    border-color: #83bf46;
    outline: none;
    background: #3a4a6a56;
  }
  option {
    text-transform: capitalize;
    background: #fff;
    color: #000;
    border-radius: 6px;
  }
`;
const Input = styled.input`
  flex: 1;
  padding: 10px 12px;
  background: #1a2639a9;
  color: #fff;
  border: 1px solid #83bf46;
  border-radius: 6px;
  font-size: 14px;
  &::placeholder {
    color: #8a9aba;
  }
  &:hover,
  &:focus {
    border-color: #83bf46;
    background: #3a4a6a56;
    outline: none;
  }
`;
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;
const Button = styled.button`
  flex: 1;
  padding: 10px 16px;
  background: none;
  border: 1px solid ${(p) => (p.$variant === 'primary' ? '#6aa838' : '#ff5152')};
  color: ${(p) => (p.$variant === 'primary' ? '#6aa838' : '#ff5152')};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  &:hover {
    background: ${(p) => (p.$variant === 'primary' ? '#6aa838' : '#ff5152')};
    color: white;
  }
  &:active {
    transform: scale(0.98);
  }
`;

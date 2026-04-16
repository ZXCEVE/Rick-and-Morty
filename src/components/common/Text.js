import styled from 'styled-components';

export function Text({
  className,
  children,
  style,
  color = '#ccc',
  fontSize = '16px'
}) {
  return (
    <StyledText
      className={className}
      style={style}
      $color={color}
      $fontSize={fontSize}
    >
      {children}
    </StyledText>
  );
}

const StyledText = styled.span`
  color: ${({ $color }) => $color};
  font-size: ${({ $fontSize }) => $fontSize};
`;

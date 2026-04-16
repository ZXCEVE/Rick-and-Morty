import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { ReactComponent as Male } from '../assets/genders/male.svg';
import { ReactComponent as Female } from '../assets/genders/female.svg';
import { ReactComponent as Genderless } from '../assets/genders/genderless.svg';

const genderIcons = {
  Male: <Male width={20} height={20} fill="#33b3c8" title="Male" />,
  Female: <Female width={24} height={24} fill="pink" title="Female" />,
  unknown: <Genderless width={24} height={24} fill="#999" title="Genderless" />
};

const statusColors = { Alive: '#83bf46', Dead: '#ff5152', default: '#968c9d' };

export function Card({
  status,
  name,
  species,
  type,
  gender,
  image,
  onClickHandler
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleLoad = useCallback(() => setImgLoaded(true), []);
  const handleError = useCallback(() => setImgError(true), []);

  return (
    <StyledCard onClick={onClickHandler}>
      <ImageContainer>
        {!imgLoaded && !imgError && <PlaceholderImage />}
        {imgError && <PlaceholderImage />}
        <CardImg
          src={image}
          alt={name}
          $loaded={imgLoaded}
          onLoad={handleLoad}
          onError={handleError}
        />
      </ImageContainer>
      <CardInfo>
        <CardTitle name={name} gender={gender} />
        <CardStatus status={status} species={species} type={type} />
      </CardInfo>
    </StyledCard>
  );
}

export const CardTitle = ({ name, gender, className }) => (
  <CardTitleContainer className={className}>
    <StyledCardTitle className="card-title">{name}</StyledCardTitle>
    <IconContainer>{genderIcons[gender] || null}</IconContainer>
  </CardTitleContainer>
);

export const CardStatus = ({ status, species, type, className }) => (
  <CardStatusContainer className={className}>
    <StyledCardStatus $status={status}>{status}</StyledCardStatus>
    &nbsp;-&nbsp;<span>{species}</span>
    {type && <CardType>{type}</CardType>}
  </CardStatusContainer>
);

const StyledCard = styled.div`
  display: flex;
  width: 100%;
  max-width: 400px;
  flex-direction: column;
  background: #263750;
  border-radius: 10px;
  transition: transform 0.3s, box-shadow 0.3s;
  &:hover {
    cursor: pointer;
    transform: scale(1.01);
    box-shadow: 5px 5px 8px rgba(0, 0, 0, 0.2);
    .card-title {
      color: #83bf46;
    }
  }
`;

const PlaceholderImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  height: 50%;
  background: #1a2639;
`;

const CardImg = styled.img`
  border-radius: 10px 10px 0 0;
  opacity: ${({ $loaded }) => ($loaded ? 1 : 0)};
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: #1a2639;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
`;

const CardInfo = styled.div`
  display: flex;
  flex-direction: column;
  color: #fff;
  padding: 20px;
`;

const CardTitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledCardTitle = styled.h2`
  margin-right: 8px;
  transition: color 0.3s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  font-size: 24px;
  @media (max-width: 450px) {
    max-width: 130px;
    font-size: 18px;
  }
`;

const IconContainer = styled.div`
  display: flex;
`;

const CardStatusContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const StyledCardStatus = styled.span`
  display: flex;
  align-items: center;
  text-transform: capitalize;
  &::before {
    content: '';
    display: block;
    margin-right: 8px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background-color: ${({ $status }) =>
      statusColors[$status] || statusColors.default};
  }
`;

const CardType = styled.p`
  margin-top: 20px;
  width: 100%;
  color: #ddd;
  font-size: 16px;
`;

import styled from 'styled-components';
import { useEffect, useState, useCallback } from 'react';
import { useData } from './providers';

export function Pagination() {
  const [pages, setPages] = useState([]);
  const { apiURL, info, activePage, setActivePage, setApiURL } = useData();

  const pageClickHandler = useCallback(
    (index) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActivePage(index);
      setApiURL(pages[index].toString());
    },
    [pages, setActivePage, setApiURL]
  );

  const firstPageClick = useCallback(() => pageClickHandler(0), [
    pageClickHandler
  ]);
  const prevPageClick = useCallback(() => pageClickHandler(activePage - 1), [
    pageClickHandler,
    activePage
  ]);
  const nextPageClick = useCallback(() => pageClickHandler(activePage + 1), [
    pageClickHandler,
    activePage
  ]);
  const lastPageClick = useCallback(() => pageClickHandler(pages.length - 1), [
    pageClickHandler,
    pages.length
  ]);

  useEffect(() => {
    if (!apiURL || !info?.pages) return;

    const createdPages = Array.from({ length: info.pages }, (_, i) => {
      const URLWithPage = new URL(apiURL);

      URLWithPage.searchParams.set('page', i + 1);

      return URLWithPage;
    });

    setPages(createdPages);
  }, [apiURL, info]);

  if (pages.length <= 1) return null;

  return (
    <StyledPagination>
      {pages[activePage - 1] && (
        <>
          {activePage - 1 !== 0 && (
            <>
              <Page onClick={firstPageClick}>« First</Page>
              <Ellipsis>...</Ellipsis>
            </>
          )}

          <Page onClick={prevPageClick}>{activePage}</Page>
        </>
      )}

      <Page $active>{activePage + 1}</Page>

      {pages[activePage + 1] && (
        <>
          <Page onClick={nextPageClick}>{activePage + 2}</Page>

          {activePage !== pages.length - 1 && (
            <>
              <Ellipsis>...</Ellipsis>
              <Page onClick={lastPageClick}>Last »</Page>
            </>
          )}
        </>
      )}
    </StyledPagination>
  );
}

const StyledPagination = styled.div`
  width: 100%;
  text-align: center;
`;

const Page = styled.span`
  color: #fff;
  font-size: 18px;
  padding: 5px;
  cursor: pointer;
  transition: color 0.2s;
  ${({ $active }) => $active && 'color: #83bf46'};

  &:hover {
    color: #83bf46;
  }
`;

const Ellipsis = styled(Page)`
  cursor: default;

  &:hover {
    color: #fff;
  }
`;

import axios from 'axios';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef
} from 'react';

function getInitialPage() {
  const params = new URLSearchParams(window.location.search);
  const page = params.get('page');

  return page ? parseInt(page, 10) - 1 : 0;
}

function getInitialFilters() {
  const params = new URLSearchParams(window.location.search);

  return {
    name: params.get('name') || '',
    type: params.get('type') || '',
    status: params.get('status') || '',
    gender: params.get('gender') || '',
    species: params.get('species') || ''
  };
}

function buildApiURL(page, filters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  if (page > 0) params.append('page', page + 1);

  return `https://rickandmortyapi.com/api/character?${params.toString()}`;
}

export function DataProvider({ children }) {
  const initialPage = getInitialPage();
  const initialFilters = getInitialFilters();
  const [activePage, setActivePage] = useState(initialPage);
  const [filters, setFilters] = useState(initialFilters);
  const [characters, setCharacters] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [info, setInfo] = useState({});
  const [apiURL, setApiURL] = useState(() =>
    buildApiURL(initialPage, initialFilters)
  );
  const requestIdRef = useRef(0);

  const updateURL = (page, currentFilters) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page + 1);
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
    });
    window.history.pushState({}, '', url);
  };

  const setActivePageWithURL = useCallback(
    (page) => {
      setActivePage(page);
      updateURL(page, filters);
      setApiURL(buildApiURL(page, filters));
    },
    [filters]
  );

  const setFiltersAndUpdateURL = useCallback((newFilters) => {
    setFilters(newFilters);
    setActivePage(0);
    updateURL(0, newFilters);
    setApiURL(buildApiURL(0, newFilters));
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      const newPage = getInitialPage();
      const newFilters = getInitialFilters();
      setActivePage(newPage);
      setFilters(newFilters);
      setApiURL(buildApiURL(newPage, newFilters));
    };

    window.addEventListener('popstate', handlePopState);

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const fetchData = useCallback(async (url) => {
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

    setIsFetching(true);
    setIsError(false);

    axios
      .get(url)
      .then(({ data }) => {
        if (currentRequestId !== requestIdRef.current) return;
        setIsFetching(false);
        setCharacters(data.results);
        setInfo(data.info);
      })
      .catch((e) => {
        if (currentRequestId !== requestIdRef.current) return;
        setIsFetching(false);
        setIsError(true);
        console.error(e);
      });
  }, []);

  useEffect(() => {
    fetchData(apiURL);
  }, [apiURL, fetchData]);

  const dataValue = useMemo(
    () => ({
      activePage,
      setActivePage: setActivePageWithURL,
      filters,
      setFilters: setFiltersAndUpdateURL,
      apiURL,
      setApiURL,
      characters,
      fetchData,
      isFetching,
      isError,
      info
    }),
    [
      activePage,
      filters,
      apiURL,
      characters,
      isFetching,
      isError,
      info,
      fetchData,
      setActivePageWithURL,
      setFiltersAndUpdateURL
    ]
  );

  return (
    <DataContext.Provider value={dataValue}>{children}</DataContext.Provider>
  );
}

const DataContext = createContext({});

export const useData = () => useContext(DataContext);

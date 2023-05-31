import React, { useState, useEffect } from "react";
import { fetchRepos } from "../api";
import { useDebounce } from "../hooks/useDebounce";
import styled from "styled-components";
import Spinner from "./Spiner";

const Container = styled.div`
  padding: 30px 150px 0;
  width: 1400px;
  display: box-border;
`;

const SpinnerContainer = styled.div`
  padding: 100px 0;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 20px;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  margin-right: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin:0 5px;
  font-size: 16px;
  border: none;
  background-color: #007bff;
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
`;

const PageButton = styled.button`
  margin: 0 5px;
  padding: 5px 10px;
  font-size: 14px;
  border: none;
  background-color: ${(props) => (props.active ? "#007BFF" : "#FFF")};
  color: ${(props) => (props.active ? "#FFF" : "#007BFF")};
  cursor: pointer;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: ${(props) => (props.active ? "#007BFF" : "#EFEFEF")};
    color: ${(props) => (props.active ? "#FFF" : "#007BFF")};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const RepoInfo = styled.div`
  h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
  }

  p {
    font-size: 14px;
    margin-bottom: 5px;
  }
`;

const RepoInfoNoData = styled.p`
 margin:20px 0;
`;

const ReposList = () => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("React");
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    fetchRepos(debouncedSearchQuery, page, setRepos, setLoading, setTotalCount);
  }, [debouncedSearchQuery, page]);

  const handleNextPage = () => {
    setLoading(true);
    setPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setLoading(true);
    setPage((prevPage) => prevPage - 1);
  };

  const handlePageClick = (pageNumber) => {
    setLoading(true);
    setPage(pageNumber);
  };

  const handleSearch = (event) => {
    setPage(1);
    setSearchQuery(event.target.value);
  };

  const renderPageButtons = () => {
    const totalPages = Math.ceil(totalCount / 10);
    const maxButtonsToShow = 10;
    const startPage = Math.max(1, page - Math.floor(maxButtonsToShow / 2));
    const endPage = Math.min(startPage + maxButtonsToShow - 1, totalPages);

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => {
      const pageNumber = startPage + index;
      return (
        <PageButton
          key={pageNumber}
          active={pageNumber === page}
          onClick={() => handlePageClick(pageNumber)}
        >
          {pageNumber}
        </PageButton>
      );
    });
  };

  return (
    <Container>
      <Input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search repositories"
      />
      {loading ? (
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      ) : (
        <>
          {repos.length === 0 ? (
            <RepoInfoNoData>No repositories found</RepoInfoNoData>
          ) : (
            <List>
              {repos.map((repo) => (
                <ListItem key={repo.id}>
                  <Image src={repo.owner.avatar_url} alt="Repository" />
                  <RepoInfo>
                    <h3>{repo.name}</h3>
                    <p>Author: {repo.owner.login}</p>
                    <p>Followers: {repo.owner.followers}</p>
                    <p>Starred: {repo.stargazers_count}</p>
                  </RepoInfo>
                </ListItem>
              ))}
            </List>
          )}

          <Pagination>
            <Button disabled={page <= 1} onClick={handlePrevPage}>
              Prev Page
            </Button>
            {renderPageButtons()}
            <Button onClick={handleNextPage}>Next Page</Button>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default ReposList;

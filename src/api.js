import axios from 'axios';

export const fetchRepos = async (searchQuery, page, setRepos, setLoading,setTotalCount) => {
  try {
    const response = await axios.get(
      `https://api.github.com/search/repositories?q=${searchQuery}&page=${page}&per_page=5`
    );

    const repositories = response.data.items;
    setTotalCount(response.data.total_count);
    setRepos(repositories);
    setLoading(false);
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};

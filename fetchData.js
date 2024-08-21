export const fetchData = async (search) => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${search}&gsrlimit=${1000}&prop=pageimages|extracts&exchars=${1000}&exintro&explaintext&exlimit=max&format=json&origin=*`;

  try {
    const data = await fetch(url);
    const {
      query: { pages },
    } = await data.json();

    return pages;
  } catch (error) {
    console.log(error);
  }
};

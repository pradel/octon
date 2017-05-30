exports.graphqlFetch = async function graphqlFetch(url, query, variables = {}) {
  let data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  data = await data.json();
  return data;
};

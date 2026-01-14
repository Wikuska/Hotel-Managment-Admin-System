export const sortEntities = (data, key, direction = "asc") => {
  if (!data) return [];

  console.log(data);
  return [...data].sort((a, b) => {
    const valA = (a[key] || "").toString();
    const valB = (b[key] || "").toString();

    const comparison = valA.localeCompare(valB, undefined, { numeric: true });

    return direction === "asc" ? comparison : -comparison;
  });
};

export const filterEntities = (data, query, getSearchtableText) => {
  if (!query) return data;

  const lowerQuery = query.toLowerCase();

  return data.filter((item) => {
    const textToCheck = getSearchtableText(item).toLowerCase();
    return textToCheck.includes(lowerQuery);
  });
};

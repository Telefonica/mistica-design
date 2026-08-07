export const bfSessions = {
  January: 8072,
  February: 8234,
  March: 9608,
  April: 6717,
  May: 7753,
  June: 7753,
  July: 6430,
  August: 7403,
  September: 6374,
  October: 7269,
  November: 4343,
};

export const medianBFSessions = () => {
  const sessions = Object.values(bfSessions);
  const sortedSessions = sessions.sort((a, b) => a - b);
  const middleIndex = Math.floor(sortedSessions.length / 2);
  return sortedSessions[middleIndex];
};

const brandFactoryCountryUsage = [{ country: "Spain", count: 10 }];

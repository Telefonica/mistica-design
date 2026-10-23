const teamsMembersRaw = { count: 357, lastCount: 261 };

function calculatePercentageChange(currentCount, lastCount) {
  if (lastCount === undefined) {
    return ""; // or any other value you prefer for this case
  }

  const percentageChange = ((currentCount - lastCount) / lastCount) * 100;
  return `${parseFloat(percentageChange.toFixed(2))}%`;
}

export const teamsMembers = {
  ...teamsMembersRaw,
  percentageChange: calculatePercentageChange(
    teamsMembersRaw.count,
    teamsMembersRaw.lastCount
  ),
};

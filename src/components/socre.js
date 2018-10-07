export const teamScore = cards => {
  let teamA = 0,
    teamB = 0;
  cards.map((card, index) => {
    let winningScore = card.isWin ? 1 : 0;
    if ((index % 4) % 2 === 0) {
      teamA += winningScore;
    } else {
      teamB += winningScore;
    }
  });
  return {teamA: teamA, teamB: teamB};
};

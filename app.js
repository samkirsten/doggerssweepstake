const POINTS = {
    groupWin: 3,
    groupDraw: 1,
    roundOf32: 5,
    roundOf16: 10,
    quarterFinal: 20,
    semiFinal: 30,
    final: 50,
    winWorldCup: 75
};

function normalizeTeamName(name) {
    if (!name) return "";
    return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
}

function calculateTeamPoints(teamName, matches) {
    let points = 0;
    const normalizedTarget = normalizeTeamName(teamName);
    
    matches.forEach(match => {
        const team1Norm = normalizeTeamName(match.team1);
        const team2Norm = normalizeTeamName(match.team2);

        if (team1Norm !== normalizedTarget && team2Norm !== normalizedTarget) return;
        
        const isTeam1 = team1Norm === normalizedTarget;
        const round = match.round.toLowerCase();
        
        // Group Stage
        if (round.includes('matchday') || round.includes('group')) {
            if (match.score && match.score.ft) {
                const score1 = match.score.ft[0];
                const score2 = match.score.ft[1];
                
                if (score1 === score2) {
                    points += POINTS.groupDraw;
                } else if (isTeam1 && score1 > score2) {
                    points += POINTS.groupWin;
                } else if (!isTeam1 && score2 > score1) {
                    points += POINTS.groupWin;
                }
            }
        } else {
            // Knockout Stages - Award points just for reaching the fixture
            if (round.includes('round of 32')) points += POINTS.roundOf32;
            if (round.includes('round of 16')) points += POINTS.roundOf16;
            if (round.includes('quarter')) points += POINTS.quarterFinal;
            if (round.includes('semi')) points += POINTS.semiFinal;
            if (round.includes('final') && !round.includes('third place')) {
                points += POINTS.final;
                
                // Did they win the final?
                if (match.score) {
                    let team1Wins = false;
                    let team2Wins = false;
                    
                    if (match.score.p) {
                         team1Wins = match.score.p[0] > match.score.p[1];
                         team2Wins = match.score.p[1] > match.score.p[0];
                    } else if (match.score.et) {
                         team1Wins = match.score.et[0] > match.score.et[1];
                         team2Wins = match.score.et[1] > match.score.et[0];
                    } else if (match.score.ft) {
                         team1Wins = match.score.ft[0] > match.score.ft[1];
                         team2Wins = match.score.ft[1] > match.score.ft[0];
                    }
                    
                    if ((isTeam1 && team1Wins) || (!isTeam1 && team2Wins)) {
                        points += POINTS.winWorldCup;
                    }
                }
            }
        }
    });
    
    return points;
}

function getTeamStatus(teamName, matches) {
    const normTarget = normalizeTeamName(teamName);
    const teamMatches = matches.filter(m => {
        return normalizeTeamName(m.team1) === normTarget || normalizeTeamName(m.team2) === normTarget;
    });
    
    const playedMatches = teamMatches.filter(m => m.score);
    const unplayedMatches = teamMatches.filter(m => !m.score);
    
    let lostKnockout = false;
    let wonFinal = false;

    playedMatches.forEach(m => {
        const round = m.round.toLowerCase();
        if (round.includes('matchday') || round.includes('group')) return;
        
        const isTeam1 = normalizeTeamName(m.team1) === normTarget;
        let team1Wins = false;
        let team2Wins = false;
        
        if (m.score.p) {
             team1Wins = m.score.p[0] > m.score.p[1];
             team2Wins = m.score.p[1] > m.score.p[0];
        } else if (m.score.et) {
             team1Wins = m.score.et[0] > m.score.et[1];
             team2Wins = m.score.et[1] > m.score.et[0];
        } else if (m.score.ft) {
             team1Wins = m.score.ft[0] > m.score.ft[1];
             team2Wins = m.score.ft[1] > m.score.ft[0];
        }
        
        if ((isTeam1 && team2Wins) || (!isTeam1 && team1Wins)) {
            lostKnockout = true;
        }
        
        if (round.includes('final') && !round.includes('third place')) {
            if ((isTeam1 && team1Wins) || (!isTeam1 && team2Wins)) {
                wonFinal = true;
            }
        }
    });
    
    if (wonFinal) return "winner";
    if (unplayedMatches.length > 0) return "active";
    if (lostKnockout) return "eliminated";
    if (playedMatches.length >= 3) return "eliminated";
    
    return "active";
}

document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('sweepstake-grid');
    
    try {
        const response = await fetch('./data.json');
        if (!response.ok) throw new Error('Failed to load local data');
        const participants = await response.json();

        let matchData = null;
        try {
            // Using 2026 data. Note: it might not have results yet.
            const apiRes = await fetch('https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json');
            if (apiRes.ok) {
                matchData = await apiRes.json();
            }
        } catch (apiError) {
            console.warn('Could not fetch external API data', apiError);
        }

        // Calculate points for each participant
        participants.forEach(person => {
            person.totalPoints = 0;
            person.teamPoints = {};
            
            person.teams.forEach(team => {
                let pts = 0;
                if (matchData && matchData.matches) {
                    pts = calculateTeamPoints(team, matchData.matches);
                }
                person.teamPoints[team] = pts;
                person.totalPoints += pts;
            });
        });

        // Sort participants by total points descending
        participants.sort((a, b) => b.totalPoints - a.totalPoints);

        grid.innerHTML = '';

        // Render cards
        participants.forEach((person, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            
            // Add gold border to the leader
            if (index === 0 && person.totalPoints > 0) {
                card.classList.add('leader');
            }
            
            const header = document.createElement('div');
            header.className = 'card-header';
            
            const nameEl = document.createElement('h2');
            nameEl.textContent = person.name;
            if (index === 0 && person.totalPoints > 0) nameEl.textContent += ' 👑';

            const totalEl = document.createElement('div');
            totalEl.className = 'total-points';
            totalEl.textContent = `${person.totalPoints} pts`;

            header.appendChild(nameEl);
            header.appendChild(totalEl);
            card.appendChild(header);

            const teamList = document.createElement('ul');
            teamList.className = 'team-list';

            person.teams.forEach(team => {
                const li = document.createElement('li');
                li.className = 'team-item';
                
                const teamNameContainer = document.createElement('div');
                teamNameContainer.className = 'team-info-container';
                
                const teamName = document.createElement('span');
                teamName.className = 'team-name';
                teamName.textContent = team;
                teamNameContainer.appendChild(teamName);

                if (matchData && matchData.matches) {
                    const status = getTeamStatus(team, matchData.matches);
                    
                    if (status === 'winner') {
                        const matchInfo = document.createElement('span');
                        matchInfo.className = 'match-info winner-badge';
                        matchInfo.textContent = `Winner 🏆`;
                        teamNameContainer.appendChild(matchInfo);
                    } else if (status === 'eliminated') {
                        const matchInfo = document.createElement('span');
                        matchInfo.className = 'match-info eliminated-badge';
                        matchInfo.textContent = `Eliminated ❌`;
                        teamNameContainer.appendChild(matchInfo);
                    } else {
                        const normTarget = normalizeTeamName(team);
                        const nextMatch = matchData.matches.find(m => {
                            const m1 = normalizeTeamName(m.team1);
                            const m2 = normalizeTeamName(m.team2);
                            return (m1 === normTarget || m2 === normTarget) && !m.score;
                        });
                        
                        if (nextMatch) {
                            const normTeam1 = normalizeTeamName(nextMatch.team1);
                            const isTeam1 = normTeam1 === normTarget;
                            const matchInfo = document.createElement('span');
                            matchInfo.className = 'match-info';
                            matchInfo.textContent = `Next: vs ${isTeam1 ? nextMatch.team2 : nextMatch.team1}`;
                            teamNameContainer.appendChild(matchInfo);
                        }
                    }
                }
                
                li.appendChild(teamNameContainer);

                const teamPts = document.createElement('span');
                teamPts.className = 'team-points';
                teamPts.textContent = `${person.teamPoints[team]}`;
                li.appendChild(teamPts);

                teamList.appendChild(li);
            });

            card.appendChild(teamList);
            grid.appendChild(card);
        });

    } catch (error) {
        console.error('Error initializing app:', error);
        grid.innerHTML = `<div class="loading" style="color: red;">Error loading sweepstake data. Check console.</div>`;
    }
});

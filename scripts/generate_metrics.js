const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const USERNAME = 'bhanu2006-24';

if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN is not defined in .env file');
  process.exit(1);
}

const GRAPHQL_QUERY = `
  query userInfo($login: String!) {
    user(login: $login) {
      name
      login
      createdAt
      followers { totalCount }
      following { totalCount }
      repositories(first: 100, ownerAffiliations: OWNER, isFork: false) {
        totalCount
        nodes {
          name
          stargazers { totalCount }
          forkCount
          languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
            edges {
              size
              node { color name }
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

async function fetchData() {
  try {
    const response = await axios.post(
      'https://api.github.com/graphql',
      { query: GRAPHQL_QUERY, variables: { login: USERNAME } },
      { headers: { Authorization: `bearer ${GITHUB_TOKEN}` } }
    );
    if (response.data.errors) {
      console.error('GraphQL Errors:', response.data.errors);
      process.exit(1);
    }
    return response.data.data.user;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    process.exit(1);
  }
}

function processData(user) {
  const calendar = user.contributionsCollection.contributionCalendar;
  
  // Streak & Calendar Logic
  const days = [];
  calendar.weeks.forEach(week => week.contributionDays.forEach(day => days.push(day)));
  days.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Calculate Streaks
  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];
  const reversedDays = [...days].reverse();
  let started = false;
  for (const day of reversedDays) {
    if (day.date > today) continue;
    if (day.date === today && day.contributionCount === 0) continue;
    if (day.contributionCount > 0) {
      currentStreak++;
      started = true;
    } else if (started) break;
  }

  // Peak Day Logic
  const dayCounts = [0,0,0,0,0,0,0];
  days.forEach(d => dayCounts[d.weekday] += d.contributionCount);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const maxDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
  const peakDay = dayNames[maxDayIndex];

  // Repository Stats
  const repos = user.repositories.nodes;
  const totalStars = repos.reduce((acc, r) => acc + r.stargazers.totalCount, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forkCount, 0);
  
  // Experience
  const createdDate = new Date(user.createdAt);
  const now = new Date();
  const yearsActive = ((now - createdDate) / (1000 * 60 * 60 * 24 * 365)).toFixed(1);

  // Languages
  const languageMap = {};
  let totalBytes = 0;
  repos.forEach((repo) => {
    repo.languages.edges.forEach((edge) => {
      const { name, color } = edge.node;
      totalBytes += edge.size;
      if (!languageMap[name]) languageMap[name] = { size: 0, color };
      languageMap[name].size += edge.size;
    });
  });
  
  const languages = Object.entries(languageMap)
    .sort((a, b) => b[1].size - a[1].size)
    .slice(0, 5) 
    .map(([name, data]) => ({ name, color: data.color, percent: ((data.size / totalBytes) * 100).toFixed(1) }));

  return {
    stats: {
      stars: totalStars,
      forks: totalForks,
      commits: user.contributionsCollection.totalCommitContributions,
      prs: user.contributionsCollection.totalPullRequestContributions,
      issues: user.contributionsCollection.totalIssueContributions,
      totalContribs: calendar.totalContributions,
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      streak: currentStreak,
      repoCount: user.repositories.totalCount,
      peakDay,
      yearsActive: `${yearsActive}y`
    },
    languages
  };
}

// ------ PRO VISUAL THEME ------
const THEME = {
  bg: '#000000',
  cardBg: '#111111',
  textMain: '#FFFFFF',
  textSub: '#888888',
  border: '#222222'
};

function generateVisualDashboard(data) {
  const { stats, languages } = data;
  const width = 800;
  const height = 450; // Increased height for more metrics
  
  const styles = `
    .title { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: 800; font-size: 26px; fill: white; }
    .subtitle { font-family: "Segoe UI", sans-serif; font-weight: 400; font-size: 14px; fill: #888; }
    .card-label { font-family: "Segoe UI", sans-serif; font-weight: 600; font-size: 13px; fill: #888; letter-spacing: 0.5px; text-transform: uppercase; }
    .card-value { font-family: "Segoe UI", sans-serif; font-weight: 700; font-size: 28px; fill: white; }
    .card-sub { font-size: 12px; fill: #555; }
    .small-value { font-size: 16px; fill: #CCC; }
  `;

  // Helper for Bento Cards
  const Card = (x, y, w, h, title, value, sub, icon) => `
    <g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="#111" stroke="#222" />
      <text x="${x+20}" y="${y+30}" class="card-label">${title}</text>
      <text x="${x+20}" y="${y+65}" class="card-value">${value}</text>
      ${sub ? `<text x="${x+20}" y="${y+85}" class="card-sub">${sub}</text>` : ''}
      ${icon ? `<g transform="translate(${x+w-35}, ${y+20})">${icon}</g>` : ''}
    </g>
  `;

  // Icons (Simple Paths)
  const StarIcon = `<path d="M8 .25l1.88 3.82 4.21.61-3.05 2.97.72 4.19L8 12.35l-3.77 1.98.72-4.19L1.91 4.68l4.21-.61L8 .25z" fill="#E3B341"/>`;
  const FireIcon = `<path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z M8 0a8 8 0 0 1 6.5 13.5 8 8 0 1 1-13 0A8 8 0 0 1 8 0z" fill="#E25822"/>`; // Conceptual flame
  const RepoIcon = `<path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 1 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 0 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5v-9zm10.5-1V9h-8c-.356 0-.694.074-1 .208V2.5a1 1 0 0 1 1-1h8zM5 12.25v3.25a.25.25 0 0 0 .4.2l1.35-1.55a.25.25 0 0 1 .4 0l1.35 1.55a.25.25 0 0 0 .4-.2v-3.25a.75.75 0 0 0-1.5 0v1.5l-1.35-1.55a.25.25 0 0 0-.4 0l-1.35 1.55v-1.5a.75.75 0 0 0-1.5 0z" fill="#FFF"/>`;
  const UsersIcon = `<path d="M5.5 10.5A3.5 3.5 0 1 1 5.5 3.5 3.5 3.5 0 0 1 5.5 10.5zm7 0a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm.65 2c1.74 0 3.86.84 5.35 2.5a.75.75 0 0 1-.35 1.25H9.65a.75.75 0 0 1 .35-1.25zm-6.3 0c1.74 0 3.86.84 5.35 2.5a.75.75 0 0 1-.35 1.25H.65A.75.75 0 0 1 .3-15c1.49-1.66 3.61-2.5 5.35-2.5z" fill="#FFF"/>`;
  const ZapIcon = `<path d="M11.25.75a.75.75 0 0 1 0 1.5h-3l1 4.5h3a.75.75 0 0 1 .5 1.3l-7 9a.75.75 0 0 1-1.2-.9l3.4-5.4h-3a.75.75 0 0 1-.6-1.2l4-8a.75.75 0 0 1 .65-.3z" fill="#E3B341"/>`;

  // Language Bar Logic
  let langBar = '';
  let offsetX = 0;
  languages.forEach(l => {
    const w = (l.percent / 100) * 440; // 440px max width for this section
    langBar += `<rect x="${offsetX}" y="0" width="${w}" height="6" rx="3" fill="${l.color}" />`;
    offsetX += w + 4;
  });

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Background -->
      <rect width="${width}" height="${height}" rx="20" fill="black" />
      
      <!-- Header Area -->
      <text x="30" y="45" class="title">Bhanu Saini</text>
      <text x="30" y="65" class="subtitle">Full Stack Developer • Data Analyst</text>
      <text x="${width-30}" y="45" class="card-label" text-anchor="end" fill="#555">Pro Analytics</text>

      <!-- Grid Layout -->
      
      <!-- ROW 1 -->
      <!-- Total Stars -->
      ${Card(30, 90, 230, 110, "Total Stars", stats.stars, "Across all repositories", StarIcon)}
      
      <!-- Streak -->
      ${Card(280, 90, 230, 110, "Current Streak", `${stats.streak} Days`, "Keep the fire burning", FireIcon)}
      
      <!-- Activity Feed (Right Column) -->
      <rect x="530" y="90" width="240" height="330" rx="16" fill="#111" stroke="#222" />
      <text x="550" y="125" class="card-label">Activity Hub</text>
      
      <!-- Activity List Items -->
      <g transform="translate(550, 160)">
        <text class="small-value" y="0">📦 ${stats.commits} Commits</text>
        <rect y="15" width="200" height="2" fill="#222" />
      </g>
      <g transform="translate(550, 210)">
        <text class="small-value" y="0">🔀 ${stats.prs} Pull Requests</text>
        <rect y="15" width="200" height="2" fill="#222" />
      </g>
      <g transform="translate(550, 260)">
        <text class="small-value" y="0">❗ ${stats.issues} Issues</text>
        <rect y="15" width="200" height="2" fill="#222" />
      </g>
       <g transform="translate(550, 310)">
        <text class="small-value" y="0">⚡ ${stats.totalContribs} Total</text>
      </g>

      <!-- ROW 2 -->
      <!-- Community -->
      ${Card(30, 220, 140, 100, "Community", stats.followers, "Followers", UsersIcon)}
      
      <!-- Projects -->
      ${Card(190, 220, 140, 100, "Projects", stats.repoCount, "Repositories", RepoIcon)}
      
      <!-- Peak Productivity -->
      ${Card(350, 220, 160, 100, "Peak Day", stats.peakDay, "Most Active", ZapIcon)}

      <!-- ROW 3 (Bottom) -->
      <!-- Experience & Langs -->
      <rect x="30" y="340" width="480" height="80" rx="16" fill="#111" stroke="#222" />
      
      <!-- Experience Section -->
      <g transform="translate(50, 365)">
         <text class="card-label">Experience</text>
         <text y="35" class="card-value" style="font-size:20px">${stats.yearsActive}</text>
      </g>
      <line x1="160" y1="355" x2="160" y2="405" stroke="#222" />
      
      <!-- Tech Bar Section -->
      <g transform="translate(180, 365)">
         <text class="card-label">Top Technologies</text>
         <g transform="translate(0, 25)">${langBar}</g>
         <text y="45" class="card-sub">${languages.map(l => l.name).join(' • ')}</text>
      </g>
      
      <style>${styles}</style>
    </svg>
  `;
}

async function main() {
  const data = await fetchData();
  const processed = processData(data);
  const visualSVG = generateVisualDashboard(processed);
  
  const outputDir = path.join(__dirname, '../assets/metrics');
  fs.writeFileSync(path.join(outputDir, 'github-visual-stats.svg'), visualSVG);
  console.log('Visual stats generated.');
}

main();

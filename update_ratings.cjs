const fs = require('fs');

const eloData = {
  "Mexico": 1912,
  "South Africa": 1559,
  "South Korea": 1723,
  "Czech Republic": 1680,
  "Canada": 1764,
  "Bosnia and Herzegovina": 1622,
  "Qatar": 1411,
  "Switzerland": 1914,
  "Brazil": 2009,
  "Morocco": 1877,
  "Haiti": 1517,
  "Scotland": 1745,
  "United States": 1781,
  "Paraguay": 1815,
  "Australia": 1800,
  "Turkey": 1852,
  "Germany": 1916,
  "Curacao": 1438,
  "Ivory Coast": 1743,
  "Ecuador": 1902,
  "Netherlands": 1980,
  "Japan": 1910,
  "Sweden": 1742,
  "Tunisia": 1562,
  "Belgium": 1884,
  "Egypt": 1742,
  "Iran": 1764,
  "New Zealand": 1534,
  "Spain": 2144,
  "Cape Verde": 1622,
  "Saudi Arabia": 1596,
  "Uruguay": 1841,
  "France": 2123,
  "Senegal": 1842,
  "Iraq": 1561,
  "Norway": 1918,
  "Argentina": 2148,
  "Algeria": 1785,
  "Austria": 1836,
  "Jordan": 1628,
  "Portugal": 1990,
  "DR Congo": 1712,
  "Uzbekistan": 1631,
  "Colombia": 2004,
  "England": 2038,
  "Croatia": 1905,
  "Ghana": 1575,
  "Panama": 1658
};

// Aliases mapping in Turkish names or whatever used in TEAMS
const nameMapping = {
  "Güney Afrika": "South Africa",
  "Güney Kore": "South Korea",
  "Çekya": "Czech Republic",
  "Kanada": "Canada",
  "Bosna-Hersek": "Bosnia and Herzegovina",
  "Katar": "Qatar",
  "İsviçre": "Switzerland",
  "Brezilya": "Brazil",
  "Fas": "Morocco",
  "Haiti": "Haiti",
  "İskoçya": "Scotland",
  "ABD": "United States",
  "Paraguay": "Paraguay",
  "Avustralya": "Australia",
  "Türkiye": "Turkey",
  "Almanya": "Germany",
  "Curaçao": "Curacao",
  "Fildişi Sahili": "Ivory Coast",
  "Ekvador": "Ecuador",
  "Hollanda": "Netherlands",
  "Japonya": "Japan",
  "İsveç": "Sweden",
  "Tunus": "Tunisia",
  "Belçika": "Belgium",
  "Mısır": "Egypt",
  "İran": "Iran",
  "Yeni Zelanda": "New Zealand",
  "İspanya": "Spain",
  "Yeşil Burun": "Cape Verde",
  "Suudi Arabistan": "Saudi Arabia",
  "Uruguay": "Uruguay",
  "Fransa": "France",
  "Senegal": "Senegal",
  "Irak": "Iraq",
  "Norveç": "Norway",
  "Arjantin": "Argentina",
  "Cezayir": "Algeria",
  "Avusturya": "Austria",
  "Ürdün": "Jordan",
  "Portekiz": "Portugal",
  "Kongo DC": "DR Congo",
  "Özbekistan": "Uzbekistan",
  "Kolombiya": "Colombia",
  "İngiltere": "England",
  "Hırvatistan": "Croatia",
  "Gana": "Ghana",
  "Panama": "Panama",
  "Meksika": "Mexico"
};

let content = fs.readFileSync('src/types.ts', 'utf8');

for (const [trName, enName] of Object.entries(nameMapping)) {
  const elo = eloData[enName];
  if (!elo) {
    console.log("Missing elo for", enName);
    continue;
  }
  
  // Find team block
  const regex = new RegExp(`name:\\s*"${trName}"[\\s\\S]*?rating:\\s*\\{\\s*attack:\\s*\\d+,\\s*midfield:\\s*\\d+,\\s*defense:\\s*\\d+,\\s*overall:\\s*\\d+\\s*\\}`, 'g');
  
  content = content.replace(regex, (match) => {
    const scale = (elo - 1300) / 900; 
    const base = 50 + scale * 45; 
    
    // add some random variation to attack, mid, def
    const attack = Math.min(99, Math.round(base + (Math.random() * 4 - 2)));
    const midfield = Math.min(99, Math.round(base + (Math.random() * 4 - 2)));
    const defense = Math.min(99, Math.round(base + (Math.random() * 4 - 2)));
    
    return match.replace(/rating:\s*\{[^}]*\}/, `rating: { attack: ${attack}, midfield: ${midfield}, defense: ${defense}, overall: ${elo} }`);
  });
}

fs.writeFileSync('src/types.ts', content);
console.log("Ratings updated.");

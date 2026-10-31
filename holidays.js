// Big Day: every holiday the app knows, and how to find its date in any year.
// Dates follow the United States: federal holidays by their legal rule, Easter by the
// Western (Gregorian) church calendar that American churches use.

// Easter Sunday, Gregorian calendar (the "Anonymous Gregorian" / Meeus method).
function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(y, month - 1, day);
}
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
// The nth weekday of a month (dow 0 = Sunday). n = -1 means the last one.
function nthDow(y, m, dow, n) {
  if (n < 0) {
    const last = new Date(y, m + 1, 0);
    return addDays(last, -((last.getDay() - dow + 7) % 7));
  }
  const first = new Date(y, m, 1);
  return new Date(y, m, 1 + ((dow - first.getDay() + 7) % 7) + (n - 1) * 7);
}
const fixed = (m, d) => y => new Date(y, m - 1, d);
// First Sunday of Advent: four Sundays before Christmas.
function advent(y) {
  const xmas = new Date(y, 11, 25);
  return addDays(xmas, -(xmas.getDay() || 7) - 21);
}

// tags: christian, american (national/federal), family (fun family days).
// tone: "party" gets confetti on the day; "calm" days are honoured quietly.
// verse: King James Version (public domain).
const HOLIDAYS = [
  { id: 'christmas', name: 'Christmas', icon: 'tree', theme: 'christmas', tags: ['christian', 'american'], tone: 'party',
    date: fixed(12, 25), song: 'jingle',
    about: 'The day Christians celebrate the birth of Jesus in Bethlehem.',
    verse: ['For unto you is born this day in the city of David a Saviour, which is Christ the Lord.', 'Luke 2:11'],
    fact: 'Christmas became a federal holiday in the United States in 1870.' },
  { id: 'christmas-eve', name: 'Christmas Eve', icon: 'bell', theme: 'night', tags: ['christian', 'american'], tone: 'party',
    date: fixed(12, 24), song: 'wish',
    about: 'The night before Christmas, when many families go to a candlelight church service.',
    verse: ['And she brought forth her firstborn son, and wrapped him in swaddling clothes, and laid him in a manger.', 'Luke 2:7'],
    fact: 'Every Christmas Eve since 1955, the U.S. military has "tracked Santa" for kids. Today NORAD (the "North American Aerospace Defense Command") does it.' },
  { id: 'advent', name: 'First Sunday of Advent', icon: 'candles', theme: 'advent', tags: ['christian'], tone: 'party',
    date: advent,
    about: 'The start of Advent, the four Sundays of waiting and getting ready for Christmas.',
    verse: ['For unto us a child is born, unto us a son is given.', 'Isaiah 9:6'],
    fact: 'Advent comes from a Latin word that means "coming". Many families light one more candle on a wreath each Sunday.' },
  { id: 'st-nicholas', name: 'St. Nicholas Day', icon: 'stocking', theme: 'christmas', tags: ['christian'], tone: 'party',
    date: fixed(12, 6),
    about: 'Remembers Nicholas, a kind bishop who lived about 1,700 years ago and gave gifts in secret.',
    verse: ['It is more blessed to give than to receive.', 'Acts 20:35'],
    fact: 'Saint Nicholas is where the name "Santa Claus" comes from. In some homes kids leave their shoes out the night before for treats.' },
  { id: 'new-years-eve', name: "New Year's Eve", icon: 'partyhat', theme: 'newyear', tags: ['american', 'family'], tone: 'party',
    date: fixed(12, 31),
    about: 'The last night of the year. Lots of families stay up to count down to midnight.',
    fact: 'The ball in Times Square, New York City, has dropped at midnight almost every year since 1907.' },
  { id: 'new-years', name: "New Year's Day", icon: 'fireworks', theme: 'newyear', tags: ['american'], tone: 'party',
    date: fixed(1, 1),
    about: 'The first day of a brand-new year, and a federal holiday.',
    fact: 'The Rose Parade in Pasadena, California, has welcomed the new year since 1890.' },
  { id: 'epiphany', name: 'Epiphany', icon: 'star', theme: 'night', tags: ['christian'], tone: 'party',
    date: fixed(1, 6),
    about: 'Remembers the wise men following the star to find young Jesus. It is the twelfth day after Christmas.',
    verse: ['When they saw the star, they rejoiced with exceeding great joy.', 'Matthew 2:10'],
    fact: 'The "Twelve Days of Christmas" are the days from Christmas up to Epiphany.' },
  { id: 'mlk', name: 'Martin Luther King Jr. Day', icon: 'mic', theme: 'sky', tags: ['american'], tone: 'calm',
    date: y => nthDow(y, 0, 1, 3),
    about: 'Honours Dr. King, a pastor who led the fight for equal rights. Always the third Monday of January.',
    fact: 'Dr. King gave his "I Have a Dream" speech in Washington, D.C., in 1963, in front of about 250,000 people.' },
  { id: 'groundhog', name: 'Groundhog Day', icon: 'groundhog', theme: 'winter', tags: ['family'], tone: 'party',
    date: fixed(2, 2),
    about: 'A groundhog named Punxsutawney Phil "predicts" the weather. If he sees his shadow: six more weeks of winter!',
    fact: 'Punxsutawney, Pennsylvania, has held Groundhog Day since 1887.' },
  { id: 'valentines', name: "Valentine's Day", icon: 'heart', theme: 'love', tags: ['christian', 'family'], tone: 'party',
    date: fixed(2, 14),
    about: 'Named after Saint Valentine. A day to tell the people you love that you love them.',
    verse: ['We love him, because he first loved us.', '1 John 4:19'],
    fact: 'Kids in American schools have traded valentine cards with classmates for over 100 years.' },
  { id: 'presidents', name: "Presidents' Day", icon: 'tophat', theme: 'usa', tags: ['american'], tone: 'party',
    date: y => nthDow(y, 1, 1, 3),
    about: 'Officially "Washington\'s Birthday". Honours George Washington and all U.S. presidents. Third Monday of February.',
    fact: 'George Washington was born on February 22, 1732. Abraham Lincoln was born February 12, 1809.' },
  { id: 'ash-wednesday', name: 'Ash Wednesday', icon: 'ashes', theme: 'lent', tags: ['christian'], tone: 'calm',
    date: y => addDays(easter(y), -46),
    about: 'The first day of Lent, the 40 days (not counting Sundays) of getting ready for Easter.',
    verse: ['Create in me a clean heart, O God; and renew a right spirit within me.', 'Psalm 51:10'],
    fact: 'The ashes are often made by burning the palm branches from last year\'s Palm Sunday.' },
  { id: 'st-patricks', name: "St. Patrick's Day", icon: 'shamrock', theme: 'irish', tags: ['christian', 'family'], tone: 'party',
    date: fixed(3, 17),
    about: 'Remembers Patrick, a missionary who told the people of Ireland about Jesus.',
    fact: 'The story goes that Patrick used the three leaves of a shamrock to explain the Trinity: Father, Son and Holy Spirit.' },
  { id: 'april-fools', name: "April Fools' Day", icon: 'silly', theme: 'silly', tags: ['family'], tone: 'party',
    date: fixed(4, 1),
    about: 'A day for harmless jokes and silly pranks. Be kind!',
    fact: 'Nobody knows for sure how April Fools\' Day started. People have played April jokes for hundreds of years.' },
  { id: 'palm-sunday', name: 'Palm Sunday', icon: 'palm', theme: 'spring', tags: ['christian'], tone: 'party',
    date: y => addDays(easter(y), -7),
    about: 'Remembers Jesus riding into Jerusalem on a donkey while crowds waved palm branches. One week before Easter.',
    verse: ['Hosanna to the Son of David: Blessed is he that cometh in the name of the Lord.', 'Matthew 21:9'],
    fact: 'Palm Sunday begins Holy Week, the most important week of the Christian year.' },
  { id: 'maundy-thursday', name: 'Maundy Thursday', icon: 'chalice', theme: 'lent', tags: ['christian'], tone: 'calm',
    date: y => addDays(easter(y), -3),
    about: 'Remembers the Last Supper, when Jesus shared bread and wine with his disciples and washed their feet.',
    verse: ['A new commandment I give unto you, That ye love one another.', 'John 13:34'],
    fact: '"Maundy" comes from the Latin word for "commandment".' },
  { id: 'good-friday', name: 'Good Friday', icon: 'cross', theme: 'lent', tags: ['christian'], tone: 'calm',
    date: y => addDays(easter(y), -2),
    about: 'The day Jesus died on the cross. Christians call it "good" because of what it means for the world.',
    verse: ['For God so loved the world, that he gave his only begotten Son.', 'John 3:16'],
    fact: 'Hot cross buns, with a cross on top, are a Good Friday tradition in many homes.' },
  { id: 'easter', name: 'Easter', icon: 'sunrise', theme: 'easter', tags: ['christian', 'american'], tone: 'party',
    date: easter,
    about: 'The greatest day of the Christian year: Jesus rose from the dead! Easter moves every year.',
    verse: ['He is not here: for he is risen, as he said.', 'Matthew 28:6'],
    fact: 'Easter is the first Sunday after the first full moon of spring, so it can land anywhere from March 22 to April 25.' },
  { id: 'ascension', name: 'Ascension Day', icon: 'cloud', theme: 'sky', tags: ['christian'], tone: 'party',
    date: y => addDays(easter(y), 39),
    about: 'Forty days after Easter, Jesus went up into heaven while his friends watched.',
    verse: ['While they beheld, he was taken up; and a cloud received him out of their sight.', 'Acts 1:9'],
    fact: 'Ascension Day is always on a Thursday, 40 days after Easter (counting Easter as day one).' },
  { id: 'pentecost', name: 'Pentecost', icon: 'flame', theme: 'pentecost', tags: ['christian'], tone: 'party',
    date: y => addDays(easter(y), 49),
    about: 'The Holy Spirit came to the disciples like tongues of fire. Many call it the birthday of the church.',
    verse: ['And they were all filled with the Holy Ghost.', 'Acts 2:4'],
    fact: 'Pentecost means "fiftieth". It comes on the 50th day of Easter, counting Easter Sunday itself.' },
  { id: 'mothers', name: "Mother's Day", icon: 'tulip', theme: 'love', tags: ['american', 'family'], tone: 'party',
    date: y => nthDow(y, 4, 0, 2),
    about: 'A day to thank Mom. Always the second Sunday in May.',
    verse: ['Her children arise up, and call her blessed.', 'Proverbs 31:28'],
    fact: 'President Woodrow Wilson made Mother\'s Day a national day in 1914.' },
  { id: 'memorial', name: 'Memorial Day', icon: 'poppy', theme: 'usa', tags: ['american'], tone: 'calm',
    date: y => nthDow(y, 4, 1, -1),
    about: 'Remembers the men and women who died serving in the U.S. military. The last Monday in May.',
    verse: ['Greater love hath no man than this, that a man lay down his life for his friends.', 'John 15:13'],
    fact: 'At 3:00 in the afternoon on Memorial Day, Americans are asked to pause for a "National Moment of Remembrance".' },
  { id: 'flag', name: 'Flag Day', icon: 'flag', theme: 'usa', tags: ['american'], tone: 'party',
    date: fixed(6, 14),
    about: 'The birthday of the American flag, chosen on June 14, 1777.',
    fact: 'The flag has 13 stripes for the first 13 colonies and 50 stars for the 50 states.' },
  { id: 'fathers', name: "Father's Day", icon: 'tie', theme: 'dad', tags: ['american', 'family'], tone: 'party',
    date: y => nthDow(y, 5, 0, 3),
    about: 'A day to thank Dad. Always the third Sunday in June.',
    verse: ['Honour thy father and thy mother.', 'Exodus 20:12'],
    fact: 'Father\'s Day became a permanent national holiday in 1972.' },
  { id: 'juneteenth', name: 'Juneteenth', icon: 'freestar', theme: 'usa', tags: ['american'], tone: 'party',
    date: fixed(6, 19),
    about: 'Celebrates June 19, 1865, when the last enslaved people in Texas heard they were free.',
    fact: 'Juneteenth became a federal holiday in 2021, the newest one in the United States.' },
  { id: 'july4', name: 'Independence Day', icon: 'rocket', theme: 'usa', tags: ['american'], tone: 'party',
    date: fixed(7, 4), song: 'yankee',
    about: 'America\'s birthday! The Declaration of Independence was adopted on July 4, 1776.',
    fact: 'John Adams and Thomas Jefferson, two signers of the Declaration, both died on July 4, 1826, exactly 50 years later.' },
  { id: 'labor', name: 'Labor Day', icon: 'hardhat', theme: 'sky', tags: ['american'], tone: 'party',
    date: y => nthDow(y, 8, 1, 1),
    about: 'Honours American workers, and the unofficial end of summer. The first Monday in September.',
    fact: 'Labor Day became a federal holiday in 1894.' },
  { id: 'grandparents', name: 'Grandparents Day', icon: 'glasses', theme: 'autumn', tags: ['american', 'family'], tone: 'party',
    date: y => addDays(nthDow(y, 8, 1, 1), 6),
    about: 'A day to love on Grandma and Grandpa. The first Sunday after Labor Day.',
    verse: ['Children\'s children are the crown of old men.', 'Proverbs 17:6'],
    fact: 'President Jimmy Carter signed National Grandparents Day into law in 1978.' },
  { id: 'columbus', name: 'Columbus Day', icon: 'ship', theme: 'sea', tags: ['american'], tone: 'party',
    date: y => nthDow(y, 9, 1, 2),
    about: 'Remembers Christopher Columbus reaching the Americas in 1492. The second Monday in October.',
    fact: 'Columbus sailed with three ships: the Niña, the Pinta and the Santa María.' },
  { id: 'halloween', name: 'Halloween', icon: 'pumpkin', theme: 'halloween', tags: ['family'], tone: 'party',
    date: fixed(10, 31),
    about: 'Costumes, pumpkins and trick-or-treating! The name means "All Hallows\' Eve", the night before All Saints\' Day.',
    fact: 'Americans buy around 600 million pounds of Halloween candy every year.' },
  { id: 'all-saints', name: "All Saints' Day", icon: 'crown', theme: 'night', tags: ['christian'], tone: 'party',
    date: fixed(11, 1),
    about: 'Remembers all the faithful Christians who have gone before us.',
    verse: ['Seeing we also are compassed about with so great a cloud of witnesses.', 'Hebrews 12:1'],
    fact: 'All Saints\' Day has been kept on November 1 for more than 1,000 years.' },
  { id: 'veterans', name: 'Veterans Day', icon: 'medal', theme: 'usa', tags: ['american'], tone: 'calm',
    date: fixed(11, 11),
    about: 'Thanks everyone who has served in the U.S. military.',
    fact: 'It falls on November 11 because World War I ended at the 11th hour of the 11th day of the 11th month, 1918.' },
  { id: 'thanksgiving', name: 'Thanksgiving', icon: 'turkey', theme: 'autumn', tags: ['american', 'christian'], tone: 'party',
    date: y => nthDow(y, 10, 4, 4),
    about: 'A day to thank God for all our blessings, with family and a big feast. The fourth Thursday in November.',
    verse: ['O give thanks unto the LORD, for he is good: for his mercy endureth for ever.', 'Psalm 107:1'],
    fact: 'Abraham Lincoln made Thanksgiving a national holiday in 1863.' },
];

// Starting points for a custom countdown.
const TEMPLATES = [
  { name: 'My Birthday', icon: 'cake', theme: 'party', yearly: true, birthday: true },
  { name: 'Wedding', icon: 'rings', theme: 'love', yearly: false },
  { name: 'Vacation', icon: 'plane', theme: 'sea', yearly: false },
  { name: 'Last Day of School', icon: 'backpack', theme: 'summer', yearly: false },
  { name: 'First Day of School', icon: 'bus', theme: 'autumn', yearly: false },
  { name: 'New Baby', icon: 'baby', theme: 'spring', yearly: false },
  { name: 'Big Game', icon: 'ball', theme: 'sky', yearly: false },
  { name: 'Anniversary', icon: 'heart', theme: 'love', yearly: true },
];

window.BD_DATA = { HOLIDAYS, TEMPLATES, easter };

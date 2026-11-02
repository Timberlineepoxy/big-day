// Big Day: what is behind the surprise door each day. One door a day, taking turns:
// joke, challenge, fact, verse. Verses are King James Version (public domain).
(() => {
const JOKES = [
  ['Why did the cookie go to the doctor?', 'Because it felt crummy.'],
  ['What do you call a sleeping dinosaur?', 'A dino-snore!'],
  ['Why can\'t a bicycle stand up by itself?', 'It\'s two tired.'],
  ['What do you call a bear with no teeth?', 'A gummy bear!'],
  ['Why did the math book look so sad?', 'It had too many problems.'],
  ['What did one wall say to the other wall?', 'I\'ll meet you at the corner.'],
  ['Why do cows wear bells?', 'Because their horns don\'t work.'],
  ['What has ears but cannot hear?', 'A cornfield.'],
  ['What do you call a fish with no eyes?', 'A fsh.'],
  ['Why did the scarecrow win an award?', 'He was outstanding in his field.'],
  ['What do you call cheese that isn\'t yours?', 'Nacho cheese!'],
  ['How do you make an octopus laugh?', 'With ten-tickles.'],
  ['What did the ocean say to the beach?', 'Nothing. It just waved.'],
  ['Why are ghosts bad at telling lies?', 'You can see right through them.'],
  ['What kind of tree fits in your hand?', 'A palm tree.'],
  ['What do elves learn in school?', 'The elf-abet.'],
  ['What did one snowman say to the other snowman?', 'Do you smell carrots?'],
  ['Why did the turkey join the band?', 'Because it had the drumsticks.'],
  ['What is a pumpkin\'s favorite sport?', 'Squash.'],
  ['Why was the broom late?', 'It over-swept.'],
  ['What do you call a dog that does magic tricks?', 'A labracadabrador.'],
  ['How does a penguin build its house?', 'Igloos it together.'],
  ['Why did the banana go to the doctor?', 'It wasn\'t peeling well.'],
  ['What do you get when you cross a snowman and a vampire?', 'Frostbite.'],
  ['What did the zero say to the eight?', 'Nice belt!'],
  ['Why couldn\'t the pony sing?', 'It was a little hoarse.'],
  ['What do you call a train full of bubblegum?', 'A chew-chew train.'],
  ['Where do sheep get their hair cut?', 'At the baa-baa shop.'],
  ['What is orange and sounds like a parrot?', 'A carrot.'],
  ['Why did the kid bring a ladder to school?', 'To go to high school.'],
];

const CHALLENGES = [
  'Give someone in your family a big hug.',
  'Make a card for someone you love.',
  'Say three things you are thankful for.',
  'Draw a picture of your next big day.',
  'Do 10 jumping jacks.',
  'Tell someone a joke and make them laugh.',
  'Help clean up one room without being asked.',
  'Sing your favorite song out loud.',
  'Write a thank-you note to a teacher.',
  'Read a book with someone.',
  'Say a prayer for a friend.',
  'Do something kind for a neighbor.',
  'Hop on one foot while you count to 20.',
  'Build a fort out of blankets and pillows.',
  'Find five things that are your favorite color.',
  'Call or video chat a grandparent.',
  'Make your bed super neat.',
  'Try a food you have never tried before.',
  'Dance to one whole song.',
  'Learn how to say "hello" in a new language.',
  'Give three people a compliment.',
  'Count how many windows are in your house.',
  'Draw your family as superheroes.',
  'Help make dinner tonight.',
  'With a grown-up, pick up 5 pieces of trash outside.',
  'Water a plant, or go outside and find shapes in the clouds.',
  'Make up a secret handshake with someone.',
  'Tell someone why they are special.',
  'Have a no-screens hour and play a game together.',
  'Write down your three biggest dreams.',
];

const FACTS = [
  'An octopus has three hearts.',
  'Sealed honey can stay good to eat for thousands of years.',
  'A group of flamingos is called a "flamboyance".',
  'Butterflies taste things with their feet.',
  'Sea otters hold hands while they sleep so they don\'t float away from each other.',
  'A day on Venus is longer than a whole year on Venus.',
  'Bananas are berries, but strawberries are not!',
  'The Statue of Liberty was a gift to the United States from France.',
  'Your heart beats about 100,000 times every day.',
  'Hummingbirds can fly backwards.',
  'Grown-up elephants can\'t jump.',
  'The blue whale is the biggest animal that has ever lived, even bigger than the dinosaurs.',
  'Sunlight takes about 8 minutes to reach Earth.',
  'A bolt of lightning is hotter than the surface of the Sun.',
  'There are more trees on Earth than stars in our galaxy, the Milky Way.',
  'Penguins can\'t fly, but they are super fast swimmers.',
  'A giraffe has seven bones in its neck. So do you!',
  'An ostrich\'s eye is bigger than its brain.',
  'Koalas can sleep up to 20 hours a day.',
  'The astronauts\' footprints on the Moon are still there, because there is no wind to blow them away.',
  'The teddy bear is named after President Theodore "Teddy" Roosevelt.',
  'Abraham Lincoln is in the National Wrestling Hall of Fame.',
  'George Washington is the only president who never lived in the White House.',
  'Peanuts are not really nuts. They grow underground and are related to beans.',
  'A shrimp\'s heart is in its head.',
  'Every dog\'s nose print is different, like your fingerprints.',
  'Saturn is so light for its size that it would float in a giant bathtub of water.',
  'Sea stars (starfish) don\'t have a brain.',
  'Polar bears have black skin under their white fur.',
  'Cats sleep about 12 to 16 hours a day.',
];

const VERSES = [
  ['This is the day which the LORD hath made; we will rejoice and be glad in it.', 'Psalm 118:24'],
  ['I can do all things through Christ which strengtheneth me.', 'Philippians 4:13'],
  ['And be ye kind one to another, tenderhearted, forgiving one another, even as God for Christ\'s sake hath forgiven you.', 'Ephesians 4:32'],
  ['Children, obey your parents in the Lord: for this is right.', 'Ephesians 6:1'],
  ['The LORD is my shepherd; I shall not want.', 'Psalm 23:1'],
  ['Trust in the LORD with all thine heart; and lean not unto thine own understanding.', 'Proverbs 3:5'],
  ['For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.', 'John 3:16'],
  ['Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.', 'Joshua 1:9'],
  ['O give thanks unto the LORD; for he is good: for his mercy endureth for ever.', 'Psalm 136:1'],
  ['Thy word is a lamp unto my feet, and a light unto my path.', 'Psalm 119:105'],
  ['A merry heart doeth good like a medicine.', 'Proverbs 17:22'],
  ['Let your light so shine before men, that they may see your good works, and glorify your Father which is in heaven.', 'Matthew 5:16'],
  ['Suffer little children, and forbid them not, to come unto me: for of such is the kingdom of heaven.', 'Matthew 19:14'],
  ['Rejoice in the Lord alway: and again I say, Rejoice.', 'Philippians 4:4'],
  ['In the beginning God created the heaven and the earth.', 'Genesis 1:1'],
  ['And God saw every thing that he had made, and, behold, it was very good.', 'Genesis 1:31'],
  ['A new commandment I give unto you, That ye love one another; as I have loved you, that ye also love one another.', 'John 13:34'],
  ['Every good gift and every perfect gift is from above.', 'James 1:17'],
  ['Make a joyful noise unto the LORD, all ye lands.', 'Psalm 100:1'],
  ['Give, and it shall be given unto you.', 'Luke 6:38'],
  ['The LORD bless thee, and keep thee.', 'Numbers 6:24'],
  ['I will praise thee; for I am fearfully and wonderfully made.', 'Psalm 139:14'],
  ['Casting all your care upon him; for he careth for you.', '1 Peter 5:7'],
  ['What time I am afraid, I will trust in thee.', 'Psalm 56:3'],
  ['Be still, and know that I am God.', 'Psalm 46:10'],
  ['And whatsoever ye do, do it heartily, as to the Lord.', 'Colossians 3:23'],
  ['Jesus Christ the same yesterday, and to day, and for ever.', 'Hebrews 13:8'],
  ['Pray without ceasing.', '1 Thessalonians 5:17'],
  ['In every thing give thanks.', '1 Thessalonians 5:18'],
  ['God is love.', '1 John 4:8'],
];

const TYPES = ['joke', 'challenge', 'fact', 'verse'];
const POOLS = { joke: JOKES, challenge: CHALLENGES, fact: FACTS, verse: VERSES };
// Day n of the app's calendar (n = days since January 1, 2026). Each kind of surprise steps
// 7 places through its list of 30, so nothing repeats for 120 days.
function surpriseFor(n) {
  const type = TYPES[((n % 4) + 4) % 4], pool = POOLS[type];
  const k = Math.floor(n / 4), item = pool[((k * 7) % pool.length + pool.length) % pool.length];
  if (type === 'joke') return { type, text: item[0], answer: item[1] };
  if (type === 'verse') return { type, text: item[0], ref: item[1] };
  return { type, text: item };
}

window.BD_SURPRISE = { surpriseFor };
})();

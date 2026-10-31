# Rebuilds ../music.js from credits.json (made when the songs were downloaded from Wikimedia Commons).
import json, os
here = os.path.dirname(os.path.abspath(__file__))
m = json.load(open(os.path.join(here, 'credits.json'), encoding='utf-8'))
NAMES = {
    'jingle-bells': 'Jingle Bells', 'deck-the-halls': 'Deck the Halls', 'joy-to-the-world': 'Joy to the World',
    'we-wish-you': 'We Wish You a Merry Christmas', 'up-on-the-housetop': 'Up on the Housetop',
    'hark-the-herald': 'Hark! The Herald Angels Sing', 'silent-night': 'Silent Night', 'o-little-town': 'O Little Town of Bethlehem',
    'midnight-clear': 'It Came Upon the Midnight Clear', 'o-holy-night': 'O Holy Night', 'we-three-kings': 'We Three Kings',
    'angels-we-have-heard': 'Angels We Have Heard on High', 'o-come-emmanuel': 'O Come, O Come, Emmanuel',
    'o-come-all-ye-faithful': 'I Saw Three Ships / O Come, All Ye Faithful', 'auld-lang-syne': 'Auld Lang Syne',
    'auld-lang-syne-2': 'Auld Lang Syne', 'stars-and-stripes': 'The Stars and Stripes Forever', 'yankee-doodle': 'Yankee Doodle',
    'america-the-beautiful': 'America the Beautiful', 'my-country-tis': "My Country, 'Tis of Thee",
    'washington-post': 'The Washington Post March', 'battle-hymn': 'Battle Hymn of the Republic', 'hail-to-the-chief': 'Hail to the Chief',
    'taps': 'Taps', 'amazing-grace-band': 'Amazing Grace', 'amazing-grace-strings': 'Amazing Grace (strings)',
    'amazing-grace-pipes': 'Amazing Grace (bagpipes)', 'amazing-grace-fling': 'Amazing Grace (pipe band)',
    'irish-washerwoman': 'The Irish Washerwoman', 'simple-gifts': 'Simple Gifts', 'morning-mood': 'Morning Mood',
    'jesus-christ-is-risen': 'Jesus Christ Is Risen Today', 'crown-him': 'Crown Him with Many Crowns', 'danse-macabre': 'Danse Macabre',
    'mountain-king': 'In the Hall of the Mountain King', 'over-the-river': 'Over the River and Through the Wood',
    'happy-birthday': 'Happy Birthday to You',
}
def by(v):
    f, a = v['file'], v['artist']
    if 'Air Force' in f or 'USAFB' in f: return 'United States Air Force Band'
    if 'Marine Band' in f: return 'United States Marine Band'
    if 'Army Band' in f: return 'United States Army Band'
    if 'Prince' in f: return "Prince's Orchestra"
    if 'Philadelphia' in a: return 'Philadelphia Orchestra, Leopold Stokowski'
    if 'Musopen' in a: return 'Musopen Symphony Orchestra'
    return a or 'Unknown'
tracks = {k: dict(t=NAMES[k], by=by(v), lic=v['license'], page=v['page']) for k, v in m.items()}
src = open(os.path.join(here, '..', 'music.js'), encoding='utf-8').read()
start, end = src.index('const TRACKS = '), src.index('};\n', src.index('const TRACKS = ')) + 3
src = src[:start] + 'const TRACKS = ' + json.dumps(tracks, indent=1, ensure_ascii=False) + ';\n' + src[end:]
open(os.path.join(here, '..', 'music.js'), 'w', encoding='utf-8').write(src)
print(len(tracks), 'tracks')

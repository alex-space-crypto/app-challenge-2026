export const JOCO_MISSION =
  'The mission of the Johnston County Board of Commissioners is to provide visionary leadership and strategic guidance that promotes effective and efficient County government that seeks to enhance the quality of life for the present and future generations of the people of Johnston County in a fiscally responsible manner.';

export const JOCO_TAGLINE = 'Thrive JoCo 13 — where habits meet community.';

export interface CoreValue {
  icon: string;
  title: string;
  blurb: string;
}

export const CORE_VALUES: CoreValue[] = [
  {
    icon: '🌱',
    title: 'Stewardship',
    blurb: 'Be good stewards of our natural environment — from the Neuse River to our farmlands and greenways.',
  },
  {
    icon: '🤝',
    title: 'Partnership',
    blurb: 'Work cooperatively with neighbors, schools, and local government for the good of the county.',
  },
  {
    icon: '⚖️',
    title: 'Integrity',
    blurb: 'Serve with honesty and integrity. Every verified habit log builds real, earned trust.',
  },
  {
    icon: '🎯',
    title: 'Excellence',
    blurb: 'Pursue continual learning and the highest level of excellence in all we do.',
  },
  {
    icon: '🏛️',
    title: 'Heritage',
    blurb: 'Preserve and celebrate our county\u2019s cultural, agricultural, and community heritage.',
  },
  {
    icon: '💬',
    title: 'Communication',
    blurb: 'Value open and honest communication \u2014 share wins, encourage neighbors, stay connected.',
  },
];

export interface LocalPlace {
  name: string;
  type: string;
  blurb: string;
  url: string;
}

export const LOCAL_PLACES: LocalPlace[] = [
  { name: 'Neuse River Greenway', type: 'Trail', blurb: '33-mile scenic trail along the Neuse River \u2014 walk, run, or bike.', url: 'https://www.triangletrails.org/maps/johnston-county-greenways/' },
  { name: 'Clayton River Walk', type: 'Greenway', blurb: 'Boardwalk along the Neuse in downtown Clayton.', url: 'https://www.townofclaytonnc.org/578/Clayton-Community-Center' },
  { name: 'Buffalo Creek Greenway', type: 'Trail', blurb: 'Greenway trail for walking and biking near Wendell Falls.', url: 'https://www.triangletrails.org/maps/johnston-county-greenways/' },
  { name: 'Raven Rock State Park', type: 'Park', blurb: 'Hike Raven Rock Loop with views of the Cape Fear River.', url: 'https://www.ncparks.gov/raven-rock-state-park' },
  { name: 'Howell Woods Environmental Learning Center', type: 'Nature', blurb: '25+ miles of trails through managed forest and wetlands in Four Oaks.', url: 'https://www.johnstoncc.edu/howell-woods/' },
  { name: 'Clemmons Educational State Forest', type: 'Nature', blurb: 'Educational state forest with trails, programs, and outdoor learning near Clayton.', url: 'https://www.ncagr.gov/divisions/nc-forest-service/state-forests/educational-state-forests' },
  { name: 'Bentonville Battlefield State Historic Site', type: 'Historic', blurb: 'Largest Civil War battlefield in NC \u2014 trails and history near Four Oaks.', url: 'https://historicsites.nc.gov/all-sites/bentonville-battlefield' },
  { name: 'Public Library of Johnston County & Smithfield', type: 'Library', blurb: 'Main county library on E Market St in Smithfield.', url: 'https://www.pljcs.org' },
  { name: 'Selma Public Library', type: 'Library', blurb: 'Borrow books and join reading events in downtown Selma.', url: 'https://www.pljcs.org/selma' },
  { name: 'Hocutt-Ellington Library', type: 'Library', blurb: 'Clayton\u2019s historic library \u2014 books, events, and community.', url: 'https://www.pljcs.org/clayton' },
  { name: 'Benson Library', type: 'Library', blurb: 'Benson branch of the county library system on E Main St.', url: 'https://www.pljcs.org/benson' },
  { name: 'James Bryan Creech Library', type: 'Library', blurb: 'Four Oaks community library on W Hatcher St.', url: 'https://www.pljcs.org/four-oaks' },
  { name: 'Kenly Library', type: 'Library', blurb: 'Kenly branch of the county library system on N Railroad St.', url: 'https://www.pljcs.org/kenly' },
  { name: 'Clayton Community Center', type: 'Community', blurb: 'Programs, events, and gatherings on Amelia Church Rd.', url: 'https://www.townofclaytonnc.org/578/Clayton-Community-Center' },
  { name: 'Community & Senior Services of Johnston County', type: 'Service', blurb: 'Meals and transportation for seniors \u2014 volunteer in Smithfield & Kenly.', url: 'https://www.cssjohnston.org' },
  { name: 'Saint Ann Food Pantry', type: 'Service', blurb: 'Serving the hungry of Johnston County \u2014 volunteer Tue\u2013Fri mornings.', url: 'https://www.saintannchurch.org/ministries/food-pantry' },
  { name: 'Ava Gardner Museum', type: 'Museum', blurb: 'Smithfield\u2019s tribute to Hollywood legend Ava Gardner.', url: 'https://www.johnstoncountync.org/ava-gardner/' },
  { name: 'Benson Museum of Local History', type: 'Museum', blurb: 'Honors railroad, farming, and family history of the area.', url: 'https://www.townofbenson.com/2209/Museum' },
  { name: 'Johnston County Animal Shelter', type: 'Service', blurb: 'Walk dogs, socialize cats, or help with adoptions near Smithfield.', url: 'https://www.johnstonnc.gov/content.cfm?id=102' },
  { name: 'Johnston County Convenience Center', type: 'Recycling', blurb: 'Drop off recyclables on Landfill Rd, Smithfield.', url: 'https://www.johnstonnc.gov/solidwaste/content.cfm?pageid=8' },
  { name: 'Smithfield Farmers Market', type: 'Market', blurb: 'Fresh local produce and goods in downtown Smithfield.', url: 'https://www.johnstoncountync.org/farm-markets-and-stands' },
];

export interface CommunityResource {
  icon: string;
  title: string;
  desc: string;
  location: string;
  url: string;
}

export const COMMUNITY_RESOURCES: CommunityResource[] = [
  {
    icon: '🏛️',
    title: 'Johnston County Board of Commissioners',
    desc: 'Visionary leadership enhancing quality of life for all residents.',
    location: 'Smithfield, NC',
    url: 'https://www.johnstonnc.gov',
  },
  {
    icon: '📚',
    title: 'Johnston County Public Schools',
    desc: '50 schools serving a growing, vibrant community with high-quality education.',
    location: 'Countywide',
    url: 'https://www.johnston.k12.nc.us',
  },
  {
    icon: '🤝',
    title: 'Serve the Need in Johnston County',
    desc: 'Restoring lives, restoring families, and restoring communities.',
    location: 'Clayton, NC',
    url: 'https://www.servetheneedjc.org',
  },
  {
    icon: '👶',
    title: 'Partnership for Children of Johnston County',
    desc: 'Thriving children, nurturing adults, flourishing communities.',
    location: 'Countywide',
    url: 'https://pfcjoco.org',
  },
  {
    icon: '🎭',
    title: 'Ava Gardner Museum',
    desc: 'Preserving Johnston County\u2019s cultural heritage in downtown Smithfield.',
    location: 'Smithfield, NC',
    url: 'https://www.johnstoncountync.org/ava-gardner/',
  },
  {
    icon: '🌾',
    title: 'Johnston County Agritourism',
    desc: 'Farm markets, U-pick seasons, and on-farm fun across the county.',
    location: 'Countywide',
    url: 'https://www.johnstoncountync.org/things-to-do/agritourism/',
  },
  {
    icon: '🍲',
    title: 'Saint Ann Food Pantry',
    desc: 'Serving the hungry of Johnston County \u2014 volunteer Tue\u2013Fri mornings.',
    location: 'Smithfield, NC',
    url: 'https://www.saintannchurch.org/ministries/food-pantry',
  },
  {
    icon: '🧓',
    title: 'Community & Senior Services of Johnston County',
    desc: 'Home-delivered meals and transportation for seniors. Volunteers needed in Kenly & Smithfield.',
    location: 'Smithfield, NC',
    url: 'https://www.cssjohnston.org',
  },
  {
    icon: '🐕',
    title: 'Johnston County Animal Shelter',
    desc: 'Walk dogs, socialize cats, or help with adoptions.',
    location: 'Smithfield, NC',
    url: 'https://www.johnstonnc.gov/content.cfm?id=102',
  },
  {
    icon: '🌲',
    title: 'Howell Woods Environmental Learning Center',
    desc: '25+ miles of trails, bird watching, and outdoor education in Four Oaks.',
    location: 'Four Oaks, NC',
    url: 'https://www.johnstoncc.edu/howell-woods/',
  },
];

export const JOCO_TOWNS = [
  'Smithfield', 'Clayton', 'Selma', 'Benson', 'Kenly',
  'Princeton', 'Four Oaks', 'Pine Level', 'Micro',
  'Archer Lodge', 'Wilson\'s Mills',
];

export interface TopicLocalPlace {
  name: string;
  url: string;
}

export const TOPIC_LOCAL_PLACES: Record<string, TopicLocalPlace[]> = {
  t1: [
    { name: 'Howell Woods Environmental Learning Center', url: 'https://www.johnstoncc.edu/howell-woods/' },
    { name: 'Johnston County Convenience Center (Recycling)', url: 'https://www.johnstonnc.gov/content.cfm?id=14' },
    { name: 'Bentonville Battlefield State Historic Site', url: 'https://www.ncdcr.gov/about/history/division-historical-resources/nc-state-historic-sites/bentonville-battlefield' },
    { name: 'Clemmons Educational State Forest', url: 'https://www.ncforestservice.gov/Regions/clemmons.htm' },
    { name: 'Johnston County Parks & Recreation', url: 'https://www.johnstonnc.gov/parks/' },
  ],
  t2: [
    { name: 'Public Library of Johnston County & Smithfield', url: 'https://www.pljcs.org' },
    { name: 'Selma Public Library', url: 'https://www.pljcs.org/selma' },
    { name: 'Hocutt-Ellington Memorial Library (Clayton)', url: 'https://www.pljcs.org/clayton' },
    { name: 'Benson Library', url: 'https://www.pljcs.org/benson' },
    { name: 'James Bryan Creech Library (Four Oaks)', url: 'https://www.pljcs.org/four-oaks' },
    { name: 'Kenly Library', url: 'https://www.pljcs.org/kenly' },
    { name: 'Johnston Community College Library', url: 'https://www.johnstoncc.edu/library/' },
  ],
  t3: [
    { name: 'Smithfield Farmers Market', url: 'https://www.johnstoncountync.org/things-to-do/agritourism/farms-markets-produce/' },
    { name: 'Johnston County Agritourism', url: 'https://www.johnstoncountync.org/things-to-do/agritourism/' },
    { name: 'Johnston County Parks (Playgrounds)', url: 'https://www.johnstonnc.gov/parks/PlaygroundParks.cfm' },
    { name: 'Town of Clayton Parks & Rec', url: 'https://www.townofclayton.org/parksrec/' },
  ],
  t4: [
    { name: 'Neuse River Greenway Trail', url: 'https://www.triangletrails.org/maps/johnston-county-greenways/' },
    { name: 'Clayton River Walk', url: 'https://www.townofclayton.org/parksrec/' },
    { name: 'Buffalo Creek Greenway', url: 'https://www.triangletrails.org/maps/johnston-county-greenways/' },
    { name: 'Raven Rock State Park', url: 'https://www.ncparks.gov/raven-rock-state-park' },
    { name: 'Howell Woods Trails (Four Oaks)', url: 'https://www.johnstoncc.edu/howell-woods/' },
    { name: 'East Clayton Community Park (Disc Golf)', url: 'https://www.johnstonnc.gov/parks/recloc.cfm' },
    { name: 'All Johnston County Parks', url: 'https://www.johnstonnc.com/parks/parksall.cfm' },
    { name: 'JoCo Bike Routes', url: 'https://www.johnstoncountync.org/things-to-do/outdoors/bike-routes/' },
    { name: 'Mountains to Sea Trail (Johnston County)', url: 'https://www.ncmst.org' },
  ],
  t5: [
    { name: 'Johnston County Public Utilities (Water)', url: 'https://www.johnstonnc.gov/content.cfm?id=15' },
    { name: 'Johnston County Health & Human Services', url: 'https://www.johnstonnc.gov/health/' },
  ],
  t6: [
    { name: 'Serve the Need in Johnston County', url: 'https://www.servetheneedjc.org' },
    { name: 'Community & Senior Services of Johnston County', url: 'https://www.cssjohnston.org' },
    { name: 'Saint Ann Food Pantry (Smithfield)', url: 'https://www.saintannchurch.org/ministries/food-pantry' },
    { name: 'Food Bank of Central & Eastern NC', url: 'https://foodbankcenc.org' },
    { name: 'Johnston County Food Banks Directory', url: 'https://www.johnstonnc.gov/dss/content.cfm?pageid=fbjc' },
    { name: 'Johnston County Animal Shelter', url: 'https://www.johnstonnc.gov/content.cfm?id=102' },
    { name: 'Clayton Community Center', url: 'https://www.townofclayton.org/parksrec/' },
    { name: 'Ava Gardner Museum (Volunteer)', url: 'https://www.johnstoncountync.org/ava-gardner/' },
    { name: 'Partnership for Children of Johnston County', url: 'https://pfcjoco.org' },
  ],
  t7: [
    { name: 'Clayton Farm & Community Market', url: 'https://www.localharvest.org/clayton-farm-and-community-market-M34957' },
    { name: 'Smithfield Farmers Market', url: 'https://www.johnstoncountync.org/farm-markets-and-stands' },
    { name: 'Johnston County Produce Market', url: 'https://www.johnstoncountync.org/farm-markets-and-stands' },
    { name: 'Manning\'s Restaurant (Smithfield)', url: 'https://www.tripadvisor.com/Restaurants-g17191914-Johnston_County_North_Carolina.html' },
    { name: 'Downtown Dining (Clayton)', url: 'https://www.johnstoncountync.org/restaurants/downtown-dining' },
    { name: 'Collective Crop (Farm-to-Table, Smithfield)', url: 'https://collectivecrop.com/farm-to-table-smithfield-north-carolina' },
    { name: 'Deep River Brewing Company (Clayton)', url: 'https://deepriverbrewing.com' },
    { name: 'Aaktun Coffee + Bar (Clayton)', url: 'https://aaktun.info' },
    { name: 'Johnston County Agritourism & Farms', url: 'https://www.johnstoncountync.org/things-to-do/agritourism/' },
    { name: 'Community & Senior Services Dining Centers', url: 'https://www.cssjohnston.org/dining-centers' },
  ],
};
